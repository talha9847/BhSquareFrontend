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
  BarChart3,
  Calendar,
  CalendarRange,
  FileDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import it as a variable
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState(() => {
    const saved = localStorage.getItem("solar_dash_cache");
    return saved ? JSON.parse(saved) : null;
  });

  // Analytics & Filter States
  const [analyticsData, setAnalyticsData] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("preset");
  const [filters, setFilters] = useState({
    months: 3,
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(!counts);
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();

  // Add this with your other states
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState([]);

  const [reportFilters, setReportFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Group data by month
    const groupedData = reportData.reduce((acc, item) => {
      if (!acc[item.month]) acc[item.month] = [];
      acc[item.month].push(item);
      return acc;
    }, {});

    const body = [];

    Object.keys(groupedData).forEach((month) => {
      // Add a full-width month header row
      body.push([
        {
          content: month,
          colSpan: 6,
          styles: {
            halign: "left",
            fillColor: [220, 220, 220],
            fontStyle: "bold",
          },
        },
      ]);

      // Add rows under that month
      groupedData[month].forEach((item) => {
        body.push([
          item.customer_name,
          item.address,
          `${item.total_capacity} kW`,
          item.number_of_panels,
          `${item.panel_wattage} W`,
          item.source_name,
        ]);
      });
    });

    autoTable(doc, {
      head: [
        [
          "Customer",
          "Address",
          "Capacity (kW)",
          "Panels",
          "Wattage (W)",
          "Source",
        ],
      ],
      body: body,
      startY: 25,
      theme: "grid",
      headStyles: { fillColor: [26, 86, 149] },
      styles: { fontSize: 9 },
    });

    doc.text("Customer Completion Report - Stage 9", 14, 15);
    doc.save(`SolarOS_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };
  // 1. Fetch Summary Counts (Top Level Stats)
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
        setCounts(res.data.data);
        localStorage.setItem("solar_dash_cache", JSON.stringify(res.data.data));
        localStorage.setItem("solar_dash_last_fetch", now.toString());
      }
    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  const fetchReportData = useCallback(async () => {
    setReportLoading(true);
    try {
      const res = await axios.post(
        `/api/leads/getCustomerReport`,
        {
          startDate: reportFilters.startDate,
          endDate: reportFilters.endDate,
        },
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        setReportData(res.data.data);
      }
    } catch (error) {
      console.error("Report Fetch Error:", error);
    } finally {
      setReportLoading(false);
    }
  }, [reportFilters]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // 2. Fetch Lead Analytics (Using req.body)
  const fetchAnalytics = useCallback(async (payload) => {
    setAnalyticsLoading(true);
    try {
      const res = await axios.post("/api/leads/getLeadAnalytics", payload, {
        withCredentials: true,
      });
      if (res.data.success) {
        setAnalyticsData(res.data.data);
      }
    } catch (error) {
      console.error("Analytics Error:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
    // Fetch analytics whenever the preset month changes
    if (viewMode === "preset") {
      fetchAnalytics({ months: filters.months });
    }
  }, [fetchCounts, fetchAnalytics, filters.months, viewMode]);

  const handleCustomSearch = () => {
    if (filters.startDate && filters.endDate) {
      fetchAnalytics({
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }
  };

  // Reusable StatCard Component
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
          {label} <ChevronRight size={14} />
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
          {/* Header */}
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

            <button
              onClick={() => fetchCounts(true)}
              disabled={isSyncing}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1a5695] text-white text-sm font-bold hover:bg-[#15467a] shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCcw
                size={18}
                className={isSyncing ? "animate-spin" : ""}
              />
              {isSyncing ? "Syncing..." : "Sync Data"}
            </button>
          </header>

          {/* --- ANALYTICS CHART SECTION --- */}
          <section className="mb-10">
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
                <div>
                  <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <BarChart3 className="text-[#1a5695]" size={22} />
                    Performance Trends
                  </h2>
                  <p className="text-sm text-slate-400 font-medium">
                    Lead conversion & project completion rates
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-slate-100 p-1.5 rounded-2xl flex">
                    <button
                      onClick={() => setViewMode("preset")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${viewMode === "preset" ? "bg-white shadow-sm text-[#1a5695]" : "text-slate-500"}`}
                    >
                      <Calendar size={14} /> Presets
                    </button>
                    <button
                      onClick={() => setViewMode("custom")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${viewMode === "custom" ? "bg-white shadow-sm text-[#1a5695]" : "text-slate-500"}`}
                    >
                      <CalendarRange size={14} /> Custom
                    </button>
                  </div>

                  {viewMode === "preset" ? (
                    <div className="flex gap-2">
                      {[1, 3, 6, 12].map((m) => (
                        <button
                          key={m}
                          onClick={() => setFilters({ ...filters, months: m })}
                          className={`w-12 h-10 rounded-xl text-xs font-black border transition-all ${filters.months === m ? "bg-[#1a5695] border-[#1a5695] text-white shadow-md" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}
                        >
                          {m}M
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                      <input
                        type="date"
                        className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 ring-blue-100"
                        onChange={(e) =>
                          setFilters({ ...filters, startDate: e.target.value })
                        }
                      />
                      <span className="text-slate-300 font-bold">to</span>
                      <input
                        type="date"
                        className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 ring-blue-100"
                        onChange={(e) =>
                          setFilters({ ...filters, endDate: e.target.value })
                        }
                      />
                      <button
                        onClick={handleCustomSearch}
                        className="bg-[#1a5695] p-2.5 rounded-xl text-white hover:bg-blue-800 transition-all"
                      >
                        <SearchCheck size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-[380px] w-full">
                {analyticsLoading ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                    <Loader2 className="animate-spin text-blue-500 mb-2" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      Analyzing Pipeline...
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analyticsData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorLeads"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#1a5695"
                            stopOpacity={0.15}
                          />
                          <stop
                            offset="95%"
                            stopColor="#1a5695"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#94a3b8",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                        dy={15}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#94a3b8",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend
                        iconType="circle"
                        verticalAlign="top"
                        align="right"
                        wrapperStyle={{
                          paddingBottom: "25px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      />
                      <Area
                        name="New Leads"
                        type="monotone"
                        dataKey="total_leads"
                        stroke="#1a5695"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorLeads)"
                      />
                      <Area
                        name="Converted"
                        type="monotone"
                        dataKey="converted_customers"
                        stroke="#10b981"
                        strokeWidth={4}
                        fill="transparent"
                      />
                      <Area
                        name="Stage 9 Done"
                        type="monotone"
                        dataKey="stage_9_done"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="8 5"
                        fill="transparent"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </section>

          {/* --- QUICK ACTIONS / REPORTS --- */}
          <section className="mb-10 grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1a5695]">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800">
                    Completion Reports (Stage 9)
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Found {reportData.length} customers in selected range
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Date Selectors for the Controller */}
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <input
                    type="date"
                    className="bg-transparent border-none text-xs font-bold outline-none"
                    value={reportFilters.startDate}
                    onChange={(e) =>
                      setReportFilters({
                        ...reportFilters,
                        startDate: e.target.value,
                      })
                    }
                  />
                  <span className="text-slate-300">-</span>
                  <input
                    type="date"
                    className="bg-transparent border-none text-xs font-bold outline-none"
                    value={reportFilters.endDate}
                    onChange={(e) =>
                      setReportFilters({
                        ...reportFilters,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>

                <button
                  onClick={downloadPDF}
                  disabled={reportLoading || reportData.length === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-50 text-rose-700 text-sm font-bold hover:bg-rose-100 transition-all active:scale-95 disabled:opacity-50"
                >
                  {reportLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <FileDown size={18} />
                  )}
                  Download PDF
                </button>
              </div>
            </div>
          </section>
          {/* --- QUICK ACTIONS / REPORTS --- */}

          {/* --- STATUS STAT CARDS GRID --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(12)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-40 bg-white rounded-3xl animate-pulse border border-slate-100"
                  />
                ))
            ) : (
              <>
                {/* Sales & Core */}
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
                  label="Customers"
                  count={counts?.active_customers}
                  color="#4f46e5"
                  icon={FileText}
                  description="Total active files"
                  onClick={() => navigate("/customers")}
                />
                <StatCard
                  index={2}
                  label="Govt. Reg"
                  count={counts?.registration_pending}
                  color="#ea580c"
                  icon={ClipboardCheck}
                  description="Subsidy & Registration"
                  onClick={() => navigate("/registration")}
                />
                <StatCard
                  index={3}
                  label="Loan Process"
                  count={counts?.loan_pending}
                  color="#0369a1"
                  icon={Banknote}
                  description="Financing status"
                  onClick={() => navigate("/loans")}
                />

                {/* Installation */}
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

                {/* Final Stages */}
                <StatCard
                  index={8}
                  label="File Approval"
                  count={counts?.file_appr_pending}
                  color="#10b981"
                  icon={ShieldCheck}
                  description="Manager verification"
                  onClick={() => navigate("/finalstage")}
                />
                <StatCard
                  index={9}
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
