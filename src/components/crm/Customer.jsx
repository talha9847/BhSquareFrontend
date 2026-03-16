import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Eye,
  Zap,
  Filter,
  Edit3,
  X,
  FileText,
  AlertCircle,
  Check,
  Loader2,
  File,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Customer = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // MODAL STATES
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [nameChange, setNameChange] = useState("not_used");
  const [toggle, setToggle] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const [customer, setCustomer] = useState([]);
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);

  // UPDATED: Dynamic Status Styling
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "done")
      return "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm shadow-emerald-100/50";
    if (s === "pending") return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-slate-50 text-slate-500 border-slate-100";
  };

  const saveCustomerChanges = async () => {
    try {
      setLoading(true);
      if (id <= 0) {
        toast.error("please select valid customer");
        setIsEditModalOpen(false);
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${apiUrl}/api/customers/updateCustomerNameChange`,
        { id: id, name_change: nameChange },
      );

      if (res.status == 200) {
        getCustomers();
        toast.success("Updated....");
        setIsEditModalOpen(false);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Internal server error");
      setIsEditModalOpen(false);
      setLoading(false);
    }
  };

  const getCustomers = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/customers/getCustomers`);
      setCustomer(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const filteredCustomers = customer.filter(
    (c) =>
      c.lead?.customer_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      c.lead?.contact_number?.includes(searchQuery),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Customers"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight font-syne uppercase">
                Active Customers
              </h1>
              <p className="text-sm text-slate-500">
                Onboarded clients and installation progress
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white px-5 py-2.5 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <Zap size={14} className="text-[#1a5695] fill-[#1a5695]" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    Total Installed
                  </p>
                  <span className="text-lg font-black text-[#1a5695]">
                    13.82 kW
                  </span>
                </div>
              </div>
            </div>
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
                placeholder="Search by name or contact..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#1a5695] outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="bg-slate-50/50">
                  <tr className="whitespace-nowrap">
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Customer
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Site Location
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Name Change
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Capacity
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                      Status
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                      Stage Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCustomers.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 text-[#1a5695] rounded-2xl flex items-center justify-center font-black text-xs border border-blue-100 uppercase">
                            {c.lead?.customer_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm leading-tight">
                              {c.lead?.customer_name}
                            </p>
                            <p className="text-slate-400 text-[11px] font-medium">
                              {c.lead?.contact_number}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium max-w-[180px] truncate">
                          <MapPin
                            size={12}
                            className="text-slate-300 shrink-0"
                          />
                          <span>{c.lead?.address}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {c.name_change === "required" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 text-[9px] font-black uppercase rounded-lg border border-amber-100">
                            <AlertCircle size={10} /> Required
                          </span>
                        )}
                        {c.name_change === "changed" && (
                          <span className="text-blue-700 text-[10px] font-black uppercase tracking-tighter">
                            ● Changed
                          </span>
                        )}
                        {c.name_change === "unchanged" && (
                          <span className="text-emerald-600 text-[10px] font-black uppercase tracking-tighter">
                            ● Unchanged
                          </span>
                        )}
                        {c.name_change === "not_used" && (
                          <span className="text-slate-300 text-[10px] font-bold uppercase italic">
                            Not Setup
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[#1a5695] font-black text-sm">
                          {(c.lead?.total_capacity / 1000).toFixed(2)}{" "}
                          <span className="text-[10px] text-slate-400">kW</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase transition-all ${getStatusStyle(c.status)}`}
                        >
                          {c.status}
                        </span>
                      </td>

                      {/* IMPROVED ACTION COLUMN */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end">
                          {c.name_change === "not_used" ? (
                            <button
                              onClick={() => {
                                setNameChange("unchanged");
                                setIsEditModalOpen(true);
                                setId(c.id);
                              }}
                              className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#1a5695] hover:bg-white hover:shadow-md hover:border-[#1a5695]/30 rounded-xl transition-all border border-slate-100"
                              title="Update Status"
                            >
                              <Edit3 size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const route =
                                  c.name_change === "required"
                                    ? "/namechange"
                                    : c.status?.toLowerCase() === "done"
                                      ? "/registration"
                                      : "/documentcollection";
                                navigate(route, {
                                  state: { customerId: c.id },
                                });
                              }}
                              className="group/btn flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1a5695] hover:text-white transition-all border border-slate-200 shadow-sm active:scale-95"
                            >
                              {c.name_change === "required" ? (
                                <>
                                  {" "}
                                  <FileText size={14} /> Process Name
                                  Change{" "}
                                </>
                              ) : c.status?.toLowerCase() === "done" ? (
                                <>
                                  {" "}
                                  <Zap size={14} /> Go Registration{" "}
                                </>
                              ) : (
                                <>
                                  {" "}
                                  <Eye size={14} /> Collect Docs{" "}
                                </>
                              )}
                              <ChevronRight
                                size={14}
                                className="group-hover/btn:translate-x-1 transition-transform"
                              />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20">
            <div className="bg-[#1a5695] p-8 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                <FileText size={120} />
              </div>
              <div className="relative z-10">
                <h2 className="text-xl font-black font-syne uppercase tracking-tight">
                  Update Record
                </h2>
                <p className="text-blue-100/60 text-[10px] font-bold uppercase tracking-widest mt-1">
                  Configure name change status
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="relative z-10 p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                <div
                  className={`p-6 rounded-[32px] border transition-all duration-500 ${toggle ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-100"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-2xl shadow-sm transition-colors ${toggle ? "bg-emerald-500 text-white" : "bg-white text-slate-400"}`}
                      >
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 uppercase tracking-tight">
                          Name Change Required?
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {toggle ? "Action Required" : "No Action"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setToggle(!toggle);
                        setNameChange(!toggle ? "required" : "unchanged");
                      }}
                      className={`w-14 h-7 rounded-full transition-all flex items-center px-1.5 ${toggle ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"}`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={saveCustomerChanges}
                  disabled={loading}
                  className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20 hover:bg-[#15467a] transition-all flex items-center justify-center gap-3 disabled:opacity-70 active:scale-95"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" /> Updating...
                    </>
                  ) : (
                    <>
                      <Check size={16} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;
