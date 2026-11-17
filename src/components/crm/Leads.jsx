import React, { useEffect, useRef, useState } from "react";
import {
  Users,
  Plus,
  MapPin,
  X,
  Calculator,
  Search,
  ArrowRightLeft,
  Clock,
  Ban,
  MessageSquare,
  Calendar,
  Edit,
  Trash2,
  ClipboardList,
  ChevronRight,
  Database,
  Loader2,
  Eye,
  Check,
  MessageCircle,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ShareEstimationModal from "./ShareEstimationModal";
import FollowUpTemplatePicker, {
  renderTemplate,
} from "./FollowUpTemplatePicker";

const Leads = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [sources, setSources] = useState([]);
  const [sourceMap, setSourceMap] = useState({});
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [loadSaveLead, setLoadSaveLead] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [disPositionId, setDispositionId] = useState(0);
  const [disPosLoader, setDisPosLoader] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [followUpModal, setFollowUpModal] = useState({
    open: false,
    lead: null,
  });
  const [followUpNumber, setFollowUpNumber] = useState("");
  const [followUpRemark, setFollowUpRemark] = useState("");
  const [followUpDateTime, setFollowUpDateTime] = useState("");
  const [followUpTemplateId, setFollowUpTemplateId] = useState(null);
  const appliedTextRef = useRef("");

  const [convertPendingModal, setConvertPendingModal] = useState({
    open: false,
    lead: null,
  });
  const [convertPendingLoader, setConvertPendingLoader] = useState(false);
  const [showTodaysVisits, setShowTodaysVisits] = useState(false);

  const [dispositionModal, setDispositionModal] = useState({
    open: false,
    lead: null,
    type: null,
  });
  const [remark, setRemark] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(0);

  // =========================================================
  // WHATSAPP / ESTIMATION POPUP STATE
  // =========================================================
  const [whatsappModal, setWhatsappModal] = useState({
    open: false,
    lead: null,
    number: "",
  });

  const [estimationModal, setEstimationModal] = useState({
    open: false,
    lead: null,
    number: "",
  });

  // =========================================================
  // FOLLOW-UP HANDLERS
  // =========================================================
  const defaultLocalDateTime = (minutesAhead = 60) => {
    const d = new Date(Date.now() + minutesAhead * 60_000);
    d.setSeconds(0, 0);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours(),
    )}:${pad(d.getMinutes())}`;
  };

  const openFollowUpModal = (lead) => {
    setFollowUpModal({ open: true, lead });

    // Prefill from the lead's stored contact number, normalized:
    // strip non-digits, drop leading zeros
    const raw = String(lead?.contact_number || "").replace(/\D/g, "");
    setFollowUpNumber(raw.replace(/^0+/, ""));

    setFollowUpRemark("");
    setFollowUpDateTime(defaultLocalDateTime(60));
    setFollowUpTemplateId(null);
    appliedTextRef.current = "";
  };

  const closeFollowUpModal = () => {
    setFollowUpModal({ open: false, lead: null });
    setFollowUpNumber(""); // ← clear
    setFollowUpRemark("");
    setFollowUpDateTime("");
    setFollowUpTemplateId(null);
    appliedTextRef.current = "";
  };

  // template clicked → render {name} against this lead and drop into textarea
  const handleApplyTemplate = (tpl) => {
    const rendered = renderTemplate(tpl.message, followUpModal.lead);
    setFollowUpTemplateId(tpl.id);
    setFollowUpRemark(rendered);
    appliedTextRef.current = rendered;
  };

  // typing after applying a template turns it into a custom message
  const handleFollowUpMessageChange = (e) => {
    const value = e.target.value;
    setFollowUpRemark(value);
    if (followUpTemplateId && value !== appliedTextRef.current) {
      setFollowUpTemplateId(null);
    }
  };

  const handleClearMessage = () => {
    setFollowUpRemark("");
    setFollowUpTemplateId(null);
    appliedTextRef.current = "";
  };

  const [followUpLoading, setFollowUpLoading] = useState(false);

  const submitFollowUp = async () => {
    if (!followUpNumber || !/^[1-9][0-9]{7,14}$/.test(followUpNumber)) {
      toast.error("Please enter a valid WhatsApp number");
      return;
    }
    if (!followUpRemark.trim()) {
      toast.error("Please enter a follow-up message");
      return;
    }
    if (!followUpDateTime) {
      toast.error("Please pick a date and time");
      return;
    }

    const scheduled = new Date(followUpDateTime);
    if (isNaN(scheduled.getTime())) {
      toast.error("Invalid date/time");
      return;
    }
    if (scheduled.getTime() < Date.now()) {
      toast.error("Please pick a future date/time");
      return;
    }

    const payload = {
      lead_id: followUpModal.lead.id,
      whatsapp_number: followUpNumber,
      scheduled_at: scheduled.toISOString(),
      message: followUpRemark.trim(),
      template_id: followUpTemplateId ?? null,
      timezone: "Asia/Kolkata",
    };

    try {
      setFollowUpLoading(true);
      const res = await axios.post("/api/whatsapp-followups", payload, {
        withCredentials: true,
      });

      if (res.status === 201 && res.data?.success) {
        toast.success(
          `Follow-up scheduled for ${scheduled.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "short",
          })} IST`,
        );
        closeFollowUpModal();
      } else {
        throw new Error(res.data?.message || "Failed to schedule follow-up");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to schedule follow-up";
      toast.error(msg);
    } finally {
      setFollowUpLoading(false);
    }
  };

  // =========================================================
  // EDIT CLICK
  // =========================================================
  const editClick = async (lead) => {
    setEdit(true);
    setEditId(lead.id);
    setIsModalOpen(true);
    setPlateWattage(lead.panel_wattage || 0);
    setQuantity(lead.number_of_panels || 0);
    setQty(lead.number_of_inverters || 0);
    setInvereterKWattage(lead.inverter_kw || 0);
    reset({
      customer_name: lead.customer_name,
      contact_number: lead.contact_number,
      source_id: lead.source_id,
      address: lead.address,
      notes: lead.notes,
      site_visit_date: lead.site_visit_date,
      installation_type: lead.installation_type,
      panel_wattage: lead.panel_wattage,
      number_of_panels: lead.number_of_panels,
      inverter_kw: lead.inverter_kw,
      number_of_inverters: lead.number_of_inverters,
    });
  };

  // =========================================================
  // DELETE
  // =========================================================
  const handleDelete = async (lead) => {
    await Swal.fire({
      title: "Are you sure?",
      text: `You want to delete ${lead.customer_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          const response = await axios.delete(
            `/api/leads/deleteLeadById/${lead.id}`,
          );
          if (response.status === 200) {
            await getLeadsByStatus("pending");
            return true;
          }
          throw new Error("Delete failed");
        } catch (error) {
          Swal.showValidationMessage(
            error.response?.data?.message ||
              error.message ||
              "Failed to delete",
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Lead has been deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // =========================================================
  // TOGGLE FLAGS
  // =========================================================
  const toggleFlag = async (lead, field) => {
    if (field !== "estimation_sent" && field !== "site_visited") return;

    const isSiteVisit = field === "site_visited";
    const isEnabling = !lead[field];

    const confirmation = await Swal.fire({
      title: isSiteVisit
        ? isEnabling
          ? "Confirm Site Visit?"
          : "Revert Site Visit?"
        : isEnabling
          ? "Confirm Estimation Sent?"
          : "Revert Estimation Status?",
      text: isSiteVisit
        ? isEnabling
          ? `Mark the site visit for "${lead.customer_name}" as completed?`
          : `Mark the site visit for "${lead.customer_name}" as pending again?`
        : isEnabling
          ? `Confirm that the estimation has been sent to "${lead.customer_name}"?`
          : `Mark the estimation for "${lead.customer_name}" as not sent?`,
      icon: isEnabling ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: isEnabling ? "Yes, Mark Done" : "Yes, Revert",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!confirmation.isConfirmed) return;

    const next = isEnabling;

    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, [field]: next } : l)),
    );

    try {
      const res = await axios.patch(
        `/api/leads/updateLeadFlags/${lead.id}`,
        { [field]: next },
        { withCredentials: true },
      );
      if (res.status !== 200 || !res.data.success) {
        throw new Error(res.data?.message || "Update failed");
      }
      toast.success(
        isSiteVisit
          ? next
            ? "Site visit confirmed"
            : "Site visit reverted"
          : next
            ? "Estimation marked as sent"
            : "Estimation reverted",
      );
    } catch (error) {
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, [field]: !next } : l)),
      );
      toast.error(
        error.response?.data?.message || error.message || "Failed to update",
      );
    }
  };

  // =========================================================
  // WHATSAPP / ESTIMATION POPUP HANDLERS
  // =========================================================
  const openWhatsappModal = (lead) => {
    const raw = (lead.contact_number || "").replace(/\D/g, "");
    const cleaned = raw.replace(/^0+/, "");
    setWhatsappModal({ open: true, lead, number: cleaned });
  };

  const closeWhatsappModal = () =>
    setWhatsappModal({ open: false, lead: null, number: "" });

  const openEstimationPopup = () => {
    const { lead, number } = whatsappModal;
    if (!lead) return;
    if (!number || number.length < 8) {
      toast.error("Please enter a valid WhatsApp number");
      return;
    }
    setEstimationModal({ open: true, lead, number });
    setWhatsappModal({ open: false, lead: null, number: "" });
  };

  const closeEstimationPopup = () =>
    setEstimationModal({ open: false, lead: null, number: "" });

  // =========================================================
  // ADD SOURCE
  // =========================================================
  const addSource = async () => {
    try {
      setLoadSaveLead(true);
      const res = await axios.post(
        `/api/sources/addSource`,
        { name: sourceName },
        { withCredentials: true },
      );
      if (res.status == 201) {
        getSources();
        toast.success("Source added successfully");
        setLoadSaveLead(false);
        setIsSourceModalOpen(false);
        setSourceName("");
      }
    } catch (error) {
      toast.error("internal server error");
      setLoadSaveLead(false);
      setIsSourceModalOpen(false);
      setSourceName("");
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // =========================================================
  // LEADS STATE
  // =========================================================
  const [leads, setLeads] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  const getSources = async () => {
    try {
      const result = await axios.get(`/api/sources/fetchSources`, {
        withCredentials: true,
      });
      setSources(result.data.data);
      const map = {};
      result.data.data.forEach((v) => {
        map[v.id] = v.name;
      });
      setSourceMap(map);
    } catch (error) {
      /* silent */
    }
  };

  const getLeadsByStatus = async (status) => {
    setPageLoading(true);
    try {
      const result = await axios.get(`/api/leads/fetchLeadsByStatus`, {
        params: { status },
        withCredentials: true,
      });
      setLeads(result.data.data);
      setPageLoading(false);
    } catch (error) {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getSources();
      if (activeTab === "pending") {
        await getLeadsByStatus("pending");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    getLeadsByStatus(activeTab);
  }, [activeTab]);

  // =========================================================
  // VISIT DATE STYLING
  // =========================================================
  const getDateStyle = (dateString, siteVisited) => {
    if (!dateString) return "text-slate-400";
    const visitDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    visitDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((visitDate - today) / (1000 * 60 * 60 * 24));

    if (siteVisited) return "text-blue-600 font-bold";
    if (diffDays < 0) return "text-red-700 font-black animate-blink";
    if (diffDays <= 2) return "text-amber-600 font-bold";
    return "text-emerald-600 font-medium";
  };

  // =========================================================
  // SUBMIT ADD / EDIT LEAD
  // =========================================================
  const onSubmit = async (data) => {
    if (edit) {
      try {
        if (editId == 0) {
          toast.error("Please select lead to edit");
          setLoadSaveLead(false);
          setIsModalOpen(false);
          return;
        }
        setLoadSaveLead(true);
        const res = await axios.post(
          `/api/leads/updateLead`,
          {
            id: editId,
            customer_name: data.customer_name,
            contact_number: data.contact_number,
            site_visit_date: data.site_visit_date,
            source_id: data.source_id,
            address: data.address,
            notes: data.notes,
            panel_wattage: Number(data.panel_wattage),
            number_of_panels: Number(data.number_of_panels),
            inverter_kw: Number(data.inverter_kw),
            number_of_inverters: Number(data.number_of_inverters),
            installation_type: data.installation_type,
          },
          { withCredentials: true },
        );
        if (res.status == 200) {
          toast.success("Lead edited successfully");
          getLeadsByStatus(activeTab);
          setLoadSaveLead(false);
          setEdit(false);
          setEditId(0);
          setIsModalOpen(false);
          reset({
            customer_name: "",
            contact_number: "",
            source_id: 1,
            address: "",
            notes: "",
            site_visit_date: "",
            installation_type: "",
            panel_wattage: "",
            number_of_panels: "",
            inverter_kw: "",
            number_of_inverters: "",
          });
        }
      } catch (error) {
        setLoadSaveLead(false);
        setEdit(false);
        setEditId(0);
        setIsModalOpen(false);
      }
    } else {
      try {
        setLoadSaveLead(true);
        const res = await axios.post(
          `/api/leads/addLead`,
          {
            customer_name: data.customer_name,
            contact_number: data.contact_number,
            site_visit_date: data.site_visit_date,
            source_id: data.source_id,
            address: data.address,
            notes: data.notes,
            panel_wattage: data.panel_wattage,
            number_of_panels: data.number_of_panels,
            inverter_kw: data.inverter_kw,
            number_of_inverters: data.number_of_inverters,
            status: "pending",
            installation_type: data.installation_type,
          },
          { withCredentials: true },
        );
        if (res.status == 201) {
          toast.success("Lead saved successfully");
          getLeadsByStatus(activeTab);
          setLoadSaveLead(false);
          setIsModalOpen(false);
          reset({
            customer_name: "",
            contact_number: "",
            source_id: 1,
            address: "",
            notes: "",
            site_visit_date: "",
            installation_type: "",
            panel_wattage: "",
            number_of_panels: "",
            inverter_kw: "",
            number_of_inverters: "",
          });
        }
      } catch (error) {
        setLoadSaveLead(false);
      }
    }
  };

  // =========================================================
  // CAPACITY CALCULATORS
  // =========================================================
  const [plateWattage, setPlateWattage] = useState(550);
  const [invereterKWattage, setInvereterKWattage] = useState(550);
  const [quantity, setQuantity] = useState(0);
  const [qty, setQty] = useState(0);
  const invCapacity = invereterKWattage * qty;
  const systemCapacity = (plateWattage * quantity) / 1000;

  // =========================================================
  // DISPOSITION ACTIONS
  // =========================================================
  const handleAction = (lead, type) =>
    setDispositionModal({ open: true, lead, type });

  const convertToPending = async () => {
    try {
      setConvertPendingLoader(true);
      const res = await axios.post(
        `/api/leads/delayToPending`,
        { lead_id: convertPendingModal.lead.id },
        { withCredentials: true },
      );
      if (res.status == 200) {
        getLeadsByStatus(activeTab);
        toast.success("converted successfully");
        setConvertPendingModal({ lead: null, open: false });
        setConvertPendingLoader(false);
      }
    } catch (error) {
      toast.error("Internal server error");
      setConvertPendingModal({ lead: null, open: false });
      setConvertPendingLoader(false);
    }
  };

  const submitDisposition = async () => {
    setDisPosLoader(true);
    if (dispositionModal.type == "delay") {
      if (disPositionId == 0) {
        toast.error("Please select lead for disposition");
        setDispositionModal({ open: false, lead: null, type: null });
        return;
      }
      if (!followUpDate || !remark) {
        setDisPosLoader(false);
        return;
      }
      try {
        const res = await axios.post(
          `/api/leads/delayLead`,
          {
            lead_id: disPositionId,
            next_visit_date: followUpDate,
            note: remark,
          },
          { withCredentials: true },
        );
        if (res.status == 201) {
          getLeadsByStatus(activeTab);
          toast.success("Lead delayed successfully");
          setRemark("");
          setFollowUpDate("");
          setDispositionModal({ open: false, lead: null, type: null });
          setDisPosLoader(false);
        }
      } catch (error) {
        toast.error("Internal server error");
        setDisPosLoader(false);
        setRemark("");
        setFollowUpDate("");
        setDispositionModal({ open: false, lead: null, type: null });
      }
    } else if (dispositionModal.type == "convert") {
      if (disPositionId == 0) {
        toast.error("Please select lead for disposition");
        setDispositionModal({ open: false, lead: null, type: null });
        return;
      }
      try {
        const res = await axios.post(
          `/api/leads/convertToCustomer`,
          { lead_id: disPositionId },
          { withCredentials: true },
        );
        if (res.status == 200) {
          toast.success("Lead converted to customer successfully");
          getLeadsByStatus(activeTab);
          setRemark("");
          setFollowUpDate("");
          setDispositionModal({ open: false, lead: null, type: null });
          setDisPosLoader(false);
        }
      } catch (error) {
        toast.error("Internal server error");
        setDisPosLoader(false);
        setRemark("");
        setFollowUpDate("");
        setDispositionModal({ open: false, lead: null, type: null });
      }
    } else if (dispositionModal.type == "cancel") {
      if (disPositionId == 0) {
        toast.error("Please select lead for disposition");
        setDispositionModal({ open: false, lead: null, type: null });
        return;
      }
      if (!remark) {
        setDisPosLoader(false);
        return;
      }
      try {
        const res = await axios.post(
          `/api/leads/cancelLead`,
          { lead_id: disPositionId, reason: remark },
          { withCredentials: true },
        );
        if (res.status == 200) {
          getLeadsByStatus(activeTab);
          toast.success("Lead cancelled successfully");
          setRemark("");
          setFollowUpDate("");
          setDispositionModal({ open: false, lead: null, type: null });
          setDisPosLoader(false);
        }
      } catch (error) {
        toast.error("Internal server error");
        setDisPosLoader(false);
        setRemark("");
        setFollowUpDate("");
        setDispositionModal({ open: false, lead: null, type: null });
      }
    }
  };

  // =========================================================
  // DATE FORMATTERS
  // =========================================================
  const formatDateIST = (dateString) => {
    if (!dateString) return null;
    const date = new Date(
      dateString.endsWith("Z")
        ? dateString
        : `${dateString.replace(" ", "T")}Z`,
    );
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTimeIST = (dateString) => {
    if (!dateString) return null;
    const date = new Date(
      dateString.endsWith("Z")
        ? dateString
        : `${dateString.replace(" ", "T")}Z`,
    );
    if (isNaN(date.getTime())) return "";
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =========================================================
  // FILTER
  // =========================================================
  const filteredLeads = leads.filter((lead) => {
    const matchesTab = lead.status === activeTab;
    const todayDate = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    const visitDate = lead.site_visit_date
      ? new Date(lead.site_visit_date).toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        })
      : null;
    const matchesTodaysVisit = !showTodaysVisits || visitDate === todayDate;

    const dateObj = new Date(lead.created_at);
    const combinedDate = `${dateObj
      .toLocaleString("en-IN", { month: "long" })
      .toLowerCase()} ${dateObj.getFullYear()}`;
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = (() => {
      if (!query) return true;
      const basicFields =
        lead.customer_name?.toLowerCase().includes(query) ||
        lead.contact_number?.includes(query) ||
        String(lead.panel_wattage || "").includes(query) ||
        ((lead.total_capacity || 0) / 1000).toFixed(2).includes(query) ||
        sourceMap[lead.source_id]?.toLowerCase().includes(query);
      if (basicFields) return true;
      return query.split(" ").every((word) => combinedDate.includes(word));
    })();

    return matchesTab && matchesTodaysVisit && matchesSearch;
  });

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Leads"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight font-syne uppercase flex items-center gap-3">
                Leads Pipeline
                <button className="flex items-center gap-1 bg-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded-full hover:bg-slate-300 transition-all">
                  SHOW ALL LEADS <ChevronRight size={12} />
                </button>
              </h1>
              <p className="text-sm text-slate-500">
                Manage and convert solar prospects
              </p>
              <button
                onClick={() => navigate("/sources")}
                className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
              >
                <Eye size={16} /> View Sources
              </button>
              <button
                onClick={() => navigate("/followup")}
                className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
              >
                <Eye size={16} /> View followup
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-[#1a5695] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-900/20 hover:bg-[#15467a] transition-all active:scale-95 text-sm"
              >
                <Plus size={20} /> Add New Lead
              </button>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-2 mb-6 bg-slate-200/50 p-1.5 rounded-[22px] w-fit">
            {[
              { id: "pending", label: "Active", color: "bg-emerald-500" },
              { id: "delayed", label: "Delayed", color: "bg-amber-500" },
              { id: "cancelled", label: "Cancelled", color: "bg-rose-500" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-[18px] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {activeTab === tab.id && (
                  <span className={`w-2 h-2 rounded-full ${tab.color}`} />
                )}
                {tab.label}
              </button>
            ))}
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
                placeholder={`Search ${activeTab} leads...`}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#1a5695] outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowTodaysVisits((prev) => !prev)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                showTodaysVisits
                  ? "bg-[#1a5695] text-white shadow-lg shadow-blue-900/20"
                  : "bg-blue-50 text-[#1a5695] border border-blue-100 hover:bg-blue-100"
              }`}
            >
              <Calendar size={16} />
              {showTodaysVisits ? "All Visits" : "Today's Visits"}
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            {pageLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Fetching Records
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
                        Name & Mobile
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
                        Date Created
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
                        Address
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
                        Visit Date
                      </th>
                      <th className="text-center px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
                        Source
                      </th>
                      <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
                        Capacity
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="group hover:bg-slate-50/80 transition-all"
                      >
                        {/* NAME & MOBILE */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800 text-sm uppercase tracking-tight">
                              {lead.customer_name}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-slate-400 text-[11px] font-semibold">
                              {lead.contact_number}
                            </p>
                            <span
                              className={`
                                text-[9px] px-1 rounded font-bold uppercase transition-colors
                                ${
                                  lead.installation_type === "Residential"
                                    ? "bg-blue-50 text-blue-500/80 border border-blue-100"
                                    : lead.installation_type === "Commercial"
                                      ? "bg-purple-50 text-purple-500/80 border border-purple-100"
                                      : lead.installation_type === "Industrial"
                                        ? "bg-amber-50 text-amber-600/80 border border-amber-100"
                                        : "bg-slate-100 text-slate-400"
                                }
                              `}
                            >
                              {lead.installation_type?.substring(0, 3)}
                            </span>
                            <span className="inline-flex items-center gap-1 px-1.5 py-[2px] rounded-full bg-amber-50/80 border-amber-200/70 text-amber-700 text-[9px] font-bold leading-none">
                              <span className="text-amber-500">⚡</span>
                              <span>{lead.panel_wattage}</span>
                              <span className="text-amber-500/70 text-[8px]">
                                W
                              </span>
                            </span>
                          </div>
                        </td>

                        {/* DATE CREATED */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className="text-[13px] font-bold text-slate-700 leading-none">
                              {formatDateIST(lead.created_at)}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-tight">
                                {formatTimeIST(lead.created_at)}
                              </span>
                              <span className="text-[9px] bg-slate-100 text-slate-400 px-1 rounded font-bold uppercase">
                                IST
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* ADDRESS */}
                        <td className="px-6 py-5 min-w-[200px]">
                          <div className="flex items-start gap-2 text-slate-500 text-xs">
                            <MapPin
                              size={14}
                              className="text-slate-300 mt-0.5 shrink-0"
                            />
                            <span className="leading-relaxed italic">
                              {lead.address || "No Address Provided"}
                            </span>
                          </div>
                        </td>

                        {/* VISIT DATE + tick */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[11px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${getDateStyle(
                                  lead.site_visit_date,
                                  lead.site_visited,
                                )}`}
                              >
                                {lead.site_visit_date || "—"}
                              </span>
                              <button
                                onClick={() => toggleFlag(lead, "site_visited")}
                                title={
                                  lead.site_visited
                                    ? "Site visited — click to unmark"
                                    : "Mark site as visited"
                                }
                                className={`inline-flex items-center justify-center w-5 h-5 rounded-full border transition-all ${
                                  lead.site_visited
                                    ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                                    : "bg-white border-slate-300 text-slate-300 hover:border-blue-400 hover:text-blue-500"
                                }`}
                              >
                                <Check size={12} strokeWidth={3} />
                              </button>
                            </div>
                            <span
                              className={`text-[9px] font-bold uppercase ${
                                lead.site_visited
                                  ? "text-blue-500"
                                  : "text-slate-400"
                              }`}
                            >
                              {lead.site_visited
                                ? "✓ Visited"
                                : "Visit schedule"}
                            </span>
                          </div>
                        </td>

                        {/* SOURCE */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200/50">
                            {sourceMap[lead.source_id] || "Direct"}
                          </span>
                        </td>

                        {/* CAPACITY + tick */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-[#1a5695]">
                              {(lead.total_capacity / 1000).toFixed(2)}{" "}
                              <small className="text-[10px] opacity-70">
                                KW
                              </small>
                            </span>
                            <button
                              onClick={() =>
                                toggleFlag(lead, "estimation_sent")
                              }
                              title={
                                lead.estimation_sent
                                  ? "Estimation sent — click to unmark"
                                  : "Mark estimation as sent"
                              }
                              className={`inline-flex items-center justify-center w-5 h-5 rounded-full border transition-all ${
                                lead.estimation_sent
                                  ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                                  : "bg-white border-slate-300 text-slate-300 hover:border-emerald-400 hover:text-emerald-500"
                              }`}
                            >
                              <Check size={12} strokeWidth={3} />
                            </button>
                          </div>
                          <span
                            className={`block mt-1 text-[8px] font-bold uppercase tracking-wider ${
                              lead.estimation_sent
                                ? "text-emerald-500"
                                : "text-slate-300"
                            }`}
                          >
                            {lead.estimation_sent
                              ? "Est. sent"
                              : "Est. pending"}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {activeTab === "pending" && (
                              <button
                                onClick={() => openWhatsappModal(lead)}
                                className="p-2.5 bg-green-50 text-green-600 rounded-xl border border-green-100 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                title="Send estimation via WhatsApp"
                              >
                                <MessageCircle size={16} />
                              </button>
                            )}
                            {activeTab === "pending" && (
                              <button
                                onClick={() => openFollowUpModal(lead)}
                                className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                title="Schedule Follow-up"
                              >
                                <MessageSquare size={16} />
                              </button>
                            )}

                            {(activeTab === "delayed" ||
                              activeTab === "cancelled") && (
                              <button
                                onClick={() =>
                                  setConvertPendingModal({ open: true, lead })
                                }
                                className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                                title="Re-activate"
                              >
                                <ArrowRightLeft size={16} />
                              </button>
                            )}

                            {activeTab === "pending" && (
                              <>
                                <button
                                  onClick={() => {
                                    handleAction(lead, "convert");
                                    setDispositionId(lead.id);
                                  }}
                                  className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                  title="Convert"
                                >
                                  <ArrowRightLeft size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    handleAction(lead, "delay");
                                    setDispositionId(lead.id);
                                  }}
                                  className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                                  title="Delay"
                                >
                                  <Clock size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    handleAction(lead, "cancel");
                                    setDispositionId(lead.id);
                                  }}
                                  className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                  title="Cancel"
                                >
                                  <Ban size={16} />
                                </button>
                              </>
                            )}

                            <div className="w-[1px] h-4 bg-slate-200 mx-1" />

                            <button
                              onClick={() => editClick(lead)}
                              className="p-2.5 bg-blue-50 text-[#1a5695] rounded-xl border border-blue-100 hover:bg-[#1a5695] hover:text-white transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(lead)}
                              className="p-2.5 bg-slate-50 text-slate-400 rounded-xl border border-slate-100 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredLeads.length === 0 && (
                  <div className="p-12 text-center text-slate-400 text-sm italic">
                    No leads found in this category.
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* =========================================================
          ADD SOURCE MODAL
      ========================================================= */}
      {isSourceModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
              <h2 className="text-lg font-bold font-syne">Add New Source</h2>
              <button
                onClick={() => setIsSourceModalOpen(false)}
                className="hover:bg-white/10 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">
                Source Name
              </label>
              <input
                autoFocus
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value.toUpperCase())}
                placeholder="Enter source name..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-slate-800"
              />
              <button
                onClick={addSource}
                disabled={loadSaveLead}
                className="w-full mt-4 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loadSaveLead ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  "Save Source"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          WHATSAPP POPUP (small — asks for number)
      ========================================================= */}
      {whatsappModal.open && whatsappModal.lead && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-md rounded-[28px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <button
              onClick={closeWhatsappModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100"
            >
              <X size={18} className="text-slate-600" />
            </button>

            <div className="p-6 bg-green-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight">
                    Share Estimation
                  </h2>
                  <p className="text-white/80 text-xs font-bold">
                    {whatsappModal.lead.customer_name}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={whatsappModal.number}
                  onChange={(e) =>
                    setWhatsappModal((s) => ({
                      ...s,
                      number: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  placeholder="919876543210"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-green-600 font-bold"
                />
                <p className="text-[10px] text-slate-400 mt-1 ml-1">
                  Include country code without "+". Default comes from the
                  lead's contact number.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-0.5">
                <div className="flex justify-between">
                  <span>Capacity</span>
                  <span className="font-bold">
                    {(
                      ((Number(whatsappModal.lead?.panel_wattage) || 0) *
                        (Number(whatsappModal.lead?.number_of_panels) || 0)) /
                      1000
                    ).toFixed(2)}{" "}
                    kW
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Panels</span>
                  <span className="font-bold">
                    {whatsappModal.lead?.number_of_panels || 0} ×{" "}
                    {whatsappModal.lead?.panel_wattage || 0}W
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Inverter</span>
                  <span className="font-bold">
                    {whatsappModal.lead?.inverter_kw || 0} kW ×{" "}
                    {whatsappModal.lead?.number_of_inverters || 0}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeWhatsappModal}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={openEstimationPopup}
                  disabled={
                    !whatsappModal.number || whatsappModal.number.length < 8
                  }
                  className="flex-[2] px-4 py-3 rounded-xl font-black text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 uppercase text-[11px] tracking-wider"
                >
                  <MessageCircle size={16} />
                  Open Estimation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          ESTIMATION POPUP — delegated to ShareEstimationModal
      ========================================================= */}
      <ShareEstimationModal
        open={estimationModal.open}
        lead={estimationModal.lead}
        whatsappNumber={estimationModal.number}
        onClose={closeEstimationPopup}
      />

      {/* =========================================================
          ADD/EDIT LEAD MODAL
      ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200">
            <div className="bg-[#1a5695] p-5 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users size={20} />
                </div>
                <h2 className="text-xl font-bold font-syne uppercase tracking-tight">
                  {edit ? "Edit Lead" : "Create New Lead"}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEdit(false);
                  reset({
                    customer_name: "",
                    contact_number: "",
                    source_id: 1,
                    address: "",
                    notes: "",
                    site_visit_date: "",
                    installation_type: "",
                    panel_wattage: "",
                    number_of_panels: "",
                    inverter_kw: "",
                    number_of_inverters: "",
                  });
                }}
                className="hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form
              className="p-6 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">
                  Customer Name
                </label>
                <input
                  {...register("customer_name", {
                    required: "Customer name is required",
                    setValueAs: (v) => v.toUpperCase(),
                  })}
                  onInput={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }}
                  placeholder="e.g. Rajesh Bhai"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">
                  Contact Number
                </label>
                <input
                  {...register("contact_number", {
                    required: "Contact number is required",
                  })}
                  placeholder="+91 00000 00000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase flex items-center gap-1">
                  <Calendar size={10} /> Visit Schedule
                </label>
                <input
                  {...register("site_visit_date")}
                  type="date"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase flex items-center gap-1">
                  <Database size={10} /> Lead Source
                </label>
                <select
                  {...register("source_id", { required: "source is required" })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695] appearance-none"
                >
                  {sources.map((v, i) => (
                    <option key={i} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">
                  Project Category
                </label>
                <select
                  {...register("installation_type", {
                    required: "Project category is required",
                  })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695]"
                >
                  <option value={"Residential"}>Residential</option>
                  <option value={"Commercial"}>Commercial</option>
                  <option value={"Industrial"}>Industrial</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">
                  Full Address
                </label>
                <textarea
                  {...register("address", {
                    required: "Address is required",
                    setValueAs: (v) => v.toUpperCase(),
                  })}
                  onInput={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }}
                  placeholder="Enter site address..."
                  rows="2"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none resize-none focus:border-[#1a5695]"
                ></textarea>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase flex items-center gap-1">
                  <ClipboardList size={10} /> Internal Notes
                </label>
                <textarea
                  {...register("notes", {
                    setValueAs: (v) => (v ? v.toUpperCase() : ""),
                  })}
                  onInput={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }}
                  placeholder="Specific requirements..."
                  rows="2"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none resize-none focus:border-[#1a5695]"
                ></textarea>
              </div>

              {/* PANEL CALCULATOR */}
              <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-3xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3 text-[#1a5695] font-bold text-[10px] uppercase tracking-widest">
                  <Calculator size={14} /> Panel Capacity Estimator
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                      Wattage (W)
                    </span>
                    <input
                      {...register("panel_wattage")}
                      type="text"
                      value={plateWattage}
                      onChange={(e) => setPlateWattage(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-white shadow-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                      Plates
                    </span>
                    <input
                      {...register("number_of_panels")}
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-white shadow-sm outline-none"
                    />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-100 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    System Size
                  </span>
                  <span className="text-xl font-black text-[#1a5695]">
                    {Number(systemCapacity).toFixed(2)} kW
                  </span>
                </div>
              </div>

              {/* INVERTER CALCULATOR */}
              <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-3xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3 text-[#1a5695] font-bold text-[10px] uppercase tracking-widest">
                  <Calculator size={14} />
                  Inverter Capacity Estimator
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                      Kilo Wattage (KW)
                    </span>
                    <input
                      {...register("inverter_kw")}
                      type="text"
                      value={invereterKWattage}
                      onChange={(e) => setInvereterKWattage(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-white shadow-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                      Number of Inverters
                    </span>
                    <input
                      {...register("number_of_inverters")}
                      type="text"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-white shadow-sm outline-none"
                    />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-100 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    System Size
                  </span>
                  <span className="text-xl font-black text-[#1a5695]">
                    {Number(invCapacity).toFixed(2)} kW
                  </span>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0 flex gap-3 md:col-span-2 -mx-6 -mb-6 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-slate-400 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-6 py-3.5 rounded-2xl font-bold text-white bg-[#f39200] shadow-lg shadow-orange-500/20 hover:bg-[#e08600] active:scale-95 transition-all flex items-center justify-center gap-2"
                  disabled={loadSaveLead}
                >
                  {loadSaveLead ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5 text-white" />
                      Saving...
                    </>
                  ) : (
                    "Save Lead"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          DISPOSITION MODAL
      ========================================================= */}
      {dispositionModal.open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <button
              onClick={() =>
                setDispositionModal({ ...dispositionModal, open: false })
              }
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100"
            >
              <X size={18} className="text-slate-600" />
            </button>

            <div
              className={`p-6 text-white text-center ${
                dispositionModal.type === "convert"
                  ? "bg-emerald-600"
                  : dispositionModal.type === "delay"
                    ? "bg-amber-500"
                    : "bg-rose-600"
              }`}
            >
              <h2 className="text-xl font-black font-syne uppercase tracking-tight">
                {dispositionModal.type} Lead
              </h2>
              <p className="text-white/80 text-xs font-bold">
                {dispositionModal.lead.customer_name}
              </p>
            </div>

            <div className="p-8">
              {dispositionModal.type === "delay" && (
                <div className="mb-6 space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                    <Calendar size={12} /> Next Follow-up Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                  <div className="text-red-500 text-xs">
                    {!followUpDate ? "Date is required" : ""}
                  </div>
                </div>
              )}

              {dispositionModal.type != "convert" && (
                <div className="mb-8 space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                    <MessageSquare size={12} /> Remarks / Reason
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Provide details..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 outline-none resize-none"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                  <div className="text-red-500 text-xs">
                    {!remark ? "remark is required" : ""}
                  </div>
                </div>
              )}

              <button
                onClick={submitDisposition}
                className={`w-full py-4 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 ${
                  dispositionModal.type === "convert"
                    ? "bg-emerald-600"
                    : dispositionModal.type === "delay"
                      ? "bg-amber-500"
                      : "bg-rose-600"
                }`}
                disabled={disPosLoader}
              >
                {disPosLoader ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Confirming...
                  </>
                ) : (
                  <>Confirm {dispositionModal.type}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          CONVERT-TO-PENDING MODAL
      ========================================================= */}
      {convertPendingModal.open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <button
              onClick={() =>
                setConvertPendingModal({ ...convertPendingModal, open: false })
              }
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100"
            >
              <X size={18} className="text-slate-600" />
            </button>

            <div className="p-6 text-center bg-amber-500">
              <h2 className="text-lg font-bold text-white uppercase">
                Convert to Pending
              </h2>
              <p className="text-white/80 text-sm mt-2">
                Are you sure you want to convert{" "}
                <strong>{convertPendingModal.lead?.customer_name}</strong> back
                to pending status?
              </p>
            </div>

            <div className="p-6 flex justify-center gap-4">
              <button
                onClick={convertToPending}
                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={convertPendingLoader}
              >
                {convertPendingLoader ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Converting...
                  </>
                ) : (
                  <>Yes</>
                )}
              </button>

              <button
                onClick={() =>
                  setConvertPendingModal({
                    ...convertPendingModal,
                    open: false,
                  })
                }
                className="px-6 py-3 bg-rose-600 text-white rounded-2xl font-bold shadow-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          FOLLOW-UP MODAL — with template picker
      ========================================================= */}
      {followUpModal?.open && followUpModal?.lead && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md max-h-[92vh] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col">
            {/* HEADER */}
            <div className="bg-[#1a5695] p-5 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight">
                    Schedule Follow-up
                  </h2>
                  <p className="text-white/70 text-[11px] font-bold mt-0.5">
                    {followUpModal.lead.customer_name} ·{" "}
                    {followUpModal.lead.contact_number}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeFollowUpModal}
                className="hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-4 overflow-y-auto">
              {/* DATE & TIME */}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase flex items-center gap-1">
                  <MessageCircle size={10} /> WhatsApp Number
                </label>

                <input
                  type="tel"
                  inputMode="numeric"
                  value={followUpNumber}
                  onChange={(e) =>
                    setFollowUpNumber(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="919876543210"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 outline-none font-bold transition-all ${
                    followUpNumber.length >= 8 &&
                    !/^[1-9][0-9]{7,14}$/.test(followUpNumber)
                      ? "border-rose-300 focus:border-rose-500"
                      : "border-slate-200 focus:border-[#1a5695] focus:bg-white"
                  }`}
                />

                <p className="text-[10px] text-slate-400 mt-1 ml-1">
                  {followUpModal.lead?.contact_number ? (
                    <>
                      Prefilled from lead's number{" "}
                      <span className="font-bold text-slate-600">
                        {followUpModal.lead.contact_number}
                      </span>{" "}
                      — edit to send to a different number.
                    </>
                  ) : (
                    "No number on this lead — enter the WhatsApp number manually."
                  )}
                </p>

                {followUpNumber.length >= 8 &&
                  !/^[1-9][0-9]{7,14}$/.test(followUpNumber) && (
                    <p className="text-[10px] text-rose-500 mt-1 ml-1 font-bold">
                      Invalid number — must be 8–15 digits, no leading zero
                    </p>
                  )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase flex items-center gap-1">
                  <Calendar size={10} /> Send At (Date & Time)
                </label>
                <input
                  type="datetime-local"
                  value={followUpDateTime || ""}
                  min={
                    typeof defaultLocalDateTime === "function"
                      ? defaultLocalDateTime(0)
                      : undefined
                  }
                  onChange={(e) => setFollowUpDateTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#1a5695]"
                />
                {followUpDateTime && (
                  <p className="text-[10px] text-slate-400 mt-1 ml-1">
                    Will be sent on{" "}
                    <span className="font-bold text-[#1a5695]">
                      {new Date(followUpDateTime).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}{" "}
                      IST
                    </span>
                  </p>
                )}
              </div>

              {/* TEMPLATE PICKER */}
              {typeof FollowUpTemplatePicker !== "undefined" && (
                <FollowUpTemplatePicker
                  lead={followUpModal.lead}
                  selectedId={followUpTemplateId}
                  onSelect={handleApplyTemplate}
                />
              )}

              {/* MESSAGE */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase flex items-center gap-1">
                    <MessageCircle size={10} /> Follow-up Message
                  </label>
                  {followUpRemark?.trim() && (
                    <button
                      type="button"
                      onClick={handleClearMessage}
                      className="text-[9px] font-black uppercase tracking-wider text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <textarea
                  rows="5"
                  placeholder="Pick a template above or type your own message..."
                  value={followUpRemark || ""}
                  onChange={handleFollowUpMessageChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none resize-none focus:border-[#1a5695] focus:bg-white transition-all"
                />
                <div className="flex items-center justify-between px-1">
                  <p className="text-[10px] text-slate-400">
                    {followUpTemplateId
                      ? "Using a saved template"
                      : "Custom message"}
                  </p>
                  <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                    {followUpRemark?.length || 0} chars
                  </span>
                </div>
              </div>

              {/* INFO STRIP */}
              <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100 text-[11px] text-slate-600 flex items-center gap-2">
                <Clock size={14} className="text-[#1a5695] shrink-0" />
                <span>
                  A WhatsApp message will be delivered automatically at the
                  scheduled time.
                </span>
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3 shrink-0">
              <button
                type="button"
                onClick={closeFollowUpModal}
                className="flex-1 px-6 py-3 rounded-2xl font-bold text-slate-400 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitFollowUp}
                disabled={
                  followUpLoading ||
                  !followUpRemark?.trim() ||
                  !followUpDateTime ||
                  !/^[1-9][0-9]{7,14}$/.test(followUpNumber)
                }
                className="flex-[2] px-6 py-3 rounded-2xl font-bold text-white bg-[#f39200] shadow-lg shadow-orange-500/20 hover:bg-[#e08600] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100 cursor-pointer"
              >
                {followUpLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Schedule Follow-up
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

export default Leads;
