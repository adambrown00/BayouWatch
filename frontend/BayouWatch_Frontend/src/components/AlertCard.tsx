import React from "react";
import "./AlertCard.css";

export type Severity = "severe" | "moderate" | "minor";

export interface Alert {
  id: number;
  title: string;
  severity: Severity;
  description: string;
  area_affected: string;
  issued_at: string;
}

interface OfficialAlertsCardProps {
  alert: Alert;
}

const OfficialAlertsCard: React.FC<OfficialAlertsCardProps> = ({ alert }) => {
  return (
    <div className={`alert-card alert-card-${alert.severity}`}>
      <div className="alert-card-header">
        <h2 className="alert-card-title">{alert.title}</h2>

        <span className={`alert-badge alert-badge-${alert.severity}`}>
          {alert.severity.toUpperCase()}
        </span>
      </div>

      <p className="alert-card-description">{alert.description}</p>

      <div className="alert-card-meta">
        <div>
          <strong>Area affected:</strong> {alert.area_affected}
        </div>
        <div>
          <strong>Issued:</strong> {alert.issued_at}
        </div>
      </div>
    </div>
  );
};

export default OfficialAlertsCard;
