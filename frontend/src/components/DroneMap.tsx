import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { Telemetry } from '../types/Telemetry';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type Props = {
  telemetry: Telemetry;
};

const RecenterMap = ({ lat, lon }: { lat: number; lon: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon]);
  }, [lat, lon, map]);
  return null;
};

export const DroneMap = ({ telemetry }: Props) => {
  return (
    <MapContainer
      center={[telemetry.lat, telemetry.lon]}
      zoom={16}
      style={{ height: '400px', width: '100%' }}
    >
      <RecenterMap lat={telemetry.lat} lon={telemetry.lon} />
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={[telemetry.lat, telemetry.lon]}>
        <Popup>
          🛰️ Alt: {telemetry.altitude.toFixed(1)} m<br />
          ⚡ Battery: {telemetry.battery.toFixed(1)}%
        </Popup>
      </Marker>
    </MapContainer>
  );
};
