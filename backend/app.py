# ✅ Monkey patch FIRST, before anything else
import eventlet
eventlet.monkey_patch()

import logging
import os
from dotenv import load_dotenv

load_dotenv()

# Configure logging level via environment variable
_log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=getattr(logging, _log_level, logging.INFO))

from flask import Flask, request, jsonify, make_response
from flask_socketio import SocketIO
import sqlite3
from datetime import datetime

app = Flask(__name__)

# Allow configurable CORS origins via env var
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*")
if ALLOWED_ORIGINS != "*":
    CORS_LIST = [origin.strip() for origin in ALLOWED_ORIGINS.split(',') if origin]
else:
    CORS_LIST = "*"

socketio = SocketIO(app, cors_allowed_origins=CORS_LIST, async_mode="eventlet")

DB_FILE = os.getenv("TELEMETRY_DB", "telemetry.db")

PORT = int(os.getenv("PORT", "5000"))

# TLS configuration
TLS_CERT = os.getenv("TLS_CERT", "certs/cert.pem")
TLS_KEY = os.getenv("TLS_KEY", "certs/key.pem")
USE_TLS = os.getenv("USE_TLS", "false").lower() in ("1", "true", "yes")

# Require a command token for issuing control commands
COMMAND_TOKEN = os.environ.get("COMMAND_TOKEN")
if not COMMAND_TOKEN:
    raise RuntimeError("COMMAND_TOKEN environment variable is required")

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
    logging.info("[+] Client connected.")
    socketio.emit("server_status", {"msg": "Secure link established."})

@socketio.on('telemetry')
def on_telemetry(data):
    logging.info("[DRONE] Telemetry received: %s", data)
    save_to_db(data)
    socketio.emit("telemetry", data)

@socketio.on('send_command')
def on_command(data):
    token = data.get('token')
    if token != COMMAND_TOKEN:
        logging.warning("[!] Unauthorized command attempt")
        socketio.emit('command_status', {'error': 'unauthorized'})
        return
    logging.info("[COMMAND] Authorized: %s", data)
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
    resp.headers['Access-Control-Allow-Origin'] = ALLOWED_ORIGINS
    return resp

if __name__ == "__main__":
    ssl_ctx = None
    if USE_TLS or (os.path.exists(TLS_CERT) and os.path.exists(TLS_KEY)):
        ssl_ctx = (TLS_CERT, TLS_KEY)
    run_kwargs = {}
    if ssl_ctx:
        run_kwargs["ssl_context"] = ssl_ctx
    socketio.run(app, host='0.0.0.0', port=PORT, **run_kwargs)

