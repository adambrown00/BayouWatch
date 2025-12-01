//import { Icon } from 'leaflet';
//import marker and popup if needed in future
//import { Marker, Popup } from 'react-leaflet';
//import "./app.css";
import { useEffect, useState } from "react";
import "leaflet";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapMarker from "./MapMarker";
import MapCluster from "./MarkerClusterGroup";
import { useNavigate } from "react-router-dom";

export interface MapMarkerData {
  latitude: number;
  longitude: number;
  severity: "minor" | "moderate" | "severe";
  description: string;
  photo_url?: string;
}

// Map Clicker component to handle map clicks for reports
function MapClickHandler() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;

      // Ask user to confirm they want to report at this location
      const confirm = window.confirm(
        `Report flooding at this location?\n\nCoordinates: (${lat.toFixed(4)}, ${lng.toFixed(4)})`
      );

      if (confirm)
        // Navigate to reporting page with lat/lng in state
        navigate(`/reporting?lat=${lat}&lng=${lng}`);
    },
  });

  return null; // This component does not render anything visible to user
}
export default function Map() {
  const [markers, setMarkers] = useState<MapMarkerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch reports from backend
    fetch("http://localhost:8000/api/reports")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch reports");
        }
        return res.json();
      })
      .then((data) => {
        // Transform backend data to MapMarkerData format
        const markerData: MapMarkerData[] = data.reports.map((report: any) => ({
          latitude: report.latitude,
          longitude: report.longitude,
          severity: report.severity,
          description: report.description || "No description provided",
          photo_url: report.photo_url || undefined,
        }));
        setMarkers(markerData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setError("Failed to load flood reports");
        setLoading(false);
      });
  }, []); // Empty dependency array = run once on component mount

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Loading map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[30.4515, -91.1871]}
      zoom={12}
      style={{
        height: "100vh",
        width: "100%",
        border: "2px solid black",
        borderRadius: "8px",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapClickHandler />

      {markers.map((marker: MapMarkerData, index: number) => (
        <MapMarker
          key={index}
          latitude={marker.latitude}
          longitude={marker.longitude}
          severity={marker.severity}
          description={marker.description}
          photoUrl={marker.photo_url}
        />
      ))}
      <MapCluster markers={markers} />
    </MapContainer>
  );
}
