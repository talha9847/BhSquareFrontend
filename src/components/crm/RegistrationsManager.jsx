import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  User,
  FileText,
  FileDown,
  Calendar,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Clock,
  Zap,
  MapPin,
} from "lucide-react";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const apiUrl = import.meta.env.VITE_API_URL;

const RegistrationsManager = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dLoad, setDLoad] = useState(false);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  // --- FETCH REGISTRATIONS ---
  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${apiUrl}/api/registrations/fetchCustomersByStatus`,
          { params: { status: activeTab }, withCredentials: true },
        );
        // Based on your JSON: res.data.data
        if (res.status === 200) {
          setData(res.data.data || []);
        }
      } catch (err) {
        console.error("Backend Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, [activeTab]);

  // --- DOWNLOAD HANDLER ---
  const handleDownloadFile = async (e, item) => {
    e.stopPropagation();
    if (!item.registration_id || dLoad) return;

    try {
      setDLoad(true);
      const result = await axios.post(
        `${apiUrl}/api/registrations/getFileGeneration`,
        { registrationId: item.registration_id },
        {
          responseType: "blob",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          },
          withCredentials: true,
        },
      );

      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `agreement_${item.customer_name || "customer"}.docx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDLoad(false);
    }
  };

  // --- CLIENT SIDE FILTER ---
  const filteredList = data.filter(
    (item) =>
      item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.registration_id?.toString().includes(searchTerm),
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Registrations"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-5xl font-black tracking-tight uppercase text-slate-800">
                Agreement <span className="text-[#1a5695]">Vault</span>
              </h1>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                {activeTab} Registrations • {data.length} total
              </p>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex flex-col lg:flex-row gap-6 mb-10">
            <div className="flex bg-white p-1.5 rounded-[24px] border border-slate-200 shadow-sm w-fit">
              {["pending", "done"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-12 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    activeTab === tab
                      ? "bg-[#1a5695] text-white shadow-lg"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab === "pending" ? (
                    <Clock size={14} />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative flex-1">
              <Search
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
                size={20}
              />
              <input
                type="text"
                placeholder="SEARCH BY CUSTOMER NAME OR REG ID..."
                className="w-full pl-16 pr-6 py-4.5 bg-white border border-slate-200 rounded-[24px] outline-none text-[11px] font-bold uppercase tracking-widest focus:border-[#1a5695] transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* GRID VIEW */}
          {loading ? (
            <div className="py-40 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Fetching Deployment Records...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredList.map((item) => (
                <div
                  key={item.registration_id}
                  onClick={() =>
                    navigate(`/master`, {
                      state: {
                        customerId: item.customer_id,
                        leadId: item.lead_id,
                      },
                    })
                  }
                  className="bg-white rounded-[40px] border border-slate-200 p-8 hover:shadow-2xl hover:border-[#1a5695]/40 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-8">
                      <div className="p-4 bg-slate-50 rounded-2xl text-[#1a5695] group-hover:bg-[#1a5695] group-hover:text-white transition-all shadow-inner">
                        <FileText size={24} />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">
                          REG ID: {item.registration_id}
                        </span>
                        <div
                          className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter ${
                            item.registration_status === "done"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}
                        >
                          {item.registration_status}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-slate-800 uppercase mb-2 line-clamp-1 group-hover:text-[#1a5695] transition-colors">
                      {item.customer_name}
                    </h3>

                    {/* CAPACITY LOGO LIKE ALLCUSTOMERS */}
                    <div className="flex items-center gap-2 mb-8">
                      <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg">
                        <Zap
                          size={14}
                          className="text-[#1a5695]"
                          fill="#1a5695"
                        />
                        <span className="text-[10px] font-black text-[#1a5695] uppercase tracking-widest">
                          {item.total_capacity} KW
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-4 text-slate-400">
                        <Calendar size={16} />
                        <div className="flex flex-col">
                          <span className="text-[7px] font-black uppercase text-slate-300 tracking-widest">
                            Agreement Date
                          </span>
                          <span className="text-[11px] font-black text-slate-800 uppercase">
                            {item.agreement_date
                              ? new Date(item.agreement_date)
                                  .toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                  .toUpperCase()
                              : "NOT SET"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 text-slate-400">
                        <MapPin size={16} className="mt-1 shrink-0" />
                        <span className="text-[11px] font-bold text-slate-600 uppercase leading-tight line-clamp-1">
                          {item.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex gap-3">
                    {item.registration_status === "done" ? (
                      <button
                        disabled={dLoad}
                        onClick={(e) => handleDownloadFile(e, item)}
                        className="flex-1 py-4 bg-[#1a5695] text-white rounded-[22px] text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-[#1a5695]/40 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 active:scale-95"
                      >
                        {dLoad ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <FileDown size={14} />
                        )}
                        Download DOCX
                      </button>
                    ) : (
                      <button className="flex-1 py-4 border border-slate-200 text-slate-400 rounded-[22px] text-[10px] font-black uppercase tracking-widest hover:border-[#1a5695] hover:text-[#1a5695] transition-all flex items-center justify-center gap-2">
                        Review Files <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RegistrationsManager;
