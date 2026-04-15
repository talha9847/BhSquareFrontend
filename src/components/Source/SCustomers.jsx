import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Zap,
  ChevronRight,
  Loader2,
  FileText,
  Lock,
  Phone,
  ShieldCheck,
  ClipboardCheck,
  Settings,
} from "lucide-react";
import Navbar from "../crm/Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SCustomers = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true); // Added loading state

  const getCustomers = async () => {
    try {
      setPageLoading(true); // Start loading
      const res = await axios.get(`/api/sources/getCustomersBySource`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setCustomers(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to sync customer records");
    } finally {
      setPageLoading(false); // End loading
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const getPermissionIcon = (pageName) => {
    switch (pageName) {
      case "name_change":
        return <Settings size={14} />;
      case "doc_collect":
        return <FileText size={14} />;
      case "registration":
        return <ShieldCheck size={14} />;
      default:
        return <ClipboardCheck size={14} />;
    }
  };

  const filteredData = customers.filter(
    (c) =>
      c.lead?.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lead?.contact_number.includes(searchQuery),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="All Customers"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight font-syne uppercase flex items-center gap-3">
                CUSTOMER DIRECTORY
              </h1>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                Manage permissions and lead status
              </p>
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
                placeholder="Search by name or mobile..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#1a5695] outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm min-h-[400px] flex flex-col">
            {pageLoading ? (
              // LOADER SECTION
              <div className="flex-1 flex flex-col items-center justify-center py-32">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-slate-100 border-t-[#1a5695] rounded-full animate-spin"></div>
                  <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-[#1a5695] animate-pulse" />
                </div>
                <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">
                  Decrypting Records...
                </p>
              </div>
            ) : filteredData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Customer Info
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Location
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Capacity
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                        Module Permissions
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
                              {item.lead?.customer_name?.charAt(0)}
                            </div>
                            <div>
                              <p
                                onClick={() => {
                                  navigate("/source/master", {
                                    state: {
                                      customerId: item.id,
                                      leadId: item.lead_id,
                                    },
                                  });
                                }}
                                className="font-bold text-slate-800 text-sm leading-tight cursor-pointer"
                              >
                                {item.lead?.customer_name}
                              </p>
                              <p className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                                <Phone size={10} /> {item.lead?.contact_number}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium max-w-[200px] truncate">
                            <MapPin
                              size={12}
                              className="text-slate-300 shrink-0"
                            />
                            <span>{item.lead?.address}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-[#1a5695] font-black text-sm">
                            <Zap size={14} className="fill-current" />
                            {(item.lead?.total_capacity / 1000).toFixed(2)}
                            <span className="text-[10px] text-slate-400 font-bold uppercase ml-0.5">
                              kW
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {item.permissions ? (
                              item.permissions.map((perm) => (
                                <button
                                  onClick={() => {
                                   
                                    navigate(`/source/${perm.page.url}`, {
                                      state: {
                                        leadId: item.lead_id,
                                        customerId: item.id,
                                        pageId: perm.page.id,
                                        customerName: item.lead.customer_name,
                                        contactNumber: item.lead.contact_number,
                                      },
                                    });
                                  }}
                                  key={perm.id}
                                  disabled={!perm.is_permitted}
                                  title={perm.page.name.replace("_", " ")}
                                  className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                                    perm.is_permitted
                                      ? "bg-white text-[#1a5695] border-blue-100 hover:bg-[#1a5695] hover:text-white hover:shadow-md active:scale-90"
                                      : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                                  }`}
                                >
                                  {perm.is_permitted ? (
                                    getPermissionIcon(perm.page.name)
                                  ) : (
                                    <Lock size={14} />
                                  )}
                                  <span className="text-[9px] font-black uppercase tracking-tighter hidden md:block">
                                    {perm.page.name.split("_")[0]}
                                  </span>
                                </button>
                              ))
                            ) : (
                              <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-3 py-1 rounded-full uppercase border border-amber-100">
                                Pending Conversion
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // EMPTY STATE
              <div className="flex-1 flex flex-col items-center justify-center py-32 text-center">
                <div className="p-4 bg-slate-50 rounded-full mb-4">
                  <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-slate-800 font-bold">No Records Found</h3>
                <p className="text-xs text-slate-400 max-w-[200px] mt-1">
                  We couldn't find any customers matching your search or
                  filters.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SCustomers;
