#!/usr/bin/env bash
set -euo pipefail

BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${PORT:-3000}"

start_backend() {
  if lsof -Pi ":${BACKEND_PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Backend already running on port ${BACKEND_PORT}"
    return 0
  fi

  echo "Starting backend on port ${BACKEND_PORT}"
  python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port "${BACKEND_PORT}" &
  BACKEND_PID=$!
  echo "Backend PID: ${BACKEND_PID}"
}

start_frontend() {
  if lsof -Pi ":${FRONTEND_PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Frontend already running on port ${FRONTEND_PORT}"
    return 0
  fi

  echo "Starting frontend on port ${FRONTEND_PORT}"
  PORT="${FRONTEND_PORT}" npm run dev -- --host 0.0.0.0 --port "${FRONTEND_PORT}" &
  FRONTEND_PID=$!
  echo "Frontend PID: ${FRONTEND_PID}"
}

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]]; then
    kill "${BACKEND_PID}" >/dev/null 2>&1 || true
  fi

  if [[ -n "${FRONTEND_PID:-}" ]]; then
    kill "${FRONTEND_PID}" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT INT TERM

start_backend
start_frontend

wait
