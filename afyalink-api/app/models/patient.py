from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..database import Base

class Gender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class BloodType(str, enum.Enum):
    A_POSITIVE = "A+"
    A_NEGATIVE = "A-"
    B_POSITIVE = "B+"
    B_NEGATIVE = "B-"
    O_POSITIVE = "O+"
    O_NEGATIVE = "O-"
    AB_POSITIVE = "AB+"
    AB_NEGATIVE = "AB-"

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(Enum(Gender), nullable=True)
    blood_type = Column(Enum(BloodType), nullable=True)
    address = Column(String(500), nullable=True)
    city = Column(String(100), nullable=True)
    emergency_contact_name = Column(String(255), nullable=True)
    emergency_contact_phone = Column(String(20), nullable=True)
    allergies = Column(Text, nullable=True)
    chronic_conditions = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships Cleaned:
    user = relationship("User", back_populates="patient_profile")
    appointments = relationship("Appointment", back_populates="patient", foreign_keys="Appointment.patient_id")
    medical_records = relationship("MedicalRecord", back_populates="patient", cascade="all, delete-orphan")
    prescriptions = relationship("Prescription", back_populates="patient")
    payments = relationship("Payment", back_populates="patient")
    reviews = relationship(
        "Review", 
        back_populates="patient", 
        foreign_keys="Review.patient_id",  # Fixed: Cleaned brackets string notation
        cascade="all, delete-orphan"
    )
