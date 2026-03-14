import React, { useEffect, useState } from "react";
import {
  Save,
  User,
  Phone,
  MapPin,
  Zap,
  Hash,
  Globe,
  ClipboardCheck,
  FileText,
  Plus,
  Trash2,
  Upload,
  ArrowLeft,
  Navigation,
  X,
  Check,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import axios from "axios";

const DocumentCollection = () => {
  const location = useLocation();

  const { customerId } = location.state || {};
  console.log(customerId);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // New State for "Add Item" inline input
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [leadsData, setLeadsData] = useState({});
  const apiUrl = import.meta.env.VITE_API_URL;

  const getLeadsData = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/api/docs/getLeadDetailFromCustomerId/${customerId}`,
      );

      if (res.status == 200) {
        setLeadsData(res.data.data);
        console.log(res.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getLeadsData();
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    address: "",
    capacity: "",
    consumerNumber: "",
    geoCoords: "",
    subDivision: "",
    regId: "",
    documents: [
      { id: 1, name: "Aadhar Card" },
      { id: 2, name: "Vera Bill" },
      { id: 3, name: "Bank Passbook" },
      { id: 4, name: "Light Bill" },
    ],
  });

  const confirmAddDoc = () => {
    if (newDocName.trim()) {
      setFormData({
        ...formData,
        documents: [
          ...formData.documents,
          { id: Date.now(), name: newDocName },
        ],
      });
      setNewDocName("");
      setIsAddingDoc(false);
    }
  };

  const removeDoc = (id) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((doc) => doc.id !== id),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-syne">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Customers"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">
              Convert to Customer
            </h1>
          </div>
          <button className="bg-[#1a5695] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-[#15467a] transition-all shadow-lg shadow-blue-900/20 active:scale-95">
            <Save size={18} /> Save Customer Profile
          </button>
        </nav>

        <main className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <User size={14} className="text-[#1a5695]" /> Lead Identity
                </h2>
                <div className="space-y-5">
                  <CustomInput
                    label="Full Name"
                    placeholder="Enter name"
                    value={leadsData.customer_name}
                    onChange={(v) => setFormData({ ...formData, name: v })}
                  />
                  <CustomInput
                    label="Contact"
                    placeholder="+91..."
                    icon={<Phone size={14} />}
                    value={leadsData.contact_number}
                    onChange={(v) => setFormData({ ...formData, number: v })}
                  />
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                      Site Address
                    </label>
                    <textarea
                      placeholder="Enter site location"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 min-h-[100px] outline-none focus:bg-white focus:border-[#1a5695] transition-all"
                      value={leadsData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Zap size={14} className="text-[#1a5695]" /> System Details
                </h2>
                <div className="space-y-5">
                  <CustomInput
                    label="Capacity (kW)"
                    placeholder="e.g. 8.32"
                    icon={<Zap size={14} />}
                    value={formData.capacity}
                    onChange={(v) => setFormData({ ...formData, capacity: v })}
                  />
                  <CustomInput
                    label="Consumer Number"
                    placeholder="11 Digit No."
                    icon={<Hash size={14} />}
                    value={formData.consumerNumber}
                    onChange={(v) =>
                      setFormData({ ...formData, consumerNumber: v })
                    }
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <ClipboardCheck size={14} className="text-[#1a5695]" />{" "}
                  Registration Info
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput
                    label="Geo Coordinates"
                    placeholder="21.1702° N..."
                    icon={<Globe size={16} />}
                    value={formData.geoCoords}
                    onChange={(v) => setFormData({ ...formData, geoCoords: v })}
                  />
                  <CustomInput
                    label="Sub Division"
                    placeholder="e.g. Surat West"
                    icon={<Navigation size={16} />}
                    value={formData.subDivision}
                    onChange={(v) =>
                      setFormData({ ...formData, subDivision: v })
                    }
                  />
                  <div className="md:col-span-2">
                    <CustomInput
                      label="Registration ID"
                      placeholder="Enter ID"
                      value={formData.regId}
                      onChange={(v) => setFormData({ ...formData, regId: v })}
                    />
                  </div>
                </div>
              </div>

              {/* DOCUMENT SECTION */}
              <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} className="text-[#1a5695]" />{" "}
                    Documentation
                  </h2>
                  {!isAddingDoc && (
                    <button
                      onClick={() => setIsAddingDoc(true)}
                      className="text-[10px] font-black uppercase text-[#1a5695] bg-blue-50 px-4 py-2 rounded-xl hover:bg-[#1a5695] hover:text-white transition-all flex items-center gap-2"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* INLINE ADDING INPUT */}
                  {isAddingDoc && (
                    <div className="p-6 border-2 border-[#1a5695] border-dashed rounded-[28px] bg-blue-50/50 flex flex-col justify-between h-40 animate-in zoom-in duration-200">
                      <p className="text-[10px] font-black text-[#1a5695] uppercase tracking-tighter">
                        New Document Name
                      </p>
                      <input
                        autoFocus
                        type="text"
                        placeholder="e.g. Marriage Certificate"
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                        className="bg-transparent border-b border-[#1a5695] outline-none py-1 font-bold text-sm text-slate-700"
                        onKeyDown={(e) => e.key === "Enter" && confirmAddDoc()}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setIsAddingDoc(false)}
                          className="p-2 text-slate-400 hover:text-rose-500"
                        >
                          <X size={18} />
                        </button>
                        <button
                          onClick={confirmAddDoc}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        >
                          <Check size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {formData.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="group relative p-6 border-2 border-dashed border-slate-100 rounded-[28px] hover:border-[#1a5695] hover:bg-blue-50/30 transition-all bg-slate-50/50 flex flex-col items-center justify-center text-center h-40"
                    >
                      <div className="flex justify-between items-center absolute top-4 w-full px-6">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight group-hover:text-[#1a5695]">
                          {doc.name}
                        </span>
                        <button
                          onClick={() => removeDoc(doc.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <label className="flex flex-col items-center justify-center cursor-pointer w-full mt-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm mb-2 text-slate-300 group-hover:text-[#1a5695] group-hover:scale-110 transition-all">
                          <Upload size={20} />
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          Click to Upload
                        </span>
                        <input type="file" className="hidden" />
                      </label>
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

const CustomInput = ({ label, placeholder, icon, value, onChange }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wide">
      {label}
    </label>
    <div className="relative flex items-center">
      {icon && <div className="absolute left-4 text-slate-300">{icon}</div>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${icon ? "pl-11" : "px-4"} py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#1a5695] transition-all placeholder:font-medium placeholder:text-slate-300`}
      />
    </div>
  </div>
);

export default DocumentCollection;
