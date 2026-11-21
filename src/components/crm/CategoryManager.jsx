import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Grid,
  Loader2,
  Layers,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import axios from "axios";
import { Modal, Button, Input } from "../ui";

const CategoryManager = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  // Dummy Data State
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "PANEL INVERTER",
      description: "High-efficiency solar inverters",
    },
    {
      id: 2,
      name: "FIXED",
      description: "Static mounting systems and hardware",
    },
  ]);
  const apiUrl = import.meta.env.VITE_API_URL;

  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  // Simulating API Call
  const getAllCategories = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(`/api/kitready/getCategories`, {
        withCredentials: true,
      });
      if (res.status == 200) {
        setCategories(res.data.data);
      }
    } catch (error) {
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const handleEditClick = (category) => {
    setEditingId(category.id);
    setFormData({ name: category.name });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
      toast.success("Category removed (Local state only)");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const res = await axios.put(
          `/api/kitready/updateCategory/${editingId}`,
          formData,
          { withCredentials: true },
        );
        if (res.status == 200) {
          getAllCategories();
          toast.success("Category updated!");
        }
      } else {
        const res = await axios.post(
          `/api/kitready/createCategory`,
          formData,
          { withCredentials: true },
        );
        if (res.status == 201) {
          getAllCategories();
          toast.success("Category created!");
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="crm-shell min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Categories"
      />

      <div className="crm-workspace flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="crm-main p-4 lg:p-8">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase">
                Category Vault
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Classify your product inventory
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              <Plus size={16} /> New Category
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="crm-surface bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                placeholder="Search categories (e.g. Inverter...)"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="crm-surface bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm min-h-[400px] relative">
            {tableLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        ID
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Classification Name
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                        Management
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((cat, index) => (
                        <tr
                          key={cat.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-6 py-4 text-xs font-black text-slate-400">
                            #{index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                                <Grid size={14} />
                              </div>
                              <p className="font-bold text-slate-800 text-sm">
                                {cat.name}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(cat)}
                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all border border-slate-100"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(cat.id)}
                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl transition-all border border-slate-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-20 text-center text-slate-400 font-bold text-xs uppercase tracking-widest"
                        >
                          No Categories Found
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

      {/* CATEGORY MODAL */}
      <Modal
        as="form"
        onSubmit={handleSubmit}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Category" : "New Category"}
        subtitle="System classification used to group inventory items."
        eyebrow="Inventory"
        icon={Layers}
        tone={editingId ? "warning" : "primary"}
        size="sm"
        preventClose={loading}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              icon={Layers}
              variant={editingId ? "warning" : "primary"}
            >
              {editingId ? "Update Category" : "Save Category"}
            </Button>
          </>
        }
      >
        <div className="crm-form-stack">
          <Input
            label="Category Name"
            placeholder="e.g. PANEL INVERTER, FIXED..."
            value={formData.name}
            onChange={(e) =>
              setFormData({ name: e.target.value.toUpperCase() })
            }
            required
          />
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManager;
