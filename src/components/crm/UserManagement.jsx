import React, { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  Users,
  UserPlus,
  Mail,
  ShieldAlert,
  Lock,
  Save,
  X,
  Edit3,
  Trash2,
  CheckCircle2,
  Layers,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import axios from "axios";

const UserManagement = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  // Master Data State
  const [masterData, setMasterData] = useState({
    technicians: [],
    fabricators: [],
    sources: [],
  });

  // Modal States
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    role: "technician",
    role_id: "", // To store the selected ID from master list
    password: "",
    confirmPassword: "",
  });
  const [modalLoading, setModalLoading] = useState(false);

  // Updated roles to match your master data keys
  const roles = ["admin", "technician", "fabricator", "source"];

  const getUsers = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(`/api/users/getAllUsers`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUsers(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setTableLoading(false);
    }
  };

  const getAllMaster = async () => {
    try {
      const res = await axios.get(`/api/sources/getAllMasters`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        // Mapping the response to state
        setMasterData({
          technicians: res.data.data.technicians || [],
          fabricators: res.data.data.fabricators || [],
          sources: res.data.data.sources || [],
        });
      }
    } catch (error) {
      console.error("Master data fetch error", error);
    }
  };

  useEffect(() => {
    getUsers();
    getAllMaster();
  }, []);

  const openModal = (type, user = null) => {
    setModalType(type);
    if (type === "edit" && user) {
      setFormData({
        id: user.id,
        email: user.email,
        role: user.role || "technician",
        role_id: user.role_id || "",
        password: "",
        confirmPassword: "",
      });
    } else {
      setFormData({
        email: "",
        role: "technician",
        role_id: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  const handleAction = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setModalLoading(true);
    console.log(formData);
    try {
      const endpoint =
        modalType === "create" ? "/api/users/createUser" : "/api/users/updateUser";
      const res = await axios.post(`${endpoint}`, formData, {
        withCredentials: true,
      });

      if (res.status === 200 || res.status === 201) {
        toast.success(
          `User ${modalType === "create" ? "created" : "updated"} successfully`,
        );
        setModalType(null);
        getUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setModalLoading(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Helper to get the correct list based on selected role
  const getReferenceList = () => {
    if (formData.role === "technician") return masterData.technicians;
    if (formData.role === "fabricator") return masterData.fabricators;
    if (formData.role === "source") return masterData.sources;
    return [];
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Users"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
              <Users className="text-[#1a5695]" size={28} /> User Management
            </h1>
            <button
              onClick={() => openModal("create")}
              className="flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white text-[10px] font-black uppercase rounded-2xl hover:shadow-lg transition-all active:scale-95"
            >
              <UserPlus size={16} /> New User
            </button>
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 shadow-sm">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold placeholder:text-slate-300"
                placeholder="Search by email..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm relative min-h-[400px]">
            {tableLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
                <Loader2
                  className="animate-spin text-[#1a5695] mb-2"
                  size={32}
                />
                <span className="text-[10px] font-black uppercase text-slate-400">
                  Loading Users...
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-20 text-center">
                        ID
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">
                        User Details
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">
                        Role
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-center font-black text-slate-300 text-[11px]">
                          #{user.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 text-sm lowercase leading-tight">
                            {user.email}
                          </div>
                          <div className="text-[9px] text-slate-400 font-black uppercase mt-1 flex items-center gap-1">
                            <CheckCircle2
                              size={10}
                              className="text-emerald-500"
                            />{" "}
                            Active
                            <span className="mx-1 text-slate-200">|</span>
                            Joined:{" "}
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                              user.role === "admin"
                                ? "bg-rose-50 border-rose-100 text-rose-500"
                                : "bg-blue-50 border-blue-100 text-[#1a5695]"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openModal("edit", user)}
                              className="p-3 text-slate-400 hover:text-[#1a5695] hover:bg-blue-50 rounded-2xl transition-all"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                              <Trash2 size={18} />
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

      {/* CREATE/EDIT MODAL */}
      {modalType && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                  {modalType === "create" ? (
                    <UserPlus className="text-[#1a5695]" />
                  ) : (
                    <Edit3 className="text-[#1a5695]" />
                  )}
                  {modalType === "create" ? "Create User" : "Edit Member"}
                </h2>
                <button
                  onClick={() => setModalType(null)}
                  className="text-slate-300 hover:text-slate-600"
                >
                  <X />
                </button>
              </div>

              <form onSubmit={handleAction} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <input
                      type="email"
                      readOnly={modalType === "edit"}
                      className={`w-full pl-12 pr-4 py-3 border rounded-2xl outline-none text-sm font-bold transition-all ${
                        modalType === "edit"
                          ? "bg-slate-100 border-slate-100 text-slate-400"
                          : "bg-slate-50 border-slate-100 text-slate-800 focus:border-[#1a5695]"
                      }`}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Role Select */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    System Role
                  </label>
                  <div className="relative">
                    <ShieldAlert
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <select
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold appearance-none focus:border-[#1a5695]"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value,
                          role_id: "",
                        })
                      }
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* DYNAMIC MASTER LIST SELECT */}
                {formData.role !== "admin" && (
                  <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Link to {formData.role}
                    </label>
                    <div className="relative">
                      <Layers
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                        size={16}
                      />
                      <select
                        required
                        className="w-full pl-12 pr-4 py-3 bg-blue-50/50 border border-blue-100 rounded-2xl outline-none text-sm font-bold appearance-none focus:border-[#1a5695]"
                        value={formData.role_id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            role_id: e.target.value,
                          })
                        }
                      >
                        <option value="">Select {formData.role} Name</option>
                        {getReferenceList().map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                        size={16}
                      />
                      <input
                        type="password"
                        placeholder="••••••"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold focus:border-[#1a5695]"
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required={modalType === "create"}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Confirm
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                        size={16}
                      />
                      <input
                        type="password"
                        placeholder="••••••"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold focus:border-[#1a5695]"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required={modalType === "create"}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={modalLoading}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#1a5695] text-white text-[11px] font-black uppercase rounded-2xl hover:bg-[#15467a] shadow-lg shadow-blue-100 disabled:opacity-50 transition-all"
                  >
                    {modalLoading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    {modalType === "create" ? "Add to Crew" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
