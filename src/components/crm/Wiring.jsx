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

  // Data & Form States
  const [wiringLogs, setWiringLogs] = useState([]);
  const [selectedWiring, setSelectedWiring] = useState(null);
  const [files, setFiles] = useState({
    geoTag: null,
    sitePic: null,
    document: null,
  });

  const getWiring = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/api/wiring/fetchWiringCustomerDetails`,
      );
      if (res.status === 200) setWiringLogs(res.data.data);
    } catch (error) {
      toast.error("Failed to load wiring records");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    getWiring();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.geoTag || !files.sitePic || !files.document) {
      return toast.warning("Please upload all three files");
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append("wiring_id", selectedWiring.wiring_id);
    formData.append("geo_tag", files.geoTag);
    formData.append("site_pic", files.sitePic);
    formData.append("file", files.document);

    try {
      // Replace with your actual upload API
      // const res = await axios.post(`${apiUrl}/api/wiring/uploadSiteData`, formData);
      toast.success("Site documentation uploaded successfully!");
      setIsModalOpen(false);
      setFiles({ geoTag: null, sitePic: null, document: null });
    } catch (error) {
      toast.error("Failed to upload files");
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
              <Zap className="text-[#1a5695]" fill="currentColor" size={28} />
              Wiring Inventory
            </h1>
          </div>

          {/* Search Box */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 shadow-sm">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                placeholder="Search by customer name..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm min-h-[400px] relative">
            {tableLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] z-10">
                <Loader2
                  className="animate-spin text-[#1a5695] mb-2"
                  size={32}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Loading Data...
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">
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
                          <div className="font-bold text-slate-800 text-sm uppercase">
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
                              className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#1a5695] hover:bg-blue-50 rounded-xl border border-slate-100 transition-all"
                            >
                              <Edit3 size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedWiring(item);
                                setIsModalOpen(true);
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

      {/* UPLOAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !uploadLoading && setIsModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                    Site Verification
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Upload required proofs for #{selectedWiring?.wiring_id}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                {/* File Input 1: Geo Tag */}
                <div className="group relative border-2 border-dashed border-slate-100 rounded-[24px] p-4 hover:border-[#1a5695] hover:bg-blue-50/30 transition-all">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setFiles({ ...files, geoTag: e.target.files[0] })
                    }
                  />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-[#1a5695]">
                      <MapPin size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase text-slate-800 tracking-widest">
                        Geo Tag Photo
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 truncate">
                        {files.geoTag
                          ? files.geoTag.name
                          : "Tap to select file"}
                      </p>
                    </div>
                    {files.geoTag && (
                      <CheckCircle2 className="text-emerald-500" size={18} />
                    )}
                  </div>
                </div>

                {/* File Input 2: Site Pic */}
                <div className="group relative border-2 border-dashed border-slate-100 rounded-[24px] p-4 hover:border-[#1a5695] hover:bg-blue-50/30 transition-all">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setFiles({ ...files, sitePic: e.target.files[0] })
                    }
                  />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-[#1a5695]">
                      <Camera size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase text-slate-800 tracking-widest">
                        Site Picture
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 truncate">
                        {files.sitePic
                          ? files.sitePic.name
                          : "Tap to select file"}
                      </p>
                    </div>
                    {files.sitePic && (
                      <CheckCircle2 className="text-emerald-500" size={18} />
                    )}
                  </div>
                </div>

                {/* File Input 3: Document */}
                <div className="group relative border-2 border-dashed border-slate-100 rounded-[24px] p-4 hover:border-[#1a5695] hover:bg-blue-50/30 transition-all">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setFiles({ ...files, document: e.target.files[0] })
                    }
                  />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-[#1a5695]">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase text-slate-800 tracking-widest">
                        Documentation (PDF/Image)
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 truncate">
                        {files.document
                          ? files.document.name
                          : "Tap to select file"}
                      </p>
                    </div>
                    {files.document && (
                      <CheckCircle2 className="text-emerald-500" size={18} />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="w-full mt-6 py-5 bg-[#1a5695] text-white rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-[#15467a] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {uploadLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Upload size={18} /> Submit Documentation
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
