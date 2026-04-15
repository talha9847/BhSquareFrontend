import React, { useEffect, useState } from "react";
import {
  Search,
  Zap,
  Loader2,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  User,
  MapPin,
} from "lucide-react";
import Navbar from "../crm/Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const FCommission = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [commissions, setCommissions] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const getCommissions = async () => {
    try {
      setPageLoading(true);
      const res = await axios.get(
        `/api/sources/getPaidCommissionByFabricatorId`,
        {
          withCredentials: true,
        },
      );
      if (res.status === 200) {
        setCommissions(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching commissions:", error);
      toast.error("Failed to sync commission records");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getCommissions();
  }, []);

  const filteredData = commissions.filter(
    (c) => c.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()),
    //   c.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalEarnings = filteredData.reduce(
    (acc, curr) => acc + parseFloat(curr.commission || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Commissions"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight font-syne uppercase flex items-center gap-3">
                COMMISSION LEDGER
              </h1>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                Track your earnings and payout history
              </p>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-[#1a5695] px-6 py-4 rounded-3xl text-white shadow-lg flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest">
                  Total Earned
                </p>
                <p className="text-xl font-black">
                  ₹{totalEarnings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by customer name or type..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#1a5695] outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm min-h-[400px] flex flex-col">
            {pageLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-32">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-slate-100 border-t-[#1a5695] rounded-full animate-spin"></div>
                  <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-[#1a5695] animate-pulse" />
                </div>
                <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">
                  Calculating Payouts...
                </p>
              </div>
            ) : filteredData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Customer & Date
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Location
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        System Details
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                        Commission
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredData.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-[#1a5695] rounded-2xl flex items-center justify-center font-black text-xs border border-blue-100">
                              {item.customer_name?.charAt(0) || "C"}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm leading-tight">
                                {item.customer_name ||
                                  `Customer #${item.customer_id}`}
                              </p>
                              <p className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                                <Calendar size={10} />{" "}
                                {new Date(item.created_at).toLocaleDateString(
                                  "en-GB",
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium max-w-[180px] truncate">
                            <MapPin
                              size={12}
                              className="text-slate-300 shrink-0"
                            />
                            <span>{item.address || "No address provided"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-[#1a5695] font-black text-sm">
                              <Zap size={14} className="fill-current" />
                              {item.total_kw}
                              <span className="text-[10px] text-slate-400 font-bold uppercase ml-0.5">
                                kW
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 text-emerald-600 font-black text-base">
                            <span className="text-xs">₹</span>
                            {parseFloat(item.commission).toLocaleString()}
                            <ArrowUpRight size={14} className="opacity-50" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-32 text-center">
                <div className="p-4 bg-slate-50 rounded-full mb-4">
                  <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-slate-800 font-bold">No Records Found</h3>
                <p className="text-xs text-slate-400 max-w-[200px] mt-1">
                  We couldn't find any commission records matching your search.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FCommission;
