use bollard::container::{RestartContainerOptions, StartContainerOptions};

use super::container_exists;
use crate::AppState;

#[tauri::command]
pub async fn start_container(state: tauri::State<'_, AppState>, id: String) -> Result<(), String> {
    container_exists(&state.docker, &id).await?;

    let options = Some(StartContainerOptions::default());

    state
        .docker
        .start_container::<String>(&id, options)
        .await
        .map_err(|e| {
            eprint!("{:?}", &e);
            e.to_string()
        })
}

#[tauri::command]
pub async fn restart_container(
    state: tauri::State<'_, AppState>,
    id: String,
) -> Result<(), String> {
    container_exists(&state.docker, &id).await?;

    let options = Some(RestartContainerOptions::default());

    state
        .docker
        .restart_container(&id, options)
        .await
        .map_err(|e| e.to_string())
}
