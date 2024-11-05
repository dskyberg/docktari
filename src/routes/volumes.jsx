import { useState, useEffect } from "react";
import DataTable, { ON_STOP, ON_PAUSE, ON_START, ON_DELETE } from "../components/DataTable";
import { invoke } from "@tauri-apps/api/core";
import { displayId, displayTimestamp } from "../data/utils";

function displayField(field, data) {
  if (field == "Name") {
    let hex = parseInt(data, 16);
    return isNaN(hex) ? data : data.slice(0, 12);
  } else if (field == "CreatedAt") {
    let d = Date.parse(data);
    return displayTimestamp(d.valueOf() / 1000);
  } else {
    return data;
  }
}

const schema = {
  idField: "Name",
  fields: [
    { id: "Name", label: "Name", filtered: false, displayFn: (data) => displayField("Name", data.Name) },
    { id: "Driver", label: "Driver", filtered: false, displayFn: (data) => displayField("Driver", data.Driver) },
    {
      id: "CreatedAt",
      label: "Created",
      filtered: false,
      displayFn: (data) => displayField("CreatedAt", data.CreatedAt),
    },
    { id: "Scope", label: "Scope", filtered: false, displayFn: (data) => displayField("Scope", data.Scope) },
  ],
};

/*    {
  "Name": "561bdb244e142f201da5cfc28e08b690242993c8e26505de27217b95abd5d8ff",
  "Driver": "local",
  "Mountpoint": "/var/lib/docker/volumes/pam_postgres/_data",
  "CreatedAt": "2024-10-09T07:41:26-04:00",
  "Labels": {
    "com.docker.compose.volume": "postgres",
    "com.docker.compose.project": "pam",
    "com.docker.compose.version": "2.29.2"
  },
  "Scope": "local",
  "Options": {}
}, */
export default function Volumes() {
  const [data, setData] = useState([]);

  useEffect(() => {
    invoke("list_volumes").then((volume_data) => {
      setData(volume_data.Volumes);
    });
  }, []);

  const handleDelete = (containers) => {
    containers.forEach((container) => console.log("Container delete for", container));
  };

  const handleStop = (containers) => {
    containers.forEach((container) => console.log("Container stop for", container));
  };

  const handlePause = (containers) => {
    containers.forEach((container) => console.log("Container pause for", container));
  };

  const handleStart = (containers) => {
    containers.forEach((container) => console.log("Container start for", container));
  };
  const commands = [
    { id: ON_DELETE, label: "Delete", fn: handleDelete },
    { id: ON_PAUSE, label: "Pause", fn: handlePause },
    { id: ON_STOP, label: "Stop", fn: handleStop },
    { id: ON_START, label: "Start", fn: handleStart },
  ];

  return <DataTable title="Containers" schema={schema} data={data} cmds={commands} />;
}
