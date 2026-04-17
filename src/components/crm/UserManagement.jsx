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
  const [toggleLoading, setToggleLoading] = useState(null); // Stores ID of user being toggled
  // Master Data State
  const [masterData, setMasterData] = useState({
    technicians: [],
    fabricators: [],
    sources: [],
    supervisor: [],
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
  const roles = ["admin", "technician", "fabricator", "source", "supervisor"];

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
          supervisor: res.data.data.supervisor || [],
        });
      }
    } catch (error) {}
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
    try {
      const endpoint =
        modalType === "create"
          ? "/api/users/createUser"
          : "/api/users/updateUser";
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
  const toggleUserStatus = async (user) => {
    setToggleLoading(user.id);
    try {
      const res = await axios.put(
        `/api/users/updateUserActiveStatus`,
        { userId: user.id, is_active: !user.is_active },
        { withCredentials: true },
      );

      if (res.status === 200) {
        toast.success(`User ${!user.is_active ? "activated" : "deactivated"}`);
        getUsers(); // Refresh list
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setToggleLoading(null);
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
    if (formData.role === "supervisor") return masterData.supervisor;
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
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left border-separate border-spacing-0 min-w-[600px]">
                  <thead className="bg-slate-50/80 sticky top-0 z-10">
                    <tr>
                      {/* Responsive Hide: Hidden on mobile (sm) */}
                      <th className="hidden sm:table-cell px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-16 text-center border-b border-slate-100">
                        ID
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100">
                        User Info
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 text-center w-32">
                        Status
                      </th>
                      {/* Responsive Hide: Hidden on mobile (md) */}
                      <th className="hidden md:table-cell px-6 py-5 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 w-32">
                        Role
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-right border-b border-slate-100 w-28">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          {/* 1. ID COLUMN (HIDDEN ON MOBILE) */}
                          <td className="hidden sm:table-cell px-6 py-4 text-center font-black text-slate-300 text-[11px]">
                            {user.id}
                          </td>

                          {/* 2. USER INFO */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 text-sm leading-none truncate max-w-[200px]">
                                {user.email}
                              </span>
                              <span className="text-[10px] text-slate-400 mt-1 font-medium italic">
                                Member since{" "}
                                {new Date(user.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </td>

                          {/* 3. SEPARATE TOGGLE COLUMN */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col items-center gap-1.5">
                              <button
                                disabled={toggleLoading === user.id}
                                onClick={() => toggleUserStatus(user)}
                                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 ${
                                  user.is_active
                                    ? "bg-emerald-500"
                                    : "bg-slate-200"
                                } ${toggleLoading === user.id ? "opacity-30 cursor-wait" : "cursor-pointer hover:scale-105"}`}
                              >
                                <span
                                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
                                    user.is_active
                                      ? "translate-x-5.5"
                                      : "translate-x-1"
                                  }`}
                                />
                              </button>
                              <span
                                className={`text-[8px] font-black uppercase tracking-tighter ${user.is_active ? "text-emerald-600" : "text-slate-400"}`}
                              >
                                {user.is_active ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                          </td>

                          {/* 4. ROLE COLUMN (HIDDEN ON TABLET/MOBILE) */}
                          <td className="hidden md:table-cell px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${
                                user.role === "admin"
                                  ? "bg-rose-50 border-rose-100 text-rose-500"
                                  : "bg-blue-50 border-blue-100 text-[#1a5695]"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>

                          {/* 5. ACTIONS */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end items-center gap-1">
                              <button
                                onClick={() => openModal("edit", user)}
                                className="p-2 text-slate-400 hover:text-[#1a5695] hover:bg-white border border-transparent hover:border-blue-100 rounded-lg transition-all"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white border border-transparent hover:border-rose-100 rounded-lg transition-all">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-24 text-center bg-slate-50/20"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                              <ShieldAlert size={20} />
                            </div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                              No matches found
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
                        setFormData({
                          ...formData,
                          email: e.target.value.toLowerCase(),
                        })
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
