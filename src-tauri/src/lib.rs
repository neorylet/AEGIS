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
use commands::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // ---- Panic hook ----
    std::panic::set_hook(Box::new(|panic_info| {
        eprintln!("❌ Panic: {:?}", panic_info);
        eprintln!("Press Enter to exit...");
        let _ = std::io::stdin().read_line(&mut String::new());
    }));

    println!("🔹 AEGIS starting (no database mode)");

    // ---- Empty AppState ----
    let app_state = AppState {};

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