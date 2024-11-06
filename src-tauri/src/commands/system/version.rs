use crate::AppState;
use bollard::system::Version;

#[tauri::command]
pub async fn docker_version(state: tauri::State<'_, AppState>) -> Result<Version, String> {
    state.docker.version().await.map_err(|e| e.to_string())
}
