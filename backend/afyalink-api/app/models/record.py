from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..database import Base

class RecordType(str, enum.Enum):
    LAB_RESULT = "lab_result"
    RADIOLOGY = "radiology"
    PRESCRIPTION = "prescription"
    DISCHARGE_SUMMARY = "discharge_summary"
    SURGERY_REPORT = "surgery_report"
    VACCINATION = "vaccination"
    GENERAL = "general"

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True) # Kept nullable=True since some records are system-generated
    appointment_id = Column(Integer, ForeignKey("appointments.id"), nullable=True)
    record_type = Column(Enum(RecordType), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    file_url = Column(String(500), nullable=True)
    file_name = Column(String(255), nullable=True)
    file_size = Column(Integer, nullable=True)
    file_type = Column(String(100), nullable=True)
    record_date = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Structural Safety Check: Ensure these strings match the back_populates in those models
    patient = relationship("Patient", back_populates="medical_records")
    doctor = relationship("Doctor", back_populates="medical_records") # Added back_populates for symmetrical tracking
    appointment = relationship("Appointment", back_populates="medical_records") # Uniformed pluralization string name
