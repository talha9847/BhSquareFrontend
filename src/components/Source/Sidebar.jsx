import { Users, UserPlus, IndianRupeeIcon } from "lucide-react";
import CrmSidebar from "../crm/CrmSidebar";

const MENU_ITEMS = [
  {
    name: "Leads",
    icon: <UserPlus size={18} />,
    type: "Installation",
    path: "/source/leads",
    activePaths: ["/source/leads"],
  },
  {
    name: "Customers",
    icon: <Users size={18} />,
    type: "Installation",
    path: "/source/customers",
    activePaths: ["/source/customers"],
  },
  {
    name: "Commission",
    icon: <IndianRupeeIcon size={18} />,
    type: "Installation",
    path: "/source/commissions",
    activePaths: ["/source/commissions"],
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
