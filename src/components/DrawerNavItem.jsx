import { useNavigate, useLocation } from "react-router-dom";
import "./DrawerNavItem.css";
import { Button, Tooltip } from "@mantine/core";

const DrawerNavItem = ({ href, tooltip, icon }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const active = location.pathname === href;

  return (
    <Button className="drawer-nav-button" w={30} p={2} data-disabled={active} onClick={() => navigate(href)}>
      <Tooltip label={tooltip}>{icon}</Tooltip>
    </Button>
  );
};
export default DrawerNavItem;
