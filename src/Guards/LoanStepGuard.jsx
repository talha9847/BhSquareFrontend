import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/crm/Navbar";
import Sidebar from "../components/Source/Sidebar";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/authContext";

const LoanStepGuard = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  // FIX 1: correct key
  const customerId = location.state?.customerId;

  const [allowed, setAllowed] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!customerId) {
      setAllowed(false);
      return;
    }

    const checkAccess = async () => {
      try {
        // FIX 2: pass customerId to backend
        const res = await axios.get(`/api/loan/checkLoanAccess/${customerId}`, {
          withCredentials: true,
        });

        setAllowed(res.data.success);
      } catch (error) {
        setAllowed(false);
      }
    };

    checkAccess();
  }, [customerId]);

  if (allowed === null)
    return (
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <div className="flex items-center justify-center h-[80vh]">
            <Loader2 className="w-10 h-10 animate-spin text-gray-600" />
          </div>
        </div>
      </div>
    );

  if (!allowed) {
    if (user.role == "source") {
      return <Navigate to="/source/customers" replace />;
    }
    if (user.role == "admin") {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default LoanStepGuard;
