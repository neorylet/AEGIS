// ---- MODULE DECLARATIONS ----
mod sensor;
mod discovery;
mod events;
mod detection;
mod fingerprint;
mod intelligence;
mod correlation;
mod incidents;
mod risk;
mod explanation;
mod policy;
mod response;
mod playbooks;
mod ml;
mod forecasting;
mod hunting;
mod integrations;
mod storage;
mod config;
mod commands;

// ---- IMPORTS ----
use std::sync::Arc;
use std::sync::atomic::AtomicBool;
use commands::AppState;
use storage::DatabaseManager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // ---- Panic hook ----
    std::panic::set_hook(Box::new(|panic_info| {
        eprintln!("❌ Panic: {:?}", panic_info);
        eprintln!("Press Enter to exit...");
        let _ = std::io::stdin().read_line(&mut String::new());
    }));

    // ---- Database path with absolute path ----
    let exe_dir = std::env::current_exe()
        .expect("failed to get executable path")
        .parent()
        .expect("failed to get parent directory")
        .to_path_buf();

    let db_path = exe_dir.join("aegis.db")
        .to_str()
        .expect("invalid Unicode in path")
        .to_string();

    println!("📁 Database path: {}", db_path);

    // ---- Initialize database ----
    let db = Arc::new(
        tauri::async_runtime::block_on(
            DatabaseManager::new(&format!("sqlite:{}", db_path))
        )
        .expect("Failed to initialize database")
    );

    let app_state = AppState {
        db,
        is_monitoring: AtomicBool::new(false),
    };

    // ---- Launch Tauri ----
    tauri::Builder::default()
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            commands::start_monitoring,
            commands::get_recent_events,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}