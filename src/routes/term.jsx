import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

import { Select, Stack, Text } from "@mantine/core";

import FileViewer from "../components/FileViewer";

export default function Term() {
  const [ids, setIds] = useState();
  const [id, setId] = useState("");
  const no = false;
  useEffect(() => {
    invoke("list_containers", { listOptions: { filters: { status: ["running"] } } })
      .then((data) => {
        let result = data.map((c) => ({ value: c.Id, label: c.Names.join(",") }));
        setIds(result);
      })
      .catch((err) => console.log(err));
  }, []);

  if (ids === undefined) return null;

  return (
    <Stack>
      <Select label="Container" placeholder="Select a container" data={ids} value={id} onChange={setId} />
      <FileViewer id={id} root="/" />
    </Stack>
  );
}
