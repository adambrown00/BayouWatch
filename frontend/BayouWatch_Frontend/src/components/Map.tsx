//import { Icon } from 'leaflet';
//import marker and popup if needed in future
//import { Marker, Popup } from 'react-leaflet';
//import "./app.css";
import { useEffect, useState } from 'react';
import 'leaflet'
import { MapContainer, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import MapMarker from './MapMarker';
import MapCluster from './MarkerClusterGroup';

export interface MapMarkerData {
    latitude: number;
    longitude: number;
    severity: 'minor' | 'moderate' | 'severe';
    description: string;
}

export default function Map() {
    const [markers, setMarkers] = useState<MapMarkerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch reports from backend
        fetch('http://localhost:8000/api/reports')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch reports');
                }
                return res.json();
            })
            .then(data => {
                // Transform backend data to MapMarkerData format
                const markerData: MapMarkerData[] = data.reports.map((report: any) => ({
                    latitude: report.latitude,
                    longitude: report.longitude,
                    severity: report.severity,
                    description: report.description || 'No description provided'
                }));
                setMarkers(markerData);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching reports:', err);
                setError('Failed to load flood reports');
                setLoading(false);
            });
    }, []); // Empty dependency array = run once on component mount

    if (loading) {
        return (
            <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p>Loading map...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    return (
        <MapContainer center={[30.4515, -91.1871]} zoom={12} style={{ height: "100vh", width: "100%", border: "2px solid black", borderRadius: "8px" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {markers.map((marker: MapMarkerData, index: number) => (
                <MapMarker
                    key={index}
                    latitude={marker.latitude}
                    longitude={marker.longitude}
                    severity={marker.severity}
                    description={marker.description}
                />
            ))}
            <MapCluster markers={markers} />
        </MapContainer>
    );
}