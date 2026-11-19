import { HardHat, IndianRupeeIcon } from "lucide-react";
import CrmSidebar from "../crm/CrmSidebar";

const MENU_ITEMS = [
  {
    name: "Sites",
    icon: <HardHat size={18} />,
    type: "Installation",
    path: "/fabricator/fabrication",
    activePaths: ["/fabricator/fabrication", "/fabricator/master"],
  },
  {
    name: "Commission",
    icon: <IndianRupeeIcon size={18} />,
    type: "Installation",
    path: "/fabricator/commission",
    activePaths: ["/fabricator/commission"],
  },
];

const Sidebar = ({ isOpen, toggleSidebar }) => (
  <CrmSidebar
    isOpen={isOpen}
    toggleSidebar={toggleSidebar}
    menuItems={MENU_ITEMS}
  />
);

export default Sidebar;
