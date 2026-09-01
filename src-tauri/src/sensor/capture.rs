use sysinfo::System;
use crate::events::{ProcessEvent, SecurityEvent, EnrichedEvent};
use std::sync::Arc;
use std::time::Duration;
use crate::storage::DatabaseManager;
use log::{info, error};

pub async fn poll_processes(db: Arc<DatabaseManager>) {
    let mut sys = System::new_all();

    loop {
        tokio::time::sleep(Duration::from_secs(5)).await;

        sys.refresh_all();

        for (pid, process) in sys.processes() {
            let process_event = ProcessEvent {
                pid: pid.as_u32(),
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

        info!("Polled {} processes", sys.processes().len());
    }
}