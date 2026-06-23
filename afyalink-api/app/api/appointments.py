from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from ..database import get_db
from ..models.appointment import Appointment, AppointmentStatus
from ..models.patient import Patient
from ..models.doctor import Doctor
from ..models.user import User
from ..schemas.appointment import *
from ..core.dependencies import get_current_user, role_required
from ..services.email_service import send_appointment_notification

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.post("/", response_model=AppointmentResponse, status_code=201)
async def create_appointment(
    appointment_data: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new appointment"""
    # Check if user is a patient
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(
            status_code=403,
            detail="Only patients can create appointments"
        )
    
    # Check if doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == appointment_data.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Check if doctor is available at that time
    existing_appointment = db.query(Appointment).filter(
        Appointment.doctor_id == appointment_data.doctor_id,
        Appointment.scheduled_time == appointment_data.scheduled_time,
        Appointment.status.in_([AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING])
    ).first()
    
    if existing_appointment:
        raise HTTPException(
            status_code=409,
            detail="Doctor is not available at this time"
        )
    
    # Create appointment
    db_appointment = Appointment(
        patient_id=patient.id,
        **appointment_data.model_dump()
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    
    # Generate video meeting link if video appointment
    if db_appointment.appointment_type == "video":
        db_appointment.video_meeting_link = f"https://meet.afyalink.com/{db_appointment.id}"
        db.commit()
    
    # Send notification
    await send_appointment_notification(current_user.email, db_appointment)
    
    return db_appointment

@router.get("/", response_model=List[AppointmentResponse])
async def get_appointments(
    status: Optional[AppointmentStatus] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's appointments"""
    if current_user.role == "patient":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient profile not found")
        query = db.query(Appointment).filter(Appointment.patient_id == patient.id)
    elif current_user.role == "doctor":
        doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor profile not found")
        query = db.query(Appointment).filter(Appointment.doctor_id == doctor.id)
    else:  # admin
        query = db.query(Appointment)
    
    if status:
        query = query.filter(Appointment.status == status)
    if start_date:
        query = query.filter(Appointment.scheduled_time >= start_date)
    if end_date:
        query = query.filter(Appointment.scheduled_time <= end_date)
    
    appointments = query.order_by(Appointment.scheduled_time).offset(skip).limit(limit).all()
    return appointments

@router.get("/upcoming", response_model=List[AppointmentResponse])
async def get_upcoming_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 10
):
    """Get upcoming appointments"""
    if current_user.role == "patient":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient profile not found")
        appointments = db.query(Appointment).filter(
            Appointment.patient_id == patient.id,
            Appointment.scheduled_time > datetime.utcnow(),
            Appointment.status.in_([AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING])
        ).order_by(Appointment.scheduled_time).limit(limit).all()
    elif current_user.role == "doctor":
        doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor profile not found")
        appointments = db.query(Appointment).filter(
            Appointment.doctor_id == doctor.id,
            Appointment.scheduled_time > datetime.utcnow(),
            Appointment.status.in_([AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING])
        ).order_by(Appointment.scheduled_time).limit(limit).all()
    else:
        appointments = []
    
    return appointments

@router.get("/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment(
    appointment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get appointment by ID"""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Check authorization
    patient = db.query(Patient).filter(Patient.id == appointment.patient_id).first()
    doctor = db.query(Doctor).filter(Doctor.id == appointment.doctor_id).first()
    
    if current_user.role not in ["admin"]:
        if current_user.role == "patient" and patient.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        if current_user.role == "doctor" and doctor.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
    
    return appointment

@router.put("/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment(
    appointment_id: int,
    appointment_update: AppointmentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update appointment"""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Check authorization
    patient = db.query(Patient).filter(Patient.id == appointment.patient_id).first()
    doctor = db.query(Doctor).filter(Doctor.id == appointment.doctor_id).first()
    
    if current_user.role == "patient" and patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    if current_user.role == "doctor" and doctor.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    if current_user.role not in ["admin", "patient", "doctor"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = appointment_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(appointment, field, value)
    
    db.commit()
    db.refresh(appointment)
    return appointment

@router.post("/{appointment_id}/cancel")
async def cancel_appointment(
    appointment_id: int,
    cancel_data: AppointmentCancel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel appointment"""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Check authorization
    patient = db.query(Patient).filter(Patient.id == appointment.patient_id).first()
    doctor = db.query(Doctor).filter(Doctor.id == appointment.doctor_id).first()
    
    if cancel_data.cancelled_by == "patient" and patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    if cancel_data.cancelled_by == "doctor" and doctor.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    appointment.status = AppointmentStatus.CANCELLED
    appointment.cancellation_reason = cancel_data.reason
    appointment.cancelled_by = cancel_data.cancelled_by
    db.commit()
    
    return {"message": "Appointment cancelled successfully"}