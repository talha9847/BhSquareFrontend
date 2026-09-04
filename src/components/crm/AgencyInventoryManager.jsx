import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Building2,
  Package,
  X,
  Loader2,
  Save,
  Eye,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AgencyInventoryManager = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    agency_id: "",
    inventory_id: "",
    qty: "",
    note: "",
  });

  // --------------------------------------------------
  // GET AGENCIES
  // --------------------------------------------------

  const getAllAgencies = async () => {
    try {
      const res = await axios.get(`/api/estimation/getAllAgencies`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setAgencies(res.data.data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load agencies");
    }
  };

  // --------------------------------------------------
  // GET INVENTORY
  // --------------------------------------------------

  const getAllInventory = async () => {
    try {
      const res = await axios.get(`/api/kitready/getAllInventory`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setInventory(res.data.data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load inventory");
    }
  };

  // --------------------------------------------------
  // GET AGENCY INVENTORY TRANSACTIONS
  // --------------------------------------------------

  const getAllAgencyInventory = async () => {
    setTableLoading(true);

    try {
      const res = await axios.get(`/api/estimation/getAllAgencyInventory`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setTransactions(res.data.data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load agency inventory");
    } finally {
      setTableLoading(false);
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    getAllAgencies();
    getAllInventory();
    getAllAgencyInventory();
  }, []);

  // --------------------------------------------------
  // OPEN CREATE MODAL
  // --------------------------------------------------

  const openCreateModal = () => {
    setFormData({
      agency_id: "",
      inventory_id: "",
      qty: "",
      note: "",
    });

    setIsModalOpen(true);
  };

  // --------------------------------------------------
  // CREATE AGENCY INVENTORY
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agency_id) {
      toast.error("Please select agency");
      return;
    }

    if (!formData.inventory_id) {
      toast.error("Please select inventory");
      return;
    }

    if (!formData.qty || Number(formData.qty) <= 0) {
      toast.error("Please enter valid quantity");
      return;
    }

    // Check available stock
    const selectedInventory = inventory.find(
      (item) => String(item.id) === String(formData.inventory_id),
    );

    if (!selectedInventory) {
      toast.error("Inventory not found");
      return;
    }

    if (Number(formData.qty) > Number(selectedInventory.qty || 0)) {
      toast.error(`Only ${selectedInventory.qty || 0} units available`);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        agency_id: Number(formData.agency_id),
        inventory_id: Number(formData.inventory_id),
        qty: Number(formData.qty),
        note: formData.note?.trim() || null,
      };

      const res = await axios.post(
        `/api/estimation/createAgencyInventory`,
        payload,
        {
          withCredentials: true,
        },
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Inventory sent to agency successfully!");

        setIsModalOpen(false);

        setFormData({
          agency_id: "",
          inventory_id: "",
          qty: "",
          note: "",
        });

        // Refresh both tables
        await getAllAgencyInventory();
        await getAllInventory();
      }
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to send inventory");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      const res = await axios.delete(
        `/api/kitready/deleteAgencyInventory/${id}`,
        {
          withCredentials: true,
        },
      );

      if (res.status === 200) {
        toast.success("Transaction deleted");

        await getAllAgencyInventory();
        await getAllInventory();
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to delete transaction",
      );
    }
  };

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredTransactions = transactions.filter((item) => {
    const search = searchQuery.toLowerCase();

    return (
      item.agency_name?.toLowerCase().includes(search) ||
      item.inventory_name?.toLowerCase().includes(search) ||
      item.brand_name?.toLowerCase().includes(search) ||
      item.note?.toLowerCase().includes(search)
    );
  });

  // --------------------------------------------------
  // TOTAL QUANTITY
  // --------------------------------------------------

  const totalSent = transactions.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0,
  );

  // --------------------------------------------------
  // SELECTED INVENTORY
  // --------------------------------------------------

  const selectedInventory = inventory.find(
    (item) => String(item.id) === String(formData.inventory_id),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}

      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Agency Inventory"
      />

      {/* MAIN */}

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          {/* HEADER */}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                Agency Inventory
              </h1>

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Inventory Dispatch History
              </p>
            </div>
            <button
              onClick={() => {
                navigate("/agency");
              }}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              <Eye size={16} /> View Agency
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              <Plus size={16} />
              Send Inventory
            </button>
          </div>

          {/* SUMMARY */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* AGENCIES */}

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-[#1a5695] rounded-2xl">
                  <Building2 size={20} />
                </div>

                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Agencies
                  </p>

                  <p className="text-2xl font-black text-slate-800">
                    {agencies.length}
                  </p>
                </div>
              </div>
            </div>

            {/* INVENTORY */}

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                  <Package size={20} />
                </div>

                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Inventory Items
                  </p>

                  <p className="text-2xl font-black text-slate-800">
                    {inventory.length}
                  </p>
                </div>
              </div>
            </div>

            {/* TOTAL SENT */}

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <Package size={20} />
                </div>

                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Total Units Sent
                  </p>

                  <p className="text-2xl font-black text-slate-800">
                    {totalSent}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH */}

          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                placeholder="Search agency, inventory or note..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE */}

          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            {tableLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-[#1a5695]" size={42} />

                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">
                  Loading transactions...
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/70">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-center">
                        No.
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">
                        Agency
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">
                        Inventory
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-center">
                        Qty
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">
                        Note
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">
                        Date
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-right">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-6 py-5 text-xs font-black text-slate-300 text-center">
                            #{index + 1}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-blue-50 text-[#1a5695] rounded-xl flex items-center justify-center">
                                <Building2 size={16} />
                              </div>

                              <div>
                                <p className="font-black text-slate-800 text-sm">
                                  {item.agency_name}
                                </p>

                                <p className="text-[9px] font-bold text-slate-400 uppercase">
                                  Agency #{item.agency_id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
                                <Package size={16} />
                              </div>

                              <div>
                                <p className="font-bold text-slate-800 text-sm">
                                  {item.inventory_name}
                                </p>

                                <p className="text-[9px] font-black text-[#1a5695] uppercase">
                                  {item.brand_name || "Generic"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-center">
                            <span className="inline-flex px-3 py-1.5 bg-green-50 text-green-600 rounded-xl text-sm font-black">
                              {item.qty}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <p className="text-xs font-bold text-slate-500 max-w-[220px]">
                              {item.note || "-"}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p className="text-xs font-bold text-slate-500">
                              {item.created_at
                                ? new Date(item.created_at).toLocaleDateString(
                                    "en-IN",
                                  )
                                : "-"}
                            </p>
                          </td>

                          <td className="px-6 py-5 text-right">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl transition-all border border-slate-100"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center">
                            <Package size={40} className="text-slate-200" />

                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">
                              No Transactions Found
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CREATE MODAL */}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
            {/* HEADER */}

            <div className="p-8 bg-[#1a5695] text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Send Inventory
                </h2>

                <p className="text-white/60 text-[10px] font-bold uppercase mt-1">
                  Agency Inventory Management
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {/* AGENCY */}

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Agency
                </label>

                <select
                  required
                  value={formData.agency_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      agency_id: e.target.value,
                    })
                  }
                  className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                >
                  <option value="" disabled>
                    Select Agency
                  </option>

                  {agencies.map((agency) => (
                    <option key={agency.id} value={agency.id}>
                      {agency.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* INVENTORY */}

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Inventory
                </label>

                <select
                  required
                  value={formData.inventory_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      inventory_id: e.target.value,
                    })
                  }
                  className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                >
                  <option value="" disabled>
                    Select Inventory
                  </option>

                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                      {item.brand_name ? ` - ${item.brand_name}` : ""}
                      {item.qty !== undefined ? ` (Stock: ${item.qty})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* SELECTED INVENTORY */}

              {selectedInventory && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-[#1a5695] uppercase tracking-widest">
                        Available Stock
                      </p>

                      <p className="text-lg font-black text-slate-800">
                        {selectedInventory.qty ?? 0} Units
                      </p>
                    </div>

                    {selectedInventory.wattage && (
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase">
                          Wattage
                        </p>

                        <p className="text-sm font-black text-slate-700">
                          {selectedInventory.wattage} W
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* QTY */}

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Quantity
                </label>

                <input
                  required
                  min="1"
                  max={selectedInventory?.qty || undefined}
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.qty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      qty: e.target.value,
                    })
                  }
                  className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                />

                {selectedInventory &&
                  Number(formData.qty) > Number(selectedInventory.qty || 0) && (
                    <p className="text-red-500 text-[10px] font-bold mt-2 ml-2">
                      Quantity cannot exceed available stock
                    </p>
                  )}
              </div>

              {/* NOTE */}

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Note
                </label>

                <textarea
                  rows="3"
                  placeholder="Enter dispatch note..."
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      note: e.target.value,
                    })
                  }
                  className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold resize-none"
                />
              </div>

              {/* SUBMIT */}

              <button
                disabled={
                  loading ||
                  !formData.agency_id ||
                  !formData.inventory_id ||
                  !formData.qty ||
                  Number(formData.qty) <= 0 ||
                  Number(formData.qty) > Number(selectedInventory?.qty || 0)
                }
                type="submit"
                className="w-full py-4 bg-[#1a5695] hover:bg-[#16497d] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Save size={18} />
                    Confirm Inventory Dispatch
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

export default AgencyInventoryManager;
