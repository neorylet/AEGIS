// Traffic monitoring commands

use crate::sensor::flow::FlowManager;

#[tauri::command]
pub async fn start_capture(interface: String) -> Result<(), String> {
    // TODO: Implement capture start
    Ok(())
}

#[tauri::command]
pub async fn stop_capture() -> Result<(), String> {
    // TODO: Implement capture stop
    Ok(())
}

#[tauri::command]
pub async fn get_flows() -> Result<Vec<crate::sensor::flow::NetworkFlow>, String> {
    // TODO: Implement flow retrieval
    Ok(vec![])
}

#[tauri::command]
pub async fn get_traffic_stats() -> Result<TrafficStats, String> {
    // TODO: Implement traffic statistics
    Ok(TrafficStats::default())
}

#[derive(Default)]
pub struct TrafficStats {
    pub packets_per_second: f64,
    pub bytes_per_second: f64,
    pub total_connections: usize,
    pub active_connections: usize,
}
