import React from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import type { Severity } from "./MapMarker";
import MapMarker from "./MapMarker";

// Structure of reports pushed to HistoryMap
// Used to center map marker when clicked
export interface HistoryMapReport {
  id: number;
  latitude: number;
  longitude: number;
  description: string;
  severity: Severity;
}

// Props for HistoryMap component
interface HistoryMapProps {
  selectedReport: HistoryMapReport | null;
}

const DEFAULT_CENTER: [number, number] = [30.45, -91.15]; // Baton Rouge

// Moves map when report changes
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  React.useEffect(() => {
    map.flyTo(center, 14, { duration: 0.5 });
  }, [center, map]);

  return null;
}

// HistoryMap component displaying flood reports
const HistoryMap: React.FC<HistoryMapProps> = ({ selectedReport }) => {
  const center: [number, number] = selectedReport
    ? [selectedReport.latitude, selectedReport.longitude]
    : DEFAULT_CENTER;

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ width: "100%", height: "100%", borderRadius: 16 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Fly-to animation */}
      <MapUpdater center={center} />

      {/* Severity marker colors*/}
      {selectedReport && (
        <MapMarker
          latitude={selectedReport.latitude}
          longitude={selectedReport.longitude}
          severity={selectedReport.severity}
          description={selectedReport.description}
        />
      )}
    </MapContainer>
  );
};

export default HistoryMap;
