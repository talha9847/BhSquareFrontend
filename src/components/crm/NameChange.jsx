import React, { useEffect, useState } from "react";
import {
  Save,
  FileText,
  Plus,
  Trash2,
  Upload,
  ArrowLeft,
  X,
  Check,
  Loader2,
  UserCheck,
  ClipboardCheck,
  ClipboardList,
  Navigation,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const NameChange = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId, customerName, contactNumber } = location.state || {};

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [docLoad, setDocLoad] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [ready, setReady] = useState(false);
  const [nextLoad, setNextLoad] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const [documents, setDocuments] = useState([
    { id: 1, name: "Passport Size Pic", file: null },
    { id: 2, name: "Aadhar Card", file: null },
    { id: 3, name: "Akarni / Sales Deed / Index-2", file: null },
    { id: 4, name: "Property Card / 7-12 / 8-A", file: null },
    { id: 5, name: "Hakk Patra", file: null },
    { id: 6, name: "Tharav of Authority Signatory", file: null },
    { id: 7, name: "Pan Card (Category Change)", file: null },
    { id: 8, name: "Society Registration", file: null },
    { id: 9, name: "Death Certificate", file: null },
    { id: 10, name: "Samti Patra (Multi-Owner)", file: null },
    { id: 11, name: "Pedhinamu (Multi-Varasdar)", file: null },
  ]);

  const handleFileChange = (id, file) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, file } : doc)),
    );
  };

  const confirmAddDoc = () => {
    if (newDocName.trim()) {
      setDocuments((prev) => [
        ...prev,
        { id: Date.now(), name: newDocName, file: null },
      ]);
      setNewDocName("");
      setIsAddingDoc(false);
    }
  };

  const removeDoc = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const getStatus = async () => {
    try {
      const res = await axios.post(`${apiUrl}/api/namechange/checkReady`, {
        customerId: customerId,
      });

      if (res.status == 200) {
        if (res.data.isReady.status) {
          setIsReady(true);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    getStatus();
  }, []);
  const saveNameChangeDocs = async () => {
    const hasFiles = documents.some((doc) => doc.file !== null);
    if (!hasFiles) {
      toast.error("Please upload at least one document");
      return;
    }

    try {
      setDocLoad(true);
      const formData = new FormData();
      formData.append("customerId", customerId);
      formData.append("customerName", customerName);
      formData.append("contactNumber", contactNumber);
      formData.append("stage", "NameChange");

      documents.forEach((doc) => {
        if (doc.file) {
          formData.append(doc.name, doc.file);
        }
      });

      const res = await axios.post(
        `${apiUrl}/api/namechange/uploadNameChangeFiles`,
        formData,
      );
      if (res.status === 200) {
        if (res.data.nameChangeStatus.status) {
          setIsReady(true);
        }
        toast.success("Documents uploaded successfully");

        setDocuments((prev) => prev.map((d) => ({ ...d, file: null })));
      }
    } catch (error) {
      toast.error("Server error during upload");
    } finally {
      setDocLoad(false);
    }
  };

  const goToNextStage = async () => {
    try {
      setNextLoad(true);
      // Add your transition API logic here
      const res = await axios.post(`${apiUrl}/api/namechange/goToStageThree`, {
        customerId: customerId,
      });

      if (res.status == 200) {
        navigate("/customers");
      }
    } catch (e) {
      toast.error("Failed to transition stage");
      setNextLoad(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-syne">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Customers"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#1a5695] transition-all group shrink-0"
              >
                <ArrowLeft
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight uppercase truncate">
                  Name Change Request
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Customer ID: {customerId || "N/A"}
                </p>
              </div>
            </div>

            <button
              onClick={saveNameChangeDocs}
              disabled={docLoad}
              className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 active:scale-95"
            >
              {docLoad ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              {docLoad ? "Saving..." : "Submit All Docs"}
            </button>
          </div>

          {/* Success Banner - Now responsive within container */}
          {isReady && (
            <div className="bg-emerald-50 border border-emerald-100 p-4 lg:p-6 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500 shadow-sm">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                  <div className="relative p-3 lg:p-4 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-200">
                    <ClipboardCheck size={24} />
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                    Verification Complete
                  </h4>
                  <p className="text-sm font-bold text-slate-700">
                    Ready to transition this lead to the next stage
                  </p>
                </div>
              </div>

              <button
                onClick={() => setReady(true)}
                className="group w-full md:w-auto bg-[#1a5695] hover:bg-[#15467a] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/10 active:scale-95"
              >
                Proceed to Next Stage
                <ArrowLeft
                  size={16}
                  className="rotate-180 group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          )}

          {/* Document Grid */}
          <div className="bg-white p-5 lg:p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute -right-10 -top-10 text-slate-50 opacity-50 pointer-events-none">
              <ClipboardList size={240} />
            </div>

            <div className="flex justify-between items-center mb-8 relative z-10">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} className="text-[#1a5695]" /> Required
                Evidence
              </h2>
              {!isAddingDoc && (
                <button
                  onClick={() => setIsAddingDoc(true)}
                  className="text-[10px] font-black uppercase text-[#1a5695] bg-blue-50 px-4 py-2 rounded-xl hover:bg-[#1a5695] hover:text-white transition-all flex items-center gap-2"
                >
                  <Plus size={14} /> Add
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 relative z-10">
              {isAddingDoc && (
                <div className="p-6 border-2 border-[#1a5695] border-dashed rounded-[28px] bg-blue-50/50 flex flex-col justify-between h-44 animate-in zoom-in duration-200">
                  <p className="text-[10px] font-black text-[#1a5695] uppercase">
                    New Category
                  </p>
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g. Marriage Certificate"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    className="bg-transparent border-b-2 border-[#1a5695]/20 focus:border-[#1a5695] outline-none py-2 font-bold text-sm text-slate-700"
                    onKeyDown={(e) => e.key === "Enter" && confirmAddDoc()}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setIsAddingDoc(false)}
                      className="p-2 text-slate-400 hover:text-rose-500"
                    >
                      <X size={20} />
                    </button>
                    <button
                      onClick={confirmAddDoc}
                      className="p-2 text-emerald-600 bg-emerald-50 rounded-xl"
                    >
                      <Check size={20} />
                    </button>
                  </div>
                </div>
              )}

              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="group relative p-6 border-2 border-dashed border-slate-100 rounded-[28px] hover:border-[#1a5695] hover:bg-blue-50/30 transition-all bg-slate-50/50 flex flex-col items-center justify-center text-center h-44"
                >
                  <div className="flex justify-between items-start absolute top-4 w-full px-6">
                    <span className="text-[9px] font-black text-slate-400 uppercase group-hover:text-[#1a5695] leading-tight text-left max-w-[80%]">
                      {doc.name}
                    </span>
                    <button
                      onClick={() => removeDoc(doc.id)}
                      className="text-slate-200 hover:text-rose-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <label className="flex flex-col items-center justify-center cursor-pointer w-full mt-6">
                    <div className="p-3 bg-white rounded-2xl shadow-sm mb-3 text-slate-300 group-hover:text-[#1a5695] group-hover:scale-110 transition-all border border-slate-50">
                      <Upload size={22} />
                    </div>
                    {doc.file ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-lg max-w-full overflow-hidden">
                        <UserCheck
                          size={12}
                          className="text-emerald-600 shrink-0"
                        />
                        <span className="text-[10px] text-emerald-600 font-bold uppercase truncate">
                          {doc.file.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        Drop or Click
                      </span>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange(doc.id, e.target.files[0])
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Transition Modal */}
      {ready && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative bg-white w-[90vw] max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-200 border border-slate-100">
            <button
              onClick={() => setReady(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="bg-[#1a5695] p-8 text-white text-center relative">
              <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                <Navigation size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-black font-syne uppercase tracking-tight">
                Stage Transition
              </h2>
              <p className="text-blue-100/80 text-[10px] font-bold uppercase tracking-widest mt-1">
                Lead: {customerName}
              </p>
            </div>

            <div className="p-8">
              <p className="text-slate-600 text-sm font-medium leading-relaxed text-center mb-8">
                You are about to move this customer to the{" "}
                <span className="text-[#1a5695] font-black italic">
                  Technical Verification
                </span>{" "}
                stage.
              </p>

              <div className="space-y-3">
                <button
                  onClick={goToNextStage}
                  disabled={nextLoad}
                  className="w-full py-4 bg-[#1a5695] hover:bg-[#15467a] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {nextLoad ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    "Confirm & Proceed"
                  )}
                  {!nextLoad && <ArrowLeft size={16} className="rotate-180" />}
                </button>

                <button
                  onClick={() => setReady(false)}
                  className="w-full py-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NameChange;
