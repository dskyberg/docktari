use bollard::{secret::VolumeListResponse, volume::ListVolumesOptions};
use std::collections::HashMap;

use crate::state::AppState;

#[tauri::command]
pub async fn list_volumes(state: tauri::State<'_, AppState>) -> Result<VolumeListResponse, String> {
    let mut filters = HashMap::new();
    filters.insert("dangling", vec!["0"]);
    let _options = ListVolumesOptions { filters };

    state
        .docker
        .list_volumes::<String>(None)
        .await
        .map_err(|e| e.to_string())
}
