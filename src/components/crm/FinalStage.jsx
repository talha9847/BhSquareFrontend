import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Gift,
  BadgeDollarSign,
  ChevronRight,
  Loader2,
  AlertCircle,
  Upload,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { toast } from "react-toastify";

const FinalStage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // States for the 4 steps based on your notes
  const [stages, setStages] = useState({
    fileUpload: { status: null, file: null }, // 9: File Upload
    inspection: { status: null }, // 10: Inspection
    redeem: { status: null, note: "Ignore" }, // 11: Redeem (Note: Ignore)
    disbursal: { status: null }, // 12: Disbursal
  });

  const toggleStatus = (stage, val) => {
    setStages((prev) => ({
      ...prev,
      [stage]: { ...prev[stage], status: val },
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      toast.success("Final stage completed and records updated!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Final Stage"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1a5695] rounded-2xl flex items-center justify-center text-white">
                <CheckCircle2 size={24} />
              </div>
              Project Completion Stage
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 ml-1">
              Final Verification & Disbursement Process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 9: File Upload */}
            <StageCard
              number="09"
              title="File Upload"
              icon={<FileText size={20} />}
              status={stages.fileUpload.status}
              onToggle={(val) => toggleStatus("fileUpload", val)}
            >
              <div className="mt-4 relative group border-2 border-dashed border-slate-100 rounded-2xl p-4 hover:bg-blue-50/50 transition-all">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-[#1a5695]">
                    <Upload size={16} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    Attach Final Documents
                  </span>
                </div>
              </div>
            </StageCard>

            {/* Step 10: Inspection */}
            <StageCard
              number="10"
              title="In Inspection"
              icon={<Search size={20} />}
              status={stages.inspection.status}
              onToggle={(val) => toggleStatus("inspection", val)}
            />

            {/* Step 11: Redeem */}
            <StageCard
              number="11"
              title="Redeem Status"
              icon={<Gift size={20} />}
              status={stages.redeem.status}
              onToggle={(val) => toggleStatus("redeem", val)}
            >
              <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-100">
                <AlertCircle size={14} className="text-amber-600" />
                <span className="text-[10px] font-black text-amber-700 uppercase">
                  System Note: {stages.redeem.note}
                </span>
              </div>
            </StageCard>

            {/* Step 12: Disbursal */}
            <StageCard
              number="12"
              title="Disbursal"
              icon={<BadgeDollarSign size={20} />}
              status={stages.disbursal.status}
              onToggle={(val) => toggleStatus("disbursal", val)}
            />
          </div>

          {/* Submit Action */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="group relative px-12 py-5 bg-[#1a5695] text-white rounded-[28px] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl shadow-blue-200 hover:bg-[#15467a] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Done & Close Project
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

// Reusable Stage Component for consistent theme
const StageCard = ({ number, title, icon, status, onToggle, children }) => {
  return (
    <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="text-[20px] font-black text-slate-100 leading-none">
            {number}
          </div>
          <div>
            <div className="flex items-center gap-2 text-[#1a5695] mb-1">
              {icon}
              <h3 className="font-black text-sm uppercase tracking-tighter text-slate-800">
                {title}
              </h3>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onToggle("yes")}
                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                  status === "yes"
                    ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100"
                    : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => onToggle("no")}
                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                  status === "no"
                    ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-100"
                    : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>
        {status === "yes" && (
          <CheckCircle2 className="text-emerald-500" size={20} />
        )}
        {status === "no" && <XCircle className="text-red-500" size={20} />}
      </div>
      {children}
    </div>
  );
};

export default FinalStage;
