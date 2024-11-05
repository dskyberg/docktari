import { useState, useEffect } from "react";
import DataTable, { ON_STOP, ON_PAUSE, ON_START, ON_DELETE, ON_UNPAUSE, ON_REFRESH } from "../components/DataTable";
import { invoke } from "@tauri-apps/api/core";
import { displayId, displayTimestamp } from "../data/utils";
import { Loader, Code, ScrollArea, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";

function displayField(field, data) {
  if (field == "Id") {
    return displayId(data);
  } else if (field == "Ports") {
    return data.map((port) => <p>{`${port.IP}:${port.PrivatePort}->${port.PublicPort}`}</p>);
  } else if (field == "Names") {
    return data.join(",");
  } else if (field == "Created") {
    return displayTimestamp(data);
  } else {
    return data;
  }
}

const schema = {
  idField: "Id",
  inspect: "inspect_container",
  fields: [
    { id: "Id", label: "ID", filtered: false, displayFn: (data) => displayField("Id", data.Id) },
    { id: "Names", label: "Names", filtered: true, displayFn: (data) => displayField("Names", data.Names) },
    { id: "Image", label: "Image", filtered: false, displayFn: (data) => displayField("Image", data.Image) },
    { id: "Command", label: "Command", filtered: true, displayFn: (data) => displayField("Command", data.Command) },
    { id: "Created", label: "Created", filtered: false, displayFn: (data) => displayField("Created", data.Created) },
    { id: "Status", label: "Status", filtered: false, displayFn: (data) => displayField("Status", data.Status) },
    {
      id: "Ports",
      label: "Ports",
      filtered: false,
      displayFn: (data) => displayField("Ports", data.Ports),
      width: 150,
    },
  ],
};

export default function Containers() {
  const [data, setData] = useState([]);

  useEffect(() => {
    list_data();
  }, []);

  const list_data = async () => {
    invoke("list_containers").then((container_data) => {
      setData(container_data);
    });
  };

  const handleRefresh = async () => {
    list_data();
  };

  const handleDelete = async (ids) => {
    let refresh_data = data;
    for (const id of ids) {
      try {
        await invoke("remove_container", { id });
        refresh_data = data.filter((i) => i != id);
      } catch (err) {
        notifications.show({ title: "Error", message: err, color: "red" });
      }
    }
    setData(refresh_data);
  };

  const handleStop = async (ids) => {
    for (const id of ids) {
      try {
        await invoke("stop_container", { id });
      } catch (err) {
        notifications.show({ title: "Error", message: err, color: "red" });
      }
    }
    list_data();
  };

  const handlePause = async (ids) => {
    for (const id of ids) {
      try {
        await invoke("pause_container", { id });
      } catch (err) {
        notifications.show({ title: "Error", message: err, color: "red" });
      }
    }
    list_data();
  };

  const handleUnpause = async (ids) => {
    for (const id of ids) {
      try {
        await invoke("unpause_container", { id });
      } catch (err) {
        notifications.show({ title: "Error", message: err, color: "red" });
      }
    }
    list_data();
  };

  const handleStart = async (ids) => {
    for (const id of ids) {
      try {
        await invoke("start_container", { id });
      } catch (err) {
        notifications.show({ title: "Error", message: err, color: "red" });
      }
    }
    list_data();
  };

  const commands = [
    { id: ON_REFRESH, label: "Refresh", fn: handleRefresh },
    { id: ON_DELETE, label: "Delete", fn: handleDelete },
    { id: ON_PAUSE, label: "Pause", fn: handlePause },
    { id: ON_STOP, label: "Stop", fn: handleStop },
    { id: ON_UNPAUSE, label: "Unpause", fn: handleUnpause },
    { id: ON_START, label: "Start", fn: handleStart },
  ];

  return (
    <Stack>
      <DataTable title="" schema={schema} data={data} cmds={commands} />
    </Stack>
  );
}
