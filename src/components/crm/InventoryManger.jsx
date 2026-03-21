import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Edit3,
  Trash2,
  Package,
  X,
  Check,
  Loader2,
  Save,
  Tags,
  Eye,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const InventoryManager = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // NEW: State for Brand Modal
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [brandName, setBrandName] = useState("");

  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  const [brands, setBrands] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isIncrement, setIsIncrement] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    brand_id: "",
    qty: "",
  });

  const getAllInve = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/kitready/getAllInventory`);
      if (res.status === 200) setInventory(res.data.data);
    } catch (error) {
      console.error("Fetch Inventory Error:", error);
    } finally {
      setTableLoading(false);
    }
  };

  const getBrands = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/kitready/getAllBrands`);
      if (res.status === 200) {
        setBrands(res.data.data);
        if (res.data.data.length > 0 && !formData.brand_id) {
          setFormData((prev) => ({ ...prev, brand_id: res.data.data[0].id }));
        }
      }
    } catch (error) {
      console.error("Fetch Brands Error:", error);
    }
  };

  useEffect(() => {
    getBrands();
    getAllInve();
  }, []);

  // NEW: Handle Brand Submission
  const handleAddBrand = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/kitready/createBrand`, {
        name: brandName,
      });
      if (res.status === 201 || res.status === 200) {
        toast.success("New brand added!");
        setBrandName("");
        setIsBrandModalOpen(false);
        getBrands(); // Refresh dropdown list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add brand");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", brand_id: brands[0]?.id || "", qty: "" });
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      brand_id: item.brand_id,
      qty: Math.abs(item.qty),
    });
    setIsIncrement(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const finalQty = isIncrement ? formData.qty : -Math.abs(formData.qty);
    const payload = { ...formData, qty: finalQty };
    try {
      let res;
      if (editingId) {
        res = await axios.put(
          `${apiUrl}/api/kitready/updateInventory/${editingId}`,
          payload,
        );
        console.log(payload);
      } else {
        res = await axios.post(
          `${apiUrl}/api/kitready/createInventory`,
          payload,
        );
      }
      if (res.status === 200 || res.status === 201) {
        toast.success(editingId ? "Stock updated!" : "Product added!");
        setIsModalOpen(false);
        getAllInve();
      }
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = inventory.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Inventory"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
              Stock Inventory
            </h1>

            <div className="flex gap-3">
              {/* NEW: ADD BRAND BUTTON */}

              <button
                onClick={() => navigate("/brands")} // Ensure this matches your route path
                className="flex items-center gap-2 px-5 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <Eye size={16} /> View Brands
              </button>
              <button
                onClick={() => setIsBrandModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <Tags size={16} /> Add Brand
              </button>

              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>
          </div>

          {/* Search and Table remains the same... */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                placeholder="Search products..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm min-h-[400px] relative">
            {tableLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <Loader2 className="animate-spin text-[#1a5695]" size={40} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        No.
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Product Name
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Brand
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Qty
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
                        <td className="px-6 py-4 font-bold text-slate-800 text-sm">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 font-black uppercase text-[11px] text-blue-600">
                          {item.brand_name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`text-sm font-black ${item.qty < 10 ? "text-red-600 animate-pulse" : "text-slate-800"}`}
                          >
                            {item.qty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(item)}
                              className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all border border-slate-100"
                            >
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
            )}
          </div>
        </main>
      </div>

      {/* NEW: ADD BRAND MODAL */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-slate-800 p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Add Brand
                </h2>
                <p className="text-white/40 text-[10px] font-bold uppercase mt-1">
                  New Category
                </p>
              </div>
              <button
                onClick={() => setIsBrandModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddBrand} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Brand Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Nike, Apple..."
                  className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white outline-none text-sm font-bold"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-900 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Check size={18} /> Save Brand
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT MODAL (Existing) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
            <div
              className={`p-8 text-white flex justify-between items-center ${editingId ? "bg-amber-500" : "bg-[#1a5695]"}`}
            >
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="text-white/60 text-[10px] font-bold uppercase mt-1">
                  Inventory Management
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white outline-none text-sm font-bold"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value.toLocaleUpperCase(),
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Brand
                  </label>
                  <select
                    className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold cursor-pointer"
                    value={formData.brand_id}
                    onChange={(e) =>
                      setFormData({ ...formData, brand_id: e.target.value })
                    }
                  >
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex justify-between">
                    Qty
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl mt-1 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setIsIncrement(!isIncrement)}
                      className={`p-4 transition-colors ${isIncrement ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}
                    >
                      {isIncrement ? (
                        <Plus size={16} strokeWidth={3} />
                      ) : (
                        <Minus size={16} strokeWidth={3} />
                      )}
                    </button>
                    <input
                      required
                      type="number"
                      className="w-full p-4 bg-transparent outline-none text-sm font-bold"
                      value={formData.qty}
                      onChange={(e) =>
                        setFormData({ ...formData, qty: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <button
                disabled={loading}
                type="submit"
                className={`w-full py-4 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-3 ${editingId ? "bg-amber-500 hover:bg-amber-600" : "bg-[#1a5695] hover:bg-[#15467a]"}`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Save size={18} />{" "}
                    {editingId ? "Update Stock" : "Confirm Entry"}
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

export default InventoryManager;
