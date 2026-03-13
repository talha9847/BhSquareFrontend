import React, { useState } from "react";
import {
  Users,
  Plus,
  MapPin,
  X,
  Calculator,
  Search,
  UserCheck,
  ArrowRightLeft,
  Clock,
  Ban,
  MessageSquare,
  Calendar,
  Edit,
  Trash2,
  ClipboardList,
  ChevronRight,
  Database,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Leads = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active"); // active, delayed, cancelled

  // Disposition State
  const [dispositionModal, setDispositionModal] = useState({
    open: false,
    lead: null,
    type: null,
  });
  const [remark, setRemark] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  // Lead Data with status
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "Ramanbhai Patel",
      number: "+91 87338 17262",
      address: "Vaskui, Mahuva",
      capacity: "8.32 kW",
      date: "01-01-2026",
      status: "active",
    },
    {
      id: 2,
      name: "Suresh Mehta",
      number: "+91 98221 00234",
      address: "Adajan, Surat",
      capacity: "5.50 kW",
      date: "01-01-2026",
      status: "delayed",
    },
    {
      id: 3,
      name: "Anita Desai",
      number: "+91 70445 99122",
      address: "Bardoli, GJ",
      capacity: "12.00 kW",
      date: "01-01-2026",
      status: "cancelled",
    },
  ]);

  // Capacity Estimator Logic
  const [plateWattage, setPlateWattage] = useState(550);
  const [quantity, setQuantity] = useState(10);
  const systemCapacity = (plateWattage * quantity) / 1000;

  const handleAction = (lead, type) => {
    setDispositionModal({ open: true, lead, type });
  };

  const submitDisposition = () => {
    setLeads(
      leads.map((l) =>
        l.id === dispositionModal.lead.id
          ? {
              ...l,
              status:
                dispositionModal.type === "convert"
                  ? "converted"
                  : dispositionModal.type,
            }
          : l,
      ),
    );
    setRemark("");
    setFollowUpDate("");
    setDispositionModal({ open: false, lead: null, type: null });
  };

  // Filter leads based on Tab + Search
  const filteredLeads = leads.filter((lead) => {
    const matchesTab = lead.status === activeTab;
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.number.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Left Side: Title & Info */}
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight font-syne uppercase flex items-center gap-3">
                Leads Pipeline
                <button className="flex items-center gap-1 bg-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded-full hover:bg-slate-300 transition-all">
                  SHOW ALL LEADS <ChevronRight size={12} />
                </button>
              </h1>
              <p className="text-sm text-slate-500">
                Manage and convert solar prospects
              </p>
            </div>

            {/* Right Side: Button Group (Side by Side) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSourceModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold shadow-lg hover:bg-slate-900 transition-all active:scale-95 text-sm"
              >
                <Database size={18} /> Add Source
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-[#1a5695] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-900/20 hover:bg-[#15467a] transition-all active:scale-95 text-sm"
              >
                <Plus size={20} /> Add New Lead
              </button>
            </div>
          </div>

          {/* TABS SYSTEM */}
          <div className="flex gap-2 mb-6 bg-slate-200/50 p-1.5 rounded-[22px] w-fit">
            {[
              { id: "active", label: "Active", color: "bg-emerald-500" },
              { id: "delayed", label: "Delayed", color: "bg-amber-500" },
              { id: "cancelled", label: "Cancelled", color: "bg-rose-500" },
            ].map((tab) => (
              <button
                key={tab.id}
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
                placeholder={`Search ${activeTab} leads...`}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#1a5695] outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Name & Mobile
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Address
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Source
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Capacity
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 text-sm">
                          {lead.name}
                        </p>
                        <p className="text-slate-400 text-[11px] font-medium">
                          {lead.number}
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
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-[#1a5695]">
                          {lead.capacity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* CONVERT IS NOW IN ALL TABS */}
                          <button
                            onClick={() => handleAction(lead, "convert")}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all"
                            title="Convert to Customer"
                          >
                            <ArrowRightLeft size={16} />
                          </button>

                          {activeTab === "active" && (
                            <>
                              <button
                                onClick={() => handleAction(lead, "delay")}
                                className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 hover:bg-amber-600 hover:text-white transition-all"
                              >
                                <Clock size={16} />
                              </button>
                              <button
                                onClick={() => handleAction(lead, "cancel")}
                                className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 hover:bg-rose-600 hover:text-white transition-all"
                              >
                                <Ban size={16} />
                              </button>
                            </>
                          )}
                          <button className="p-2 bg-blue-50 text-[#1a5695] rounded-xl border border-blue-100">
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredLeads.length === 0 && (
                <div className="p-12 text-center text-slate-400 text-sm italic">
                  No leads found in this category.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {isSourceModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
              <h2 className="text-lg font-bold font-syne">Add New Source</h2>
              <button
                onClick={() => setIsSourceModalOpen(false)}
                className="hover:bg-white/10 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">
                Source Name (e.g. Instagram, Newspaper)
              </label>
              <input
                autoFocus
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="Enter source name..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-slate-800"
              />
              <button
                onClick={() => setIsSourceModalOpen(false)}
                className="w-full mt-4 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all"
              >
                Save Source
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD LEAD MODAL (Updated with Visit & Notes) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          {/* Modal Container: Max height constrained to 90vh */}
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200">
            {/* Fixed Header */}
            <div className="bg-[#1a5695] p-5 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users size={20} />
                </div>
                <h2 className="text-xl font-bold font-syne uppercase tracking-tight">
                  Create New Lead
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              className="p-6 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Row 1: Identity */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">
                  Customer Name
                </label>
                <input
                  placeholder="e.g. Rajesh Bhai"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">
                  Contact Number
                </label>
                <input
                  placeholder="+91 00000 00000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695]"
                />
              </div>

              {/* Row 2: Logistics */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase flex items-center gap-1">
                  <Calendar size={10} /> Visit Schedule
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase flex items-center gap-1">
                  <Database size={10} /> Lead Source
                </label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695] appearance-none">
                  <option value="">Select Source</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="reference">Reference</option>
                </select>
              </div>

              {/* Row 3: Category */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">
                  Project Category
                </label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695]">
                  <option>Residential</option>
                  <option>Commercial</option>
                </select>
              </div>

              {/* Row 4: Address */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">
                  Full Address
                </label>
                <textarea
                  placeholder="Enter site address..."
                  rows="2"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none resize-none focus:border-[#1a5695]"
                ></textarea>
              </div>

              {/* Row 5: Internal Notes */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase flex items-center gap-1">
                  <ClipboardList size={10} /> Internal Notes
                </label>
                <textarea
                  placeholder="Specific requirements..."
                  rows="2"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none resize-none focus:border-[#1a5695]"
                ></textarea>
              </div>

              {/* Calculator Panel */}
              <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-3xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3 text-[#1a5695] font-bold text-[10px] uppercase tracking-widest">
                  <Calculator size={14} /> Capacity Estimator
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                      Wattage (W)
                    </span>
                    <input
                      type="number"
                      value={plateWattage}
                      onChange={(e) => setPlateWattage(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-white shadow-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                      Plates
                    </span>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-white shadow-sm outline-none"
                    />
                  </div>
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
            </form>

            {/* Fixed Footer Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0 flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-slate-400 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] px-6 py-3.5 rounded-2xl font-bold text-white bg-[#f39200] shadow-lg shadow-orange-500/20 hover:bg-[#e08600] active:scale-95 transition-all"
              >
                Save Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DISPOSITION MODAL (Handles Convert/Delay/Cancel) --- */}
      {dispositionModal.open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div
              className={`p-6 text-white text-center ${dispositionModal.type === "convert" ? "bg-emerald-600" : dispositionModal.type === "delay" ? "bg-amber-500" : "bg-rose-600"}`}
            >
              <h2 className="text-xl font-black font-syne uppercase tracking-tight">
                {dispositionModal.type} Lead
              </h2>
              <p className="text-white/80 text-xs font-bold">
                {dispositionModal.lead.name}
              </p>
            </div>
            <div className="p-8">
              {dispositionModal.type === "delay" && (
                <div className="mb-6 space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                    <Calendar size={12} /> Next Follow-up Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </div>
              )}
              <div className="mb-8 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                  <MessageSquare size={12} /> Remarks / Reason
                </label>
                <textarea
                  rows="3"
                  placeholder="Provide details..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 outline-none resize-none"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
              <button
                onClick={submitDisposition}
                className={`w-full py-4 text-white rounded-2xl font-bold shadow-lg ${dispositionModal.type === "convert" ? "bg-emerald-600" : dispositionModal.type === "delay" ? "bg-amber-500" : "bg-rose-600"}`}
              >
                Confirm {dispositionModal.type}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
