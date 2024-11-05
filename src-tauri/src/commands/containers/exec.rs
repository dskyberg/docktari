use bollard::exec::{CreateExecOptions, StartExecResults};
use futures_util::StreamExt;
use std::default::Default;
use tauri::{Emitter, Listener, Manager};
//use tokio::io::AsyncWriteExt;
use tokio::task::spawn;

use super::container_exists;
use crate::state::AppState;

#[tauri::command]
pub async fn exec_container(
    state: tauri::State<'_, AppState>,
    app: tauri::AppHandle,
    id: String,
    cmd: Vec<String>,
) -> Result<(), String> {
    container_exists(&state.docker, &id).await?;
    let exec = state
        .docker
        .create_exec(
            &id,
            CreateExecOptions {
                attach_stdout: Some(true),
                attach_stderr: Some(true),
                attach_stdin: Some(true),
                tty: Some(true),
                cmd: Some(cmd),
                ..Default::default()
            },
        )
        .await
        .map_err(|e| e.to_string())?
        .id;

    #[cfg(not(windows))]
    if let StartExecResults::Attached {
        mut output,
        input: _,
    } = state
        .docker
        .start_exec(&exec, None)
        .await
        .map_err(|e| e.to_string())?
    {
        // pipe stdin into the docker exec stream input
        let main_window = app.get_webview_window("main").unwrap();
        spawn(async move {
            main_window.listen("exec_stdin", move |event| {
                eprintln!("exec_stdin: {:?}", &event);
                //let mut input_clone = input.clone();
                // input_clone.write_all(event.payload().as_bytes());
            });
        });

        // pipe docker exec output into stdout
        while let Some(Ok(output)) = output.next().await {
            app.emit("exec_stdout", output.into_bytes())
                .map_err(|e| e.to_string())?;
        }
    }
    Ok(())
}
