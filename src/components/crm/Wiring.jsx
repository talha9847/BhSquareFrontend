import React, { useState, useEffect } from "react";
import {
  Search,
  Edit3,
  X,
  Loader2,
  Zap,
  Clock,
  CheckCircle2,
  Eye,
  Share,
  Upload,
  Camera,
  MapPin,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Wiring = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Data States
  const [wiringLogs, setWiringLogs] = useState([]);
  const [selectedWiring, setSelectedWiring] = useState(null);

  // Mandatory Form States
  const [mandatoryFiles, setMandatoryFiles] = useState({
    geoTag: null,
    sitePic: null,
    completionFile: null,
  });

  // Dynamic "Other" Documents State
  const [otherDocs, setOtherDocs] = useState([]);

  const getWiring = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/api/wiring/fetchWiringCustomerDetails`,
      );
      if (res.status === 200) setWiringLogs(res.data.data);
    } catch (error) {
      toast.error("Failed to load records");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    getWiring();
  }, []);

  // --- Dynamic Rows Logic ---
  const addOtherDocRow = () => {
    setOtherDocs([...otherDocs, { id: Date.now(), docName: "", file: null }]);
  };

  const removeOtherDocRow = (id) => {
    setOtherDocs(otherDocs.filter((doc) => doc.id !== id));
  };

  const updateOtherDoc = (id, field, value) => {
    setOtherDocs(
      otherDocs.map((doc) =>
        doc.id === id ? { ...doc, [field]: value } : doc,
      ),
    );
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    // if (
    //   !mandatoryFiles.geoTag ||
    //   !mandatoryFiles.sitePic ||
    //   !mandatoryFiles.completionFile
    // ) {
    //   return toast.warning("Please upload all mandatory site proofs");
    // }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append("wiringId", selectedWiring.wiring_id);
    formData.append("customerId", selectedWiring.customer_id);
    formData.append("geo_tag", mandatoryFiles.geoTag);
    formData.append("site_pic", mandatoryFiles.sitePic);
    formData.append("completion_file", mandatoryFiles.completionFile);

    // Append dynamic "Other" documents
    otherDocs.forEach((doc, index) => {
      console.log(doc);
      if (doc.file && doc.docName) {
        formData.append(`${doc.docName}`, doc.file);
      }
    });

    try {
      const res = await axios.post(
        `${apiUrl}/api/wiring/uploadWiringDocs`,
        formData,
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("Documentation submitted successfully!");
        setIsModalOpen(false);
        setMandatoryFiles({
          geoTag: null,
          sitePic: null,
          completionFile: null,
        });
        setOtherDocs([]);
        getWiring();
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploadLoading(false);
    }
  };

  const filteredItems = wiringLogs.filter((item) =>
    item.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Wiring"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
              <Zap className="text-[#1a5695]" fill="currentColor" size={28} />
              Wiring Inventory
            </h1>
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 shadow-sm">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                placeholder="Search customer..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm relative min-h-[400px]">
            {tableLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
                <Loader2
                  className="animate-spin text-[#1a5695] mb-2"
                  size={32}
                />
                <span className="text-[10px] font-black uppercase text-slate-400">
                  Loading Data...
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        ID
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Customer
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Status
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredItems.map((item) => (
                      <tr
                        key={item.wiring_id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4 text-center font-black text-slate-300 text-[11px]">
                          #{item.wiring_id}
                        </td>
                        <td className="px-6 py-4">
                          <div
                            onClick={() => {
                              navigate("/master", {
                                state: {
                                  customerId: item.customer_id,
                                  leadId: item.lead_id,
                                },
                              });
                            }}
                            className="font-bold text-slate-800 text-sm uppercase cursor-pointer"
                          >
                            {item.customer_name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold">
                            {item.contact_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-wider ${
                              item.wiring_status === "pending"
                                ? "bg-amber-50 text-amber-600 border border-amber-100"
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            }`}
                          >
                            {item.wiring_status === "pending" ? (
                              <Clock size={12} />
                            ) : (
                              <CheckCircle2 size={12} />
                            )}
                            {item.wiring_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {item.wiring_inv_status === "pending" ? (
                            <button
                              onClick={() =>
                                navigate("/updatewiring", {
                                  state: {
                                    wiring_id: item.wiring_id,
                                    customer_id: item.customer_id,
                                  },
                                })
                              }
                              className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#1a5695] rounded-xl border border-slate-100 transition-all"
                            >
                              <Edit3 size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                // REPLACE MODAL LOGIC WITH NAVIGATION
                                navigate("/finalizewiring", {
                                  state: { selectedWiring: item },
                                });
                              }}
                              className="p-2.5 bg-[#1a5695] text-white hover:bg-[#15467a] rounded-xl shadow-lg shadow-blue-100 transition-all"
                            >
                              <Share size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* DYNAMIC DOCUMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !uploadLoading && setIsModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                    Site Finalization
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Verify proofs for {selectedWiring?.customer_name}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-6">
                {/* MANDATORY SECTION */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      key: "geoTag",
                      label: "Geo Tag",
                      icon: <MapPin size={16} />,
                    },
                    {
                      key: "sitePic",
                      label: "Site Pic",
                      icon: <Camera size={16} />,
                    },
                    {
                      key: "completionFile",
                      label: "Bill/Doc",
                      icon: <FileText size={16} />,
                    },
                  ].map((field) => (
                    <div
                      key={field.key}
                      className="relative group border-2 border-dashed border-slate-100 rounded-3xl p-4 text-center hover:border-[#1a5695] hover:bg-blue-50/30 transition-all cursor-pointer"
                    >
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) =>
                          setMandatoryFiles({
                            ...mandatoryFiles,
                            [field.key]: e.target.files[0],
                          })
                        }
                      />
                      <div
                        className={`mx-auto w-10 h-10 rounded-2xl flex items-center justify-center mb-2 ${mandatoryFiles[field.key] ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-[#1a5695]"}`}
                      >
                        {mandatoryFiles[field.key] ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          field.icon
                        )}
                      </div>
                      <p className="text-[9px] font-black uppercase text-slate-800 tracking-widest">
                        {field.label}
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 truncate mt-1">
                        {mandatoryFiles[field.key]
                          ? mandatoryFiles[field.key].name
                          : "Upload"}
                      </p>
                    </div>
                  ))}
                </div>

                {/* DYNAMIC OTHER DOCUMENTS SECTION */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Other Documents ({otherDocs.length})
                    </h3>
                    <button
                      type="button"
                      onClick={addOtherDocRow}
                      className="flex items-center gap-1 text-[10px] font-black text-[#1a5695] uppercase hover:underline"
                    >
                      <Plus size={14} /> Add New
                    </button>
                  </div>

                  {otherDocs.length === 0 ? (
                    <div className="py-8 border-2 border-dashed border-slate-50 rounded-3xl text-center">
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">
                        No extra documents added
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {otherDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-[24px] border border-slate-100 animate-in slide-in-from-top-2 duration-200"
                        >
                          <input
                            type="text"
                            placeholder="Enter Document Name (e.g. Identity Proof)"
                            className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-[#1a5695]"
                            value={doc.docName}
                            onChange={(e) =>
                              updateOtherDoc(doc.id, "docName", e.target.value)
                            }
                          />
                          <div className="relative h-10 flex-1">
                            <input
                              type="file"
                              className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                              onChange={(e) =>
                                updateOtherDoc(
                                  doc.id,
                                  "file",
                                  e.target.files[0],
                                )
                              }
                            />
                            <div className="h-full bg-white border border-slate-100 rounded-xl px-4 flex items-center justify-between text-slate-400">
                              <span className="text-[10px] font-black uppercase truncate pr-4">
                                {doc.file ? doc.file.name : "Choose File"}
                              </span>
                              <Upload size={14} />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeOtherDocRow(doc.id)}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="w-full py-5 bg-[#1a5695] text-white rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-[#15467a] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {uploadLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Upload size={18} /> Submit Verification
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wiring;
