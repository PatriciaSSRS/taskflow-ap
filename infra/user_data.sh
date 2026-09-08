#!/bin/bash
set -euo pipefail

# Install Docker Engine on Ubuntu 22.04.
apt-get update -y
apt-get install -y ca-certificates curl gnupg

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io

systemctl enable --now docker

# Run the API container, publishing it on port 80.
docker run -d \
  --name taskflow-api \
  --restart unless-stopped \
  -p 80:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DATABASE_URL="postgres://${db_username}:${db_password}@${db_host}:${db_port}/${db_name}" \
  -e JWT_SECRET="$(head -c 32 /dev/urandom | base64)" \
  ${app_image}
