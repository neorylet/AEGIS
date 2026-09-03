use sysinfo::System;
use crate::events::{ProcessEvent, SecurityEvent, EnrichedEvent, NetworkEvent};
use std::sync::Arc;
use tokio::sync::Mutex;
use std::time::Duration;
use std::collections::HashSet;
use chrono::{Utc, Duration as ChronoDuration};
use crate::storage::DatabaseManager;
use crate::discovery::AssetRegistry;
use crate::fingerprint::{BaselineManager, FeatureExtractor};
use crate::risk::{AssetAnomaly, run_detection_pipeline, format_anomaly_summary};
use log::{info, error, warn};

pub async fn poll_processes(db: Arc<DatabaseManager>) {
    let mut sys = System::new_all();
    let mut previous_pids: HashSet<u32> = HashSet::new();

    loop {
        tokio::time::sleep(Duration::from_secs(5)).await;
        sys.refresh_all();

        let mut current_pids: HashSet<u32> = HashSet::new();

        for (pid, process) in sys.processes() {
            let pid_u32 = pid.as_u32();
            current_pids.insert(pid_u32);

            if !previous_pids.contains(&pid_u32) {
                let process_event = ProcessEvent {
                    pid: pid_u32,
                    name: process.name().to_string(),
                    parent_pid: process.parent().map(|p| p.as_u32()),
                    cpu_usage: process.cpu_usage(),
                    memory_usage: process.memory(),
                };
                let event = EnrichedEvent::new(
                    "process_poller",
                    SecurityEvent::Process(process_event),
                );
                if let Err(e) = db.insert_event(&event).await {
                    error!("Failed to insert process event: {}", e);
                }
            }
        }

        info!(
            "Polled {} processes ({} new since last poll)",
            current_pids.len(),
            current_pids.difference(&previous_pids).count()
        );

        previous_pids = current_pids;
    }
}

pub async fn poll_connections(db: Arc<DatabaseManager>) {
    let mut previous_keys: HashSet<String> = HashSet::new();

    loop {
        tokio::time::sleep(Duration::from_secs(5)).await;

        let output = match std::process::Command::new("netstat")
            .args(["-an"])
            .output()
        {
            Ok(output) => output,
            Err(e) => {
                error!("Failed to execute netstat: {}", e);
                continue;
            }
        };

        let stdout = String::from_utf8_lossy(&output.stdout);
        let mut current_keys: HashSet<String> = HashSet::new();

        for line in stdout.lines() {
            let line = line.trim();
            
            if line.is_empty() 
                || line.starts_with("Active Connections") 
                || line.starts_with("Proto") 
                || line.starts_with("---") {
                continue;
            }

            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() < 3 {
                continue;
            }

            let protocol = parts[0].to_string();
            let local_address = parts[1];
            let foreign_address = parts[2];
            let state = if parts.len() > 3 { parts[3].to_string() } else { "".to_string() };

            let key = format!("{}|{}|{}|{}", protocol, local_address, foreign_address, state);
            current_keys.insert(key.clone());

            if !previous_keys.contains(&key) {
                let (local_ip, local_port) = if let Some(last_colon) = local_address.rfind(':') {
                    let ip = local_address[..last_colon].to_string();
                    let port = local_address[last_colon + 1..]
                        .trim_start_matches('[')
                        .trim_end_matches(']')
                        .parse::<u16>()
                        .unwrap_or(0);
                    (ip, port)
                } else {
                    (local_address.to_string(), 0)
                };

                let (remote_ip, remote_port) = if let Some(last_colon) = foreign_address.rfind(':') {
                    let ip = foreign_address[..last_colon].to_string();
                    let port = foreign_address[last_colon + 1..]
                        .trim_start_matches('[')
                        .trim_end_matches(']')
                        .parse::<u16>()
                        .unwrap_or(0);
                    (ip, port)
                } else {
                    (foreign_address.to_string(), 0)
                };

                let network_event = NetworkEvent {
                    local_ip,
                    local_port,
                    remote_ip,
                    remote_port,
                    protocol,
                };

                let event = EnrichedEvent::new(
                    "connection_poller",
                    SecurityEvent::Network(network_event),
                );

                if let Err(e) = db.insert_event(&event).await {
                    error!("Failed to insert connection event: {}", e);
                }
            }
        }

        info!(
            "Polled {} connections ({} new)",
            current_keys.len(),
            current_keys.difference(&previous_keys).count()
        );

        previous_keys = current_keys;
    }
}

pub async fn run_analysis_loop(
    db: Arc<DatabaseManager>,
    asset_registry: Arc<Mutex<AssetRegistry>>,
    baseline_manager: Arc<Mutex<BaselineManager>>,
    anomalies_cache: Arc<Mutex<Vec<AssetAnomaly>>>,
) {
    let extractor = FeatureExtractor::new();
    let analysis_interval_secs: i64 = 15;
    let window_minutes: i64 = 10;
    let persist_every_n: u64 = 4;
    let mut tick: u64 = 0;

    loop {
        tokio::time::sleep(Duration::from_secs(analysis_interval_secs as u64)).await;
        tick = tick.wrapping_add(1);

        let window_start = Utc::now() - ChronoDuration::minutes(window_minutes);
        let recent_events = match db.get_events_since(window_start, 2000).await {
            Ok(e) => e,
            Err(err) => {
                error!("Analysis: failed to fetch events: {}", err);
                continue;
            }
        };

        if recent_events.is_empty() {
            continue;
        }

        info!(
            "🔍 Analysis tick #{}: {} events in last {} min window",
            tick, recent_events.len(), window_minutes
        );

        let updated_ids = {
            let mut ar = asset_registry.lock().await;
            ar.ingest_events(&recent_events)
        };

        if !updated_ids.is_empty() {
            let ar_guard = asset_registry.lock().await;
            for aid in updated_ids.iter().take(100) {
                if let Some(asset) = ar_guard.get(aid) {
                    if let Err(e) = db.upsert_asset(asset).await {
                        error!("Failed to persist asset {}: {}", aid, e);
                    }
                }
            }
            drop(ar_guard);
            info!("  → {} assets tracked in registry", updated_ids.len());
        }

        let features = extractor.extract_per_asset(&recent_events);

        let baselines_snapshot = {
            let mut bm = baseline_manager.lock().await;
            bm.ingest_features(&features);
            bm.all_baselines().iter().map(|b| (*b).clone()).collect::<Vec<_>>()
        };

        if tick % persist_every_n == 0 {
            for bl in baselines_snapshot.iter() {
                if bl.window_count >= 2 {
                    if let Err(e) = db.save_baseline(bl).await {
                        error!("Failed to persist baseline {}: {}", bl.asset_id, e);
                    }
                }
            }
            info!("  → {} baselines persisted to DB ({} total)",
                baselines_snapshot.iter().filter(|b| b.window_count >= 2).count(),
                baselines_snapshot.len()
            );
        }

        let (_, new_anomalies) = {
            let bm = baseline_manager.lock().await;
            run_detection_pipeline(&recent_events, &bm)
        };

        if !new_anomalies.is_empty() {
            info!("  ⚠️  {} anomalies detected:", new_anomalies.len());
            for a in new_anomalies.iter().take(5) {
                info!("    {}", format_anomaly_summary(a));
            }
            if new_anomalies.len() > 5 {
                info!("    ... and {} more", new_anomalies.len() - 5);
            }

            let mut cache = anomalies_cache.lock().await;
            *cache = new_anomalies;
        } else if tick % 4 == 0 {
            info!("  → No anomalies detected this tick (behavior within baseline)");
        }
    }
}