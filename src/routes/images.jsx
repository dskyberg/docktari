import { useEffect, useState } from "react";

import DataTable, { ON_REFRESH, ON_STOP, ON_PAUSE, ON_START, ON_DELETE } from "../components/DataTable";
import { Loader, Code, ScrollArea } from "@mantine/core";

import { invoke } from "@tauri-apps/api/core";
import { displayId, displayTimestamp } from "../data/utils";

const displayField = (field, data) => {
  if (field == "Id") {
    return displayId(data);
  } else if (field == "Repository") {
    return data[0].split(":")[0];
  } else if (field == "Tags") {
    return data.map((tag) => tag.split(":")[1]).join(", ");
  } else if (field == "Created") {
    return displayTimestamp(data);
  } else {
    return data;
  }
};

const schema = {
  idField: "Id",
  inspect: "inspect_image",
  fields: [
    { id: "Id", label: "Image ID", filtered: false, displayFn: (data) => displayField("Id", data.Id) },
    {
      id: "Repository",
      label: "Repository",
      filtered: false,
      displayFn: (data) => displayField("Repository", data.RepoTags),
    },
    { id: "Tags", label: "Tags", filtered: false, displayFn: (data) => displayField("Tags", data.RepoTags) },
    { id: "Created", label: "Created", filtered: false, displayFn: (data) => displayField("Created", data.Created) },
    { id: "Size", label: "Size", filtered: false, displayFn: (data) => displayField("Size", data.Size) },
  ],
};

export default function Images() {
  const [data, setData] = useState([]);

  const list_images = async () => {
    invoke("list_images").then((imageSummaryData) => {
      console.log("list_images");
      setData(imageSummaryData);
    });
  };

  useEffect(() => {
    list_images();
  }, []);

  const handleRefresh = async () => {
    list_images();
  };

  const handleDelete = async (ids) => {
    for (const id of ids) {
      await await invoke("remove_image", { id });
    }
    list_images();
  };

  const handleStop = (ids) => {
    ids.forEach((id) => console.log("Image stop for", id));
  };

  const handlePause = (ids) => {
    ids.forEach((id) => console.log("Image pause for", id));
  };

  const handleStart = (ids) => {
    ids.forEach((id) => console.log("Image start for", id));
  };
  const commands = [
    { id: ON_REFRESH, label: "Refresh", fn: handleRefresh },
    { id: ON_DELETE, label: "Delete", fn: handleDelete },
    { id: ON_PAUSE, label: "Pause", fn: handlePause },
    { id: ON_STOP, label: "Stop", fn: handleStop },
    { id: ON_START, label: "Start", fn: handleStart },
  ];

  return <DataTable title="Images" schema={schema} data={data} cmds={commands} />;
}
