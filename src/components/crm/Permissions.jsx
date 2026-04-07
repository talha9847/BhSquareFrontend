import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Shield,
  ArrowLeft,
  Loader2,
  FileText,
  UserCheck,
  ClipboardCheck,
  Lock,
  CheckCircle2,
  Settings2,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const Permissions = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const customerId = state?.customerId;
  const leadId = state?.leadId;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // Track which specific permission is toggling
  const [customer, setCustomer] = useState(null);
  const [permissions, setPermissions] = useState([]);

  const getIcon = (name) => {
    switch (name) {
      case "name_change":
        return <FileText size={18} />;
      case "doc_collect":
        return <ClipboardCheck size={18} />;
      case "loan_docs":
        return <UserCheck size={18} />;
      default:
        return <Settings2 size={18} />;
    }
  };

  const getPermissions = async () => {
    try {
      setPageLoading(true);
      const res = await axios.get(
        `/api/sources/getPermissions/${customerId}/${leadId}`,
      );
      if (res.status === 200) {
        setPermissions(res.data.data.permissions);
        setCustomer(res.data.data.customer);
      }
    } catch (error) {
      toast.error("Failed to fetch permissions");
    } finally {
      setTimeout(() => setPageLoading(false), 500);
    }
  };

  useEffect(() => {
    if (customerId && leadId) {
      getPermissions();
    } else {
      toast.error("Invalid Customer context");
      navigate(-1);
    }
  }, []);

  const handleToggle = async (perm) => {
    try {
      setUpdatingId(perm.id); // Start loader for this specific row
      const res = await axios.put(
        `/api/sources/updatePermission/${perm.id}`,
        { is_permitted: !perm.is_permitted },
        { withCredentials: true },
      );

      if (res.status === 200) {
        // Update local state immediately for snappy UI
        setPermissions((prev) =>
          prev.map((p) =>
            p.id === perm.id ? { ...p, is_permitted: !p.is_permitted } : p,
          ),
        );
        toast.success("Access updated");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update permission");
    } finally {
      setUpdatingId(null); // Stop loader
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Customers"
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 w-full">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex-1 overflow-y-auto">
          <main className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto pb-24">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-400 hover:text-[#1a5695] transition-colors mb-6 group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Back to Directory
              </span>
            </button>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#1a5695] rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                  <Shield size={12} /> Portal Security
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight font-syne uppercase leading-tight">
                  {pageLoading ? "Loading..." : customer?.lead?.customer_name}
                </h1>
                {!pageLoading && (
                  <p className="text-xs md:text-sm text-slate-500 font-medium flex items-center gap-2">
                    Managed by{" "}
                    <span className="text-[#1a5695] font-bold">
                      @{customer?.lead?.source?.name}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[32px] md:rounded-[40px] border border-slate-200 overflow-hidden shadow-sm min-h-[400px] flex flex-col">
              {pageLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-24">
                  <Loader2 className="w-12 h-12 text-[#1a5695] animate-spin mb-4" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Syncing Access Records
                  </p>
                </div>
              ) : (
                <div className="p-4 md:p-10 space-y-4">
                  {permissions.map((perm) => (
                    <div
                      key={perm.page.url}
                      className={`p-4 md:p-6 rounded-[24px] md:rounded-[32px] border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        perm.is_permitted
                          ? "bg-white border-[#1a5695]/10 shadow-sm ring-1 ring-[#1a5695]/5"
                          : "bg-slate-50 border-slate-200 opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 md:p-4 rounded-xl md:rounded-2xl shrink-0 ${
                            perm.is_permitted
                              ? "bg-[#1a5695] text-white shadow-md"
                              : "bg-white text-slate-300 border border-slate-100"
                          }`}
                        >
                          {perm.is_permitted ? (
                            getIcon(perm.page.name)
                          ) : (
                            <Lock size={18} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-800 uppercase tracking-tight text-xs md:text-sm truncate">
                            {perm.page.name.replace("_", " ")}
                          </h3>
                          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 truncate italic">
                            /{perm.page.url}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest ${
                            perm.is_permitted
                              ? "text-emerald-500"
                              : "text-slate-400"
                          }`}
                        >
                          {updatingId === perm.id
                            ? "Updating..."
                            : perm.is_permitted
                              ? "Authorized"
                              : "Revoked"}
                        </span>
                        <button
                          onClick={() => handleToggle(perm)}
                          disabled={updatingId !== null}
                          className={`w-12 h-7 md:w-14 md:h-8 rounded-full transition-all relative p-1 flex items-center ${
                            perm.is_permitted
                              ? "bg-emerald-500"
                              : "bg-slate-300"
                          } ${updatingId === perm.id ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <div
                            className={`w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow-sm transition-all transform flex items-center justify-center ${
                              perm.is_permitted
                                ? "translate-x-5 md:translate-x-6"
                                : "translate-x-0"
                            }`}
                          >
                            {updatingId === perm.id && (
                              <Loader2
                                size={10}
                                className="animate-spin text-slate-400"
                              />
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="mt-8 p-5 md:p-6 bg-amber-50 rounded-[24px] md:rounded-[28px] border border-amber-100 flex gap-4 items-start">
                    <CheckCircle2
                      className="text-amber-500 shrink-0 mt-0.5"
                      size={18}
                    />
                    <p className="text-[11px] text-amber-700 leading-relaxed font-medium italic">
                      Permissions update in real-time. Changes will immediately
                      restrict or grant access to the customer portal.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
