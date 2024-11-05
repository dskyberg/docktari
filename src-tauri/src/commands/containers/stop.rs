use super::container_exists;
use crate::state::AppState;
use bollard::container::StopContainerOptions;

#[tauri::command]
pub async fn stop_container(state: tauri::State<'_, AppState>, id: String) -> Result<(), String> {
    container_exists(&state.docker, &id).await?;

    let options = Some(StopContainerOptions { t: 30 });

    state
        .docker
        .stop_container(&id, options)
        .await
        .map_err(|e| e.to_string())
}
