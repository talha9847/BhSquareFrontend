import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);


// {
//   "rewrites": [
//     {
//       "source": "/api/:path*",
//       "destination": "https://bhsquarebackend.onrender.com/api/:path*"
//     },
//     {
//       "source": "/:path*",
//       "destination": "/index.html"
//     }
//   ]
// }


