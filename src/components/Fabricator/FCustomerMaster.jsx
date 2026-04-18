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

// --- FEATURE MODULES ---

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

const FCustomerMaster = () => {
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
                  <TechnicalModule customerId={customerId} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FCustomerMaster;
