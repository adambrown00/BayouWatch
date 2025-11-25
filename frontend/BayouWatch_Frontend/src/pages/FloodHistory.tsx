import React from "react";
import { useNavigate } from "react-router-dom";
import FloodReportCard from "../components/FloodReportCard";
import "./FloodHistory.css";

// Mock data
const mockReports = [
  {
    reportedBy: "Alice",
    date: "2025-11-10",
    location: "Bayou St. John",
    type: "Street Flood",
    severity: "High",
    description: "Flooded streets after heavy rain",
  },
  {
    reportedBy: "Bob",
    date: "2025-11-11",
    location: "French Quarter",
    type: "Localized Flood",
    severity: "Medium",
    description: "Minor street flooding in front of houses",
  },
  {
    reportedBy: "Charlie",
    date: "2025-11-12",
    location: "Lakeview",
    type: "Water Near Curb",
    severity: "Low",
    description: "Water reaching the sidewalk but no road closure",
  },
  {
    reportedBy: "Dana",
    date: "2025-11-13",
    location: "Mid-City",
    type: "Road Closure",
    severity: "High",
    description: "Major roads closed due to flooding",
  },
  {
    reportedBy: "Eve",
    date: "2025-11-14",
    location: "Bywater",
    type: "Localized Flood",
    severity: "Medium",
    description: "Localized flooding near parks and streets",
  },
];

export default function FloodHistory() {
  const navigate = useNavigate();

  return (
    <div className="flood-history-page">
      <div className="top-bar">
        <h1>Flood History</h1>
        <button onClick={() => navigate("/reporting")}>
          Create Report
        </button>
      </div>

      <div className="reports-grid">
        {mockReports.map((report, idx) => (
          <FloodReportCard
            key={idx}
            reportedBy={report.reportedBy}
            date={report.date}
            location={report.location}
            type={report.type}
            severity={report.severity}
            description={report.description}
          />
        ))}
      </div>
    </div>
  );
}
