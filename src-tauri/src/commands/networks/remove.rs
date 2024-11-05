use crate::state::AppState;

#[tauri::command]
pub async fn remove_network(state: tauri::State<'_, AppState>, id: String) -> Result<(), String> {
    state
        .docker
        .remove_network(&id)
        .await
        .map_err(|e| e.to_string())
}
