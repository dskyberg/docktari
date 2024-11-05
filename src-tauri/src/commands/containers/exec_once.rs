use bollard::exec::{CreateExecOptions, StartExecResults};

use futures_util::StreamExt;
use std::default::Default;

use super::container_exists;
use crate::state::AppState;

#[tauri::command]
pub async fn exec_container_once(
    state: tauri::State<'_, AppState>,
    id: String,
    cmd: Vec<String>,
) -> Result<String, String> {
    container_exists(&state.docker, &id).await?;
    let mut result = Vec::<String>::new();
    let exec = state
        .docker
        .create_exec(
            &id,
            CreateExecOptions {
                cmd: Some(cmd),
                attach_stdout: Some(true),
                ..Default::default()
            },
        )
        .await
        .map_err(|e| e.to_string())?
        .id;

    if let StartExecResults::Attached { mut output, .. } = state
        .docker
        .start_exec(&exec, None)
        .await
        .map_err(|e| e.to_string())?
    {
        while let Some(Ok(msg)) = output.next().await {
            result.push(msg.to_string().trim().to_string());
        }
    }
    Ok(result.join("\n"))
}
