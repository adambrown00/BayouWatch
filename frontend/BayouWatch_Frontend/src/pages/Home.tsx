import React, { useRef } from "react";
import "leaflet/dist/leaflet.css";
import Map from "../components/Map";
import { useNavigate } from "react-router-dom";
import { theme } from "../Theme";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement | null>(null);

  return (
    <main style={pageContainer}>
      {/* Hero Section */}
      <section style={heroSection}>
        <div style={heroContent}>
          <h1 style={heroTitle}>Welcome to BayouWatch</h1>
          <p style={heroSubtitle}>
            Community-powered flood monitoring for Baton Rouge. View real-time
            reports, official alerts, and historical trends on an interactive
            map.
          </p>
          <div style={ctaRow}>
            <button
              style={primaryButton}
              onClick={() => navigate("/reporting")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#2563eb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = theme.colors.primary)
              }
            >
              Report Flood (Address)
            </button>
            <button
              style={secondaryButton}
              onClick={() =>
                mapRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "white")
              }
            >
              Explore Map
            </button>
          </div>
          <p style={helperText}>
            Tip: Click any marker on the map to view details, or submit a new
            report using a street address and severity level.
          </p>
        </div>
      </section>

      {/* Map Section */}
      <section style={mapSection} ref={mapRef}>
        <div style={panel}>
          <h2 style={panelTitle}>Live Flood Activity Map</h2>
          <p style={panelSubtitle}>
            Zoom and pan to explore reports around Baton Rouge. Markers are
            color-coded by severity: Minor (green), Moderate (orange), Severe
            (red).
          </p>
          <div style={mapContainer}>
            <Map />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

// Styles
const pageContainer: React.CSSProperties = {
  maxWidth: 1000,
  margin: "0 auto",
  padding: theme.spacing.large,
  fontFamily: "Segoe UI, Roboto, -apple-system, sans-serif",
};

const heroSection: React.CSSProperties = {
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: 12,
  padding: 24,
  marginBottom: 24,
  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
};

const heroContent: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const heroTitle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  color: theme.colors.text,
  margin: 0,
};

const heroSubtitle: React.CSSProperties = {
  fontSize: 16,
  color: theme.colors.secondary,
};

const ctaRow: React.CSSProperties = {
  display: "flex",
  gap: 12,
  marginTop: 8,
};

const primaryButton: React.CSSProperties = {
  padding: "10px 18px",
  backgroundColor: theme.colors.primary,
  color: "white",
  border: "none",
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  transition: "background-color 0.2s",
};

const secondaryButton: React.CSSProperties = {
  padding: "10px 18px",
  backgroundColor: "white",
  color: theme.colors.text,
  border: `2px solid ${theme.colors.border}`,
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  transition: "background-color 0.2s",
};

const helperText: React.CSSProperties = {
  fontSize: 14,
  color: theme.colors.secondary,
  marginTop: 8,
};

const mapSection: React.CSSProperties = {
  marginTop: 16,
};

const panel: React.CSSProperties = {
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: 12,
  padding: 16,
};

const panelTitle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: theme.colors.text,
  marginBottom: 6,
};

const panelSubtitle: React.CSSProperties = {
  fontSize: 14,
  color: theme.colors.secondary,
  marginBottom: 12,
};

const mapContainer: React.CSSProperties = {
  height: 520,
  borderRadius: 12,
  overflow: "hidden",
};
