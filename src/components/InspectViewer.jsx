import { useEffect, useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { notifications } from "@mantine/notifications";
import { Loader, ScrollArea, Code, Tabs } from "@mantine/core";
import LogViewer from "./LogViewer";

export default function InspectViewer({ id, inspect }) {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const codeRef = useRef(null);

  useEffect(() => {
    console.log("InspectViewer open");
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
  }, []);

  if (error) {
    return null;
  }

  if (data == undefined) {
    return <Loader color="blue" />;
  }

  return (
    <ScrollArea h={300} w={800}>
      <Code ref={codeRef} block>
        {data}
      </Code>
    </ScrollArea>
  );
}
