
import React, { useState } from "react";
import {
  Users, Plus, MapPin, X, Calculator, MoreVertical, 
  Phone, Search, UserCheck, ArrowRightLeft, CheckCircle2 
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Leads = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal for Conversion
  const [conversionModal, setConversionModal] = useState({ open: false, lead: null });

  // Capacity logic
  const [plateWattage, setPlateWattage] = useState(550);
  const [quantity, setQuantity] = useState(10);
  const systemCapacity = (plateWattage * quantity) / 1000;

  const [leads, setLeads] = useState([
    { id: 1, name: "Ramanbhai Patel", number: "+91 87338 17262", address: "Vaskui, Mahuva", source: "Reference", capacity: "8.32 kW" },
    { id: 2, name: "Suresh Mehta", number: "+91 98221 00234", address: "Adajan, Surat", source: "Google", capacity: "5.50 kW" },
    { id: 3, name: "Anita Desai", number: "+91 70445 99122", address: "Bardoli, GJ", source: "Social Media", capacity: "12.00 kW" },
  ]);

  // Filter Logic
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lead.number.includes(searchQuery)
  );

  const handleConvert = (lead) => {
    setConversionModal({ open: true, lead });
  };

  const confirmConversion = () => {
    // Logic: Remove from leads, perhaps move to a "Customers" state/API call
    setLeads(leads.filter(l => l.id !== conversionModal.lead.id));
    setConversionModal({ open: false, lead: null });
    alert("Lead converted to Customer successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} activePage="Leads" />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight font-syne uppercase">Leads Pipeline</h1>
              <p className="text-sm text-slate-500">Search and manage your potential solar installations</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 bg-[#1a5695] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-900/20 hover:bg-[#15467a] transition-all active:scale-95">
              <Plus size={20} /> Add New Lead
            </button>
          </div>

          {/* Search Bar UI */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search leads by name or contact number..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#1a5695] outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="hidden md:flex gap-2">
                <button className="px-4 py-3 bg-slate-50 text-slate-500 rounded-2xl font-bold text-xs border border-slate-100 hover:bg-slate-100 transition-colors uppercase">Recent</button>
                <button className="px-4 py-3 bg-slate-50 text-slate-500 rounded-2xl font-bold text-xs border border-slate-100 hover:bg-slate-100 transition-colors uppercase">High Capacity</button>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Client</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Location</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Source</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Capacity</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 text-sm">{lead.name}</p>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5"><Phone size={10} /> {lead.number}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {lead.address}</span>
                      </td>
                      <td className="px-6 py-4"><span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-tight">{lead.source}</span></td>
                      <td className="px-6 py-4"><span className="text-sm font-black text-[#1a5695]">{lead.capacity}</span></td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           {/* CONVERSION BUTTON */}
                            <button 
                                onClick={() => handleConvert(lead)}
                                className="p-2 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center gap-2 px-3"
                                title="Convert to Customer"
                            >
                                <ArrowRightLeft size={16} />
                                <span className="text-[10px] font-bold uppercase">Convert</span>
                            </button>
                            <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* --- CONVERT TO CUSTOMER MODAL --- */}
      {conversionModal.open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden p-8 text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserCheck size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 font-syne mb-2">Lead Ready for Solar?</h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                You are about to convert <span className="font-bold text-slate-800 font-syne uppercase tracking-tight">{conversionModal.lead?.name}</span> into a permanent customer. This will move them to the Document Collection stage.
            </p>
            
            <div className="bg-slate-50 rounded-3xl p-4 mb-8 border border-slate-100 flex justify-between items-center px-6">
                <div className="text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Planned Capacity</p>
                    <p className="text-lg font-black text-[#1a5695]">{conversionModal.lead?.capacity}</p>
                </div>
                <CheckCircle2 size={32} className="text-[#f39200]" />
            </div>

            <div className="flex flex-col gap-3">
                <button onClick={confirmConversion} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
                    Yes, Move to Customers
                </button>
                <button onClick={() => setConversionModal({ open: false, lead: null })} className="w-full py-4 text-slate-400 font-bold hover:text-slate-600">
                    Wait, Not Yet
                </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD LEAD MODAL (same logic as before) --- */}
      {/* ... */}

        {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#1a5695] p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users size={20} />
                </div>
                <h2 className="text-xl font-bold font-syne">Create New Lead</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-white/10 p-2 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <form
              className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                placeholder="Customer Name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#1a5695] outline-none transition-all"
              />
              <input
                placeholder="Contact Number"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#1a5695] outline-none transition-all"
              />
              <div className="md:col-span-2">
                <textarea
                  placeholder="Full Address..."
                  rows="2"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#1a5695] outline-none transition-all resize-none"
                ></textarea>
              </div>

              <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none">
                <option>Residential</option>
                <option>Commercial</option>
              </select>
              <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none">
                <option>Google Source</option>
                <option>Reference</option>
              </select>

              {/* Calculator Panel */}
              <div className="md:col-span-2 bg-blue-50/50 p-5 rounded-3xl border border-blue-100">
                <div className="flex items-center gap-2 mb-4 text-[#1a5695] font-bold text-xs uppercase tracking-wider">
                  <Calculator size={14} /> Capacity Estimator
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 ml-1">
                      Plate Wattage (W)
                    </label>
                    <input
                      type="number"
                      value={plateWattage}
                      onChange={(e) => setPlateWattage(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 ml-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                    />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-100 flex justify-between items-center px-1">
                  <span className="text-xs font-bold text-slate-500">
                    System Size
                  </span>
                  <span className="text-xl font-black text-[#1a5695]">
                    {systemCapacity.toFixed(2)} kW
                  </span>
                </div>
              </div>

              <div className="md:col-span-2 flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-400 bg-slate-50 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-6 py-4 rounded-2xl font-bold text-white bg-[#f39200] hover:bg-[#d98300] shadow-lg shadow-orange-500/20 transition-all"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;