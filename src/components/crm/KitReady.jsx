import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Edit3,
  X,
  Package,
  Check,
  Loader2,
  ChevronRight,
  CreditCard,
  Banknote,
  CheckCircle,
  Clock,
  ArrowRightLeft,
  Trash2,
  Edit3Icon,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const KitReady = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [panels, setPanels] = useState([]);
  const [inverters, setInverters] = useState([]);
  const [brands, setBrands] = useState([{}]);
  const [load, setLoad] = useState(false);
  const [rId, setRId] = useState(0);
  const [kId, setKId] = useState(0);
  const [cId, setCId] = useState(0);
  const [lId, setLId] = useState(0);

  // MODAL STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loanRequired, setLoanRequired] = useState(false);
  const [loading, setLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState("pending");

  // DATA STATE
  const [customers, setCustomers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [naviLoad, setNaviLoad] = useState(false);
  const {
    register: re1,
    handleSubmit: hs1,
    reset: rs1,
    watch,
    formState: { errors: errors1 },
  } = useForm();

  const getCustomers = async () => {
    try {
      setPageLoading(true);
      // Passing the status filter to your API
      const res = await axios.get(
        `/api/kitready/fetchKitReadyCustomers?status=${statusFilter}`,
        {
          withCredentials: true,
        },
      );
      if (res.status === 200) {
        setCustomers(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  const getPanels = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/registrations/getInventoryByCategory`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setPanels(res.data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const getInverters = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/registrations/getInventoryByCategoryThree`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        setInverters(res.data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const selectedBrand = watch("panel_brand_id");
  const selectedInverterBrand = watch("inverter_brand_id");

  const fileteredPanel = panels.filter(
    (panel) => panel.brand.id === Number(selectedBrand),
  );
  const fileteredInverter = inverters.filter(
    (inv) => inv.brand.id === Number(selectedInverterBrand),
  );

  const insertKit = async (customerId, loan_status, leadId, item) => {
    try {
      setNaviLoad(true);
      const res = await axios.post(
        `/api/kitready/addKitItems`,
        {
          customerId,
        },
        { withCredentials: true },
      );
      if (res.status == 200 || res.status == 210) {
        setNaviLoad(false);
        navigate("/preparekit", {
          state: {
            customerId: customerId,
            leadId: leadId,
          },
        });
      }
    } catch (error) {
      setNaviLoad(false);
    }
  };

  const getBrands = async () => {
    try {
      const res = await axios.get(`/api/kitready/getAllBrands`, {
        withCredentials: true,
      });
      if (res.status == 200) {
        setBrands(res.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getCustomers();
    getPanels();
    getInverters();
    getBrands();
  }, []);

  useEffect(() => {
    getCustomers();
  }, [statusFilter]);

  const handleDelete = async (id) => {
    console.log(id);
    const result = await Swal.fire({
      title: "ARE YOU SURE?",
      text: "This action will permanently delete this kit record. This cannot be undone!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // Rose-600
      cancelButtonColor: "#f1f5f9",
      confirmButtonText: "YES, DELETE PERMANENTLY",
      cancelButtonText: "CANCEL",
      customClass: {
        confirmButton:
          "rounded-xl font-black text-[10px] uppercase tracking-widest px-6 py-3",
        cancelButton:
          "rounded-xl font-black text-[10px] uppercase tracking-widest px-6 py-3 text-slate-500",
        popup: "rounded-[40px] border-none shadow-2xl font-syne",
      },
    });
    if (result.isConfirmed) {
      // Show Loader
      Swal.fire({
        title: "DELETING...",
        html: "Removing record from database",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        const res = await axios.delete(
          `/api/kitready/deleteCustomerData/${id}`,
          {
            withCredentials: true,
          },
        );
        if (res.status === 200) {
          Swal.fire({
            title: "DELETED!",
            text: "The kit record has been removed.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            customClass: {
              popup: "rounded-[40px] font-syne",
            },
          });
          getCustomers(); // Refresh the table
        }
      } catch (error) {
        Swal.fire({
          title: "ACTION FAILED",
          text: error.response?.data?.message || "Could not delete the record.",
          icon: "error",
          confirmButtonColor: "#1a5695",
        });
      }
    }
  };
  const handleEdit = async (id, currentNote) => {
    const { value: text } = await Swal.fire({
      title: "UPDATE NOTE",
      input: "textarea",
      inputLabel: "Project Remarks",
      inputValue: currentNote,
      inputPlaceholder: "Enter project notes or updates here...",
      showCancelButton: true,
      confirmButtonText: "UPDATE NOTE",
      cancelButtonText: "CANCEL",
      reverseButtons: true,
      confirmButtonColor: "#1a5695", // Lapis Blue
      inputAttributes: {
        "aria-label": "Type your note here",
      },
      customClass: {
        popup: "rounded-[32px] border-none shadow-2xl font-syne",
        confirmButton:
          "rounded-xl font-black text-[10px] uppercase tracking-widest px-8 py-4",
        cancelButton:
          "rounded-xl font-black text-[10px] uppercase tracking-widest px-8 py-4 text-slate-500",
        input:
          "rounded-2xl border-slate-200 text-sm focus:ring-[#1a5695] focus:border-[#1a5695]",
      },
      // The "PreConfirm" handles the loader and the API call
      showLoaderOnConfirm: true,
      preConfirm: async (newNote) => {
        try {
          const response = await axios.put(
            `/api/kitready/updateKitReadyNote/${id}`,
            { note: newNote },
            { withCredentials: true },
          );
          return response.data;
        } catch (error) {
          Swal.showValidationMessage(
            `Request failed: ${error.response?.data?.message || error.message}`,
          );
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (text) {
      Swal.fire({
        title: "UPDATED!",
        text: "The note has been saved successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-[32px]",
        },
      });
      getCustomers(); // Refresh your list
    }
  };
  const handleDelay = async (id, status) => {
    const result = await Swal.fire({
      title: `Move to ${status}?`,
      text: `This will move the kit to the ${status} status.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1a5695",
      cancelButtonColor: "#f1f5f9",
      confirmButtonText: `YES, ${status} IT`,
      cancelButtonText: "CANCEL",
      customClass: {
        confirmButton:
          "rounded-xl font-bold text-[10px] uppercase tracking-widest px-6 py-3",
        cancelButton:
          "rounded-xl font-bold text-[10px] uppercase tracking-widest px-6 py-3 text-slate-500",
        popup: "rounded-[32px] border-none shadow-2xl",
      },
    });

    if (result.isConfirmed) {
      // Show Loading state
      Swal.fire({
        title: "Processing...",
        html: "Updating kit status, please wait.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        // API Call
        const res = await axios.post(
          `/api/kitready/updateKitReadyStatusDelay/${id}`,
          { status: status },
          { withCredentials: true },
        );

        if (res.status === 200) {
          Swal.fire({
            title: "Moved!",
            text: "The kit has been moved to delay.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          getCustomers(); // Refresh the list
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Something went wrong",
          icon: "error",
        });
      }
    }
  };
  const confirmFinalize = async (data) => {
    try {
      if (rId > 0 && cId > 0 && lId > 0 && kId > 0) {
        setLoad(true);
        const res = await axios.post(
          `/api/registrations/markRegistrationAsDone`,
          {
            registrationId: rId,
            data: data,
            customerId: cId,
            leadId: lId,
            kitId: kId,
          },
          { withCredentials: true },
        );
        if (res.status === 200) {
          getCustomers();
          toast.success(res.data.message || "Done");
          setIsFinalizeModalOpen(false);
        }
      }
    } catch (error) {
      // 🔴 Extract backend message safely
      const message =
        error?.response?.data?.message || // your controller sends this
        error?.response?.data?.error || // fallback
        error.message || // axios/network error
        "Something went wrong";

      toast.error(message);
    } finally {
      setLoad(false);
    }
  };

  const handleUpdateStatus = async () => {
    // setLoading(true);
    console.log(selectedCustomer);
    console.log(selectedCustomer.customer.id);
    console.log(selectedCustomer.customer.lead.id);
    try {
      const res = await axios.post(
        `/api/kitready/updateLoan`,
        {
          customerId: selectedCustomer.customer.id,
          loanRequired: loanRequired,
        },
        { withCredentials: true },
      );
      if (res.status === 200 && loanRequired) {
        navigate("/loanstep", {
          state: {
            customerId: selectedCustomer.customer.id,
            leadId: selectedCustomer.customer.lead.id,
          },
        });
      }
    } catch (error) {
      toast.error("Error updating status");
    } finally {
      setLoading(false);
      getCustomers();
      setIsModalOpen(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (!c.customer?.lead) return false;
    const name = c.customer.lead.customer_name || "";
    const phone = c.customer.lead.contact_number || "";
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Kit Ready"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight font-syne uppercase flex items-center gap-3">
              Kit Readiness{" "}
              <button
                onClick={() => {
                  navigate("/allkitready");
                }}
                className="flex items-center gap-1 bg-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded-full hover:bg-slate-300 transition-all cursor-pointer"
              >
                SHOW ALL KITS INFO <ChevronRight size={12} />
              </button>
            </h1>
            <p className="text-sm text-slate-500">
              Manage material kits and financing status
            </p>
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-[22px] w-fit border border-slate-200">
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                statusFilter === "pending"
                  ? "bg-white text-[#1a5695] shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Pending Kits
            </button>
            <button
              onClick={() => setStatusFilter("delay")}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                statusFilter === "delay"
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Delayed / Hold
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table Container */}
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
                    <tr className="whitespace-nowrap">
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Customer
                      </th>

                      {statusFilter == "delay" && (
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                          Note
                        </th>
                      )}
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                        Loan Status
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                        Kit Status
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                        Stage Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((c) => (
                        <tr
                          key={c.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {/* Avatar */}
                              <div className="w-10 h-10 bg-blue-50 text-[#1a5695] rounded-2xl flex items-center justify-center font-black border border-blue-100 uppercase">
                                {String(
                                  c.customer.registration.file_generation
                                    ?.cs_no ?? "",
                                ).slice(0, 3)}
                              </div>

                              <div>
                                {/* Name & Badge Row */}
                                <div className="flex items-center gap-2">
                                  <p
                                    onClick={() => {
                                      navigate("/master", {
                                        state: {
                                          customerId: c.customer.id,
                                          leadId: c.customer.lead.id,
                                        },
                                      });
                                    }}
                                    className="font-bold text-slate-800 text-sm cursor-pointer hover:text-[#1a5695] transition-colors leading-tight"
                                  >
                                    {c.customer.lead.customer_name}
                                  </p>

                                  {/* Colorful Short-form Badge */}
                                  <span
                                    className={`
                                        text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border
                                        ${
                                          c.customer.lead.installation_type ===
                                          "Residential"
                                            ? "bg-blue-50 text-blue-600 border-blue-100"
                                            : c.customer.lead
                                                  .installation_type ===
                                                "Commercial"
                                              ? "bg-purple-50 text-purple-600 border-purple-100"
                                              : c.customer.lead
                                                    .installation_type ===
                                                  "Industrial"
                                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                                : "bg-slate-50 text-slate-400 border-slate-100"
                                        }
                                        `}
                                  >
                                    {c.customer.lead.installation_type?.substring(
                                      0,
                                      3,
                                    )}
                                  </span>
                                </div>

                                {/* Address Row */}
                                <div className="flex items-center gap-1 text-slate-400 text-[11px] mt-0.5">
                                  <MapPin size={10} />
                                  <span className="truncate max-w-[200px]">
                                    {c.customer.lead.address}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {statusFilter == "delay" && (
                            <td className="px-6 py-5 text-[12px] text-center">
                              {c.note}
                            </td>
                          )}

                          {/* LOAN STATUS */}
                          <td className="px-6 py-4 text-center">
                            {!c.loan_status || c.loan_status === "pending" ? (
                              <span className="text-slate-300 text-[10px] font-bold uppercase italic">
                                Pending Setup
                              </span>
                            ) : c.loan_status === "required" ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-black uppercase rounded-lg border border-amber-100">
                                <Banknote size={10} /> Loan Required
                              </span>
                            ) : (
                              <span className="text-emerald-600 text-[10px] font-black uppercase tracking-tighter">
                                {c.loan_status == "completed"
                                  ? "Loan Done"
                                  : "Not applicable"}
                              </span>
                            )}
                          </td>

                          {/* KIT STATUS */}
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`text-[10px] font-black uppercase tracking-widest ${c.status === "done" ? "text-emerald-600" : "text-slate-400"}`}
                            >
                              {c.status === "done" ? "Dispatched" : "Pending"}
                            </span>
                          </td>

                          {/* CONSOLIDATED ACTION BUTTON */}
                          {c.status == "pending" && (
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                {(c.file_gen === "pending" ||
                                  c.file_gen == "partial") && (
                                  <button
                                    onClick={() => {
                                      let customerId = c.customer.id;
                                      let leadId = c.customer.lead.id;
                                      let registrationId =
                                        c.customer.registration.id;
                                      let kitId = c.id;

                                      setKId(kitId);
                                      setRId(registrationId);
                                      setLId(leadId);
                                      setCId(customerId);

                                      rs1({
                                        inverter_capacity:
                                          c.customer.lead.inverter_capacity,
                                        panel_capacity:
                                          c.customer.lead.panel_wattage,
                                        panel_qty:
                                          c.customer.lead.number_of_panels,
                                        inverter_qty:
                                          c.customer.lead.number_of_inverters,
                                      });
                                      setIsFinalizeModalOpen(true);
                                    }}
                                    className="group/btn flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1a5695] hover:text-white transition-all border border-slate-200 shadow-sm"
                                  >
                                    <>
                                      <Package size={14} /> Finalize
                                    </>
                                  </button>
                                )}

                                {/* ✏️ EDIT */}
                                <button
                                  onClick={() => {
                                    insertKit(
                                      c.customer.id,
                                      c.loan_status,
                                      c.customer.lead?.id,
                                      c,
                                    );
                                  }}
                                  className="group/btn flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1a5695] hover:text-white transition-all border border-slate-200 shadow-sm"
                                >
                                  {naviLoad ? (
                                    <>Going.....</>
                                  ) : (
                                    <>
                                      <Package size={14} /> Go For Kit
                                    </>
                                  )}
                                  <ChevronRight
                                    size={14}
                                    className="group-hover/btn:translate-x-1 transition-transform"
                                  />
                                </button>

                                {/* 👀 SEE LOAN */}
                                {/* {c.loan_status === "completed" && (
                                  <button
                                    onClick={() => {
                                      navigate("/loanstep", {
                                        state: {
                                          customerId: c.customer.id,
                                          leadId: c.customer.lead?.id,
                                        },
                                      });
                                    }}
                                    className="group/btn flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1a5695] hover:text-white transition-all border border-slate-200 shadow-sm"
                                  >
                                    See Loan
                                  </button>
                                )} */}

                                <button
                                  onClick={() => handleDelay(c.id, "delay")}
                                  title="Mark as Delayed"
                                  className="p-2.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-xl transition-all border border-amber-100"
                                >
                                  <Clock size={16} />
                                </button>
                              </div>
                            </td>
                          )}

                          {c.status == "delay" && (
                            <td className="px-6 py-4">
                              <div className="flex justify-end items-center gap-2">
                                {/* DELAY / MOVE ACTION */}

                                <button
                                  onClick={() => handleEdit(c.id, c.note)}
                                  title="Delete Record"
                                  className="p-2.5 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all border border-rose-100 flex items-center justify-center group/del relative"
                                >
                                  <Edit3Icon size={16} />
                                  {/* Tooltip */}
                                  <span className="absolute bottom-full mb-2 hidden group-hover/del:block bg-blue-600 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap uppercase tracking-wider font-bold z-10 shadow-lg">
                                    Edit
                                  </span>
                                </button>

                                <button
                                  onClick={() => handleDelay(c.id, "pending")}
                                  title="Move to Delayed"
                                  className="p-2.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-xl transition-all border border-amber-100 flex items-center justify-center group/delay relative"
                                >
                                  <ArrowRightLeft size={16} />
                                  {/* Tooltip */}
                                  <span className="absolute bottom-full mb-2 hidden group-hover/delay:block bg-slate-800 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap uppercase tracking-wider font-bold z-10 shadow-lg">
                                    Move to Delay
                                  </span>
                                </button>

                                {/* DELETE ACTION */}
                                <button
                                  onClick={() => handleDelete(c.customer?.id)}
                                  title="Delete Record"
                                  className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-rose-100 flex items-center justify-center group/del relative"
                                >
                                  <Trash2 size={16} />
                                  {/* Tooltip */}
                                  <span className="absolute bottom-full mb-2 hidden group-hover/del:block bg-rose-600 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap uppercase tracking-wider font-bold z-10 shadow-lg">
                                    Delete
                                  </span>
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      /* NO DATA FOUND ROW */
                      <tr>
                        <td colSpan="4" className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="bg-slate-100 p-4 rounded-full mb-4">
                              <Package className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-800 font-bold text-sm">
                              No Records Found
                            </p>
                            <p className="text-slate-400 text-[11px] uppercase tracking-widest mt-1">
                              Try adjusting your search or filters
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

      {/* LOAN REQUIREMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-[#1a5695] p-8 text-white flex justify-between items-center relative">
              <div className="relative z-10">
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Financing Setup
                </h2>
                <p className="text-blue-100/60 text-[10px] font-bold uppercase mt-1">
                  Set payment for{" "}
                  {selectedCustomer?.customer.lead.customer_name}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="relative z-10 p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <div
                  className={`p-6 rounded-[32px] border transition-all duration-500 ${loanRequired ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-2xl shadow-sm transition-colors ${loanRequired ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"}`}
                      >
                        {loanRequired ? (
                          <Banknote size={20} />
                        ) : (
                          <CreditCard size={20} />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 uppercase">
                          Is Loan Required?
                        </p>
                        <p
                          className={`text-[10px] font-bold uppercase tracking-widest ${loanRequired ? "text-amber-600" : "text-emerald-600"}`}
                        >
                          {loanRequired ? "Financing Needed" : "Direct Payment"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setLoanRequired(!loanRequired)}
                      className={`w-14 h-7 rounded-full transition-all flex items-center px-1.5 ${loanRequired ? "bg-amber-500 justify-end" : "bg-slate-200 justify-start"}`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleUpdateStatus();
                  }}
                  disabled={loading}
                  className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-[#15467a] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" /> Updating...
                    </>
                  ) : (
                    <>
                      <Check size={16} /> Confirm Selection
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isFinalizeModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm text-syne">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[92vh]">
            {/* Visual Header */}
            <div className="bg-emerald-50 p-6 flex flex-col items-center text-center shrink-0">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 border border-emerald-100">
                <CheckCircle className="text-emerald-500" size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                Technical Finalization
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                Provide final system specifications
              </p>
            </div>

            <form
              onSubmit={hs1(confirmFinalize)}
              className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Consumer Number */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Consumer No (CS_NO)
                  </label>
                  <input
                    {...re1("cs_no", {
                      required: "Consumer number is required",
                    })}
                    className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl font-bold text-sm outline-none transition-all ${errors1.cs_no ? "border-red-200 bg-red-50" : "border-slate-100 focus:border-[#1a5695] focus:bg-white"}`}
                    placeholder="Enter CS Number"
                  />
                  {errors1.cs_no && (
                    <p className="text-[9px] text-red-500 font-bold italic ml-1 uppercase">
                      {errors1.cs_no.message}
                    </p>
                  )}
                </div>

                {/* Panel Brand */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Panel Brand
                  </label>
                  <select
                    {...re1("panel_brand_id", {
                      required: "Panel brand is required",
                    })}
                    name="panel_brand_id"
                    id=""
                    className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl font-bold text-sm outline-none transition-all ${errors1.panel_brand_id ? "border-red-200 bg-red-50" : "border-slate-100 focus:border-[#1a5695] focus:bg-white"}`}
                  >
                    <option value="">-- Select Panel Brand --</option>
                    {brands.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                  {/* <input
                    {...re1("panel_brand", {
                      required: "Panel brand is required",
                    })}
                    
                    placeholder="e.g. Waaree, Adani"
                  /> */}
                  {errors1.panel_brand && (
                    <p className="text-[9px] text-red-500 font-bold italic ml-1 uppercase">
                      {errors1.panel_brand.message}
                    </p>
                  )}
                </div>

                {/* Inverter Brand */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Inverter Brand
                  </label>

                  <select
                    {...re1("inverter_brand_id", {
                      required: "Panel brand is required",
                    })}
                    name="inverter_brand_id"
                    id=""
                    className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl font-bold text-sm outline-none transition-all ${errors1.inverter_brand_id ? "border-red-200 bg-red-50" : "border-slate-100 focus:border-[#1a5695] focus:bg-white"}`}
                  >
                    <option value="">-- Select Inverter Brand --</option>
                    {brands.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                  {/* <input
                    {...re1("inverter_brand", {
                      required: "Inverter brand is required",
                    })}
                    className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl font-bold text-sm outline-none transition-all ${errors1.inverter_brand ? "border-red-200 bg-red-50" : "border-slate-100 focus:border-[#1a5695] focus:bg-white"}`}
                    placeholder="e.g. Growatt, Solis"
                  /> */}
                  {errors1.inverter_brand && (
                    <p className="text-[9px] text-red-500 font-bold italic ml-1 uppercase">
                      {errors1.inverter_brand.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Select Panel
                  </label>

                  <select
                    name="panel_id"
                    {...re1("panel_id", {
                      required: "Panel is required",
                    })}
                    className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl font-bold text-sm outline-none transition-all ${errors1.panel ? "border-red-200 bg-red-50" : "border-slate-100 focus:border-[#1a5695] focus:bg-white"}`}
                  >
                    <option value="">-- Select Panel --</option>
                    {fileteredPanel.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} {e.brand.name} ({e.qty})
                      </option>
                    ))}
                  </select>
                  {errors1.panel_id && (
                    <p className="text-[9px] text-red-500 font-bold italic ml-1 uppercase">
                      {errors1.panel_id.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Select Inverter
                  </label>

                  <select
                    {...re1("inverter_id", {
                      required: "Inverter is required",
                    })}
                    name="inverter_id"
                    className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl font-bold text-sm outline-none transition-all ${errors1.panel ? "border-red-200 bg-red-50" : "border-slate-100 focus:border-[#1a5695] focus:bg-white"}`}
                  >
                    <option value="">-- Select Inveter --</option>
                    {fileteredInverter.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} {e.brand.name} ({e.qty})
                      </option>
                    ))}
                  </select>
                  {errors1.inverter_id && (
                    <p className="text-[9px] text-red-500 font-bold italic ml-1 uppercase">
                      {errors1.inverter_id.message}
                    </p>
                  )}
                </div>

                {/* Inverter Capacity */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Panel Capacity
                  </label>
                  <input
                    {...re1("panel_capacity", {
                      required: "Capacity is required",
                    })}
                    readOnly
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-400 text-sm cursor-not-allowed"
                  />
                  {/* {errors1.inverter_capacity && (
                    <p className="text-[9px] text-red-500 font-bold italic ml-1 uppercase">
                      {errors1.inverter_capacity.message}
                    </p>
                  )} */}
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Inverter Capacity
                  </label>
                  <input
                    {...re1("inverter_capacity", {
                      required: "Capacity is required",
                    })}
                    readOnly
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-400 text-sm cursor-not-allowed"
                  />
                  {/* {errors1.inverter_capacity && (
                    <p className="text-[9px] text-red-500 font-bold italic ml-1 uppercase">
                      {errors1.inverter_capacity.message}
                    </p>
                  )} */}
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Panel Quantity
                  </label>
                  <input
                    {...re1("panel_qty", {
                      required: "Capacity is required",
                    })}
                    readOnly
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-400 text-sm cursor-not-allowed"
                  />
                  {/* {errors1.inverter_capacity && (
                    <p className="text-[9px] text-red-500 font-bold italic ml-1 uppercase">
                      {errors1.inverter_capacity.message}
                    </p>
                  )} */}
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Inverter Quantity
                  </label>
                  <input
                    {...re1("inverter_qty", {
                      required: "Capacity is required",
                    })}
                    readOnly
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-400 text-sm cursor-not-allowed"
                  />
                  {/* {errors1.inverter_capacity && (
                    <p className="text-[9px] text-red-500 font-bold italic ml-1 uppercase">
                      {errors1.inverter_capacity.message}
                    </p>
                  )} */}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                >
                  {load ? "Confirming...." : "Confirm & Mark as Done"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsFinalizeModalOpen(false);
                    rs1();
                  }}
                  className="w-full py-4 bg-white text-slate-400 border border-slate-100 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitReady;
