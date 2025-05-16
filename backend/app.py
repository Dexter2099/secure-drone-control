# ✅ Monkey patch FIRST, before anything else
import eventlet
eventlet.monkey_patch()

from flask import Flask, request
from flask_socketio import SocketIO
import sqlite3
from datetime import datetime

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

def save_to_db(data):
    conn = sqlite3.connect("telemetry.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS telemetry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lat REAL, lon REAL, altitude REAL, speed REAL, battery REAL, timestamp TEXT
        )
    ''')
    cursor.execute('''
        INSERT INTO telemetry (lat, lon, altitude, speed, battery, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        data['lat'], data['lon'], data['altitude'],
        data['speed'], data['battery'],
        datetime.utcnow().isoformat()
    ))
    conn.commit()
    conn.close()

@socketio.on('connect')
def on_connect():
    print("[+] Client connected.")
    socketio.emit("server_status", {"msg": "Secure link established."})

@socketio.on('telemetry')
def on_telemetry(data):
    print("[DRONE] Telemetry received:", data)
    save_to_db(data)
    socketio.emit("telemetry", data)

@socketio.on('send_command')
def on_command(data):
    print("[COMMAND] Received:", data)

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000)

