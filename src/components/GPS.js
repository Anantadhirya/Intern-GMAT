import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

function Recenter({ latitude, longitude }) {
  const map = useMap();
  useEffect(function () {
    map.setView([latitude, longitude]);
  });
}

export default function GPS({ latitude, longitude }) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={2}
      // doubleClickZoom={false}
      // scrollWheelZoom={false}
      // zoomControl={false}
      dragging={false}
      style={{ width: 400, height: 300 }}
    >
      <Recenter latitude={latitude} longitude={longitude} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} />
    </MapContainer>
  );
}
