import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User, UserRole, UserStatus
from app.models.patient import Patient, Gender, BloodType
from app.models.doctor import Doctor, DoctorStatus, Specialization
from app.models.appointment import Appointment, AppointmentStatus, AppointmentType
from app.core.security import get_password_hash
from datetime import datetime, timedelta

def seed_database():
    db = SessionLocal()
    
    try:
        # Seed specializations
        specializations = [
            "General Physician", "Cardiologist", "Dermatologist", 
            "Pediatrician", "Gynecologist", "Neurologist",
            "Orthopedic", "Psychiatrist", "Ophthalmologist",
            "Dentist", "Physiotherapist", "Nutritionist"
        ]
        
        for spec_name in specializations:
            spec = db.query(Specialization).filter(Specialization.name == spec_name).first()
            if not spec:
                spec = Specialization(name=spec_name)
                db.add(spec)
        db.commit()
        
        # Seed admin user
        admin = db.query(User).filter(User.email == "admin@afyalink.com").first()
        if not admin:
            admin = User(
                email="admin@afyalink.com",
                phone="+254700000001",
                full_name="System Administrator",
                hashed_password=get_password_hash("Admin@123"),
                role=UserRole.ADMIN,
                status=UserStatus.ACTIVE,
                is_verified=True
            )
            db.add(admin)
        
        # Seed sample doctors
        doctors_data = [
            {
                "name": "Dr. Sarah Wanjiku",
                "email": "sarah.wanjiku@afyalink.com",
                "phone": "+254712345678",
                "license": "MPCB/001/2020",
                "specialization": "General Physician",
                "fee": 2500,
                "experience": 8,
                "bio": "Experienced general physician specializing in family medicine."
            },
            {
                "name": "Dr. James Otieno",
                "email": "james.otieno@afyalink.com",
                "phone": "+254723456789",
                "license": "MPCB/002/2019",
                "specialization": "Cardiologist",
                "fee": 4500,
                "experience": 12,
                "bio": "Cardiologist with expertise in preventive cardiology."
            },
            {
                "name": "Dr. Mary Muthoni",
                "email": "mary.muthoni@afyalink.com",
                "phone": "+254734567890",
                "license": "MPCB/003/2021",
                "specialization": "Pediatrician",
                "fee": 3000,
                "experience": 6,
                "bio": "Compassionate pediatrician caring for children of all ages."
            }
        ]
        
        for doc_data in doctors_data:
            user = db.query(User).filter(User.email == doc_data["email"]).first()
            if not user:
                user = User(
                    email=doc_data["email"],
                    phone=doc_data["phone"],
                    full_name=doc_data["name"],
                    hashed_password=get_password_hash("Doctor@123"),
                    role=UserRole.DOCTOR,
                    status=UserStatus.ACTIVE,
                    is_verified=True
                )
                db.add(user)
                db.flush()
                
                # Get specialization
                spec = db.query(Specialization).filter(Specialization.name == doc_data["specialization"]).first()
                
                doctor = Doctor(
                    user_id=user.id,
                    license_number=doc_data["license"],
                    years_of_experience=doc_data["experience"],
                    consultation_fee=doc_data["fee"],
                    bio=doc_data["bio"],
                    status=DoctorStatus.AVAILABLE,
                    is_verified=True
                )
                db.add(doctor)
                db.flush()
                
                if spec:
                    doctor.specializations.append(spec)
        
        # Seed sample patient
        patient_user = db.query(User).filter(User.email == "patient@example.com").first()
        if not patient_user:
            patient_user = User(
                email="patient@example.com",
                phone="+254745678901",
                full_name="John Kamau",
                hashed_password=get_password_hash("Patient@123"),
                role=UserRole.PATIENT,
                status=UserStatus.ACTIVE,
                is_verified=True
            )
            db.add(patient_user)
            db.flush()
            
            patient = Patient(
                user_id=patient_user.id,
                date_of_birth=datetime(1990, 5, 15).date(),
                gender=Gender.MALE,
                blood_type=BloodType.O_POSITIVE,
                address="123 Ngong Road, Nairobi",
                city="Nairobi",
                emergency_contact_name="Jane Kamau",
                emergency_contact_phone="+254712345678",
                allergies="None",
                chronic_conditions="Mild hypertension"
            )
            db.add(patient)
        
        # Seed sample appointments
        doctors = db.query(Doctor).limit(2).all()
        patient = db.query(Patient).first()
        
        if doctors and patient:
            # Upcoming appointment
            upcoming = db.query(Appointment).filter(
                Appointment.patient_id == patient.id,
                Appointment.scheduled_time > datetime.utcnow()
            ).first()
            
            if not upcoming:
                appointment = Appointment(
                    patient_id=patient.id,
                    doctor_id=doctors[0].id,
                    scheduled_time=datetime.utcnow() + timedelta(days=2),
                    duration_minutes=30,
                    appointment_type=AppointmentType.VIDEO,
                    status=AppointmentStatus.CONFIRMED,
                    reason="General checkup"
                )
                db.add(appointment)
            
            # Past appointment
            past = db.query(Appointment).filter(
                Appointment.patient_id == patient.id,
                Appointment.scheduled_time < datetime.utcnow()
            ).first()
            
            if not past:
                past_appointment = Appointment(
                    patient_id=patient.id,
                    doctor_id=doctors[1].id,
                    scheduled_time=datetime.utcnow() - timedelta(days=5),
                    duration_minutes=30,
                    appointment_type=AppointmentType.IN_PERSON,
                    status=AppointmentStatus.COMPLETED,
                    reason="Follow-up consultation",
                    notes="Patient responding well to treatment"
                )
                db.add(past_appointment)
        
        db.commit()
        print("✅ Database seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()