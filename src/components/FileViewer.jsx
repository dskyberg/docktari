import { useState, useEffect } from "react";
import { save } from "@tauri-apps/plugin-dialog";

import { notifications } from "@mantine/notifications";
import { Menu, Stack, Group, Loader, rem } from "@mantine/core";
import { IconFolder, IconFolderOpen, IconFile, IconDownload } from "@tabler/icons-react";

import { fetch_folder, FolderEntry } from "../data/loaders";
import { invoke } from "@tauri-apps/api/core";

async function save_file(id, entry) {
  const options = {
    canCreateDirectories: true,
    defaultPath: entry.label,
  };
  const path = await save(options);
  const invoke_opts = { id, options: { src: entry.value, target: path } };
  invoke("container_save_file", invoke_opts)
    .then(() => {
      notifications.show({ title: "File Saved", message: entry.value + " was saved to " + path, color: "green" });
    })
    .catch((err) => {
      notifications.show({ title: "Error", message: err, color: "red" });
    });
}

function Leaf({ id, entry }) {
  return (
    <Menu position="right-start" shadow="md" width={200}>
      <Menu.Target>
        <Group gap={5} w={250}>
          <IconFile />
          <span>{entry.label}</span>
        </Group>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => save_file(id, entry)}
          leftSection={<IconDownload style={{ width: rem(14), height: rem(14) }} />}
        >
          Download
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export function Folder({ id, entry }) {
  const [open, setOpen] = useState(entry?.label === "/" ? true : false);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id || data || !open) return;

    const fetchData = async () => {
      setLoading(true);
      fetch_folder(id, entry.value)
        .then((results) => {
          setLoading(false);
          setData(results);
        })
        .catch((err) => {
          setLoading(false);
          notifications.show({ title: "Error", message: err, color: "red" });
        });
    };
    console.log("Folder is fetching:", id, open, entry);
    fetchData();
  }, [id, open]);

  if (!id) {
    return null;
  }

  const entries = () => {
    if (!open) return null;
    if (!loading && !data) return null;

    return (
      <Stack ml={"1rem"}>
        {loading ? (
          <Loader color="blue" />
        ) : (
          data.map((entry) =>
            entry.isDirectory ? (
              <Folder key={entry.value} id={id} entry={entry} />
            ) : (
              <Leaf key={entry.value} id={id} entry={entry} />
            ),
          )
        )}
      </Stack>
    );
  };

  return (
    <Stack>
      <Group
        gap={5}
        onClick={() => {
          setOpen(!open);
        }}
      >
        {open == true ? <IconFolderOpen /> : <IconFolder />}
        <span>{entry.label}</span>
      </Group>
      {entries()}
    </Stack>
  );
}

export default function FileViewer({ id, root }) {
  let entry = new FolderEntry(root, root);
  return <Folder id={id} entry={entry} />;
}
