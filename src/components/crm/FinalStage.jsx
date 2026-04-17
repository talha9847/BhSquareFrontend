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
  ChevronRight,
  Inbox,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify"; // Keeping for success messages only
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const FinalStage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [finalLogs, setFinalLogs] = useState([]);

  const [isFabModalOpen, setIsFabModalOpen] = useState(false);
  const [supervisors, setSupervisor] = useState([]);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [editFormData, setEditFormData] = useState({
    customer_id: null,
    supervisor_id: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updateStatusValue, setUpdateStatusValue] = useState("done");

  const handleStatusSubmit = async () => {
    try {
      setLoad(true);
      const res = await axios.put(
        `/api/sources/completeFinalStage`,
        {
          finalStageId: selectedItem.final_stage_id,
          customerId: selectedItem.customer_id,
          leadId: selectedItem.lead_id,
          status: updateStatusValue,
        },
        { withCredentials: true },
      );

      if (res.status === 200) {
        toast.success("Status updated");
        getFinalStageData();
      }
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setSelectedItem(null);
      setIsModalOpen(false);
      setLoad(false);
    }
  };

  const getSupervisors = async () => {
    try {
      const res = await axios.get(`/api/sources/fetchSupervisor`, {
        withCredentials: true,
      });
      if (res.status === 200) setSupervisor(res.data.data || []);
    } catch (error) {
      console.error("Fetch supervisor error:", error);
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
      console.error("Fetch final stage error:", error);
    } finally {
      setTableLoading(false);
    }
  };

  const handleFabClick = (item) => {
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
        getFinalStageData();
      }
    } catch (error) {
      console.error("Supervisor update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFinalStageData();
    getSupervisors();
  }, []);

  const handleToggle = async (id, field, currentStatus, label, item) => {
    if (!item.supervisor_id) {
      // Keep this toast as it's a validation warning for the user, not a system error
      toast.warn("Please assign Supervisor first");
      return;
    }
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
      preConfirm: async () => {
        try {
          const endpoints = {
            file_approved: "updateStage10",
            file_uploaded: "updateStage11",
            inspection: "updateStage12",
            redeem: "updateStage13",
            disbursal: "updateStage14",
          };

          const res = await axios.post(
            `/api/sources/${endpoints[field]}`,
            { customerId: item.customer_id, flag: !currentStatus },
            { withCredentials: true },
          );
          return res;
        } catch (error) {
          console.error(`Toggle ${field} failed:`, error);
          Swal.showValidationMessage("Request failed. Please try again.");
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
      getFinalStageData();
      if (isReverting) {
        toast.info(`${label} reset.`);
      } else {
        toast.success(`${label} updated.`);
      }
    }
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
        className={`w-1.5 h-1.5 rounded-full transition-all ${active ? "bg-emerald-500 scale-110" : "bg-slate-200"}`}
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
            <h1 className="text-2xl font-black text-slate-800 tracking-tight font-syne uppercase flex items-center gap-3">
              <ShieldCheck className="text-[#1a5695]" size={28} />
              Final Stage
              <button
                onClick={() => navigate("/allfinalstage")}
                className="flex items-center gap-1 bg-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded-full hover:bg-slate-300 transition-all cursor-pointer"
              >
                SHOW ALL <ChevronRight size={12} />
              </button>
            </h1>
            <button
              onClick={() => navigate("/supervisors")}
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
              <Eye size={16} /> Supervisors
            </button>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 shadow-sm">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold placeholder:text-slate-300"
                placeholder="Search customer..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm relative min-h-[450px]">
            {tableLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
                <Loader2
                  className="animate-spin text-[#1a5695] mb-2"
                  size={32}
                />
                <span className="text-[10px] font-black uppercase text-slate-400">
                  Syncing...
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
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-center">
                        Status
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <tr
                          key={item.final_stage_id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-center font-black text-slate-300 text-[11px]">
                            #{item.final_stage_id}
                          </td>
                          <td className="px-6 py-4">
                            <div
                              onClick={() =>
                                navigate("/master", {
                                  state: {
                                    customerId: item.customer_id,
                                    leadId: item.lead_id,
                                  },
                                })
                              }
                              className="font-bold text-slate-800 text-sm uppercase leading-tight cursor-pointer hover:text-[#1a5695] transition-colors"
                            >
                              {item.customer_name}
                            </div>

                            <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-1">
                              <span className="text-[#1a5695]">
                                {item.contact_number}
                              </span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span className="uppercase truncate max-w-[150px]">
                                {item.address}
                              </span>

                              {/* Colorful Type Badge */}
                              <span
                                className={`
                                text-[9px] px-1 rounded font-bold uppercase border ml-0.5
                                ${
                                  item.installation_type === "Residential"
                                    ? "bg-blue-50 text-blue-600 border-blue-100"
                                    : item.installation_type === "Commercial"
                                      ? "bg-purple-50 text-purple-600 border-purple-100"
                                      : item.installation_type === "Industrial"
                                        ? "bg-amber-50 text-amber-700 border-amber-100"
                                        : "bg-slate-50 text-slate-400 border-slate-100"
                                }
                                    `}
                              >
                                {item.installation_type?.substring(0, 3)}
                              </span>
                            </div>
                          </td>

                          <td
                            onClick={() =>
                              !item.file_approved && handleFabClick(item)
                            }
                            className={`px-6 py-4 group ${item.file_approved ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                          >
                            <div
                              className={`flex items-center gap-2 font-black text-[11px] uppercase ${item.file_approved ? "text-gray-400" : "text-[#1a5695] group-hover:underline"}`}
                            >
                              {item.supervisor_name || "ASSIGN SUPERVISOR"}
                              {!item.file_approved && (
                                <UserPlus
                                  size={12}
                                  className="text-slate-300 group-hover:text-[#1a5695]"
                                />
                              )}
                            </div>
                            <div className="text-[9px] text-slate-400 font-bold uppercase">
                              {item.file_approved
                                ? "Locked"
                                : "Click to assign"}
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
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.status === "done" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {item.disbursal && (
                              <button
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsModalOpen(true);
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a5695] text-white text-[10px] font-black uppercase rounded-xl hover:bg-[#15467a] transition-all"
                              >
                                Update Status
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-24 text-center">
                          <div className="flex flex-col items-center opacity-30">
                            <Inbox size={48} className="text-slate-400 mb-2" />
                            <span className="text-[11px] font-black uppercase tracking-widest">
                              No Records Found
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals remain same but with console.error instead of toast.error */}
      {isFabModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden">
            <div className="bg-[#1a5695] p-8 text-white flex justify-between items-center">
              <h2 className="text-xl font-black uppercase">
                Assign Supervisor
              </h2>
              <button
                onClick={() => setIsFabModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateSupervisor} className="p-8 space-y-6">
              <select
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold"
                value={editFormData.supervisor_id}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    supervisor_id: e.target.value,
                  })
                }
              >
                <option value="">Select a Supervisor</option>
                {supervisors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                disabled={loading}
                type="submit"
                className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase"
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" size={18} />
                ) : (
                  "Update Assignment"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-slate-800 font-black uppercase mb-4">
              Update Status
            </h3>
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              value={updateStatusValue}
              onChange={(e) => setUpdateStatusValue(e.target.value)}
            >
              <option value="done">DONE</option>
              <option value="pending">PENDING</option>
            </select>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 text-slate-400 font-bold text-[11px] uppercase"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusSubmit()}
                className="flex-1 px-4 py-3 bg-[#1a5695] text-white font-black text-[11px] uppercase rounded-xl"
              >
                {load ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalStage;
