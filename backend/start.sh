cat > backend/start.sh << 'EOF'
#!/bin/bash
set -e

echo "Waiting for PostgreSQL to be ready..."
while ! pg_isready -h postgres -p 5432 -U afyalink_user; do
    sleep 1
done

echo "Waiting for Redis to be ready..."
while ! redis-cli -h redis ping; do
    sleep 1
done

echo "Running database migrations..."
cd /app
alembic upgrade head || echo "No migrations found, skipping..."

echo "Initializing database tables..."
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"

echo "Seeding database..."
python -m app.seeds.seed_data

echo "Starting FastAPI application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
EOF

# Make it executable
chmod +x backend/start.sh