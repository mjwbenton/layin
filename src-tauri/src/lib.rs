mod commands;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![commands::save_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
