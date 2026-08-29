// Threat score calculation

pub struct ThreatScoreCalculator;

impl ThreatScoreCalculator {
    pub fn calculate(&self, factors: ThreatFactors) -> f64 {
        let intel_score = factors.threat_intel_confidence * factors.threat_intel_relevance;
        let behavior_score = factors.behavioral_anomaly * factors.behavior_confidence;
        let signature_score = if factors.signature_match { 1.0 } else { 0.0 };
        
        (intel_score * 0.4 + behavior_score * 0.4 + signature_score * 0.2).min(1.0)
    }

    pub fn aggregate_scores(&self, scores: Vec<f64>) -> f64 {
        if scores.is_empty() {
            0.0
        } else {
            scores.iter().sum::<f64>() / scores.len() as f64
        }
    }
}

pub struct ThreatFactors {
    pub threat_intel_confidence: f64,
    pub threat_intel_relevance: f64,
    pub behavioral_anomaly: f64,
    pub behavior_confidence: f64,
    pub signature_match: bool,
}
