import React from "react";
import { Marker, Popup } from "react-leaflet";
import { DivIcon } from "leaflet";

export type Severity = "minor" | "moderate" | "severe";

interface FloodMarkerProps {
  latitude: number;
  longitude: number;
  severity: Severity;
  description: string;
  photoUrl?: string;
}

const getColorBySeverity = (severity: Severity): string => {
  switch (severity) {
    case "minor":
      return "green"; // green
    case "moderate":
      return "orange"; // yellowish-orange
    case "severe":
      return "red"; // red
    default:
      return "gray";
  }
};
const createSeverityIcon = (severity: Severity): DivIcon => {
  const color = getColorBySeverity(severity);
  return new DivIcon({
    className: "custom-marker-icon",
    html: `<div style="
              background-color: ${color};
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 0 3px rgba(0,0,0,0.5);
            "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const MapMarker: React.FC<FloodMarkerProps> = ({
  latitude,
  longitude,
  severity,
  description,
  photoUrl,
}) => {
  return (
    <Marker
      position={[latitude, longitude]}
      icon={createSeverityIcon(severity)}
    >
      <Popup>
        <div style={{ maxWidth: 240 }}>
          <p style={{ marginBottom: 8 }}>{description}</p>
          {photoUrl && (
            <img
              src={photoUrl}
              alt="Flood report photo"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 6,
                border: "1px solid #ddd",
              }}
            />
          )}
        </div>
      </Popup>
    </Marker>
  );
};
export default MapMarker;
