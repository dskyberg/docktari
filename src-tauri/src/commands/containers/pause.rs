use super::container_exists;
use crate::AppState;

#[tauri::command]
pub async fn pause_container(state: tauri::State<'_, AppState>, id: String) -> Result<(), String> {
    container_exists(&state.docker, &id).await?;

    state
        .docker
        .pause_container(&id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn unpause_container(
    state: tauri::State<'_, AppState>,
    id: String,
) -> Result<(), String> {
    container_exists(&state.docker, &id).await?;

    state
        .docker
        .unpause_container(&id)
        .await
        .map_err(|e| e.to_string())
}
