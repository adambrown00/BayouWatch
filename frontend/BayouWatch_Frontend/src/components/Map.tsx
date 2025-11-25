//import { Icon } from 'leaflet';
//import marker and popup if needed in future
//import { Marker, Popup } from 'react-leaflet';
//import "./app.css";
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
// Sample data for map markers
const MapMarkerData: MapMarkerData[] = [
    { latitude: 30.4515, longitude: -91.1870, severity: 'minor', description: 'Minor flooding reported here.' },
    { latitude: 30.4540, longitude: -91.1765, severity: 'moderate', description: 'Moderate flooding reported here.' },
    { latitude: 30.4480, longitude: -91.1888, severity: 'severe', description: 'Severe flooding reported here.' },
]; 

export default function Map() {
    return (
        <MapContainer center={[30.4515, -91.1871]} zoom={12} style={{ height: "100vh", width: "100%", border: "2px solid black", borderRadius: "8px" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            {MapMarkerData.map((marker: MapMarkerData, index: number) => (
                <MapMarker
                    key={index }
                    latitude={marker.latitude}
                    longitude={marker.longitude}
                    severity={marker.severity}
                    description={marker.description}
                />
            ))}
            <MapCluster markers={MapMarkerData} />
        </MapContainer>
    );
}
