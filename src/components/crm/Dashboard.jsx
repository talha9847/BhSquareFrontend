import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      label: "Total Leads",
      value: "24",
      change: "+4 this week",
      color: "#1a5695",
    },
    {
      label: "Capacity",
      value: "112kW",
      change: "Pipeline total",
      color: "#f39200",
    },
    {
      label: "Pending Docs",
      value: "08",
      change: "Action needed",
      color: "#ef4444",
    },
    {
      label: "Revenue",
      value: "18L",
      change: "↑ 12% vs last mo",
      color: "#a855f7",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight font-syne">
                Installation Pipeline
              </h1>
              <p className="text-sm text-slate-500">
                Real-time status of all active solar projects
              </p>
            </div>
            <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm self-start">
              {["Today", "Week", "Month"].map((t, i) => (
                <button
                  key={t}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${i === 0 ? "bg-[#1a5695] text-white" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white p-6 rounded-2xl border border-slate-200 border-b-4 hover:shadow-lg transition-all"
                style={{ borderBottomColor: stat.color }}
              >
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-black text-slate-800">
                  {stat.value}
                </p>
                <p
                  className="text-xs font-bold mt-1"
                  style={{ color: stat.color }}
                >
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Pipeline Progress Section (Placeholder) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">
              Active Project: Ramanbhai Patel
            </h3>
            <div className="relative w-full h-2 bg-slate-100 rounded-full mb-8">
              <div className="absolute top-0 left-0 h-full bg-[#1a5695] rounded-full w-[45%]" />
              {/* Simplified Stage Markers */}
              <div className="flex justify-between mt-4">
                {["Lead", "Visit", "Docs", "Invoice", "Install"].map((s, i) => (
                  <div key={s} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${i <= 2 ? "bg-[#1a5695]" : "bg-slate-200"}`}
                    />
                    <span className="text-[10px] font-bold text-slate-500">
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
