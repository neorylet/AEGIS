use std::collections::HashMap;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use crate::discovery::AssetType;
use crate::fingerprint::AssetFeatures;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BaselineStats {
    pub mean: f64,
    pub stddev: f64,
    pub min: f64,
    pub max: f64,
    pub sample_count: u64,
}

impl BaselineStats {
    pub fn new() -> Self {
        Self {
            mean: 0.0,
            stddev: 0.0,
            min: f64::INFINITY,
            max: f64::NEG_INFINITY,
            sample_count: 0,
        }
    }

    pub fn z_score(&self, value: f64) -> f64 {
        if self.stddev == 0.0 || self.sample_count < 3 {
            0.0
        } else {
            (value - self.mean) / self.stddev
        }
    }

    pub fn is_anomaly(&self, value: f64, threshold: f64) -> bool {
        self.z_score(value).abs() > threshold
    }
}

impl Default for BaselineStats {
    fn default() -> Self { Self::new() }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Baseline {
    pub asset_id: String,
    pub asset_type: AssetType,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub window_count: u64,
    pub stats: HashMap<String, BaselineStats>,
}

impl Baseline {
    pub fn new(asset_id: &str, asset_type: AssetType) -> Self {
        let now = Utc::now();
        Self {
            asset_id: asset_id.to_string(),
            asset_type,
            created_at: now,
            updated_at: now,
            window_count: 0,
            stats: HashMap::new(),
        }
    }

    pub fn incorporate_features(&mut self, features: &AssetFeatures) {
        self.window_count = self.window_count.saturating_add(1);
        self.updated_at = Utc::now();

        let feature_map = [
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
            self.update_stat(name.to_string(), *value);
        }
    }

    fn update_stat(&mut self, name: String, value: f64) {
        let stat = self.stats.entry(name).or_insert_with(BaselineStats::new);
        stat.sample_count = stat.sample_count.saturating_add(1);

        if value < stat.min { stat.min = value; }
        if value > stat.max { stat.max = value; }

        let n = stat.sample_count as f64;
        let old_mean = stat.mean;
        let new_mean = old_mean + (value - old_mean) / n;
        let new_stddev = if n > 1.0 {
            let old_stddev = stat.stddev;
            let m2_old = old_stddev.powi(2) * (n - 1.0);
            let m2_new = m2_old + (value - old_mean) * (value - new_mean);
            (m2_new / n).sqrt()
        } else {
            0.0
        };

        stat.mean = new_mean;
        stat.stddev = new_stddev;
    }
}

pub struct BaselineManager {
    baselines: HashMap<String, Baseline>,
}

impl BaselineManager {
    pub fn new() -> Self {
        Self { baselines: HashMap::new() }
    }

    pub fn merge_loaded(&mut self, loaded: Baseline) {
        let entry = self.baselines.entry(loaded.asset_id.clone())
            .or_insert_with(|| Baseline::new(&loaded.asset_id, loaded.asset_type));
        entry.created_at = loaded.created_at;
        entry.updated_at = loaded.updated_at;
        entry.window_count = loaded.window_count;
        for (k, v) in loaded.stats {
            entry.stats.insert(k, v);
        }
    }

    pub fn ingest_features(&mut self, features: &HashMap<String, AssetFeatures>) {
        for (_id, f) in features {
            let bl = self.baselines.entry(f.asset_id.clone())
                .or_insert_with(|| Baseline::new(&f.asset_id, f.asset_type));
            bl.incorporate_features(f);
        }
    }

    pub fn ingest_feature_window(&mut self, features: &AssetFeatures) {
        let bl = self.baselines.entry(features.asset_id.clone())
            .or_insert_with(|| Baseline::new(&features.asset_id, features.asset_type));
        bl.incorporate_features(features);
    }

    pub fn get(&self, asset_id: &str) -> Option<&Baseline> {
        self.baselines.get(asset_id)
    }

    pub fn all_baselines(&self) -> Vec<&Baseline> {
        self.baselines.values().collect()
    }

    pub fn len(&self) -> usize {
        self.baselines.len()
    }

    pub fn is_empty(&self) -> bool {
        self.baselines.is_empty()
    }
}

impl Default for BaselineManager {
    fn default() -> Self { Self::new() }
}
