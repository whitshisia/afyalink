from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User, UserRole
from app.models.refresh_token import RefreshToken
from app.schemas.user import UserCreate
from app.schemas.auth import LoginRequest, TokenResponse, AccessTokenResponse
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(self, data: UserCreate) -> User:
        # Check email uniqueness
        if self.db.query(User).filter(User.email == data.email).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists",
            )
        # Check phone uniqueness if provided
        if data.phone and self.db.query(User).filter(User.phone == data.phone).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this phone number already exists",
            )

        user = User(
            email=data.email,
            full_name=data.full_name,
            phone=data.phone,
            password_hash=hash_password(data.password),
            role=data.role,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def login(self, data: LoginRequest) -> TokenResponse:
        user = self.db.query(User).filter(User.email == data.email).first()

        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated. Contact support.",
            )

        # Update last login
        user.last_login = datetime.now(timezone.utc)
        self.db.commit()

        access_token = create_access_token(str(user.id), user.role)
        refresh_token_str, expires_at = create_refresh_token(str(user.id))

        # Persist refresh token
        rt = RefreshToken(
            user_id=user.id,
            token=refresh_token_str,
            expires_at=expires_at,
        )
        self.db.add(rt)
        self.db.commit()

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token_str,
            user=user,
        )

    def refresh(self, refresh_token_str: str) -> AccessTokenResponse:
        payload = decode_token(refresh_token_str)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
            )

        rt = (
            self.db.query(RefreshToken)
            .filter(RefreshToken.token == refresh_token_str)
            .first()
        )
        if not rt or not rt.is_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token has been revoked or expired",
            )

        user = self.db.query(User).filter(User.id == rt.user_id).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or deactivated",
            )

        new_access_token = create_access_token(str(user.id), user.role)
        return AccessTokenResponse(access_token=new_access_token)

    def logout(self, refresh_token_str: str) -> None:
        rt = (
            self.db.query(RefreshToken)
            .filter(RefreshToken.token == refresh_token_str)
            .first()
        )
        if rt:
            rt.is_revoked = True
            self.db.commit()

    def logout_all(self, user_id: str) -> None:
        """Revoke all refresh tokens for a user (logout all devices)."""
        self.db.query(RefreshToken).filter(
            RefreshToken.user_id == user_id,
            RefreshToken.is_revoked == False,
        ).update({"is_revoked": True})
        self.db.commit()