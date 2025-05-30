import type { Telemetry } from '../types/Telemetry';

type Props = {
  telemetry: Telemetry;
};

export const TelemetryPanel = ({ telemetry }: Props) => {
  return (
    <ul className="telemetry-panel">
      <li>Latitude: {telemetry.lat.toFixed(6)}</li>
      <li>Longitude: {telemetry.lon.toFixed(6)}</li>
      <li>Altitude: {telemetry.altitude.toFixed(1)} m</li>
      <li>Speed: {telemetry.speed.toFixed(1)} km/h</li>
      <li>Battery: {telemetry.battery.toFixed(1)}%</li>
    </ul>
  );
};
