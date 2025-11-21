import React, { useMemo } from "react";     // React and useMemo
import { theme } from "../Theme";           // Theme for styling
import { Link, useNavigate } from "react-router-dom";    // Navigation Links
import { useAuth } from "../context/AuthContext";        // Auth for logout

// Profile Page with View/Edit Modes
type Mode = "view" | "edit";

// User Data Struct, can be expanded later
interface User {
  username: string;
  email: string;
  accountCreated: string;
  userID: number; // User ID for real data fetching later
}

// Mock User Data for now, real data fetching implemented later
// Changes made in edit mode updates the mock data in memory, no persistence
// when switching between pages or refreshing
const mockUser: User = {
  username: "Username",
  email: "emailname@email.com",
  accountCreated: "2023-01-17T12:00:00", // formatted YYYY-MM-DDTHH:MM:SS
  userID: 1,
};

// Main Profile Component
export default function Profile() {
  const [user, setUser] = React.useState<User>(mockUser);   // Stored User Data
  const [mode, setMode] = React.useState<Mode>("view");     // UI mode
  const [form, setForm] = React.useState({
    username: user.username,
    email: user.email,
  });

  const { logout } = useAuth();
  const navigate = useNavigate();

  // Simple Validation. Checks for basic errors in editing form fields
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

  // Handlers

  function startEdit() {
    setForm({
      username: user.username,
      email: user.email,
    });
    setMode("edit");
  }

  function cancelEdit() {
    setMode("view");
  }

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

  function handleLogout() {
    logout();
    navigate("/"); // back to Home after logout
  }

  // Formats account creation date to M/D/YYYY
  const createdDate = useMemo(
    () => new Date(user.accountCreated).toLocaleDateString(),
    [user.accountCreated]
  );

  // Renders the Profile Page, showing either view or edit mode with Save/Cancel buttons
  return (
    <div style={pageContainer}>
      <div style={card}>
        <div style={cardHeader}>
          <h1 style={cardTitle}>Profile</h1>
          <span style={cardSubtitle}>Manage your BayouWatch account details.</span>
        </div>

        <section>
          {mode === "view" ? (
            <div>
              <div style={infoBlock}>
                <div style={infoLabel}>Username</div>
                <div style={infoValue}>{user.username}</div>
              </div>

              <div style={infoBlock}>
                <div style={infoLabel}>Email</div>
                <div style={infoValue}>{user.email}</div>
              </div>

              <div style={infoBlock}>
                <div style={infoLabel}>Account Created</div>
                <div style={infoValue}>{createdDate}</div>
              </div>

              <div style={buttonRow}>
                <button onClick={startEdit} style={buttonPrimary}>
                  Edit Profile
                </button>
                <button type="button" onClick={handleLogout} style={buttonLogout}>
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!hasErrors) saveEdit();
              }}
            >
              <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
                <label style={labelStyle}>
                  <span>Username</span>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, username: e.target.value }))
                    }
                    style={inputStyle(errors.username)}
                  />
                  {errors.username && (
                    <small style={errorStyle}>{errors.username}</small>
                  )}
                </label>

                <label style={labelStyle}>
                  <span>Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    style={inputStyle(errors.email)}
                  />
                  {errors.email && (
                    <small style={errorStyle}>{errors.email}</small>
                  )}
                </label>
              </div>

              <div style={buttonRow}>
                <button
                  type="submit"
                  disabled={hasErrors}
                  style={{
                    ...buttonPrimary,
                    opacity: hasErrors ? 0.7 : 1,
                    cursor: hasErrors ? "not-allowed" : "pointer",
                  }}
                >
                  Save
                </button>
                <button type="button" onClick={cancelEdit} style={buttonGhost}>
                  Cancel
                </button>
                <button type="button" onClick={handleLogout} style={buttonLogout}>
                  Log out
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Home Button */}
        <div style={{ marginTop: parseInt(theme.spacing.medium) }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <button style={buttonHome}>Go to Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
}


// Page container 
const pageContainer: React.CSSProperties = {    
  maxWidth: 880,
  margin: "0 auto",
  padding: theme.spacing.large,
};

// Card wrapper to match other App's cards
const card: React.CSSProperties = {
  background: theme.colors.surface,
  borderRadius: theme.borderRadius.large,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  padding: theme.spacing.large,
  border: "1px solid rgba(0,0,0,0.08)",
};

const cardHeader: React.CSSProperties = {
  marginBottom: 16,
};

const cardTitle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  margin: 0,
  color: theme.colors.text,
};

const cardSubtitle: React.CSSProperties = {
  fontSize: 14,
  color: theme.colors.secondary,
};

// Info rows (view mode)
const infoBlock: React.CSSProperties = {
  marginBottom: 12,
};

const infoLabel: React.CSSProperties = {
  color: theme.colors.secondary,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const infoValue: React.CSSProperties = {
  fontSize: 16,
  color: theme.colors.text,
};

// Label style for input fields and style for error messages
const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: theme.spacing.small,
  fontSize: 14,
};

const errorStyle: React.CSSProperties = {
  color: theme.colors.danger,
  marginTop: 2,
};

function inputStyle(hasError?: string): React.CSSProperties {
  return {
    height: 40,
    padding: `0 ${theme.spacing.medium}`,
    borderRadius: theme.borderRadius.medium,
    border: `1px solid ${
      hasError ? theme.colors.danger : "rgba(0,0,0,0.15)"
    }`,
    outline: "none",
    color: theme.colors.text,
  };
}

const buttonRow: React.CSSProperties = {
  display: "flex",
  gap: 8,
  marginTop: 12,
};

// Primary button (Edit / Save)
const buttonPrimary: React.CSSProperties = {
  background: theme.colors.primary,
  color: theme.colors.background,
  border: "none",
  borderRadius: theme.borderRadius.medium,
  padding: `${theme.spacing.small} ${theme.spacing.medium}`,
  fontWeight: 600,
  cursor: "pointer",
};

// Secondary / ghost button
const buttonGhost: React.CSSProperties = {
  background: theme.colors.surface,
  color: theme.colors.text,
  border: `1px solid rgba(0,0,0,0.12)`,
  borderRadius: theme.borderRadius.medium,
  padding: `${theme.spacing.small} ${theme.spacing.medium}`,
  fontWeight: 600,
  cursor: "pointer",
};

// Logout button (danger-outline style)
const buttonLogout: React.CSSProperties = {
  background: theme.colors.surface,
  color: theme.colors.danger,
  border: `1px solid ${theme.colors.danger}`,
  borderRadius: theme.borderRadius.medium,
  padding: `${theme.spacing.small} ${theme.spacing.medium}`,
  fontWeight: 600,
  cursor: "pointer",
};

const buttonHome: React.CSSProperties = {
  background: theme.colors.surface,
  color: theme.colors.text,
  border: `1px solid rgba(0,0,0,0.12)`,
  borderRadius: theme.borderRadius.small,
  padding: `${theme.spacing.small} ${theme.spacing.medium}`,
  fontSize: 14,
  cursor: "pointer",
};
