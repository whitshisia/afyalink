from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Float, Boolean, Enum, Table
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..database import Base

class DoctorStatus(str, enum.Enum):
    AVAILABLE = "available"
    BUSY = "busy"
    ON_LEAVE = "on_leave"
    OFFLINE = "offline"

class DoctorSpecialization(str, enum.Enum):
    GENERAL_PHYSICIAN = "general_physician"
    CARDIOLOGIST = "cardiologist"
    DERMATOLOGIST = "dermatologist"
    PEDIATRICIAN = "pediatrician"
    GYNECOLOGIST = "gynecologist"
    NEUROLOGIST = "neurologist"
    ORTHOPEDIC = "orthopedic"
    PSYCHIATRIST = "psychiatrist"
    OPHTHALMOLOGIST = "ophthalmologist"
    DENTIST = "dentist"
    PHYSIOTHERAPIST = "physiotherapist"
    NUTRITIONIST = "nutritionist"

class Specialization(Base):
    __tablename__ = "specializations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Association table for many-to-many relationship between doctors and specializations
doctor_specializations = Table(
    "doctor_specializations",
    Base.metadata,
    Column("doctor_id", Integer, ForeignKey("doctors.id")),
    Column("specialization_id", Integer, ForeignKey("specializations.id"))
)

class Doctor(Base):
    __tablename__ = "doctors"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    license_number = Column(String(50), unique=True, nullable=False)
    years_of_experience = Column(Integer, default=0)
    consultation_fee = Column(Float, nullable=False, default=0)
    hospital_affiliation = Column(String(255), nullable=True)
    clinic_address = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    education = Column(Text, nullable=True)
    languages = Column(String(255), nullable=True)
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    status = Column(Enum(DoctorStatus), default=DoctorStatus.AVAILABLE)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="doctor_profile")
    appointments = relationship("Appointment", back_populates="doctor", foreign_keys="Appointment.doctor_id")
    specializations = relationship("Specialization", secondary=doctor_specializations, back_populates="doctors")
    reviews = relationship("Review", back_populates="doctor")
    prescriptions = relationship("Prescription", back_populates="doctor")
    medical_records = relationship("MedicalRecord", back_populates="doctor")
Specialization.doctors = relationship("Doctor", secondary=doctor_specializations, back_populates="specializations")