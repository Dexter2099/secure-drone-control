#!/usr/bin/env bash
set -e

# Move to repo root if executed from elsewhere
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Load environment variables from .env if it exists
if [ -f .env ]; then
  echo "Loading environment variables from .env"
  set -a
  # shellcheck disable=SC1091
  . .env
  set +a
fi

# Start backend server
echo "Starting backend..."
cd backend
python app.py &
BACKEND_PID=$!

# Start simulator
echo "Starting simulator..."
python simulator.py &
SIM_PID=$!
cd ..

# Ensure background processes are cleaned up on exit
trap 'kill $BACKEND_PID $SIM_PID' EXIT

# Start frontend dev server
cd frontend
npm run dev

