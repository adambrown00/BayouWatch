import React, { useEffect, useState } from "react";
import FloodReportCard from "../components/FloodReportCard";

interface FloodReport {
  reportedBy: string;
  date: string;
  location: string;
  type: string;
  severity: string;
  description: string;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<FloodReport[]>([]);

  useEffect(() => {
    const exampleReports: FloodReport[] = [
      {
        reportedBy: "Dany Damos",
        date: "2025-10-30",
        location: "Downtown",
        type: "Flash Flood",
        severity: "High",
        description: "Spotted a flash Flood"
      },
      {
        reportedBy: "Baily Barker",
        date: "2025-10-29",
        location: "Riverbank",
        type: "River Flood",
        severity: "Medium",
        description: "river flood spotted on the riverbank"
      },
      {
       
        reportedBy: "Dina fallon",
        date: "2025-10-29",
        location: "Highland Road",
        type: "Street flood",
        severity: "Medium",
        description: "currently, highland road is flooded" 

      },
    ];
    setReports(exampleReports);
  }, []);

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "Segoe UI, Roboto, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h1 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "10px" }}>
        Flood Report List
      </h1>

      {reports.map((report, index) => (
        <FloodReportCard key={index} {...report} />
      ))}
    </main>
  );
};

export default Reports;