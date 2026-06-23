#!/bin/bash
set -e

echo "🚀 Starting build process..."
echo "Current directory: $(pwd)"
echo "Files: $(ls -la)"

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create alembic versions directory if it doesn't exist
mkdir -p alembic/versions

# Create empty migration if none exists
if [ ! -f "alembic/versions/$(ls alembic/versions/ | head -1 2>/dev/null)" ]; then
    echo "📝 No migrations found, skipping..."
else
    echo "🔄 Running database migrations..."
    alembic upgrade head
fi

echo "✅ Build complete!"
