import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

# Use SQLite in-memory DB for tests
TEST_DB_URL = "sqlite:///./test.db"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

Base.metadata.create_all(bind=engine)
client = TestClient(app)

PATIENT = {
    "email": "jane@test.com",
    "full_name": "Jane Doe",
    "password": "SecurePass123",
    "role": "patient",
}
DOCTOR = {
    "email": "dr.kamau@test.com",
    "full_name": "Dr. Kamau",
    "password": "SecurePass123",
    "role": "doctor",
}


def test_register_patient():
    res = client.post("/api/v1/auth/register", json=PATIENT)
    assert res.status_code == 201
    data = res.json()
    assert data["email"] == PATIENT["email"]
    assert data["role"] == "patient"
    assert "password_hash" not in data


def test_register_duplicate_email():
    client.post("/api/v1/auth/register", json=PATIENT)
    res = client.post("/api/v1/auth/register", json=PATIENT)
    assert res.status_code == 409


def test_register_doctor():
    res = client.post("/api/v1/auth/register", json=DOCTOR)
    assert res.status_code == 201
    assert res.json()["role"] == "doctor"


def test_login_success():
    client.post("/api/v1/auth/register", json=PATIENT)
    res = client.post(
        "/api/v1/auth/login",
        json={"email": PATIENT["email"], "password": PATIENT["password"]},
    )
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["email"] == PATIENT["email"]


def test_login_wrong_password():
    res = client.post(
        "/api/v1/auth/login",
        json={"email": PATIENT["email"], "password": "wrongpass"},
    )
    assert res.status_code == 401


def test_get_me():
    client.post("/api/v1/auth/register", json=PATIENT)
    login = client.post(
        "/api/v1/auth/login",
        json={"email": PATIENT["email"], "password": PATIENT["password"]},
    )
    token = login.json()["access_token"]
    res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json()["email"] == PATIENT["email"]


def test_refresh_token():
    client.post("/api/v1/auth/register", json=PATIENT)
    login = client.post(
        "/api/v1/auth/login",
        json={"email": PATIENT["email"], "password": PATIENT["password"]},
    )
    refresh_token = login.json()["refresh_token"]
    res = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_logout():
    client.post("/api/v1/auth/register", json=PATIENT)
    login = client.post(
        "/api/v1/auth/login",
        json={"email": PATIENT["email"], "password": PATIENT["password"]},
    )
    refresh_token = login.json()["refresh_token"]
    res = client.post("/api/v1/auth/logout", json={"refresh_token": refresh_token})
    assert res.status_code == 200
    # Reusing revoked token should fail
    res2 = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert res2.status_code == 401


def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"