import React, { useEffect, useState } from "react";
import {
  Globe,
  Search,
  MapPin,
  Phone,
  User,
  Edit,
  Loader2,
  X,
  CheckCircle2,
  Calendar,
  ChevronDown,
  Activity,
} from "lucide-react";
import Navbar from "../crm/Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const WebLeads = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [webLeads, setWebLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Update Modal States
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Fetch Web Leads
  const fetchWebLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/sources/fetchAllWebLeads", {
        withCredentials: true,
      });
      setWebLeads(res.data.data || []);
    } catch (error) {
      console.error("Error fetching web leads", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebLeads();
  }, []);

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.post(`/api/leads/updateLead`, selectedLead, {
        withCredentials: true,
      });
      toast.success("Lead updated successfully");
      setIsUpdateModalOpen(false);
      fetchWebLeads();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const filteredLeads = webLeads.filter(
    (lead) =>
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.mobile?.includes(searchQuery),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Web Leads"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight font-syne uppercase flex items-center gap-3">
                <Globe className="text-[#1a5695]" size={28} />
                Website Inquiries
              </h1>
              <p className="text-sm text-slate-500">
                Real-time leads captured from your landing page
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Live Sync Active
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-3 rounded-[24px] border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search visitor name or mobile..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1a5695] outline-none transition-all text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center">
                <Loader2
                  className="animate-spin text-[#1a5695] mb-4"
                  size={40}
                />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Loading Web Leads
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        ID
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Visitor Info
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Address
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Status
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredLeads.map((lead, index) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-300">
                            #00{lead.id || index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm">
                              {lead.name}
                            </span>
                            <span className="text-[#1a5695] text-[11px] font-semibold flex items-center gap-1">
                              <Phone size={10} /> {lead.mobile}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <MapPin size={12} className="text-slate-300" />
                            <span className="truncate max-w-[150px]">
                              {lead.address}
                            </span>
                          </div>
                        </td>
                        {/* --- NEW STATUS COLUMN --- */}
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-black text-[#1a5695] uppercase tracking-tighter bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                            {lead.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setIsUpdateModalOpen(true);
                            }}
                            className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-[#1a5695] hover:text-white transition-all active:scale-90"
                          >
                            <Edit size={16} />
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

      {/* --- UPDATE MODAL --- */}
      {isUpdateModalOpen && selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-[#1a5695] p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <h2 className="text-lg font-bold font-syne uppercase">
                  Update Inquiry
                </h2>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="hover:bg-white/10 p-2 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateLead} className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Customer Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#1a5695] outline-none font-medium text-sm"
                    value={selectedLead.name}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#1a5695] outline-none font-medium text-sm"
                    value={selectedLead.mobile}
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        mobile: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* --- NEW STATUS DROPDOWN --- */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Lead Status
                </label>
                <div className="relative">
                  <Activity
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <select
                    className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#1a5695] outline-none font-medium text-sm appearance-none cursor-pointer"
                    value={selectedLead.status || "pending"}
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="pending">Pending Review</option>
                    <option value="contacted">Contacted</option>
                    <option value="site_visit">Site Visit Scheduled</option>
                    <option value="converted">Converted</option>
                    <option value="not_interested">Not Interested</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Site Address
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-4 text-slate-300"
                    size={16}
                  />
                  <textarea
                    rows="2"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#1a5695] outline-none font-medium text-sm resize-none"
                    value={selectedLead.address}
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        address: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-4 bg-[#f39200] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-orange-500/20 hover:bg-[#e08600] active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {updating ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebLeads;
