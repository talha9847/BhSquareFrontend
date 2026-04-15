import React, { useEffect, useState } from "react";
import {
  Search,
  Edit3,
  X,
  Loader2,
  Eye,
  Save,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  UserPlus,
} from "lucide-react";
import Navbar from "../crm/Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FFabrication = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFabModalOpen, setIsFabModalOpen] = useState(false); // Separate modal for Fabricator
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Data States
  const [fabrications, setFabrications] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customer_id: null,
    fabricator_id: "",
    unused_pipes: "",
  });

  const fetchFabrications = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(`/api/wiring/getFabricationDetailsById`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setFabrications(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load fabrication logs");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchFabrications();
  }, []);

  // 1. Logic for Assigning Fabricator

  // 2. Logic for Unused Pipes (Edit Button)
  const handleEditClick = (item) => {
    setActiveItem(item);
    setEditFormData({
      ...editFormData,
      customer_id: item.customer_id,
      unused_pipes: item.unused_pipes || 0,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e, type) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        customer_id: editFormData.customer_id,
        unused_pipes: editFormData.unused_pipes,
        fabricator_id: editFormData.fabricator_id,
        status: type === "finalize" ? "done" : "pending",
      };

      if (type == "fab") {
        const res = await axios.put(
          `/api/dispatch/updateFabricatorViaId`,
          payload,
          { withCredentials: true },
        );
        if (res.status === 200) {
          toast.success(
            type === "finalize" ? "Project Finalized!" : "Fabricator Updated!",
          );
          setIsEditModalOpen(false);
          setIsFabModalOpen(false);
          fetchFabrications();
        }
      } else {
        const res = await axios.put(
          `/api/dispatch/updateFabrication`,
          payload,
          { withCredentials: true },
        );

        if (res.status === 200) {
          toast.success(
            type === "finalize" ? "Project Finalized!" : "Fabricator Updated!",
          );
          setIsEditModalOpen(false);
          setIsFabModalOpen(false);
          fetchFabrications();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = fabrications.filter((item) =>
    item.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Fabrication"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
              Fabrication Status
            </h1>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                placeholder="Search projects..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm min-h-[300px] relative">
            {tableLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] z-10">
                <Loader2
                  className="animate-spin text-[#1a5695] mb-2"
                  size={32}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Loading...
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Customer
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Address
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Status
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 text-sm uppercase cursor-pointer">
                            {item.customer_name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold">
                            {item.contact_number}
                          </div>
                        </td>

                        {/* CHANGE 1: Clickable Fabricator Cell */}

                        <td className="px-6 py-4 font-bold text-slate-600 text-sm">
                          {item.address}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-wider ${item.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}
                          >
                            {item.status === "pending" ? (
                              <Clock size={12} />
                            ) : (
                              <CheckCircle2 size={12} />
                            )}
                            {item.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          {item.status === "pending" && (
                            <button
                              onClick={() => handleEditClick(item)}
                              className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#1a5695] hover:bg-blue-50 rounded-xl transition-all border border-slate-100 shadow-sm"
                            >
                              <Edit3 size={16} />
                            </button>
                          )}
                          {item.status === "done" && (
                            <button
                              onClick={() => navigate(`/wiring`)}
                              className="flex items-center gap-2 px-4 py-2.5 bg-[#1a5695] text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-md active:scale-95"
                            >
                              <Zap size={14} /> Go to Wiring
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

      {/* MODAL 2: UNUSED PIPES ONLY (FINALIZE) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden">
            <div className="bg-emerald-600 p-8 text-white flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">
                Finalize Project
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={(e) => handleUpdate(e, "finalize")}
              className="p-8 space-y-6"
            >
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Unused HD Pipes (Return to Stock)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full mt-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold"
                  value={editFormData.unused_pipes}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      unused_pipes: e.target.value,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <CheckCircle2 size={18} /> Save & Finalize
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

export default FFabrication;
