import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Compass,
  FolderOpen,
  FileSearch,
  Bolt,
  Box,
  HardHat,
  Wrench,
  Settings,
  BarChart3,
  Plus,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBridgeCircleExclamation } from "react-icons/fa6";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();
  const [leadCount, setLeadCount] = useState(0);

  const apiUrl = import.meta.env.VITE_API_URL;

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      type: "Operations",
      path: "dashboard",
      activePaths: ["/dashboard"], // highlight for both
    },
    {
      name: "Leads",
      icon: <Users size={18} />,
      count: leadCount,
      type: "Operations",
      path: "leads",
      activePaths: ["/leads"], // highlight for both
    },
    {
      name: "Customers",
      icon: <Compass size={18} />,
      count: 5,
      type: "Operations",
      path: "customers",
      activePaths: ["/customers", "/documentcollection", "/namechange"], // highlight for both
    },
    // {
    //   name: "Doc Collection",
    //   icon: <FolderOpen size={18} />,
    //   count: 8,
    //   type: "Operations",
    //   path: "documentcollection",
    // },
    {
      name: "Registration",
      icon: <Box size={18} />,
      type: "Operations",
      path: "registration",
    },
    {
      name: "Kit Ready",
      icon: <Box size={18} />,
      type: "Operations",
      path: "kitready",
      activePaths: ["/loanstep", "/kitready", "/brands", "/preparekit"], // highlight for both
    },
    {
      name: "Dispatch",
      icon: <Box size={18} />,
      type: "Operations",
      path: "dispatch",
      activePaths: ["/dispatch"], // highlight for both
    },
    {
      name: "Fabricatoin",
      icon: <FaBridgeCircleExclamation size={18} />,
      type: "Operations",
      path: "fabrication",
    },
    {
      name: "Inventory",
      icon: <HardHat size={18} />,
      type: "Installation",
      path: "/inventory",
      activePaths: ["/inventory"],
    },
    { name: "AMC & Service", icon: <Wrench size={18} />, type: "After Sales" },
  ];

  const fetchPendingLeadsCount = async () => {
    try {
      const result = await axios.get(
        `${apiUrl}/api/leads/fetchPendingLeadsCount`,
      );
      setLeadCount(result.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPendingLeadsCount();
  }, []);

  const categories = [...new Set(menuItems.map((item) => item.type))];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Brand Header */}
        <div className="bg-[#1a5695] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f39200] rounded-2xl flex items-center justify-center shadow-lg">
              <Bolt className="text-white" size={20} fill="currentColor" />
            </div>
            <div>
              <p className="font-bold text-white text-lg tracking-tight">
                BHSquare
              </p>
              <p className="text-blue-200 text-[10px] font-bold tracking-widest uppercase">
                Solar ERP
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto h-[calc(100vh-160px)]">
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
                {cat}
              </p>
              {menuItems
                .filter((item) => item.type === cat)
                .map((item) => {
                  // Compute isActive BEFORE returning JSX
                  const isActive = item.activePaths
                    ? item.activePaths.includes(location.pathname)
                    : location.pathname === `/${item.path}`;

                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActive(item.path);
                        navigate(`/${item.path}`);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-1 ${
                        isActive
                          ? "bg-[#1a5695] text-white shadow-md shadow-blue-900/20"
                          : "text-slate-600 hover:bg-slate-100 hover:text-[#1a5695]"
                      }`}
                    >
                      <span
                        className={`p-1.5 rounded-lg ${isActive ? "bg-white/20" : "bg-slate-100"}`}
                      >
                        {item.icon}
                      </span>
                      <span className="text-sm font-semibold">{item.name}</span>
                      {item.count >= 0 && (
                        <span
                          className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.path === "Leads"
                              ? "bg-[#f39200] text-white"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                      {item.alert && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </button>
                  );
                })}
            </div>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 bg-white">
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
