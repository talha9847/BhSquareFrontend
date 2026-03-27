import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Zap,
  X,
  Check,
  Loader2,
  UserCheck,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const TechnicianManager = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  const [technicians, setTechnicians] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  // Fetch all technicians
  const getAllTechnicians = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/wiring/fetchTechnicians`);
      if (res.status === 200) {
        setTechnicians(res.data.data);
      }
    } catch (error) {
      console.error("Fetch Technicians Error:", error);
      toast.error("Failed to load technicians");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    getAllTechnicians();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const handleEditClick = (tech) => {
    setEditingId(tech.id);
    setFormData({ name: tech.name });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (editingId) {
        res = await axios.put(
          `${apiUrl}/api/wiring/updateTechnician/${editingId}`,
          formData,
        );
      } else {
        res = await axios.post(
          `${apiUrl}/api/wiring/createTechnician`,
          formData,
        );
      }

      if (res.status === 200 || res.status === 201) {
        toast.success(editingId ? "Technician updated!" : "Technician added!");
        setIsModalOpen(false);
        getAllTechnicians();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredTechnicians = technicians.filter((tech) =>
    tech.name?.toLowerCase().includes(searchQuery.toLowerCase()),
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
              <Zap className="text-[#1a5695]" fill="currentColor" size={24} />
              Technician Registry
            </h1>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              <Plus size={16} /> Add Technician
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                placeholder="Search technician names..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm min-h-[400px] relative">
            {tableLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <Loader2 className="animate-spin text-[#1a5695]" size={40} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        ID
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Technician Name
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTechnicians.length > 0 ? (
                      filteredTechnicians.map((tech, index) => (
                        <tr
                          key={tech.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-6 py-4 text-xs font-black text-slate-400">
                            #{index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-50 text-[#1a5695] rounded-xl flex items-center justify-center border border-blue-100">
                                <UserCheck size={14} />
                              </div>
                              <p className="font-bold text-slate-800 text-sm uppercase tracking-tight">
                                {tech.name}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(tech)}
                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#1a5695] rounded-xl transition-all border border-slate-100"
                              >
                                <Edit3 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-20 text-center text-slate-400 font-bold text-xs uppercase tracking-widest"
                        >
                          No Technicians Registered
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* TECHNICIAN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
            <div
              className={`p-8 text-white flex justify-between items-center ${editingId ? "bg-amber-500" : "bg-[#1a5695]"}`}
            >
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {editingId ? "Edit Technician" : "New Entry"}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    Wiring Personnel
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Technician Full Name
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    placeholder="e.g. SURESH PRAJAPATI"
                    className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white outline-none text-sm font-bold"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ name: e.target.value.toUpperCase() })
                    }
                  />
                  <Zap
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className={`w-full py-4 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-3 ${editingId ? "bg-amber-500 hover:bg-amber-600" : "bg-[#1a5695] hover:bg-[#15467a]"}`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Check size={18} />{" "}
                    {editingId ? "Update Record" : "Confirm Entry"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianManager;
