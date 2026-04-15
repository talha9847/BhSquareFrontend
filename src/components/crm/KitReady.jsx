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
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";

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
      const res = await axios.get(`/api/kitready/fetchKitReadyCustomers`, {
        withCredentials: true,
      });
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
      console.error("Fetch error:", error);
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
      console.error("Fetch error:", error);
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
      if (item.file_gen == "pending") {
        console.log("you got me right");
        console.log(item.customer.lead);
        let customerId = item.customer.id;
        let leadId = item.customer.lead.id;
        let registrationId = item.customer.registration.id;
        let kitId = item.id;

        setKId(kitId);
        setRId(registrationId);
        setLId(leadId);
        setCId(customerId);

        rs1({
          inverter_capacity: item.customer.lead.inverter_capacity,
          panel_capacity: item.customer.lead.panel_wattage,
          panel_qty: item.customer.lead.number_of_panels,
          inverter_qty: item.customer.lead.number_of_inverters,
        });
        setIsFinalizeModalOpen(true);
      } else {
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
          navigate(loan_status === "required" ? "/loanstep" : "/preparekit", {
            state: {
              customerId: customerId,
              leadId: leadId,
            },
          });
        }
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

  const confirmFinalize = async (data) => {
    console.log(data);
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
      console.error("❌ API Error:", error);

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
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/kitready/updateLoan`,
        {
          customerId: selectedCustomer.customer.id,
          loanRequired: loanRequired,
        },
        { withCredentials: true },
      );
      if (res.status === 200) {
        getCustomers();
        toast.success("Status updated successfully");
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("Error updating status");
    } finally {
      setLoading(false);
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
                              <div className="w-10 h-10 bg-blue-50 text-[#1a5695] rounded-2xl flex items-center justify-center font-black border border-blue-100 uppercase">
                                {c.customer.lead.customer_name.charAt(0)}
                              </div>
                              <div>
                                <p
                                  onClick={() => {
                                    console.log(c.customer);
                                    navigate("/master", {
                                      state: {
                                        customerId: c.customer.id,
                                        leadId: c.customer.lead.id,
                                      },
                                    });
                                  }}
                                  className="font-bold text-slate-800 text-sm cursor-pointer"
                                >
                                  {c.customer.lead.customer_name}
                                </p>
                                <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                                  <MapPin size={10} /> {c.customer.lead.address}
                                </div>
                              </div>
                            </div>
                          </td>

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
                              {console.log(c)}
                            </span>
                          </td>

                          {/* CONSOLIDATED ACTION BUTTON */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end">
                              {c.file_gen == "pending" && (
                                <button
                                  className="group/btn flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1a5695] hover:text-white transition-all border border-slate-200 shadow-sm"
                                  onClick={() => {
                                    insertKit(
                                      c.customer.id,
                                      c.loan_status,
                                      c.customer.lead?.id,
                                      c,
                                    );
                                  }}
                                >
                                  {naviLoad ? (
                                    <>Going.....</>
                                  ) : (
                                    <>
                                      <Package size={14} /> Finalize
                                    </>
                                  )}
                                </button>
                              )}

                              {!c.loan_status || c.loan_status === "pending" ? (
                                <button
                                  onClick={() => {
                                    setSelectedCustomer(c);
                                    setIsModalOpen(true);
                                  }}
                                  className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#1a5695] hover:bg-white hover:shadow-md rounded-xl transition-all border border-slate-100"
                                >
                                  <Edit3 size={16} />
                                </button>
                              ) : c.loan_status === "required" ? (
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
                                      <Banknote size={14} /> Go For Loan
                                    </>
                                  )}
                                  <ChevronRight
                                    size={14}
                                    className="group-hover/btn:translate-x-1 transition-transform"
                                  />
                                </button>
                              ) : c.file_gen === "done" ? (
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
                              ) : null}

                              {c.loan_status == "completed" ? (
                                <>
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
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          </td>
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
                  onClick={handleUpdateStatus}
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
