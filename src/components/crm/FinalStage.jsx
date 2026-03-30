import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Gift,
  BadgeDollarSign,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import axios from "axios";

const FinalStage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  // State for the 4 stages from your notes
  const [data, setData] = useState({
    9: { title: "File Uploaded", status: null, loading: false }, // Stage 9
    10: { title: "In Inspection", status: null, loading: false }, // Stage 10
    11: { title: "Redeem", status: null, loading: false, note: "Ignore" }, // Stage 11
    12: { title: "Disbursal", status: null, loading: false }, // Stage 12
  });

  const handleToggle = (stageId, value) => {
    setData((prev) => ({
      ...prev,
      [stageId]: { ...prev[stageId], status: value },
    }));
  };

  const saveStage = async (stageId) => {
    const stage = data[stageId];
    if (stage.status === null)
      return toast.warning(`Please select Yes/No for ${stage.title}`);

    setData((prev) => ({
      ...prev,
      [stageId]: { ...prev[stageId], loading: true },
    }));

    try {
      // Replace with your actual endpoint logic
      // await axios.post(`${apiUrl}/api/project/updateStage`, { stageId, status: stage.status });

      setTimeout(() => {
        toast.success(`${stage.title} status saved!`);
        setData((prev) => ({
          ...prev,
          [stageId]: { ...prev[stageId], loading: false },
        }));
      }, 800);
    } catch (error) {
      toast.error("Failed to save status");
      setData((prev) => ({
        ...prev,
        [stageId]: { ...prev[stageId], loading: false },
      }));
    }
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

        <main className="p-4 lg:p-8 max-w-4xl mx-auto w-full">
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 bg-[#1a5695] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <CheckCircle2 size={22} />
              </div>
              Final Project Verification
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3 ml-1">
              Confirm the final processing steps below
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* STAGE 09 */}
            <StageRow
              id="09"
              icon={<FileText size={18} />}
              title={data[9].title}
              status={data[9].status}
              loading={data[9].loading}
              onToggle={(val) => handleToggle(9, val)}
              onSave={() => saveStage(9)}
            />

            {/* STAGE 10 */}
            <StageRow
              id="10"
              icon={<Search size={18} />}
              title={data[10].title}
              status={data[10].status}
              loading={data[10].loading}
              onToggle={(val) => handleToggle(10, val)}
              onSave={() => saveStage(10)}
            />

            {/* STAGE 11 */}
            <StageRow
              id="11"
              icon={<Gift size={18} />}
              title={data[11].title}
              status={data[11].status}
              loading={data[11].loading}
              onToggle={(val) => handleToggle(11, val)}
              onSave={() => saveStage(11)}
              extra={
                <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-lg border border-amber-100 text-[8px] font-black text-amber-600 uppercase tracking-widest ml-2">
                  <AlertCircle size={10} /> {data[11].note}
                </div>
              }
            />

            {/* STAGE 12 */}
            <StageRow
              id="12"
              icon={<BadgeDollarSign size={18} />}
              title={data[12].title}
              status={data[12].status}
              loading={data[12].loading}
              onToggle={(val) => handleToggle(12, val)}
              onSave={() => saveStage(12)}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

// Internal Row Component
const StageRow = ({
  id,
  icon,
  title,
  status,
  loading,
  onToggle,
  onSave,
  extra,
}) => {
  return (
    <div className="bg-white rounded-[28px] border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-[#1a5695]/30">
      <div className="flex items-center gap-5 flex-1 w-full sm:w-auto">
        <div className="text-xl font-black text-slate-100 italic select-none">
          {id}
        </div>
        <div className="flex items-center gap-3 text-[#1a5695]">
          <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div className="flex items-center">
            <h3 className="font-black text-[12px] uppercase tracking-tight text-slate-800">
              {title}
            </h3>
            {extra}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        {/* Toggle Yes/No */}
        <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
          <button
            onClick={() => onToggle("yes")}
            className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
              status === "yes"
                ? "bg-emerald-500 text-white shadow-md"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => onToggle("no")}
            className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
              status === "no"
                ? "bg-red-500 text-white shadow-md"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            No
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={loading}
          className="h-11 w-11 sm:w-auto sm:px-6 bg-[#1a5695] text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-[#15467a] active:scale-95 transition-all shadow-lg shadow-blue-50 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <Save size={16} />
              <span className="hidden sm:inline text-[9px] font-black uppercase tracking-[0.1em]">
                Save
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FinalStage;
