from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from app.schemas.user import UserOutPublic


class DoctorBase(BaseModel):
    specialty: str
    sub_specialty: Optional[str] = None
    bio: Optional[str] = None
    kmpdc_number: Optional[str] = None
    years_experience: int = 0
    consultation_fee: float = 500.0
    location: Optional[str] = None
    city: Optional[str] = None
    languages: List[str] = ["English", "Swahili"]
    accepts_online: bool = True
    accepts_in_person: bool = True


class DoctorCreate(DoctorBase):
    pass


class DoctorUpdate(BaseModel):
    specialty: Optional[str] = None
    bio: Optional[str] = None
    consultation_fee: Optional[float] = None
    location: Optional[str] = None
    city: Optional[str] = None
    is_available: Optional[bool] = None
    languages: Optional[List[str]] = None
    accepts_online: Optional[bool] = None
    accepts_in_person: Optional[bool] = None


class DoctorOut(DoctorBase):
    id: UUID
    user_id: UUID
    rating: float
    rating_count: int
    is_verified: bool
    is_available: bool
    user: UserOutPublic
    created_at: datetime

    model_config = {"from_attributes": True}


class DoctorListOut(BaseModel):
    doctors: List[DoctorOut]
    total: int
    page: int
    size: int