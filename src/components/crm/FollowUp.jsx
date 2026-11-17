import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Plus,
  X,
  Edit,
  Trash2,
  Search,
  Check,
  Loader2,
  ClipboardList,
  Sparkles,
  Zap,
  FileText,
  Tag,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// =========================================================
// TYPE DEFINITIONS — single source of truth
// =========================================================
const TEMPLATE_TYPES = [
  {
    key: "simple",
    label: "Simple",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    bar: "from-slate-400 to-slate-600",
    iconBg: "bg-slate-100",
    iconText: "text-slate-600",
    dot: "bg-slate-500",
  },
  {
    key: "good",
    label: "Good",
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    bar: "from-blue-400 to-blue-600",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    dot: "bg-blue-500",
  },
  {
    key: "warm",
    label: "Warm",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    bar: "from-emerald-400 to-emerald-600",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  {
    key: "promo",
    label: "Promo",
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    bar: "from-amber-400 to-amber-600",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    dot: "bg-amber-500",
  },
  {
    key: "visit",
    label: "Visit",
    bg: "bg-violet-100",
    text: "text-violet-700",
    border: "border-violet-200",
    bar: "from-violet-400 to-violet-600",
    iconBg: "bg-violet-100",
    iconText: "text-violet-600",
    dot: "bg-violet-500",
  },
  {
    key: "payment",
    label: "Payment",
    bg: "bg-rose-100",
    text: "text-rose-700",
    border: "border-rose-200",
    bar: "from-rose-400 to-rose-600",
    iconBg: "bg-rose-100",
    iconText: "text-rose-600",
    dot: "bg-rose-500",
  },
];

const getTypeStyle = (key) =>
  TEMPLATE_TYPES.find((t) => t.key === key) || TEMPLATE_TYPES[0];

// =========================================================
// API BASE
// =========================================================
const API_BASE = "/api/whatsapp/templates";

// =========================================================
// HELPER — accept { success, data } OR bare array
// =========================================================
function unwrapList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

// =========================================================
// COMPONENT
// =========================================================
const FollowUp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("simple");
  const [formMessage, setFormMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // =========================================================
  // LOAD
  // =========================================================
  const loadTemplates = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/fetchAll`, {
        withCredentials: true,
      });
      setTemplates(unwrapList(res.data));
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to load templates",
      );
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  // =========================================================
  // MODAL HANDLERS
  // =========================================================
  const openCreateModal = () => {
    setEditingId(null);
    setFormName("");
    setFormType("simple");
    setFormMessage("");
    setModalOpen(true);
  };

  const openEditModal = (tpl) => {
    setEditingId(tpl.id);
    setFormName(tpl.name);
    setFormType(tpl.type || "simple");
    setFormMessage(tpl.message);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormName("");
    setFormType("simple");
    setFormMessage("");
    setSaving(false);
  };

  // =========================================================
  // CREATE / UPDATE
  // =========================================================
  const submitTemplate = async () => {
    if (!formName.trim()) return toast.error("Please enter template name");
    if (!formMessage.trim()) return toast.error("Please enter message");
    if (!formType) return toast.error("Please select a type");

    setSaving(true);
    try {
      if (editingId !== null) {
        // UPDATE
        const res = await axios.put(
          `${API_BASE}/update/${editingId}`,
          {
            name: formName.trim(),
            type: formType,
            message: formMessage.trim(),
          },
          { withCredentials: true },
        );

        if (res.data?.success) {
          const updated = res.data.data;
          if (updated && updated.id) {
            // Use server's row so updated_at & normalized fields are correct
            setTemplates((prev) =>
              prev.map((t) => (t.id === editingId ? updated : t)),
            );
          } else {
            // server said success but didn't return the row → refetch silently
            await loadTemplates({ silent: true });
          }
          toast.success(res.data?.message || "Template updated");
          closeModal();
        } else {
          toast.error(res.data?.message || "Failed to update template");
        }
      } else {
        // CREATE
        const res = await axios.post(
          `${API_BASE}/add`,
          {
            name: formName.trim(),
            type: formType,
            message: formMessage.trim(),
          },
          { withCredentials: true },
        );

        if (res.data?.success) {
          const created = res.data.data;
          if (created && created.id) {
            setTemplates((prev) => [created, ...prev]);
          } else {
            await loadTemplates({ silent: true });
          }
          toast.success(res.data?.message || "Template created");
          closeModal();
        } else {
          toast.error(res.data?.message || "Failed to create template");
        }
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================
  const handleDelete = async (tpl) => {
    const result = await Swal.fire({
      title: "Delete Template?",
      text: `"${tpl.name}" will be removed permanently.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.delete(`${API_BASE}/delete/${tpl.id}`, {
        withCredentials: true,
      });

      // Your controller returns { success: true, message } — but be tolerant
      const ok = res.data?.success !== false;
      if (ok) {
        setTemplates((prev) => prev.filter((t) => t.id !== tpl.id));
        toast.success(res.data?.message || "Template deleted");
      } else {
        toast.error(res.data?.message || "Failed to delete template");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete template",
      );
    }
  };

  // =========================================================
  // FILTER
  // =========================================================
  const filteredTemplates = templates.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      t.name?.toLowerCase().includes(q) ||
      t.message?.toLowerCase().includes(q) ||
      t.type?.toLowerCase().includes(q)
    );
  });

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="FollowUp"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          {/* HERO HEADER */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1a5695] via-[#1a5695] to-[#0f3a68] rounded-[32px] p-6 lg:p-8 mb-6 shadow-xl shadow-blue-900/20">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-[#f39200]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-3">
                  <Sparkles size={12} className="text-[#f39200]" />
                  Templates Manager
                </div>
                <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight font-syne uppercase flex items-center gap-3">
                  <MessageSquare size={28} className="text-[#f39200]" />
                  Follow-up Templates
                </h1>
                <p className="text-white/70 text-sm mt-1.5">
                  Reusable messages you can apply to any lead in one click
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                    Total Templates
                  </span>
                  <span className="text-3xl font-black text-white leading-none">
                    {loading ? "—" : templates.length}
                  </span>
                </div>
                <button
                  onClick={openCreateModal}
                  className="flex items-center justify-center gap-2 bg-[#f39200] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-900/30 hover:bg-[#e08600] transition-all active:scale-95 text-sm"
                >
                  <Plus size={20} /> Add Template
                </button>
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
                placeholder="Search templates by name, type or message..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#1a5695] outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-black uppercase tracking-wider whitespace-nowrap">
              {loading
                ? "—"
                : `${filteredTemplates.length} / ${templates.length}`}
            </span>
          </div>

          {/* CONTENT */}
          {loading ? (
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm flex flex-col items-center justify-center py-32">
              <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Loading Templates
              </p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-16 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <ClipboardList size={36} className="text-slate-300" />
              </div>
              <h3 className="text-slate-700 font-black text-sm uppercase tracking-widest mb-1">
                {templates.length === 0
                  ? "No templates yet"
                  : "No matches found"}
              </h3>
              <p className="text-slate-400 text-sm italic mb-5">
                {templates.length === 0
                  ? "Create your first reusable follow-up message."
                  : "Try a different search keyword."}
              </p>
              {templates.length === 0 && (
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 bg-[#1a5695] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#15467a] transition-all"
                >
                  <Plus size={16} /> Create Template
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTemplates.map((tpl) => {
                const style = getTypeStyle(tpl.type);
                return (
                  <div
                    key={tpl.id}
                    className="group relative bg-white border border-slate-200 rounded-[24px] shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    <div
                      className={`h-1 w-full bg-gradient-to-r ${style.bar}`}
                    />

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center shrink-0 shadow-sm`}
                          >
                            <MessageSquare
                              size={16}
                              className={style.iconText}
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-tight truncate leading-tight">
                              {tpl.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span
                                className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${style.bg} ${style.text} ${style.border}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                                />
                                {style.label}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                <FileText size={9} />
                                {tpl.message?.length || 0} chars
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(tpl)}
                            className="p-1.5 rounded-lg bg-blue-50 text-[#1a5695] border border-blue-100 hover:bg-[#1a5695] hover:text-white transition-all"
                            title="Edit"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(tpl)}
                            className="p-1.5 rounded-lg bg-slate-50 text-slate-400 border border-slate-100 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl px-3.5 py-3 flex-1 relative">
                        <span
                          className={`absolute top-1.5 left-2 text-2xl leading-none font-black ${style.iconText} opacity-20 select-none`}
                        >
                          &ldquo;
                        </span>
                        <p className="text-[12px] text-slate-600 leading-relaxed line-clamp-5 relative">
                          {tpl.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && filteredTemplates.length > 0 && (
            <p className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-[0.2em] font-bold">
              Showing {filteredTemplates.length} of {templates.length} templates
            </p>
          )}
        </main>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="relative bg-gradient-to-br from-[#1a5695] to-[#0f3a68] p-5 text-white overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#f39200]/25 rounded-full blur-2xl pointer-events-none" />
              <div className="relative flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-syne uppercase tracking-tight">
                      {editingId !== null ? "Edit Template" : "New Template"}
                    </h2>
                    <p className="text-white/70 text-[11px] font-bold mt-0.5">
                      Reusable follow-up message
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase flex items-center gap-1">
                  <Zap size={10} /> Template Name
                </label>
                <input
                  autoFocus
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Simple Reminder"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695] focus:bg-white transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase flex items-center gap-1">
                  <Tag size={10} /> Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATE_TYPES.map((t) => {
                    const active = formType === t.key;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setFormType(t.key)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all ${
                          active
                            ? `${t.bg} ${t.text} ${t.border} ring-2 ring-offset-1 ${t.border}`
                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            active ? t.dot : "bg-slate-300"
                          }`}
                        />
                        {t.label}
                        {active && <Check size={12} className="ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase flex items-center gap-1">
                  <FileText size={10} /> Message
                </label>
                <textarea
                  rows="6"
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Type the follow-up message..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none resize-none focus:border-[#1a5695] focus:bg-white transition-all text-sm"
                />
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-400 ml-1">
                    Tip: Use{" "}
                    <span className="font-bold text-[#1a5695]">{"{name}"}</span>{" "}
                    to insert the customer name.
                  </p>
                  <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                    {formMessage.length} chars
                  </span>
                </div>
              </div>

              {formMessage.trim() && (
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3">
                  <p className="text-[9px] font-black text-[#1a5695] uppercase tracking-widest mb-1.5">
                    Preview
                  </p>
                  <p className="text-[12px] text-slate-600 leading-relaxed line-clamp-3">
                    {formMessage.replace(/\{name\}/g, "RAJESH BHAI")}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-6 py-3 rounded-2xl font-bold text-slate-400 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitTemplate}
                disabled={saving || !formName.trim() || !formMessage.trim()}
                className="flex-[2] px-6 py-3 rounded-2xl font-bold text-white bg-[#f39200] shadow-lg shadow-orange-500/20 hover:bg-[#e08600] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    {editingId !== null ? "Update Template" : "Save Template"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUp;
