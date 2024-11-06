use commands::{
    containers::{
        container_save_file, exec_container, exec_container_once, inspect_container,
        list_containers, pause_container, remove_container, restart_container, start_container,
        stop_container, stream_container_logs, unpause_container,
    },
    images::{inspect_image, list_images, remove_image},
    networks::{inspect_network, list_networks, remove_network},
    system::docker_version,
    volumes::{inspect_volume, list_volumes, prune_volumes, remove_volume},
};
use tauri_plugin_store::StoreExt;

use app_state::AppState;

mod app_state;
mod commands;
mod util;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let state = AppState::default();

    tauri::Builder::default()
        .manage(state)
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            app.store(".store.bin");

            // Listen for events to stop streaming logs
            //let main_window = app.get_webview_window("main").unwrap();
            //main_window.open_devtools();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_containers,
            inspect_container,
            stream_container_logs,
            container_save_file,
            remove_container,
            pause_container,
            unpause_container,
            start_container,
            stop_container,
            restart_container,
            exec_container,
            exec_container_once,
            list_images,
            inspect_image,
            remove_image,
            list_volumes,
            inspect_volume,
            prune_volumes,
            remove_volume,
            list_networks,
            inspect_network,
            remove_network,
            docker_version,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
