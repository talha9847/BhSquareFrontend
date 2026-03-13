import React, { useState } from "react";
import {
  Send,
  X,
  Hash,
  Globe,
  Navigation,
  CheckCircle,
  MapPin,
  Zap,
  Phone,
  Calendar,
  User,
  FileText,
  Stamp,
  PenTool,
  FileCheck,
  QrCode,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Registration = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Example data
  const [queue] = useState([
    {
      id: 1,
      name: "Ramanbhai Patel",
      address: "Vaskui, Mahuva",
      capacity: "8.32 kW",
      number: "+91 87338 17262",
      regStatus: "Pending",
    },
  ]);

  const openRegistrationModal = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-syne">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Registration"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                Portal Registration
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Manage government portal entries and file tracking
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Location
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Capacity
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {queue.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-all"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 text-sm">
                          {item.name}
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          {item.number}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {item.address}
                      </td>
                      <td className="px-6 py-4 font-black text-[#1a5695] text-sm">
                        {item.capacity}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase border bg-amber-50 text-amber-600 border-amber-100">
                          {item.regStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openRegistrationModal(item)}
                          className="bg-[#1a5695] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase hover:bg-blue-800 transition-all flex items-center gap-2 ml-auto shadow-lg shadow-blue-900/10"
                        >
                          <Send size={14} /> Process
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* REGISTRATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#1a5695] p-6 md:p-8 text-white flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  System Registration
                </h2>
                <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">
                  Portal Entry & Physical File Tracking
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:rotate-90 transition-all p-2 bg-white/10 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-8 overflow-y-auto space-y-8">
              {/* SECTION 1: BENEFICIARY & PORTAL INFO */}
              <div>
                <h3 className="text-[10px] font-black text-[#1a5695] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <User size={14} /> Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ModalInput
                    label="Full Beneficiary Name"
                    placeholder="As per Light Bill"
                    icon={<User size={16} />}
                  />
                  <ModalInput
                    label="Application Number"
                    placeholder="Portal App ID"
                    icon={<Hash size={16} />}
                  />
                  <ModalInput
                    label="Registration Date"
                    type="date"
                    icon={<Calendar size={16} />}
                  />
                  <ModalInput
                    label="Installation Capacity"
                    placeholder="e.g. 5.50 kW"
                    icon={<Zap size={16} />}
                  />
                  <div className="md:col-span-2">
                    <ModalInput
                      label="Full Site Address"
                      placeholder="Enter complete address for portal"
                      icon={<MapPin size={16} />}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: GEO LOCATION */}
              <div>
                <h3 className="text-[10px] font-black text-[#1a5695] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Globe size={14} /> Site Geo-Tagging
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ModalInput
                    label="Latitude"
                    placeholder="21.1702"
                    icon={<Navigation size={16} />}
                  />
                  <ModalInput
                    label="Longitude"
                    placeholder="72.8311"
                    icon={<Navigation size={16} />}
                  />
                </div>
              </div>

              {/* SECTION 3: FILE TRACKING (TOGGLES) */}
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <FileCheck size={14} /> File Processing Checklist
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <ToggleItem label="Stamp Order" icon={<Stamp size={18} />} />
                  <ToggleItem
                    label="File Generation"
                    icon={<FileText size={18} />}
                  />
                  <ToggleItem
                    label="File Signed"
                    icon={<PenTool size={18} />}
                  />
                  <ToggleItem
                    label="File Scanned"
                    icon={<QrCode size={18} />}
                  />
                </div>
              </div>

              {/* FOOTER ACTION */}
              <div className="pt-4">
                <button className="w-full py-5 bg-[#1a5695] text-white rounded-[24px] font-black shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
                  <CheckCircle size={20} /> Complete Portal Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// HELPER COMPONENTS
const ModalInput = ({ label, placeholder, icon, type = "text" }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-[#1a5695] transition-all font-bold text-slate-700 text-sm"
      />
    </div>
  </div>
);

const ToggleItem = ({ label, icon }) => {
  const [active, setActive] = useState(false);
  return (
    <button
      onClick={() => setActive(!active)}
      className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all group ${
        active
          ? "bg-[#1a5695] border-[#1a5695] text-white shadow-lg shadow-blue-900/20"
          : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
      }`}
    >
      <div
        className={`${active ? "text-white" : "text-slate-300 group-hover:text-[#1a5695]"} transition-colors`}
      >
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-none">
        {label}
      </span>
      <div
        className={`w-8 h-4 rounded-full flex items-center px-1 transition-all ${active ? "bg-white/20 justify-end" : "bg-slate-100 justify-start"}`}
      >
        <div
          className={`w-2 h-2 rounded-full ${active ? "bg-white" : "bg-slate-300"}`}
        />
      </div>
    </button>
  );
};

export default Registration;
