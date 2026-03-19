import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  AlertCircle,
  Banknote,
  Percent,
  MessageSquare,
  Upload,
  Loader2,
  Save,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const LoanStep = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // FORM STATE BASED ON YOUR NOTES
  const [loanData, setLoanData] = useState({
    loanApplied: false,
    panCard: false,
    otherDocs: false,
    bankRemark: "",
    quotationRate: "",
  });

  useEffect(() => {
    // Simulate fetching previous data
    setTimeout(() => setPageLoading(false), 800);
  }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Loan details updated successfully");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Kit Ready"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#1a5695] transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                Loan Application
              </h1>
              <p className="text-sm text-slate-500 font-medium italic">
                Processing Documents & Bank Updates
              </p>
            </div>
          </div>

          {pageLoading ? (
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm py-32 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Loading Documents
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT COLUMN: DOCUMENT CHECKLIST */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 text-[#1a5695] rounded-xl">
                      <FileText size={18} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-700">
                      Required Documents
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* PAN CARD TOGGLE */}
                    <div
                      onClick={() =>
                        setLoanData({ ...loanData, panCard: !loanData.panCard })
                      }
                      className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between ${loanData.panCard ? "border-emerald-500 bg-emerald-50/30" : "border-slate-100 bg-slate-50/50"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${loanData.panCard ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}
                        >
                          <CheckCircle2 size={16} />
                        </div>
                        <span className="text-xs font-black uppercase text-slate-700">
                          PAN Card *
                        </span>
                      </div>
                    </div>

                    {/* OTHER DOCS TOGGLE */}
                    <div
                      onClick={() =>
                        setLoanData({
                          ...loanData,
                          otherDocs: !loanData.otherDocs,
                        })
                      }
                      className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between ${loanData.otherDocs ? "border-emerald-500 bg-emerald-50/30" : "border-slate-100 bg-slate-50/50"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${loanData.otherDocs ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}
                        >
                          <CheckCircle2 size={16} />
                        </div>
                        <span className="text-xs font-black uppercase text-slate-700">
                          Other Documents
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BANK REMARKS SECTION */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                      <MessageSquare size={18} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-700">
                      Last Update from Bank
                    </h2>
                  </div>
                  <textarea
                    placeholder="Enter bank remarks or status update..."
                    className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-[32px] focus:bg-white focus:border-[#1a5695] outline-none text-sm transition-all resize-none"
                    value={loanData.bankRemark}
                    onChange={(e) =>
                      setLoanData({ ...loanData, bankRemark: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: LOAN STATUS & RATE */}
              <div className="space-y-6">
                {/* LOAN APPLIED TOGGLE */}
                <div
                  className={`p-8 rounded-[40px] border transition-all ${loanData.loanApplied ? "bg-[#1a5695] text-white border-transparent" : "bg-white border-slate-200"}`}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div
                      className={`p-3 rounded-2xl ${loanData.loanApplied ? "bg-white/20" : "bg-blue-50 text-[#1a5695]"}`}
                    >
                      <Banknote size={24} />
                    </div>
                    <button
                      onClick={() =>
                        setLoanData({
                          ...loanData,
                          loanApplied: !loanData.loanApplied,
                        })
                      }
                      className={`w-14 h-7 rounded-full flex items-center px-1.5 transition-all ${loanData.loanApplied ? "bg-emerald-400 justify-end" : "bg-slate-200 justify-start"}`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
                    </button>
                  </div>
                  <h3
                    className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${loanData.loanApplied ? "text-white/60" : "text-slate-400"}`}
                  >
                    Application Status
                  </h3>
                  <p className="text-xl font-black uppercase">
                    {loanData.loanApplied ? "Loan Applied" : "Not Applied Yet"}
                  </p>
                </div>

                {/* QUOTATION RATE */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                      <Percent size={18} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-700">
                      Quotation Rate
                    </h2>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-6 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white outline-none font-bold text-lg transition-all"
                      value={loanData.quotationRate}
                      onChange={(e) =>
                        setLoanData({
                          ...loanData,
                          quotationRate: e.target.value,
                        })
                      }
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300">
                      %
                    </span>
                  </div>
                </div>

                {/* SAVE BUTTON */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-5 bg-slate-900 text-white rounded-[32px] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-[#1a5695] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Updating...
                    </>
                  ) : (
                    <>
                      <Save size={18} /> Save Progress
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LoanStep;
