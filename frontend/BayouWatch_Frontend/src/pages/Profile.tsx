// src/pages/Profile.tsx
// Profile page for BayouWatch user accounts.
// Shows user info, simple stats, recent reports, and account settings.
// Currently uses mock data; backend integration can plug in later.

import React, { useMemo, useEffect } from "react";
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
  stats?: {
    total_reports: number;
    severe_reports: number;
    moderate_reports: number;
    minor_reports: number;
  };
  recent_reports?: Array<{
    id: number;
    severity: string;
    description: string;
    created_at: string;
    latitude: number;
    longitude: number;
  }>;
}

// Main Profile component
export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // from AuthContext: flips logged-in state

  // Current user information (mocked for now)
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  // Whether we're in "view" or "edit" mode inside the User Information tab
  const [mode, setMode] = React.useState<Mode>("view");

  // Which left-hand navigation section is currently selected
  const [section, setSection] = React.useState<ProfileSection>("info");

  // Controls visibility of the logout confirmation modal
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  // Local edit form state (only used in edit mode)
  const [form, setForm] = React.useState({
    username: "",
    email: "",
  });

  // Fetch user data on the component mount
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:8000/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }
      return res.json();
    })
    .then(data => {
      setUser({
        username: data.username,
        email: data.email,
        accountCreated: data.created_at,
        userID: data.id,
        stats: data.stats,
        recent_reports: data.recent_reports
      });
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching user:', err);
      setError("Failed to load user data.");
      setLoading(false);
    });
  }, [navigate]);

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
    if (!user) return;
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
  async function saveEdit() {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update profile');
        }

      const data = await response.json();

      // Update local user state with new data
      setUser({
        username: data.username,
        email: data.email,
        accountCreated: data.created_at,
        userID: data.id,
      });

      // Also update the localStorage user info
      localStorage.setItem('user', JSON.stringify(data));

      setMode("view");
    } catch (err: any) {
      console.error('Error updating profile:', err);
      alert(err.message || 'Failed to update profile.');
    }
  }

  // Called when the user confirms logout in the modal
  function handleConfirmLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    logout();               // flip auth state in context
    setShowLogoutModal(false);
    navigate("/login");     // redirect back to login page
  }

  // Format account creation date to a friendly string (e.g. 1/17/2023)
  const createdDate = useMemo(
    () => user ? new Date(user.accountCreated).toLocaleDateString() : "",
    [user]
  );

  // Loading state
  if (loading) {
    return (
      <div className="profile-page">
        <p>Loading profile...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="profile-page">
        <p style={{ color: 'red'}}>{error || 'Failed to load profile'}</p>
        <button onClick={() => navigate('/login')}>Back to Login</button>
      </div>
    );
  }

  // ========================= RENDER =========================

  // In case the user has no data (should not happen)
  if (!user) {
    return (
      <div className="profile-page">
        <p>No user data available.</p>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <h1 className="profile-title">Profile Management</h1>

      {/* friendly greeting under the title */}
      <p className="profile-subtitle">
        Signed in as{" "}
        <span className="profile-username">{user.username}, Welcome!</span>
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
                        <small className="profile-error">{errors.email}</small>
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
                    {user?.stats?.total_reports || 0}
                  </div>
                </div>
                <div className="profile-stat-card">
                  <div className="profile-stat-label">Severe Floods</div>
                  <div className="profile-stat-value">
                    {user?.stats?.severe_reports || 0}
                  </div>
                </div>
                <div className="profile-stat-card">
                  <div className="profile-stat-label">Moderate Floods</div>
                  <div className="profile-stat-value">
                    {user?.stats?.moderate_reports || 0}
                  </div>
                </div>
                <div className="profile-stat-card">
                  <div className="profile-stat-label">Minor Floods</div>
                  <div className="profile-stat-value">
                    {user?.stats?.minor_reports || 0}
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
                These are your latest flood reports.
              </p>

              {!user?.recent_reports || user.recent_reports.length === 0 ? (
                <p className="profile-section-subtext">
                  No reports yet. Submit your first report!
                </p>
              ) : (
                <ul className="profile-list">
                  {user.recent_reports.map((r) => {
                    // ← Use user.recent_reports, not mockRecentReports
                    const severityKey = r.severity.toLowerCase();

                    const severityClass =
                      severityKey === "severe"
                        ? "profile-list-severity profile-list-severity--severe"
                        : severityKey === "moderate"
                          ? "profile-list-severity profile-list-severity--moderate"
                          : "profile-list-severity profile-list-severity--minor";

                    return (
                      <li key={r.id} className="profile-list-item">
                        <div className="profile-list-title">
                          {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}{" "}
                          &mdash;{" "}
                          <span className={severityClass}>{r.severity}</span>
                        </div>
                        <div className="profile-list-meta">
                          {r.description || "No description provided"}
                        </div>
                        <div className="profile-list-meta">
                          Reported on{" "}
                          {new Date(r.created_at).toLocaleDateString()}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
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
