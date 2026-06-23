from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from ..database import get_db
from ..models.user import User
from ..services.email_service import email_service
from ..core.dependencies import get_current_user

router = APIRouter(prefix="/demo", tags=["Demo"])

class DemoRequestSchema(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str
    organization: Optional[str] = None
    role: str = Field(..., pattern="^(patient|provider)$")
    preferred_date: Optional[str] = None
    preferred_time: Optional[str] = None
    message: Optional[str] = None
    appointment_type: str = Field("video", pattern="^(video|in_person)$")
    hear_about: Optional[str] = None

class ContactRequestSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=2000)

@router.post("/request", status_code=status.HTTP_201_CREATED)
async def request_demo(
    demo_data: DemoRequestSchema,
    db: Session = Depends(get_db)
):
    """Submit a demo request"""
    
    # Save to database (optional - create a DemoRequest model)
    # For now, just send email
    
    # Send notification email to admins
    await email_service.send_demo_request_email(demo_data)
    
    # Send confirmation email to user
    await email_service.send_demo_confirmation_email(demo_data.email, demo_data.first_name)
    
    return {
        "message": "Demo request submitted successfully",
        "status": "pending",
        "reference_id": f"DEMO_{int(datetime.now().timestamp())}"
    }

@router.post("/contact", status_code=status.HTTP_201_CREATED)
async def contact_us(
    contact_data: ContactRequestSchema,
    db: Session = Depends(get_db)
):
    """Submit a contact form message"""
    
    # Send email to admins
    await email_service.send_contact_email(contact_data)
    
    # Send auto-reply to user
    await email_service.send_contact_auto_reply(contact_data.email, contact_data.name)
    
    return {
        "message": "Message sent successfully",
        "status": "delivered"
    }