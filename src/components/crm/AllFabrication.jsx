import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  UserPlus,
  Phone,
  Hammer,
  Calendar,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Clock,
  Edit3,
  X,
  Save,
  Zap,
  Inbox,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AllFabrication = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [fabrications, setFabrications] = useState([]);
  const [fabricators, setFabricators] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  // Modal States
  const [isFabModalOpen, setIsFabModalOpen] = useState(false);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customer_id: null,
    fabricator_id: "",
  });

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const fabRes = await axios.get(`/api/dispatch/fetchFabricators`, {
        withCredentials: true,
      });
      if (fabRes.status === 200) setFabricators(fabRes.data.data || []);

      const res = await axios.get(`/api/dispatch/getFabricationsByStatus`, {
        params: { status: activeTab },
        withCredentials: true,
      });

      if (res.status === 200) {
        setFabrications(res.data.data || []);
      }
    } catch (err) {
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // --- HANDLERS ---
  const handleFabClick = (item) => {
    setActiveItem(item);
    setEditFormData({
      customer_id: item.customer_id,
      fabricator_id: item.fabricator_id || "",
    });
    setIsFabModalOpen(true);
  };

  const handleFinalizeClick = (item) => {
    setActiveItem(item);
    setEditFormData({ customer_id: item.customer_id });
    setIsFinalizeModalOpen(true);
  };

  const handleUpdate = async (e, type) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const payload = {
        customer_id: editFormData.customer_id,
        fabricator_id: editFormData.fabricator_id,
        status: type === "finalize" ? "done" : "pending",
      };

      const endpoint =
        type === "fab"
          ? "/api/dispatch/updateFabricatorViaId"
          : "/api/dispatch/updateFabrication";

      const res = await axios.put(endpoint, payload, { withCredentials: true });

      if (res.status === 200) {
        toast.success(
          type === "finalize" ? "Project Finalized!" : "Fabricator Updated!",
        );
        setIsFabModalOpen(false);
        setIsFinalizeModalOpen(false);
        fetchData();
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const filteredList = fabrications.filter((item) =>
    item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Fabrication"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-5xl font-black tracking-tight uppercase text-slate-800">
                Structure <span className="text-[#1a5695]">Fabrication</span>
              </h1>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                {activeTab} Projects • {fabrications.length} total
              </p>
            </div>
          </div>

          {/* TAB & SEARCH */}
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
                placeholder="SEARCH CUSTOMER..."
                className="w-full pl-16 pr-6 py-4.5 bg-white border border-slate-200 rounded-[24px] outline-none text-[11px] font-bold uppercase tracking-widest focus:border-[#1a5695] transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* GRID & EMPTY STATE */}
          {loading ? (
            <div className="py-40 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Accessing Logs...
              </span>
            </div>
          ) : filteredList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[40px] border border-slate-200 p-8 hover:shadow-2xl transition-all group"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 bg-slate-50 rounded-2xl text-[#1a5695]">
                      <Hammer size={24} />
                    </div>
                    <div
                      className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase flex items-center gap-1.5 ${
                        item.status === "done"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {item.status === "done" ? (
                        <CheckCircle2 size={10} />
                      ) : (
                        <Clock size={10} />
                      )}
                      {item.status}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-800 uppercase mb-2 line-clamp-1">
                    {item.customer_name}
                  </h3>

                  <div className="flex items-center gap-2 mb-8">
                    <button
                      onClick={() =>
                        activeTab === "pending" && handleFabClick(item)
                      }
                      className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl border border-blue-100 group-hover:bg-[#1a5695] transition-all"
                    >
                      <UserPlus
                        size={14}
                        className="text-[#1a5695] group-hover:text-white"
                      />
                      <span className="text-[10px] font-black text-[#1a5695] group-hover:text-white uppercase">
                        {item.fabricator_name || "ASSIGN FABRICATOR"}
                      </span>
                    </button>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-4 text-slate-400">
                      <Phone size={16} />
                      <span className="text-[11px] font-bold text-slate-700 uppercase">
                        {item.contact_number}
                      </span>
                    </div>
                  </div>

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
                        Master File
                      </span>
                      <ChevronRight
                        size={18}
                        className="text-[#1a5695] group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>

                    {activeTab === "pending" ? (
                      <button
                        onClick={() => handleFinalizeClick(item)}
                        className="p-4 bg-emerald-600 text-white rounded-[20px] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate("/wiring")}
                        className="p-4 bg-[#1a5695] text-white rounded-[20px] hover:bg-slate-900 transition-all"
                      >
                        <Zap size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* NO DATA FOUND VIEW */
            <div className="py-32 flex flex-col items-center justify-center bg-white rounded-[40px] border-2 border-dashed border-slate-200">
              <div className="p-6 bg-slate-50 rounded-full mb-6">
                <Inbox size={48} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">
                No Records Found
              </h3>
              <p className="text-[10px] font-bold text-slate-300 uppercase mt-2 tracking-tighter">
                Try searching for a different customer or switch tabs.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ASSIGN FABRICATOR */}
      {isFabModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#1a5695] p-8 text-white flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">
                Assign Expert
              </h2>
              <button
                onClick={() => setIsFabModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={(e) => handleUpdate(e, "fab")}
              className="p-8 space-y-6"
            >
              <select
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-[#1a5695]"
                value={editFormData.fabricator_id}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    fabricator_id: e.target.value,
                  })
                }
              >
                <option value="">Select a Fabricator</option>
                {fabricators.map((fab) => (
                  <option key={fab.id} value={fab.id}>
                    {fab.name}
                  </option>
                ))}
              </select>
              <button
                disabled={btnLoading}
                type="submit"
                className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
              >
                {btnLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Save size={18} /> Update Assignment
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FINALIZE */}
      {isFinalizeModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-emerald-600 p-8 text-white flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">
                Complete Work
              </h2>
              <button
                onClick={() => setIsFinalizeModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-sm font-bold text-slate-500 text-center uppercase tracking-tight">
                Are you sure you want to finalize this structure and move to
                wiring?
              </p>
              <button
                onClick={(e) => handleUpdate(e, "finalize")}
                disabled={btnLoading}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
              >
                {btnLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <CheckCircle2 size={18} /> Save & Finalize
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllFabrication;
