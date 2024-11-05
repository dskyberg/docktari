import { useState, useEffect } from "react";
import DataTable, { ON_STOP, ON_PAUSE, ON_START, ON_DELETE } from "../components/DataTable";
import { invoke } from "@tauri-apps/api/core";
import { displayId, displayTimestamp } from "../data/utils";

function displayField(field, data) {
  if (field == "Id") {
    return displayId(data);
  } else if (field == "Labels") {
    return data.join(",");
  } else if (field == "Created") {
    return displayTimestamp(data);
  } else {
    return data;
  }
}

const schema = {
  idField: "Id",
  inspect: "inspect_network",
  fields: [
    { id: "Id", label: "Id", filtered: false, displayFn: (data) => displayField("Id", data.Id) },
    { id: "Name", label: "Name", filtered: false, displayFn: (data) => displayField("Name", data.Name) },
    { id: "Created", label: "Created", filtered: true, displayFn: (data) => displayField("Created", data.Created) },
    { id: "Scope", label: "Scope", filtered: false, displayFn: (data) => displayField("Scope", data.Scope) },
    { id: "Driver", label: "Driver", filtered: false, displayFn: (data) => displayField("Driver", data.Driver) },
  ],
};

/*
{
  "Name": "nocodb_default",
  "Id": "a5f16629d856d3a8ea7601dfb806fa7b56462985b578746b9e8ac989bb618372",
  "Created": "2024-09-21T17:18:10.0366467-04:00",
  "Scope": "local",
  "Driver": "bridge",
  "EnableIPv6": false,
  "IPAM": {
    "Driver": "default",
    "Config": [
      {
        "Subnet": "172.21.0.0/16",
        "Gateway": "172.21.0.1"
      }
    ]
  },
  "Internal": false,
  "Attachable": false,
  "Ingress": false,
  "Containers": {},
  "Options": {},
  "Labels": {
    "com.docker.compose.network": "default",
    "com.docker.compose.project": "nocodb",
    "com.docker.compose.version": "2.29.2"
  }
},*/
export default function Networks() {
  const [data, setData] = useState([]);

  useEffect(() => {
    invoke("list_networks").then((container_data) => {
      setData(container_data);
    });
  }, []);

  const handleDelete = (containers) => {
    containers.forEach((container) => console.log("Container delete for", container));
  };

  const handleStop = (containers) => {
    containers.forEach((container) => console.log("Network stop for", container));
  };

  const handlePause = (containers) => {
    containers.forEach((container) => console.log("Network pause for", container));
  };

  const handleStart = (containers) => {
    containers.forEach((container) => console.log("Network start for", container));
  };
  const commands = [
    { id: ON_DELETE, label: "Delete", fn: handleDelete },
    { id: ON_PAUSE, label: "Pause", fn: handlePause },
    { id: ON_STOP, label: "Stop", fn: handleStop },
    { id: ON_START, label: "Start", fn: handleStart },
  ];

  return <DataTable title="Networks" schema={schema} data={data} cmds={commands} />;
}
