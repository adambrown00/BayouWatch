import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function NavBar() {
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
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/alerts" className={linkClass}>Alerts</NavLink>
          <NavLink to="/flood-history" className={linkClass}>History</NavLink>
          <NavLink to="/reporting" className={linkClass}>Report</NavLink>
          <NavLink to="/profile" className={linkClass}>Profile</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
        </div>
      </nav>
    </header>
  );
}
