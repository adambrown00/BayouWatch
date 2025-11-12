import React, { useMemo } from "react";     // React and useMemo
import { theme} from "../Theme"             // Theme for styling
import { Link } from "react-router-dom";    // Navigation Links


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

    // Stored User Data. Holds the current user info known at by frontend at the time
    // In final app, data would come from backend 
    const [user, setUser] = React.useState<User>(mockUser);

    // UI mode. Controls whether viewing or editing profile
    const [mode, setMode] = React.useState<Mode>("view");

    // Edit form state. Copies user data into a temp form
    // When saved is clicked, the changes are committed 
    const [form , setForm] = React.useState({
        username: user.username,
        email: user.email,
    });

    // Simple Validation. Checks for basic errors in editing form fields
    const errors = useMemo(() => {
        const e: Partial<Record<keyof typeof form, string>> = {};

        // Username Length Check
        if (!form.username.trim() || form.username.trim().length < 3) {
            e.username = "Username must be at least 3 characters long.";
        }

        // Email Format Check
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            e.email = "Invalid email address.";
        }

        return e;
    }, [form]); // Runs this validation when any edit form value changes 

    const hasErrors = Object.keys(errors).length > 0;

    // Handlers

    // Switch to edit mode, fill form with current user data
    function startEdit() {
        setForm({
            username: user.username,
            email: user.email,
        });
        setMode("edit");
    }

    // Cancel editing, discard changes
    function cancelEdit() {
        setMode("view");
    }

    // Save changes, update user data
    // For now, updates the local state, no persistence again
    // The result is logged to console. Inspect -> console to see
    function saveEdit() {
        const updated = {...user, username: form.username.trim(), email: form.email.trim()};
        console.log("Saving user data:", updated);
        setUser(updated);
        setMode("view");
    }

    // Formatting 

    // Formats account creation date to M/D/YYYY
    const createdDate = useMemo(
        () => new Date(user.accountCreated).toLocaleDateString(),
        [user.accountCreated]
    )

    // Renders the Profile Page, showing either view or edit mode with Save/Cancel buttons 
      return (
        <div
        style={{
            maxWidth: 880,
            margin: "0 auto",
            padding: theme.spacing.large,
        }}
        >
            <h1
                style={{
                fontSize: 28,
                fontWeight: 700,
                marginBottom: parseInt(theme.spacing.medium),
                color: theme.colors.text,
                }}
            >
                Profile Management
            </h1>

            <section
                style={{
                background: theme.colors.background,
                border: "1px solid rgba(0,0,0,0.08)", 
                borderRadius: theme.borderRadius.large,
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                padding: theme.spacing.large,
                }}
            >
        {mode === "view" ? (
            <div>
                <div style={{ marginBottom: 10 }}>
                <div style={{ color: theme.colors.secondary, fontSize: 12 }}>Username</div>
                <div style={{ fontSize: 16, color: theme.colors.text }}>{user.username}</div>
                </div>

                <div style={{ marginBottom: 10 }}>
                <div style={{ color: theme.colors.secondary, fontSize: 12 }}>Email</div>
                <div style={{ fontSize: 16, color: theme.colors.text }}>{user.email}</div>
                </div>

                <div style={{ marginBottom: 20 }}>
                <div style={{ color: theme.colors.secondary, fontSize: 12 }}>Account Created</div>
                <div style={{ fontSize: 16, color: theme.colors.text }}>{createdDate}</div>
                </div>

                <button
                onClick={startEdit}
                style={buttonPrimary}
                >
                Edit Profile
                </button>
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
                    onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                    style={inputStyle(errors.username)}
                    />
                    {errors.username && <small style={errorStyle}>{errors.username}</small>}
                </label>

                <label style={labelStyle}>
                    <span>Email</span>
                    <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    style={inputStyle(errors.email)}
                    />
                    {errors.email && <small style={errorStyle}>{errors.email}</small>}
                </label>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                <button
                    type="submit"
                    disabled={hasErrors}
                    style={{ ...buttonPrimary, opacity: hasErrors ? 0.7 : 1, cursor: hasErrors ? "not-allowed" : "pointer" }}
                >
                    Save
                </button>
                <button type="button" onClick={cancelEdit} style={buttonGhost}>
                    Cancel
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
  );
}



// Style Objects
// Used inline for simplicity, can be moved to CSS/SCSS files later

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

// Dynamic input style based on error presence
// Red border for error, gray otherwise
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

// Button styles for primary buttons
const buttonPrimary: React.CSSProperties = {
  background: theme.colors.primary,
  color: theme.colors.background,
  border: "none",
  borderRadius: theme.borderRadius.medium,
  padding: `${theme.spacing.small} ${theme.spacing.medium}`,
  fontWeight: 600,
  cursor: "pointer",
};

// Button styles for secondary buttons
const buttonGhost: React.CSSProperties = {
  background: theme.colors.surface,
  color: theme.colors.text,
  border: `1px solid rgba(0,0,0,0.12)`,
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
