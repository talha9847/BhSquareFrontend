import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  Camera,
  FileText,
  Plus,
  Trash2,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  CloudUpload,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const FinalizeWiring = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { selectedWiring } = state || {};
  const apiUrl = import.meta.env.VITE_API_URL;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState({});

  const [mandatoryDocs, setMandatoryDocs] = useState([]);
  const [otherDocs, setOtherDocs] = useState([]);

  const isEverythingUploaded = () => {
    if (initialLoading) return false;
    if (otherDocs.length === 0) return false;

    // Checks if every single row (Panel 1, Geo Tag, etc.) has a link
    return otherDocs.every(
      (doc) => doc.existingLink && doc.existingLink !== "",
    );
  };

  const fetchData = async () => {
    if (!selectedWiring?.wiring_id) return;
    try {
      setInitialLoading(true);
      const res = await axios.get(
        `${apiUrl}/api/wiring/getWiringDocs/${selectedWiring.wiring_id}`,
      );

      if (res.status === 200 && res.data.data) {
        const allDocsFromDB = res.data.data.map((doc) => ({
          dbId: doc.id,
          docName: doc.doc_name,
          file: null,
          existingLink: doc.doc_link, // This is the Google Drive link
          isFromDB: true,
        }));

        // Put everything into otherDocs so the UI renders them all in the list
        setOtherDocs(allDocsFromDB);
        setMandatoryDocs([]); // Keep this empty if there are no "special" categories
      }
    } catch (error) {
      toast.error("Failed to load documents");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedWiring?.wiring_id]);

  // --- IMPROVED NEXT STAGE WITH LOADER ---
  const handleNextStage = () => {
    Swal.fire({
      title: "Move to Next Stage?",
      text: "Finalizing the wiring process...",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981", // emerald-500
      cancelButtonColor: "#f43f5e", // rose-500
      confirmButtonText: "Yes, Proceed!",
      showLoaderOnConfirm: true, // This enables the loader inside Swal
      preConfirm: async () => {
        try {
          // Replace this with your actual Stage Update API call
          // await axios.post(`${apiUrl}/api/wiring/updateStage`, { id: selectedWiring.wiring_id });
          console.log(selectedWiring);
          const res = await axios.post(
            `${apiUrl}/api/wiring/moveToFinalStage`,
            { customerId: selectedWiring.customer_id },
          );

          if (res.status == 200) {
            navigate("/finalstage");
          }
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
      customClass: {
        popup: "rounded-[32px]",
        confirmButton:
          "rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest",
        cancelButton:
          "rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Stage updated successfully!");
        navigate("/wiring");
      }
    });
  };

  const handleSingleUpload = async (doc) => {
    if (!doc.file) return toast.warning(`Please select a file first`);
    setBtnLoading((prev) => ({ ...prev, [doc.dbId]: true }));
    const formData = new FormData();
    formData.append("wiringId", selectedWiring.wiring_id);
    formData.append("customerId", selectedWiring.customer_id);
    formData.append("wiringDocId", doc.dbId);
    formData.append("docName", doc.docName);
    formData.append("file", doc.file);

    try {
      const res = await axios.post(
        `${apiUrl}/api/wiring/uploadWiringDocs`,
        formData,
      );
      if (res.status === 200 || res.status === 201) {
        toast.success(`${doc.docName.replace("_", " ")} uploaded!`);
        fetchData();
      }
    } catch (error) {
      toast.error(`Upload failed`);
    } finally {
      setBtnLoading((prev) => ({ ...prev, [doc.dbId]: false }));
    }
  };

  const triggerReupload = (list, setList, id) => {
    setList(
      list.map((item) =>
        item.dbId === id ? { ...item, existingLink: null, file: null } : item,
      ),
    );
  };

  const updateFileInList = (list, setList, id, file) => {
    setList(list.map((item) => (item.dbId === id ? { ...item, file } : item)));
  };

  const addOtherDocRow = () =>
    setOtherDocs([
      ...otherDocs,
      { dbId: Date.now(), docName: "", file: null, isFromDB: false },
    ]);

  const removeOtherDocRow = (id) =>
    setOtherDocs(otherDocs.filter((doc) => doc.dbId !== id));

  if (!selectedWiring)
    return <div className="p-10 text-center">No data found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Wiring"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-10 pb-32">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-5 mb-10">
              <button
                onClick={() => navigate(-1)}
                className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#1a5695] transition-all shadow-sm"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                Finalize Site
              </h1>
            </div>

            {initialLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-[#1a5695]" size={40} />
              </div>
            ) : (
              <div className="space-y-10">
                {/* 1. MANDATORY SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mandatoryDocs.map((doc) => (
                    <div
                      key={doc.dbId}
                      className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center"
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${doc.existingLink ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-[#1a5695]"}`}
                      >
                        {doc.docName === "geo_tag" && <MapPin />}
                        {doc.docName === "site_pic" && <Camera />}
                        {doc.docName === "file" && <FileText />}
                      </div>
                      <p className="text-[11px] font-black uppercase mb-4 tracking-widest">
                        {doc.docName.replace("_", " ")}
                      </p>

                      {doc.existingLink ? (
                        <div className="w-full flex flex-col gap-2">
                          <a
                            href={doc.existingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 tracking-widest"
                          >
                            <ExternalLink size={14} /> View Link
                          </a>
                          <button
                            onClick={() =>
                              triggerReupload(
                                mandatoryDocs,
                                setMandatoryDocs,
                                doc.dbId,
                              )
                            }
                            className="w-full py-2 border border-slate-200 text-slate-400 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                          >
                            <RotateCcw size={12} /> Change File
                          </button>
                        </div>
                      ) : (
                        <div className="w-full space-y-3">
                          <input
                            type="file"
                            className="text-[10px] w-full block file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-[#1a5695]"
                            onChange={(e) =>
                              updateFileInList(
                                mandatoryDocs,
                                setMandatoryDocs,
                                doc.dbId,
                                e.target.files[0],
                              )
                            }
                          />
                          <button
                            onClick={() => handleSingleUpload(doc)}
                            disabled={btnLoading[doc.dbId] || !doc.file}
                            className="w-full py-3 bg-[#1a5695] text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
                          >
                            {btnLoading[doc.dbId] ? (
                              <Loader2 className="animate-spin" size={14} />
                            ) : (
                              <>
                                <CloudUpload size={14} /> Upload Now
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 2. OTHER DOCUMENTS */}
                <div className="bg-white rounded-[40px] border border-slate-200 p-6 lg:p-10 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Additional Documents
                    </h3>
                    <button
                      onClick={addOtherDocRow}
                      className="flex items-center gap-2 text-[10px] font-black text-[#1a5695] uppercase bg-blue-50 px-4 py-2 rounded-xl"
                    >
                      <Plus size={14} /> Add Row
                    </button>
                  </div>
                  <div className="space-y-4">
                    {otherDocs.map((doc) => (
                      <div
                        key={doc.dbId}
                        className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50/50 rounded-[28px] border border-slate-100 items-center"
                      >
                        <input
                          type="text"
                          placeholder="Document Name"
                          className="w-full md:w-1/4 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold disabled:bg-transparent"
                          value={doc.docName}
                          disabled={doc.isFromDB}
                          onChange={(e) =>
                            setOtherDocs(
                              otherDocs.map((d) =>
                                d.dbId === doc.dbId
                                  ? { ...d, docName: e.target.value }
                                  : d,
                              ),
                            )
                          }
                        />

                        {doc.existingLink ? (
                          <div className="flex-1 flex items-center justify-between bg-emerald-50 px-5 py-3 rounded-2xl w-full gap-4">
                            <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-2 font-mono">
                              <CheckCircle2 size={14} /> Completed
                            </span>
                            <div className="flex gap-2">
                              <a
                                href={doc.existingLink}
                                target="_blank"
                                className="text-[9px] font-black bg-white text-emerald-600 px-4 py-2 rounded-lg shadow-sm flex items-center gap-1"
                              >
                                <ExternalLink size={12} /> View
                              </a>
                              <button
                                onClick={() =>
                                  triggerReupload(
                                    otherDocs,
                                    setOtherDocs,
                                    doc.dbId,
                                  )
                                }
                                className="text-[9px] font-black bg-white text-slate-400 px-4 py-2 rounded-lg shadow-sm flex items-center gap-1 hover:text-[#1a5695]"
                              >
                                <RotateCcw size={12} /> Change
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col md:flex-row gap-3 w-full">
                            <input
                              type="file"
                              className="flex-1 text-[10px] file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-white"
                              onChange={(e) =>
                                updateFileInList(
                                  otherDocs,
                                  setOtherDocs,
                                  doc.dbId,
                                  e.target.files[0],
                                )
                              }
                            />
                            <button
                              onClick={() => handleSingleUpload(doc)}
                              disabled={
                                btnLoading[doc.dbId] ||
                                !doc.file ||
                                !doc.docName
                              }
                              className="md:w-32 py-3 bg-[#1a5695] text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 min-h-[44px]"
                            >
                              {btnLoading[doc.dbId] ? (
                                <Loader2 className="animate-spin" size={14} />
                              ) : (
                                "Upload"
                              )}
                            </button>
                          </div>
                        )}
                        {!doc.isFromDB && (
                          <button
                            onClick={() => removeOtherDocRow(doc.dbId)}
                            className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* 3. NEXT STAGE ACTION BAR */}
        {isEverythingUploaded() && (
          <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/80 backdrop-blur-md border-t border-slate-200 p-6 flex justify-center animate-in slide-in-from-bottom duration-500">
            <button
              onClick={handleNextStage}
              className="max-w-md w-full bg-emerald-500 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
            >
              Move to Next Stage <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalizeWiring;
