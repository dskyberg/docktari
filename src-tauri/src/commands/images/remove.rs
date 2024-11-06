use bollard::{image::RemoveImageOptions, secret::ImageDeleteResponseItem};

use crate::AppState;

#[tauri::command]
pub async fn remove_image(
    state: tauri::State<'_, AppState>,
    id: String,
) -> Result<Vec<ImageDeleteResponseItem>, String> {
    let options = Some(RemoveImageOptions {
        force: true,
        ..Default::default()
    });

    state
        .docker
        .remove_image(&id, options, None)
        .await
        .map_err(|e| e.to_string())
}
