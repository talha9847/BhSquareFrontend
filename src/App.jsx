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
import Permissions from "./components/crm/Permissions";
import SCustomers from "./components/Source/SCustomers";
import SNameChange from "./components/Source/SNameChange";
import SourceGuard from "./Guards/SourceGuard";
import SDocumentCollection from "./components/Source/SDocumentCollection";
import SLoanStep from "./components/Source/SLoanStep";
import LoanStepGuard from "./Guards/LoanStepGuard";
import WebLeads from "./components/crm/WebLeads";
import Commissions from "./components/crm/Commissions";
import AllCommission from "./components/crm/AllCommission";
import TFinalizeWiring from "./components/Technician/TFinalizeWiring";
import TUpdateWiringLog from "./components/Technician/TUpdateWiringLog";
import SCommission from "./components/Source/SCommission";
import AllWiring from "./components/crm/AllWiring";
import AllFabrication from "./components/crm/AllFabrication";
import Completion from "./components/crm/Completion";
import Supervisors from "./components/crm/Supervisors";
import AllSupervisorCommission from "./components/crm/AllSupervisorCommission";
import FabricatorCommission from "./components/crm/FabricatorCommission";
import SuperviCommission from "./components/crm/SuperviCommission";
import AllFabricatorCommission from "./components/crm/AllFabricatorCommission";
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
            path="/supervisors"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Supervisors />
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
            path="/source/commissions"
            element={
              <ProtectedRoute allowedRoles={["source"]}>
                <SCommission />
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
            path="/source/loanstep"
            element={
              <ProtectedRoute allowedRoles={["source"]}>
                <LoanStepGuard>
                  <SourceGuard>
                    <SLoanStep />
                  </SourceGuard>
                </LoanStepGuard>
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
            path="/allfabrication"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllFabrication />
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
            path="/allwirings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllWiring />
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
            path="/technician/finalizewiring"
            element={
              <ProtectedRoute allowedRoles={["technician"]}>
                <TFinalizeWiring />
              </ProtectedRoute>
            }
          />
          <Route
            path="/technician/updatewiring"
            element={
              <ProtectedRoute allowedRoles={["technician"]}>
                <TUpdateWiringLog />
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
            path="/source/namechange"
            element={
              <ProtectedRoute allowedRoles={["source"]}>
                <SourceGuard>
                  <NameChangeGuard>
                    <SNameChange />
                  </NameChangeGuard>
                </SourceGuard>
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
            path="/source/documentcollection"
            element={
              <ProtectedRoute allowedRoles={["source"]}>
                <DocumentCollectionGuard>
                  <SourceGuard>
                    <SDocumentCollection />
                  </SourceGuard>
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
          <Route
            path="/webleads"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <WebLeads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/commissions"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Commissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supercommissions"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <SuperviCommission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allcommissions"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllCommission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fabcommissions"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <FabricatorCommission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allfabcommissions"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllFabricatorCommission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allsupercommissions"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllSupervisorCommission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/completion"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Completion />
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
