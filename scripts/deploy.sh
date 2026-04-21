#!/usr/bin/env bash
# Deploy local repo to VPS via rsync and rebuild containers.
# Usage:  scripts/deploy.sh
set -euo pipefail

VPS_HOST="${VPS_HOST:-root@129.121.60.82}"
VPS_PORT="${VPS_PORT:-22022}"
REMOTE_DIR="${REMOTE_DIR:-/srv/api-jos}"

echo "→ rsyncing to $VPS_HOST:$REMOTE_DIR (port $VPS_PORT)…"
rsync -az --delete \
  --exclude 'node_modules' \
  --exclude 'apps/*/node_modules' \
  --exclude 'apps/*/.next' \
  --exclude 'apps/*/dist' \
  --exclude '.env' \
  --exclude 'apps/admin/.env.local' \
  --exclude '.git' \
  -e "ssh -p $VPS_PORT" \
  ./ "$VPS_HOST:$REMOTE_DIR/"

echo "→ Rebuilding and restarting containers on VPS…"
ssh -p "$VPS_PORT" "$VPS_HOST" "cd $REMOTE_DIR && docker compose -f docker-compose.prod.yml --env-file .env up -d --build"

echo "→ Health check:"
ssh -p "$VPS_PORT" "$VPS_HOST" "cd $REMOTE_DIR && docker compose -f docker-compose.prod.yml ps"

echo "✓ Deploy OK. Logs:  ssh -p $VPS_PORT $VPS_HOST 'cd $REMOTE_DIR && docker compose -f docker-compose.prod.yml logs -f --tail=100'"
