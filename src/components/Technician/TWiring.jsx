import React, { useState, useEffect } from "react";
import {
  Search,
  Edit3,
  X,
  Loader2,
  Zap,
  Clock,
  CheckCircle2,
  Eye,
  Share,
  Upload,
  Camera,
  MapPin,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import Navbar from "../crm/Navbar";

const TWiring = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [wiringLogs, setWiringLogs] = useState([]);
  const getWiring = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(
        `/api/wiring/getWiringCustomerDetailsById`,
        { withCredentials: true },
      );

      if (res.status === 200) {
        setWiringLogs(res.data.data);
      }
    } catch (error) {
      console.error(error);

      // Extract proper error message
      const message =
        error.response?.data?.message || // backend error message
        error.message || // axios/general error
        "Something went wrong";

      toast.error(message);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    getWiring();
  }, []);

  const filteredItems = wiringLogs.filter((item) =>
    item.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Wiring"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
              Wiring Status
            </h1>
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 shadow-sm">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                placeholder="Search customer..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm relative min-h-[400px]">
            {tableLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
                <Loader2
                  className="animate-spin text-[#1a5695] mb-2"
                  size={32}
                />
                <span className="text-[10px] font-black uppercase text-slate-400">
                  Loading Data...
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        ID
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Customer
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Status
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredItems.map((item) => (
                      <tr
                        key={item.wiring_id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4 text-center font-black text-slate-300 text-[11px]">
                          #{item.wiring_id}
                        </td>
                        <td className="px-6 py-4">
                          <div
                            onClick={() => {
                              navigate("/master", {
                                state: {
                                  customerId: item.customer_id,
                                  leadId: item.lead_id,
                                },
                              });
                            }}
                            className="font-bold text-slate-800 text-sm uppercase cursor-pointer"
                          >
                            {item.customer_name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold">
                            {item.contact_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-wider ${
                              item.wiring_status === "pending"
                                ? "bg-amber-50 text-amber-600 border border-amber-100"
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            }`}
                          >
                            {item.wiring_status === "pending" ? (
                              <Clock size={12} />
                            ) : (
                              <CheckCircle2 size={12} />
                            )}
                            {item.wiring_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {item.wiring_inv_status === "pending" ? (
                            <button
                              onClick={() =>
                                navigate("/updatewiring", {
                                  state: {
                                    wiring_id: item.wiring_id,
                                    customer_id: item.customer_id,
                                  },
                                })
                              }
                              className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#1a5695] rounded-xl border border-slate-100 transition-all"
                            >
                              <Edit3 size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                // REPLACE MODAL LOGIC WITH NAVIGATION
                                navigate("/finalizewiring", {
                                  state: { selectedWiring: item },
                                });
                              }}
                              className="p-2.5 bg-[#1a5695] text-white hover:bg-[#15467a] rounded-xl shadow-lg shadow-blue-100 transition-all"
                            >
                              <Share size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TWiring;
