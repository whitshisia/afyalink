from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models.user import User
from ..models.review import Review
from ..models.patient import Patient
from ..models.doctor import Doctor
from ..models.appointment import Appointment, AppointmentStatus
from ..schemas.review import (
    ReviewCreate, ReviewUpdate, ReviewResponse, ReviewListResponse, 
    DoctorRatingSummary, ReviewAnalytics, ReviewWithDoctorDetails
)
from ..core.dependencies import get_current_user, role_required

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new review for a doctor"""
    
    # Get patient profile
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can write reviews"
        )
    
    # Check if doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == review_data.doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    # Check if patient already reviewed this doctor
    existing_review = db.query(Review).filter(
        Review.patient_id == current_user.id,
        Review.doctor_id == review_data.doctor_id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this doctor"
        )
    
    # If appointment_id provided, verify the appointment
    is_verified = False
    if review_data.appointment_id:
        appointment = db.query(Appointment).filter(
            Appointment.id == review_data.appointment_id,
            Appointment.patient_id == patient.id,
            Appointment.doctor_id == review_data.doctor_id,
            Appointment.status == AppointmentStatus.COMPLETED
        ).first()
        
        if appointment:
            is_verified = True
    
    # Create review
    review = Review(
        patient_id=current_user.id,
        doctor_id=review_data.doctor_id,
        appointment_id=review_data.appointment_id,
        rating=review_data.rating,
        comment=review_data.comment,
        is_verified=1 if is_verified else 0
    )
    
    db.add(review)
    
    # Update doctor's average rating
    doctor_ratings = db.query(Review).filter(Review.doctor_id == review_data.doctor_id).all()
    avg_rating = sum(r.rating for r in doctor_ratings) / len(doctor_ratings)
    doctor.rating = round(avg_rating, 1)
    doctor.total_reviews = len(doctor_ratings)
    
    db.commit()
    db.refresh(review)
    
    # Add patient name
    review.patient_name = current_user.full_name
    
    return review

@router.get("/doctor/{doctor_id}", response_model=List[ReviewResponse])
async def get_doctor_reviews(
    doctor_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all reviews for a specific doctor"""
    
    # Check if doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    reviews = db.query(Review).filter(
        Review.doctor_id == doctor_id
    ).order_by(Review.created_at.desc()).offset(skip).limit(limit).all()
    
    # Add patient names to response
    for review in reviews:
        patient = db.query(User).filter(User.id == review.patient_id).first()
        if patient:
            review.patient_name = patient.full_name
            review.patient_avatar = patient.profile_image
    
    return reviews

@router.get("/my-reviews", response_model=List[ReviewResponse])
async def get_my_reviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 50
):
    """Get reviews written by the current user"""
    
    reviews = db.query(Review).filter(
        Review.patient_id == current_user.id
    ).order_by(Review.created_at.desc()).offset(skip).limit(limit).all()
    
    # Add doctor names
    for review in reviews:
        doctor = db.query(Doctor).filter(Doctor.id == review.doctor_id).first()
        if doctor:
            doctor_user = db.query(User).filter(User.id == doctor.user_id).first()
            if doctor_user:
                review.doctor_name = doctor_user.full_name
    
    return reviews

@router.put("/{review_id}", response_model=ReviewResponse)
async def update_review(
    review_id: int,
    review_update: ReviewUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update your own review"""
    
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    # Check if user owns this review
    if review.patient_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own reviews"
        )
    
    # Update fields
    if review_update.rating is not None:
        review.rating = review_update.rating
    if review_update.comment is not None:
        review.comment = review_update.comment
    
    review.updated_at = datetime.utcnow()
    
    # Update doctor's average rating
    doctor = db.query(Doctor).filter(Doctor.id == review.doctor_id).first()
    if doctor:
        doctor_ratings = db.query(Review).filter(Review.doctor_id == review.doctor_id).all()
        avg_rating = sum(r.rating for r in doctor_ratings) / len(doctor_ratings)
        doctor.rating = round(avg_rating, 1)
    
    db.commit()
    db.refresh(review)
    
    return review

@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete your own review (or admin can delete any)"""
    
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    # Check authorization
    if current_user.role != "admin" and review.patient_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own reviews"
        )
    
    doctor_id = review.doctor_id
    
    db.delete(review)
    
    # Update doctor's average rating
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if doctor:
        doctor_ratings = db.query(Review).filter(Review.doctor_id == doctor_id).all()
        if doctor_ratings:
            avg_rating = sum(r.rating for r in doctor_ratings) / len(doctor_ratings)
            doctor.rating = round(avg_rating, 1)
            doctor.total_reviews = len(doctor_ratings)
        else:
            doctor.rating = 0.0
            doctor.total_reviews = 0
    
    db.commit()
    
    return None