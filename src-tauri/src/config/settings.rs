// Application settings

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Settings {
    pub network: NetworkSettings,
    pub detection: DetectionSettings,
    pub storage: StorageSettings,
    pub integrations: IntegrationSettings,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkSettings {
    pub capture_interface: String,
    pub promiscuous_mode: bool,
    pub buffer_size: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DetectionSettings {
    pub enable_ml: bool,
    pub enable_signatures: bool,
    pub enable_behavioral: bool,
    pub anomaly_threshold: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StorageSettings {
    pub database_path: String,
    pub retention_days: u32,
    pub max_size_gb: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IntegrationSettings {
    pub virustotal_api_key: Option<String>,
    pub abuseipdb_api_key: Option<String>,
    pub misp_url: Option<String>,
    pub misp_api_key: Option<String>,
    pub slack_webhook: Option<String>,
    pub discord_webhook: Option<String>,
}

impl Settings {
    pub fn load() -> Result<Self, String> {
        // TODO: Load settings from config file
        Ok(Self::default())
    }

    pub fn save(&self) -> Result<(), String> {
        // TODO: Save settings to config file
        Ok(())
    }
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            network: NetworkSettings {
                capture_interface: "eth0".to_string(),
                promiscuous_mode: false,
                buffer_size: 65536,
            },
            detection: DetectionSettings {
                enable_ml: true,
                enable_signatures: true,
                enable_behavioral: true,
                anomaly_threshold: 0.7,
            },
            storage: StorageSettings {
                database_path: "aegis.db".to_string(),
                retention_days: 90,
                max_size_gb: 100,
            },
            integrations: IntegrationSettings {
                virustotal_api_key: None,
                abuseipdb_api_key: None,
                misp_url: None,
                misp_api_key: None,
                slack_webhook: None,
                discord_webhook: None,
            },
        }
    }
}
