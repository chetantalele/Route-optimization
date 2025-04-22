import React from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ route }) => {
  const defaultCenter = [20.5937, 78.9629]; // Centered on India (or adjust as per your requirements)

  if (!route || !route.features || route.features.length === 0) {
    return <div className="loader">Loading route...</div>;
  }

  const routeCoordinates = route.features[0].geometry.coordinates.map(
    (coord) => [coord[1], coord[0]]
  );

  const start = routeCoordinates[0];
  const end = routeCoordinates[routeCoordinates.length - 1];

  return (
    <MapContainer
      center={start}
      zoom={12}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={routeCoordinates} color="blue" weight={4} opacity={0.7} />
      <Marker position={start}>
        <Popup>Start</Popup>
      </Marker>
      <Marker position={end}>
        <Popup>End</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
