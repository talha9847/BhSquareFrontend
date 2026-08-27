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
  Edit3,
  X,
} from "lucide-react";

import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

// --- SHARED UI COMPONENTS ---

const ModuleCard = ({
  title,
  icon,
  children,
  accentColor = "text-[#1a5695]",
  headerAction,
}) => (
  <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm relative transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div className="flex justify-between items-center mb-10">
      <h3
        className={`text-[11px] font-black ${accentColor} uppercase tracking-[0.2em] flex items-center gap-3`}
      >
        {icon} {title}
      </h3>

      {headerAction && <div>{headerAction}</div>}
    </div>

    {children}
  </div>
);

const DataField = ({ label, value, isFull = false }) => (
  <div
    className={`${isFull ? "col-span-full" : "col-span-1"} py-3 border-b border-slate-100 hover:bg-slate-50/50 transition-colors px-2 rounded-lg`}
  >
    <div className="flex items-center gap-2 mb-1">
      {/* Small accent dot for a "Live Data" feel */}
      <div className="w-1 h-1 rounded-full bg-[#1a5695]/40" />
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
    </div>
    <p className="text-[15px] font-semibold text-slate-800 ml-3">
      {value || (
        <span className="text-slate-300 font-normal">Not specified</span>
      )}
    </p>
  </div>
);
const NameChangeModule = ({ customerId }) => {
  const [nameChangeDocs, setNameChangeDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNameChange = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/namechange/getNameChangeDocs/${customerId}`,
          { withCredentials: true },
        );
        if (res.status === 200) {
          setNameChangeDocs(res.data.data || []);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    if (customerId) fetchNameChange();
  }, [customerId]);

  if (!loading && nameChangeDocs.length === 0) return null;

  return (
    <ModuleCard
      title="Name Change Documentation"
      icon={<User size={18} />}
      accentColor="text-rose-600"
    >
      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-slate-50 rounded-3xl" />
            <div className="h-16 bg-slate-50 rounded-3xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {nameChangeDocs.map((doc) => (
              <a
                key={doc.id}
                href={doc.document_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-5 rounded-[32px] bg-slate-50 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <FileText
                      size={20}
                      className="text-slate-400 group-hover:text-rose-600"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
                      {doc.document_name}
                    </p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-1">
                      Identity Verification Doc
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="opacity-0 group-hover:opacity-100 text-[9px] font-black text-rose-600 uppercase tracking-widest transition-opacity">
                    View Document
                  </span>
                  <Eye
                    size={18}
                    className="text-slate-300 group-hover:text-rose-600"
                  />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </ModuleCard>
  );
};
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
          `/api/docs/fetchCustomerDocuments/${customerId}`,
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

      {tech.files?.length > 0 && (
        <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm">
          <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.2em] flex items-center gap-3 mb-10">
            <FileText size={18} /> Master Vault
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {tech.files.map((file) => (
              <a
                key={file.id}
                href={file.file_url}
                target="_blank"
                rel="noreferrer"
                className="group relative flex flex-col p-6 rounded-[32px] bg-slate-50 border-2 border-transparent hover:border-[#1a5695] hover:bg-white transition-all shadow-sm"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <FileText
                    className="text-slate-400 group-hover:text-[#1a5695]"
                    size={24}
                  />
                </div>
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight truncate mb-1">
                  {file.file_name}
                </span>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye size={16} className="text-[#1a5695]" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
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

const EditCustomerModal = ({ lead, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    customer_name: lead?.customer_name || "",
    contact_number: lead?.contact_number || "",
    installation_type: lead?.installation_type || "",
    source: lead?.source || "",
    panel_wattage: lead?.panel_wattage || "",
    number_of_panels: lead?.number_of_panels || "",
    number_of_inverters: lead?.number_of_inverters || "",
    total_capacity: lead?.total_capacity || "",
    inverter_capacity: lead?.inverter_capacity || "",
    address: lead?.address || "",
  });
  const getSources = async () => {
    try {
      const result = await axios.get(`/api/sources/fetchSources`, {
        withCredentials: true,
      });

      setSources(result.data.data);

      result.data.data.map((v) => {
        sourceMap[v.id] = v.name;
      });
    } catch (error) {}
  };
  useEffect(() => {
    getSources();
  }, []);
  const [sources, setSources] = useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const res = await axios.put(
        `/api/leads/updateLead/${lead.id}`,
        formData,
        {
          withCredentials: true,
        },
      );

      if (res.status === 200) {
        onUpdated(res.data?.data || formData);
        onClose();
      }
    } catch (err) {
      console.error("Failed to update customer:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to update customer details. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={!saving ? onClose : undefined}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* HEADER */}
        <div className="sticky top-0 z-10 px-8 py-6 bg-white border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-[#1a5695] uppercase tracking-[0.2em] mb-2">
              Customer Management
            </p>

            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Edit Customer Bio & Site
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X size={18} className="text-slate-600" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CUSTOMER DETAILS */}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Phone Number
              </label>

              <input
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold"
              />
            </div>

            {/* Project Category */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">
                Project Category
              </label>

              <select
                name="installation_type"
                value={formData.installation_type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695]"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Source Name
                  </label>

                  <select
                    name="source_id"
                    value={formData.source_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold appearance-none"
                  >
                    {sources.map((v, i) => (
                      <option key={i} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <option value="Industrial">Industrial</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Source Name
              </label>

              <select
                name="source_id"
                value={formData.source_id}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold appearance-none"
              >
                {sources.map((v, i) => (
                  <option key={i} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Panel Wattage
              </label>

              <input
                type="text"
                name="panel_wattage"
                value={formData.panel_wattage}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Number of Panels
              </label>

              <input
                type="number"
                name="number_of_panels"
                value={formData.number_of_panels}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Number of Inverters
              </label>

              <input
                type="number"
                name="number_of_inverters"
                value={formData.number_of_inverters}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold"
              />
            </div>

            {/* <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Total Capacity (Watts)
              </label>

              <input
                type="number"
                name="total_capacity"
                value={formData.total_capacity}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold"
              />
            </div> */}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Inverter Capacity
              </label>

              <input
                type="text"
                name="inverter_capacity"
                value={formData.inverter_capacity}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold"
              />
            </div>

            {/* ADDRESS */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Installation Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold resize-none"
              />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold">
              {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-7 py-3 rounded-xl bg-[#1a5695] hover:bg-[#144579] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CustomerMaster = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId, leadId } = location.state || {};

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState(null);
  const [stages, setStages] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);

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
          axios.get(`/api/customers/fetchCustomerStages/${customerId}`, {
            withCredentials: true,
          }),
        ]);
        setLead(lRes.data?.data);
        setStages(sRes.data?.data || []);
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
                    headerAction={
                      <button
                        type="button"
                        onClick={() => setEditModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-[#1a5695] hover:bg-[#1a5695] hover:text-white border border-blue-100 transition-all text-[10px] font-black uppercase tracking-widest"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                    }
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
                        label="Panel Wattage"
                        value={lead?.panel_wattage}
                      />

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
                      <DataField
                        label="Installation Address"
                        value={lead?.address}
                      />
                    </div>
                  </ModuleCard>
                  <NameChangeModule customerId={customerId} />
                  <TechnicalModule customerId={customerId} />
                  <LoanModule customerId={customerId} />
                  <KitModule customerId={customerId} />
                  <DispatchModule customerId={customerId} />
                  <FabricationModule customerId={customerId} />
                  <WiringModule customerId={customerId} />
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl overflow-hidden sticky top-10">
                    <div className="p-8 border-b border-slate-100 bg-[#1a5695] text-white flex justify-between items-center">
                      <h3 className="text-sm font-black uppercase tracking-widest">
                        Project Timeline
                      </h3>
                      <Clock size={20} className="opacity-50" />
                    </div>
                    <div className="p-10 relative">
                      <div className="absolute left-[51px] top-12 bottom-12 w-[2px] bg-slate-100" />
                      {stages.map((stage) => (
                        <div
                          key={stage.id}
                          className="relative flex items-start gap-8 pb-12 last:pb-0"
                        >
                          <div
                            className={`relative z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${stage.status === "done" ? "bg-emerald-500 text-white shadow-lg" : stage.status === "pending" ? "bg-[#1a5695] text-white animate-pulse" : "bg-slate-100 text-slate-300"}`}
                          >
                            {stage.status === "done" ? (
                              <CheckCircle2 size={16} />
                            ) : (
                              <Clock size={16} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-[12px] font-black uppercase tracking-widest mb-3 ${stage.status === "not_used" ? "text-slate-300" : "text-slate-800"}`}
                            >
                              {stage.name}
                            </h4>
                            <div className="flex flex-col gap-2">
                              {stage.started_at && (
                                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 bg-slate-50 self-start px-3 py-1.5 rounded-lg border border-slate-100 uppercase">
                                  <Calendar
                                    size={12}
                                    className="text-blue-50"
                                  />
                                  Started: {formatIST(stage.started_at)}
                                </div>
                              )}
                              {stage.completed_at && (
                                <div className="flex items-center gap-2 text-[9px] font-black text-emerald-600 bg-emerald-50 self-start px-3 py-1.5 rounded-lg border border-emerald-100 uppercase">
                                  <CheckCircle2 size={12} /> Finished:
                                  {formatIST(stage.completed_at)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {editModalOpen && lead && (
          <EditCustomerModal
            lead={lead}
            onClose={() => setEditModalOpen(false)}
            onUpdated={(updatedLead) => {
              setLead((prev) => ({
                ...prev,
                ...updatedLead,
              }));
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerMaster;
