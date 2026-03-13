import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Phone,
  MapPin,
  X,
  Calculator,
  Bolt,
  LayoutDashboard,
  Compass,
  FolderOpen,
  Box,
  HardHat,
  Wrench,
  Bell,
  Menu,
  Sun,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

// --- SHARED COMPONENTS (Sidebar & Navbar) ---

// --- MAIN LEADS PAGE ---

const Leads = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Capacity logic state
  const [plateWattage, setPlateWattage] = useState(550);
  const [quantity, setQuantity] = useState(10);
  const systemCapacity = (plateWattage * quantity) / 1000;

  const dummyLeads = [
    {
      id: 1,
      name: "Ramanbhai Patel",
      contact: "8733817262",
      location: "Vaskui",
      capacity: "8.32kW",
      source: "Reference",
      status: "New",
    },
    {
      id: 2,
      name: "Suresh Mehta",
      contact: "9822100234",
      location: "Bardoli",
      capacity: "5.50kW",
      source: "Google",
      status: "In-Progress",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Leads"
      />

      <div className="flex-1 lg:ml-64 flex flex-col">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight font-syne">
                Leads Pipeline
              </h1>
              <p className="text-sm text-slate-500">
                Track and convert your solar inquiries
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#1a5695] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-900/20 hover:scale-[1.02] transition-all"
            >
              <Plus size={20} /> Add New Lead
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Client
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    System Size
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dummyLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-sm">
                        {lead.name}
                      </p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin size={10} /> {lead.location}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-[#1a5695] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                        {lead.capacity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {lead.contact}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-50 text-[#f39200] border border-orange-100">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* --- ADD LEAD MODAL --- */}
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
