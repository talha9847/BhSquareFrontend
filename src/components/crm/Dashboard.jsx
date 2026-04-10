import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);

  // Instant Loading Logic: Check localStorage so the dashboard is never empty on visit
  const [counts, setCounts] = useState(() => {
    const saved = localStorage.getItem("solar_dash_cache");
    return saved
      ? JSON.parse(saved)
      : {
          pending_leads: 0,
          active_customers: 0,
          kit_pending: 0,
          fab_pending: 0,
          wiring_pending: 0,
          registration_pending: 0,
          dispatch_pending: 0,
        };
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/leads/pendingCounts", {
        withCredentials: true,
      });
      if (res.status === 200) {
        setCounts(res.data.data);
        // Save to cache for the next visit
        localStorage.setItem("solar_dash_cache", JSON.stringify(res.data.data));
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      // Small delay to make the transition feel smooth
      setTimeout(() => setLoading(false), 600);
    }
  };

  const StatCard = ({
    label,
    count,
    color,
    description,
    icon: Icon,
    onClick,
    index, // Added index for staggered animation delay
  }) => (
    <div
      onClick={onClick}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
      className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700"
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
          <div className="text-2xl font-black text-slate-800">{count}</div>
        </div>
      </div>
      <div className="mt-4 relative z-10">
        <h3 className="font-bold text-slate-700 group-hover:text-[#1a5695] flex items-center gap-1">
          {label}{" "}
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
          {/* Header */}
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight font-syne italic">
                Solar<span className="text-[#1a5695] not-italic">OS</span>{" "}
                Dashboard
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-slate-500 font-medium flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-500" />
                  System operational: Tracking {counts.active_customers} active
                  projects
                </p>
              </div>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-[#1a5695] bg-blue-50/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-blue-100 animate-pulse">
                <Loader2 className="animate-spin" size={18} />
                <span className="text-xs font-black uppercase tracking-tighter">
                  Syncing Live Data
                </span>
              </div>
            )}
          </header>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* If it's the very first visit (no cache), show skeleton. Otherwise, show cached data. */}
            {loading && counts.pending_leads === 0 ? (
              Array(7)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-32 bg-white rounded-3xl animate-pulse border border-slate-100"
                  />
                ))
            ) : (
              <>
                <StatCard
                  index={0}
                  label="Leads"
                  count={counts.pending_leads}
                  color="#1e40af"
                  icon={Users}
                  description="Potential customers"
                  onClick={() => navigate("/leads")}
                />
                <StatCard
                  index={1}
                  label="Govt. Reg"
                  count={counts.registration_pending}
                  color="#ea580c"
                  icon={ClipboardCheck}
                  description="Subsidy & Registration"
                  onClick={() => navigate("/registration")}
                />
                <StatCard
                  index={2}
                  label="Kit Prep"
                  count={counts.kit_pending}
                  color="#dc2626"
                  icon={Package}
                  description="Material readiness"
                  onClick={() => navigate("/kitready")}
                />
                <StatCard
                  index={3}
                  label="Logistics"
                  count={counts.dispatch_pending}
                  color="#7c3aed"
                  icon={Truck}
                  description="Delivery management"
                  onClick={() => navigate("/dispatch")}
                />
                <StatCard
                  index={4}
                  label="Structure"
                  count={counts.fab_pending}
                  color="#059669"
                  icon={Hammer}
                  description="On-site fabrication"
                  onClick={() => navigate("/fabrication")}
                />
                <StatCard
                  index={5}
                  label="Wiring"
                  count={counts.wiring_pending}
                  color="#0891b2"
                  icon={Zap}
                  description="Electrical finishing"
                  onClick={() => navigate("/wiring")}
                />
                <StatCard
                  index={6}
                  label="Customers"
                  count={counts.active_customers}
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
