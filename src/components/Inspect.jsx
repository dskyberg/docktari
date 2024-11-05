import { useEffect, useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { notifications } from "@mantine/notifications";
import { Loader, ScrollArea, Code, Tabs } from "@mantine/core";
import { useDocumentVisibility } from "@mantine/hooks";
import LogViewer from "./LogViewer";

export default function Inspect({ id, inspect, open }) {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const codeRef = useRef(null);

  useEffect(() => {
    if (open) {
      invoke(inspect, { id })
        .then((result) => setData(JSON.stringify(result, null, 4)))
        .catch((err) => {
          setError(err);
          notifications.show({ title: "Error", message: err, color: "red" });
        });
    } else {
      setData();
    }
  }, [open]);

  if (!open || error) {
    return null;
  }

  if (data == undefined) {
    return <Loader color="blue" />;
  }

  return (
    <Tabs keepMounted={false} defaultValue="inspect">
      <Tabs.List justify="center">
        <Tabs.Tab value="inspect">Inspect</Tabs.Tab>
        <Tabs.Tab value="logs">Logs</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="inspect">
        <ScrollArea h={300} w={800}>
          <Code ref={codeRef} block>
            {data}
          </Code>
        </ScrollArea>
      </Tabs.Panel>
      <Tabs.Panel value="logs">
        <LogViewer id={id} />
      </Tabs.Panel>
    </Tabs>
  );
}
