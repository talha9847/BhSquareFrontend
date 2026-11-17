import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import {
  Search,
  Loader2,
  Check,
  MessageSquare,
  ChevronDown,
  RefreshCw,
  ClipboardList,
  Zap,
  AlertCircle,
} from "lucide-react";

const API_BASE = "/api/whatsapp/templates";

const TYPE_STYLES = {
  simple: {
    label: "Simple",
    chip: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
  },
  good: {
    label: "Good",
    chip: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  warm: {
    label: "Warm",
    chip: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  promo: {
    label: "Promo",
    chip: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  visit: {
    label: "Visit",
    chip: "bg-violet-100 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
  },
  payment: {
    label: "Payment",
    chip: "bg-rose-100 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
};

const styleOf = (key) => TYPE_STYLES[key] || TYPE_STYLES.simple;

/* ---- module-level cache: reopening the modal is instant, no refetch spam ---- */
let CACHE = { rows: null, at: 0 };
const TTL = 60 * 1000;

function unwrapList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

/* ---- placeholder rendering: {name}, {{name}}, {contact}, {number} ---- */
export function renderTemplate(text, lead) {
  if (!text) return "";
  const map = {
    name: lead?.customer_name ?? "",
    customer_name: lead?.customer_name ?? "",
    contact: lead?.contact_number ?? "",
    number: lead?.contact_number ?? "",
  };
  return String(text).replace(/\{\{?\s*([a-z_]+)\s*\}?\}/gi, (match, key) => {
    const value = map[String(key).toLowerCase()];
    return value === undefined ? match : value;
  });
}

const FollowUpTemplatePicker = ({ lead, selectedId, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const [rows, setRows] = useState(CACHE.rows || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const requestedRef = useRef(false);

  const load = useCallback(async (force = false) => {
    if (!force && CACHE.rows && Date.now() - CACHE.at < TTL) {
      setRows(CACHE.rows);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/fetchAll`, {
        withCredentials: true,
      });
      const list = unwrapList(res.data);
      CACHE = { rows: list, at: Date.now() };
      setRows(list);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not load templates",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch only the first time the section is opened
  useEffect(() => {
    if (expanded && !requestedRef.current) {
      requestedRef.current = true;
      load();
    }
  }, [expanded, load]);

  const availableTypes = useMemo(() => {
    const set = new Set(rows.map((t) => t.type || "simple"));
    return Object.keys(TYPE_STYLES).filter((k) => set.has(k));
  }, [rows]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((t) => {
      if (type !== "all" && (t.type || "simple") !== type) return false;
      if (!query) return true;
      return (
        (t.name || "").toLowerCase().includes(query) ||
        (t.message || "").toLowerCase().includes(query)
      );
    });
  }, [rows, q, type]);

  const selected = rows.find((t) => t.id === selectedId) || null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {/* toggle header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 hover:bg-slate-50 transition-colors"
      >
        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <Zap size={13} className="text-[#f39200]" />
          {selected ? (
            <span className="truncate max-w-[190px] text-[#1a5695]">
              {selected.name}
            </span>
          ) : (
            "Use a template"
          )}
        </span>
        <span className="flex items-center gap-2">
          {rows.length > 0 && (
            <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {rows.length}
            </span>
          )}
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {expanded && (
        <div className="border-t border-slate-100">
          {/* search */}
          <div className="p-3 pb-2 flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[12px] outline-none focus:bg-white focus:border-[#1a5695] transition-all"
              />
            </div>
            <button
              type="button"
              onClick={() => load(true)}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-[#1a5695] hover:bg-white transition-all disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* type chips */}
          {availableTypes.length > 0 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setType("all")}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
                  type === "all"
                    ? "bg-[#1a5695] text-white border-[#1a5695]"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
              >
                All
              </button>
              {availableTypes.map((k) => {
                const s = styleOf(k);
                const active = type === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setType(k)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
                      active
                        ? `${s.chip} ring-1 ring-offset-1 ${s.chip.split(" ")[2]}`
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        active ? s.dot : "bg-slate-300"
                      }`}
                    />
                    {s.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* list */}
          <div className="max-h-56 overflow-y-auto px-2 pb-2 space-y-1.5">
            {loading && rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 size={20} className="text-[#1a5695] animate-spin" />
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mt-2">
                  Loading
                </p>
              </div>
            ) : error ? (
              <div className="flex items-start gap-2 m-2 p-3 rounded-xl bg-rose-50 border border-rose-100">
                <AlertCircle
                  size={14}
                  className="text-rose-500 shrink-0 mt-0.5"
                />
                <div className="min-w-0">
                  <p className="text-[11px] text-rose-600 font-semibold">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={() => load(true)}
                    className="text-[10px] font-black uppercase tracking-wider text-rose-500 underline mt-1"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                <ClipboardList size={22} className="text-slate-300 mb-2" />
                <p className="text-[11px] font-bold text-slate-500">
                  {rows.length === 0 ? "No templates yet" : "No matches"}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {rows.length === 0
                    ? "Create one on the Follow-up Templates page."
                    : "Try another keyword or filter."}
                </p>
              </div>
            ) : (
              filtered.map((tpl) => {
                const s = styleOf(tpl.type);
                const active = tpl.id === selectedId;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => onSelect(tpl)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                      active
                        ? "bg-blue-50/70 border-[#1a5695] ring-1 ring-[#1a5695]/20"
                        : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg ${s.chip
                        .split(" ")
                        .slice(0, 1)
                        .join(" ")} flex items-center justify-center shrink-0`}
                    >
                      <MessageSquare
                        size={12}
                        className={s.chip.split(" ")[1]}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[11px] font-bold text-slate-800 uppercase tracking-tight truncate">
                          {tpl.name}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${s.chip}`}
                        >
                          {s.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-snug line-clamp-2 mt-0.5">
                        {renderTemplate(tpl.message, lead)}
                      </p>
                    </div>
                    {active && (
                      <Check
                        size={14}
                        className="text-[#1a5695] shrink-0 mt-1"
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUpTemplatePicker;
