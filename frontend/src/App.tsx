import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { Telemetry } from './types/Telemetry';
import type { PathPoint } from './types/PathPoint';
import { DroneMap } from './components/DroneMap';
import { Header } from './components/Header';
import './App.css';

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
});

function App() {
  const [telemetry, setTelemetry] = useState<Telemetry>({
    lat: -27.4705,
    lon: 153.0260,
    altitude: 100,
    speed: 0,
    battery: 100,
  });
  const [connected, setConnected] = useState(false);
  const [path, setPath] = useState<PathPoint[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/path')
      .then((res) => res.json())
      .then((data: PathPoint[]) => setPath(data))
      .catch((err) => console.error('Failed to load path', err));

    socket.on('connect', () => {
      console.log('✅ Connected to backend');
      setConnected(true);
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('telemetry', (data: Telemetry) => {
      console.log('📡 Telemetry received:', data);
      setTelemetry(data);
      setPath((prev) => [...prev, { lat: data.lat, lon: data.lon }]);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
    });

    socket.onAny((event, value) => {
      console.log('📥 Received event:', event, value);
    });
  }, []);

  const sendCommand = (cmd: string) => {
    socket.emit('send_command', { command: cmd });
  };

  return (
    <div className="app-container">
      <Header connected={connected} />
      <main>
        <DroneMap telemetry={telemetry} path={path} />
        <p>
          🛰️ Lat: {telemetry.lat.toFixed(6)} | Lon: {telemetry.lon.toFixed(6)}
        </p>
        <p>
          🪂 Altitude: {telemetry.altitude.toFixed(1)} m | Speed:{' '}
          {telemetry.speed.toFixed(1)} km/h
        </p>
        <p>🔋 Battery: {telemetry.battery.toFixed(1)}%</p>

        <button onClick={() => sendCommand('RETURN')}>🛬 Return to Base</button>
        <button onClick={() => sendCommand('HOLD')}>⏸️ Hold Position</button>
      </main>
    </div>
  );
}

export default App;
