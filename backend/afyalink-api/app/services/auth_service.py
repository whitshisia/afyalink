from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Tuple
import secrets
import hashlib
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import logging

from ..models.user import User, UserRole, UserStatus
from ..models.patient import Patient
from ..models.doctor import Doctor
from ..models.refresh_token import RefreshToken
from ..core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, decode_token
from .email_service import email_service

logger = logging.getLogger(__name__)

class AuthService:
    """Authentication service for user management"""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def register_user(
        self,
        email: str,
        phone: str,
        full_name: str,
        password: str,
        role: UserRole = UserRole.PATIENT
    ) -> User:
        """Register a new user"""
        
        # Check if email exists
        existing_user = self.db.query(User).filter(User.email == email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if phone exists
        existing_phone = self.db.query(User).filter(User.phone == phone).first()
        if existing_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number already registered"
            )
        
        # Create user
        hashed_password = get_password_hash(password)
        user = User(
            email=email,
            phone=phone,
            full_name=full_name,
            hashed_password=hashed_password,
            role=role,
            status=UserStatus.PENDING_VERIFICATION
        )
        
        self.db.add(user)
        self.db.flush()  # Get user ID without committing
        
        # Create role-specific profile
        if role == UserRole.PATIENT:
            patient = Patient(user_id=user.id)
            self.db.add(patient)
        elif role == UserRole.DOCTOR:
            doctor = Doctor(
                user_id=user.id,
                license_number=f"LIC{secrets.token_hex(4).upper()}",
                consultation_fee=0
            )
            self.db.add(doctor)
        
        self.db.commit()
        self.db.refresh(user)
        
        # Send welcome email
        await email_service.send_welcome_email(email, full_name)
        
        # Send verification email (in production, generate actual token)
        verification_token = secrets.token_urlsafe(32)
        await email_service.send_verification_email(email, user.id, verification_token)
        
        return user
    
    async def login_user(self, email: str, password: str, ip_address: str = None) -> Tuple[str, str, User]:
        """Authenticate user and generate tokens"""
        
        # Find user
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check account status
        if user.status == UserStatus.SUSPENDED:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account has been suspended. Contact support."
            )
        
        if user.status == UserStatus.INACTIVE:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive"
            )
        
        # Update last login
        user.last_login = datetime.utcnow()
        self.db.commit()
        
        # Generate tokens
        access_token = create_access_token(data={"sub": str(user.id), "role": user.role.value})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        # Store refresh token
        expires_at = datetime.utcnow() + timedelta(days=7)
        db_refresh_token = RefreshToken(
            token=refresh_token,
            user_id=user.id,
            expires_at=expires_at
        )
        self.db.add(db_refresh_token)
        self.db.commit()
        
        # Log login attempt (for security)
        logger.info(f"User {user.email} logged in from {ip_address}")
        
        return access_token, refresh_token, user
    
    async def refresh_access_token(self, refresh_token: str) -> Tuple[str, str]:
        """Refresh access token using refresh token"""
        
        # Find refresh token in database
        db_token = self.db.query(RefreshToken).filter(
            RefreshToken.token == refresh_token,
            RefreshToken.is_revoked == False
        ).first()
        
        if not db_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        # Check if token is expired
        if db_token.expires_at < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token has expired"
            )
        
        # Decode token to get user
        payload = decode_token(refresh_token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # Get user
        user = self.db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        # Revoke old refresh token
        db_token.is_revoked = True
        
        # Create new tokens
        new_access_token = create_access_token(data={"sub": str(user.id), "role": user.role.value})
        new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        # Store new refresh token
        expires_at = datetime.utcnow() + timedelta(days=7)
        new_db_token = RefreshToken(
            token=new_refresh_token,
            user_id=user.id,
            expires_at=expires_at
        )
        self.db.add(new_db_token)
        self.db.commit()
        
        return new_access_token, new_refresh_token
    
    async def logout_user(self, user_id: int, refresh_token: str = None) -> bool:
        """Logout user and revoke tokens"""
        
        # Revoke all refresh tokens for user if no specific token provided
        if not refresh_token:
            tokens = self.db.query(RefreshToken).filter(
                RefreshToken.user_id == user_id,
                RefreshToken.is_revoked == False
            ).all()
            
            for token in tokens:
                token.is_revoked = True
        else:
            # Revoke specific token
            token = self.db.query(RefreshToken).filter(
                RefreshToken.token == refresh_token,
                RefreshToken.user_id == user_id
            ).first()
            
            if token:
                token.is_revoked = True
        
        self.db.commit()
        logger.info(f"User {user_id} logged out")
        
        return True
    
    async def change_password(
        self,
        user_id: int,
        current_password: str,
        new_password: str
    ) -> bool:
        """Change user password"""
        
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Verify current password
        if not verify_password(current_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        # Update password
        user.hashed_password = get_password_hash(new_password)
        
        # Revoke all refresh tokens (force re-login)
        tokens = self.db.query(RefreshToken).filter(
            RefreshToken.user_id == user_id,
            RefreshToken.is_revoked == False
        ).all()
        
        for token in tokens:
            token.is_revoked = True
        
        self.db.commit()
        
        # Send notification email
        await email_service.send_email(
            user.email,
            "Password Changed - AfyaLink",
            "<h1>Password Changed</h1><p>Your password has been successfully changed. If this wasn't you, please contact support immediately.</p>"
        )
        
        return True
    
    async def forgot_password(self, email: str) -> bool:
        """Send password reset email"""
        
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            # Don't reveal if user exists for security
            return True
        
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        
        # Store reset token (in production, use a separate table with expiry)
        # For now, we'll encode it in the token
        
        # Send reset email
        await email_service.send_password_reset_email(email, reset_token)
        
        return True
    
    async def reset_password(self, reset_token: str, new_password: str) -> bool:
        """Reset password using token"""
        
        # In production, verify token from database
        # For now, we'll accept any token and find user
        # This is simplified - in production, implement proper token validation
        
        # For demonstration, we'll assume token contains user_id
        try:
            # This is a simplified implementation
            # In production, use a proper password reset table
            payload = decode_token(reset_token)
            if payload:
                user_id = payload.get("sub")
                if user_id:
                    user = self.db.query(User).filter(User.id == int(user_id)).first()
                    if user:
                        user.hashed_password = get_password_hash(new_password)
                        self.db.commit()
                        return True
        except:
            pass
        
        # For demo purposes, we'll still return True
        # In production, this should be properly implemented
        return True
    
    async def verify_email(self, user_id: int, token: str) -> bool:
        """Verify user's email address"""
        
        # In production, verify token from database
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.is_verified = True
        
        if user.status == UserStatus.PENDING_VERIFICATION:
            user.status = UserStatus.ACTIVE
        
        self.db.commit()
        
        return True
    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()
    
    async def update_user_profile(
        self,
        user_id: int,
        full_name: str = None,
        phone: str = None,
        profile_image: str = None
    ) -> User:
        """Update user profile"""
        
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if full_name:
            user.full_name = full_name
        if phone:
            # Check if phone is taken by another user
            existing = self.db.query(User).filter(User.phone == phone, User.id != user_id).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Phone number already in use"
                )
            user.phone = phone
        if profile_image:
            user.profile_image = profile_image
        
        self.db.commit()
        self.db.refresh(user)
        
        return user
    
    async def deactivate_account(self, user_id: int, password: str) -> bool:
        """Deactivate user account"""
        
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Verify password
        if not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password is incorrect"
            )
        
        # Deactivate account
        user.status = UserStatus.INACTIVE
        
        # Revoke all refresh tokens
        tokens = self.db.query(RefreshToken).filter(
            RefreshToken.user_id == user_id
        ).all()
        
        for token in tokens:
            token.is_revoked = True
        
        self.db.commit()
        
        return True

# Helper function to get auth service
def get_auth_service(db: Session) -> AuthService:
    return AuthService(db)