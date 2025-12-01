import React from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../Theme";
import {
  MdHome,
  MdWarning,
  MdHistory,
  MdEdit,
  MdMap,
  MdPeople,
  MdNotifications,
  MdCamera,
  MdSchedule,
  MdLock,
} from "react-icons/md";

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={pageContainer}>
      {/* Header Section */}
      <div style={headerSection}>
        <h1 style={pageTitle}>About BayouWatch</h1>
        <p style={subtitle}>
          Community-driven flood monitoring and reporting for Baton Rouge
        </p>
      </div>

      {/* Mission Statement */}
      <section style={sectionContainer}>
        <h2 style={sectionTitle}>Our Mission</h2>
        <p style={bodyText}>
          BayouWatch is a community-powered platform designed to help residents
          of Baton Rouge stay informed about flood conditions in real-time. By
          combining official alerts with user-submitted reports, we create a
          comprehensive view of flood activity across the area.
        </p>
      </section>

      {/* How to Use Section */}
      <section style={sectionContainer}>
        <h2 style={sectionTitle}>How to Use BayouWatch</h2>
        <div style={featureGrid}>
          <div style={featureCard}>
            <div style={iconCircle}>
              <MdHome size={48} color={theme.colors.primary} />
            </div>
            <h3 style={featureTitle}>1. Explore the Map</h3>
            <p style={featureText}>
              Visit the Home page to view an interactive map showing all flood
              reports and alerts in your area. Click on markers to see detailed
              information.
            </p>
          </div>

          <div style={featureCard}>
            <div style={iconCircle}>
              <MdWarning size={48} color={theme.colors.primary} />
            </div>
            <h3 style={featureTitle}>2. Check Official Alerts</h3>
            <p style={featureText}>
              The Alerts page displays current flood warnings and advisories
              issued by local authorities. Stay updated on severe weather and
              evacuation notices.
            </p>
          </div>

          <div style={featureCard}>
            <div style={iconCircle}>
              <MdHistory size={48} color={theme.colors.primary} />
            </div>
            <h3 style={featureTitle}>3. Review Flood History</h3>
            <p style={featureText}>
              Browse past flood reports from the last 7 days. Click any report
              to see its location on the map and learn about patterns in your
              neighborhood.
            </p>
          </div>

          <div style={featureCard}>
            <div style={iconCircle}>
              <MdEdit size={48} color={theme.colors.primary} />
            </div>
            <h3 style={featureTitle}>4. Report Flooding</h3>
            <p style={featureText}>
              See flooding in your area? Create an account and submit a report
              with location, severity level, description, and optional photos.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section style={sectionContainer}>
        <h2 style={sectionTitle}>Key Features</h2>
        <div style={featureList}>
          <div style={featureItem}>
            <span style={bullet}>
              <MdMap size={28} color={theme.colors.primary} />
            </span>
            <div>
              <strong style={featureStrong}>Interactive Mapping:</strong>
              <span style={featureDescription}>
                {" "}
                Real-time visualization of flood reports with detailed location
                markers
              </span>
            </div>
          </div>
          <div style={featureItem}>
            <span style={bullet}>
              <MdPeople size={28} color={theme.colors.primary} />
            </span>
            <div>
              <strong style={featureStrong}>Community Reports:</strong>
              <span style={featureDescription}>
                {" "}
                User-submitted flood observations with severity ratings and
                descriptions
              </span>
            </div>
          </div>
          <div style={featureItem}>
            <span style={bullet}>
              <MdNotifications size={28} color={theme.colors.primary} />
            </span>
            <div>
              <strong style={featureStrong}>Official Alerts:</strong>
              <span style={featureDescription}>
                {" "}
                Timely warnings from local emergency management services
              </span>
            </div>
          </div>
          <div style={featureItem}>
            <span style={bullet}>
              <MdCamera size={28} color={theme.colors.primary} />
            </span>
            <div>
              <strong style={featureStrong}>Photo Documentation:</strong>
              <span style={featureDescription}>
                {" "}
                Upload images to provide visual evidence of flooding conditions
              </span>
            </div>
          </div>
          <div style={featureItem}>
            <span style={bullet}>
              <MdSchedule size={28} color={theme.colors.primary} />
            </span>
            <div>
              <strong style={featureStrong}>Historical Data:</strong>
              <span style={featureDescription}>
                {" "}
                Track flood patterns over time to identify high-risk areas
              </span>
            </div>
          </div>
          <div style={featureItem}>
            <span style={bullet}>
              <MdLock size={28} color={theme.colors.primary} />
            </span>
            <div>
              <strong style={featureStrong}>Secure Accounts:</strong>
              <span style={featureDescription}>
                {" "}
                Create a profile to manage your reports and track your
                contributions
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Severity Levels Section */}
      <section style={sectionContainer}>
        <h2 style={sectionTitle}>Understanding Severity Levels</h2>
        <div style={severityGrid}>
          <div style={severityCard}>
            <div
              style={{
                ...severityBadge,
                backgroundColor: "#dcfce7",
                color: "#15803d",
              }}
            >
              Minor
            </div>
            <p style={severityText}>
              Water near curbs, minimal impact on travel, minor street flooding
            </p>
          </div>
          <div style={severityCard}>
            <div
              style={{
                ...severityBadge,
                backgroundColor: "#fed7aa",
                color: "#c2410c",
              }}
            >
              Moderate
            </div>
            <p style={severityText}>
              Localized flooding, some roads affected, use caution when driving
            </p>
          </div>
          <div style={severityCard}>
            <div
              style={{
                ...severityBadge,
                backgroundColor: "#fecaca",
                color: "#991b1b",
              }}
            >
              Severe
            </div>
            <p style={severityText}>
              Major road closures, dangerous conditions, avoid affected areas
            </p>
          </div>
        </div>
      </section>

      {/* Safety Tips Section */}
      <section style={sectionContainer}>
        <h2 style={sectionTitle}>Flood Safety Tips</h2>
        <ul style={tipsList}>
          <li style={tipItem}>
            Never drive through flooded roads – just 6 inches of water can stall
            a vehicle
          </li>
          <li style={tipItem}>
            Turn around, don't drown – most flood deaths occur in vehicles
          </li>
          <li style={tipItem}>
            Stay informed through official channels and emergency alerts
          </li>
          <li style={tipItem}>
            Keep emergency supplies ready: water, food, flashlight, first aid
            kit
          </li>
          <li style={tipItem}>
            Know your evacuation routes and have a family emergency plan
          </li>
          <li style={tipItem}>
            If evacuating, move to higher ground immediately
          </li>
        </ul>
      </section>

      {/* Contact/Footer Section */}
      <section style={footerSection}>
        <h2 style={sectionTitle}>Get Started</h2>
        <p style={bodyText}>
          Ready to contribute to your community's safety? Create an account to
          start reporting flood conditions in your area.
        </p>
        <div style={buttonGroup}>
          <button
            style={primaryButton}
            onClick={() => navigate("/register")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2563eb")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = theme.colors.primary)
            }
          >
            Create Account
          </button>
          <button
            style={secondaryButton}
            onClick={() => navigate("/")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f3f4f6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "white")
            }
          >
            View Map
          </button>
        </div>
      </section>
    </div>
  );
};

// Styles
const pageContainer: React.CSSProperties = {
  maxWidth: 880,
  margin: "0 auto",
  padding: theme.spacing.large,
  fontFamily: "Segoe UI, Roboto, -apple-system, sans-serif",
};

const headerSection: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 48,
  paddingBottom: 24,
  borderBottom: `2px solid ${theme.colors.border}`,
};

const pageTitle: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 700,
  marginBottom: 12,
  color: theme.colors.text,
};

const subtitle: React.CSSProperties = {
  fontSize: 18,
  color: theme.colors.secondary,
  marginTop: 8,
};

const sectionContainer: React.CSSProperties = {
  marginBottom: 48,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 600,
  marginBottom: 20,
  color: theme.colors.text,
};

const bodyText: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.6,
  color: theme.colors.secondary,
  marginBottom: 16,
};

const featureGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 24,
  marginTop: 24,
};

const featureCard: React.CSSProperties = {
  padding: 24,
  backgroundColor: theme.colors.surface,
  borderRadius: 12,
  border: `1px solid ${theme.colors.border}`,
  textAlign: "center",
};

const iconCircle: React.CSSProperties = {
  marginBottom: 16,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const featureTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 12,
  color: theme.colors.text,
};

const featureText: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.5,
  color: theme.colors.secondary,
};

const featureList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const featureItem: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  padding: 16,
  backgroundColor: theme.colors.surface,
  borderRadius: 8,
  border: `1px solid ${theme.colors.border}`,
};

const bullet: React.CSSProperties = {
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
};

const featureStrong: React.CSSProperties = {
  color: theme.colors.text,
  fontWeight: 600,
};

const featureDescription: React.CSSProperties = {
  color: theme.colors.secondary,
};

const severityGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 16,
  marginTop: 24,
};

const severityCard: React.CSSProperties = {
  padding: 20,
  backgroundColor: theme.colors.surface,
  borderRadius: 8,
  border: `1px solid ${theme.colors.border}`,
  textAlign: "center",
};

const severityBadge: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 16px",
  borderRadius: 6,
  fontWeight: 600,
  fontSize: 14,
  marginBottom: 12,
};

const severityText: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.5,
  color: theme.colors.secondary,
};

const tipsList: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const tipItem: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  color: theme.colors.secondary,
  marginBottom: 12,
  paddingLeft: 24,
  position: "relative",
};

const footerSection: React.CSSProperties = {
  textAlign: "center",
  padding: 32,
  backgroundColor: theme.colors.surface,
  borderRadius: 12,
  border: `1px solid ${theme.colors.border}`,
};

const buttonGroup: React.CSSProperties = {
  display: "flex",
  gap: 16,
  justifyContent: "center",
  marginTop: 24,
};

const primaryButton: React.CSSProperties = {
  padding: "12px 24px",
  backgroundColor: theme.colors.primary,
  color: "white",
  border: "none",
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  transition: "background-color 0.2s",
};

const secondaryButton: React.CSSProperties = {
  padding: "12px 24px",
  backgroundColor: "white",
  color: theme.colors.text,
  border: `2px solid ${theme.colors.border}`,
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  transition: "background-color 0.2s",
};

export default About;
