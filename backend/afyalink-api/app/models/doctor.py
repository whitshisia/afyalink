import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Boolean, DateTime, Float, Integer, Text, ForeignKey, ARRAY
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        unique=True, nullable=False, index=True,
    )
    specialty = Column(String(200), nullable=False)
    sub_specialty = Column(String(200), nullable=True)
    bio = Column(Text, nullable=True)
    kmpdc_number = Column(String(50), unique=True, nullable=True)
    years_experience = Column(Integer, default=0)
    consultation_fee = Column(Float, default=500.0)  # KES
    location = Column(String(200), nullable=True)
    city = Column(String(100), nullable=True, index=True)
    languages = Column(ARRAY(String), default=["English", "Swahili"])
    rating = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False, nullable=False)
    is_available = Column(Boolean, default=True, nullable=False)
    accepts_online = Column(Boolean, default=True)
    accepts_in_person = Column(Boolean, default=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    user = relationship("User", back_populates="doctor_profile")
    appointments = relationship(
        "Appointment",
        foreign_keys="Appointment.doctor_id",
        back_populates="doctor",
    )

    def __repr__(self):
        return f"<Doctor {self.specialty} — {self.user_id}>"