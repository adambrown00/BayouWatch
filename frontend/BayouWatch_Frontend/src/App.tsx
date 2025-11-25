// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// AuthContext
import { AuthProvider } from "./context/AuthContext";

// layout
import MainLayout from "./layout/MainLayout";

// pages
import Home from "./pages/Home";
import Alerts from "./pages/Alerts";
import FloodHistory from "./pages/FloodHistory";
import Reporting from "./pages/Reporting";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Login from "./pages/Login";
import { injectThemeCSSVars } from "./pages/Theme";

injectThemeCSSVars();

function NotFound() {
  return <div style={{ padding: 24 }}>404 — Page not found</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/flood-history" element={<FloodHistory />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
