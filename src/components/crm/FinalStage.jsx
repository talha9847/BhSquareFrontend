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
  Eye,
  UserPlus,
  X,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const FinalStage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [finalLogs, setFinalLogs] = useState([]);

  const [isFabModalOpen, setIsFabModalOpen] = useState(false);
  const [supervisors, setSupervisor] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    customer_id: null,
    supervisor_id: "",
  });

  const getSupervisors = async () => {
    setTableLoading(true);

    try {
      const res = await axios.get(`/api/sources/fetchSupervisor`, {
        withCredentials: true,
      });
      if (res.status === 200) setSupervisor(res.data.data || []);
    } catch (error) {
      console.error("Error fetching Supervisor:", error);
    } finally {
      setTableLoading(false);
    }
  };

  const getFinalStageData = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(`/api/sources/getFinalStageCustomers`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setFinalLogs(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load records");
    } finally {
      setTableLoading(false);
    }
  };
  const handleFabClick = (item) => {
    setActiveItem(item);
    setEditFormData({
      customer_id: item.customer_id,
      supervisor_id: item.supervisor_id || "",
    });
    setIsFabModalOpen(true);
  };
  const handleUpdateSupervisor = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        customer_id: editFormData.customer_id,
        supervisor_id: editFormData.supervisor_id,
      };
      const res = await axios.put(
        `/api/sources/updateSupervisorViaId`,
        payload,
        { withCredentials: true },
      );
      if (res.status === 200) {
        toast.success("Supervisor Updated!");
        setIsFabModalOpen(false);
        getFinalStageData(); // Refresh table
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFinalStageData();
    getSupervisors();
  }, []);

  const handleToggle = async (id, field, currentStatus, label, item) => {
    const isReverting = currentStatus === true;

    const result = await Swal.fire({
      title: isReverting ? "Revert Completion?" : "Confirm Completion",
      text: isReverting
        ? `Do you want to mark "${label}" as Incomplete?`
        : `Mark "${label}" as Complete? This will move the process forward.`,
      icon: isReverting ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: isReverting ? "#64748b" : "#1a5695",
      cancelButtonColor: "#f1f5f9",
      confirmButtonText: isReverting ? `Yes, Revert` : `Yes, Finalize`,
      cancelButtonText: "Cancel",
      reverseButtons: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          console.log(item);
          if (field === "file_approved") {
            const res = await axios.post(
              `/api/sources/updateStage10`,
              {
                customerId: item.customer_id,
                flag: !currentStatus,
              },
              { withCredentials: true },
            );
            return res;
          }

          if (field === "file_uploaded") {
            const res = await axios.post(
              `/api/sources/updateStage11`,
              {
                customerId: item.customer_id,
                flag: !currentStatus,
              },
              { withCredentials: true },
            );
            return res;
          }

          if (field === "inspection") {
            const res = await axios.post(
              `/api/sources/updateStage12`,
              {
                customerId: item.customer_id,
                flag: !currentStatus,
              },
              { withCredentials: true },
            );
            return res;
          }

          if (field === "redeem") {
            const res = await axios.post(
              `/api/sources/updateStage13`,
              {
                customerId: item.customer_id,
                flag: !currentStatus,
              },
              { withCredentials: true },
            );
            return res;
          }

          if (field === "disbursal") {
            const res = await axios.post(
              `/api/sources/updateStage14`,
              {
                customerId: item.customer_id,
                flag: !currentStatus,
              },
              { withCredentials: true },
            );
            return res;
          }

          return true;
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error.message}`);
        }
      },
      customClass: {
        popup: "rounded-[32px] font-sans",
        confirmButton:
          "rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-wider",
        cancelButton:
          "rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500",
      },
    });

    if (result.isConfirmed) {
      if (
        field === "file_approved" ||
        field === "file_uploaded" ||
        field == "inspection" ||
        field == "redeem"
      ) {
        getFinalStageData();
      } else {
        setFinalLogs((prev) =>
          prev.map((log) =>
            log.final_stage_id === id
              ? { ...log, [field]: !currentStatus }
              : log,
          ),
        );
      }

      if (isReverting) {
        toast.info(`${label} has been reset.`);
      } else {
        toast.success(`${label} updated successfully.`);
      }
    }
  };

  const handleUpdate = (item) => {
    console.log("Updated Stage Data for Database:", item);
    toast.success(`Records updated for ${item.customer_name}`);
  };

  const filteredItems = finalLogs.filter((item) =>
    item.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const InteractiveBadge = ({ id, label, field, active, icon: Icon, item }) => (
    <button
      onClick={() => handleToggle(id, field, active, label, item)}
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

            <button
              onClick={() => navigate("/supervisors")}
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
              <Eye size={16} /> View Supervisors
            </button>
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
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">
                        Supervisor
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-center">
                        Workflow Checklist
                      </th>
                      {/* <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-right">
                        Actions
                      </th> */}
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
                          <div
                            onClick={() => {
                              console.log(item);
                              navigate("/master", {
                                state: {
                                  customerId: item.customer_id,
                                  leadId: item.lead_id,
                                },
                              });
                            }}
                            className="font-bold text-slate-800 text-sm uppercase leading-tight cursor-pointer"
                          >
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
                        <td
                          onClick={() => handleFabClick(item)}
                          className="px-6 py-4 cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 font-black text-[11px] text-[#1a5695] uppercase group-hover:underline">
                            {item.supervisor_name || "ASSIGN SUPERVISOR"}
                            <UserPlus
                              size={12}
                              className="text-slate-300 group-hover:text-[#1a5695]"
                            />
                          </div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">
                            Click to assign
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <InteractiveBadge
                              id={item.final_stage_id}
                              label="Approved"
                              field="file_approved"
                              active={item.file_approved}
                              icon={CheckCircle}
                              item={item}
                            />

                            <InteractiveBadge
                              id={item.final_stage_id}
                              label="File Up"
                              field="file_uploaded"
                              active={item.file_uploaded}
                              icon={Upload}
                              item={item}
                            />

                            <InteractiveBadge
                              id={item.final_stage_id}
                              label="Inspection"
                              field="inspection"
                              active={item.inspection}
                              icon={ClipboardCheck}
                              item={item}
                            />
                            <InteractiveBadge
                              id={item.final_stage_id}
                              label="Redeem"
                              field="redeem"
                              active={item.redeem}
                              icon={Gift}
                              item={item}
                            />
                            <InteractiveBadge
                              id={item.final_stage_id}
                              label="Disbursal"
                              field="disbursal"
                              active={item.disbursal}
                              icon={Banknote}
                              item={item}
                            />
                          </div>
                        </td>
                        {/* <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleUpdate(item)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white text-[10px] font-black uppercase rounded-2xl hover:bg-[#15467a] shadow-lg shadow-blue-100 active:scale-95 transition-all"
                          >
                            <Save size={14} /> Update Record
                          </button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL: SAME TO SAME AS FABRICATION.JSX */}
      {isFabModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden">
            <div className="bg-[#1a5695] p-8 text-white flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">
                Assign Supervisor
              </h2>
              <button
                onClick={() => setIsFabModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateSupervisor} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Select Supervisor
                </label>
                <select
                  required
                  className="w-full mt-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-[#1a5695]"
                  value={editFormData.supervisor_id}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      supervisor_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select a Supervisor</option>
                  {supervisors.map((fab) => (
                    <option key={fab.id} value={fab.id}>
                      {fab.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Save size={18} /> Update Assignment
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalStage;
