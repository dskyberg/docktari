use bollard::{models::Network, network::ListNetworksOptions};
use std::default::Default;

use crate::state::AppState;

#[tauri::command]
pub async fn list_networks(state: tauri::State<'_, AppState>) -> Result<Vec<Network>, String> {
    let options = Some(ListNetworksOptions {
        ..Default::default()
    });

    state
        .docker
        .list_networks::<String>(options)
        .await
        .map_err(|e| e.to_string())
}
