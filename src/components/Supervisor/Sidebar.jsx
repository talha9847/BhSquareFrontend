import { IndianRupee } from "lucide-react";
import CrmSidebar from "../crm/CrmSidebar";

const MENU_ITEMS = [
  {
    name: "Commission",
    icon: <IndianRupee size={18} />,
    type: "Installation",
    path: "/supervisor/commission",
    activePaths: ["/supervisor/commission"],
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
