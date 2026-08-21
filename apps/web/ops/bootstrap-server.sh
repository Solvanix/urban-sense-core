#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f .env.runtime ]]; then
  echo "Missing .env.runtime. Copy .env.runtime.example and set unique values first." >&2
  exit 1
fi

echo "Building Urban-Sense and preparing a fresh MySQL schema..."
docker compose --env-file .env.runtime --profile bootstrap run --rm schema

echo "Starting Urban-Sense..."
docker compose --env-file .env.runtime up --build -d app

echo "Waiting for the application health check..."
for _ in $(seq 1 30); do
  if docker compose --env-file .env.runtime ps --format json app | grep -q 'healthy'; then
    echo "Urban-Sense is healthy on port configured by APP_PORT."
    exit 0
  fi
  sleep 2
done

echo "Application did not become healthy. Inspect: docker compose --env-file .env.runtime logs app" >&2
exit 1
