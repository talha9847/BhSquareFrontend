import React, { useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Eye,
  Zap,
  Filter,
  Edit3,
  X,
  FileText,
  AlertCircle,
  Check,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Customer = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // MODAL STATES
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Data representing leads that have been converted
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Ramanbhai Patel",
      number: "+91 87338 17262",
      address: "Vaskui, Mahuva",
      capacity: "8.32 kW",
      date: "01-01-2026",
      status: "Done",
      hasNameChange: false, // Default is false
    },
    {
      id: 2,
      name: "Suresh Mehta",
      number: "+91 98221 00234",
      address: "Adajan, Surat",
      capacity: "5.50 kW",
      date: "15-02-2026",
      status: "Pending",
      hasNameChange: true, // Example existing case
    },
  ]);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.number.includes(searchQuery)
  );

  const getStatusStyle = (status) => {
    if (status === "Done") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    return "bg-amber-50 text-amber-600 border-amber-100";
  };

  // Logic to handle View Button click
  const handleViewAction = (customer) => {
    if (customer.hasNameChange) {
      // Logic for Name Change Page
      alert(`Redirecting to Name Change Documentation for ${customer.name}`);
    } else {
      // Logic for Normal Profile
      alert(`Viewing standard profile for ${customer.name}`);
    }
  };

  // Logic to save edit
  const saveCustomerChanges = () => {
    setCustomers(customers.map(c => 
      c.id === editingCustomer.id ? editingCustomer : c
    ));
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Customers"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight font-syne uppercase">
                Active Customers
              </h1>
              <p className="text-sm text-slate-500">
                Onboarded clients and installation progress
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 flex items-center gap-2 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Installed</span>
                <span className="text-lg font-black text-[#1a5695]">13.82 kW</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or consumer number..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#1a5695] outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="hidden md:flex items-center gap-2 px-4 py-3 bg-slate-50 text-slate-500 rounded-2xl font-bold text-xs border border-slate-100 hover:bg-slate-100 transition-colors uppercase">
              <Filter size={14} /> Filter Status
            </button>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="bg-slate-50/50">
                  <tr className="whitespace-nowrap">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Site Location</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Name Change</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Capacity</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-50 text-[#1a5695] rounded-xl flex items-center justify-center font-black text-xs border border-blue-100 uppercase">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{customer.name}</p>
                            <p className="text-slate-400 text-[11px] font-medium">{customer.number}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                          <MapPin size={12} className="text-slate-300" />
                          <span>{customer.address}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                         {customer.hasNameChange ? (
                           <span className="flex items-center gap-1 text-amber-600 text-[10px] font-black uppercase">
                             <AlertCircle size={12} /> Required
                           </span>
                         ) : (
                           <span className="text-green-800 text-[10px] font-bold uppercase italic">No Change</span>
                         )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[#1a5695] font-black text-sm">
                          <Zap size={14} className="fill-[#1a5695]" />
                          {customer.capacity}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase ${getStatusStyle(customer.status)}`}>
                          {customer.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {setEditingCustomer({...customer}); setIsEditModalOpen(true);}}
                            className="p-2 bg-slate-50 text-slate-400 hover:text-[#1a5695] hover:bg-blue-50 rounded-xl transition-all border border-slate-100"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleViewAction(customer)}
                            className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-[11px] hover:bg-[#1a5695] hover:text-white transition-all border border-slate-200 flex items-center gap-2 group-hover:shadow-md"
                          >
                            <Eye size={14} /> {customer.hasNameChange ? "View Documents" : "View Profile"}
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

      {/* EDIT MODAL */}
      {isEditModalOpen && editingCustomer && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-[#1a5695] p-6 text-white flex justify-between items-center px-8">
              <h2 className="text-xl font-black font-syne uppercase tracking-tight">Update Record</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="hover:rotate-90 transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                {/* NAME FIELD */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Customer Name</label>
                  <input 
                    type="text"
                    value={editingCustomer.name}
                    onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                    className="w-full mt-1 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1a5695] outline-none font-bold text-slate-700"
                  />
                </div>

                {/* NAME CHANGE TOGGLE BOX */}
                <div className={`p-5 rounded-3xl border transition-all ${editingCustomer.hasNameChange ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${editingCustomer.hasNameChange ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'}`}>
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">Name Change Case</p>
                        <p className="text-[10px] text-slate-500 font-medium italic">Different name on Light Bill</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setEditingCustomer({...editingCustomer, hasNameChange: !editingCustomer.hasNameChange})}
                      className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${editingCustomer.hasNameChange ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                  
                  {editingCustomer.hasNameChange && (
                    <div className="mt-4 flex gap-2 text-amber-700">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <p className="text-[10px] font-bold leading-tight">Saving this will enable the Name Change Document workflow for this client.</p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={saveCustomerChanges}
                  className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black shadow-lg shadow-blue-900/20 hover:bg-[#15467a] transition-all flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Save Customer Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;