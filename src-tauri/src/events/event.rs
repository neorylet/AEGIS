// Event structure and types

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Event {
    pub id: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub event_type: EventType,
    pub source: EventSource,
    pub severity: EventSeverity,
    pub data: EventData,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EventType {
    NetworkConnection,
    DnsQuery,
    HttpRequest,
    SystemLogin,
    FileAccess,
    ProcessExecution,
    Custom(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EventSource {
    pub ip_address: String,
    pub port: Option<u16>,
    pub hostname: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EventSeverity {
    Info,
    Low,
    Medium,
    High,
    Critical,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EventData {
    pub raw: serde_json::Value,
    pub parsed: Option<serde_json::Value>,
}
