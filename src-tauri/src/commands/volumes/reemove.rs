use bollard::volume::RemoveVolumeOptions;

use crate::AppState;

#[tauri::command]
pub async fn remove_volume(state: tauri::State<'_, AppState>, id: String) -> Result<(), String> {
    let options = RemoveVolumeOptions { force: true };

    state
        .docker
        .remove_volume(&id, Some(options))
        .await
        .map_err(|e| e.to_string())
}
