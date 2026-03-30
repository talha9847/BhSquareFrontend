import React, { useEffect, useState } from "react";
import { data, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  Zap,
  Package,
  Truck,
  Wrench,
  CheckCircle2,
  Clock,
  Calendar,
  CreditCard,
  FileText,
  Save,
  Edit3,
  Settings,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";

const CustomerMaster = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId } = location.state;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchStages = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/api/customers/fetchCustomerStages/${customerId}`,
      );
      if (res.status == 200) {
        setStages(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!customerId) {
      navigate("/customers");
    }
    fetchStages();
  }, [customerId, navigate]);

  const [stages, setStages] = useState([]);
  // FULL STATE WITH EVERY STAGE AND FIELD
  const [masterData, setMasterData] = useState({
    customer: {
      name: "Talha Malek",
      contact: "+91 98765 43210",
      address: "Surat, Gujarat, India",
      status: "Active",
      installation_type: "Residential",
      capacity: "5.50 kWp",
    },
    technical: {
      panels: "12 x 450W (Mono Perc)",
      inverter: "5kW Hybrid (Solis)",
      consumer_no: "1200054321",
      reg_no: "REG-2026-0045",
    },
    loan: {
      bank: "HDFC Bank",
      amount: "2,50,000",
      status: "Disbursed",
      interest: "8.5%",
    },
    // COMPREHENSIVE STAGES
    stages: [
      {
        id: 1,
        name: "Customer Onboarding",
        status: "done",
        started_at: "2026-03-01 09:00",
        completed_at: "2026-03-01 11:30",
        note: "Lead converted",
      },
      {
        id: 2,
        name: "Name Change Process",
        status: "done",
        started_at: "2026-03-02 10:00",
        completed_at: "2026-03-03 16:00",
        note: "RTO docs verified",
      },
      {
        id: 3,
        name: "Registration",
        status: "done",
        started_at: "2026-03-05 11:00",
        completed_at: "2026-03-06 12:00",
        note: "Application submitted",
      },
      {
        id: 4,
        name: "Loan Approval",
        status: "done",
        started_at: "2026-03-07 09:30",
        completed_at: "2026-03-10 14:00",
        note: "HDFC approved",
      },
      {
        id: 5,
        name: "Kit Ready",
        status: "done",
        started_at: "2026-03-12 10:00",
        completed_at: "2026-03-13 18:00",
        note: "All items picked",
      },
      {
        id: 6,
        name: "Fabrication",
        status: "pending",
        started_at: "2026-03-15 08:00",
        completed_at: null,
        note: "Frame structure in progress",
      },
      {
        id: 7,
        name: "Wiring",
        status: "waiting",
        started_at: null,
        completed_at: null,
        note: "",
      },
      {
        id: 8,
        name: "Final Inspection",
        status: "waiting",
        started_at: null,
        completed_at: null,
        note: "",
      },
      {
        id: 9,
        name: "Redeem/Handover",
        status: "waiting",
        started_at: null,
        completed_at: null,
        note: "",
      },
    ],
  });

  // Handle nested state updates
  const handleInputChange = (section, field, value) => {
    setMasterData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saving Master Data:", masterData);
    alert("Data updated successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Customers"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8 max-w-[1600px] mx-auto w-full">
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-[#1a5695] text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
                  ID: {customerId}
                </span>
                <span
                  className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest border ${isEditing ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"}`}
                >
                  {isEditing ? "Edit Mode Active" : "Live View"}
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase leading-none">
                {masterData.customer.name}
              </h1>
            </div>

            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-2xl text-[11px] font-black uppercase text-slate-700 hover:border-[#1a5695] hover:text-[#1a5695] transition-all shadow-sm"
                >
                  <Edit3 size={16} /> Edit All Data
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 rounded-2xl text-[11px] font-black uppercase text-white hover:bg-emerald-700 transition-all shadow-lg"
                >
                  <Save size={16} /> Save Changes
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: DATA TABLES */}
            <div className="lg:col-span-7 space-y-6">
              {/* CUSTOMER PROFILE */}
              <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <User size={80} />
                </div>
                <h3 className="text-[11px] font-black text-[#1a5695] uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <User size={16} /> Customer Table & Bio
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                  <EditableField
                    label="Full Name"
                    section="customer"
                    field="name"
                    value={masterData.customer.name}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <EditableField
                    label="Contact Info"
                    section="customer"
                    field="contact"
                    value={masterData.customer.contact}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <EditableField
                    label="Installation Type"
                    section="customer"
                    field="installation_type"
                    value={masterData.customer.installation_type}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <EditableField
                    label="System Capacity"
                    section="customer"
                    field="capacity"
                    value={masterData.customer.capacity}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <EditableField
                    label="Site Address"
                    section="customer"
                    field="address"
                    value={masterData.customer.address}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    isFull
                  />
                </div>
              </div>

              {/* TECHNICAL STAGE DETAILS */}
              <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
                <h3 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <Settings size={16} /> Technical & Registration Info
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                  <EditableField
                    label="Panel Specs"
                    section="technical"
                    field="panels"
                    value={masterData.technical.panels}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <EditableField
                    label="Inverter Model"
                    section="technical"
                    field="inverter"
                    value={masterData.technical.inverter}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <EditableField
                    label="Consumer Number"
                    section="technical"
                    field="consumer_no"
                    value={masterData.technical.consumer_no}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <EditableField
                    label="RTO Registration"
                    section="technical"
                    field="reg_no"
                    value={masterData.technical.reg_no}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* FINANCIAL CARD */}
              <div className="bg-[#1a5695] rounded-[40px] p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <CreditCard size={100} />
                </div>
                <h3 className="text-[11px] font-black text-blue-200 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <CreditCard size={16} /> Loan & Financial Stage
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <EditableField
                    label="Lending Bank"
                    section="loan"
                    field="bank"
                    value={masterData.loan.bank}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    dark
                  />
                  <EditableField
                    label="Loan Amount"
                    section="loan"
                    field="amount"
                    value={masterData.loan.amount}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    dark
                  />
                  <EditableField
                    label="Interest Rate"
                    section="loan"
                    field="interest"
                    value={masterData.loan.interest}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    dark
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: THE COMPREHENSIVE TIMELINE */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden sticky top-8">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <div>
                    <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-[0.1em]">
                      Project Stages
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                      Live from ERP 2.0
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-[#1a5695] shadow-sm">
                    <Clock size={18} />
                  </div>
                </div>

                <div className="p-10 space-y-0 relative">
                  {/* Vertical Progress Bar */}
                  <div className="absolute left-[51px] top-12 bottom-12 w-[3px] bg-slate-100" />

                  {stages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className="relative flex items-start gap-8 pb-10 last:pb-0 group"
                    >
                      {/* Circle Icon */}
                      <div
                        className={`relative z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-md ${
                          stage.status === "done"
                            ? "bg-emerald-500 text-white shadow-emerald-100"
                            : stage.status === "pending"
                              ? "bg-[#1a5695] text-white animate-pulse"
                              : "bg-slate-50 border-2 border-slate-100 text-slate-300"
                        }`}
                      >
                        {stage.status === "done" ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <Clock size={16} />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col mb-2">
                          <h4
                            className={`text-[12px] font-black uppercase tracking-widest ${stage.status === "not_used" ? "text-slate-300" : "text-slate-800"}`}
                          >
                            {stage.name}
                          </h4>

                          {/* DATE TRACKING (Started & Completed) */}
                          <div className="flex flex-wrap gap-x-4 mt-2">
                            {stage.started_at && (
                              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                                <Calendar size={10} className="text-blue-400" />
                                STARTED:{" "}
                                <span className="text-slate-600">
                                  {stage.started_at}
                                </span>
                              </div>
                            )}
                            {stage.completed_at && (
                              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                                <CheckCircle2
                                  size={10}
                                  className="text-emerald-500"
                                />
                                FINISHED:{" "}
                                <span className="text-slate-600">
                                  {stage.completed_at}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {stage.note && (
                          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                            <p className="text-[10px] font-medium text-slate-500 italic">
                              "{stage.note}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// COMPACT REUSABLE INPUT COMPONENT
const EditableField = ({
  label,
  section,
  field,
  value,
  isEditing,
  onChange,
  isFull = false,
  dark = false,
}) => (
  <div className={isFull ? "col-span-full" : ""}>
    <p
      className={`text-[9px] font-black uppercase tracking-widest mb-2 ${dark ? "text-blue-200" : "text-slate-400"}`}
    >
      {label}
    </p>
    {isEditing ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(section, field, e.target.value)}
        className={`w-full p-3 rounded-xl border-2 transition-all outline-none font-bold text-sm ${
          dark
            ? "bg-white/10 border-white/20 text-white focus:bg-white focus:text-slate-900"
            : "bg-slate-50 border-slate-100 focus:border-[#1a5695] text-slate-800"
        }`}
      />
    ) : (
      <p
        className={`text-sm font-black uppercase tracking-tight ${dark ? "text-white" : "text-slate-800"}`}
      >
        {value || "---"}
      </p>
    )}
  </div>
);

export default CustomerMaster;
