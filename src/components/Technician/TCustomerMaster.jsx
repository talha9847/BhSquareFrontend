import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  CheckCircle2,
  Clock,
  Calendar,
  FileText,
  Settings,
  Eye,
  Activity,
  Landmark,
  Truck,
  Hammer,
  Box,
  Zap,
  Ruler,
  IndianRupee,
} from "lucide-react";
import axios from "axios";
import Navbar from "../crm/Navbar";
import Sidebar from "./Sidebar";

// --- SHARED UI COMPONENTS ---

const ModuleCard = ({
  title,
  icon,
  children,
  accentColor = "text-[#1a5695]",
}) => (
  <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm relative transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div className="flex justify-between items-center mb-10">
      <h3
        className={`text-[11px] font-black ${accentColor} uppercase tracking-[0.2em] flex items-center gap-3`}
      >
        {icon} {title}
      </h3>
    </div>
    {children}
  </div>
);

const DataField = ({ label, value, isFull = false }) => (
  <div className={isFull ? "col-span-full" : ""}>
    <p className="text-[9px] font-black uppercase tracking-[0.15em] mb-2 text-slate-400">
      {label}
    </p>
    <p className="text-[13px] font-black uppercase tracking-tight text-slate-800">
      {value || <span className="text-slate-200 tracking-widest">---</span>}
    </p>
  </div>
);

// --- FEATURE MODULES ---

const LoanModule = ({ customerId }) => {
  const [loan, setLoan] = useState(null);
  const fetchLoan = async () => {
    try {
      const res = await axios.get(`/api/loan/fetchCustomerLoan/${customerId}`, {
        withCredentials: true,
      });
      if (res.status === 200) setLoan(res.data.data);
    } catch (err) {}
  };
  useEffect(() => {
    if (customerId) fetchLoan();
  }, [customerId]);

  if (!loan) return null;

  return (
    <ModuleCard
      title="Finance & Loan Registry"
      icon={<Landmark size={18} />}
      accentColor="text-indigo-600"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 mb-10">
        <DataField label="Bank Name" value={loan.bank_name} />
        <div className="flex flex-col">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] mb-2 text-slate-400">
            Application Status
          </p>
          <span
            className={`self-start px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${loan.is_applied ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "bg-slate-100 text-slate-400"}`}
          >
            {loan.is_applied ? "Applied" : "Not Applied"}
          </span>
        </div>
        <DataField
          label="Estimated Amount"
          value={`₹${loan.estimated?.toLocaleString()}`}
        />
        <DataField
          label="Sanctioned Amount"
          value={`₹${loan.loan_amount?.toLocaleString()}`}
        />
      </div>
      {loan.documents?.length > 0 && (
        <div className="pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loan.documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <FileText
                    size={18}
                    className="text-slate-400 group-hover:text-indigo-600"
                  />
                </div>
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">
                  {doc.doc_name}
                </p>
              </div>
              <Eye
                size={16}
                className="text-slate-300 group-hover:text-indigo-600"
              />
            </a>
          ))}
        </div>
      )}
    </ModuleCard>
  );
};

const TechnicalModule = ({ customerId }) => {
  const [tech, setTech] = useState(null);

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const res = await axios.get(
          `/api/docs/getCustomerDocumentsWithoutFiles/${customerId}`,
          { withCredentials: true },
        );
        if (res.status === 200) setTech(res.data.data);
      } catch (err) {}
    };
    if (customerId) fetchTech();
  }, [customerId]);

  if (!tech) return null;

  return (
    <>
      <ModuleCard
        title="Technical Registry"
        icon={<Settings size={18} />}
        accentColor="text-emerald-600"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
          <DataField label="Consumer Number" value={tech.consumer_number} />
          <DataField label="Sub-Division" value={tech.sub_division} />
          <DataField label="GPS Coordinates" value={tech.geo_coordinate} />
        </div>
      </ModuleCard>
    </>
  );
};

const KitModule = ({ customerId }) => {
  const [kitData, setKitData] = useState(null);

  useEffect(() => {
    const fetchKit = async () => {
      try {
        const res = await axios.get(
          `/api/kitready/fetchKitItemsbyCustomer/${customerId}`,
          { withCredentials: true },
        );
        if (res.status === 200) setKitData(res.data.data);
      } catch (err) {}
    };
    if (customerId) fetchKit();
  }, [customerId]);

  if (!kitData) return null;

  const isComplete = kitData.status?.toLowerCase() === "done";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* HEADER: CLEAN & COMPACT */}
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <Zap size={18} className="text-[#1a5695]" />
          <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-slate-800">
            Kit Readiness Report
          </h3>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest ${
            isComplete
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-slate-50 text-slate-600 border-slate-200"
          }`}
        >
          {kitData.status}
        </div>
      </div>

      {/* ITEMS: STRUCTURED MINIMALISM */}
      <div className="divide-y divide-slate-100">
        {kitData.items.map((item) => {
          const itemReady =
            item.status?.toLowerCase() === "allocated" ||
            item.status?.toLowerCase() === "done";

          return (
            <div
              key={item.id}
              className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-6">
                {/* STATUS INDICATOR */}
                <div
                  className={`w-2 h-2 rounded-full ${itemReady ? "bg-emerald-500" : "bg-slate-300"}`}
                />

                <div>
                  <p className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">
                    {item.item_name}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                    Component Registry #{item.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-12">
                {/* QUANTITY SECTION */}
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                    Quantity
                  </p>
                  <p className="text-lg font-black text-slate-900 tabular-nums">
                    {item.qty}
                  </p>
                </div>

                {/* STATUS BADGE */}
                <div className="w-24 text-right">
                  <span
                    className={`text-[10px] font-black uppercase tracking-tighter ${
                      itemReady ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    {itemReady ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER: SYSTEM LOG */}
      <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          BHSquare Inventory System v2.0
        </span>
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
          {new Date().toLocaleDateString("en-IN")}
        </span>
      </div>
    </div>
  );
};

const DispatchModule = ({ customerId }) => {
  const [dispatchData, setDispatchData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDispatch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/dispatch/getDispatchByCustomerId/${customerId}`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        const result = res.data.data;

        // FIX: If it's a single object, wrap it in []. If it's already an array, use it.
        if (result && !Array.isArray(result)) {
          setDispatchData([result]);
        } else {
          setDispatchData(result || []);
        }
      }
    } catch (error) {
      setDispatchData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) fetchDispatch();
  }, [customerId]);

  // Use a simple null return if no data exists
  if (!loading && (!dispatchData || dispatchData.length === 0)) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <Truck size={18} className="text-[#1a5695]" />
          <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-slate-800">
            Dispatch & Transit Log
          </h3>
        </div>
        <div className="bg-blue-50 text-[#1a5695] border border-blue-100 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">
          Active Shipments
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="p-10 text-center animate-pulse">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              Retrieving Logistics Data...
            </span>
          </div>
        ) : (
          dispatchData.map((item) => (
            <div
              key={item.id}
              className="px-8 py-6 hover:bg-slate-50/50 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Assigned Driver
                  </p>
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    <p className="text-[13px] font-bold text-slate-900 uppercase">
                      {item.driver_name}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Transport Vehicle
                  </p>
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-slate-400" />
                    <p className="text-[13px] font-bold text-slate-900 uppercase">
                      {item.car_name}
                    </p>
                  </div>
                </div>

                <div className="md:text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Dispatch Timestamp
                  </p>
                  <div className="flex items-center md:justify-end gap-2 text-slate-900">
                    <Calendar size={14} className="text-slate-400" />
                    <p className="text-[12px] font-black tabular-nums">
                      {new Date(item.created_at)
                        .toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between opacity-60">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                  Log Entry ID: #{item.id?.toString().padStart(4, "0")}
                </span>
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">
                  Confirmed Dispatch
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-center">
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.25em]">
          BHSquare Operations | Logistics Verification
        </p>
      </div>
    </div>
  );
};
// --- MAIN PAGE COMPONENT ---
const FabricationModule = ({ customerId }) => {
  const [fabData, setFabData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFab = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/dispatch/getFabricationByCustomerId/${customerId}`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        const result = res.data.data;
        if (result && !Array.isArray(result)) {
          setFabData([result]);
        } else {
          setFabData(result || []);
        }
      }
    } catch (error) {
      setFabData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) fetchFab();
  }, [customerId]);

  if (!loading && (!fabData || fabData.length === 0)) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <Hammer size={18} className="text-[#1a5695]" />
          <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-slate-800">
            Fabrication Progress
          </h3>
        </div>
        <div className="bg-slate-50 text-slate-500 border border-slate-200 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">
          Production Phase
        </div>
      </div>

      {/* FABRICATION ENTRIES */}
      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="p-10 text-center animate-pulse">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              Fetching Fabrication Logs...
            </span>
          </div>
        ) : (
          fabData.map((item) => {
            const isDone =
              item.status?.toLowerCase() === "done" ||
              item.status?.toLowerCase() === "completed";

            return (
              <div
                key={item.id}
                className="px-8 py-7 hover:bg-slate-50/50 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                  {/* COLUMN 1: FABRICATOR INFO */}
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Service Partner
                    </p>
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-[#1a5695]" />
                      <p className="text-[14px] font-bold text-slate-900 uppercase">
                        {item.fabricator_name}
                      </p>
                    </div>

                    <div
                      className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest ${
                        isDone
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {isDone && <CheckCircle2 size={10} />}
                      {item.status}
                    </div>
                  </div>

                  {/* COLUMN 2: NEW FINANCIAL DETAIL SECTION */}
                  <div className="md:border-l md:border-slate-100 md:pl-8">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Fabricator Commission
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 p-1.5 rounded text-blue-600">
                        <IndianRupee size={12} />
                      </div>
                      <p className="text-[16px] font-black text-slate-900 tabular-nums">
                        {item.fabricator_commission
                          ? Number(item.fabricator_commission).toLocaleString(
                              "en-IN",
                            )
                          : "0.00"}
                      </p>
                    </div>
                    <p className="text-[8px] text-slate-400 mt-1 font-medium italic">
                      * Commission subject to audit
                    </p>
                  </div>

                  {/* COLUMN 3: UPDATED TIMESTAMP */}
                  <div className="md:text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Last Site Update
                    </p>
                    <div className="flex items-center md:justify-end gap-2 text-slate-900">
                      <Clock size={14} className="text-slate-400" />
                      <p className="text-[12px] font-black tabular-nums">
                        {new Date(item.updated_at || item.created_at)
                          .toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          .toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SYSTEM FOOTER */}
      <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
          BHSquare Operations Management
        </span>
        <span className="text-[8px] font-bold text-slate-300 uppercase">
          ID: FAB-{fabData[0]?.id?.toString().padStart(3, "0") || "000"}
        </span>
      </div>
    </div>
  );
};

const WiringModule = ({ customerId }) => {
  const [wiringData, setWiringData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/wiring/getWiringItemsByCustomerId/${customerId}`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        setWiringData(res.data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) fetchData();
  }, [customerId]);

  if (!loading && !wiringData) return null;

  const isComplete =
    wiringData?.status?.toLowerCase() === "done" ||
    wiringData?.status?.toLowerCase() === "completed";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      {/* HEADER: UPDATED WITH TECHNICIAN NAME */}
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-white">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Zap size={18} className="text-[#1a5695]" />
            <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-slate-800">
              Wiring & Electrical Specs
            </h3>
          </div>
          {/* Technician Info Label */}
          <div className="flex items-center gap-1.5 ml-7">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
              Technician:
            </span>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
              {wiringData?.technician_name || "Unassigned"}
            </span>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest ${
            isComplete
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-slate-50 text-slate-600 border-slate-200"
          }`}
        >
          {isComplete && <CheckCircle2 size={10} />}
          {wiringData?.status || "Pending"}
        </div>
      </div>

      {/* ITEMS LIST */}
      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="p-10 text-center animate-pulse text-[10px] font-black text-slate-300 uppercase tracking-widest">
            Loading Electrical Data...
          </div>
        ) : (
          wiringData?.items?.map((item) => (
            <div
              key={item.wiring_item_id}
              className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-6">
                {/* DYNAMIC COLOR INDICATOR */}
                <div
                  className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center shadow-sm transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor:
                      item.color.toLowerCase() === "white"
                        ? "#f8fafc"
                        : item.color.toLowerCase(),
                    boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.05)`,
                  }}
                >
                  <Activity
                    size={16}
                    className={
                      ["black", "blue", "red"].includes(
                        item.color.toLowerCase(),
                      )
                        ? "text-white/70"
                        : "text-slate-400"
                    }
                  />
                </div>

                <div>
                  <p className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] font-black text-[#1a5695] uppercase tracking-wider">
                      {item.wire_type}
                    </span>
                    <span className="text-slate-200">•</span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Ruler size={10} /> {item.gauge} SQMM
                    </span>
                  </div>
                </div>
              </div>

              {/* QUANTITY SECTION */}
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                  Length
                </p>
                <p className="text-lg font-black text-slate-900 tabular-nums leading-none">
                  {item.qty}
                  <span className="text-[10px] ml-1 text-slate-300 font-bold uppercase tracking-tighter">
                    mtrs
                  </span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SYSTEM FOOTER */}
      <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          BHSquare Electrical Log
        </span>
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
          REG-ID: W-{wiringData?.wiring_id?.toString().padStart(3, "0")}
        </span>
      </div>
    </div>
  );
};

const TCustomerMaster = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId, leadId } = location.state || {};

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState(null);

  const formatIST = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString); // already ISO UTC (Z format)

    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const fetchCore = async () => {
      try {
        const [lRes, sRes] = await Promise.all([
          axios.get(`/api/leads/fetchLeadById/${leadId}`, {
            withCredentials: true,
          }),
        ]);
        setLead(lRes.data?.data);
      } catch (err) {
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    if (!customerId || !leadId) {
      navigate("/customers");
      return;
    }
    fetchCore();
  }, [customerId, leadId, navigate]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Customers"
      />
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-[#1a5695] rounded-full animate-spin"></div>
              <h2 className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Syncing Profile...
              </h2>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-[#1a5695] text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-blue-100">
                      CUST-{customerId}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase border border-emerald-200">
                      <Activity size={12} /> Live Status
                    </span>
                  </div>
                  <h1 className="text-5xl font-black tracking-tight uppercase leading-none text-slate-800">
                    {lead?.customer_name}
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-8">
                  <ModuleCard
                    title="Customer Bio & Site"
                    icon={<User size={18} />}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                      {/* Section: Customer Details */}
                      <DataField
                        label="Full Name"
                        value={lead?.customer_name}
                      />
                      <DataField
                        label="Phone Number"
                        value={lead?.contact_number}
                      />
                      {/* Section: System Specifications */}
                      <DataField
                        label="System Type"
                        value={lead?.installation_type}
                      />
                      <DataField label="Source Name" value={lead?.source} />
                      <DataField
                        label="Number of Panels"
                        value={lead?.number_of_panels}
                      />
                      <DataField
                        label="Number of Inverters"
                        value={lead?.number_of_inverters}
                      />
                      <DataField
                        label="Panel Capacity"
                        value={`${(lead?.total_capacity / 1000).toFixed(2)} KW`}
                      />
                      {/* New Field Added Here */}
                      <DataField
                        label="Inverter Capacity"
                        value={
                          lead?.inverter_capacity
                            ? `${lead?.inverter_capacity} kW`
                            : "—"
                        }
                      />
                      {/* Full Width Field */}
                      <div className="sm:col-span-2">
                        <DataField
                          label="Installation Address"
                          value={lead?.address}
                        />
                      </div>
                    </div>
                  </ModuleCard>
                  <TechnicalModule customerId={customerId} />
                  <KitModule customerId={customerId} />
                  <DispatchModule customerId={customerId} />
                  <FabricationModule customerId={customerId} />
                  <WiringModule customerId={customerId} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TCustomerMaster;
