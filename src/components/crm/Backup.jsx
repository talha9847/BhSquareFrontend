import React, { useEffect, useState } from "react";
import {
  Database,
  Download,
  Loader2,
  History,
  ShieldCheck,
  Clock,
  CloudUpload,
  AlertCircle,
  ExternalLink,
  FileText,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import axios from "axios";

const Backup = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupData, setBackupData] = useState(null);

  // --- Date Formatter Helper ---
  const formatIST = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getBackup = async () => {
    try {
      const res = await axios.get("/api/docs/getBackup", {
        withCredentials: true,
      });
      if (res.status === 200) {
        setBackupData(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch backup history", error);
    }
  };

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    try {
      const res = await axios.post(
        `/api/docs/backup`,
        {},
        { withCredentials: true },
      );
      if (res.status === 200 || res.status === 201) {
        getBackup();
        toast.success("Database backup created successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Backup failed.");
    } finally {
      setIsBackingUp(false);
    }
  };

  useEffect(() => {
    getBackup();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Backup"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8 max-w-5xl mx-auto w-full">
          <div className="flex flex-col mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
              <Database className="text-[#1a5695]" size={28} /> System Backup
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase mt-1 ml-10">
              Instance: BhSquare Live Production
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm flex flex-col items-center text-center justify-center min-h-[350px]">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-[#1a5695]">
                {isBackingUp ? (
                  <Loader2 size={40} className="animate-spin" />
                ) : (
                  <CloudUpload size={40} />
                )}
              </div>
              <h2 className="text-xl font-black text-slate-800 uppercase mb-2">
                Generate New Backup
              </h2>
              <p className="text-slate-400 text-sm max-w-xs mb-8 font-medium">
                Saves all tables to SQL format and uploads to Google Drive.
              </p>
              <button
                disabled={isBackingUp}
                onClick={handleCreateBackup}
                className="group flex items-center gap-3 px-10 py-4 bg-[#1a5695] text-white text-[11px] font-black uppercase rounded-2xl hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {isBackingUp ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Download size={18} />
                )}
                {isBackingUp ? "Backing Up..." : "Start Backup Now"}
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" />{" "}
                  Security
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">
                      Access
                    </span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                      Admin
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">
                      Auto-Cloud
                    </span>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                      Enabled
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a5695] rounded-[32px] p-6 text-white shadow-lg shadow-blue-100 relative overflow-hidden">
                <AlertCircle
                  className="absolute -right-4 -bottom-4 text-white/10"
                  size={100}
                />
                <h3 className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">
                  Storage Info
                </h3>
                <p className="text-xs font-bold leading-relaxed">
                  Backup files are stored for 30 days on Google Drive.
                </p>
              </div>
            </div>
          </div>

          {/* Backup Log Table */}
          <div className="mt-8 bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <History size={16} /> Latest Backup Status
              </h3>
            </div>

            <div className="overflow-x-auto">
              {backupData ? (
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      <th className="px-8 py-4 border-b border-slate-100">
                        Backup Name
                      </th>
                      <th className="px-8 py-4 border-b border-slate-100">
                        Created At (IST)
                      </th>
                      <th className="px-8 py-4 border-b border-slate-100 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-[#1a5695] rounded-xl">
                            <FileText size={18} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">
                            SQL_DB_SNAPSHOT_{backupData.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 border-b border-slate-50">
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-[12px]">
                          <Clock size={14} className="text-slate-300" />
                          {formatIST(backupData.backup_datetime)}
                        </div>
                      </td>
                      <td className="px-8 py-5 border-b border-slate-50 text-right">
                        <a
                          href={backupData.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a5695] text-white text-[10px] font-black uppercase rounded-xl hover:shadow-lg transition-all active:scale-95"
                        >
                          <ExternalLink size={14} /> Download
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">
                  No backup logs available
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Backup;
