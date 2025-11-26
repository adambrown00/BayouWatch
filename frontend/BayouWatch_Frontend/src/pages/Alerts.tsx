import React from "react";
import { theme } from "../Theme";
import OfficialAlertsCard from "../components/AlertCard";
import type { Alert } from "../components/AlertCard";

const mockAlerts: Alert[] = [
  {
    id: 1,
    title: "Flash Flood Warning",
    severity: "severe",
    description:
      "Take Immediate Action! Dangerous, rapid flooding is occurring or will occur soon. Urgent threat to life and property. Move to safety or higher ground as fast as possible.",
    area_affected: "Downtown Baton Rouge, Riverfront",
    issued_at: "2025-11-20 14:35",
  },
  {
    id: 2,
    title: "Flood Watch",
    severity: "moderate",
    description:
      "Conditions are favorable for flooding. Stay alert and prepared. Water levels may rise quickly in low-lying or poorly drained areas. Monitor local updates, avoid high-water spots, and be ready to act if conditions worsen.",
    area_affected: "Gardere, St. Gabriel, Bayou Manchac corridor",
    issued_at: "2025-11-20 12:10",
  },
  {
    id: 3,
    title: "Flood Advisory",
    severity: "minor",
    description:
      "Minor flooding is occurring or expected in low-lying or poor-drainage areas. Some roads may have standing water. Use caution when traveling, avoid flooded spots, and stay aware of changing conditions.",
    area_affected: "East Baton Rouge & Ascension rural zones",
    issued_at: "2025-11-20 09:45",
  },
];



// Main Alerts Page
export default function Alerts() {
  const [showAlerts, setShowAlerts] = React.useState(true);

  const alerts = showAlerts ? mockAlerts : [];

  return (
    <div style={pageContainer}>
      <div style={titleRow}>
      <h1 style={pageTitle}>Official Flood Alerts</h1>

        <button
          type="button"
          onClick={() => setShowAlerts(prev => !prev)}
          style={toggleButton}
        >
          {showAlerts ? "Show 'No Active Alerts' State" : "Show Mock Alerts"}
        </button>
      </div>

      {alerts.length === 0 ? (
        <p style={emptyMessage}>No active alerts</p>
      ) : (
        <section style={alertsContainer}>
          {alerts.map((alert) => (
            <OfficialAlertsCard key={alert.id} alert={alert} />
          ))}
        </section>
      )}
    </div>
  );
}



// Alerts Page Styles
const pageContainer: React.CSSProperties = {
  maxWidth: 880,
  margin: "0 auto",
  padding: theme.spacing.large,
};

const pageTitle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  marginBottom: parseInt(theme.spacing.medium),
  color: theme.colors.text,
};

const emptyMessage: React.CSSProperties = {
  color: theme.colors.secondary,
  fontSize: 16,
};

const alertsContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const titleRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const toggleButton: React.CSSProperties = {
  background: theme.colors.surface,
  color: theme.colors.text,
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: theme.borderRadius.medium,
  padding: `${theme.spacing.small} ${theme.spacing.medium}`,
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
};