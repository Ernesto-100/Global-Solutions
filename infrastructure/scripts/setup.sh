#!/bin/bash
# TrueBooks initial setup script
set -e

echo "========================================"
echo "TrueBooks — Initial Setup"
echo "========================================"

# Check dependencies
command -v docker &>/dev/null || { echo "Docker is required. Install: https://docs.docker.com/get-docker/"; exit 1; }
command -v docker compose &>/dev/null || { echo "Docker Compose is required."; exit 1; }
command -v node &>/dev/null || { echo "Node.js 20+ is required."; exit 1; }

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "Node.js 20+ required. Current: $(node --version)"
    exit 1
fi

echo ""
echo "1. Copying environment variables..."
cp .env.example .env
echo "   Created .env file. EDIT IT NOW with your actual keys:"
echo "   - ANTHROPIC_API_KEY (required)"
echo "   - STRIPE_SECRET_KEY (required for payments)"
echo "   - NEXTAUTH_SECRET (generate: openssl rand -base64 32)"
echo ""

echo "2. Installing Node dependencies..."
npm install

echo ""
echo "3. Starting infrastructure (PostgreSQL, Redis)..."
docker compose up -d postgres redis
sleep 5

echo ""
echo "4. Running database migrations..."
docker compose run --rm api alembic upgrade head

echo ""
echo "5. Seeding initial data..."
docker compose run --rm api python scripts/seed.py 2>/dev/null || echo "   (seed script not found, skipping)"

echo ""
echo "========================================"
echo "Setup complete!"
echo ""
echo "Start development:"
echo "  npm run dev              # All apps"
echo ""
echo "Or start with Docker:"
echo "  docker compose up"
echo ""
echo "URLs:"
echo "  Marketing: http://localhost:3000"
echo "  App:       http://localhost:3001"
echo "  Admin:     http://localhost:3002"
echo "  API:       http://localhost:8000/docs"
echo "  Agents:    http://localhost:8001/docs"
echo "========================================"
