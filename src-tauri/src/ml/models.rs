// Placeholder for ML models
// TODO: Implement ML model structures

pub struct MLModel {
    pub id: String,
    pub model_type: String,
}

impl Default for MLModel {
    fn default() -> Self {
        Self {
            id: String::new(),
            model_type: String::new(),
        }
    }
}
