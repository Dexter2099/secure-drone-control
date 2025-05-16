import socketio
import time
import random

# 🛰️ Init Socket.IO client (no SSL needed for localhost dev)
sio = socketio.Client()

@sio.event
def connect():
    print("✅ Connected to drone control server.")

@sio.event
def disconnect():
    print("🔌 Disconnected from server.")

# 🔓 Connect to backend via HTTP (no SSL issues)
sio.connect('http://localhost:5000', transports=['websocket'])

while True:
    drone_data = {
        'lat': -27.4705 + random.uniform(-0.001, 0.001),
        'lon': 153.0260 + random.uniform(-0.001, 0.001),
        'altitude': random.uniform(50, 150),
        'speed': random.uniform(10, 40),
        'battery': random.uniform(20, 100)
    }
    sio.emit('telemetry', drone_data)
    print("[SIM] Sent telemetry:", drone_data)
    time.sleep(2)
