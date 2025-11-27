import React from "react";
import "./FloodReportCard.css";
import {
  FaUser,
  FaCalendar,
  FaMapMarkerAlt,
  FaWater,
  FaExclamationTriangle,
} from "react-icons/fa";

// Defined severity types
export type Severity = "severe" | "moderate" | "minor";

interface FloodReportCardProps {
  reportedBy: string;
  date: string;
  location: string;
  type: string;
  severity: Severity;
  description: string;
}

const FloodReportCard: React.FC<FloodReportCardProps> = ({
  reportedBy,
  date,
  location,
  type,
  severity,
  description,
}) => {

  // Define colors for severity levels
  const severityColors = {
    severe: "red",   // red
    moderate: "orange", // orange
    minor: "green",    // green
  };

  const sevColor = severityColors[severity];
  
  return (
    <div
      className="flood-card"
      style={{
        borderLeft: `6px solid ${sevColor}`,
      }}
    >
      <div className="flood-card-row">
        <FaUser size={16} color="#007bff" />
        <span className="flood-label">Reported by:</span>
        <span>{reportedBy}</span>
      </div>
      <div className="flood-card-row">
        <FaCalendar size={16} color="#007bff" />
        <span className="flood-label">Date:</span>
        <span>{date}</span>
      </div>
      <div className="flood-card-row">
        <FaMapMarkerAlt size={16} color="#007bff" />
        <span className="flood-label">Location:</span>
        <span>{location}</span>
      </div>
      <div className="flood-card-row">
        <FaWater size={16} color="#007bff" />
        <span className="flood-label">Type:</span>
        <span>{type}</span>
      </div>
      <div className="flood-card-row">
        <FaExclamationTriangle size={16} color="#007bff" />
        <span className="flood-label">Severity:</span>
        <span>{severity}</span>
      </div>
      <div className="flood-card-row description-row">
        <span className="flood-label">Description:</span>
        <span>{description}</span>
      </div>
    </div>
  );
};

export default FloodReportCard;
