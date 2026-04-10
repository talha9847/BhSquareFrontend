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
} from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import axios from "axios";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 1. Initialize from Cache
  const [counts, setCounts] = useState(() => {
    const saved = localStorage.getItem("solar_dash_cache");
    return saved ? JSON.parse(saved) : null;
  });

  // 2. Control loading: ONLY true if we have zero data
  const [loading, setLoading] = useState(!counts);
  const [isSyncing, setIsSyncing] = useState(false);

  const navigate = useNavigate();

  const fetchCounts = useCallback(async (force = false) => {
    // 3. Prevent excessive API calls (Throttle)
    // If we fetched data in the last 5 minutes, don't call API unless forced
    const lastFetch = localStorage.getItem("solar_dash_last_fetch");
    const now = Date.now();
    if (!force && lastFetch && now - parseInt(lastFetch) < 300000) {
      // 5 minutes
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
      className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="flex justify-between items-start relative z-10">
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
      <div className="mt-4 relative z-10">
        <h3 className="font-bold text-slate-700 group-hover:text-[#1a5695] flex items-center gap-1">
          {label}
          <ChevronRight
            size={14}
            className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
          />
        </h3>
        <p className="text-xs text-slate-400 mt-1 font-medium">{description}</p>
      </div>
      <Icon className="absolute -right-4 -bottom-4 w-20 h-20 text-slate-50 group-hover:text-slate-100/50 transition-colors pointer-events-none" />
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
              <h1 className="text-3xl font-black text-slate-900 tracking-tight font-syne italic">
                Solar<span className="text-[#1a5695] not-italic">OS</span>{" "}
                Dashboard
              </h1>
              <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                <TrendingUp size={16} className="text-green-500" />
                System operational: {counts?.active_customers || 0} active
                projects
              </p>
            </div>
            {isSyncing && (
              <div className="flex items-center gap-2 text-[#1a5695] bg-blue-50/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-blue-100">
                <Loader2 className="animate-spin" size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Live Sync
                </span>
              </div>
            )}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(7)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-40 bg-white rounded-3xl animate-pulse border border-slate-100"
                  />
                ))
            ) : (
              <>
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
                  label="Kit Prep"
                  count={counts?.kit_pending}
                  color="#dc2626"
                  icon={Package}
                  description="Material readiness"
                  onClick={() => navigate("/kitready")}
                />
                <StatCard
                  index={3}
                  label="Logistics"
                  count={counts?.dispatch_pending}
                  color="#7c3aed"
                  icon={Truck}
                  description="Delivery management"
                  onClick={() => navigate("/dispatch")}
                />
                <StatCard
                  index={4}
                  label="Structure"
                  count={counts?.fab_pending}
                  color="#059669"
                  icon={Hammer}
                  description="On-site fabrication"
                  onClick={() => navigate("/fabrication")}
                />
                <StatCard
                  index={5}
                  label="Wiring"
                  count={counts?.wiring_pending}
                  color="#0891b2"
                  icon={Zap}
                  description="Electrical finishing"
                  onClick={() => navigate("/wiring")}
                />
                <StatCard
                  index={6}
                  label="Customers"
                  count={counts?.active_customers}
                  color="#4f46e5"
                  icon={FileText}
                  description="Total active files"
                  onClick={() => navigate("/customers")}
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
