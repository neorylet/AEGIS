// Asset criticality management

pub struct AssetCriticalityManager {
    assets: Vec<Asset>,
}

pub struct Asset {
    pub id: String,
    pub name: String,
    pub asset_type: AssetType,
    pub criticality: CriticalityLevel,
    pub owner: Option<String>,
    pub location: String,
    pub dependencies: Vec<String>,
}

pub enum AssetType {
    Server,
    Workstation,
    NetworkDevice,
    Database,
    Application,
    DataStore,
    Other(String),
}

pub enum CriticalityLevel {
    Low,
    Medium,
    High,
    Critical,
}

impl AssetCriticalityManager {
    pub fn new() -> Self {
        Self {
            assets: Vec::new(),
        }
    }

    pub fn add_asset(&mut self, asset: Asset) {
        self.assets.push(asset);
    }

    pub fn get_criticality(&self, asset_id: &str) -> Option<CriticalityLevel> {
        self.assets.iter().find(|a| a.id == asset_id).map(|a| a.criticality.clone())
    }

    pub fn calculate_impact(&self, asset_id: &str) -> f64 {
        match self.get_criticality(asset_id) {
            Some(CriticalityLevel::Critical) => 1.0,
            Some(CriticalityLevel::High) => 0.75,
            Some(CriticalityLevel::Medium) => 0.5,
            Some(CriticalityLevel::Low) => 0.25,
            None => 0.5,
        }
    }
}
