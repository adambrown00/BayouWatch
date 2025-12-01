import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import L from "leaflet";
import { type MapMarkerData } from "./Map";
//import createSeverityIcon from './MapMarker';
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const createSeverityIcon = (
  severity: "minor" | "moderate" | "severe"
): L.DivIcon => {
  const colorMap: { [key: string]: string } = {
    minor: "green",
    moderate: "orange",
    severe: "red",
  };
  const color = colorMap[severity] || "gray";

  return new L.DivIcon({
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

interface MapClusterProp {
  markers: MapMarkerData[];
}
const MapCluster = ({ markers }: MapClusterProp) => {
  const map = useMap();

  useEffect(() => {
    const MarkerClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      iconCreateFunction: function (cluster: L.MarkerCluster) {
        return L.divIcon({
          html: `<div style="
                    background-color: rgba(51, 136, 255, 0.6);
                    border: 2px solid white;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 5px rgba(0,0,0,0.5);
                "><span style="color: white; font-weight: bold;">${cluster.getChildCount()}</span></div>`,
          className: "custom-cluster-icon",
          iconSize: L.point(30, 30),
        });
      },
    });
    markers.forEach((marker) => {
      const popupHtml = `
              <div style="max-width:240px">
                <p style="margin-bottom:8px">${marker.description || "No description provided"}</p>
                ${marker.photo_url ? `<img src="${marker.photo_url}" alt="Flood report photo" style="width:100%;height:auto;border-radius:6px;border:1px solid #ddd" />` : ""}
              </div>
            `;
      const leafletMarker = L.marker([marker.latitude, marker.longitude], {
        icon: createSeverityIcon(marker.severity),
      }).bindPopup(popupHtml);

      MarkerClusterGroup.addLayer(leafletMarker);
    });

    map.addLayer(MarkerClusterGroup);

    return () => {
      map.removeLayer(MarkerClusterGroup);
    };
  }, [markers, map]);
  return null; // This component does not render anything itself
};
export default MapCluster;
