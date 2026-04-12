import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Phone,
  Zap,
  Calendar,
  ChevronRight,
  Loader2,
  UserPlus,
  Lock,
  Clock,
  CheckCircle2,
  Edit3,
  Share,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AllWiring = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wiringLogs, setWiringLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // By default, set the tab to "pending"
  const [activeTab, setActiveTab] = useState("pending");

  // --- FETCH DATA BASED ON STATUS ---
  const fetchWiringByStatus = async () => {
    setLoading(true);
    try {
      // Pass status in query: /api/wiring/fetchWiringByStatus?status=pending
      const res = await axios.get(
        `/api/wiring/getWiringCustomerDetailsByStatus`,
        {
          params: { status: activeTab },
          withCredentials: true,
        },
      );

      if (res.status === 200) {
        setWiringLogs(res.data.data || []);
      }
    } catch (err) {
      console.error("Wiring Fetch Error:", err);
      toast.error("Failed to load wiring records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWiringByStatus();
  }, [activeTab]);

  const filteredList = wiringLogs.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.customer_name?.toLowerCase().includes(search) ||
      item.wiring_id?.toString().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Wiring"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-5xl font-black tracking-tight uppercase text-slate-800">
                Wiring <span className="text-[#1a5695]">Logs</span>
              </h1>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                {activeTab} Wiring • {wiringLogs.length} total
              </p>
            </div>
          </div>

          {/* TAB & SEARCH CONTROLS */}
          <div className="flex flex-col lg:flex-row gap-6 mb-10">
            <div className="flex bg-white p-1.5 rounded-[24px] border border-slate-200 shadow-sm w-fit">
              {["pending", "done"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-12 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab
                      ? "bg-[#1a5695] text-white shadow-lg"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative flex-1">
              <Search
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
                size={20}
              />
              <input
                type="text"
                placeholder="SEARCH BY CUSTOMER OR WIRING ID..."
                className="w-full pl-16 pr-6 py-4.5 bg-white border border-slate-200 rounded-[24px] outline-none text-[11px] font-bold uppercase tracking-widest focus:border-[#1a5695] transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* CONTENT AREA */}
          {loading ? (
            <div className="py-40 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Loading Wiring Data...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredList.map((item) => {
                const isLocked = item.wiring_inv_status === "done";

                return (
                  <div
                    key={item.wiring_id}
                    className="bg-white rounded-[40px] border border-slate-200 p-8 hover:shadow-2xl hover:border-[#1a5695]/40 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="p-4 bg-slate-50 rounded-2xl text-[#1a5695]">
                        <Zap
                          size={24}
                          fill={
                            item.wiring_status === "done" ? "#1a5695" : "none"
                          }
                        />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">
                          W-ID: {item.wiring_id}
                        </span>
                        <div
                          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter ${
                            item.wiring_status === "done"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}
                        >
                          {item.wiring_status === "done" ? (
                            <CheckCircle2 size={10} />
                          ) : (
                            <Clock size={10} />
                          )}
                          {item.wiring_status}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-slate-800 uppercase mb-2 line-clamp-1 group-hover:text-[#1a5695] transition-colors">
                      {item.customer_name}
                    </h3>

                    {/* TECHNICIAN INFO */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                        <UserPlus size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">
                          {item.technician_name || "UNASSIGNED"}
                        </span>
                        {isLocked && (
                          <Lock size={12} className="text-slate-400 ml-1" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-4 text-slate-400">
                        <Phone size={16} />
                        <span className="text-[11px] font-bold text-slate-700 uppercase">
                          {item.contact_number}
                        </span>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="mt-10 flex gap-3">
                      <button
                        onClick={() =>
                          navigate("/master", {
                            state: {
                              customerId: item.customer_id,
                              leadId: item.lead_id,
                            },
                          })
                        }
                        className="flex-1 flex justify-between items-center bg-slate-50 p-4 rounded-[20px] hover:bg-[#1a5695]/5 transition-colors group/btn"
                      >
                        <span className="text-[10px] font-black text-[#1a5695] uppercase tracking-widest">
                          View Master
                        </span>
                        <ChevronRight
                          size={18}
                          className="text-[#1a5695] group-hover/btn:translate-x-1 transition-transform"
                        />
                      </button>

                      {!isLocked ? (
                        <button
                          onClick={() =>
                            navigate("/updatewiring", {
                              state: {
                                wiring_id: item.wiring_id,
                                customer_id: item.customer_id,
                              },
                            })
                          }
                          className="p-4 bg-white text-slate-400 hover:text-[#1a5695] rounded-[20px] border border-slate-200 hover:border-[#1a5695] transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            navigate("/finalizewiring", {
                              state: { selectedWiring: item },
                            })
                          }
                          className="p-4 bg-[#1a5695] text-white rounded-[20px] shadow-lg shadow-blue-100 hover:bg-[#15467a] transition-all"
                        >
                          <Share size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredList.length === 0 && !loading && (
                <div className="col-span-full py-32 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                  <Search size={40} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    No {activeTab} wiring records found
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllWiring;
