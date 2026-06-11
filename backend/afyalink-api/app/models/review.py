from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), nullable=True)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=True)
    is_verified = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 1. Foreign Key Columns (Declared exactly once each)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False) # Changed from users.id to doctors.id
    
    # 2. Symmetrical ORM Relationships
    patient = relationship(
        "Patient", 
        back_populates="reviews", 
        foreign_keys=[patient_id]
    )    
    reviewer = relationship(
        "User", 
        back_populates="reviews_given", 
        foreign_keys=[reviewer_id]
    )    
    doctor = relationship(
        "Doctor", # Changed from "User" to "Doctor"
        back_populates="reviews", # Matches back_populates inside Doctor class
        foreign_keys=[doctor_id]
    )
    appointment = relationship("Appointment")
