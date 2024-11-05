import { defer } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

export const homeLoader = async () => {
  let dataPromise = invoke("docker_version");
  return defer({ version: dataPromise });
};

export const containersLoader = async () => {
  let dataPromise = invoke("list_containers");
  return defer({ version: dataPromise });
};

export const imagesLoader = async () => {
  let dataPromise = invoke("list_images");
  return defer({ version: dataPromise });
};

const SEPARATOR = "/";
const CURRENT_DIR = "./";
const PARENT_DIR = "../";
const DIRECTORY_INDICATOR = "/";
const EXECUTABLE_INDICATOR = "*";
const SYMLINK_INDICATOR = "@";
const PIPE_INDICATOR = "|";
const SOCKET_INDICATOR = "=";
const DOOR_INDICATOR = ">";
const FILE_INDICATORS = [
  DIRECTORY_INDICATOR,
  EXECUTABLE_INDICATOR,
  SYMLINK_INDICATOR,
  PIPE_INDICATOR,
  SOCKET_INDICATOR,
  DOOR_INDICATOR,
];

/**
    If the last character of the string is a file type indicator (from man(1) ls -F), then trim it
    and return [ trimmed string, trimmed last char],

    Otherwise, return  [ untrimmed string, NULL]
*/
const trim = (str) => {
  // Special case for the root directory.
  if (str === "/") {
    return [str, DIRECTORY_INDICATOR];
  }

  let last = str.slice(-1);

  if (FILE_INDICATORS.includes(last)) {
    return [str.slice(0, -1), last];
  } else {
    return [str, null];
  }
};

export class FolderEntry {
  constructor(name, parent) {
    const [label, last] = trim(name);
    this.label = label;
    if (name == SEPARATOR && parent == SEPARATOR) {
      this.value = SEPARATOR;
    } else {
      let prepend = parent === SEPARATOR ? SEPARATOR : parent + SEPARATOR;
      this.value = prepend + label;
      console.log("FolderEntry:", name, parent, prepend, this.value);
    }

    this.isDirectory = last === DIRECTORY_INDICATOR ?? false;
    this.isExecutabl = last === EXECUTABLE_INDICATOR ?? false;
    this.isSymLink = last === SYMLINK_INDICATOR ?? false;
    this.isPipe = last === PIPE_INDICATOR ?? false;
    this.isSocket = last === SOCKET_INDICATOR ?? false;
    this.isDoor = last === DOOR_INDICATOR ?? false;
    this.isUnknown = last === null ?? false;
  }
}

const LS_ARGS = "-aF";

/**
    Execute `ls -aF`, and parse the results into Entry's
*/
export const fetch_folder = async (id, parent) => {
  return invoke("exec_container_once", { id, cmd: ["ls", LS_ARGS, parent] }).then((result) => {
    console.log("fetch_folder", parent, result);
    let results = [];
    result.split("\n").forEach((line) => {
      if (line === CURRENT_DIR || line === PARENT_DIR) return;
      results.push(new FolderEntry(line, parent));
    });
    return results;
  });
};
