import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/crm/Navbar";
import Sidebar from "../components/crm/Sidebar";
import { Loader2 } from "lucide-react";

const DocumentCollectionGuard = ({ children }) => {
  const location = useLocation();

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
        const res = await axios.get(
          `${apiUrl}/api/docs/checkDocumentCollectionAccess/${customerId}`,
        );

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

  if (!allowed) return <Navigate to="/customers" replace />;

  return children;
};

export default DocumentCollectionGuard;
