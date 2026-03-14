import React, { useEffect, useState } from "react";
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
  Loader2,
  File,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Customer = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // MODAL STATES
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [nameChange, setNameChange] = useState("not_used");
  const [toggle, setToggle] = useState(false);

  // Data representing leads that have been converted

  const apiUrl = import.meta.env.VITE_API_URL;

  const [customer, setCustomer] = useState([{}]);
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);

  const getStatusStyle = (status) => {
    if (status === "Done")
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    return "bg-amber-50 text-amber-600 border-amber-100";
  };

  // Logic to handle View Button click
  const handleViewAction = (customer) => {
    if (customer.name_change) {
    }
  };

  // Logic to save edit
  const saveCustomerChanges = async () => {
    try {
      setLoading(true);
      if (id <= 0) {
        toast.error("please select valid customer");
        setIsEditModalOpen(false);
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${apiUrl}/api/customers/updateCustomerNameChange`,
        {
          id: id,
          name_change: nameChange,
        },
      );

      if (res.status == 200) {
        getCust();
        toast.success("Updated....");
        setIsEditModalOpen(false);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Internal server error");
      setIsEditModalOpen(false);
      setLoading(false);
    }
  };

  const getCustomers = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/customers/getCustomers`);
      setCustomer(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getCust = async () => {
    await getCustomers();
  };
  useEffect(() => {
    getCust();
  }, []);

  const filteredCustomers = customer.filter(
    (c) =>
      c.lead?.customer_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      c.lead?.contact_number?.includes(searchQuery),
  );

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
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Total Installed
                </span>
                <span className="text-lg font-black text-[#1a5695]">
                  13.82 kW
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
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
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Site Location
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Name Change
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
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-50 text-[#1a5695] rounded-xl flex items-center justify-center font-black text-xs border border-blue-100 uppercase">
                            {customer.lead.customer_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">
                              {customer.lead.customer_name}
                            </p>
                            <p className="text-slate-400 text-[11px] font-medium">
                              {customer.lead.contact_number}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                          <MapPin size={12} className="text-slate-300" />
                          <span>{customer.lead.address}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {customer.name_change === "required" && (
                          <span className="flex items-center gap-1 text-amber-600 text-[10px] font-black uppercase">
                            <AlertCircle size={12} /> Required
                          </span>
                        )}

                        {customer.name_change === "changed" && (
                          <span className="text-blue-700 text-[10px] font-bold uppercase">
                            Changed
                          </span>
                        )}

                        {customer.name_change === "unchanged" && (
                          <span className="text-green-700 text-[10px] font-bold uppercase">
                            Unchanged
                          </span>
                        )}

                        {customer.name_change === "not_used" && (
                          <span className="text-gray-500 text-[10px] font-bold uppercase italic">
                            Not Used
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[#1a5695] font-black text-sm">
                          <Zap size={14} className="fill-[#1a5695]" />
                          {(customer.lead.total_capacity / 1000).toFixed(2)} Kw
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase ${getStatusStyle(customer.status)}`}
                        >
                          {customer.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {customer.name_change == "not_used" && (
                            <button
                              onClick={() => {
                                setNameChange("unchanged");
                                setIsEditModalOpen(true);
                                setId(customer.id);
                              }}
                              className="p-2 bg-slate-50 text-slate-400 hover:text-[#1a5695] hover:bg-blue-50 rounded-xl transition-all border border-slate-100"
                            >
                              <Edit3 size={16} />
                            </button>
                          )}
                          {customer.name_change == "required" && (
                            <button
                              onClick={() => {
                                navigate("/namechange", {
                                  state: { customerId: customer.id },
                                });
                              }}
                              className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-[11px] hover:bg-[#1a5695] hover:text-white transition-all border border-slate-200 flex items-center gap-2 group-hover:shadow-md"
                            >
                              <File size={14} /> Name Change
                            </button>
                          )}

                          {(customer.name_change == "changed" ||
                            customer.name_change == "unchanged") && (
                            <button
                              onClick={() => {
                                navigate("/documentcollection", {
                                  state: { customerId: customer.id },
                                });
                              }}
                              className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-[11px] hover:bg-[#1a5695] hover:text-white transition-all border border-slate-200 flex items-center gap-2 group-hover:shadow-md"
                            >
                              <Eye size={14} /> Collect Docs
                            </button>
                          )}
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
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            {/* HEADER */}
            <div className="bg-[#1a5695] p-6 text-white flex justify-between items-center px-8">
              <h2 className="text-xl font-black font-syne uppercase tracking-tight">
                Update Record
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="hover:rotate-90 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                {/* NAME CHANGE TOGGLE BOX */}
                <div
                  className={`p-5 rounded-3xl border transition-all ${
                    nameChange === "required"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${
                          nameChange === "required"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        <FileText size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-800">
                          Name Change Case
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (toggle) {
                          setToggle(false);
                          setNameChange("unchanged");
                        } else {
                          setNameChange("required");
                          setToggle(true);
                        }
                      }}
                      className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${
                        toggle
                          ? "bg-emerald-500 justify-end"
                          : "bg-slate-300 justify-start"
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                </div>

                {/* SAVE BUTTON */}
                <button
                  onClick={saveCustomerChanges}
                  className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black shadow-lg shadow-blue-900/20 hover:bg-[#15467a] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" /> Saving....
                    </>
                  ) : (
                    <>
                      <Check size={18} /> Save Customer Changesr{" "}
                    </>
                  )}
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
