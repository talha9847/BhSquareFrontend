import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  Package,
  Truck,
  Hammer,
  Zap,
  ClipboardCheck,
  Loader2,
  ChevronRight,
  TrendingUp,
  RefreshCcw,
  Banknote,
  ShieldCheck,
  UploadCloud,
  SearchCheck,
  HandCoins,
  Wallet,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import axios from "axios";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [counts, setCounts] = useState(() => {
    const saved = localStorage.getItem("solar_dash_cache");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(!counts);
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();

  const fetchCounts = useCallback(async (force = false) => {
    const lastFetch = localStorage.getItem("solar_dash_last_fetch");
    const now = Date.now();

    if (!force && lastFetch && now - parseInt(lastFetch) < 300000) {
      setLoading(false);
      return;
    }

    try {
      setIsSyncing(true);
      const res = await axios.get("/api/leads/pendingCounts", {
        withCredentials: true,
      });

      if (res.status === 200) {
        const data = res.data.data;
        setCounts(data);
        localStorage.setItem("solar_dash_cache", JSON.stringify(data));
        localStorage.setItem("solar_dash_last_fetch", now.toString());
      }
    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const StatCard = ({
    label,
    count,
    color,
    description,
    icon: Icon,
    onClick,
    index,
  }) => (
    <div
      onClick={onClick}
      style={{ animationDelay: `${index * 50}ms` }}
      className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      <div className="flex justify-between items-start">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
          style={{
            backgroundColor: color,
            boxShadow: `0 8px 20px -6px ${color}`,
          }}
        >
          <Icon size={22} />
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Pending
          </span>
          <div className="text-2xl font-black text-slate-800">{count || 0}</div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-bold text-slate-700 flex items-center gap-1">
          {label}
          <ChevronRight size={14} />
        </h3>
        <p className="text-xs text-slate-400 mt-1 font-medium">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-10">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Solar<span className="text-[#1a5695]">OS</span> Dashboard
              </h1>
              <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                <TrendingUp size={16} className="text-green-500" />
                System operational: {counts?.active_customers || 0} active
                projects
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isSyncing && (
                <div className="flex items-center gap-2 text-[#1a5695] bg-blue-50 px-3 py-2 rounded-xl border border-blue-100">
                  <Loader2 className="animate-spin" size={14} />
                  <span className="text-[10px] font-bold uppercase">
                    Syncing
                  </span>
                </div>
              )}

              <button
                onClick={() => fetchCounts(true)}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a5695] text-white text-sm font-semibold hover:bg-[#15467a] transition disabled:opacity-50"
              >
                <RefreshCcw
                  size={16}
                  className={isSyncing ? "animate-spin" : ""}
                />
                {isSyncing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(12)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-40 bg-white rounded-3xl animate-pulse border"
                  />
                ))
            ) : (
              <>
                {/* --- SALES & REGISTRATION --- */}
                <StatCard
                  index={0}
                  label="Leads"
                  count={counts?.pending_leads}
                  color="#1e40af"
                  icon={Users}
                  description="Potential customers"
                  onClick={() => navigate("/leads")}
                />

                <StatCard
                  index={3}
                  label="Customers"
                  count={counts?.active_customers}
                  color="#4f46e5"
                  icon={FileText}
                  description="Total active files"
                  onClick={() => navigate("/customers")}
                />
                
                <StatCard
                  index={1}
                  label="Govt. Reg"
                  count={counts?.registration_pending}
                  color="#ea580c"
                  icon={ClipboardCheck}
                  description="Subsidy & Registration"
                  onClick={() => navigate("/registration")}
                />
                <StatCard
                  index={2}
                  label="Loan Process"
                  count={counts?.loan_pending}
                  color="#0369a1"
                  icon={Banknote}
                  description="Financing status"
                  onClick={() => navigate("/loans")}
                />

                {/* --- INSTALLATION PIPELINE --- */}
                <StatCard
                  index={4}
                  label="Kit Prep"
                  count={counts?.kit_pending}
                  color="#dc2626"
                  icon={Package}
                  description="Material readiness"
                  onClick={() => navigate("/kitready")}
                />
                <StatCard
                  index={5}
                  label="Logistics"
                  count={counts?.dispatch_pending}
                  color="#7c3aed"
                  icon={Truck}
                  description="Delivery management"
                  onClick={() => navigate("/dispatch")}
                />
                <StatCard
                  index={6}
                  label="Structure"
                  count={counts?.fab_pending}
                  color="#059669"
                  icon={Hammer}
                  description="On-site fabrication"
                  onClick={() => navigate("/fabrication")}
                />
                <StatCard
                  index={7}
                  label="Wiring"
                  count={counts?.wiring_pending}
                  color="#0891b2"
                  icon={Zap}
                  description="Electrical finishing"
                  onClick={() => navigate("/wiring")}
                />

                {/* --- DOCUMENTATION & FINANCE --- */}

                <StatCard
                  index={9}
                  label="File Approval"
                  count={counts?.file_appr_pending}
                  color="#10b981"
                  icon={ShieldCheck}
                  description="Manager verification"
                  onClick={() => navigate("/finalstage")}
                />

                <StatCard
                  index={8}
                  label="File Upload"
                  count={counts?.file_upload_pending}
                  color="#d946ef"
                  icon={UploadCloud}
                  description="Docs to be uploaded"
                  onClick={() => navigate("/finalstage")}
                />

                <StatCard
                  index={10}
                  label="Inspection"
                  count={counts?.inspection_pending}
                  color="#f59e0b"
                  icon={SearchCheck}
                  description="Site safety review"
                  onClick={() => navigate("/finalstage")}
                />
                <StatCard
                  index={11}
                  label="Redeem"
                  count={counts?.redeem_pending}
                  color="#6366f1"
                  icon={HandCoins}
                  description="Vendor/Subsidy claims"
                  onClick={() => navigate("/finalstage")}
                />
                <StatCard
                  index={12}
                  label="Disbursal"
                  count={counts?.disbursal_pending}
                  color="#22c55e"
                  icon={Wallet}
                  description="Final payment release"
                  onClick={() => navigate("/finalstage")}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
