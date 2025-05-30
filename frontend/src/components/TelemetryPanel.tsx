import type { Telemetry } from '../types/Telemetry';

interface Props {
  telemetry: Telemetry;
}

const TelemetryPanel = ({ telemetry }: Props) => {
  const getBatteryClass = (battery: number): string => {
    if (battery > 50) return 'battery-high';
    if (battery > 20) return 'battery-medium';
    return 'battery-low';
  };

  return (
    <div>
      <p>
        🛰️ Lat: {telemetry.lat.toFixed(6)} | Lon: {telemetry.lon.toFixed(6)}
      </p>
      <p>
        🪂 Altitude: {telemetry.altitude.toFixed(1)} m | Speed: {telemetry.speed.toFixed(1)} km/h
      </p>
      <p>
        🔋 Battery: <span className={getBatteryClass(telemetry.battery)}>{telemetry.battery.toFixed(1)}%</span>
      </p>
    </div>
  );
};

export default TelemetryPanel;
