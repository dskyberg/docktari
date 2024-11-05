use bollard::secret::VolumeListResponse;

use crate::state::AppState;

#[tauri::command]
pub async fn prune_volumes(
    state: tauri::State<'_, AppState>,
) -> Result<VolumeListResponse, String> {
    state
        .docker
        .list_volumes::<String>(None)
        .await
        .map_err(|e| e.to_string())
}
