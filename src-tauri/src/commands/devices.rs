use crate::discovery::Asset;

#[tauri::command]
pub async fn list_devices() -> Result<Vec<Asset>, String> {
    Ok(vec![])
}

#[tauri::command]
pub async fn scan_network(_subnet: String) -> Result<usize, String> {
    Ok(0)
}

#[tauri::command]
pub async fn get_device_details(_device_id: String) -> Result<Asset, String> {
    Err("Not implemented".to_string())
}
