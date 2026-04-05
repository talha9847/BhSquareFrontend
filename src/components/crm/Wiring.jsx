import React, { useState, useEffect } from "react";
import {
  Search,
  Edit3,
  X,
  Loader2,
  Clock,
  CheckCircle2,
  Eye,
  Share,
  UserPlus,
  Save,
  Lock,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Wiring = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // Data States
  const [wiringLogs, setWiringLogs] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedTechId, setSelectedTechId] = useState("");

  const getWiring = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(
        `/api/wiring/fetchWiringCustomerDetails`,
        { withCredentials: true },
      );
      if (res.status === 200) setWiringLogs(res.data.data);
    } catch (error) {
      toast.error("Failed to load records");
    } finally {
      setTableLoading(false);
    }
  };

  const getAllTechnicians = async () => {
    try {
      const res = await axios.get(`/api/wiring/fetchTechnicians`, {
        withCredentials: true,
      });
      if (res.status === 200) setTechnicians(res.data.data || []);
    } catch (error) {
      console.error("Error fetching technicians", error);
    }
  };

  useEffect(() => {
    getWiring();
    getAllTechnicians();
  }, []);

  const handleAssignClick = (item) => {
    // GUARD: If inventory is already done, block modal opening
    if (item.wiring_inv_status === "done") {
      toast.info("Technician cannot be changed after inventory is finalized");
      return;
    }
    setActiveItem(item);
    setSelectedTechId(item.technician_id || "");
    setIsTechModalOpen(true);
  };

  const handleAssignTechnician = async (e) => {
    e.preventDefault();
    if (!selectedTechId) return toast.warning("Please select a technician");

    setBtnLoading(true);
    try {
      const res = await axios.put(
        `/api/wiring/updateTechni/${activeItem.wiring_id}`,
        {
          technician_id: selectedTechId,
        },
        { withCredentials: true },
      );

      if (res.status === 200) {
        toast.success("Technician assigned successfully");
        setIsTechModalOpen(false);
        getWiring();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Assignment failed");
    } finally {
      setBtnLoading(false);
    }
  };

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
            <button
              onClick={() => navigate("/technicians")}
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
              <Eye size={16} /> View Technicians
            </button>
          </div>

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
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Technician
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
                    {filteredItems.map((item) => {
                      const isLocked = item.wiring_inv_status === "done";
                      return (
                        <tr
                          key={item.wiring_id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-6 py-4 text-center font-black text-slate-300 text-[11px]">
                            #{item.wiring_id}
                          </td>
                          <td className="px-6 py-4">
                            <div
                              onClick={() =>
                                navigate("/master", {
                                  state: {
                                    customerId: item.customer_id,
                                    leadId: item.lead_id,
                                  },
                                })
                              }
                              className="font-bold text-slate-800 text-sm uppercase cursor-pointer"
                            >
                              {item.customer_name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold">
                              {item.contact_number}
                            </div>
                          </td>

                          {/* UPDATED TECHNICIAN COLUMN */}
                          <td className="px-6 py-4">
                            <div
                              onClick={() => handleAssignClick(item)}
                              className={`flex items-center gap-2 group transition-all ${isLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                            >
                              <span
                                className={`text-[11px] font-black uppercase tracking-tight ${item.technician_name ? "text-slate-600" : "text-[#1a5695] underline"}`}
                              >
                                {item.technician_name || "Assign Technician"}
                              </span>
                              {isLocked ? (
                                <Lock size={12} className="text-slate-400" />
                              ) : (
                                <UserPlus
                                  size={14}
                                  className="text-[#1a5695] opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-wider ${item.wiring_status === "pending" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}
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
                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#1a5695] rounded-xl border border-slate-100 transition-all"
                              >
                                <Edit3 size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  navigate("/finalizewiring", {
                                    state: { selectedWiring: item },
                                  })
                                }
                                className="p-2.5 bg-[#1a5695] text-white hover:bg-[#15467a] rounded-xl shadow-lg shadow-blue-100 transition-all"
                              >
                                <Share size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ASSIGN TECHNICIAN MODAL */}
      {isTechModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !btnLoading && setIsTechModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                  Assign Technician
                </h2>
                <button
                  onClick={() => setIsTechModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAssignTechnician} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Select Staff
                  </label>
                  <select
                    value={selectedTechId}
                    onChange={(e) => setSelectedTechId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:border-[#1a5695] transition-all"
                  >
                    <option value="">Choose Technician...</option>
                    {technicians.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={btnLoading}
                  className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-lg hover:bg-[#15467a] transition-all flex items-center justify-center gap-2"
                >
                  {btnLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Save size={18} /> Update Technician
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wiring;
