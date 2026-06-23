from sqlalchemy import Column, Integer, DateTime, ForeignKey, String, Text, Float, Enum, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..database import Base

class AppointmentStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"

class AppointmentType(str, enum.Enum):
    IN_PERSON = "in_person"
    VIDEO = "video"
    PHONE = "phone"

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    scheduled_time = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Integer, default=30)
    appointment_type = Column(Enum(AppointmentType), default=AppointmentType.VIDEO)
    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.PENDING)
    reason = Column(Text, nullable=True)
    symptoms = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    prescription_notes = Column(Text, nullable=True)
    video_meeting_link = Column(String(500), nullable=True)
    cancellation_reason = Column(Text, nullable=True)
    cancelled_by = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    patient = relationship("Patient", back_populates="appointments", foreign_keys=[patient_id])
    doctor = relationship("Doctor", back_populates="appointments", foreign_keys=[doctor_id])
    payment = relationship("Payment", back_populates="appointment", uselist=False)
    
    # FIX: Updated back_populates to exactly match the attribute on the MedicalRecord class
    medical_records = relationship(
        "MedicalRecord", 
        back_populates="appointment", 
        uselist=False
    )