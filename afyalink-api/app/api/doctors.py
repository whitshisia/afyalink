from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.doctor import Doctor, DoctorStatus, Specialization
from ..models.user import User
from ..models.review import Review
from ..schemas.doctor import DoctorResponse, DoctorUpdate, SpecializationResponse
from ..schemas.review import ReviewResponse
from ..core.dependencies import get_current_user, role_required

router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.get("/", response_model=List[DoctorResponse])
async def get_doctors(
    specialization: Optional[str] = None,
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    max_fee: Optional[float] = None,
    status: Optional[DoctorStatus] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get list of doctors with filters"""
    query = db.query(Doctor)
    
    if specialization:
        query = query.join(Doctor.specializations).filter(Specialization.name == specialization)
    if min_rating:
        query = query.filter(Doctor.rating >= min_rating)
    if max_fee:
        query = query.filter(Doctor.consultation_fee <= max_fee)
    if status:
        query = query.filter(Doctor.status == status)
    if search:
        query = query.join(User).filter(User.full_name.ilike(f"%{search}%"))
    
    doctors = query.offset(skip).limit(limit).all()
    return doctors

@router.get("/specializations", response_model=List[SpecializationResponse])
async def get_specializations(db: Session = Depends(get_db)):
    """Get all specializations"""
    specializations = db.query(Specialization).all()
    return specializations

@router.get("/{doctor_id}", response_model=DoctorResponse)
async def get_doctor(
    doctor_id: int,
    db: Session = Depends(get_db)
):
    """Get doctor by ID"""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

@router.put("/me", response_model=DoctorResponse)
async def update_doctor_profile(
    doctor_update: DoctorUpdate,
    current_user: User = Depends(role_required("doctor")),
    db: Session = Depends(get_db)
):
    """Update doctor profile"""
    doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
    
    update_data = doctor_update.model_dump(exclude_unset=True)
    
    # Handle specializations update
    if "specialization_ids" in update_data:
        specializations = db.query(Specialization).filter(
            Specialization.id.in_(update_data["specialization_ids"])
        ).all()
        doctor.specializations = specializations
        del update_data["specialization_ids"]
    
    # Update other fields
    for field, value in update_data.items():
        setattr(doctor, field, value)
    
    db.commit()
    db.refresh(doctor)
    return doctor

@router.get("/{doctor_id}/reviews", response_model=List[ReviewResponse])
async def get_doctor_reviews(
    doctor_id: int,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get reviews for a doctor"""
    reviews = db.query(Review).filter(
        Review.doctor_id == doctor_id
    ).offset(skip).limit(limit).all()
    return reviews