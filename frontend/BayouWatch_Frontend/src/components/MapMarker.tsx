import React from "react";
import { Marker, Popup } from "react-leaflet";
import { DivIcon } from "leaflet";


type Severity = 'minor' | 'moderate' | 'severe';

interface FloodMarkerProps {
    latitude: number;
    longitude: number;
    severity: Severity;
    description: string;
}

const getColorBySeverity = (severity: Severity): string => {
    switch (severity) {
        case 'minor':
            return 'green';
        case 'moderate':
            return 'orange';
        case 'severe':
            return 'red';
        default:
            return 'gray';
    }
};
const createSeverityIcon = (severity: Severity): DivIcon => {
    const color = getColorBySeverity(severity); 
    return new DivIcon({
       className: 'custom-marker-icon',
       html : `<div style="
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


const MapMarker: React.FC<FloodMarkerProps> = ({ latitude, longitude, severity, description}) => {
    return (
        <Marker 
        position={[latitude, longitude]} 
        icon={createSeverityIcon((severity))}>
            <Popup>{description}</Popup>
        </Marker>
    );
}
export default MapMarker;
