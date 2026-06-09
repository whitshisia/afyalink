from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.user import UserCreate, UserOut
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    RefreshRequest,
    AccessTokenResponse,
    MessageResponse,
)
from app.services.auth_service import AuthService
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user (patient or doctor)",
)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    svc = AuthService(db)
    return svc.register(payload)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login and receive access + refresh tokens",
)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    svc = AuthService(db)
    return svc.login(payload)


@router.post(
    "/refresh",
    response_model=AccessTokenResponse,
    summary="Get a new access token using refresh token",
)
def refresh_token(payload: RefreshRequest, db: Session = Depends(get_db)):
    svc = AuthService(db)
    return svc.refresh(payload.refresh_token)


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Logout (revoke refresh token)",
)
def logout(payload: RefreshRequest, db: Session = Depends(get_db)):
    svc = AuthService(db)
    svc.logout(payload.refresh_token)
    return {"message": "Successfully logged out"}


@router.post(
    "/logout-all",
    response_model=MessageResponse,
    summary="Logout from all devices",
)
def logout_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    svc = AuthService(db)
    svc.logout_all(str(current_user.id))
    return {"message": "Logged out from all devices"}


@router.get(
    "/me",
    response_model=UserOut,
    summary="Get currently authenticated user",
)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user