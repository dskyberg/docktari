import { Outlet } from "react-router-dom";
import { AppShell, Container } from "@mantine/core";
import Drawer from "../components/Drawer";

export default function App() {
  return (
    <AppShell padding="md" navbar={{ width: 64 }}>
      <AppShell.Navbar>
        <Drawer />
      </AppShell.Navbar>
      <AppShell.Main>
        <div w="100%" h="100%">
          <Outlet />
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
