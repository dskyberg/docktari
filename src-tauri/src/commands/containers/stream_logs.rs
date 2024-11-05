use bollard::container::LogsOptions;
use futures_util::stream::StreamExt;
use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};
use tauri::{Emitter, Listener, Manager};

use super::container_exists;
use crate::state::AppState;

/// Stream container logs to the front end
///
/// This function continuously streams all logs from a container until the front end
/// asks to stop.
///
/// To do this, a thread safe boolean `cancel_toggle` flag is created, along with
/// a listener.  When the front end emits `cancel_logs_<container id>` streaming stops.
///
#[tauri::command]
pub async fn stream_container_logs(
    state: tauri::State<'_, AppState>,
    id: String,
    app: tauri::AppHandle,
) -> Result<(), String> {
    container_exists(&state.docker, &id).await?;

    let options = LogsOptions {
        follow: true,
        stdout: true,
        stderr: false,
        ..Default::default()
    };

    // Set up a cancel toggle
    let cancel_toggle = Arc::new(AtomicBool::new(true));

    let mut stream = state.docker.logs::<String>(&id, Some(options));

    let event_name = format!("cancel_logs_{}", &id);

    // Local data to move into listener
    let main_window = app.get_webview_window("main").unwrap();
    let val = Arc::clone(&cancel_toggle);

    main_window.listen(event_name, move |event| {
        eprint!("Event received: cancel_logs: {:?}", &event);
        val.store(false, Ordering::Relaxed);
    });

    let val = Arc::clone(&cancel_toggle);
    tokio::task::spawn(async move {
        while let Some(msg) = stream.next().await {
            if val.load(Ordering::Relaxed) {
                break;
            }
            let log = msg.unwrap().to_string();
            app.emit("log_chunk", log)
                .map_err(|e| e.to_string())
                .expect("this sucks");
        }
    });
    Ok(())
}
