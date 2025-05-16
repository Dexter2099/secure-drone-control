# Drone Command & Control System

A real-time drone telemetry and command interface, modeled after military-grade operations for UAV control. Built using modern web technologies and secure communication protocols, this project is designed to simulate tactical drone oversight — ideal for aerospace, defense, or simulation software roles.

---

## ✨ Features

- 📡 Real-time drone telemetry stream (lat, lon, altitude, speed, battery)
- 🗺️ Live drone marker with auto-recentering on **Leaflet.js** map
- 🎮 Send tactical commands to the drone: `Return to Base`, `Hold Position`
- 🔐 Socket.IO over secure or plain WebSocket channel
- 📦 Persistent telemetry logging to **SQLite**
- 🧠 Simple Python drone simulator included
- 💻 Built with **Flask**, **React**, **TypeScript**, **Vite**

---

## 🧰 Tech Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| Frontend    | React + Vite + TypeScript     |
| Mapping     | Leaflet.js                    |
| Backend     | Flask + Flask-SocketIO        |
| Realtime    | Python-SocketIO (client + server)
| Data Store  | SQLite                        |
| Simulation  | Python mock drone emitter     |

---

## 🛠️ Setup Instructions

Clone the repository and run the full stack locally:

```bash
# 1. Clone the repo
git clone https://github.com/your-username/secure-drone-control.git
cd secure-drone-control

# 2. Backend Setup (Python 3.9+)
cd backend
python -m venv venv
.\venv\Scripts\activate       # On Windows
# source venv/bin/activate   # On macOS/Linux

pip install -r requirements.txt

# 3. Start the Flask server
python app.py

# 4. Run the Drone Simulator (in another terminal)
cd backend
.\venv\Scripts\activate
python simulator.py

# 5. Frontend Setup
cd frontend
npm install
npm run dev

# Frontend runs at:
http://localhost:5173

