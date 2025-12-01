import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface PendingReport {
  id: number;
  username: string;
  latitude: number;
  longitude: number;
  severity: string;
  description: string;
  created_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<PendingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pending reports
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:8000/api/reports/pending', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 403) {
          throw new Error('Access denied - Admin only');
        }
        if (!res.ok) throw new Error('Failed to fetch pending reports');
        return res.json();
      })
      .then(data => {
        setReports(data.reports);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching pending reports:', err);
        setError(err.message || 'Failed to load pending reports');
        setLoading(false);
      });
  }, [navigate]);

  const handleApprove = async (reportId: number) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:8000/api/reports/${reportId}/status?status=approved`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to approve report');

      // Remove from list
      setReports(reports.filter(r => r.id !== reportId));
      alert('Report approved!');
    } catch (err) {
      console.error('Error approving report:', err);
      alert('Failed to approve report');
    }
  };

  const handleReject = async (reportId: number) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:8000/api/reports/${reportId}/status?status=rejected`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to reject report');

      // Remove from list
      setReports(reports.filter(r => r.id !== reportId));
      alert('Report rejected');
    } catch (err) {
      console.error('Error rejecting report:', err);
      alert('Failed to reject report');
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <p>Loading pending reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Back to Home
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Pending Reports ({reports.length})</h2>
        <p className="text-gray-600">Review and approve/reject flood reports submitted by users</p>
      </div>

      {reports.length === 0 ? (
        <div className="p-8 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">No pending reports to review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map(report => (
            <div 
              key={report.id}
              className="p-6 bg-white border rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Report #{report.id}</h3>
                  <p className="text-sm text-gray-600">
                    Submitted by: <span className="font-medium">{report.username}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  report.severity === 'severe' ? 'bg-red-100 text-red-800' :
                  report.severity === 'moderate' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                </span>
              </div>

              <div className="mb-4 space-y-2">
                <div>
                  <span className="font-medium">Location:</span> {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                </div>
                <div>
                  <span className="font-medium">Description:</span> {report.description || 'No description provided'}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(report.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => handleReject(report.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}