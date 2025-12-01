import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaCalendar,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaFileAlt,
} from "react-icons/fa";
import { theme } from "../Theme";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

interface PendingReport {
  id: number;
  username: string;
  latitude: number;
  longitude: number;
  severity: string;
  description: string;
  photo_url?: string;
  created_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<PendingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pending reports
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8000/api/reports/pending", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 403) {
          throw new Error("Access denied - Admin only");
        }
        if (!res.ok) throw new Error("Failed to fetch pending reports");
        return res.json();
      })
      .then((data) => {
        setReports(data.reports);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pending reports:", err);
        setError(err.message || "Failed to load pending reports");
        setLoading(false);
      });
  }, [navigate]);

  const handleApprove = async (reportId: number) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8000/api/reports/${reportId}/status?status=approved`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to approve report");

      // Remove from list
      setReports(reports.filter((r) => r.id !== reportId));
      alert("Report approved!");
    } catch (err) {
      console.error("Error approving report:", err);
      alert("Failed to approve report");
    }
  };

  const handleReject = async (reportId: number) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8000/api/reports/${reportId}/status?status=rejected`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to reject report");

      // Remove from list
      setReports(reports.filter((r) => r.id !== reportId));
      alert("Report rejected");
    } catch (err) {
      console.error("Error rejecting report:", err);
      alert("Failed to reject report");
    }
  };

  if (loading) {
    return (
      <div style={pageContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageContainer}>
        <div style={errorContainer}>
          <FaTimesCircle size={48} color={theme.colors.danger} />
          <h1 style={errorTitle}>Access Denied</h1>
          <p style={errorMessage}>{error}</p>
          <button onClick={() => navigate("/")} style={backButton}>
            <FaArrowLeft style={{ marginRight: 8 }} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={headerContainer}>
        <h1 style={pageTitle}>Admin Dashboard</h1>
        <button onClick={() => navigate("/")} style={backButtonSmall}>
          <FaArrowLeft style={{ marginRight: 6 }} />
          Back
        </button>
      </div>

      {/* Subtitle */}
      <div style={subtitleContainer}>
        <h2 style={subtitle}>Pending Reports ({reports.length})</h2>
        <p style={description}>
          Review and approve or reject flood reports submitted by users
        </p>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <EmptyState
          message="No pending reports to review"
          icon={<FaFileAlt size={48} color={theme.colors.secondary} />}
        />
      ) : (
        <div style={reportsContainer}>
          {reports.map((report) => (
            <div key={report.id} style={reportCard}>
              {/* Header with ID and Severity */}
              <div style={cardHeader}>
                <div style={cardTitleSection}>
                  <h3 style={cardTitle}>Report #{report.id}</h3>
                </div>
                <span
                  style={{
                    ...severityBadge,
                    backgroundColor: getSeverityColor(report.severity)
                      .background,
                    color: getSeverityColor(report.severity).text,
                  }}
                >
                  {report.severity.charAt(0).toUpperCase() +
                    report.severity.slice(1)}
                </span>
              </div>

              {/* Report Details */}
              <div style={cardBody}>
                <div style={infoRow}>
                  <FaUser size={16} color={theme.colors.primary} />
                  <span style={label}>Submitted by:</span>
                  <span style={value}>{report.username}</span>
                </div>
                <div style={infoRow}>
                  <FaCalendar size={16} color={theme.colors.primary} />
                  <span style={label}>Date:</span>
                  <span style={value}>
                    {new Date(report.created_at).toLocaleString()}
                  </span>
                </div>
                <div style={infoRow}>
                  <FaMapMarkerAlt size={16} color={theme.colors.primary} />
                  <span style={label}>Location:</span>
                  <span style={value}>
                    {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                  </span>
                </div>
                <div style={infoRow}>
                  <FaExclamationTriangle
                    size={16}
                    color={theme.colors.primary}
                  />
                  <span style={label}>Description:</span>
                  <span style={value}>
                    {report.description || "No description provided"}
                  </span>
                </div>
                {report.photo_url && (
                  <div style={{ marginTop: 8 }}>
                    <img
                      src={report.photo_url}
                      alt="Flood report photo"
                      style={{
                        maxWidth: 360,
                        width: "100%",
                        height: "auto",
                        borderRadius: 8,
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={buttonContainer}>
                <button
                  onClick={() => handleApprove(report.id)}
                  style={approveButton}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      theme.colors.success)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#16a34a")
                  }
                >
                  <FaCheckCircle style={{ marginRight: 6 }} />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(report.id)}
                  style={rejectButton}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      theme.colors.danger)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#dc2626")
                  }
                >
                  <FaTimesCircle style={{ marginRight: 6 }} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function for severity colors
function getSeverityColor(severity: string) {
  switch (severity) {
    case "severe":
      return { background: "#fee2e2", text: "#991b1b" };
    case "moderate":
      return { background: "#fed7aa", text: "#9a3412" };
    case "minor":
      return { background: "#dcfce7", text: "#166534" };
    default:
      return { background: "#f1f5f9", text: "#475569" };
  }
}

// Styles
const pageContainer: React.CSSProperties = {
  maxWidth: 880,
  margin: "0 auto",
  padding: theme.spacing.large,
};

const headerContainer: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing.large,
};

const pageTitle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  color: theme.colors.text,
  margin: 0,
};

const backButtonSmall: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "10px 16px",
  backgroundColor: "transparent",
  color: theme.colors.primary,
  border: `2px solid ${theme.colors.border}`,
  borderRadius: theme.borderRadius.medium,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s",
};

const subtitleContainer: React.CSSProperties = {
  marginBottom: theme.spacing.large,
};

const subtitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  color: theme.colors.text,
  marginBottom: theme.spacing.small,
};

const description: React.CSSProperties = {
  fontSize: 14,
  color: theme.colors.secondary,
  margin: 0,
};

const reportsContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.medium,
};

const reportCard: React.CSSProperties = {
  backgroundColor: theme.colors.background,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.borderRadius.large,
  padding: theme.spacing.large,
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
};

const cardHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: theme.spacing.medium,
  paddingBottom: theme.spacing.medium,
  borderBottom: `1px solid ${theme.colors.border}`,
};

const cardTitleSection: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const cardTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  color: theme.colors.text,
  margin: 0,
};

const severityBadge: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: "16px",
  fontSize: 13,
  fontWeight: 600,
};

const cardBody: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.small,
  marginBottom: theme.spacing.medium,
};

const infoRow: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing.small,
  fontSize: 14,
};

const label: React.CSSProperties = {
  fontWeight: 600,
  color: theme.colors.text,
  minWidth: 120,
};

const value: React.CSSProperties = {
  color: theme.colors.secondary,
  flex: 1,
};

const buttonContainer: React.CSSProperties = {
  display: "flex",
  gap: theme.spacing.small,
};

const approveButton: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "12px 20px",
  backgroundColor: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: theme.borderRadius.medium,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  transition: "background-color 0.2s",
};

const rejectButton: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "12px 20px",
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: theme.borderRadius.medium,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  transition: "background-color 0.2s",
};

const errorContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "48px 24px",
  textAlign: "center",
};

const errorTitle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  color: theme.colors.danger,
  marginTop: theme.spacing.medium,
  marginBottom: theme.spacing.small,
};

const errorMessage: React.CSSProperties = {
  fontSize: 16,
  color: theme.colors.secondary,
  marginBottom: theme.spacing.large,
};

const backButton: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "12px 24px",
  backgroundColor: theme.colors.primary,
  color: "white",
  border: "none",
  borderRadius: theme.borderRadius.medium,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  transition: "background-color 0.2s",
};
