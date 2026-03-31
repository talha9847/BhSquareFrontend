import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Zap,
  CheckCircle2,
  Clock,
  Calendar,
  FileText,
  Save,
  Edit3,
  Settings,
  Eye,
  Activity,
  Landmark,
  Info,
  Banknote,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";

const CustomerMaster = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId, leadId } = location.state || {};
  const apiUrl = import.meta.env.VITE_API_URL;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stages, setStages] = useState([]);
  const [lead, setLead] = useState(null);
  const [docs, setDocs] = useState(null);
  const [loan, setLoan] = useState(null);
  const [editSections, setEditSections] = useState({
    bio: false,
    tech: false,
    loan: false,
  });
  const [formData, setFormData] = useState({});

  const formatIST = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString)
      .toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
  };

  const fetchLoan = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/api/loan/fetchCustomerLoan/${customerId}`,
      );
      if (res.status === 200) {
        setLoan(res.data.data);
      }
    } catch (error) {
      console.error("Loan Fetch Error:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stagesRes, leadRes, docsRes] = await Promise.all([
        axios.get(`${apiUrl}/api/customers/fetchCustomerStages/${customerId}`),
        axios.get(`${apiUrl}/api/leads/fetchLeadById/${leadId}`),
        axios.get(`${apiUrl}/api/docs/fetchCustomerDocuments/${customerId}`),
      ]);
      setStages(stagesRes.data?.data || []);
      setLead(leadRes.data?.data || null);
      setDocs(docsRes.data?.data || null);
      setFormData({ ...leadRes.data?.data, ...docsRes.data?.data });
    } catch (error) {
      console.error("ERP Data Fetch Error:", error);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const [kitData, setKitData] = useState(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchKitData = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/api/kitready/fetchKitItemsbyCustomer/${customerId}`,
      );
      if (res.status === 200) {
        setKitData(res.data.data);
      }
    } catch (error) {
      console.error("Kit Fetch Error:", error);
    }
  };

  useEffect(() => {
    if (!customerId || !leadId) {
      navigate("/customers");
      return;
    }
    fetchData();
    fetchLoan();
    fetchKitData();
  }, [customerId, leadId]);

  const handleToggleEdit = (section) =>
    setEditSections((p) => ({ ...p, [section]: !p[section] }));
  const handleSave = async (section) => {
    console.log(`Saving ${section}...`, formData);
    handleToggleEdit(section);
  };

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
            <div className="flex flex-col items-center justify-center py-40 animate-in fade-in duration-500">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-[#1a5695] rounded-full animate-spin"></div>
                <Zap
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#1a5695] animate-pulse"
                  size={20}
                />
              </div>
              <h2 className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Syncing Profile...
              </h2>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* HEADER SECTION */}
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
                  {/* MODULE 1: BIO */}
                  <ModuleCard
                    title="Customer Bio & Site"
                    icon={<User size={18} />}
                    isEditing={editSections.bio}
                    onEdit={() => handleToggleEdit("bio")}
                    onSave={() => handleSave("bio")}
                    accentColor="text-[#1a5695]"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                      <EditableField
                        label="Full Name"
                        value={lead?.customer_name}
                        isEditing={editSections.bio}
                      />
                      <EditableField
                        label="Phone Number"
                        value={lead?.contact_number}
                        isEditing={editSections.bio}
                      />
                      <EditableField
                        label="System Type"
                        value={lead?.installation_type}
                        isEditing={editSections.bio}
                      />
                      <EditableField
                        label="Total Capacity"
                        value={lead?.total_capacity}
                        isEditing={editSections.bio}
                      />
                      <EditableField
                        label="Installation Address"
                        value={lead?.address}
                        isEditing={editSections.bio}
                        isFull
                      />
                    </div>
                  </ModuleCard>

                  {/* MODULE 2: LOAN REGISTRY */}
                  {loan && (
                    <ModuleCard
                      title="Finance & Loan Registry"
                      icon={<Landmark size={18} />}
                      isEditing={editSections.loan}
                      onEdit={() => handleToggleEdit("loan")}
                      onSave={() => handleSave("loan")}
                      accentColor="text-indigo-600"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 mb-10">
                        <EditableField
                          label="Bank Name"
                          value={loan.bank_name}
                          isEditing={editSections.loan}
                        />
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
                        <EditableField
                          label="Estimated Amount"
                          value={`₹${loan.estimated?.toLocaleString()}`}
                          isEditing={editSections.loan}
                        />
                        <EditableField
                          label="Sanctioned Amount"
                          value={`₹${loan.loan_amount?.toLocaleString()}`}
                          isEditing={editSections.loan}
                        />
                        <EditableField
                          label="Interest Rate"
                          value={`${loan.interest_rate}%`}
                          isEditing={editSections.loan}
                        />
                        <EditableField
                          label="Bank Remarks"
                          value={loan.bank_remarks}
                          isEditing={editSections.loan}
                        />
                      </div>

                      {/* Loan Documents */}
                      {loan.documents?.length > 0 && (
                        <div className="pt-8 border-t border-slate-100">
                          <p className="text-[9px] font-black uppercase tracking-[0.15em] mb-6 text-slate-400 flex items-center gap-2">
                            <Banknote size={14} className="text-indigo-400" />{" "}
                            Loan Specific Documents
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                  <div>
                                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">
                                      {doc.doc_name}
                                    </p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                      {formatIST(doc.created_at)}
                                    </p>
                                  </div>
                                </div>
                                <Eye
                                  size={16}
                                  className="text-slate-300 group-hover:text-indigo-600"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </ModuleCard>
                  )}

                  {/* MODULE 3: TECHNICAL */}
                  {docs && (
                    <ModuleCard
                      title="Technical Registry"
                      icon={<Settings size={18} />}
                      isEditing={editSections.tech}
                      onEdit={() => handleToggleEdit("tech")}
                      onSave={() => handleSave("tech")}
                      accentColor="text-emerald-600"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                        <EditableField
                          label="Consumer Number"
                          value={docs.consumer_number}
                          isEditing={editSections.tech}
                        />
                        <EditableField
                          label="Registration ID"
                          value={docs.registration_number}
                          isEditing={editSections.tech}
                        />
                        <EditableField
                          label="Sub-Division"
                          value={docs.sub_division}
                          isEditing={editSections.tech}
                        />
                        <EditableField
                          label="GPS Coordinates"
                          value={docs.geo_coordinate}
                          isEditing={editSections.tech}
                        />
                      </div>
                    </ModuleCard>
                  )}

                  {/* MODULE 4: DOCUMENTS */}
                  {docs?.files?.length > 0 && (
                    <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm">
                      <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.2em] flex items-center gap-3 mb-10">
                        <FileText size={18} /> Master Vault
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {docs.files.map((file) => (
                          <a
                            key={file.id}
                            href={file.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative flex flex-col p-6 rounded-[32px] bg-slate-50 border-2 border-transparent hover:border-[#1a5695] hover:bg-white transition-all shadow-sm hover:shadow-xl hover:shadow-blue-50"
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
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              Preview
                            </span>
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye size={16} className="text-[#1a5695]" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MODULE: KIT & INVENTORY */}
                  {kitData && (
                    <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm relative transition-all hover:shadow-md">
                      <div className="flex justify-between items-center mb-10">
                        <h3 className="text-[11px] font-black text-[#1a5695] uppercase tracking-[0.2em] flex items-center gap-3">
                          <Zap size={18} /> Kit Readiness & Inventory
                        </h3>
                        <span
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${kitData.status === "done" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          Status: {kitData.status}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {kitData.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 group"
                          >
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#1a5695]">
                                <Settings size={20} />
                              </div>
                              <div>
                                <p className="text-[12px] font-black text-slate-800 uppercase tracking-tight">
                                  {item.item_name}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  Qty: {item.qty} | {item.status}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setShowInventoryModal(true);
                              }}
                              className="p-3 bg-white hover:bg-[#1a5695] text-slate-400 hover:text-white rounded-xl transition-all shadow-sm border border-slate-100"
                            >
                              <Edit3 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN: TIMELINE */}
                <div className="lg:col-span-5">
                  <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden sticky top-10">
                    <div className="p-8 border-b border-slate-100 bg-[#1a5695] text-white flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest">
                          Project Timeline
                        </h3>
                        <p className="text-[9px] font-bold text-blue-200 uppercase mt-1">
                          Live Tracking Enabled
                        </p>
                      </div>
                      <Clock size={20} className="opacity-50" />
                    </div>
                    <div className="p-10 relative">
                      <div className="absolute left-[51px] top-12 bottom-12 w-[2px] bg-slate-100" />
                      {stages.map((stage) => (
                        <div
                          key={stage.id}
                          className="relative flex items-start gap-8 pb-12 last:pb-0 group"
                        >
                          <div
                            className={`relative z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${stage.status === "done" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" : stage.status === "pending" ? "bg-[#1a5695] text-white animate-pulse" : "bg-slate-100 text-slate-300"}`}
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
                                    className="text-blue-500"
                                  />
                                  <span>
                                    Started: {formatIST(stage.started_at)}
                                  </span>
                                </div>
                              )}
                              {stage.completed_at && (
                                <div className="flex items-center gap-2 text-[9px] font-black text-emerald-600 bg-emerald-50 self-start px-3 py-1.5 rounded-lg border border-emerald-100 uppercase">
                                  <CheckCircle2 size={12} />
                                  <span>
                                    Finished: {formatIST(stage.completed_at)}
                                  </span>
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

          {/* INVENTORY EDIT MODAL */}
          {showInventoryModal && selectedItem && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 bg-[#1a5695] text-white flex justify-between items-center">
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">
                      Update Inventory
                    </h2>
                    <p className="text-[10px] text-blue-200 uppercase font-bold mt-1">
                      {selectedItem.item_name}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowInventoryModal(false)}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <Settings size={20} />
                  </button>
                </div>

                <div className="p-10 space-y-8">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 block">
                      Allocated Quantity
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedItem.qty}
                      className="w-full p-5 rounded-[24px] bg-slate-50 border-2 border-slate-100 focus:border-[#1a5695] focus:bg-white outline-none font-black text-slate-800 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 block">
                      Item Status
                    </label>
                    <select className="w-full p-5 rounded-[24px] bg-slate-50 border-2 border-slate-100 focus:border-[#1a5695] focus:bg-white outline-none font-black text-slate-800 transition-all uppercase appearance-none">
                      <option value="allocated">Allocated</option>
                      <option value="pending">Pending</option>
                      <option value="dispatched">Dispatched</option>
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setShowInventoryModal(false)}
                      className="flex-1 py-5 rounded-[24px] bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 py-5 rounded-[24px] bg-[#1a5695] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:scale-[1.02] transition-all"
                      onClick={() => {
                        // Add save logic here
                        setShowInventoryModal(false);
                      }}
                    >
                      Confirm Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const ModuleCard = ({
  title,
  icon,
  children,
  isEditing,
  onEdit,
  onSave,
  accentColor,
}) => (
  <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm relative transition-all hover:shadow-md">
    <div className="flex justify-between items-center mb-10">
      <h3
        className={`text-[11px] font-black ${accentColor} uppercase tracking-[0.2em] flex items-center gap-3`}
      >
        {icon} {title}
      </h3>
      <button
        onClick={isEditing ? onSave : onEdit}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${isEditing ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "bg-slate-50 text-slate-400 hover:text-[#1a5695] hover:bg-blue-50"}`}
      >
        {isEditing ? (
          <>
            <Save size={14} /> Save
          </>
        ) : (
          <>
            <Edit3 size={14} /> Edit
          </>
        )}
      </button>
    </div>
    {children}
  </div>
);

const EditableField = ({ label, value, isEditing, isFull = false }) => (
  <div className={isFull ? "col-span-full" : ""}>
    <p className="text-[9px] font-black uppercase tracking-[0.15em] mb-2 text-slate-400">
      {label}
    </p>
    {isEditing ? (
      <input
        type="text"
        defaultValue={value}
        className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-[#1a5695] focus:bg-white transition-all outline-none font-bold text-sm text-slate-800"
      />
    ) : (
      <p className="text-[13px] font-black uppercase tracking-tight text-slate-800">
        {value || <span className="text-slate-200 tracking-widest">---</span>}
      </p>
    )}
  </div>
);

export default CustomerMaster;
