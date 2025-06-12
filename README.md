# Drone Command & Control System

A real-time drone telemetry and command interface, modeled after military-grade operations for UAV control. Built using modern web technologies and secure communication protocols, this project is designed to simulate tactical drone oversight — ideal for aerospace, defense, or simulation software roles.

---

## Features

- Real-time drone telemetry stream (lat, lon, altitude, speed, battery)
- Live drone marker with auto-recentering on **Leaflet.js** map
- Send tactical commands to the drone: `Return to Base`, `Hold Position`
- Socket.IO over secure or plain WebSocket channel
- Persistent telemetry logging to **SQLite**
- Simple Python drone simulator included
- Built with **Flask**, **React**, **TypeScript**, **Vite**

---

## Tech Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| Frontend    | React + Vite + TypeScript     |
| Mapping     | Leaflet.js                    |
| Backend     | Flask + Flask-SocketIO        |
| Realtime    | Python-SocketIO (client + server)
| Data Store  | SQLite                        |
| Simulation  | Python mock drone emitter     |

---

## Setup Instructions

Clone the repository and run the full stack locally. The backend requires a
`COMMAND_TOKEN` environment variable to authenticate command events. You can
optionally specify a comma-separated list of origins using `ALLOWED_ORIGINS`
(defaults to `*`) to control CORS access:

```bash
# 1. Clone the repo
git clone https://github.com/your-username/secure-drone-control.git
cd secure-drone-control

# 2. Backend Setup (Python 3.9+)
cd backend
cp .env.example .env  # create local environment file
python -m venv venv

# On Windows
#.\venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

pip install --upgrade -r requirements.txt
# If you previously installed `gevent`, recreate the venv or run
# `pip uninstall gevent` to remove the leftover package.

# Generate self-signed certificates (development only)
mkdir -p certs
openssl req -newkey rsa:2048 -nodes -keyout certs/key.pem \
    -x509 -days 365 -out certs/cert.pem

The backend looks for these files as `cert.pem` and `key.pem` inside the
`certs` directory when running with TLS enabled.

To customize the certificate paths, set `TLS_CERT` and `TLS_KEY`. TLS is used
automatically when both files exist, or you can force it with `USE_TLS=true`:

```bash
export TLS_CERT=certs/cert.pem
export TLS_KEY=certs/key.pem
# Optional: force TLS even if the files do not exist
export USE_TLS=true
```

# Required: set a token to authorize command events
export COMMAND_TOKEN=mysecret

# Optional: restrict allowed CORS origins (comma separated)
export ALLOWED_ORIGINS=http://localhost:5173

# Optional: change the backend port (defaults to 5000)
export PORT=8000

# 3. Start the Flask server
python app.py

# The `telemetry.db` file used by the server is created
# automatically on first launch when telemetry is stored.

# 4. Run the Drone Simulator (in another terminal)
cd backend
.\venv\Scripts\activate
python simulator.py

# 5. Frontend Setup
cd frontend
npm install
export VITE_COMMAND_TOKEN=mysecret  # Must match COMMAND_TOKEN
export VITE_BACKEND_URL=http://localhost:5000  # Backend base URL (default)
npm run dev

# Frontend runs at:
http://localhost:5173


---

## Docker Compose Quickstart

1. Copy `backend/.env.example` to `.env` in the repository root and adjust any variables you need.
2. Build and start the whole stack:
   ```bash
   docker compose up --build
   ```
   The backend will be available at http://localhost:5000 (or whichever port you set in .env) and the frontend at http://localhost:5173.
3. Alternatively, if you have the Python and Node dependencies installed locally, you can run the stack directly:
   ```bash
   ./scripts/start.sh
   ```

