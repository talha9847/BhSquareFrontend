import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Tags,
  Loader2,
  Save,
  AlertCircle,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Button, Input } from "../ui";

const BrandManager = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  const getAllBrands = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(`/api/kitready/getAllBrands`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setBrands(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load brands");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    getAllBrands();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const handleEditClick = (brand) => {
    setEditingId(brand.id);
    setFormData({ name: brand.name });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this brand? This may affect products linked to it.",
      )
    ) {
      try {
        const res = await axios.delete(
          `/api/kitready/deleteBrand/${id}`,
          { withCredentials: true },
        );
        if (res.status === 200) {
          toast.success("Brand deleted successfully");
          getAllBrands();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (editingId) {
        res = await axios.put(
          `/api/kitready/updateBrand/${editingId}`,
          formData,
          { withCredentials: true },
        );
      } else {
        res = await axios.post(`/api/kitready/createBrand`, formData, {
          withCredentials: true,
        });
      }

      if (res.status === 200 || res.status === 201) {
        toast.success(editingId ? "Brand updated!" : "Brand created!");
        setIsModalOpen(false);
        getAllBrands();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="crm-shell min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Brands"
      />

      <div className="crm-workspace flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="crm-main p-4 lg:p-8">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase">
              Brand Directory
            </h1>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              <Plus size={16} /> New Brand
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
                placeholder="Search brands..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="crm-surface bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm min-h-[400px] relative">
            {tableLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <Loader2 className="animate-spin text-slate-800" size={40} />
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
                        Brand Identity
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredBrands.length > 0 ? (
                      filteredBrands.map((brand, index) => (
                        <tr
                          key={brand.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-6 py-4 text-xs font-black text-slate-400">
                            #{index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center border border-slate-200">
                                <Tags size={14} />
                              </div>
                              <p className="font-bold text-slate-800 text-sm italic">
                                {brand.name}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(brand)}
                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all border border-slate-100"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(brand.id)}
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
                          No Brands Found
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

      {/* BRAND MODAL */}
      <Modal
        as="form"
        onSubmit={handleSubmit}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Modify Brand" : "New Brand"}
        subtitle="Brand names are shared across inventory and kit building."
        eyebrow="Brand management"
        icon={Tags}
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
              icon={Save}
              variant={editingId ? "warning" : "primary"}
            >
              {editingId ? "Update Brand" : "Create Brand"}
            </Button>
          </>
        }
      >
        <div className="crm-form-stack">
          <Input
            label="Brand Name"
            placeholder="e.g. Samsung, Toyota..."
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

export default BrandManager;
