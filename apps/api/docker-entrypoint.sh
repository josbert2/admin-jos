#!/bin/sh
set -e

echo "→ Running migrations..."
node dist/db/migrate.js

echo "→ Seeding admin user (idempotent)..."
node dist/db/seed.js || echo "(seed skipped)"

echo "→ Starting API..."
exec node dist/main.js
