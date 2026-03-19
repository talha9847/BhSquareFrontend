import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Edit3,
  X,
  Package,
  Check,
  Loader2,
  ChevronRight,
  CreditCard,
  Banknote,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KitReady = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // MODAL STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loanRequired, setLoanRequired] = useState(false);
  const [loading, setLoading] = useState(false);

  // DATA STATE
  const [customers, setCustomers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const getCustomers = async () => {
    try {
      setPageLoading(true);
      const res = await axios.get(
        `${apiUrl}/api/kitready/fetchKitReadyCustomers`,
      );
      if (res.status === 200) {
        setCustomers(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/kitready/updateLoan`, {
        customerId: selectedCustomer.customer.id,
        loanRequired: loanRequired,
      });
      if (res.status === 200) {
        getCustomers();
        toast.success("Status updated successfully");
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("Error updating status");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (!c.customer?.lead) return false;
    const name = c.customer.lead.customer_name || "";
    const phone = c.customer.lead.contact_number || "";
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Kit Ready"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
              Kit Readiness
            </h1>
            <p className="text-sm text-slate-500">
              Manage material kits and financing status
            </p>
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
                placeholder="Search customers..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            {pageLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Fetching Records
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr className="whitespace-nowrap">
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Customer
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                        Loan Status
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                        Kit Status
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
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-[#1a5695] rounded-2xl flex items-center justify-center font-black border border-blue-100 uppercase">
                              {c.customer.lead.customer_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm">
                                {c.customer.lead.customer_name}
                              </p>
                              <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                                <MapPin size={10} /> {c.customer.lead.address}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* LOAN STATUS */}
                        <td className="px-6 py-4 text-center">
                          {!c.loan_status || c.loan_status === "pending" ? (
                            <span className="text-slate-300 text-[10px] font-bold uppercase italic">
                              Pending Setup
                            </span>
                          ) : c.loan_status === "required" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-black uppercase rounded-lg border border-amber-100">
                              <Banknote size={10} /> Loan Required
                            </span>
                          ) : (
                            <span className="text-emerald-600 text-[10px] font-black uppercase tracking-tighter">
                              ● Paid / Direct
                            </span>
                          )}
                        </td>

                        {/* KIT STATUS */}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest ${c.kit_status === "ready" ? "text-emerald-600" : "text-slate-400"}`}
                          >
                            {c.kit_status === "ready" ? "Ready" : "Pending"}
                          </span>
                        </td>

                        {/* CONSOLIDATED ACTION BUTTON */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end">
                            {!c.loan_status || c.loan_status === "pending" ? (
                              <button
                                onClick={() => {
                                  setSelectedCustomer(c);
                                  setIsModalOpen(true);
                                }}
                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#1a5695] hover:bg-white hover:shadow-md rounded-xl transition-all border border-slate-100"
                              >
                                <Edit3 size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  navigate(
                                    c.loan_status === "required"
                                      ? "/loanstep"
                                      : "/kit-dispatch",
                                  )
                                }
                                className="group/btn flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1a5695] hover:text-white transition-all border border-slate-200 shadow-sm"
                              >
                                {c.loan_status === "required" ? (
                                  <>
                                    <Banknote size={14} /> Go For Loan
                                  </>
                                ) : (
                                  <>
                                    <Package size={14} /> Go For Kit
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
            )}
          </div>
        </main>
      </div>

      {/* LOAN REQUIREMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-[#1a5695] p-8 text-white flex justify-between items-center relative">
              <div className="relative z-10">
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Financing Setup
                </h2>
                <p className="text-blue-100/60 text-[10px] font-bold uppercase mt-1">
                  Set payment for{" "}
                  {selectedCustomer?.customer.lead.customer_name}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="relative z-10 p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <div
                  className={`p-6 rounded-[32px] border transition-all duration-500 ${loanRequired ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-2xl shadow-sm transition-colors ${loanRequired ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"}`}
                      >
                        {loanRequired ? (
                          <Banknote size={20} />
                        ) : (
                          <CreditCard size={20} />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 uppercase">
                          Is Loan Required?
                        </p>
                        <p
                          className={`text-[10px] font-bold uppercase tracking-widest ${loanRequired ? "text-amber-600" : "text-emerald-600"}`}
                        >
                          {loanRequired ? "Financing Needed" : "Direct Payment"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setLoanRequired(!loanRequired)}
                      className={`w-14 h-7 rounded-full transition-all flex items-center px-1.5 ${loanRequired ? "bg-amber-500 justify-end" : "bg-slate-200 justify-start"}`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleUpdateStatus}
                  disabled={loading}
                  className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-[#15467a] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" /> Updating...
                    </>
                  ) : (
                    <>
                      <Check size={16} /> Confirm Selection
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

export default KitReady;
