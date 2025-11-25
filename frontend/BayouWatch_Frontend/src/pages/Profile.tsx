// src/pages/Profile.tsx
// Profile page for BayouWatch user accounts.
// Shows user info, simple stats, recent reports, and account settings.
// Currently uses mock data; backend integration can plug in later.

import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom"; // navigation + routing
import "./Profile.css";                              // page-specific styles
import { useAuth } from "../context/AuthContext";    // frontend auth state

// UI mode: either viewing profile or editing it
type Mode = "view" | "edit";

// Which panel is active in the main content area
type ProfileSection = "info" | "stats" | "reports" | "settings";

// Basic user shape the profile page understands.
// Can be expanded later as backend adds more fields.
interface User {
  username: string;
  email: string;
  accountCreated: string;
  userID: number;
}

// Mock user data for now.
// In a real app, this would come from an API or auth token.
const mockUser: User = {
  username: "Username",
  email: "email@mail.com",
  accountCreated: "2025-11-17T12:00:00",
  userID: 1,
};

// Mock statistics for the "User Statistics" section
const mockStats = {
  totalReports: 7,
  severeReports: 2,
  moderateReports: 3,
  minorReports: 2,
};

// Mock recent reports list for the "Saved Reports" section
const mockRecentReports = [
  { id: 1, date: "2025-11-20", location: "Choctaw Dr.", severity: "Severe" },
  { id: 2, date: "2025-11-19", location: "Perkins Rd.", severity: "Moderate" },
  { id: 3, date: "2025-11-18", location: "Nicholson Dr.", severity: "Minor" },
];

// Main Profile component
export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // from AuthContext: flips logged-in state

  // Current user information (mocked for now)
  const [user, setUser] = React.useState<User>(mockUser);

  // Whether we're in "view" or "edit" mode inside the User Information tab
  const [mode, setMode] = React.useState<Mode>("view");

  // Which left-hand navigation section is currently selected
  const [section, setSection] = React.useState<ProfileSection>("info");

  // Controls visibility of the logout confirmation modal
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  // Local edit form state (only used in edit mode)
  const [form, setForm] = React.useState({
    username: user.username,
    email: user.email,
  });

  // Basic client-side validation for edit form
  const errors = useMemo(() => {
    const e: Partial<Record<keyof typeof form, string>> = {};

    if (!form.username.trim() || form.username.trim().length < 3) {
      e.username = "Username must be at least 3 characters long.";
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = "Invalid email address.";
    }

    return e;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;

  // Switch to edit mode and preload form with current user data
  function startEdit() {
    setForm({
      username: user.username,
      email: user.email,
    });
    setMode("edit");
    setSection("info"); // stay on the info tab while editing
  }

  // Exit edit mode without saving changes
  function cancelEdit() {
    setMode("view");
  }

  // Commit changes from form into the user state (no persistence yet)
  function saveEdit() {
    const updated = {
      ...user,
      username: form.username.trim(),
      email: form.email.trim(),
    };
    console.log("Saving user data:", updated);
    setUser(updated);
    setMode("view");
  }

  // Called when the user confirms logout in the modal
  function handleConfirmLogout() {
    logout();               // flip auth state in context
    setShowLogoutModal(false);
    navigate("/login");     // redirect back to login page
  }

  // Format account creation date to a friendly string (e.g. 1/17/2023)
  const createdDate = useMemo(
    () => new Date(user.accountCreated).toLocaleDateString(),
    [user.accountCreated]
  );

  // ========================= RENDER =========================
  return (
    <div className="profile-page">
      <h1 className="profile-title">Profile Management</h1>

      {/* friendly greeting under the title */}
      <p className="profile-subtitle">
        Signed in as <span className="profile-username">{user.username}, Welcome!</span>
      </p>

      {/* Main two-column card: sidebar on the left, content panel on the right */}
      <section className="profile-card">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="profile-sidebar">
          <div className="profile-sidebar-section">
            <button
              className={
                "profile-nav-button" +
                (section === "info" ? " profile-nav-button--active" : "")
              }
              onClick={() => setSection("info")}
            >
              User Information
            </button>

            <button
              className={
                "profile-nav-button" +
                (section === "stats" ? " profile-nav-button--active" : "")
              }
              onClick={() => setSection("stats")}
            >
              User Statistics
            </button>

            <button
              className={
                "profile-nav-button" +
                (section === "reports" ? " profile-nav-button--active" : "")
              }
              onClick={() => setSection("reports")}
            >
              Saved Reports
            </button>

            <button
              className={
                "profile-nav-button" +
                (section === "settings" ? " profile-nav-button--active" : "")
              }
              onClick={() => setSection("settings")}
            >
              Account Settings
            </button>
          </div>
        </aside>

        {/* ===== MAIN PANEL ===== */}
        <main className="profile-main">
          {/* --- User Information (view / edit) --- */}
          {section === "info" && (
            <>
              {mode === "view" ? (
                // Read-only view of user information
                <div>
                  <div className="profile-field">
                    <div className="profile-field-label">Username</div>
                    <div className="profile-field-value">{user.username}</div>
                  </div>

                  <div className="profile-field">
                    <div className="profile-field-label">Email</div>
                    <div className="profile-field-value">{user.email}</div>
                  </div>

                  <div className="profile-field profile-field--spaced">
                    <div className="profile-field-label">Account Created</div>
                    <div className="profile-field-value">{createdDate}</div>
                  </div>

                  <button
                    onClick={startEdit}
                    className="profile-button-primary"
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                // Editable form version of the user info
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!hasErrors) saveEdit();
                  }}
                >
                  <div className="profile-form-grid">
                    <label className="profile-label">
                      <span>Username</span>
                      <input
                        type="text"
                        value={form.username}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, username: e.target.value }))
                        }
                        className={
                          "profile-input" +
                          (errors.username ? " profile-input--error" : "")
                        }
                      />
                      {errors.username && (
                        <small className="profile-error">
                          {errors.username}
                        </small>
                      )}
                    </label>

                    <label className="profile-label">
                      <span>Email</span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        className={
                          "profile-input" +
                          (errors.email ? " profile-input--error" : "")
                        }
                      />
                      {errors.email && (
                        <small className="profile-error">
                          {errors.email}
                        </small>
                      )}
                    </label>
                  </div>

                  <div className="profile-actions">
                    <button
                      type="submit"
                      disabled={hasErrors}
                      className="profile-button-primary"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="profile-button-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* --- User Statistics (mock data) --- */}
          {section === "stats" && (
            <div>
              <h2 className="profile-section-heading">User Statistics</h2>
              <p className="profile-section-subtext">
                Overview of your recent reporting activity in BayouWatch.
              </p>

              <div className="profile-stat-grid">
                <div className="profile-stat-card">
                  <div className="profile-stat-label">Total Reports</div>
                  <div className="profile-stat-value">
                    {mockStats.totalReports}
                  </div>
                </div>
                <div className="profile-stat-card">
                  <div className="profile-stat-label">Severe Floods</div>
                  <div className="profile-stat-value">
                    {mockStats.severeReports}
                  </div>
                </div>
                <div className="profile-stat-card">
                  <div className="profile-stat-label">Moderate Floods</div>
                  <div className="profile-stat-value">
                    {mockStats.moderateReports}
                  </div>
                </div>
                <div className="profile-stat-card">
                  <div className="profile-stat-label">Minor Floods</div>
                  <div className="profile-stat-value">
                    {mockStats.minorReports}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- Saved / Recent Reports (mock list) --- */}
          {section === "reports" && (
            <div>
              <h2 className="profile-section-heading">Your Recent Reports</h2>
              <p className="profile-section-subtext">
                These are a few of the latest flood reports associated with your
                account.
              </p>

              <ul className="profile-list">
                {mockRecentReports.map((r) => {
                  // Normalize severity to match our CSS modifiers
                  const severityKey = r.severity.toLowerCase(); // "severe" | "moderate" | "minor"

                  const severityClass =
                    severityKey === "severe"
                      ? "profile-list-severity profile-list-severity--severe"
                      : severityKey === "moderate"
                      ? "profile-list-severity profile-list-severity--moderate"
                      : "profile-list-severity profile-list-severity--minor";

                  return (
                    <li key={r.id} className="profile-list-item">
                      <div className="profile-list-title">
                        {r.location} &mdash;{" "}
                        <span className={severityClass}>{r.severity}</span>
                      </div>
                      <div className="profile-list-meta">Reported on {r.date}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* --- Account Settings + Logout button --- */}
          {section === "settings" && (
            <div>
              <h2 className="profile-section-heading">Account Settings</h2>
              <p className="profile-section-subtext">
                Manage how BayouWatch interacts with your account. These are
                placeholders until backend integration is added.
              </p>

              {/* Static rows for now; could become toggles later */}
              <div className="profile-settings-list">
                <div className="profile-settings-row">
                  <span>Notification Emails</span>
                  <span className="profile-settings-pill">Enabled</span>
                </div>
                <div className="profile-settings-row">
                  <span>Two-Factor Authentication</span>
                  <span className="profile-settings-pill">Not configured</span>
                </div>
                <div className="profile-settings-row">
                  <span>Location Services</span>
                  <span className="profile-settings-pill">
                    Using browser defaults
                  </span>
                </div>
              </div>

              {/* Logout action opens confirmation modal */}
              <div className="profile-settings-logout">
                <button
                  className="profile-button-danger"
                  onClick={() => setShowLogoutModal(true)}
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </main>
      </section>

      {/* Logout confirmation modal overlay */}
      {showLogoutModal && (
        <div className="profile-modal-backdrop">
          <div className="profile-modal">
            <h3 className="profile-modal-title">Log out of BayouWatch?</h3>
            <p className="profile-modal-text">
              You&apos;ll be returned to the login page. You can sign back in
              anytime with your account credentials.
            </p>

            <div className="profile-modal-actions">
              <button
                className="profile-button-danger"
                onClick={handleConfirmLogout}
              >
                Log out
              </button>
              <button
                className="profile-button-ghost"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
