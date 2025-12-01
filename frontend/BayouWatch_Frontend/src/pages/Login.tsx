import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { theme } from "../Theme";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaLock } from "react-icons/fa"; // icons for inputs

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password 
        })
      });

      if (!response.ok) {
        throw new Error('Invalid email or password')
      }

      const data = await response.json();

      // Save token to the local storage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user))

      // Call login function from AuthContext
      login();

      // Redirect to home page instead of profile
      navigate("/");

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={pageContainer}>
      <div style={card}>
        <h1 style={title}>Login</h1>
        <div style={titleUnderline} />
        <p style={subtitle}>Please sign in or register a new account</p>

        {error && (
          <div style={errorBanner}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={form}>
          <label style={label}>
            <span>Email</span>
            <div style={inputWrapper}>
              <span style={inputIcon}>
                <FaUser size={14} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={input}
                required
              />
            </div>
          </label>

          <label style={label}>
            <span>Password</span>
            <div style={inputWrapper}>
              <span style={inputIcon}>
                <FaLock size={14} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={input}
                required
              />
            </div>
          </label>

          <button type="submit" style={primaryButton} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={subText}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}


const pageContainer: React.CSSProperties = {
  padding: theme.spacing.large,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card: React.CSSProperties = {
  width: 380,
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
  marginBottom: 8,
  color: theme.colors.text,
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: 1,
};

const titleUnderline: React.CSSProperties = {
  width: 60,
  height: 3,
  borderRadius: 999,
  margin: "0 auto 20px",
  background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
};

const form: React.CSSProperties = {
  display: "grid",
  gap: 16,
  marginBottom: 16,
};

const label: React.CSSProperties = {
  display: "grid",
  gap: 6,
  fontSize: 14,
  color: theme.colors.text,
};

// wrapper for icon + input side by side
const inputWrapper: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#ffffffff",
  borderRadius: theme.borderRadius.medium,
  padding: "0 10px",
  border: "1px solid rgba(0,0,0,0.10)",
  background: theme.colors.background
};

const inputIcon: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 8,
  color: theme.colors.secondary,
};

const input: React.CSSProperties = {
  flex: 1,
  height: 40,
  border: "none",
  outline: "none",
  background: "transparent",
  color: theme.colors.text,
  fontSize: 14,
};

const primaryButton: React.CSSProperties = {
  marginTop: 8,
  background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
  color: theme.colors.background,
  border: "none",
  borderRadius: theme.borderRadius.medium,
  padding: `${theme.spacing.small} ${theme.spacing.medium}`,
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
  width: "100%",
  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
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

const subtitle: React.CSSProperties = {
  marginTop: -4,
  marginBottom: 20,
  fontSize: 14,
  color: theme.colors.secondary,
  textAlign: "center",
  lineHeight: 1.4,
};

const errorBanner: React.CSSProperties = {
  padding: theme.spacing.small,
  marginBottom: theme.spacing.medium,
  backgroundColor: '#fee',
  border: '1px solid ' + theme.colors.danger,
  borderRadius: theme.borderRadius.medium,
  color: theme.colors.danger,
  fontSize: 14,
  textAlign: 'center',
};
