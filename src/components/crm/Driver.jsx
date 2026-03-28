import React, { useEffect, useState } from "react";
import {
  Search,
  User,
  Phone,
  ShieldCheck,
  X,
  Plus,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const Drivers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState(0);
  const [loading, setLoading] = useState(false); // Modal submission loading
  const [pageLoading, setPageLoading] = useState(true); // Table loading
  const apiUrl = import.meta.env.VITE_API_URL;

  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({ name: "", mobile: "" });

  const fetchDrivers = async () => {
    try {
      setPageLoading(true);
      const res = await axios.get(`${apiUrl}/api/dispatch/fetchDrivers`);
      if (res.status === 200) {
        setDrivers(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load drivers");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleOpenModal = (driver = null) => {
    if (driver) {
      setEditId(driver.id);
      setEditingDriver(driver);
      setFormData({ name: driver.name, mobile: driver.mobile });
    } else {
      setEditId(0);
      setEditingDriver(null);
      setFormData({ name: "", mobile: "" });
    }
    setIsModalOpen(true);
  };

  const createDriver = async () => {
    if (!formData.name || !formData.mobile) {
      toast.warning("Please fill all details");
      return;
    }

    setLoading(true);
    try {
      if (editingDriver) {
        const res = await axios.put(
          `${apiUrl}/api/dispatch/updateDriver/${editId}`,
          formData,
        );
        if (res.status === 200) {
          toast.success("Updated successfully");
          setIsModalOpen(false);
          fetchDrivers();
        }
      } else {
        const res = await axios.post(
          `${apiUrl}/api/dispatch/createDriver`,
          formData,
        );
        if (res.status === 201 || res.status === 200) {
          toast.success("Driver Created successfully");
          setIsModalOpen(false);
          fetchDrivers();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter((d) =>
    d.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Dispatch"
      />
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                Driver Directory
              </h1>
              <p className="text-sm text-slate-500">
                Manage your authorized delivery personnel
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#15467a] shadow-lg transition-all active:scale-95"
            >
              <Plus size={16} /> Add New Driver
            </button>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search drivers..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#1a5695] outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            {pageLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Loading Personnel...
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Driver Details
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Contact
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredDrivers.map((driver) => (
                      <tr
                        key={driver.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#1a5695]/10 flex items-center justify-center text-[#1a5695]">
                              <User size={18} />
                            </div>
                            <p className="font-bold text-slate-800 text-sm">
                              {driver.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <Phone size={14} className="text-slate-400" />{" "}
                            {driver.mobile}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(driver)}
                              className="p-2 text-slate-400 hover:text-[#1a5695] hover:bg-blue-50 rounded-xl transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredDrivers.length === 0 && (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-10 text-center text-slate-400 text-xs font-bold italic"
                        >
                          No drivers found matching your search.
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

      {/* DRIVER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-[#1a5695] p-8 text-white flex justify-between items-center relative">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {editingDriver ? "Edit Driver" : "Add Driver"}
                </h2>
                <p className="text-blue-100/60 text-[10px] font-bold uppercase mt-1">
                  Personnel Information
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1a5695]/10 outline-none transition-all text-sm font-bold"
                  placeholder="Enter driver name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1a5695]/10 outline-none transition-all text-sm font-bold"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                />
              </div>
              <button
                onClick={createDriver}
                disabled={loading}
                className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-[#15467a] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <ShieldCheck size={18} />
                )}
                {editingDriver ? "Update Personnel" : "Save Driver"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;
