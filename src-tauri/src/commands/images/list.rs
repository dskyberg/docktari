use bollard::{image::ListImagesOptions, secret::ImageSummary};
use std::collections::HashMap;

use crate::state::AppState;

#[tauri::command]
pub async fn list_images(state: tauri::State<'_, AppState>) -> Result<Vec<ImageSummary>, String> {
    let filters: HashMap<String, Vec<String>> = HashMap::new();
    //filters.insert("health", vec!["unhealthy"]);

    let options = Some(ListImagesOptions {
        all: true,
        filters,
        ..Default::default()
    });

    state
        .docker
        .list_images(options)
        .await
        .map_err(|e| e.to_string())
}
