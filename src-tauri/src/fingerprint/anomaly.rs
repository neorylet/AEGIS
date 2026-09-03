use super::features::AssetFeatures;

#[allow(dead_code)]
pub struct AnomalyDetector {
    threshold: f64,
}

impl AnomalyDetector {
    pub fn new(threshold: f64) -> Self {
        Self { threshold }
    }

    pub fn detect(&self, _current: &AssetFeatures, _baseline: &AssetFeatures) -> AnomalyScore {
        AnomalyScore::default()
    }
}

#[derive(Default)]
pub struct AnomalyScore {
    pub score: f64,
    pub is_anomalous: bool,
    pub contributing_features: Vec<String>,
}
