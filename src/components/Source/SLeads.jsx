import React, { useEffect, useState } from "react";
import {
  Users,
  Plus,
  MapPin,
  X,
  Calculator,
  Search,
  Edit,
  Loader2,
  Eye,
  CheckCircle2,
  Clock,
  Calendar,
} from "lucide-react";
import Navbar from "../crm/Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SLeads = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadSaveLead, setLoadSaveLead] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [pageLoading, setPageLoading] = useState(true);

  // Date Update States
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedLeadForDate, setSelectedLeadForDate] = useState(null);
  const [newVisitDate, setNewVisitDate] = useState("");

  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(0);

  // Capacity Estimator States
  const [plateWattage, setPlateWattage] = useState(550);
  const [quantity, setQuantity] = useState(0);
  const systemCapacity = (Number(plateWattage) * Number(quantity)) / 1000;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [leads, setLeads] = useState([]);

  const getLeadsByStatus = async (status = activeTab) => {
    setPageLoading(true);

    try {
      const result = await axios.get(`/api/leads/fetchLeadsBySource`, {
        params: {
          status,
        },
        withCredentials: true,
      });

      setLeads(result.data.data);
    } catch (error) {
      toast.error("Failed to fetch leads");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getLeadsByStatus(activeTab);
  }, [activeTab]);

  const getDateStyle = (dateString) => {
    if (!dateString) return "text-slate-400";
    const visitDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    visitDate.setHours(0, 0, 0, 0);
    const diffTime = visitDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-600 font-bold";
    if (diffDays <= 2) return "text-amber-600 font-bold";
    return "text-emerald-600 font-bold";
  };

  const handleQuickDateUpdate = async () => {
    if (!newVisitDate) return toast.error("Please select a date");
    setLoadSaveLead(true);
    try {
      const res = await axios.post(
        `/api/leads/updateLeadVisitDate`,
        { id: selectedLeadForDate.id, date: newVisitDate },
        { withCredentials: true },
      );
      if (res.status === 200) {
        toast.success("Visit date updated!");
        getLeadsByStatus();
        setIsDateModalOpen(false);
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoadSaveLead(false);
    }
  };

  const onSubmit = async (data) => {
    setLoadSaveLead(true);
    const payload = {
      ...data,
      panel_wattage: Number(data.panel_wattage),
      number_of_panels: Number(data.number_of_panels),
    };

    try {
      const url = edit ? `/api/leads/updateLead` : `/api/leads/addLeadBySource`;
      if (edit) payload.id = editId;
      else payload.status = "pending";

      const res = await axios.post(url, payload, { withCredentials: true });
      if (res.status === 200 || res.status === 201) {
        toast.success(edit ? "Lead updated" : "Lead saved");
        getLeadsByStatus();
        setIsModalOpen(false);
        reset();
      }
    } catch (error) {
    } finally {
      setLoadSaveLead(false);
    }
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contact_number.includes(searchQuery),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Leads"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                Leads Pipeline
              </h1>
              <p className="text-sm text-slate-500">
                Manage and convert solar prospects
              </p>
            </div>
            <button
              onClick={() => {
                setEdit(false);
                reset();
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-[#1a5695] text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-[#15467a] transition-all active:scale-95 text-sm"
            >
              <Plus size={20} /> Add New Lead
            </button>
          </div>

          {/* Lead Status Tabs */}
          <div className="flex gap-2 mb-6 bg-slate-200/50 p-1.5 rounded-[22px] w-fit">
            {[
              {
                id: "pending",
                label: "Active",
                color: "bg-emerald-500",
              },
              {
                id: "delayed",
                label: "Delayed",
                color: "bg-amber-500",
              },
              {
                id: "cancelled",
                label: "Cancelled",
                color: "bg-rose-500",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-[18px] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {activeTab === tab.id && (
                  <span className={`w-2 h-2 rounded-full ${tab.color}`} />
                )}

                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name or number..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#1a5695] outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            {pageLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Fetching Records
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Location
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Visit Schedule
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Capacity
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredLeads.map((lead) => {
                      const isConverted =
                        lead.status?.toLowerCase() === "converted";
                      return (
                        <tr
                          key={lead.id}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800 text-sm">
                              {lead.customer_name}
                            </p>
                            <p className="text-slate-400 text-[11px] font-medium">
                              {lead.contact_number}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                              <MapPin size={12} className="text-slate-300" />
                              <span className="truncate max-w-[150px]">
                                {lead.address}
                              </span>
                            </div>
                          </td>
                          <td
                            className="px-6 py-4 cursor-pointer hover:bg-blue-50/50 transition-all"
                            onClick={() => {
                              setSelectedLeadForDate(lead);
                              setNewVisitDate(lead.site_visit_date);
                              setIsDateModalOpen(true);
                            }}
                          >
                            <div className="flex flex-col">
                              <span
                                className={`text-xs uppercase tracking-tight flex items-center gap-2 ${getDateStyle(lead.site_visit_date)}`}
                              >
                                {lead.site_visit_date || "Set Date"}
                                <Edit
                                  size={12}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                              </span>
                              <span className="text-[9px] text-slate-400 font-semibold mt-0.5">
                                Click to reschedule
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-black text-slate-700">
                              {(lead.total_capacity / 1000).toFixed(2)}{" "}
                              <span className="text-[10px] text-slate-400 font-normal">
                                kW
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {isConverted ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                                <CheckCircle2 size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                  Converted
                                </span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 shadow-sm">
                                <Clock size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                  Pending
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Reschedule Modal */}
      {isDateModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-[#1a5695] p-5 text-white flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-widest">
                Reschedule Visit
              </h2>
              <button onClick={() => setIsDateModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  New Date
                </label>
                <input
                  type="date"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695]"
                  value={newVisitDate}
                  onChange={(e) => setNewVisitDate(e.target.value)}
                />
              </div>
              <button
                onClick={handleQuickDateUpdate}
                disabled={loadSaveLead}
                className="w-full py-4 bg-[#f39200] text-white rounded-2xl font-bold shadow-lg hover:bg-[#e08600] transition-all flex items-center justify-center gap-2"
              >
                {loadSaveLead ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Update Schedule"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200">
            <div className="bg-[#1a5695] p-5 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users size={20} />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-tight">
                  {edit ? "Edit Lead" : "Create New Lead"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-white/10 p-2 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <form
              className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Customer Name
                </label>
                <input
                  {...register("customer_name", {
                    required: true,
                    setValueAs: (v) => v.toUpperCase(),
                  })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Contact Number
                </label>
                <input
                  {...register("contact_number", { required: true })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Visit Date
                </label>
                <input
                  {...register("site_visit_date")}
                  type="date"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695]"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Address
                </label>
                <textarea
                  {...register("address", {
                    required: true,
                    setValueAs: (v) => v.toUpperCase(),
                  })}
                  rows="2"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none resize-none focus:border-[#1a5695]"
                ></textarea>
              </div>

              {/* Estimator */}
              <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-3xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3 text-[#1a5695] font-bold text-[10px] uppercase tracking-widest">
                  <Calculator size={14} /> Panel Capacity Estimator
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    {...register("panel_wattage")}
                    type="number"
                    value={plateWattage}
                    onChange={(e) => setPlateWattage(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-white shadow-sm outline-none"
                    placeholder="Wattage"
                  />
                  <input
                    {...register("number_of_panels")}
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-white shadow-sm outline-none"
                    placeholder="Plates"
                  />
                </div>
                <div className="mt-3 pt-3 border-t border-blue-100 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    System Size
                  </span>
                  <span className="text-xl font-black text-[#1a5695]">
                    {systemCapacity.toFixed(2)} kW
                  </span>
                </div>
              </div>

              <div className="pt-4 flex gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-slate-400 bg-white border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadSaveLead}
                  className="flex-[2] px-6 py-3.5 rounded-2xl font-bold text-white bg-[#f39200] flex items-center justify-center gap-2"
                >
                  {loadSaveLead ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Save Lead"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SLeads;
