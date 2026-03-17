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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/customers" element={<Customer />} />
          <Route
            path="/namechange"
            element={
              <NameChangeGuard>
                <NameChange />
              </NameChangeGuard>
            }
          />
          <Route
            path="/documentcollection"
            element={
              <DocumentCollectionGuard>
                <DocumentCollection />
              </DocumentCollectionGuard>
            }
          />
          <Route path="/registration" element={<Registration />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
