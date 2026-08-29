// Incident severity calculation

pub struct SeverityCalculator {
    weights: SeverityWeights,
}

pub struct SeverityWeights {
    pub impact: f64,
    pub likelihood: f64,
    pub asset_criticality: f64,
    pub threat_intelligence: f64,
}

impl SeverityCalculator {
    pub fn new() -> Self {
        Self {
            weights: SeverityWeights {
                impact: 0.4,
                likelihood: 0.3,
                asset_criticality: 0.2,
                threat_intelligence: 0.1,
            },
        }
    }

    pub fn calculate_severity(&self, factors: SeverityFactors) -> crate::incidents::incident::IncidentSeverity {
        let score = self.calculate_score(&factors);
        
        if score >= 0.9 {
            crate::incidents::incident::IncidentSeverity::Critical
        } else if score >= 0.7 {
            crate::incidents::incident::IncidentSeverity::High
        } else if score >= 0.5 {
            crate::incidents::incident::IncidentSeverity::Medium
        } else {
            crate::incidents::incident::IncidentSeverity::Low
        }
    }

    fn calculate_score(&self, factors: &SeverityFactors) -> f64 {
        (factors.impact * self.weights.impact
            + factors.likelihood * self.weights.likelihood
            + factors.asset_criticality * self.weights.asset_criticality
            + factors.threat_intelligence * self.weights.threat_intelligence).min(1.0)
    }
}

pub struct SeverityFactors {
    pub impact: f64,
    pub likelihood: f64,
    pub asset_criticality: f64,
    pub threat_intelligence: f64,
}
