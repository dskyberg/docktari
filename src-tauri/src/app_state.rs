use bollard::Docker;

#[derive(Clone)]
pub struct AppState {
    pub docker: Docker,
}

impl Default for AppState {
    fn default() -> Self {
        #[cfg(target_os = "linux")]
        let conn = Docker::connect_with_socket_defaults();

        #[cfg(any(target_os = "macos", target_os = "windows"))]
        let conn = Docker::connect_with_local_defaults();

        let docker = match conn {
            Ok(docker) => docker,
            Err(e) => {
                panic!("Failed To Connect: {}", e);
            }
        };
        Self { docker }
    }
}
