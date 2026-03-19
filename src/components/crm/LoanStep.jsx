import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  Building2,
  MessageSquare,
  Plus,
  Loader2,
  Save,
  X,
  Upload,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";

const LoanStep = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { leadId, customerId } = location.state || {};
  if (!leadId || !customerId) {
    navigate("/kitready");
  }
  const apiUrl = import.meta.env.VITE_API_URL;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // States for loaders
  const [savingAll, setSavingAll] = useState(false);
  const [savingDocs, setSavingDocs] = useState(false);

  const [isApproved, setIsApproved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submittingNextStage, setSubmittingNextStage] = useState(false);

  // 1. BANK & LOAN DATA
  const [loanData, setLoanData] = useState({
    bankName: "",
    loanApplied: false,
    estimateAmount: "",
    approvedAmount: "",
    interestRate: "",
    bankRemark: "",
    isApproved: false,
  });

  // 2. DOCUMENTS DATA (PAN is just the first item in this array)
  const [docs, setDocs] = useState([
    { id: "pan-card", name: "PAN Card", file: null, isRequired: true },
  ]);

  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");

  useEffect(() => {
    getLoan();
  }, []);

  // --- DOCUMENT HANDLERS ---

  const handleFileChange = (id, file) => {
    if (!file) return;
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, file } : d)));
    toast.info(`${file.name} attached`);
  };

  const addNewDocType = () => {
    if (!newDocName.trim()) return;
    const newEntry = {
      id: Date.now().toString(),
      name: newDocName,
      file: null,
      isRequired: false,
    };
    setDocs([...docs, newEntry]);
    setNewDocName("");
    setIsAddingDoc(false);
  };

  const removeDocType = (id) => {
    setDocs(docs.filter((d) => d.id !== id));
  };

  // --- SAVE HANDLERS ---

  const handleSaveDocsOnly = async () => {
    setSavingDocs(true);
    const formData = new FormData();
    if (!leadId) {
      console.log("lead Id not found");
      return;
    }
    formData.append("leadId", leadId);
    formData.append("customerId", customerId);

    docs.forEach((doc, index) => {
      if (doc.file) {
        // Use `docs[index].name` as key for backend, or just "files"
        formData.append(doc.name, doc.file);
      }
    });
    try {
      const res = await axios.post(
        `${apiUrl}/api/loan/uploadLoanDocuments`,
        formData,
      );
    } catch (error) {}
    console.log(
      "Uploading Files:",
      docs.filter((d) => d.file),
    );
    await new Promise((r) => setTimeout(r, 1000));
    setSavingDocs(false);
    toast.success("Documents synced!");
  };

  const handleNextStage = async () => {
    setSubmittingNextStage(true);
    try {
      // 1. First save any pending loan data
      const body = {
        bank_name: loanData.bankName,
        is_applied: loanData.loanApplied,
        is_approved: true, // Mark as approved
        estimated: loanData.estimateAmount || null,
        loan_amount: loanData.approvedAmount || null,
        interest_rate: loanData.interestRate || null,
        bank_remarks: loanData.bankRemark || "",
        stage: "Disbursement", // Or whatever your next stage name is
      };

      const res = await axios.put(
        `${apiUrl}/api/loan/updateLoan/${customerId}`,
        body,
      );

      if (res.status === 200) {
        toast.success("Loan Approved! Moving to Disbursement...");
        navigate("/disbursement", { state: { leadId, customerId } });
      }
    } catch (error) {
      toast.error("Failed to update stage");
    } finally {
      setSubmittingNextStage(false);
      setShowModal(false);
    }
  };

  const getLoan = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/api/loan/getLoanByCustomerId/${customerId}`,
      );
      console.log(res.data.data);
      const data = res.data.data;
      if (data.is_approved) setIsApproved(true);
      setLoanData({
        bankName: data.bank_name,
        loanApplied: data.is_applied,
        estimateAmount: data.estimated,
        approvedAmount: data.loan_amount,
        interestRate: data.interest_rate,
        bankRemark: data.bank_remarks,
        isApproved: data.is_approved,
      });
      setPageLoading(false);
    } catch (error) {
      setPageLoading(false);
    }
  };

  const handleSaveFullProfile = async () => {
    setSavingAll(true);
    console.log("Final Submit:", loanData);

    try {
      const body = {
        bank_name: loanData.bankName,
        is_applied: loanData.loanApplied,
        estimated: loanData.estimateAmount || null,
        loan_amount: loanData.approvedAmount || null,
        interest_rate: loanData.interestRate || null,
        bank_remarks: loanData.bankRemark || "",
        is_approved: loanData.isApproved,
      };
      const res = await axios.put(
        `${apiUrl}/api/loan/updateLoan/${customerId}`,
        body,
      );

      if (res.status == 200) {
        getLoan();
        toast.success("Updated successfullyl");
        setSavingAll(false);
      }
    } catch (error) {
      toast.error("Internal server error");
      setSavingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Kit Ready"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-10 max-w-[1400px] mx-auto w-full">
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#1a5695] shadow-sm transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                  Loan Processing
                </h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                  Step 04 / Bank Coordination
                </p>
              </div>
            </div>

            <button
              onClick={handleSaveFullProfile}
              disabled={savingAll}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[20px] font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-[#1a5695] transition-all disabled:opacity-50"
            >
              {savingAll ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              Save All Changes
            </button>
          </div>

          {pageLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-slate-300" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN (66%) */}
              <div className="lg:col-span-8 space-y-8">
                {/* Bank Name */}
                <div className="bg-white p-6 md:p-8 rounded-[35px] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 text-[#1a5695] mb-6">
                    <Building2 size={20} />
                    <h2 className="text-xs font-black uppercase tracking-widest">
                      Lending Institution
                    </h2>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Bank Name..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                    value={loanData.bankName}
                    onChange={(e) =>
                      setLoanData({ ...loanData, bankName: e.target.value })
                    }
                  />
                </div>

                {/* Financials Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {["estimateAmount", "approvedAmount", "interestRate"].map(
                    (field) => (
                      <div
                        key={field}
                        className="bg-white p-6 rounded-[30px] border border-slate-200 shadow-sm"
                      >
                        <p className="text-[9px] font-black uppercase text-slate-400 mb-3 tracking-wider">
                          {field.replace(/([A-Z])/g, " $1")}
                        </p>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full bg-transparent outline-none font-black text-xl text-slate-800"
                          value={loanData[field]}
                          onChange={(e) =>
                            setLoanData({
                              ...loanData,
                              [field]: e.target.value,
                            })
                          }
                        />
                      </div>
                    ),
                  )}
                </div>

                {/* Remarks */}
                <div className="bg-white p-6 md:p-8 rounded-[35px] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 text-amber-600 mb-6">
                    <MessageSquare size={20} />
                    <h2 className="text-xs font-black uppercase tracking-widest">
                      Internal Remarks
                    </h2>
                  </div>
                  <textarea
                    placeholder="Type bank feedback here..."
                    className="w-full h-40 p-6 bg-slate-50 border border-slate-100 rounded-[25px] outline-none font-medium text-slate-600 resize-none"
                    value={loanData.bankRemark}
                    onChange={(e) =>
                      setLoanData({ ...loanData, bankRemark: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* RIGHT COLUMN (33%) */}
              <div className="lg:col-span-4 space-y-8">
                {/* Status Toggle */}
                <div
                  className={`p-8 rounded-[35px] border transition-all duration-300 ${loanData.loanApplied ? "bg-emerald-500 border-emerald-500 shadow-emerald-200 shadow-lg" : "bg-white border-slate-200"}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-[10px] font-black uppercase ${loanData.loanApplied ? "text-white" : "text-slate-400"}`}
                    >
                      Application Status
                    </span>
                    <button
                      onClick={() =>
                        setLoanData({
                          ...loanData,
                          loanApplied: !loanData.loanApplied,
                        })
                      }
                      className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors ${loanData.loanApplied ? "bg-white/20" : "bg-slate-100"}`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${loanData.loanApplied ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </button>
                  </div>
                  <h3
                    className={`text-xl font-black uppercase ${loanData.loanApplied ? "text-white" : "text-slate-800"}`}
                  >
                    {loanData.loanApplied ? "Applied" : "Not Applied"}
                  </h3>
                </div>

                {/* DOCUMENTS CARD */}
                {/* DOCUMENTS CARD */}
                <div className="bg-white p-6 md:p-8 rounded-[35px] border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xs font-black uppercase tracking-widest">
                      Documents
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveDocsOnly}
                        disabled={savingDocs}
                        className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                      >
                        {savingDocs ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => setIsAddingDoc(true)}
                        className="p-2.5 bg-[#1a5695] text-white rounded-xl shadow-lg active:scale-95 transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {docs.map((doc) => (
                      <div key={doc.id} className="group relative">
                        {/* 1. REMOVE BUTTON - Moved to absolute top-right and added higher z-index */}
                        {!doc.isRequired && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation(); // Prevents the label/input from being triggered
                              removeDocType(doc.id);
                            }}
                            className="absolute top-2 right-2 z-20 text-slate-300 hover:text-red-500 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        )}

                        {/* 2. UPLOAD LABEL */}
                        <label
                          className={`flex flex-col p-4 rounded-2xl border-2 transition-all cursor-pointer relative z-10 ${
                            doc.file
                              ? "border-emerald-500 bg-emerald-50/20"
                              : "border-slate-50 bg-slate-50 hover:border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <FileText
                                size={16}
                                className={
                                  doc.file
                                    ? "text-emerald-500"
                                    : "text-slate-400"
                                }
                              />
                              <span className="text-[10px] font-black uppercase text-slate-700 truncate max-w-[120px]">
                                {doc.name}
                              </span>
                            </div>
                            {/* Empty div to maintain spacing where the X button used to be */}
                            {!doc.isRequired && <div className="w-4" />}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-slate-400 truncate max-w-[180px]">
                              {doc.file
                                ? doc.file.name
                                : doc.isRequired
                                  ? "REQUIRED *"
                                  : "TAP TO UPLOAD"}
                            </span>
                            <Upload
                              size={14}
                              className={
                                doc.file ? "text-emerald-500" : "text-slate-300"
                              }
                            />
                          </div>

                          {/* 3. HIDDEN INPUT */}
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              // Important: check if file exists to prevent errors if user cancels
                              if (e.target.files && e.target.files[0]) {
                                handleFileChange(doc.id, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                    ))}

                    {/* Add New Doc Inline */}
                    {isAddingDoc && (
                      <div className="p-5 rounded-2xl border-2 border-dashed border-[#1a5695] bg-blue-50/30 animate-in zoom-in-95">
                        <input
                          autoFocus
                          placeholder="Document Type Name..."
                          className="w-full bg-transparent border-b border-[#1a5695]/20 pb-2 text-[10px] font-black uppercase outline-none text-[#1a5695] mb-4"
                          value={newDocName}
                          onChange={(e) => setNewDocName(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && addNewDocType()
                          }
                        />
                        <div className="flex justify-end gap-4 text-[10px] font-black uppercase tracking-widest">
                          <button
                            onClick={() => setIsAddingDoc(false)}
                            className="text-slate-400"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              addNewDocType();
                            }}
                            className="text-[#1a5695]"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* FINAL APPROVAL SECTION */}
        {/* FINAL APPROVAL SECTION */}
        <div className="mt-10 pt-10 border-t border-slate-200">
          <div
            className={`p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 ${isApproved ? "bg-emerald-500 text-white shadow-2xl shadow-emerald-200" : "bg-white border border-slate-200"}`}
          >
            <div className="flex items-center gap-6">
              <div
                className={`p-4 rounded-3xl transition-colors ${isApproved ? "bg-white/20" : "bg-slate-50"}`}
              >
                <CheckCircle2
                  size={32}
                  className={isApproved ? "text-white" : "text-slate-300"}
                />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">
                  Final Approval Status
                </h3>
                <p
                  className={`text-[11px] font-bold uppercase tracking-widest ${isApproved ? "text-emerald-100" : "text-slate-400"}`}
                >
                  {isApproved
                    ? "Loan confirmed as approved"
                    : "Toggle once the bank confirms approval"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* 1. THE TOGGLE */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                  Approved
                </span>
                <button
                  onClick={() => setIsApproved(!isApproved)}
                  className={`w-14 h-7 rounded-full p-1 transition-colors flex items-center ${isApproved ? "bg-white/30" : "bg-slate-200"}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${isApproved ? "translate-x-7" : "translate-x-0"}`}
                  />
                </button>
              </div>

              {/* 2. THE NEXT BUTTON (Only shows when approved is true) */}
              {isApproved && (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all animate-in slide-in-from-right-4"
                >
                  Proceed to Next Stage
                  <ArrowLeft size={16} className="rotate-180" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* APPROVAL MODAL (Keep this as defined in previous step) */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[40px] p-8 md:p-12 max-w-lg w-full shadow-2xl animate-in zoom-in-95">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-8 mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 text-center uppercase tracking-tight mb-4">
                Confirm Stage Move
              </h2>
              <p className="text-slate-500 text-center font-medium leading-relaxed mb-10">
                You are moving this lead to the next stage. This will notify the
                disbursement team. Are you sure you want to proceed?
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                >
                  Go Back
                </button>
                <button
                  onClick={handleNextStage}
                  disabled={submittingNextStage}
                  className="py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#1a5695] shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submittingNextStage ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Yes, Proceed"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanStep;
