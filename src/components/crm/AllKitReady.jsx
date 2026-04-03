import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Package,
  Loader2,
  Banknote,
  Clock,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AllKitReady = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [customers, setCustomers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const getCustomers = async () => {
    try {
      setPageLoading(true);
      const res = await axios.get(
        `${apiUrl}/api/kitready/fetchKitReadyCustomersByStatus`,
        { params: { status: activeTab }, withCredentials: true },
      );
      if (res.status === 200) {
        setCustomers(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch kit information");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getCustomers();
  }, [activeTab]);

  const filteredCustomers = customers.filter((c) => {
    const cust = c.customer || c;
    const lead = cust.lead || {};
    const name = lead.customer_name || "";
    const phone = lead.contact_number || "";
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Kit Ready"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight uppercase text-slate-800">
                Kit <span className="text-[#1a5695]">Inventory</span>
              </h1>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Monitoring {activeTab} stage logistics
              </p>
            </div>

            {/* TAB TOGGLE */}
            <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
              {["pending", "done"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    activeTab === tab
                      ? "bg-[#1a5695] text-white shadow-md"
                      : "text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {tab === "pending" ? (
                    <Clock size={14} />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* SEARCH BOX */}
          <div className="relative mb-8">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
              size={20}
            />
            <input
              type="text"
              placeholder="SEARCH BY CUSTOMER NAME OR CONTACT..."
              className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-[28px] outline-none text-[11px] font-bold uppercase tracking-widest focus:border-[#1a5695] shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* INFORMATION TABLE */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            {pageLoading ? (
              <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin mb-4" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Loading Records...
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Customer & Location
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                        Financing
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                        Logistics Status
                      </th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                        Navigation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredCustomers.map((c) => {
                      const cust = c.customer || c;
                      const lead = cust.lead || {};
                      return (
                        <tr
                          key={c.id}
                          className="group hover:bg-slate-50/30 transition-colors"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-[#1a5695]/5 text-[#1a5695] rounded-2xl flex items-center justify-center font-black text-lg border border-[#1a5695]/10">
                                {lead.customer_name?.charAt(0)}
                              </div>
                              <div>
                                <p className="font-black text-slate-800 text-sm uppercase">
                                  {lead.customer_name}
                                </p>
                                <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase mt-0.5">
                                  <MapPin
                                    size={12}
                                    className="text-[#1a5695]"
                                  />{" "}
                                  {lead.address}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-8 py-6 text-center">
                            <div
                              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                                c.loan_status === "required"
                                  ? "bg-amber-50 text-amber-600 border-amber-100"
                                  : "bg-emerald-50 text-emerald-600 border-emerald-100"
                              }`}
                            >
                              {c.loan_status === "required" ? (
                                <Banknote size={12} />
                              ) : (
                                <CheckCircle2 size={12} />
                              )}
                              {c.loan_status || "Pending"}
                            </div>
                          </td>

                          <td className="px-8 py-6 text-center">
                            <span
                              className={`text-[10px] font-black uppercase tracking-widest ${activeTab === "done" ? "text-emerald-600" : "text-slate-400"}`}
                            >
                              {activeTab === "done"
                                ? "Material Dispatched"
                                : "Ready for Packing"}
                            </span>
                          </td>

                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2">
                              {/* DYNAMIC ACTION BUTTONS */}
                              {activeTab === "pending" ? (
                                <button
                                  onClick={() =>
                                    navigate(
                                      c.loan_status === "required"
                                        ? "/loanstep"
                                        : "/preparekit",
                                      {
                                        state: {
                                          customerId: cust.id,
                                          leadId: lead.id,
                                        },
                                      },
                                    )
                                  }
                                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1a5695] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-lg transition-all"
                                >
                                  {c.loan_status === "required"
                                    ? "Process Loan"
                                    : "Prepare Kit"}
                                  <ArrowRight size={14} />
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() =>
                                      navigate("/preparekit", {
                                        state: {
                                          customerId: cust.id,
                                          leadId: lead.id,
                                        },
                                      })
                                    }
                                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all"
                                  >
                                    <Package size={14} /> See Kit
                                  </button>
                                  {c.loan_status === "completed" && (
                                    <button
                                      onClick={() =>
                                        navigate("/loanstep", {
                                          state: {
                                            customerId: cust.id,
                                            leadId: lead.id,
                                          },
                                        })
                                      }
                                      className="p-2.5 border-2 border-[#1a5695] text-[#1a5695] rounded-xl hover:bg-[#1a5695] hover:text-white transition-all"
                                      title="See Loan"
                                    >
                                      <ExternalLink size={16} />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
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
    </div>
  );
};

export default AllKitReady;
