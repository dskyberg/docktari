import { Suspense } from "react";
import { useLoaderData, Await } from "react-router-dom";
import DataError from "../components/DataError";
import { Skeleton, Group, Stack, Text, Title } from "@mantine/core";

import dockerLogo from "../assets/docker.png";

const LOGO_HEIGHT = 100;

function displayField(field, data) {
  return data;
}

const schema = {
  idField: "Version",
  fields: [
    { id: "Version", label: "Version", filtered: false, displayFn: (data) => displayField("Version", data.Version) },
    { id: "Arch", label: "Arch", filtered: false, displayFn: (data) => displayField("Arch", data.Arch) },
    { id: "Os", label: "Os", filtered: true, displayFn: (data) => displayField("Os", data.Os) },
    {
      id: "GoVersion",
      label: "Go Version",
      filtered: false,
      displayFn: (data) => displayField("GoVersion", data.GoVersion),
    },
  ],
};

export default function Home() {
  const data = useLoaderData(); // DeferredData returns an object with Promises

  const Fallback = () =>
    schema.fields.map((field) => (
      <Group key={`docker-version-${field.id}`}>
        <Skeleton w={75} h={20} />
        <Skeleton w={100} h={20} />
      </Group>
    ));

  const Resolved = ({ version }) => {
    return schema.fields.map((field) => (
      <Group key={`docker-version-${field.id}`}>
        <Text fw={700} w={75} size="sm">
          {field.label}
        </Text>

        <Text size="sm">{field.displayFn(version)}</Text>
      </Group>
    ));
  };

  return (
    <Group>
      <img src={dockerLogo} alt="Docker Logo" height={LOGO_HEIGHT} />
      <Stack gap="xs">
        <Title order={1}>Docktari</Title>
        <Text>Docker Desktop with Tauri</Text>
        <Suspense fallback={<Fallback />}>
          <Await resolve={data.version} errorElement={<DataError maw={400} />}>
            {(version) => <Resolved version={version} />}
          </Await>
        </Suspense>
      </Stack>
    </Group>
  );
}
