import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Check,
  Loader2,
  Hammer,
  RotateCcw,
  UserPlus,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";

const Fabrication = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fabricatorName, setFabricatorName] = useState("");

  // Dummy Data for Fabrication Projects
  const [fabrications, setFabrications] = useState([
    {
      id: 1,
      customerName: "JOHN DOE",
      mobile: "9876543210",
      address: "123 Street, Industrial Area",
      fabricatorName: "STEEL WORKS LTD",
    },
    {
      id: 2,
      customerName: "ALICE SMITH",
      mobile: "8877665544",
      address: "Plot 45, Green Valley",
      fabricatorName: "APEX FABRICATORS",
    },
  ]);

  const handleAddFabrication = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API Call
    setTimeout(() => {
      toast.success("Fabrication entry created!");
      setIsModalOpen(false);
      setFabricatorName("");
      setLoading(false);
    }, 1000);
  };

  const handleReturnPipes = (item) => {
    // This action handles adding unused HD pipes back to inventory
    toast.info(`Restocking unused HD pipes for ${item.customerName}`);
    console.log("Redirecting to inventory return for ID:", item.id);
  };

  const filteredItems = fabrications.filter(
    (item) =>
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fabricatorName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Fabrication"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
              Fabrication Management
            </h1>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              <Plus size={16} /> Add Fabrication
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                placeholder="Search by customer or fabricator..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm min-h-[400px] relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      No.
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Customer
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Contact
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Address
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Fabricator
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4 text-xs font-black text-slate-400">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800 text-sm uppercase">
                        {item.customerName}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-600 text-xs">
                        {item.mobile}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs max-w-xs truncate">
                        {item.address}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-black uppercase text-[10px]">
                          {item.fabricatorName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleReturnPipes(item)}
                            title="Return Unused HD Pipes"
                            className="flex items-center gap-1 px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all border border-emerald-100 font-black text-[9px] uppercase tracking-tighter"
                          >
                            <RotateCcw size={14} /> Return Pipes
                          </button>
                          <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all border border-slate-100">
                            <Edit3 size={16} />
                          </button>
                          <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl transition-all border border-slate-100">
                            <Trash2 size={16} />
                          </button>
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

      {/* FABRICATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-[#1a5695] p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  New Project
                </h2>
                <p className="text-white/40 text-[10px] font-bold uppercase mt-1">
                  Assign Fabricator
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddFabrication} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Fabricator Name
                </label>
                <div className="relative mt-1">
                  <input
                    required
                    type="text"
                    placeholder="Search or enter name..."
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white outline-none text-sm font-bold"
                    value={fabricatorName}
                    onChange={(e) =>
                      setFabricatorName(e.target.value.toUpperCase())
                    }
                  />
                  <Hammer
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-900 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Check size={18} /> Create Assignment
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fabrication;
