import React, { useEffect, useState } from "react";
import { Search, MapPin, Banknote, Loader2, Package } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoanPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loans, setLoans] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  // --------------------------------------------------
  // GET LOAN DATA
  // --------------------------------------------------

  const getLoanData = async () => {
    try {
      setPageLoading(true);

      const res = await axios.get(`/api/kitready/getLoanData`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        console.log(res.data.data.data);
        setLoans(res.data.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching loan data:", error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getLoanData();
  }, []);

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredLoans = loans.filter((item) => {
    const name = item.customer?.lead?.customer_name || "";
    const phone = item.customer?.lead?.contact_number || "";
    const address = item.customer?.lead?.address || "";

    const search = searchQuery.toLowerCase();

    return (
      name.toLowerCase().includes(search) ||
      phone.includes(search) ||
      address.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Loans"
      />

      {/* MAIN */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* NAVBAR */}
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          {/* PAGE HEADER */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight font-syne uppercase">
              Loan Management
            </h1>

            <p className="text-sm text-slate-500">
              Manage customers with pending loan requirements
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Search customers..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#1a5695] outline-none text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            {pageLoading ? (
              /* LOADING */
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin mb-4" />

                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Fetching Loan Records
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  {/* TABLE HEADER */}
                  <thead className="bg-slate-50/50">
                    <tr className="whitespace-nowrap">
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Customer
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                        Contact
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                        Loan Status
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                        Kit Status
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>

                  {/* TABLE BODY */}
                  <tbody className="divide-y divide-slate-50">
                    {filteredLoans.length > 0 ? (
                      filteredLoans.map((item) => {
                        const customer = item.customer;
                        const lead = customer?.lead;

                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            {/* CUSTOMER */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {/* AVATAR */}
                                <div className="w-10 h-10 bg-blue-50 text-[#1a5695] rounded-2xl flex items-center justify-center font-black border border-blue-100 uppercase">
                                  {lead?.customer_name?.charAt(0) || "?"}
                                </div>

                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold text-slate-800 text-sm leading-tight">
                                      {lead?.customer_name || "N/A"}
                                    </p>
                                  </div>

                                  {/* ADDRESS */}
                                  <div className="flex items-center gap-1 text-slate-400 text-[11px] mt-0.5">
                                    <MapPin size={10} />

                                    <span className="truncate max-w-[250px]">
                                      {lead?.address || "Address not available"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* CONTACT */}
                            <td className="px-6 py-4 text-center">
                              <span className="text-[11px] font-bold text-slate-600">
                                {lead?.contact_number || "N/A"}
                              </span>
                            </td>

                            {/* LOAN STATUS */}
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 text-[9px] font-black uppercase rounded-lg border border-amber-100">
                                <Banknote size={10} />
                                Loan Pending
                              </span>
                            </td>

                            {/* KIT STATUS */}
                            <td className="px-6 py-4 text-center">
                              <span
                                className={`text-[10px] font-black uppercase tracking-widest ${
                                  item.status === "done"
                                    ? "text-emerald-600"
                                    : "text-slate-400"
                                }`}
                              >
                                {item.status === "done"
                                  ? "Dispatched"
                                  : "Pending"}
                              </span>
                            </td>

                            {/* CUSTOMER ID */}
                            <td className="px-6 py-4 text-right">
                              <span className="text-[10px] font-black text-slate-400 uppercase">
                                <button
                                  onClick={() => {
                                    console.log(lead);
                                    navigate("/loanstep", {
                                      state: {
                                        customerId: customer?.id,
                                        leadId: customer?.lead?.id,
                                      },
                                    });
                                  }}
                                  className="p-3"
                                >
                                  {item.loan_status == "pending"
                                    ? "Apply For Loan"
                                    : "See Loan"}
                                </button>
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      /* NO DATA */
                      <tr>
                        <td colSpan="5" className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="bg-slate-100 p-4 rounded-full mb-4">
                              <Package className="w-8 h-8 text-slate-300" />
                            </div>

                            <p className="text-slate-800 font-bold text-sm">
                              No Loan Records Found
                            </p>

                            <p className="text-slate-400 text-[11px] uppercase tracking-widest mt-1">
                              No customers currently have a pending loan
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
    </div>
  );
};

export default LoanPage;
