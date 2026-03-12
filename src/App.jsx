import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LogIn } from "lucide-react";
import Login from "./components/frontweb/Login";
import FrontWeb from "./components/frontweb/FrontWeb";
import Dashboard from "./components/crm/Dashboard";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FrontWeb />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
