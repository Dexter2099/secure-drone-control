# Drone Command & Control System

A real-time drone telemetry and command interface, modeled after military-grade operations for UAV control. Built using modern web technologies and secure communication protocols, this project is designed to simulate tactical drone oversight — ideal for aerospace, defense, or simulation software roles (e.g. Lockheed Martin Australia).

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

##  Setup Instructions

### 🔁 
1. Clone the Repository

```bash
git clone https://github.com/your-username/secure-drone-control.git
cd secure-drone-control

2. Backend Setup (Python 3.9+)

cd backend
python -m venv venv
.\venv\Scripts\activate       # On Windows
# source venv/bin/activate   # On macOS/Linux

pip install -r requirements.txt

3. Run the Flask Server
python app.py

4. Launch the Drone Simulator
cd backend
.\venv\Scripts\activate
python simulator.py

5. Frontend Setup (React + Vite)
cd frontend
npm install
npm run dev
App opens at: http://localhost:5173

Open the browser console to verify:
Telemetry received: { lat: ..., lon: ..., ... }

How It Works
Simulator sends GPS + metrics via Socket.IO to Flask server.

Flask rebroadcasts the data to any connected frontend clients.

React renders:

A map with the drone's live position

Live stats (altitude, speed, battery)

Command buttons

Backend logs all telemetry to a local SQLite database.

Use Cases
Defense command center simulation

Aerospace software project showcase

Portfolio piece for real-time systems

University UAV research tool

Tactical web system architecture demo

Future Improvements
📍 Flight path trail (drone breadcrumbs)

📈 Chart.js: altitude/speed graphs

🗂️ Command log display panel

🔐 Login roles (operator vs analyst)

📷 Live video simulation overlay

