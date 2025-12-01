import { Outlet } from "react-router-dom";
import NavBar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div>
      <NavBar />
      {/* 56px header + 16px breathing room */}
      <main style={{ paddingTop: 72, paddingInline: 16, minHeight: "100vh" }}>
        <Outlet />
      </main>
      <footer style={{ padding: "24px 16px", color: "#6b7280", textAlign: "center" }}>
        © {new Date().getFullYear()} BayouWatch
      </footer>
    </div>
  );
}
