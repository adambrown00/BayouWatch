import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { isLoggedIn } = useAuth();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log('User from localStorage:', user);
  console.log('User role:', user.role);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    "bw-link" + (isActive ? " bw-link--active" : "");

  return (
    <header className="bw-header" role="banner">
      <nav className="bw-topnav" aria-label="Primary">
        <div className="bw-left">
          <NavLink to="/" className="bw-name" end>
            BayouWatch
          </NavLink>
        </div>

        <div className="bw-right">
          {/* main nav links (always visible) */}
          <div className="bw-right-main">
            <NavLink to="/" className={linkClass} end>Home</NavLink>
            <NavLink to="/alerts" className={linkClass}>Alerts</NavLink>
            <NavLink to="/flood-history" className={linkClass}>History</NavLink>
            <NavLink to="/reporting" className={linkClass}>Report</NavLink>
            <NavLink to="/about" className={linkClass}>About</NavLink>
          
          {/* Admin link, only visible to admin users */}
          {user.role === "admin" && (
            <NavLink to="/admin" className={linkClass}>Admin</NavLink>
          )}
          </div>

          {/* auth link on the far right, shows either Login or Profile */}
          <div className="bw-right-auth">
            {isLoggedIn ? (
              <NavLink to="/profile" className="bw-link bw-link--auth">
                Profile
              </NavLink>
            ) : (
              <NavLink to="/login" className="bw-link bw-link--auth">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
