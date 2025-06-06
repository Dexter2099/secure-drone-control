# ✅ Monkey patch FIRST, before anything else
import eventlet
eventlet.monkey_patch()

from flask import Flask, request, jsonify, make_response
from flask_socketio import SocketIO
import sqlite3
from datetime import datetime
import os

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

DB_FILE = os.getenv("TELEMETRY_DB", "telemetry.db")
COMMAND_TOKEN = os.getenv("COMMAND_TOKEN", "changeme")

def save_to_db(data):
    conn = sqlite3.connect(DB_FILE)
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
    token = data.get('token')
    if token != COMMAND_TOKEN:
        print("[!] Unauthorized command attempt")
        socketio.emit('command_status', {'error': 'unauthorized'})
        return
    print("[COMMAND] Authorized:", data)
    socketio.emit('command', data)


@app.get('/path')
def get_path():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('SELECT lat, lon FROM telemetry ORDER BY id ASC')
    rows = cursor.fetchall()
    conn.close()
    path = [{'lat': r[0], 'lon': r[1]} for r in rows]
    resp = make_response(jsonify(path))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000)

