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
import Navbar from "../crm/Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";

const SLoanStep = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { leadId, customerId } = location.state || {};
  if (!leadId || !customerId) {
    navigate("/kitready");
  }
  const apiUrl = import.meta.env.VITE_API_URL;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  // States for loaders
  const [savingDocs, setSavingDocs] = useState(false);

  // 2. DOCUMENTS DATA (PAN is just the first item in this array)
  const [docs, setDocs] = useState([
    { id: "pan-card", name: "PAN Card", file: null, isRequired: true },
  ]);

  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");

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
      const res = await axios.post(`/api/loan/uploadLoanDocuments`, formData, {
        withCredentials: true,
      });
    } catch (error) {}
    console.log(
      "Uploading Files:",
      docs.filter((d) => d.file),
    );
    await new Promise((r) => setTimeout(r, 1000));
    setSavingDocs(false);
    toast.success("Documents synced!");
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
            </div>
          </div>

          {pageLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-slate-300" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN (66%) */}

              {/* RIGHT COLUMN (33%) */}
              <div className="lg:col-span-4 space-y-8">
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
      </div>
    </div>
  );
};

export default SLoanStep;
