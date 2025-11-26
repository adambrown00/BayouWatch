import React from "react";
import { useNavigate } from "react-router-dom";
import FloodReportCard from "../components/FloodReportCard";
import HistoryMap from "../components/HistoryMap";
import type { HistoryMapReport } from "../components/HistoryMap";
import "./FloodHistory.css"; // Page stylings

// Defined severity types
type Severity = "severe" | "moderate" | "minor";

// Extended report type with additional fields
interface FloodReport extends HistoryMapReport {
  reportedBy: string;
  date: string;
  location: string;
  type: string;
}

// Mock flood reports data, to be replaced through database integration
const mockReports: FloodReport[] = [
  {
    id: 1,
    reportedBy: "Alice",
    date: "2025-11-20",
    location: "Choctaw Dr.",
    type: "Street Flood",
    severity: "severe",
    description: "Heavily flooded streets after heavy rain",
    latitude: 30.470875,
    longitude: -91.131796,
  },
  {
    id: 2,
    reportedBy: "Bob",
    date: "2025-11-20",
    location: "Perkins Rd.",
    type: "Localized Flood",
    severity: "moderate",
    description: "Moderate street flooding on busy roadway",
    latitude: 30.420964,
    longitude: -91.152794,
  },
  {
    id: 3,
    reportedBy: "Charlie",
    date: "2025-11-24",
    location: "Terrace Ave.",
    type: "Water Near Curb",
    severity: "minor",
    description: "Water reaching the sidewalk but no road closure",
    latitude: 30.436279,
    longitude: -91.182348,
  },
  {
    id: 4,
    reportedBy: "Dana",
    date: "2025-11-20",
    location: "Nicholson Dr.",
    type: "Road Closure",
    severity: "severe",
    description: "Major roads closed due to flooding",
    latitude: 30.404385,
    longitude: -91.183482,
  },
  {
    id: 5,
    reportedBy: "Eve",
    date: "2025-11-23",
    location: "E McKinley St.",
    type: "Localized Flood",
    severity: "moderate",
    description: "Localized flooding near streets and residences",
    latitude: 30.423661,
    longitude: -91.175389,
  },
];

// Main Flood History page component
export default function FloodHistory() {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = React.useState<FloodReport | null>(
    null
  );

  return (
    <div className="history-container">
      {/* Title */}
      <div className="history-header">
        <h1 className="history-title">Flood History (Past 7 Days)</h1>

        <button
          className="history-report-button"
          onClick={() => navigate("/reporting")}
        >
          Report New Flood
        </button>
      </div>

      {/* Subtitle */}
      <p className="history-subtitle">
        See the latest flood activity around Baton Rouge. Click any report to
        highlight it on the map.
      </p>

      {/* Content grid */}
      <div className="history-grid">
        {/* Left column */}
        <div className="history-list">
          {mockReports.length === 0 ? (
            <p className="no-reports">No recent reports.</p>
          ) : (
            mockReports.map((r) => (
              <div
                key={r.id}
                className="history-clickable-card"
                onClick={() => setSelectedReport(r)}
              >
                <FloodReportCard
                  reportedBy={r.reportedBy}
                  date={r.date}
                  location={r.location}
                  type={r.type}
                  severity={r.severity as Severity}
                  description={r.description}
                />
              </div>
            ))
          )}
        </div>

        {/* Right column */}
        <div className="history-map-panel">
          {selectedReport ? (
            <HistoryMap selectedReport={selectedReport} />
          ) : (
            <div className="history-map-placeholder">
              🗺️ Click a report to view its location on the map
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
