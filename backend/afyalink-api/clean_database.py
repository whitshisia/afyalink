#!/usr/bin/env python3
"""Database cleanup script - DELETE ALL USERS"""

import sys
sys.path.append('/home/shisia/afyalink/backend/afyalink-api')

from app.database import SessionLocal
from app.models.user import User
from app.models.appointment import Appointment
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.record import MedicalRecord
from app.models.prescription import Prescription
from app.models.payment import Payment
from app.models.review import Review
from app.models.refresh_token import RefreshToken
from app.models.notification import Notification
from app.models.doctor import doctor_specializations  # Import the association table
from datetime import datetime, timedelta
from sqlalchemy import text

def delete_all_users():
    """Delete ALL users from the database"""
    db = SessionLocal()
    
    print("⚠️  WARNING: This will delete ALL users and all related data!")
    print("="*60)
    confirm = input("Are you absolutely sure? Type 'DELETE ALL USERS' to confirm: ")
    
    if confirm != "DELETE ALL USERS":
        print("❌ Operation cancelled.")
        db.close()
        return
    
    print("\n🔍 Starting Database Cleanup...")
    print("="*50)
    
    # Get count before deletion
    user_count_before = db.query(User).count()
    print(f"\n📊 Users before deletion: {user_count_before}")
    
    # 1. Delete doctor_specializations junction table entries first (critical!)
    print("\n📋 Deleting doctor-specialization relationships...")
    db.execute(text("DELETE FROM doctor_specializations"))
    print("  Deleted doctor-specialization relationships")
    
    # 2. Delete all appointments
    print("\n📋 Deleting all appointments...")
    appointments_deleted = db.query(Appointment).delete()
    print(f"  Deleted {appointments_deleted} appointments")
    
    # 3. Delete all medical records
    print("\n📋 Deleting all medical records...")
    records_deleted = db.query(MedicalRecord).delete()
    print(f"  Deleted {records_deleted} medical records")
    
    # 4. Delete all prescriptions
    print("\n📋 Deleting all prescriptions...")
    prescriptions_deleted = db.query(Prescription).delete()
    print(f"  Deleted {prescriptions_deleted} prescriptions")
    
    # 5. Delete all payments
    print("\n📋 Deleting all payments...")
    payments_deleted = db.query(Payment).delete()
    print(f"  Deleted {payments_deleted} payments")
    
    # 6. Delete all reviews
    print("\n📋 Deleting all reviews...")
    reviews_deleted = db.query(Review).delete()
    print(f"  Deleted {reviews_deleted} reviews")
    
    # 7. Delete all notifications
    print("\n📋 Deleting all notifications...")
    notifications_deleted = db.query(Notification).delete()
    print(f"  Deleted {notifications_deleted} notifications")
    
    # 8. Delete all refresh tokens
    print("\n📋 Deleting all refresh tokens...")
    tokens_deleted = db.query(RefreshToken).delete()
    print(f"  Deleted {tokens_deleted} refresh tokens")
    
    # 9. Delete all doctors (now safe because junction table is empty)
    print("\n📋 Deleting all doctor profiles...")
    doctors_deleted = db.query(Doctor).delete()
    print(f"  Deleted {doctors_deleted} doctor profiles")
    
    # 10. Delete all patients
    print("\n📋 Deleting all patient profiles...")
    patients_deleted = db.query(Patient).delete()
    print(f"  Deleted {patients_deleted} patient profiles")
    
    # 11. Finally, delete all users
    print("\n📋 Deleting all users...")
    users_deleted = db.query(User).delete()
    print(f"  Deleted {users_deleted} users")
    
    # Commit all changes
    db.commit()
    
    print("\n" + "="*50)
    print("✅ Database cleanup completed!")
    
    # Show summary
    print("\n📊 Final counts:")
    print(f"  Users: {db.query(User).count()}")
    print(f"  Appointments: {db.query(Appointment).count()}")
    print(f"  Medical Records: {db.query(MedicalRecord).count()}")
    print(f"  Prescriptions: {db.query(Prescription).count()}")
    print(f"  Payments: {db.query(Payment).count()}")
    print(f"  Reviews: {db.query(Review).count()}")
    
    db.close()

def delete_all_data_except_admins():
    """Delete all data but keep admin users"""
    db = SessionLocal()
    
    print("⚠️  WARNING: This will delete ALL data EXCEPT admin users!")
    print("="*60)
    confirm = input("Are you sure? Type 'DELETE DATA' to confirm: ")
    
    if confirm != "DELETE DATA":
        print("❌ Operation cancelled.")
        db.close()
        return
    
    # Get admin users to keep
    admin_users = db.query(User).filter(User.role == 'admin').all()
    admin_ids = [user.id for user in admin_users]
    
    print(f"\n📋 Keeping {len(admin_ids)} admin users")
    
    # Delete doctor_specializations first
    db.execute(text("DELETE FROM doctor_specializations"))
    
    # Delete appointments for non-admin users
    db.query(Appointment).filter(
        Appointment.patient_id.notin_(admin_ids),
        Appointment.doctor_id.notin_(admin_ids)
    ).delete(synchronize_session=False)
    
    # Delete other tables...
    db.query(MedicalRecord).filter(MedicalRecord.patient_id.notin_(admin_ids)).delete(synchronize_session=False)
    db.query(Prescription).filter(Prescription.patient_id.notin_(admin_ids)).delete(synchronize_session=False)
    db.query(Payment).filter(Payment.patient_id.notin_(admin_ids)).delete(synchronize_session=False)
    db.query(Review).filter(Review.patient_id.notin_(admin_ids)).delete(synchronize_session=False)
    db.query(RefreshToken).filter(RefreshToken.user_id.notin_(admin_ids)).delete(synchronize_session=False)
    db.query(Notification).filter(Notification.user_id.notin_(admin_ids)).delete(synchronize_session=False)
    
    # Delete doctors and patients
    db.query(Doctor).filter(Doctor.user_id.notin_(admin_ids)).delete(synchronize_session=False)
    db.query(Patient).filter(Patient.user_id.notin_(admin_ids)).delete(synchronize_session=False)
    
    # Delete non-admin users
    db.query(User).filter(User.id.notin_(admin_ids)).delete(synchronize_session=False)
    
    db.commit()
    print("\n✅ Cleanup completed! Admin users preserved.")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🧹 DATABASE CLEANUP TOOL")
    print("="*60)
    print("\nOptions:")
    print("  1. Delete ALL users (complete wipe)")
    print("  2. Delete all data EXCEPT admin users")
    print("  3. Cancel")
    
    choice = input("\nSelect option (1/2/3): ")
    
    if choice == "1":
        delete_all_users()
    elif choice == "2":
        delete_all_data_except_admins()
    else:
        print("Operation cancelled.")