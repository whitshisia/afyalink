#!/bin/bash
echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Run migrations
echo "🔄 Running database migrations..."
alembic upgrade head

# Seed database (optional - remove for production)
echo "🌱 Seeding database..."
python -m app.seeds.seed_data

echo "✅ Build complete!"