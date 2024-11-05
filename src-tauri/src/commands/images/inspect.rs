use bollard::models::ImageInspect;

use crate::state::AppState;

#[tauri::command]
pub async fn inspect_image(
    state: tauri::State<'_, AppState>,
    id: String,
) -> Result<ImageInspect, String> {
    state
        .docker
        .inspect_image(&id)
        .await
        .map_err(|e| e.to_string())
}
