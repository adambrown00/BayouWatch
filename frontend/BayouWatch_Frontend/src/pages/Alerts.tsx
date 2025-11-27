import React, { useEffect, useState } from "react";
import { theme } from "../Theme";
import OfficialAlertsCard from "../components/AlertCard";
import type { Alert } from "../components/AlertCard";

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch alerts from backend
  useEffect(() => {
    fetch('http://localhost:8000/api/alerts/')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch alerts');
        return res.json();
      })
      .then(data => {
        console.log('Alerts response:', data);
        console.log('Type of data:', typeof data);
        // Transform backend data to Alert format
        const transformedAlerts: Alert[] = data.alerts.map((alert: any) => ({
          id: alert.id,
          title: alert.title,
          severity: alert.severity,
          description: alert.description,
          area_affected: alert.area_affected || 'Not specified',
          issued_at: new Date(alert.issued_at).toLocaleString(),
        }));
        
        setAlerts(transformedAlerts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching alerts:', err);
        setError('Failed to load alerts');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={pageContainer}>
        <p>Loading alerts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageContainer}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={pageContainer}>
      <div style={titleRow}>
        <h1 style={pageTitle}>Official Flood Alerts</h1>
      </div>
      
      {alerts.length === 0 ? (
        <p style={emptyMessage}>No active alerts at this time</p>
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

// Styles remain the same
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