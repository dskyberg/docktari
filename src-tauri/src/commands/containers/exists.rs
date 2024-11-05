use bollard::{container::ListContainersOptions, Docker};

use super::fetch_list_containers;

pub async fn container_exists(docker: &Docker, id: &str) -> Result<bool, String> {
    let mut filters = std::collections::HashMap::new();
    filters.insert(String::from("id"), vec![id.to_owned()]);

    let options = ListContainersOptions::<String> {
        all: true,
        filters,
        ..Default::default()
    };
    fetch_list_containers(docker, Some(options))
        .await
        .into_iter()
        .next()
        .ok_or_else(|| "Container not found".to_string())
        .map(|_| true)
}
