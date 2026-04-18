import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Loader2,
  CheckCircle2,
  Calendar,
  MapPin,
  Trophy,
  Phone,
  Zap,
  Clock,
  ChevronRight,
  Download,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const Completed = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);

  // Default to current month for filtering
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
  });

  const downloadExcel = async () => {
    if (filteredItems.length === 0) {
      toast.error("No data available to download");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Completed Projects");

    // Define Columns (Headers)
    worksheet.columns = [
      { header: "SR NO.", key: "srNo", width: 10 },
      { header: "CUSTOMER NAME", key: "name", width: 30 },
      { header: "CONTACT", key: "mobile", width: 20 },
      { header: "ADDRESS", key: "address", width: 40 },
      { header: "TOTAL CAPACITY (kW)", key: "capacity", width: 20 },
      { header: "DURATION (DAYS)", key: "days", width: 15 },
      { header: "DATE", key: "date", width: 15 },
    ];

    // Add Rows
    filteredItems.forEach((item, index) => {
      worksheet.addRow({
        srNo: index + 1,
        name: item.customer_name?.toUpperCase() || "N/A",
        mobile: item.mobile || "N/A",
        address: item.address || "N/A",
        capacity: (item.total_capacity / 1000).toFixed(2),
        days: item.days,
        date: new Date(item.created_at).toLocaleDateString(),
      });
    });

    // Style the header row (Bold & Blue background)
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1A5695" }, // Matches your app's blue
    };

    // Generate and Download
    const buffer = await workbook.xlsx.writeBuffer();
    const data = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, `Completed_Projects_${new Date().getTime()}.xlsx`);
  };

  const getCompletedProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/sources/getCompletionSummary`, {
        params: { startDate, endDate },
        withCredentials: true,
      });
      if (res.status === 200) {
        setData(res.data.data || []);
      }
    } catch (error) {
      toast.error("Error fetching completed projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCompletedProjects();
  }, [startDate, endDate]);

  const filteredItems = useMemo(() => {
    return data.filter(
      (item) =>
        item.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mobile?.includes(searchQuery),
    );
  }, [data, searchQuery]);

  // Derived Stats
  const totalCapacity = useMemo(() => {
    return data.reduce(
      (acc, curr) => acc + Number(curr.total_capacity / 1000 || 0),
      0,
    );
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Completed"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
                <CheckCircle2 className="text-[#1a5695]" size={28} /> Completed
                Projects
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                Portfolio of successful installations
              </p>
            </div>

            {/* Date Filters */}
            <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 px-3">
                <Calendar size={14} className="text-slate-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-[10px] font-black uppercase text-slate-600 outline-none bg-transparent"
                />
              </div>
              <div className="h-4 w-[1px] bg-slate-200" />
              <div className="flex items-center gap-2 px-3">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-[10px] font-black uppercase text-slate-600 outline-none bg-transparent"
                />
              </div>
              <button
                onClick={getCompletedProjects}
                className="bg-[#1a5695] p-2 rounded-2xl text-white hover:bg-blue-700 transition-colors"
              >
                <Search size={16} />
              </button>
            </div>
          </header>

          {/* KPI Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
                Project Count
              </p>
              <h2 className="text-3xl font-black text-slate-800">
                {loading ? "..." : data.length}{" "}
                <span className="text-blue-500 text-sm">Sites</span>
              </h2>
            </div>
            <div className="bg-[#1a5695] p-6 rounded-[32px] shadow-lg shadow-blue-900/20">
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-2">
                Total Power Generation
              </p>
              <h2 className="text-3xl font-black text-white flex items-center gap-2">
                <Zap size={24} fill="currentColor" />
                {totalCapacity.toFixed(1)}{" "}
                <span className="text-lg opacity-80">kW</span>
              </h2>
            </div>
          </section>

          {/* Table Container */}
          <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <div className="relative w-full max-w-xs">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="SEARCH NAME OR MOBILE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full max-w-xs">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="SEARCH NAME OR MOBILE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 ring-blue-100 transition-all"
                />
              </div>

              {/* 3. The Download Button */}
              <button
                onClick={downloadExcel}
                disabled={loading || filteredItems.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
              >
                <Download size={16} />
                Export Excel
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">
                      Details
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-center">
                      Efficiency
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-right">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-20 text-center">
                        <Loader2
                          className="animate-spin mx-auto text-slate-300"
                          size={32}
                        />
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-20 text-center text-slate-400 font-bold uppercase text-xs"
                      >
                        No completed records found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-8 py-6">
                          <div>
                            <p className="font-black text-slate-800 text-sm uppercase">
                              {item.customer_name}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-slate-400">
                              <Phone size={10} />
                              <span className="text-[10px] font-bold">
                                {item.mobile}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2 text-slate-600 mb-1">
                            <MapPin size={12} className="text-[#1a5695]" />
                            <span className="text-[11px] font-bold uppercase">
                              {item.address}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar size={12} />
                            <span className="text-[10px] font-medium">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center justify-center gap-4">
                            <div className="text-center">
                              <p className="text-[8px] font-black text-slate-400 uppercase">
                                Capacity
                              </p>
                              <p className="text-xs font-black text-slate-700">
                                {item.total_capacity / 1000} kW
                              </p>
                            </div>
                            <div className="w-[1px] h-6 bg-slate-100" />
                            <div className="text-center">
                              <p className="text-[8px] font-black text-slate-400 uppercase">
                                Duration
                              </p>
                              <p className="text-xs font-black text-emerald-600">
                                {item.days} Days
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() =>
                              navigate("/master", {
                                state: {
                                  customerId: item.customerId,
                                  leadId: item.leadId,
                                },
                              })
                            }
                            className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 text-slate-400 hover:bg-[#1a5695] hover:text-white rounded-xl transition-all shadow-sm"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Completed;
