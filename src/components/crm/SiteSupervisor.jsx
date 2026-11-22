import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit3,
  X,
  Check,
  Loader2,
  UserCheck,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const SiteSupervisors = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);

  const [supervisors, setSupervisors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  const getAllSiteSupervisors = async () => {
    setTableLoading(true);

    try {
      const res = await axios.get(
        `/api/sources/fetchAllSiteSupervisors`,
        { withCredentials: true },
      );

      if (res.status === 200) {
        setSupervisors(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load site supervisors");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    getAllSiteSupervisors();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const handleEditClick = (supervisor) => {
    setEditingId(supervisor.id);
    setFormData({ name: supervisor.name });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;

      if (editingId) {
        res = await axios.put(
          `/api/sources/updateSiteSupervisor/${editingId}`,
          formData,
          { withCredentials: true },
        );
      } else {
        res = await axios.post(
          `/api/sources/addSiteSupervisor`,
          formData,
          { withCredentials: true },
        );
      }

      if (res.status === 200 || res.status === 201) {
        toast.success(
          editingId ? "Site supervisor updated!" : "Site supervisor added!",
        );

        setIsModalOpen(false);
        getAllSiteSupervisors();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredSupervisors = supervisors.filter((supervisor) =>
    supervisor.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="crm-shell min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Site Supervisors"
      />

      <div className="crm-workspace flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="crm-main p-4 lg:p-8">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase">
              Site Supervisor Registry
            </h1>

            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              <Plus size={16} /> Add Site Supervisor
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="crm-surface bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                placeholder="Search site supervisor names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="crm-surface bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm min-h-[400px] relative">
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
                        No.
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Site Supervisor Name
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Created At
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">
                    {filteredSupervisors.length > 0 ? (
                      filteredSupervisors.map((supervisor, index) => (
                        <tr
                          key={supervisor.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-6 py-4 text-xs font-black text-slate-400">
                            #{index + 1}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                                <UserCheck size={14} />
                              </div>

                              <p className="font-bold text-slate-800 text-sm uppercase tracking-tight">
                                {supervisor.name}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                            {supervisor.created_at
                              ? new Date(
                                  supervisor.created_at,
                                ).toLocaleDateString()
                              : "-"}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(supervisor)}
                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all border border-slate-100"
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
                          colSpan="4"
                          className="px-6 py-20 text-center text-slate-400 font-bold text-xs uppercase tracking-widest"
                        >
                          No Site Supervisors Registered
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

      {/* SITE SUPERVISOR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
            <div
              className={`p-8 text-white flex justify-between items-center ${
                editingId ? "bg-amber-500" : "bg-[#1a5695]"
              }`}
            >
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {editingId ? "Edit Site Supervisor" : "New Site Supervisor"}
                </h2>

                <p className="text-white/60 text-[10px] font-bold uppercase mt-1">
                  Site Team Management
                </p>
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
                  Full Name
                </label>

                <div className="relative">
                  <input
                    required
                    type="text"
                    placeholder="Enter site supervisor name"
                    className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white outline-none text-sm font-bold"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value.toUpperCase(),
                      })
                    }
                  />

                  <UserCheck
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className={`w-full py-4 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-3 ${
                  editingId
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-[#1a5695] hover:bg-[#15467a]"
                }`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Check size={18} />
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

export default SiteSupervisors;
