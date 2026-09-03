use std::collections::{HashMap, HashSet};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use crate::events::{EnrichedEvent, SecurityEvent};
use crate::discovery::AssetType;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssetFeatures {
    pub asset_id: String,
    pub asset_type: AssetType,
    pub window_start: DateTime<Utc>,
    pub window_end: DateTime<Utc>,
    pub event_count: u64,
    pub connection_rate: f64,
    pub unique_destinations: u64,
    pub unique_ports: u64,
    pub protocols: HashSet<String>,
    pub process_cpu_avg: f64,
    pub process_cpu_max: f64,
    pub process_mem_avg: f64,
    pub process_mem_max: u64,
}

impl AssetFeatures {
    pub fn zero(asset_id: &str, asset_type: AssetType) -> Self {
        let now = Utc::now();
        Self {
            asset_id: asset_id.to_string(),
            asset_type,
            window_start: now,
            window_end: now,
            event_count: 0,
            connection_rate: 0.0,
            unique_destinations: 0,
            unique_ports: 0,
            protocols: HashSet::new(),
            process_cpu_avg: 0.0,
            process_cpu_max: 0.0,
            process_mem_avg: 0.0,
            process_mem_max: 0,
        }
    }
}

pub struct FeatureExtractor;

impl FeatureExtractor {
    pub fn new() -> Self { Self }

    pub fn extract_per_asset(&self, events: &[EnrichedEvent]) -> HashMap<String, AssetFeatures> {
        let mut per_asset: HashMap<String, AssetFeaturesBuild> = HashMap::new();
        let mut window_start: Option<DateTime<Utc>> = None;
        let mut window_end: Option<DateTime<Utc>> = None;

        for ev in events {
            let ts = ev.timestamp;
            window_start = Some(window_start.map(|w| w.min(ts)).unwrap_or(ts));
            window_end = Some(window_end.map(|w| w.max(ts)).unwrap_or(ts));

            match &ev.event {
                SecurityEvent::Network(net) => {
                    for (ip, is_local) in [(net.local_ip.as_str(), true), (net.remote_ip.as_str(), false)] {
                        if is_loopback_or_unspecified(ip) { continue; }
                        let asset_id = format!("net:{}", ip);
                        let entry = per_asset.entry(asset_id.clone()).or_insert_with(|| AssetFeaturesBuild::new(&asset_id, AssetType::NetworkEndpoint));
                        entry.event_count += 1;
                        entry.protocols.insert(net.protocol.clone());
                        entry.unique_ports.insert(if is_local { net.local_port } else { net.remote_port });
                        if !is_local {
                            entry.peer_ips.insert(net.remote_ip.clone());
                        } else {
                            entry.peer_ips.insert(net.remote_ip.clone());
                        }
                    }
                }
                SecurityEvent::Process(proc) => {
                    let asset_id = format!("proc:{}:{}", proc.name, proc.pid);
                    let entry = per_asset.entry(asset_id.clone()).or_insert_with(|| AssetFeaturesBuild::new(&asset_id, AssetType::Process));
                    entry.event_count += 1;
                    entry.cpu_samples.push(proc.cpu_usage as f64);
                    entry.mem_samples.push(proc.memory_usage);
                }
            }
        }

        let ws = window_start.unwrap_or_else(Utc::now);
        let we = window_end.unwrap_or_else(Utc::now);
        let window_seconds = (we - ws).num_seconds().max(1) as f64;

        per_asset.into_iter().map(|(id, b)| {
            let (cpu_avg, cpu_max, mem_avg, mem_max) = if b.cpu_samples.is_empty() {
                (0.0, 0.0, 0.0, 0u64)
            } else {
                let cpu_sum: f64 = b.cpu_samples.iter().sum();
                let cpu_avg = cpu_sum / b.cpu_samples.len() as f64;
                let cpu_max = *b.cpu_samples.iter().max_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal)).unwrap_or(&0.0);
                let mem_sum: u64 = b.mem_samples.iter().sum();
                let mem_avg = mem_sum as f64 / b.mem_samples.len() as f64;
                let mem_max = *b.mem_samples.iter().max().unwrap_or(&0);
                (cpu_avg, cpu_max, mem_avg, mem_max)
            };

            (id.clone(), AssetFeatures {
                asset_id: id,
                asset_type: b.asset_type,
                window_start: ws,
                window_end: we,
                event_count: b.event_count,
                connection_rate: b.event_count as f64 / window_seconds,
                unique_destinations: b.peer_ips.len() as u64,
                unique_ports: b.unique_ports.len() as u64,
                protocols: b.protocols,
                process_cpu_avg: cpu_avg,
                process_cpu_max: cpu_max,
                process_mem_avg: mem_avg,
                process_mem_max: mem_max,
            })
        }).collect()
    }

    pub fn extract_window(
        &self,
        asset_id: &str,
        asset_type: AssetType,
        events: &[EnrichedEvent],
    ) -> AssetFeatures {
        let all = self.extract_per_asset(events);
        all.get(asset_id).cloned().unwrap_or_else(|| AssetFeatures::zero(asset_id, asset_type))
    }
}

impl Default for FeatureExtractor {
    fn default() -> Self { Self::new() }
}

struct AssetFeaturesBuild {
    asset_type: AssetType,
    event_count: u64,
    peer_ips: HashSet<String>,
    unique_ports: HashSet<u16>,
    protocols: HashSet<String>,
    cpu_samples: Vec<f64>,
    mem_samples: Vec<u64>,
}

impl AssetFeaturesBuild {
    fn new(_asset_id: &str, asset_type: AssetType) -> Self {
        Self {
            asset_type,
            event_count: 0,
            peer_ips: HashSet::new(),
            unique_ports: HashSet::new(),
            protocols: HashSet::new(),
            cpu_samples: Vec::new(),
            mem_samples: Vec::new(),
        }
    }
}

fn is_loopback_or_unspecified(ip: &str) -> bool {
    matches!(ip,
        "127.0.0.1"
        | "0.0.0.0"
        | "::"
        | "::1"
        | "*"
        | ""
    ) || ip.starts_with("[::")
}

pub fn features_to_json_map(f: &AssetFeatures) -> HashMap<String, f64> {
    let mut m = HashMap::new();
    m.insert("event_count".to_string(), f.event_count as f64);
    m.insert("connection_rate".to_string(), f.connection_rate);
    m.insert("unique_destinations".to_string(), f.unique_destinations as f64);
    m.insert("unique_ports".to_string(), f.unique_ports as f64);
    m.insert("process_cpu_avg".to_string(), f.process_cpu_avg);
    m.insert("process_cpu_max".to_string(), f.process_cpu_max);
    m.insert("process_mem_avg".to_string(), f.process_mem_avg);
    m.insert("process_mem_max".to_string(), f.process_mem_max as f64);
    m
}
