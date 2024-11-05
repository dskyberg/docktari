use bollard::{models::Network, network::InspectNetworkOptions};
use std::default::Default;

use crate::state::AppState;

#[tauri::command]
pub async fn inspect_network(
    state: tauri::State<'_, AppState>,
    id: String,
) -> Result<Network, String> {
    let options = InspectNetworkOptions::<String>::default();

    state
        .docker
        .inspect_network(&id, Some(options))
        .await
        .map_err(|e| e.to_string())
}
