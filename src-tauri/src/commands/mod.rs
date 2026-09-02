use tauri::State;
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use tokio::spawn;
use crate::storage::DatabaseManager;
use crate::sensor::capture::{poll_processes, poll_connections};
use crate::events::EnrichedEvent;

pub struct AppState {
    pub db: Arc<DatabaseManager>,
    pub is_monitoring: AtomicBool,
}

#[tauri::command]
pub async fn start_monitoring(state: State<'_, AppState>) -> Result<(), String> {
    if state.is_monitoring.swap(true, Ordering::SeqCst) {
        log::warn!("start_monitoring called while already running — ignoring");
        return Ok(());
    }
    let db = state.db.clone();
    spawn(async move {
        poll_processes(db.clone()).await;
    });
    let db2 = state.db.clone();
    spawn(async move {
        poll_connections(db2).await;
    });
    Ok(())
}

#[tauri::command]
pub async fn get_recent_events(
    state: State<'_, AppState>,
    limit: usize,
) -> Result<Vec<EnrichedEvent>, String> {
    state.db.get_recent_events(limit).await.map_err(|e| e.to_string())
}

pub mod devices;
pub mod traffic;
pub mod alerts;
pub mod incidents;
pub mod response;