use bollard::container::RemoveContainerOptions;

use super::container_exists;
use crate::AppState;

#[tauri::command]
pub async fn remove_container(state: tauri::State<'_, AppState>, id: String) -> Result<(), String> {
    container_exists(&state.docker, &id).await?;

    let options = Some(RemoveContainerOptions {
        force: true,
        ..Default::default()
    });

    state
        .docker
        .remove_container(&id, options)
        .await
        .map_err(|e| e.to_string())
}
