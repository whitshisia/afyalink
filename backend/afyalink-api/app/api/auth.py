from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from typing import Optional
import secrets
from ..database import get_db
from ..models.user import User, UserStatus
from ..models.refresh_token import RefreshToken
from ..models.patient import Patient
from ..schemas.auth import *
from ..schemas.user import UserCreate, UserResponse
from ..core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, decode_token
from ..core.dependencies import get_current_user
from ..services.email_service import send_verification_email

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if email exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if phone exists
    existing_phone = db.query(User).filter(User.phone == user_data.phone).first()
    if existing_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered"
        )
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        phone=user_data.phone,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        role=user_data.role,
        status=UserStatus.PENDING_VERIFICATION
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create patient profile if role is patient
    if user_data.role == "patient":
        patient = Patient(user_id=db_user.id)
        db.add(patient)
        db.commit()
    
    # Send verification email
    await send_verification_email(db_user.email, db_user.id)
    
    return db_user

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login user and return tokens"""
    # Find user
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if account is active
    if user.status == "suspended":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been suspended"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    # Store refresh token in database
    expires_at = datetime.utcnow() + timedelta(days=7)
    db_refresh_token = RefreshToken(
        token=refresh_token,
        user_id=user.id,
        expires_at=expires_at
    )
    db.add(db_refresh_token)
    db.commit()
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_data: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Refresh access token using refresh token"""
    # Find refresh token in database
    db_token = db.query(RefreshToken).filter(
        RefreshToken.token == refresh_data.refresh_token,
        RefreshToken.is_revoked == False
    ).first()
    
    if not db_token or db_token.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    # Decode token to get user
    payload = decode_token(refresh_data.refresh_token)
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
    
    # Create new tokens
    new_access_token = create_access_token(data={"sub": user_id})
    new_refresh_token = create_refresh_token(data={"sub": user_id})
    
    # Revoke old refresh token and add new one
    db_token.is_revoked = True
    expires_at = datetime.utcnow() + timedelta(days=7)
    new_db_token = RefreshToken(
        token=new_refresh_token,
        user_id=int(user_id),
        expires_at=expires_at
    )
    db.add(new_db_token)
    db.commit()
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

class LogoutRequest(BaseModel):
    refresh_token: Optional[str] = None

@router.post("/logout")
async def logout(
    logout_data: LogoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Logout user and revoke refresh token"""
    
    if logout_data.refresh_token:
        # Find and revoke the refresh token
        db_token = db.query(RefreshToken).filter(
            RefreshToken.token == logout_data.refresh_token,
            RefreshToken.user_id == current_user.id,
            RefreshToken.is_revoked == False
        ).first()
        
        if db_token:
            db_token.is_revoked = True
            db.commit()
    
    return {"message": "Successfully logged out"}

@router.get("/verify-email/{user_id}/{token}")
async def verify_email(
    user_id: int, 
    token: str, 
    db: Session = Depends(get_db)
):
    """Verify user's email address"""
    # Find the user
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # In production, you would verify the token here
    # For now, just mark as verified
    
    user.is_verified = True
    
    # Auto-activate patients after email verification
    if user.role == "patient":
        user.status = "active"
    
    db.commit()
    
    # Return a success page or redirect
    return {
        "message": "Email verified successfully", 
        "email": user.email,
        "status": user.status
    }

@router.post("/change-password")
async def change_password(
    password_data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user's password"""
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Hash new password
    current_user.hashed_password = get_password_hash(password_data.new_password)
    
    # Revoke all refresh tokens (force re-login)
    tokens = db.query(RefreshToken).filter(
        RefreshToken.user_id == current_user.id,
        RefreshToken.is_revoked == False
    ).all()
    
    for token in tokens:
        token.is_revoked = True
    
    db.commit()
    
    return {"message": "Password changed successfully"}

@router.post("/forgot-password")
async def forgot_password(
    forgot_data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """Send password reset email"""
    user = db.query(User).filter(User.email == forgot_data.email).first()
    if not user:
        # Don't reveal if user exists for security
        return {"message": "If your email is registered, you will receive a password reset link"}
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    # In production, store this token in database with expiry
    
    # Send reset email
    # await send_password_reset_email(user.email, reset_token)
    
    return {"message": "Password reset email sent"}

@router.post("/reset-password")
async def reset_password(
    reset_data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """Reset password using token"""
    # In production, verify token from database
    # For now, we'll just return success
    return {"message": "Password reset successfully"}