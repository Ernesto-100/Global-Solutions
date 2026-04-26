#!/bin/bash
# TrueBooks production deployment script
set -e

ENVIRONMENT="${1:-production}"
echo "Deploying TrueBooks to $ENVIRONMENT..."

# Pull latest code
git pull origin main

# Build all containers
docker compose build --no-cache

# Run migrations
docker compose run --rm api alembic upgrade head

# Restart services (zero-downtime with rolling restart)
docker compose up -d --no-deps --force-recreate api
sleep 10
docker compose up -d --no-deps --force-recreate agents
sleep 5
docker compose up -d --no-deps --force-recreate web
docker compose up -d --no-deps --force-recreate app
docker compose up -d --no-deps --force-recreate admin

# Health check
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health)
if [ "$API_STATUS" != "200" ]; then
    echo "DEPLOY FAILED: API health check returned $API_STATUS"
    docker compose logs api --tail=50
    exit 1
fi

echo "Deployment successful!"
echo "API health: $API_STATUS"
docker compose ps
