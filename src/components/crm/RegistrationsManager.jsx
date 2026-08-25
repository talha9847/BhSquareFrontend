import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FileText,
  FileDown,
  Calendar,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Clock,
  Zap,
  MapPin,
  Edit3,
  X,
} from "lucide-react";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";

const RegistrationsManager = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dLoad, setDLoad] = useState(false);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("done");

  // --- MODAL STATES ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/registrations/fetchCustomersByStatus`, {
        params: { status: activeTab },
        withCredentials: true,
      });
      if (res.status === 200) {
        setData(res.data.data || []);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [activeTab]);

  // --- OPEN EDIT MODAL ---
  const handleEditClick = (e, item) => {
    if (activeTab == "done") {
      e.stopPropagation(); // Prevent navigation to /master
      setEditingItem({ ...item });
      setIsEditModalOpen(true);
    }
  };

  // --- HANDLE UPDATE ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      // Adjust the endpoint and payload based on your backend
      await axios.put(
        `/api/registrations/updateFileGenerationAndLead/${editingItem.registration_id}/${editingItem.lead_id}`,
        {
          name: editingItem.customer_name,
          contact: editingItem.contact_number,
          address: editingItem.address,
          panel_capacity: editingItem.panel_wattage,
          inverter_capacity: editingItem.inverter_kw,
        },
        {
          withCredentials: true,
        },
      );
      setIsEditModalOpen(false);
      fetchRegistrations(); // Refresh list
      toast.success("Updated!!!");
    } catch (err) {
      toast.error("Failed to update registration");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDownloadFile = async (e, item) => {
    e.stopPropagation();
    if (!item.registration_id || dLoad) return;
    try {
      setDLoad(true);
      const result = await axios.post(
        `/api/registrations/getFileGeneration`,
        { registrationId: item.registration_id },
        {
          responseType: "blob",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          },
          withCredentials: true,
        },
      );
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `agreement_${item.customer_name || "customer"}.docx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
    } finally {
      setDLoad(false);
    }
  };

  const filteredList = data.filter(
    (item) =>
      item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.registration_id?.toString().includes(searchTerm),
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Registrations"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-5xl font-black tracking-tight uppercase text-slate-800">
                Agreement <span className="text-[#1a5695]">Vault</span>
              </h1>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                {activeTab} Registrations • {data.length} total
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
                  className={`px-12 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    activeTab === tab
                      ? "bg-[#1a5695] text-white shadow-lg"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab === "pending" ? (
                    <Clock size={14} />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
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
                placeholder="SEARCH BY CUSTOMER NAME OR REG ID..."
                className="w-full pl-16 pr-6 py-4.5 bg-white border border-slate-200 rounded-[24px] outline-none text-[11px] font-bold uppercase tracking-widest focus:border-[#1a5695] transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* GRID VIEW */}
          {loading ? (
            <div className="py-40 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Fetching Records...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredList.map((item) => (
                <div
                  key={item.registration_id}
                  onClick={() =>
                    navigate(`/master`, {
                      state: {
                        customerId: item.customer_id,
                        leadId: item.lead_id,
                      },
                    })
                  }
                  className="bg-white rounded-[40px] border border-slate-200 p-8 hover:shadow-2xl hover:border-[#1a5695]/40 transition-all cursor-pointer group flex flex-col justify-between relative"
                >
                  {/* EDIT BUTTON */}
                  {activeTab == "done" && (
                    <button
                      onClick={(e) => handleEditClick(e, item)}
                      className="absolute top-8 right-8 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-[#1a5695] hover:text-white transition-all shadow-sm"
                    >
                      <Edit3 size={16} />
                    </button>
                  )}

                  <div>
                    <div className="flex justify-between items-start mb-8">
                      <div className="p-4 bg-slate-50 rounded-2xl text-[#1a5695] group-hover:bg-[#1a5695] group-hover:text-white transition-all shadow-inner">
                        <FileText size={24} />
                      </div>
                      <div className="flex flex-col items-end mr-10">
                        {" "}
                        {/* Adjusted for edit button */}
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">
                          REG ID: {item.registration_id}
                        </span>
                        <div
                          className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter ${
                            item.registration_status === "done"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}
                        >
                          {item.registration_status}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-slate-800 uppercase mb-2 line-clamp-1 group-hover:text-[#1a5695] transition-colors">
                      {item.customer_name}
                    </h3>

                    <div className="flex items-center gap-2 mb-8">
                      <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg">
                        <Zap
                          size={14}
                          className="text-[#1a5695]"
                          fill="#1a5695"
                        />
                        <span className="text-[10px] font-black text-[#1a5695] uppercase tracking-widest">
                          {(item.total_capacity / 1000).toFixed(2)} KW
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-4 text-slate-400">
                        <Calendar size={16} />
                        <div className="flex flex-col">
                          <span className="text-[7px] font-black uppercase text-slate-300 tracking-widest">
                            Agreement Date
                          </span>
                          <span className="text-[11px] font-black text-slate-800 uppercase">
                            {item.agreement_date
                              ? new Date(item.agreement_date)
                                  .toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                  .toUpperCase()
                              : "NOT SET"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 text-slate-400">
                        <MapPin size={16} className="mt-1 shrink-0" />
                        <span className="text-[11px] font-bold text-slate-600 uppercase leading-tight line-clamp-1">
                          {item.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex gap-3">
                    {activeTab === "done" ? (
                      <button
                        disabled={dLoad}
                        onClick={(e) => handleDownloadFile(e, item)}
                        className="flex-1 py-4 bg-[#1a5695] text-white rounded-[22px] text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-[#1a5695]/40 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 active:scale-95"
                      >
                        {dLoad ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <FileDown size={14} />
                        )}
                        Download DOCX
                      </button>
                    ) : (
                      <button className="flex-1 py-4 border border-slate-200 text-slate-400 rounded-[22px] text-[10px] font-black uppercase tracking-widest hover:border-[#1a5695] hover:text-[#1a5695] transition-all flex items-center justify-center gap-2">
                        Review Files <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#1a5695] text-white">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  Edit Registration
                </h2>
                <p className="text-[10px] font-bold opacity-70 tracking-widest uppercase">
                  ID: {editingItem?.registration_id}
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold uppercase outline-none focus:border-[#1a5695] transition-all"
                  value={editingItem?.customer_name || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      customer_name: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">
                  Address
                </label>
                <textarea
                  rows="2"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold uppercase outline-none focus:border-[#1a5695] transition-all"
                  value={editingItem?.address || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, address: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">
                  Contact Number
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold uppercase outline-none focus:border-[#1a5695] transition-all"
                  value={editingItem?.contact_number || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      contact_number: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">
                  Panel Wattage (W)
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold uppercase outline-none focus:border-[#1a5695] transition-all"
                  value={editingItem?.panel_wattage || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      panel_wattage: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">
                  Inverter (KW)
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold uppercase outline-none focus:border-[#1a5695] transition-all"
                  value={editingItem?.inverter_kw || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      inverter_kw: e.target.value,
                    })
                  }
                />
              </div>

              <div className="md:col-span-2 mt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-4 border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-1 py-4 bg-[#1a5695] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-[#1a5695]/30 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300"
                >
                  {updateLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    "Update Registration"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationsManager;
