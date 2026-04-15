import React, { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  ShieldCheck,
  Upload,
  ClipboardCheck,
  Gift,
  Banknote,
  Save,
  CheckCircle,
  Eye,
  UserPlus,
  X,
  ChevronRight,
  Lock,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllFinalStage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  // Data States
  const [finalLogs, setFinalLogs] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  // Modal States
  const [isSupervisorModalOpen, setIsSupervisorModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState("");

  const fetchFinalStageData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/sources/getFinalStageCustomersByStatus`,
        {
          params: { status: activeTab },
          withCredentials: true,
        },
      );
      if (res.status === 200) {
        setFinalLogs(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  const fetchSupervisors = async () => {
    try {
      const res = await axios.get(`/api/sources/fetchSupervisor`, {
        withCredentials: true,
      });
      if (res.status === 200) setSupervisors(res.data.data || []);
    } catch (error) {
      console.error("Error fetching supervisors");
    }
  };

  useEffect(() => {
    fetchFinalStageData();
    fetchSupervisors();
  }, [activeTab]);

  const handleOpenSupervisorModal = (item) => {
    // UPDATED: Block updation in both tabs
    toast.warning("Assignments are locked in the Final Stage.");
    return;
  };

  const handleUpdateSupervisor = async (e) => {
    e.preventDefault();
    // Double safeguard: Block API call
    toast.error("Updates not allowed.");
  };

  const filteredList = finalLogs.filter((item) =>
    item.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="FinalStage"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-5xl font-black tracking-tight uppercase text-slate-800">
                Final <span className="text-[#1a5695]">Stages</span>
              </h1>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                {activeTab} Workflow • {finalLogs.length} total
              </p>
            </div>
            <button
              onClick={() => navigate("/supervisors")}
              className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:shadow-lg transition-all"
            >
              <Eye size={16} /> Manage Supervisors
            </button>
          </div>

          {/* READ-ONLY BANNER */}
          <div className="mb-8 p-4 bg-[#1a5695]/5 border border-[#1a5695]/10 rounded-[20px] flex items-center gap-3">
            <Lock size={16} className="text-[#1a5695]" />
            <span className="text-[10px] font-bold text-[#1a5695] uppercase tracking-widest">
              Stage Locked: Modifications are disabled for {activeTab} records.
            </span>
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
                placeholder="SEARCH BY CUSTOMER NAME..."
                className="w-full pl-16 pr-6 py-4.5 bg-white border border-slate-200 rounded-[24px] outline-none text-[11px] font-bold uppercase tracking-widest focus:border-[#1a5695] transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* GRID LIST */}
          {loading ? (
            <div className="py-40 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Syncing workflow logs...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredList.map((item) => (
                <div
                  key={item.final_stage_id}
                  className="bg-white rounded-[40px] border border-slate-200 p-8 hover:shadow-xl transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-slate-50 rounded-2xl text-[#1a5695] shadow-inner">
                      <ShieldCheck size={24} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">
                        ID: #{item.final_stage_id}
                      </span>
                      <div
                        className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter ${
                          item.status === "done"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}
                      >
                        {item.status}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-800 uppercase mb-1 line-clamp-1">
                    {item.customer_name}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6">
                    {item.contact_number}
                  </p>

                  {/* MINI STATUS INDICATORS */}
                  <div className="grid grid-cols-5 gap-2 mb-8 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    {[
                      { icon: CheckCircle, active: item.file_approved },
                      { icon: Upload, active: item.file_uploaded },
                      { icon: ClipboardCheck, active: item.inspection },
                      { icon: Gift, active: item.redeem },
                      { icon: Banknote, active: item.disbursal },
                    ].map((step, idx) => (
                      <div
                        key={idx}
                        className={`flex justify-center p-2 rounded-lg ${
                          step.active ? "text-emerald-500" : "text-slate-200"
                        }`}
                      >
                        <step.icon size={18} strokeWidth={3} />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-50">
                    {/* ASSIGNMENT SECTION (UPDATED TO READ-ONLY) */}
                    <div
                      onClick={() => handleOpenSupervisorModal(item)}
                      className="flex items-center justify-between cursor-not-allowed opacity-70 group/item"
                    >
                      <div className="flex items-center gap-4 text-slate-400">
                        <UserPlus size={16} />
                        <span className="text-[11px] font-bold text-[#1a5695] uppercase">
                          {item.supervisor_name || "No Staff Assigned"}
                        </span>
                      </div>
                      <Lock size={12} className="text-slate-300" />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/master", {
                        state: {
                          customerId: item.customerId,
                          leadId: item.leadId,
                        },
                      });
                    }}
                    className="mt-8 w-full py-4 bg-slate-50 hover:bg-[#1a5695] hover:text-white text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100"
                  >
                    View Full Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ASSIGN SUPERVISOR MODAL (LOCKED) */}
      {isSupervisorModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsSupervisorModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={32} />
              </div>
              <h2 className="text-xl font-black text-slate-800 uppercase mb-2">
                Updates Locked
              </h2>
              <p className="text-sm text-slate-500 mb-8">
                Supervisor assignments cannot be modified in the Final Stage
                workflow.
              </p>
              <button
                onClick={() => setIsSupervisorModalOpen(false)}
                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllFinalStage;
