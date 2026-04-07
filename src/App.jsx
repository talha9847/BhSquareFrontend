import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LogIn } from "lucide-react";
import Login from "./components/frontweb/Login";
import FrontWeb from "./components/frontweb/FrontWeb";
import Dashboard from "./components/crm/Dashboard";
import Leads from "./components/crm/Leads";
import Customer from "./components/crm/Customer";
import DocumentCollection from "./components/crm/DocumentCollection";
import Registration from "./components/crm/Registration";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DocumentCollectionGuard from "./Guards/DocumentCollectionGuard";
import NameChange from "./components/crm/NameChange";
import NameChangeGuard from "./Guards/NameChangeGuard";
import KitReady from "./components/crm/KitReady";
import LoanStep from "./components/crm/LoanStep";
import InventoryManager from "./components/crm/InventoryManger";
import BrandManager from "./components/crm/BrandManager";
import PrepareKit from "./components/crm/PrepareKit";
import Dispatch from "./components/crm/Dispatch";
import Fabrication from "./components/crm/Fabrication";
import FabricatorManager from "./components/crm/FabricatorManager";
import Wiring from "./components/crm/Wiring";
import TechnicianManager from "./components/crm/TechnicianManager";
import WiringInventory from "./components/crm/WiringInventory";
import UpdateWiringLog from "./components/crm/UpdateWiringLog";
import Drivers from "./components/crm/Driver";
import Cars from "./components/crm/Cars";
import FinalStage from "./components/crm/FinalStage";
import CustomerMaster from "./components/crm/CustomerMaster";
import AllCustomers from "./components/crm/AllCustomers";
import RegistrationsManager from "./components/crm/RegistrationsManager";
import AllKitReady from "./components/crm/AllKitReady";
import AllDispatch from "./components/crm/AllDispatch";
import CategoryManager from "./components/crm/CategoryManager";
import FinalizeWiring from "./components/crm/FinalizeWiring";
import UserManagement from "./components/crm/UserManagement";
import ProtectedRoute from "./Guards/ProtectedRoute";
import NotFound from "./Guards/NotFound";
import TWiring from "./components/Technician/TWiring";
import FFabrication from "./components/Fabricator/FFabrication";
import Sources from "./components/crm/Sources";
import SLeads from "./components/Source/SLeads";
import SCustomerMaster from "./components/Source/SCustomerMaster";
import SCustomers from "./components/Source/Scustomer";
import Permissions from "./components/crm/Permissions";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FrontWeb />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Leads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/source/leads"
            element={
              <ProtectedRoute allowedRoles={["source"]}>
                <SLeads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sources"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Sources />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Customer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/permissions"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Permissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/source/customers"
            element={
              <ProtectedRoute allowedRoles={["source"]}>
                <SCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allcustomers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kitready"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <KitReady />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allkitready"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllKitReady />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loanstep"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <LoanStep />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <InventoryManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brands"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <BrandManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CategoryManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/preparekit"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <PrepareKit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dispatch"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dispatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alldispatch"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllDispatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fabrication"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Fabrication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fabricator/fabrication"
            element={
              <ProtectedRoute allowedRoles={["fabricator"]}>
                <FFabrication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fabricators"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <FabricatorManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wiring"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Wiring />
              </ProtectedRoute>
            }
          />
          <Route
            path="/technician/wiring"
            element={
              <ProtectedRoute allowedRoles={["technician"]}>
                <TWiring />
              </ProtectedRoute>
            }
          />
          <Route
            path="/technicians"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TechnicianManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/winventory"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <WiringInventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updatewiring"
            element={
              <ProtectedRoute allowedRoles={["admin", "technician"]}>
                <UpdateWiringLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finalizewiring"
            element={
              <ProtectedRoute allowedRoles={["admin", "technician"]}>
                <FinalizeWiring />
              </ProtectedRoute>
            }
          />
          <Route
            path="/drivers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Drivers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cars"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Cars />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finalstage"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <FinalStage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/master"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CustomerMaster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/source/master"
            element={
              <ProtectedRoute allowedRoles={["source"]}>
                <SCustomerMaster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/namechange"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <NameChangeGuard>
                  <NameChange />
                </NameChangeGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/documentcollection"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DocumentCollectionGuard>
                  <DocumentCollection />
                </DocumentCollectionGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/registration"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Registration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allregistration"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <RegistrationsManager />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
