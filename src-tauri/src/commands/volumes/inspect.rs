use bollard::models::Volume;

use crate::state::AppState;

#[tauri::command]
pub async fn inspect_volume(
    state: tauri::State<'_, AppState>,
    id: String,
) -> Result<Volume, String> {
    state
        .docker
        .inspect_volume(&id)
        .await
        .map_err(|e| e.to_string())
}
