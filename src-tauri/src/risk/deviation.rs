use std::collections::HashMap;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use crate::discovery::AssetType;
use crate::fingerprint::{AssetFeatures, Baseline, BaselineStats, BaselineManager, FeatureExtractor};
use crate::events::EnrichedEvent;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FeatureDeviation {
    pub feature_name: String,
    pub current_value: f64,
    pub baseline_mean: f64,
    pub baseline_stddev: f64,
    pub z_score: f64,
    pub severity: AnomalySeverity,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub enum AnomalySeverity {
    None = 0,
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4,
}

impl AnomalySeverity {
    pub fn from_z_score(z: f64) -> Self {
        let a = z.abs();
        if a >= 4.0 { AnomalySeverity::Critical }
        else if a >= 3.0 { AnomalySeverity::High }
        else if a >= 2.0 { AnomalySeverity::Medium }
        else if a >= 1.5 { AnomalySeverity::Low }
        else { AnomalySeverity::None }
    }

    pub fn label(&self) -> &'static str {
        match self {
            AnomalySeverity::None => "Normal",
            AnomalySeverity::Low => "Low",
            AnomalySeverity::Medium => "Medium",
            AnomalySeverity::High => "High",
            AnomalySeverity::Critical => "Critical",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssetAnomaly {
    pub asset_id: String,
    pub asset_type: AssetType,
    pub display_name: String,
    pub overall_score: f64,
    pub max_severity: AnomalySeverity,
    pub deviations: Vec<FeatureDeviation>,
    pub detected_at: DateTime<Utc>,
    pub window_start: DateTime<Utc>,
    pub window_end: DateTime<Utc>,
    pub event_count: u64,
}

pub struct AnomalyDetector {
    pub z_threshold: f64,
    pub min_samples: u64,
}

impl AnomalyDetector {
    pub fn new() -> Self {
        Self {
            z_threshold: 2.0,
            min_samples: 3,
        }
    }

    pub fn with_threshold(z_threshold: f64) -> Self {
        Self { z_threshold, min_samples: 3 }
    }

    pub fn deviation_for_feature(
        &self,
        feature_name: &str,
        current_value: f64,
        baseline: Option<&BaselineStats>,
    ) -> Option<FeatureDeviation> {
        let bl = baseline?;
        if bl.sample_count < self.min_samples {
            return None;
        }
        let z_score = bl.z_score(current_value);
        let severity = AnomalySeverity::from_z_score(z_score);
        Some(FeatureDeviation {
            feature_name: feature_name.to_string(),
            current_value,
            baseline_mean: bl.mean,
            baseline_stddev: bl.stddev,
            z_score,
            severity,
        })
    }

    pub fn detect_for_asset(
        &self,
        features: &AssetFeatures,
        baseline: Option<&Baseline>,
    ) -> Option<AssetAnomaly> {
        let mut deviations = Vec::new();
        let bl_stats = baseline.map(|b| &b.stats);

        let feature_map: [(&str, f64); 8] = [
            ("event_count", features.event_count as f64),
            ("connection_rate", features.connection_rate),
            ("unique_destinations", features.unique_destinations as f64),
            ("unique_ports", features.unique_ports as f64),
            ("process_cpu_avg", features.process_cpu_avg),
            ("process_cpu_max", features.process_cpu_max),
            ("process_mem_avg", features.process_mem_avg),
            ("process_mem_max", features.process_mem_max as f64),
        ];

        for (name, value) in feature_map.iter() {
            let stat = bl_stats.and_then(|s| s.get(*name));
            if let Some(d) = self.deviation_for_feature(name, *value, stat) {
                if d.severity != AnomalySeverity::None {
                    deviations.push(d);
                }
            }
        }

        if deviations.is_empty() {
            return None;
        }

        let max_severity = deviations.iter()
            .map(|d| d.severity)
            .max()
            .unwrap_or(AnomalySeverity::None);

        let overall_score = deviations.iter()
            .map(|d| d.z_score.abs())
            .sum::<f64>()
            .sqrt();

        let display_name = make_display_name(&features.asset_id, features.asset_type);

        Some(AssetAnomaly {
            asset_id: features.asset_id.clone(),
            asset_type: features.asset_type,
            display_name,
            overall_score,
            max_severity,
            deviations,
            detected_at: Utc::now(),
            window_start: features.window_start,
            window_end: features.window_end,
            event_count: features.event_count,
        })
    }

    pub fn detect_all(
        &self,
        features: &HashMap<String, AssetFeatures>,
        baselines: &HashMap<String, Baseline>,
    ) -> Vec<AssetAnomaly> {
        let mut results = Vec::new();
        for (_id, f) in features {
            if let Some(anomaly) = self.detect_for_asset(f, baselines.get(&f.asset_id)) {
                results.push(anomaly);
            }
        }
        results.sort_by(|a, b| {
            b.max_severity.cmp(&a.max_severity)
                .then_with(|| b.overall_score.partial_cmp(&a.overall_score).unwrap_or(std::cmp::Ordering::Equal))
        });
        results
    }
}

impl Default for AnomalyDetector {
    fn default() -> Self { Self::new() }
}

fn make_display_name(asset_id: &str, asset_type: AssetType) -> String {
    match asset_type {
        AssetType::NetworkEndpoint => {
            asset_id.strip_prefix("net:").unwrap_or(asset_id).to_string()
        }
        AssetType::Process => {
            let stripped = asset_id.strip_prefix("proc:").unwrap_or(asset_id);
            stripped.rsplitn(2, ':').nth(1).unwrap_or(stripped).to_string()
        }
        AssetType::Device => asset_id.to_string(),
    }
}

pub fn run_detection_pipeline(
    recent_events: &[EnrichedEvent],
    baseline_manager: &BaselineManager,
) -> (HashMap<String, AssetFeatures>, Vec<AssetAnomaly>) {
    let extractor = FeatureExtractor::new();
    let features = extractor.extract_per_asset(recent_events);

    let baselines_hash: HashMap<String, Baseline> = baseline_manager
        .all_baselines()
        .iter()
        .map(|b| (b.asset_id.clone(), (*b).clone()))
        .collect();

    let detector = AnomalyDetector::new();
    let anomalies = detector.detect_all(&features, &baselines_hash);
    (features, anomalies)
}

pub fn format_anomaly_summary(a: &AssetAnomaly) -> String {
    let top = a.deviations.iter().max_by(|x, y| {
        x.z_score.abs().partial_cmp(&y.z_score.abs()).unwrap_or(std::cmp::Ordering::Equal)
    });
    let top_str = top.map(|d| format!(
        "{}={:.1} (μ={:.1}, σ={:.1}, z={:+.2})",
        d.feature_name, d.current_value, d.baseline_mean, d.baseline_stddev, d.z_score
    )).unwrap_or_default();
    format!("[{}] {} {} — score={:.2} | {}",
        a.max_severity.label(),
        match a.asset_type {
            AssetType::NetworkEndpoint => "NET",
            AssetType::Process => "PROC",
            AssetType::Device => "DEV",
        },
        a.display_name,
        a.overall_score,
        top_str
    )
}
