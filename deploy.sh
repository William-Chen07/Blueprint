#!/usr/bin/env bash
set -e
cd /opt/Blueprint
git checkout main
git pull origin main
npm ci
npm run build
pm2 restart blueprint
echo "Deployed $(git rev-parse --short HEAD)"