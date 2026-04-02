import React, { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  ShieldCheck,
  Upload,
  ClipboardCheck,
  Gift,
  Banknote,
  Save,
  CheckCircle,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";

const FinalStage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [finalLogs, setFinalLogs] = useState([]);

  const getFinalStageData = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/api/sources/getFinalStageCustomers`,
      );
      if (res.status === 200) {
        setFinalLogs(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load records");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    getFinalStageData();
  }, []);

  // --- ONE-WAY TOGGLE LOGIC ---
  const handleToggle = async (id, field, currentStatus, label) => {
    // 1. Block if already true (No Revert)
    if (currentStatus === true) {
      toast.warning(`${label} is already finalized and cannot be changed.`);
      return;
    }

    // 2. Show Confirmation for first-time completion
    const result = await Swal.fire({
      title: "Confirm Completion",
      text: `Mark "${label}" as Complete? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1a5695",
      cancelButtonColor: "#f1f5f9",
      confirmButtonText: `Yes, Finalize`,
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "rounded-[32px] font-sans",
        confirmButton:
          "rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-wider",
        cancelButton:
          "rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500",
      },
    });

    if (result.isConfirmed) {
      setFinalLogs((prev) =>
        prev.map((item) =>
          item.final_stage_id === id ? { ...item, [field]: true } : item,
        ),
      );
      toast.success(`${label} updated successfully.`);
    }
  };

  const handleUpdate = (item) => {
    // This handles the final submission of the row
    console.log("Updated Stage Data for Database:", item);
    toast.success(`Records updated for ${item.customer_name}`);
  };

  const filteredItems = finalLogs.filter((item) =>
    item.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // --- INTERACTIVE BADGE COMPONENT ---
  const InteractiveBadge = ({ id, label, field, active, icon: Icon }) => (
    <button
      onClick={() => handleToggle(id, field, active, label)}
      className={`flex flex-col items-center gap-1.5 p-3 w-24 rounded-3xl border transition-all duration-200 ${
        active
          ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-inner cursor-not-allowed"
          : "bg-slate-50 border-slate-100 text-slate-300 hover:border-slate-200 hover:text-slate-400 active:scale-90"
      }`}
    >
      <Icon size={16} strokeWidth={active ? 3 : 2} />
      <span className="text-[8px] font-black uppercase tracking-tighter text-center leading-none">
        {label}
      </span>
      <div
        className={`w-1.5 h-1.5 rounded-full transition-all ${
          active ? "bg-emerald-500 scale-110" : "bg-slate-200"
        }`}
      ></div>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="FinalStage"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
              <ShieldCheck className="text-[#1a5695]" size={28} />
              Final Stage Management
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
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold placeholder:text-slate-300"
                placeholder="Search customer name..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm relative min-h-[450px]">
            {tableLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
                <Loader2
                  className="animate-spin text-[#1a5695] mb-2"
                  size={32}
                />
                <span className="text-[10px] font-black uppercase text-slate-400">
                  Syncing Stages...
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-center w-20">
                        ID
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">
                        Customer Information
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-center">
                        Workflow Checklist
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredItems.map((item) => (
                      <tr
                        key={item.final_stage_id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-center font-black text-slate-300 text-[11px]">
                          #{item.final_stage_id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 text-sm uppercase leading-tight">
                            {item.customer_name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-1">
                            <span className="text-[#1a5695]">
                              {item.contact_number}
                            </span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="uppercase">{item.address}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <InteractiveBadge
                              id={item.final_stage_id}
                              label="File Up"
                              field="file_uploaded"
                              active={item.file_uploaded}
                              icon={Upload}
                            />
                            <InteractiveBadge
                              id={item.final_stage_id}
                              label="Approved"
                              field="file_approved"
                              active={item.file_approved}
                              icon={CheckCircle}
                            />
                            <InteractiveBadge
                              id={item.final_stage_id}
                              label="Inspection"
                              field="inspection"
                              active={item.inspection}
                              icon={ClipboardCheck}
                            />
                            <InteractiveBadge
                              id={item.final_stage_id}
                              label="Redeem"
                              field="redeem"
                              active={item.redeem}
                              icon={Gift}
                            />
                            <InteractiveBadge
                              id={item.final_stage_id}
                              label="Disbursal"
                              field="disbursal"
                              active={item.disbursal}
                              icon={Banknote}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleUpdate(item)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white text-[10px] font-black uppercase rounded-2xl hover:bg-[#15467a] shadow-lg shadow-blue-100 active:scale-95 transition-all"
                          >
                            <Save size={14} /> Update Record
                          </button>
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
    </div>
  );
};

export default FinalStage;
