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
  Layers,
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
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    brand_id: "",
    category_id: "",
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

  const getAllCategories = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/kitready/getCategories`);
      if (res.status == 200) setCategories(res.data.data);
    } catch (error) {
      console.log(error);
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
    getAllCategories();
  }, []);

  // Logic to group the filtered items by category name
  const groupedInventory = inventory
    .filter((item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .reduce((acc, item) => {
      const category = item.category_name || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      brand_id: item.brand_id,
      category_id: item.category_id || "",
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
      let res = editingId
        ? await axios.put(
            `${apiUrl}/api/kitready/updateInventory/${editingId}`,
            payload,
          )
        : await axios.post(`${apiUrl}/api/kitready/createInventory`, payload);

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
              <button
                onClick={() => navigate("/brands")}
                className="flex items-center gap-2 px-5 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <Eye size={16} /> View Brands
              </button>
              <button
                onClick={() => navigate("/category")}
                className="flex items-center gap-2 px-5 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <Eye size={16} /> View Category
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-8 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                placeholder="Search items by name..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {tableLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-slate-200 shadow-sm">
              <Loader2 className="animate-spin text-[#1a5695] mb-4" size={48} />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Loading Inventory...
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(groupedInventory).map(([category, items]) => (
                <div
                  key={category}
                  className="group animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <div className="flex items-center gap-4 mb-4 px-2">
                    <div className="p-2 bg-[#1a5695] rounded-xl text-white shadow-md">
                      <Layers size={18} />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                        {category}
                      </h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {items.length} Products in stock
                      </p>
                    </div>
                    <div className="flex-1 h-[1px] bg-slate-200 ml-2"></div>
                  </div>

                  <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
                        {items.map((item, index) => (
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
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-blue-50 text-[#1a5695] rounded-lg font-black uppercase text-[9px] tracking-widest border border-blue-100">
                                {item.brand_name || "Generic"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span
                                className={`text-sm font-black px-4 py-1.5 rounded-xl ${item.qty < 10 ? "text-red-600 bg-red-50 animate-pulse" : "text-slate-700 bg-slate-100"}`}
                              >
                                {item.qty}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEditClick(item)}
                                  className="p-2.5 bg-white text-slate-400 hover:text-[#1a5695] hover:border-[#1a5695] rounded-xl transition-all border border-slate-200"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button className="p-2.5 bg-white text-slate-400 hover:text-red-600 hover:border-red-200 rounded-xl transition-all border border-slate-200">
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
              ))}
            </div>
          )}
        </main>
      </div>

      {/* REUSE MODALS - Keeping all logic and themes identical */}
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
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
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
                      name: e.target.value.toUpperCase(),
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
                    <option value="" disabled>
                      Select Brand
                    </option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Category
                  </label>
                  <select
                    className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold cursor-pointer"
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Quantity
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
