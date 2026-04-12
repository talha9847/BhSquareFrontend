import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Truck,
  User,
  ChevronRight,
  Loader2,
  Clock,
  ShieldCheck,
  Package,
  Car,
  Users,
  LayoutGrid,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AllDispatch = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // 'pending' or 'done'

  const [dispatches, setDispatches] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchDispatches = async () => {
    try {
      setPageLoading(true);
      const res = await axios.get(`/api/dispatch/fetchDispatchesByStatus`, {
        params: { status: activeTab },
        withCredentials: true,
      });

      if (res.status === 200) {
        setDispatches(res.data.data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to fetch records`);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchDispatches();
  }, [activeTab]);

  const filteredData = dispatches.filter((d) => {
    const matchesSearch =
      d.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.driver_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.vehicle?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate stats based on total fetch if needed,
  // though typically these would come from a summary API
  const stats = {
    total: dispatches.length,
    pending: dispatches.filter((d) => d.status === "pending").length,
    done: dispatches.filter((d) => d.status === "done").length,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="All Dispatch"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
          {/* HEADER SECTION - Styled like AllKitReady */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight uppercase text-slate-800">
                Dispatch <span className="text-[#1a5695]">Registry</span>
              </h1>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Monitoring {activeTab} stage logistics & fleet
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Quick Actions */}
              <div className="flex gap-2 mr-2">
                <button
                  onClick={() => navigate("/drivers")}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm"
                >
                  <Users size={14} className="text-[#1a5695]" /> Drivers
                </button>
                <button
                  onClick={() => navigate("/cars")}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm"
                >
                  <Car size={14} className="text-[#1a5695]" /> Fleet
                </button>
              </div>

              {/* TAB TOGGLE */}
              <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                {["pending", "done"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                      activeTab === tab
                        ? "bg-[#1a5695] text-white shadow-md"
                        : "text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {tab === "pending" ? (
                      <Clock size={14} />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SEARCH BOX */}
          <div className="relative mb-8">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
              size={20}
            />
            <input
              type="text"
              placeholder={`SEARCH BY CUSTOMER, DRIVER, OR VEHICLE...`}
              className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-[28px] outline-none text-[11px] font-bold uppercase tracking-widest focus:border-[#1a5695] shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* DATA TABLE */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            {pageLoading ? (
              <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin mb-4" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Loading Logistics...
                </span>
              </div>
            ) : filteredData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Customer Details
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Logistics & Fleet
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                        Status
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredData.map((d) => (
                      <tr
                        key={d.id}
                        className="group hover:bg-slate-50/30 transition-colors"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#1a5695]/5 text-[#1a5695] rounded-2xl flex items-center justify-center font-black text-lg border border-[#1a5695]/10">
                              {d.customer_name?.charAt(0)}
                            </div>
                            <div>
                              <p
                                onClick={() => {
                                  navigate("/master", {
                                    state: {
                                      customerId: d.customer_id,
                                      leadId: d.lead_id,
                                    },
                                  });
                                }}
                                className="font-black text-slate-800 text-sm uppercase cursor-pointer"
                              >
                                {d.customer_name}
                              </p>
                              <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase mt-0.5">
                                <MapPin size={12} className="text-[#1a5695]" />
                                <span className="truncate max-w-[200px]">
                                  {d.address}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          {d.driver_name ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-[11px] font-black text-slate-700 uppercase">
                                <User size={14} className="text-slate-400" />{" "}
                                {d.driver_name}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-black text-[#1a5695] uppercase tracking-wider">
                                <Truck size={14} /> {d.vehicle}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black text-slate-300 uppercase italic">
                              Unassigned
                            </span>
                          )}
                        </td>

                        <td className="px-8 py-6 text-center">
                          <div
                            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                              activeTab === "done"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-amber-50 text-amber-600 border-amber-100"
                            }`}
                          >
                            {activeTab === "done" ? (
                              <ShieldCheck size={12} />
                            ) : (
                              <Clock size={12} />
                            )}
                            {activeTab === "done" ? "Delivered" : "In Transit"}
                          </div>
                        </td>

                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() =>
                              activeTab === "pending"
                                ? navigate("/dispatch", {
                                    state: { dispatchId: d.id },
                                  })
                                : navigate("/fabrication")
                            }
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1a5695] transition-all shadow-sm"
                          >
                            {activeTab === "pending" ? "Manage" : "Fabrication"}
                            <ArrowRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 text-slate-400">
                <Package size={60} className="mb-4 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                  No {activeTab} logistics found
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllDispatch;
