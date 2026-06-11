from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class AppointmentStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"

class AppointmentType(str, Enum):
    IN_PERSON = "in_person"
    VIDEO = "video"
    PHONE = "phone"

class AppointmentBase(BaseModel):
    doctor_id: int
    scheduled_time: datetime
    duration_minutes: int = 30
    appointment_type: AppointmentType = AppointmentType.VIDEO
    reason: Optional[str] = None
    symptoms: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentResponse(AppointmentBase):
    id: int
    patient_id: int
    status: AppointmentStatus
    notes: Optional[str] = None
    prescription_notes: Optional[str] = None
    video_meeting_link: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class AppointmentUpdate(BaseModel):
    scheduled_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    appointment_type: Optional[AppointmentType] = None
    reason: Optional[str] = None
    symptoms: Optional[str] = None
    status: Optional[AppointmentStatus] = None
    notes: Optional[str] = None

class AppointmentCancel(BaseModel):
    reason: str
    cancelled_by: str