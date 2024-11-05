import { Container, Stack, ScrollArea } from "@mantine/core";

import DrawerNavItem from "./DrawerNavItem";
import HomeIcon from "./icons/HomeIcon";
import ContainerIcon from "./icons/ContainerIcon";
import ImageIcon from "./icons/ImageIcon";
import VolumeIcon from "./icons/VolumeIcon";
import NetworkIcon from "./icons/NetworkIcon";

export default function Drawer() {
  return (
    <Container mt={"1rem"}>
      <ScrollArea h={500}>
        <Stack>
          <DrawerNavItem tooltip="Home" icon={<HomeIcon size={24} />} href="/" />
          <DrawerNavItem tooltip="Containers" icon={<ContainerIcon size={24} />} href="/containers" />
          <DrawerNavItem tooltip="Images" icon={<ImageIcon size={24} />} href="/images" />
          <DrawerNavItem tooltip="Volumes" icon={<VolumeIcon size={24} />} href="/volumes" />
          <DrawerNavItem tooltip="Networks" icon={<NetworkIcon size={24} />} href="/networks" />
          <DrawerNavItem tooltip="Terminal" icon={<NetworkIcon size={24} />} href="/term" />
        </Stack>
      </ScrollArea>
    </Container>
  );
}
