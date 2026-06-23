from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
from datetime import datetime, timedelta
from ..database import get_db
from ..models.user import User, UserRole
from ..models.doctor import Doctor
from ..models.patient import Patient
from ..models.appointment import Appointment
from ..models.payment import Payment
from ..models.review import Review
from ..core.dependencies import role_required
from ..core.admin_config import verify_admin_password, ADMIN_PRESET_PASSWORD
from ..core.security import get_password_hash, create_access_token, create_refresh_token

router = APIRouter(prefix="/admin", tags=["Admin"])

# ============ Admin Login ============

@router.post("/login")
async def admin_login(password: str, db: Session = Depends(get_db)):
    """Login as admin using preset password"""
    if not verify_admin_password(password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin password"
        )
    
    # Use lowercase string directly to avoid enum issues
    admin_user = db.query(User).filter(User.role == "admin").first()
    
    if not admin_user:
        admin_user = User(
            email=f"admin_{int(datetime.now().timestamp())}@afyalink.com",
            phone="+254700000001",
            full_name="System Administrator",
            hashed_password=get_password_hash(ADMIN_PRESET_PASSWORD),
            role="admin",  # Use string, not enum
            status="active",
            is_verified=True
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
    
    access_token = create_access_token(data={"sub": str(admin_user.id), "role": "admin"})
    refresh_token = create_refresh_token(data={"sub": str(admin_user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": admin_user.id,
            "email": admin_user.email,
            "full_name": admin_user.full_name,
            "role": admin_user.role
        }
    }

# ============ Dashboard Statistics ============

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    current_user: User = Depends(role_required("admin")),
    db: Session = Depends(get_db)
):
    """Get admin dashboard statistics"""
    
    # Use string literals for role checks (lowercase to match database)
    total_users = db.query(User).count()
    total_patients = db.query(User).filter(User.role == "patient").count()
    total_doctors = db.query(User).filter(User.role == "doctor").count()
    
    pending_doctors = db.query(User).filter(
        User.role == "doctor",
        User.status == "pending_admin_approval"
    ).count()
    
    active_users = db.query(User).filter(User.status == "active").count()
    
    start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    new_users_this_month = db.query(User).filter(User.created_at >= start_of_month).count()
    
    total_appointments = db.query(Appointment).count()
    completed_appointments = db.query(Appointment).filter(Appointment.status == "completed").count()
    cancelled_appointments = db.query(Appointment).filter(Appointment.status == "cancelled").count()
    pending_appointments = db.query(Appointment).filter(Appointment.status == "pending").count()
    
    next_week = datetime.now() + timedelta(days=7)
    upcoming_appointments = db.query(Appointment).filter(
        Appointment.scheduled_time.between(datetime.now(), next_week),
        Appointment.status == "confirmed"
    ).count()
    
    total_revenue_result = db.query(func.sum(Payment.amount)).filter(
        Payment.payment_status == "completed"
    ).first()
    total_revenue = total_revenue_result[0] if total_revenue_result and total_revenue_result[0] else 0
    
    total_reviews = db.query(Review).count()
    avg_rating_result = db.query(func.avg(Review.rating)).first()
    avg_rating = avg_rating_result[0] if avg_rating_result and avg_rating_result[0] else 0
    
    return {
        "users": {
            "total": total_users,
            "patients": total_patients,
            "doctors": total_doctors,
            "pending_doctors": pending_doctors,
            "active": active_users,
            "new_this_month": new_users_this_month
        },
        "appointments": {
            "total": total_appointments,
            "completed": completed_appointments,
            "cancelled": cancelled_appointments,
            "pending": pending_appointments,
            "upcoming": upcoming_appointments
        },
        "revenue": {
            "total": float(total_revenue),
            "this_month": 0
        },
        "reviews": {
            "total": total_reviews,
            "average_rating": round(float(avg_rating), 1)
        }
    }

# ============ Doctor Management ============

@router.get("/doctors/pending")
async def get_pending_doctors(
    current_user: User = Depends(role_required("admin")),
    db: Session = Depends(get_db)
):
    """Get all doctors waiting for admin approval"""
    pending_doctors = db.query(User).filter(
        User.role == "doctor",
        User.status == "pending_admin_approval"
    ).all()
    
    results = []
    for doctor in pending_doctors:
        doctor_profile = db.query(Doctor).filter(Doctor.user_id == doctor.id).first()
        results.append({
            "id": doctor.id,
            "full_name": doctor.full_name,
            "email": doctor.email,
            "phone": doctor.phone,
            "license_number": doctor_profile.license_number if doctor_profile else "N/A",
            "specialization": doctor_profile.specializations[0].name if doctor_profile and doctor_profile.specializations else "Not specified",
            "years_experience": doctor_profile.years_of_experience if doctor_profile else 0,
            "consultation_fee": doctor_profile.consultation_fee if doctor_profile else 0,
            "bio": doctor_profile.bio if doctor_profile else "",
            "created_at": doctor.created_at
        })
    
    return {"doctors": results, "total": len(results)}

@router.put("/doctors/{doctor_id}/approve")
async def approve_doctor(
    doctor_id: int,
    current_user: User = Depends(role_required("admin")),
    db: Session = Depends(get_db)
):
    """Admin approves a doctor"""
    doctor = db.query(User).filter(
        User.id == doctor_id,
        User.role == "doctor"
    ).first()
    
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    doctor.status = "active"
    doctor.is_verified = True
    
    doctor_profile = db.query(Doctor).filter(Doctor.user_id == doctor_id).first()
    if doctor_profile:
        doctor_profile.is_verified = True
        doctor_profile.status = "available"
    
    db.commit()
    
    return {"message": "Doctor approved successfully"}

@router.put("/doctors/{doctor_id}/reject")
async def reject_doctor(
    doctor_id: int,
    reason: Optional[str] = None,
    current_user: User = Depends(role_required("admin")),
    db: Session = Depends(get_db)
):
    """Admin rejects a doctor application"""
    doctor = db.query(User).filter(
        User.id == doctor_id,
        User.role == "doctor"
    ).first()
    
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    doctor_profile = db.query(Doctor).filter(Doctor.user_id == doctor_id).first()
    if doctor_profile:
        db.delete(doctor_profile)
    db.delete(doctor)
    db.commit()
    
    return {"message": "Doctor application rejected"}

@router.get("/doctors/all")
async def get_all_doctors(
    search: Optional[str] = None,
    current_user: User = Depends(role_required("admin")),
    db: Session = Depends(get_db)
):
    """Get all doctors"""
    query = db.query(User).filter(User.role == "doctor")
    
    if search:
        query = query.filter(
            or_(
                User.full_name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%")
            )
        )
    
    doctors = query.order_by(User.created_at.desc()).all()
    
    results = []
    for doctor in doctors:
        doctor_profile = db.query(Doctor).filter(Doctor.user_id == doctor.id).first()
        results.append({
            "id": doctor.id,
            "full_name": doctor.full_name,
            "email": doctor.email,
            "phone": doctor.phone,
            "status": doctor.status,
            "is_verified": doctor.is_verified,
            "license_number": doctor_profile.license_number if doctor_profile else "N/A",
            "specialization": doctor_profile.specializations[0].name if doctor_profile and doctor_profile.specializations else "Not specified",
            "consultation_fee": doctor_profile.consultation_fee if doctor_profile else 0,
            "rating": doctor_profile.rating if doctor_profile else 0,
            "created_at": doctor.created_at
        })
    
    return {"doctors": results, "total": len(results)}

# ============ Patient Management ============

@router.get("/patients/all")
async def get_all_patients(
    search: Optional[str] = None,
    current_user: User = Depends(role_required("admin")),
    db: Session = Depends(get_db)
):
    """Get all patients"""
    query = db.query(User).filter(User.role == "patient")
    
    if search:
        query = query.filter(
            or_(
                User.full_name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%")
            )
        )
    
    patients = query.order_by(User.created_at.desc()).all()
    
    results = []
    for patient in patients:
        patient_profile = db.query(Patient).filter(Patient.user_id == patient.id).first()
        results.append({
            "id": patient.id,
            "full_name": patient.full_name,
            "email": patient.email,
            "phone": patient.phone,
            "status": patient.status,
            "date_of_birth": patient_profile.date_of_birth if patient_profile else None,
            "city": patient_profile.city if patient_profile else None,
            "created_at": patient.created_at
        })
    
    return {"patients": results, "total": len(results)}

# ============ Appointment Management ============

@router.get("/appointments/all")
async def get_all_appointments(
    status: Optional[str] = None,
    current_user: User = Depends(role_required("admin")),
    db: Session = Depends(get_db)
):
    """Get all appointments"""
    query = db.query(Appointment)
    
    if status:
        query = query.filter(Appointment.status == status)
    
    appointments = query.order_by(Appointment.scheduled_time.desc()).all()
    
    results = []
    for apt in appointments:
        patient = db.query(Patient).filter(Patient.id == apt.patient_id).first()
        doctor = db.query(Doctor).filter(Doctor.id == apt.doctor_id).first()
        patient_user = db.query(User).filter(User.id == patient.user_id).first() if patient else None
        doctor_user = db.query(User).filter(User.id == doctor.user_id).first() if doctor else None
        
        results.append({
            "id": apt.id,
            "patient_name": patient_user.full_name if patient_user else "Unknown",
            "doctor_name": doctor_user.full_name if doctor_user else "Unknown",
            "scheduled_time": apt.scheduled_time,
            "status": apt.status,
            "appointment_type": apt.appointment_type,
            "reason": apt.reason,
            "created_at": apt.created_at
        })
    
    return {"appointments": results, "total": len(results)}