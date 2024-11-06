use bollard::{container::ListContainersOptions, secret::ContainerSummary, Docker};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::AppState;

pub async fn fetch_list_containers(
    docker: &Docker,
    options: Option<ListContainersOptions<String>>,
) -> Result<Vec<ContainerSummary>, String> {
    docker
        .list_containers(options)
        .await
        .map_err(|e| e.to_string())
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ListContainersOptionsProxy {
    pub all: Option<bool>,
    pub limit: Option<isize>,
    pub size: Option<bool>,
    pub filters: HashMap<String, Vec<String>>,
}

#[allow(clippy::from_over_into)]
impl Into<ListContainersOptions<String>> for ListContainersOptionsProxy {
    fn into(self) -> ListContainersOptions<String> {
        ListContainersOptions {
            all: self.all.unwrap_or(false),
            limit: self.limit,
            size: self.size.unwrap_or(false),
            filters: self.filters.clone(),
        }
    }
}

#[tauri::command]
pub async fn list_containers(
    state: tauri::State<'_, AppState>,
    list_options: Option<ListContainersOptionsProxy>,
) -> Result<Vec<ContainerSummary>, String> {
    let options = match list_options {
        Some(lo) => Some(lo.into()),
        None => Some(ListContainersOptions::<String> {
            all: true,
            ..Default::default()
        }),
    };
    fetch_list_containers(&state.docker, options).await
}
