use tauri::State;
use serde_json::json;
use chrono::Utc;
use crate::events::{EnrichedEvent, SecurityEvent, ProcessEvent};

// ---- App state (empty) ----
pub struct AppState {}

// ---- Stubbed Tauri commands ----

#[tauri::command]
pub async fn start_monitoring(state: State<'_, AppState>) -> Result<(), String> {
    println!("▶️ Start monitoring called (stubbed)");
    Ok(())
}

#[tauri::command]
pub async fn get_recent_events(
    state: State<'_, AppState>,
    limit: usize,
) -> Result<Vec<EnrichedEvent>, String> {
    println!("🔍 get_recent_events called (stubbed)");
    // Return dummy process data
    let dummy_events: Vec<EnrichedEvent> = (0..std::cmp::min(limit, 5))
        .map(|i| {
            let process = ProcessEvent {
                pid: 1000 + i as u32,
                name: format!("dummy_process_{}.exe", i),
                parent_pid: Some(1),
                cpu_usage: (i as f32) * 2.5,
                memory_usage: (i as u64) * 1024 * 1024,
            };
            EnrichedEvent {
                id: Some(i as i64),
                timestamp: Utc::now(),
                source: "dummy".to_string(),
                asset_id: Some("asset-1".to_string()),
                event: SecurityEvent::Process(process),
            }
        })
        .collect();
    Ok(dummy_events)
}

// ---- Other sub-commands (stubs) ----
pub mod devices;
pub mod traffic;
pub mod alerts;
pub mod incidents;
pub mod response;