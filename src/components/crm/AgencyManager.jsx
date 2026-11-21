import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Building2,
  Loader2,
  Eye,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Input } from "../ui";

const AgencyManager = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  const getAllAgencies = async () => {
    setTableLoading(true);

    try {
      const res = await axios.get(`/api/estimation/getAllAgencies`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setAgencies(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load agencies");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    getAllAgencies();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const handleEditClick = (agency) => {
    setEditingId(agency.id);
    setFormData({ name: agency.name });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this agency? This may affect records linked to it.",
      )
    ) {
      try {
        const res = await axios.delete(`/api/estimation/deleteAgency/${id}`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          toast.success("Agency deleted successfully");
          getAllAgencies();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Agency name is required");
      return;
    }

    setLoading(true);

    try {
      let res;

      if (editingId) {
        res = await axios.put(
          `/api/estimation/updateAgency/${editingId}`,
          formData,
          {
            withCredentials: true,
          },
        );
      } else {
        res = await axios.post(`/api/estimation/createAgency`, formData, {
          withCredentials: true,
        });
      }

      if (res.status === 200 || res.status === 201) {
        toast.success(
          editingId
            ? "Agency updated successfully!"
            : "Agency created successfully!",
        );

        setIsModalOpen(false);
        setFormData({ name: "" });
        setEditingId(null);

        getAllAgencies();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredAgencies = agencies.filter((agency) =>
    agency.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="crm-shell min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Agencies"
      />

      <div className="crm-workspace flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="crm-main p-4 lg:p-8">
          {/* HEADER */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase">
              Agency Directory
            </h1>

          
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              <Plus size={16} />
              View Agency
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
                placeholder="Search agencies..."
                value={searchQuery}
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
                        Agency Identity
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">
                    {filteredAgencies.length > 0 ? (
                      filteredAgencies.map((agency, index) => (
                        <tr
                          key={agency.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-6 py-4 text-xs font-black text-slate-400">
                            #{index + 1}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center border border-slate-200">
                                <Building2 size={14} />
                              </div>

                              <p className="font-bold text-slate-800 text-sm italic">
                                {agency.name}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(agency)}
                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all border border-slate-100"
                              >
                                <Edit3 size={16} />
                              </button>

                              <button
                                onClick={() => handleDelete(agency.id)}
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
                          No Agencies Found
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

      {/* AGENCY MODAL */}
      <Modal
        as="form"
        onSubmit={handleSubmit}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Modify Agency" : "New Agency"}
        subtitle="Agencies receive inventory and appear in dispatch records."
        eyebrow="Agency management"
        icon={Building2}
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
              icon={Building2}
              variant={editingId ? "warning" : "primary"}
            >
              {editingId ? "Update Agency" : "Create Agency"}
            </Button>
          </>
        }
      >
        <div className="crm-form-stack">
          <Input
            label="Agency Name"
            placeholder="e.g. ABC Agency..."
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

export default AgencyManager;
