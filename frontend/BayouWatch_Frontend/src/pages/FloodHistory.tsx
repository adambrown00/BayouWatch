import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FloodReportCard from "../components/FloodReportCard";
import HistoryMap from "../components/HistoryMap";
import type { HistoryMapReport } from "../components/HistoryMap";
import "./FloodHistory.css";

type Severity = "severe" | "moderate" | "minor";

interface FloodReport extends HistoryMapReport {
  reportedBy: string;
  date: string;
  location: string;
  type: string;
}

export default function FloodHistory() {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState<FloodReport | null>(null);
  const [reports, setReports] = useState<FloodReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reports from backend
  useEffect(() => {
    fetch('http://localhost:8000/api/reports/')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch reports');
        return res.json();
      })
      .then(data => {
        // Transform backend data to FloodReport format
        const transformedReports: FloodReport[] = data.reports.map((report: any) => ({
          id: report.id,
          reportedBy: report.username,
          date: new Date(report.created_at).toLocaleDateString(),
          location: `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`, // For now, show coordinates
          type: getFloodType(report.severity), // Helper function to determine type
          severity: report.severity,
          description: report.description || 'No description provided',
          latitude: report.latitude,
          longitude: report.longitude,
        }));
        
        setReports(transformedReports);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reports:', err);
        setError('Failed to load flood reports');
        setLoading(false);
      });
  }, []);

  // Helper function to determine flood type based on severity
  function getFloodType(severity: string): string {
    switch (severity) {
      case 'severe':
        return 'Road Closure';
      case 'moderate':
        return 'Localized Flood';
      case 'minor':
        return 'Water Near Curb';
      default:
        return 'Flood Report';
    }
  }

  if (loading) {
    return (
      <div className="history-container">
        <p>Loading flood reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-container">
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

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
          {reports.length === 0 ? (
            <p className="no-reports">No recent reports.</p>
          ) : (
            reports.map((r) => (
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