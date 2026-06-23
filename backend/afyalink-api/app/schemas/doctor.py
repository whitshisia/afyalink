from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum

class DoctorStatus(str, Enum):
    AVAILABLE = "available"
    BUSY = "busy"
    ON_LEAVE = "on_leave"
    OFFLINE = "offline"

class SpecializationBase(BaseModel):
    name: str
    description: Optional[str] = None

class SpecializationResponse(SpecializationBase):
    id: int
    
    class Config:
        from_attributes = True

class DoctorBase(BaseModel):
    license_number: str
    years_of_experience: int = 0
    consultation_fee: float
    hospital_affiliation: Optional[str] = None
    clinic_address: Optional[str] = None
    bio: Optional[str] = None
    education: Optional[str] = None
    languages: Optional[str] = None

class DoctorCreate(DoctorBase):
    specialization_ids: List[int] = []

class DoctorResponse(DoctorBase):
    id: int
    user_id: int
    rating: float
    total_reviews: int
    status: DoctorStatus
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    specializations: List[SpecializationResponse] = []
    
    class Config:
        from_attributes = True

class DoctorUpdate(BaseModel):
    years_of_experience: Optional[int] = None
    consultation_fee: Optional[float] = None
    hospital_affiliation: Optional[str] = None
    clinic_address: Optional[str] = None
    bio: Optional[str] = None
    education: Optional[str] = None
    languages: Optional[str] = None
    status: Optional[DoctorStatus] = None
    specialization_ids: Optional[List[int]] = None