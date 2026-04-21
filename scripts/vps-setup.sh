#!/usr/bin/env bash
# Run ONCE on a fresh Ubuntu VPS as root.
# Installs Docker, sets up swap, firewall, and /srv/api-jos.
set -euo pipefail

echo "→ Updating apt..."
apt-get update -y
apt-get upgrade -y

echo "→ Installing base packages..."
apt-get install -y ca-certificates curl gnupg ufw rsync

if ! command -v docker >/dev/null 2>&1; then
  echo "→ Installing Docker..."
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
    https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
else
  echo "→ Docker already installed: $(docker -v)"
fi

if ! swapon --show | grep -q '/swapfile'; then
  echo "→ Creating 2GB swap..."
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  sysctl vm.swappiness=10
  echo "vm.swappiness=10" >> /etc/sysctl.conf
else
  echo "→ Swap already present."
fi

echo "→ Configuring firewall (UFW)..."
ufw allow 22022/tcp  || true   # tu SSH en puerto no estándar
ufw allow 80/tcp     || true
ufw allow 443/tcp    || true
ufw --force enable

echo "→ Creating app dir /srv/api-jos..."
mkdir -p /srv/api-jos

echo "✓ VPS listo. Siguiente paso: subir el repo y levantar docker compose."
