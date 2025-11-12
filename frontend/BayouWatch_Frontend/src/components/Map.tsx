//import React from 'react';
//import { Icon } from 'leaflet';
//import marker and popup if needed in future
//import { Marker, Popup } from 'react-leaflet';
//import "./app.css";
import 'leaflet'
import { MapContainer, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';



export default function Map() {
    return (
        <MapContainer center={[30.4515, -91.1871]} zoom={12} style={{ height: "100vh", width: "100%", border: "2px solid black", borderRadius: "8px" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
        </MapContainer>
    );
}
   /* { /* return React.createElement(
        MapContainer,
        { center: [30.4515, -91.1871], zoom: 12 , style: { height: "100vh", width: "100%" } },
        React.createElement(TileLayer, {
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }) */ 