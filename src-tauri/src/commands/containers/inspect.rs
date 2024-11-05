use bollard::{container::InspectContainerOptions, secret::ContainerInspectResponse};

use super::container_exists;
use crate::state::AppState;

#[tauri::command]
pub async fn inspect_container(
    state: tauri::State<'_, AppState>,
    id: String,
) -> Result<ContainerInspectResponse, String> {
    container_exists(&state.docker, &id).await?;

    let options = Some(InspectContainerOptions {
        ..Default::default()
    });

    state
        .docker
        .inspect_container(&id, options)
        .await
        .map_err(|e| e.to_string())
}
