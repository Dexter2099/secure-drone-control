import { useEffect, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';
import type { Telemetry } from './types/Telemetry';
import { DroneMap } from './components/DroneMap';

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
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected to backend');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from backend');
      setIsConnected(false);
    });

    socket.on('telemetry', (data: Telemetry) => {
      console.log('📡 Telemetry received:', data);
      setTelemetry(data);
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
    <div style={{ padding: '2rem' }}>
      <h2>
        🔒 Secure Drone Command Center
        <span className="connection-status">
          <span
            className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}
          ></span>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </h2>
      <DroneMap telemetry={telemetry} />
      <p>🛰️ Lat: {telemetry.lat.toFixed(6)} | Lon: {telemetry.lon.toFixed(6)}</p>
      <p>🪂 Altitude: {telemetry.altitude.toFixed(1)} m | Speed: {telemetry.speed.toFixed(1)} km/h</p>
      <p>🔋 Battery: {telemetry.battery.toFixed(1)}%</p>

      <button onClick={() => sendCommand('RETURN')}>🛬 Return to Base</button>
      <button onClick={() => sendCommand('HOLD')}>⏸️ Hold Position</button>
    </div>
  );
}

export default App;
