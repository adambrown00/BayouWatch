import React from "react";

const MapLegend: React.FC = () => {
  return (
    <div style={legendContainer}>
      <h3 style={legendTitle}>Severity Levels</h3>
      <div style={legendItems}>
        <div style={legendItem}>
          <div style={{ ...marker, backgroundColor: "#22c55e" }}></div>
          <span style={legendText}>Minor</span>
        </div>
        <div style={legendItem}>
          <div style={{ ...marker, backgroundColor: "#f97316" }}></div>
          <span style={legendText}>Moderate</span>
        </div>
        <div style={legendItem}>
          <div style={{ ...marker, backgroundColor: "#ef4444" }}></div>
          <span style={legendText}>Severe</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;

// Styles
const legendContainer: React.CSSProperties = {
  backgroundColor: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: "12px 16px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  marginTop: 12,
  display: "inline-block",
};

const legendTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "#1f2937",
  margin: "0 0 8px 0",
};

const legendItems: React.CSSProperties = {
  display: "flex",
  gap: 16,
  alignItems: "center",
};

const legendItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const marker: React.CSSProperties = {
  width: 16,
  height: 16,
  borderRadius: "50%",
  border: "2px solid white",
  boxShadow: "0 0 0 1px rgba(0,0,0,0.2)",
};

const legendText: React.CSSProperties = {
  fontSize: 13,
  color: "#4b5563",
  fontWeight: 500,
};
