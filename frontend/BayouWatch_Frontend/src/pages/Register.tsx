import React, { useMemo } from "react";     // React and useMemo
import { Link } from "react-router-dom";    // Navigation Links
import { theme } from "../Theme";           // Theme for styling
import { FaEnvelope, FaUser, FaLock } from "react-icons/fa"; // Icons for inputs

// Local form state for registration forms
export default function Register() {
  const [form, setForm] = React.useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // Track which fields the user has interacted with
  const [touched, setTouched] = React.useState({
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
  });

  // Simple Validation. Checks for basic errors in editing form fields
  const errors = useMemo(() => {
    const e: Partial<Record<keyof typeof form, string>> = {};

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = "Invalid email address.";
    }

    if (!form.username.trim() || form.username.trim().length < 3) {
      e.username = "Username must be at least 3 characters.";
    }

    if (form.password.length < 6) {
      e.password = "Password must be at least 6 characters.";
    }

    if (form.confirmPassword !== form.password) {
      e.confirmPassword = "Passwords do not match.";
    }

    return e;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (hasErrors) return; // do nothing if invalid
    // INTEGRATION WITH BACKEND LATER
    console.log("Register attempt:", form);
  }

  // Page rendering
  return (
    <div style={pageContainer}>
      <div style={card}>
        <h1 style={title}>Sign Up</h1>
        <div style={titleUnderline} />
        <p style={subtitle}>Create your BayouWatch account below</p>

        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Email */}
          <label style={label}>
            <span>Email</span>
            <div style={inputContainer(touched.email ? errors.email : undefined)}>
              <span style={inputIcon}>
                <FaEnvelope size={14} />
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm((f) => ({ ...f, email: e.target.value }));
                  setTouched((t) => ({ ...t, email: true }));
                }}
                style={innerInput}
              />
            </div>
            {touched.email && errors.email && (
              <small style={errorText}>{errors.email}</small>
            )}
          </label>

          {/* Username */}
          <label style={label}>
            <span>Username</span>
            <div
              style={inputContainer(
                touched.username ? errors.username : undefined
              )}
            >
              <span style={inputIcon}>
                <FaUser size={14} />
              </span>
              <input
                type="text"
                value={form.username}
                onChange={(e) => {
                  setForm((f) => ({ ...f, username: e.target.value }));
                  setTouched((t) => ({ ...t, username: true }));
                }}
                style={innerInput}
              />
            </div>
            {touched.username && errors.username && (
              <small style={errorText}>{errors.username}</small>
            )}
          </label>

          {/* Password */}
          <label style={label}>
            <span>Password</span>
            <div
              style={inputContainer(
                touched.password ? errors.password : undefined
              )}
            >
              <span style={inputIcon}>
                <FaLock size={14} />
              </span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => {
                  setForm((f) => ({ ...f, password: e.target.value }));
                  setTouched((t) => ({ ...t, password: true }));
                }}
                style={innerInput}
              />
            </div>
            {touched.password && errors.password && (
              <small style={errorText}>{errors.password}</small>
            )}
          </label>

          {/* Confirm Password */}
          <label style={label}>
            <span>Confirm Password</span>
            <div
              style={inputContainer(
                touched.confirmPassword ? errors.confirmPassword : undefined
              )}
            >
              <span style={inputIcon}>
                <FaLock size={14} />
              </span>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    confirmPassword: e.target.value,
                  }));
                  setTouched((t) => ({ ...t, confirmPassword: true }));
                }}
                style={innerInput}
              />
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <small style={errorText}>{errors.confirmPassword}</small>
            )}
          </label>

          <button
            type="submit"
            disabled={hasErrors}
            style={{
              ...primaryButton,
              opacity: hasErrors ? 0.7 : 1,
              cursor: hasErrors ? "not-allowed" : "pointer",
            }}
          >
            Create Account
          </button>
        </form>

        <p style={subText}>
          Already have an account?{" "}
          <Link to="/login" style={link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

// CSS styles kept within .tsx 

const pageContainer: React.CSSProperties = {
  padding: theme.spacing.large,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: theme.colors.background,
};

const card: React.CSSProperties = {
  width: 420,
  maxWidth: "100%",
  background: theme.colors.surface,
  padding: theme.spacing.large,
  borderRadius: theme.borderRadius.large,
  boxShadow: "0 14px 40px rgba(15, 23, 42, 0.18)",
  border: "1px solid rgba(0,0,0,0.06)",
};

const title: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  marginBottom: 4,
  color: theme.colors.text,
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: 1,
};

const titleUnderline: React.CSSProperties = {
  width: 60,
  height: 3,
  borderRadius: 999,
  margin: "0 auto 12px",
  background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
};

const subtitle: React.CSSProperties = {
  marginBottom: 20,
  fontSize: 14,
  color: theme.colors.secondary,
  textAlign: "center",
  lineHeight: 1.4,
};

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: 14,
  marginBottom: 16,
};

const label: React.CSSProperties = {
  display: "grid",
  gap: 6,
  fontSize: 14,
  color: theme.colors.text,
};

// Outer container for icon + input, includes the error border.
// This mirrors the Login page style.
function inputContainer(hasError?: string): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    height: 42,
    padding: `0 ${theme.spacing.medium}`,
    borderRadius: theme.borderRadius.medium,
    border: `1px solid ${
      hasError ? theme.colors.danger : "rgba(0,0,0,0.15)"
    }`,
    background: "#ffffffff",
  };
}

// Inner <input> element style (borderless, fills remaining space)
const innerInput: React.CSSProperties = {
  flex: 1,
  height: 34,
  border: "none",
  outline: "none",
  background: "transparent",
  color: theme.colors.text,
  fontSize: 14,
};

const inputIcon: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 8,
  color: theme.colors.secondary,
};

const errorText: React.CSSProperties = {
  color: theme.colors.danger,
  fontSize: 12,
};

const primaryButton: React.CSSProperties = {
  marginTop: 8,
  background: theme.colors.primary,
  color: theme.colors.background,
  border: "none",
  borderRadius: theme.borderRadius.medium,
  padding: `${theme.spacing.small} ${theme.spacing.medium}`,
  fontWeight: 600,
  fontSize: 15,
  width: "100%",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const subText: React.CSSProperties = {
  marginTop: 12,
  fontSize: 13,
  color: theme.colors.secondary,
  textAlign: "center",
};

const link: React.CSSProperties = {
  color: theme.colors.primary,
  textDecoration: "none",
  fontWeight: 600,
};
