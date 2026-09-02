// Event processing module

pub mod event;
pub mod normalizer;
pub mod pipeline;

use event::Event;
use normalizer::EventNormalizer;
use pipeline::EventPipeline;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessEvent {
    pub pid: u32,
    pub name: String,
    pub parent_pid: Option<u32>,
    pub cpu_usage: f32,
    pub memory_usage: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkEvent {
    pub local_ip: String,
    pub local_port: u16,
    pub remote_ip: String,
    pub remote_port: u16,
    pub protocol: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SecurityEvent {
    Process(ProcessEvent),
    Network(NetworkEvent),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EnrichedEvent {
    pub id: Option<i64>,
    pub timestamp: DateTime<Utc>,
    pub source: String,
    pub asset_id: Option<String>,
    pub event: SecurityEvent,
}

impl EnrichedEvent {
    pub fn new(source: &str, event: SecurityEvent) -> Self {
        Self {
            id: None,
            timestamp: Utc::now(),
            source: source.to_string(),
            asset_id: None,
            event,
        }
    }
}