import uuid
from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import (
    Column, String, Boolean, DateTime, Float, Text, ForeignKey, Enum
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class AppointmentStatus(str, PyEnum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class AppointmentType(str, PyEnum):
    ONLINE = "online"
    IN_PERSON = "in_person"


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    patient_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    doctor_id = Column(
        UUID(as_uuid=True), ForeignKey("doctors.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Float, default=30.0)
    appointment_type = Column(
        Enum(AppointmentType), default=AppointmentType.ONLINE, nullable=False
    )
    status = Column(
        Enum(AppointmentStatus), default=AppointmentStatus.PENDING, nullable=False
    )
    reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)  # Doctor notes
    fee = Column(Float, nullable=True)
    is_paid = Column(Boolean, default=False)
    video_link = Column(String(500), nullable=True)
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
    patient = relationship(
        "User", foreign_keys=[patient_id], back_populates="patient_appointments"
    )
    doctor = relationship(
        "Doctor", foreign_keys=[doctor_id], back_populates="appointments"
    )

    def __repr__(self):
        return f"<Appointment {self.id} — {self.status}>"