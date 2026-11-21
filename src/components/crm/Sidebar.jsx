import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  UserPlus,
  Briefcase,
  ClipboardEdit,
  PackageSearch,
  Truck,
  Hammer,
  Zap,
  CheckCircle2,
  Settings2,
  Warehouse,
  Cable,
  Globe,
  Banknote,
  UserCheck,
  HardHat,
  Calculator,
  FileCheck,
  Database,
  BanknoteIcon,
  Package2Icon,
} from "lucide-react";
import axios from "axios";
import CrmSidebar from "./CrmSidebar";

const MENU_ITEMS = [
  // --- OVERVIEW ---
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    type: "Overview",
    path: "dashboard",
    activePaths: ["/dashboard"],
  },

  // --- BUSINESS DEVELOPMENT ---
  {
    name: "Leads",
    icon: <UserPlus size={18} />,
    type: "Business Development",
    path: "leads",
    activePaths: ["/leads", "/followup"],
  },
  {
    name: "Web Leads",
    icon: <Globe size={18} />,
    type: "Business Development",
    path: "webleads",
    activePaths: ["/webleads"],
  },
  {
    name: "Customers",
    icon: <Briefcase size={18} />,
    type: "Business Development",
    path: "customers",
    activePaths: [
      "/customers",
      "/documentcollection",
      "/namechange",
      "/allcustomers",
      "/master",
    ],
  },

  // --- PROJECT LIFECYCLE ---
  {
    name: "Registration",
    icon: <ClipboardEdit size={18} />,
    type: "Project Lifecycle",
    path: "registration",
    activePaths: ["/registration", ""],
  },
  {
    name: "Loan",
    icon: <BanknoteIcon size={18} />,
    type: "Project Lifecycle",
    path: "loan",
    activePaths: ["/loan", ""],
  },
  {
    name: "Kit Ready",
    icon: <PackageSearch size={18} />,
    type: "Project Lifecycle",
    path: "kitready",
    activePaths: [
      "/loanstep",
      "/kitready",
      "/brands",
      "/preparekit",
      "/allkitready",
    ],
  },
  {
    name: "File Generation",
    icon: <ClipboardEdit size={18} />,
    type: "Project Lifecycle",
    path: "allregistration",
    // activePaths: ["/registration", "/allregistration"],
  },
  {
    name: "Dispatch",
    icon: <Truck size={18} />,
    type: "Project Lifecycle",
    path: "dispatch",
    activePaths: ["/dispatch", "/drivers", "/cars", "/alldispatch"],
  },
  {
    name: "Fabrication",
    icon: <Hammer size={18} />,
    type: "Project Lifecycle",
    path: "fabrication",
    activePaths: ["/fabrication", "/allfabrication"],
  },
  {
    name: "Wiring",
    icon: <Zap size={18} />,
    type: "Project Lifecycle",
    path: "wiring",
    activePaths: [
      "/wiring",
      "/technicians",
      "/updatewiring",
      "/finalizewiring",
    ],
  },
  {
    name: "Final Stage",
    icon: <CheckCircle2 size={18} />,
    type: "Project Lifecycle",
    path: "finalstage",
    activePaths: ["/finalstage", "/allfinalstage"],
  },

  // --- LOGISTICS & STORES ---
  {
    name: "Inventory",
    icon: <Warehouse size={18} />,
    type: "Logistics & Stores",
    path: "inventory",
    activePaths: ["/inventory"],
  },
  {
    name: "Wiring Inventory",
    icon: <Cable size={18} />,
    type: "Logistics & Stores",
    path: "winventory",
    activePaths: ["/winventory"],
  },

  // --- FINANCE & COMMISSIONS ---
  {
    name: "Commissions",
    icon: <Banknote size={18} />,
    type: "Finance",
    path: "commissions",
    activePaths: ["/commissions", "/allcommissions"],
  },
  {
    name: "Supervisor Commi.",
    icon: <UserCheck size={18} />,
    type: "Finance",
    path: "supercommissions",
    activePaths: ["/supercommissions", "/allsupercommissions"],
  },
  {
    name: "Fabricator Commi.",
    icon: <HardHat size={18} />,
    type: "Finance",
    path: "fabcommissions",
    activePaths: ["/fabcommissions", "/allfabcommissions"],
  },
  {
    name: "Cost Analysis",
    icon: <Calculator size={18} />,
    type: "Finance",
    path: "cost",
    activePaths: ["/cost"],
  },

  // --- AFTER SALES & SYSTEM ---
  {
    name: "Completed",
    icon: <FileCheck size={18} />,
    type: "After Sales",
    path: "completed",
    activePaths: ["/completed"],
  },
  {
    name: "Backup",
    icon: <Database size={18} />,
    type: "System",
    path: "backup",
    activePaths: ["/backup"],
  },
  {
    name: "Users",
    icon: <Settings2 size={18} />,
    type: "System",
    path: "users",
    activePaths: ["/users"],
  },
  {
    name: "Agency",
    icon: <Package2Icon size={18} />,
    type: "System",
    path: "agencymanager",
    activePaths: ["/agencymanager"],
  },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [leadCount, setLeadCount] = useState(0);

  useEffect(() => {
    const fetchPendingLeadsCount = async () => {
      try {
        const result = await axios.get("/api/leads/fetchPendingLeadsCount", {
          withCredentials: true,
        });
        setLeadCount(result.data.count);
      } catch {
        // The badge is decorative; a failed count should never block navigation.
      }
    };

    fetchPendingLeadsCount();
  }, []);

  const menuItems = MENU_ITEMS.map((item) =>
    item.name === "Leads" && leadCount > 0
      ? { ...item, count: leadCount }
      : item,
  );

  return (
    <CrmSidebar
      isOpen={isOpen}
      toggleSidebar={toggleSidebar}
      menuItems={menuItems}
    />
  );
};

export default Sidebar;
