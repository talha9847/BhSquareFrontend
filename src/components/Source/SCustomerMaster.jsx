import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, CheckCircle2, Clock, Calendar, Activity } from "lucide-react";
import axios from "axios";
import Navbar from "../crm/Navbar";
import Sidebar from "./Sidebar";

// --- SHARED UI COMPONENTS (READ-ONLY) ---

const ModuleCard = ({
  title,
  icon,
  children,
  accentColor = "text-[#1a5695]",
}) => (
  <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm relative transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div className="flex justify-between items-center mb-10">
      <h3
        className={`text-[11px] font-black ${accentColor} uppercase tracking-[0.2em] flex items-center gap-3`}
      >
        {icon} {title}
      </h3>
      {/* Edit button removed from here */}
    </div>
    {children}
  </div>
);

const DataField = ({ label, value, isFull = false }) => (
  <div className={isFull ? "col-span-full" : ""}>
    <p className="text-[9px] font-black uppercase tracking-[0.15em] mb-2 text-slate-400">
      {label}
    </p>
    <p className="text-[13px] font-black uppercase tracking-tight text-slate-800">
      {value || <span className="text-slate-200 tracking-widest">---</span>}
    </p>
  </div>
);

const SCustomerMaster = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { leadId } = location.state || {};

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState(null);
  const [stages, setStages] = useState([]);

  const formatIST = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
    const localDate = new Date(date.getTime() + IST_OFFSET_MS);

    return localDate
      .toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
  };

  useEffect(() => {
    if (!leadId) {
      navigate("/customers");
      return;
    }
    const fetchCore = async () => {
      try {
        const [lRes, sRes] = await Promise.all([
          axios.get(`/api/leads/fetchLeadById/${leadId}`, {
            withCredentials: true,
          }),
          axios.get(`/api/customers/fetchCustomerStagesByLeadId/${leadId}`, {
            withCredentials: true,
          }),
        ]);
        setLead(lRes.data?.data);
        setStages(sRes.data?.data || []);
      } catch (err) {
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchCore();
  }, [leadId, navigate]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Customers"
      />
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-[#1a5695] rounded-full animate-spin"></div>
              <h2 className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Syncing Profile...
              </h2>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-[#1a5695] text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-blue-100">
                      CUST-{leadId}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase border border-emerald-200">
                      <Activity size={12} /> Live Status
                    </span>
                  </div>
                  <h1 className="text-5xl font-black tracking-tight uppercase leading-none text-slate-800">
                    {lead?.customer_name}
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-8">
                  {/* BIO MODULE (READ ONLY) */}
                  <ModuleCard
                    title="Customer Bio & Site"
                    icon={<User size={18} />}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                      <DataField
                        label="Full Name"
                        value={lead?.customer_name}
                      />
                      <DataField
                        label="Phone Number"
                        value={lead?.contact_number}
                      />
                      <DataField
                        label="System Type"
                        value={lead?.installation_type}
                      />
                      <DataField
                        label="Total Capacity"
                        value={(lead?.total_capacity / 1000).toFixed(2) + " KW"}
                      />
                      <DataField
                        label="Installation Address"
                        value={lead?.address}
                        isFull
                      />
                    </div>
                  </ModuleCard>
                </div>

                {/* TIMELINE COLUMN */}
                <div className="lg:col-span-5">
                  <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl overflow-hidden sticky top-10">
                    <div className="p-8 border-b border-slate-100 bg-[#1a5695] text-white flex justify-between items-center">
                      <h3 className="text-sm font-black uppercase tracking-widest">
                        Project Timeline
                      </h3>
                      <Clock size={20} className="opacity-50" />
                    </div>
                    <div className="p-10 relative">
                      <div className="absolute left-[51px] top-12 bottom-12 w-[2px] bg-slate-100" />
                      {stages.map((stage) => (
                        <div
                          key={stage.id}
                          className="relative flex items-start gap-8 pb-12 last:pb-0 group"
                        >
                          <div
                            className={`relative z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                              stage.status === "done"
                                ? "bg-emerald-500 text-white shadow-lg"
                                : stage.status === "pending"
                                  ? "bg-[#1a5695] text-white animate-pulse"
                                  : "bg-slate-100 text-slate-300"
                            }`}
                          >
                            {stage.status === "done" ? (
                              <CheckCircle2 size={16} />
                            ) : (
                              <Clock size={16} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-[12px] font-black uppercase tracking-widest mb-3 ${
                                stage.status === "not_used"
                                  ? "text-slate-300"
                                  : "text-slate-800"
                              }`}
                            >
                              {stage.name}
                            </h4>
                            <div className="flex flex-col gap-2">
                              {stage.started_at && (
                                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 bg-slate-50 self-start px-3 py-1.5 rounded-lg border border-slate-100 uppercase">
                                  <Calendar
                                    size={12}
                                    className="text-blue-50"
                                  />{" "}
                                  Started: {formatIST(stage.started_at)}
                                </div>
                              )}
                              {stage.completed_at && (
                                <div className="flex items-center gap-2 text-[9px] font-black text-emerald-600 bg-emerald-50 self-start px-3 py-1.5 rounded-lg border border-emerald-100 uppercase">
                                  <CheckCircle2 size={12} /> Finished:{" "}
                                  {formatIST(stage.completed_at)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SCustomerMaster;
