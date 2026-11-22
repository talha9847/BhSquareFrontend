import CrmSidebar from "../crm/CrmSidebar";
import {
  LayoutDashboard,
  UserPlus,
  Briefcase,
  ClipboardEdit,
  PackageSearch,
  Truck,
  Hammer,
  Zap,
  Warehouse,
  Cable,
} from "lucide-react";
const MENU_ITEMS = [
  {
    name: "Kit Ready",
    icon: <PackageSearch size={18} />,
    type: "Project Lifecycle",
    path: "site-supervisor/kitready",
    activePaths: [
      "/loanstep",
      "/site-supervisor/kitready",
      "/brands",
      "/site-supervisor/preparekit",
      "/allkitready",
    ],
  },
  // {
  //   name: "File Generation",
  //   icon: <ClipboardEdit size={18} />,
  //   type: "Project Lifecycle",
  //   path: "allregistration",
  //   // activePaths: ["/registration", "/allregistration"],
  // },
  {
    name: "Dispatch",
    icon: <Truck size={18} />,
    type: "Project Lifecycle",
    path: "site-supervisor/dispatch",
    activePaths: [
      "/site-supervisor/dispatch",
      "/drivers",
      "/cars",
      "/alldispatch",
    ],
  },
  {
    name: "Fabrication",
    icon: <Hammer size={18} />,
    type: "Project Lifecycle",
    path: "site-supervisor/fabrication",
    activePaths: ["/site-supervisor/fabrication", "/allfabrication"],
  },
  {
    name: "Wiring",
    icon: <Zap size={18} />,
    type: "Project Lifecycle",
    path: "site-supervisor/wiring",
    activePaths: [
      "/site-supervisor/wiring",
      "/site-supervisor/technicians",
      "/site-supervisor/updatewiring",
      "/site-supervisor/finalizewiring",
    ],
  },

  {
    name: "Inventory",
    icon: <Warehouse size={18} />,
    type: "Logistics & Stores",
    path: "site-supervisor/inventory",
    activePaths: ["/site-supervisor/inventory"],
  },
  {
    name: "Wiring Inventory",
    icon: <Cable size={18} />,
    type: "Logistics & Stores",
    path: "site-supervisor/winventory",
    activePaths: ["/site-supervisor/winventory"],
  },
];

const SSidebar = ({ isOpen, toggleSidebar }) => (
  <CrmSidebar
    isOpen={isOpen}
    toggleSidebar={toggleSidebar}
    menuItems={MENU_ITEMS}
  />
);

export default SSidebar;
