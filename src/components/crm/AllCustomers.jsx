import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Phone,
  MapPin,
  Zap,
  Calendar,
  ChevronRight,
  Plus,
  Loader2,
  Shield,
} from "lucide-react";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const apiUrl = import.meta.env.VITE_API_URL;

const AllCustomers = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending"); // Match your query logic

  // --- DATE ONLY +5:30 SHIFT ---
  const formatDateOnlyIST = (dateString) => {
    if (!dateString) return "NOT SCHEDULED";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
    const localDate = new Date(date.getTime() + IST_OFFSET_MS);

    return localDate
      .toLocaleString("en-IN", {
        day: "2-digit",
        month: "SHORT",
        year: "numeric",
      })
      .toUpperCase();
  };

  // --- FETCH DATA BASED ON STATUS PARAM ---
  useEffect(() => {
    const fetchByStatus = async () => {
      setLoading(true);
      try {
        // Calling your new Node route: /api/customers/fetchByStatus?status=pending
        const res = await axios.get(`/api/customers/fetchCustomersByStatus`, {
          params: { status: activeTab },
          withCredentials: true,
        });

        if (res.status === 200) {
          console.log(res.data.data);
          setCustomers(res.data.data);
        }
      } catch (err) {
        console.error("Backend Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchByStatus();
  }, [activeTab]); // Refetch whenever the tab changes

  // Search logic (Client-side search within the current status)
  const filteredList = customers.filter((c) => {
    const search = searchTerm.toLowerCase();
    return (
      c.customer_name?.toLowerCase().includes(search) ||
      c.id?.toString().includes(search) ||
      c.customer_id?.toString().includes(search) // Just in case you use customer_id
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Customers"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-5xl font-black tracking-tight uppercase text-slate-800">
                Installation <span className="text-[#1a5695]">Logs</span>
              </h1>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                {activeTab} Records • {customers.length} total
              </p>
            </div>
          </div>

          {/* CONTROLS */}
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
                placeholder="QUICK SEARCH BY NAME OR ID..."
                className="w-full pl-16 pr-6 py-4.5 bg-white border border-slate-200 rounded-[24px] outline-none text-[11px] font-bold uppercase tracking-widest focus:border-[#1a5695] transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* CUSTOMER CARDS */}
          {loading ? (
            <div className="py-40 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Accessing Node Server...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredList.map((c) => (
                <div
                  key={c.customer_id}
                  className="bg-white rounded-[40px] border border-slate-200 p-8 hover:shadow-2xl hover:border-[#1a5695]/40 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 bg-slate-50 rounded-2xl text-[#1a5695] group-hover:bg-[#1a5695] group-hover:text-white transition-all shadow-inner">
                      <User size={24} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">
                        ID: {c.id}
                      </span>
                      <div
                        className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter ${c.status === "done" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}
                      >
                        {c.status}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-800 uppercase mb-2 line-clamp-1 group-hover:text-[#1a5695] transition-colors">
                    {c.customer_name}
                  </h3>
                  <div className="flex items-center gap-2 mb-8">
                    <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg">
                      <Zap
                        size={14}
                        className="text-[#1a5695]"
                        fill="#1a5695"
                      />
                      <span className="text-[10px] font-black text-[#1a5695] uppercase tracking-widest">
                        {c.total_capacity} KW
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-4 text-slate-400">
                      <Phone size={16} />
                      <span className="text-[11px] font-bold text-slate-700 uppercase">
                        {c.contact_number}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                      <Calendar size={16} />
                      <div className="flex flex-col">
                        <span className="text-[7px] font-black uppercase text-slate-300 tracking-widest">
                          Assigned Date
                        </span>
                        <span className="text-[11px] font-black text-slate-800">
                          {c.site_visit_date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 text-slate-400">
                      <MapPin size={16} className="mt-1 shrink-0" />
                      <span className="text-[11px] font-bold text-slate-600 uppercase leading-tight line-clamp-2">
                        {c.address}
                      </span>
                    </div>
                  </div>

                  <div className="mt-10 flex justify-between items-center bg-slate-50 p-4 rounded-[24px] group-hover:bg-[#1a5695]/5 transition-colors">
                    <span
                      onClick={() => {
                        console.log(c);
                        navigate("/master", {
                          state: {
                            customerId: c.customer_id,
                            leadId: c.lead_id,
                          },
                        });
                      }}
                      className="text-[10px] font-black text-[#1a5695] uppercase tracking-widest"
                    >
                      Master Details
                    </span>
                    <ChevronRight
                      size={18}
                      className="text-[#1a5695] group-hover:translate-x-1 transition-transform"
                    />

                    <button
                      onClick={() =>
                        navigate("/permissions", {
                          state: {
                            customerId: c.customer_id,
                            leadId: c.lead_id,
                          },
                        })
                      }
                      className="p-2.5 bg-blue-50 text-[#1a5695] hover:bg-[#1a5695] hover:text-white rounded-xl transition-all border border-blue-100 shadow-sm"
                      title="Manage Permissions"
                    >
                      <Shield size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {filteredList.length === 0 && !loading && (
                <div className="col-span-full py-32 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                  <Search size={40} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    No matching records found in {activeTab}
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

export default AllCustomers;
