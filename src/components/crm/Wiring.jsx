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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Data States
  const [wiringLogs, setWiringLogs] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [formData, setFormData] = useState({
    wiring_id: null, // Mapped from API
    technician_id: "",
    ac_wire_red: "",
    ac_wire_black: "",
    dc_wire_red: "",
    dc_wire_black: "",
    la_wire: "",
    earthing: "",
    conduit_pipe: "",
  });

  // Fetch Wiring Details
  const getWiring = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/api/wiring/fetchWiringCustomerDetails`,
      );
      if (res.status === 200) {
        setWiringLogs(res.data.data);
      }
    } catch (error) {
      console.error("Fetch Wiring Error:", error);
      toast.error("Failed to load wiring records");
    } finally {
      setTableLoading(false);
    }
  };

  // Fetch Technicians for Dropdown
  const getAllTechnicians = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/wiring/fetchTechnicians`);
      if (res.status === 200) {
        setTechnicians(res.data.data);
      }
    } catch (error) {
      console.error("Fetch Technicians Error:", error);
    }
  };

  useEffect(() => {
    getWiring();
    getAllTechnicians();
  }, []);

  const handleUpdateClick = (item) => {
    setFormData({
      wiring_id: item.wiring_id, // Using wiring_id from API
      technician_id: "",
      ac_wire_red: "",
      ac_wire_black: "",
      dc_wire_red: "",
      dc_wire_black: "",
      la_wire: "",
      earthing: "",
      conduit_pipe: "",
    });
    setIsUpdateModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Assuming your update endpoint follows this pattern
      const res = await axios.post(
        `${apiUrl}/api/wiring/updateWiringDetails`,
        formData,
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("Wiring stage finalized!");
        setIsUpdateModalOpen(false);
        getWiring(); // Refresh table
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save details");
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
              <Zap className="text-[#1a5695]" fill="currentColor" size={28} />
              Wiring Inventory
            </h1>
            <button
              onClick={() => navigate("/technicians")}
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
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
                placeholder="Search by customer name..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm min-h-[400px] relative">
            {tableLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] z-10">
                <Loader2
                  className="animate-spin text-[#1a5695] mb-2"
                  size={32}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Loading Data...
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">
                        ID
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Customer
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Wireman
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
                          <div className="font-bold text-slate-800 text-sm uppercase">
                            {item.customer_name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold">
                            {item.contact_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-black text-[11px] text-[#1a5695] uppercase">
                          {item.technician_name || "Not Assigned"}
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
                          {item.wiring_status === "pending" && (
                            <button
                              onClick={() => handleUpdateClick(item)}
                              className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#1a5695] hover:bg-blue-50 rounded-xl transition-all border border-slate-100"
                            >
                              <Edit3 size={16} />
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

      {/* MODAL */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-[#1a5695] p-8 text-white flex justify-between items-center relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="relative z-10">
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Wiring Logistics
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                    Inventory Management
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="relative z-10 p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Select Technician
                  </label>
                  <select
                    required
                    className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold focus:bg-white focus:border-[#1a5695]/30 transition-all"
                    value={formData.technician_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        technician_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Choose Personnel</option>
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {[
                  { label: "AC Wire Red (mtr)", key: "ac_wire_red" },
                  { label: "AC Wire Black (mtr)", key: "ac_wire_black" },
                  { label: "DC Wire Red (mtr)", key: "dc_wire_red" },
                  { label: "DC Wire Black (mtr)", key: "dc_wire_black" },
                  { label: "LA Wire (mtr)", key: "la_wire" },
                  { label: "Earthing Qty", key: "earthing" },
                  { label: "Conduit Pipe", key: "conduit_pipe" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                      {f.label}
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold focus:bg-white focus:border-[#1a5695]/30 transition-all"
                      value={formData[f.key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [f.key]: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              <button
                disabled={loading}
                className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 hover:bg-[#15467a] transition-all"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Finalize & Save"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wiring;
