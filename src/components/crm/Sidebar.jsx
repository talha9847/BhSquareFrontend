import React, { useEffect, useState, useRef } from "react";
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
  ShieldCheck,
  Bolt,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [leadCount, setLeadCount] = useState(0);
  const activeRef = useRef(null);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      type: "Overview",
      path: "dashboard",
      activePaths: ["/dashboard"],
    },
    {
      name: "Leads",
      icon: <UserPlus size={18} />,
      count: leadCount,
      type: "Business Development",
      path: "leads",
      activePaths: ["/leads"],
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
      count: 5,
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
    {
      name: "Registration",
      icon: <ClipboardEdit size={18} />,
      type: "Project Lifecycle",
      path: "registration",
      activePaths: ["/registration", "/allregistration"],
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
      activePaths: ["/wiring", "/technicians"],
    },
    {
      name: "Final Stage",
      icon: <CheckCircle2 size={18} />,
      type: "Project Lifecycle",
      path: "finalstage",
    },
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
    {
      name: "Commissions",
      icon: <Cable size={18} />,
      type: "Logistics & Stores",
      path: "commissions",
      activePaths: ["/commissions", "/allcommissions"],
    },
    {
      name: "Completion",
      icon: <Cable size={18} />,
      type: "Logistics & Stores",
      path: "completion",
      activePaths: ["/completion"],
    },
    {
      name: "AMC & Service",
      icon: <ShieldCheck size={18} />,
      type: "After Sales",
      path: "amc",
    },
    {
      name: "Users",
      icon: <Settings2 size={18} />,
      type: "System",
      path: "users",
    },
  ];

  const fetchPendingLeadsCount = async () => {
    try {
      const result = await axios.get(`/api/leads/fetchPendingLeadsCount`, {
        withCredentials: true,
      });
      setLeadCount(result.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPendingLeadsCount();
  }, []);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [location.pathname]);

  const categories = [...new Set(menuItems.map((item) => item.type))];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col`}
      >
        <div className="bg-[#1a5695] px-3 py-4 shrink-0 border-b border-white/10">
          <div className="w-full h-17 bg-white rounded-xl shadow-inner flex items-center justify-center overflow-hidden">
            <img
              src={logo}
              alt="BHSquare Logo"
              className="w-full h-full object-contain scale-[2.6] transform"
            />
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-hide">
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
                {cat}
              </p>
              {menuItems
                .filter((item) => item.type === cat)
                .map((item) => {
                  const isActive = item.activePaths
                    ? item.activePaths.includes(location.pathname)
                    : location.pathname === `/${item.path}`;

                  return (
                    <button
                      key={item.name}
                      ref={isActive ? activeRef : null}
                      onClick={() => {
                        navigate(`/${item.path}`);
                        if (window.innerWidth < 1024) toggleSidebar();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-1 ${
                        isActive
                          ? "bg-[#1a5695] text-white shadow-md shadow-blue-900/20"
                          : "text-slate-600 hover:bg-slate-100 hover:text-[#1a5695]"
                      }`}
                    >
                      <span
                        className={`p-1.5 rounded-lg ${
                          isActive ? "bg-white/20" : "bg-slate-100"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="text-sm font-semibold">{item.name}</span>
                      {item.count >= 0 && (
                        <span
                          className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="shrink-0 p-4 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
            <div className="w-9 h-9 rounded-lg bg-[#1a5695] text-white flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">
                Admin User
              </p>
              <p className="text-[10px] text-slate-500">Super Admin</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
