import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { Telemetry } from './types/Telemetry';
import { DroneMap } from './components/DroneMap';
import { TelemetryPanel } from './components/TelemetryPanel';

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

  useEffect(() => {
    socket.on('connect', () => console.log('✅ Connected to backend'));

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
      <h2>🔒 Secure Drone Command Center</h2>
      <DroneMap telemetry={telemetry} />
      <TelemetryPanel telemetry={telemetry} />

      <button onClick={() => sendCommand('RETURN')}>🛬 Return to Base</button>
      <button onClick={() => sendCommand('HOLD')}>⏸️ Hold Position</button>
    </div>
  );
}

export default App;
