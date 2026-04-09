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
  Hash,
  X,
  Save,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/authContext";

const FinalizeWiring = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedWiring } = state || {};

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState({});
  const [mandatoryDocs, setMandatoryDocs] = useState([]);
  const [otherDocs, setOtherDocs] = useState([]);

  // --- Serial Modal States ---
  const [isSerialModalOpen, setIsSerialModalOpen] = useState(false);
  const [serialLoading, setSerialLoading] = useState(false);
  const [serials, setSerials] = useState({
    panelSerials: [],
    inverterSerials: [],
  });
  const [updatingSerialId, setUpdatingSerialId] = useState(null);

  const isEverythingUploaded = () => {
    if (initialLoading || otherDocs.length === 0) return false;
    return otherDocs.every(
      (doc) => doc.existingLink && doc.existingLink !== "",
    );
  };

  const fetchData = async () => {
    if (!selectedWiring?.wiring_id) return;
    try {
      setInitialLoading(true);
      const res = await axios.get(
        `/api/wiring/getWiringDocs/${selectedWiring.wiring_id}`,
        {
          withCredentials: true,
        },
      );

      if (res.status === 200 && res.data.data) {
        const allDocsFromDB = res.data.data.map((doc) => ({
          dbId: doc.id,
          docName: doc.doc_name,
          file: null,
          existingLink: doc.doc_link,
          isFromDB: true,
        }));
        setOtherDocs(allDocsFromDB);
      }
    } catch (error) {
      toast.error("Failed to load documents");
    } finally {
      setInitialLoading(false);
    }
  };

  // --- Fetch Serials Function ---
  const fetchSerials = async () => {
    setSerialLoading(true);
    try {
      const res = await axios.get(
        `/api/kitready/fetchCustomerSerials/${selectedWiring.customer_id}`,
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        console.log(res.data.data);
        setSerials(res.data.data);
        setIsSerialModalOpen(true);
      }
    } catch (error) {
      toast.error("Failed to fetch serial numbers");
    } finally {
      setSerialLoading(false);
    }
  };

  // --- Update Single Serial Function ---
  const handleUpdateSerial = async (id, type, newValue) => {
    setUpdatingSerialId(id);
    console.log(id);
    try {
      await axios.put(
        `/api/kitready/updateSingleSerial`,
        {
          id,
          type, // 'panel' or 'inverter'
          serial_number: newValue,
        },
        { withCredentials: true },
      );
      toast.success("Serial updated successfully");
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setUpdatingSerialId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedWiring?.wiring_id]);

  const handleNextStage = () => {
    Swal.fire({
      title: "Move to Next Stage?",
      text: "Finalizing the wiring process...",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#f43f5e",
      confirmButtonText: "Yes, Proceed!",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const res = await axios.post(
            `/api/wiring/moveToFinalStage`,
            { customerId: selectedWiring.customer_id },
            { withCredentials: true },
          );
          if (res.status === 200) navigate("/finalstage");
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
      const res = await axios.post(`/api/wiring/uploadWiringDocs`, formData, {
        withCredentials: true,
      });
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
            {/* Header Section */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-5">
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

              {/* NEW ENTER SERIALS BUTTON */}
              <button
                onClick={fetchSerials}
                disabled={serialLoading}
                className="flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all"
              >
                {serialLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Hash size={16} />
                )}
                Enter Serials
              </button>
            </div>

            {initialLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-[#1a5695]" size={40} />
              </div>
            ) : (
              <div className="space-y-10">
                {/* Documents Content Logic stays same... */}
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

        {/* --- SERIAL NUMBERS MODAL --- */}
        {isSerialModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="bg-[#1a5695] p-8 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black font-syne uppercase tracking-tight">
                    Component Serials
                  </h2>
                  <p className="text-white/60 text-xs mt-1 font-bold">
                    Manage panel and inverter serial numbers
                  </p>
                </div>
                <button
                  onClick={() => setIsSerialModalOpen(false)}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
                {/* Panels Section */}
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-yellow-400 rounded-full"></div>{" "}
                    Solar Panels
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serials.panelSerials.map((panel, idx) => (
                      <div
                        key={panel.id}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-3"
                      >
                        <label className="text-[9px] font-black text-[#1a5695] uppercase">
                          Panel {idx + 1}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            defaultValue={panel.serial_number}
                            id={`panel-${panel.id}`}
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold focus:border-[#1a5695] outline-none transition-all"
                          />
                          <button
                            onClick={() =>
                              handleUpdateSerial(
                                panel.id,
                                "panel",
                                document.getElementById(`panel-${panel.id}`)
                                  .value,
                              )
                            }
                            disabled={updatingSerialId === panel.id}
                            className="bg-white p-2 text-emerald-500 rounded-xl border border-slate-200 hover:bg-emerald-50 transition-all shadow-sm"
                          >
                            {updatingSerialId === panel.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Save size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inverters Section */}
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#1a5695] rounded-full"></div>{" "}
                    Inverters
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serials.inverterSerials.map((inv, idx) => (
                      <div
                        key={inv.id}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-3"
                      >
                        <label className="text-[9px] font-black text-[#1a5695] uppercase">
                          Inverter {idx + 1}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            defaultValue={inv.serial_number}
                            id={`inv-${inv.id}`}
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold focus:border-[#1a5695] outline-none transition-all"
                          />
                          <button
                            onClick={() =>
                              handleUpdateSerial(
                                inv.id,
                                "inverter",
                                document.getElementById(`inv-${inv.id}`).value,
                              )
                            }
                            disabled={updatingSerialId === inv.id}
                            className="bg-white p-2 text-emerald-500 rounded-xl border border-slate-200 hover:bg-emerald-50 transition-all shadow-sm"
                          >
                            {updatingSerialId === inv.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Save size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Stage Action Bar */}
        {isEverythingUploaded() &&
          selectedWiring.wiring_status !== "done" &&
          user.role === "admin" && (
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
