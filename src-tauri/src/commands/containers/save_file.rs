use bollard::container::DownloadFromContainerOptions;
use bytes::BytesMut;
use futures_util::StreamExt;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::{Read, Write};
use tar::Archive;

use super::container_exists;
use crate::state::AppState;
use std::io::Cursor;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SaveFileOptions {
    src: String,
    target: String,
}

#[tauri::command]
pub async fn container_save_file(
    state: tauri::State<'_, AppState>,
    id: String,
    options: SaveFileOptions,
) -> Result<(), String> {
    container_exists(&state.docker, &id).await?;
    eprintln!("container_save_file: {:?}", options);
    // Get a stream from Docker for the source file
    let stream = state.docker.download_from_container(
        &id,
        Some(DownloadFromContainerOptions {
            path: options.src.clone(),
        }),
    );

    // Read the stream into a Vec<u8>
    let bytes = stream
        .collect::<Vec<_>>()
        .await
        .into_iter()
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    let bytes = bytes.into_iter().fold(BytesMut::new(), |mut buf, item| {
        buf.extend(item);
        buf
    });

    let cursor = Cursor::new(bytes);

    // Docker returns the file as a compressed tar file.  Determine the type of compression,
    // and set up an archive to inflate the file.
    let mut archive = Archive::new(cursor);
    let mut inflated = Vec::new();
    let mut file = archive
        .entries()
        .map_err(|e| e.to_string())?
        .last()
        .ok_or("No entries in archive".to_string())?
        .map_err(|e| e.to_string())?;
    file.read_to_end(&mut inflated).map_err(|e| e.to_string())?;

    // inflated can now be saved to the target location
    let mut target_file = File::create(options.target).map_err(|e| e.to_string())?;
    target_file
        .write_all(&inflated)
        .map_err(|e| e.to_string())?;

    Ok(())
}
