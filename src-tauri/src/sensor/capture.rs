use sysinfo::System;
use crate::events::{ProcessEvent, SecurityEvent, EnrichedEvent, NetworkEvent};
use std::sync::Arc;
use std::time::Duration;
use std::collections::HashSet;
use crate::storage::DatabaseManager;
use log::{info, error};

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

// TODO: filter/dedupe after manual data validation
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
            
            // Skip header lines and empty lines
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

            // Create deduplication key
            let key = format!("{}|{}|{}|{}", protocol, local_address, foreign_address, state);
            current_keys.insert(key.clone());

            if !previous_keys.contains(&key) {
                // Parse local address (split on LAST colon for IPv6 support)
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

                // Parse foreign address (split on LAST colon for IPv6 support)
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