from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models.user import User
from ..models.record import MedicalRecord, RecordType
from ..models.patient import Patient
from ..models.doctor import Doctor
from ..schemas.record import (
    MedicalRecordCreate, MedicalRecordResponse, MedicalRecordListResponse,
    MedicalRecordUpdate, MedicalRecordFilters, FileUploadResponse,
    PatientRecordSummary, RecordExportRequest
)
from ..core.dependencies import get_current_user, role_required

router = APIRouter(prefix="/records", tags=["Medical Records"])

@router.post("/", response_model=MedicalRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_medical_record(
    record_data: MedicalRecordCreate,
    current_user: User = Depends(role_required("doctor", "admin")),
    db: Session = Depends(get_db)
):
    """Create a new medical record (Doctors and Admins only)"""
    
    # Check if patient exists
    patient = db.query(Patient).filter(Patient.id == record_data.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # If doctor_id provided, verify doctor exists
    if record_data.doctor_id:
        doctor = db.query(Doctor).filter(Doctor.id == record_data.doctor_id).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Create record
    db_record = MedicalRecord(**record_data.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    return db_record

@router.post("/upload", response_model=FileUploadResponse)
async def upload_medical_file(
    file: UploadFile = File(...),
    patient_id: int = Query(...),
    record_type: RecordType = Query(...),
    title: str = Query(..., min_length=1),
    description: Optional[str] = Query(None),
    current_user: User = Depends(role_required("doctor", "admin", "patient")),
    db: Session = Depends(get_db)
):
    """Upload a medical file (PDF, image, etc.)"""
    
    # Check authorization
    if current_user.role == "patient":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient or patient.id != patient_id:
            raise HTTPException(status_code=403, detail="Not authorized")
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"File type not allowed. Allowed types: {', '.join(allowed_types)}"
        )
    
    # Validate file size (max 10MB)
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > 10 * 1024 * 1024:  # 10MB
        raise HTTPException(status_code=400, detail="File size too large. Max 10MB")
    
    # In production, upload to Cloudinary or S3 here
    # For now, create a mock URL
    file_url = f"https://storage.afyalink.com/records/{datetime.now().timestamp()}_{file.filename}"
    
    # Create record
    record = MedicalRecord(
        patient_id=patient_id,
        record_type=record_type,
        title=title,
        description=description,
        file_url=file_url,
        file_name=file.filename,
        file_size=file_size,
        file_type=file.content_type,
        record_date=datetime.utcnow(),
        doctor_id=None  # Set from current user if doctor
    )
    
    if current_user.role == "doctor":
        doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
        if doctor:
            record.doctor_id = doctor.id
    
    db.add(record)
    db.commit()
    db.refresh(record)
    
    return FileUploadResponse(
        file_url=file_url,
        file_name=file.filename,
        file_size=file_size,
        file_type=file.content_type,
        record_id=record.id
    )

@router.get("/patient/{patient_id}", response_model=List[MedicalRecordResponse])
async def get_patient_records(
    patient_id: int,
    record_type: Optional[RecordType] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all records for a patient"""
    
    # Check authorization
    if current_user.role == "patient":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient or patient.id != patient_id:
            raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if patient exists
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    query = db.query(MedicalRecord).filter(MedicalRecord.patient_id == patient_id)
    
    if record_type:
        query = query.filter(MedicalRecord.record_type == record_type)
    
    records = query.order_by(MedicalRecord.record_date.desc()).offset(skip).limit(limit).all()
    
    # Add doctor names
    for record in records:
        if record.doctor_id:
            doctor = db.query(Doctor).filter(Doctor.id == record.doctor_id).first()
            if doctor:
                doctor_user = db.query(User).filter(User.id == doctor.user_id).first()
                if doctor_user:
                    record.doctor_name = doctor_user.full_name
    
    return records

@router.get("/{record_id}", response_model=MedicalRecordResponse)
async def get_record_by_id(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get medical record by ID"""
    
    record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Medical record not found")
    
    # Check authorization
    patient = db.query(Patient).filter(Patient.id == record.patient_id).first()
    
    if current_user.role == "patient":
        if not patient or patient.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
    elif current_user.role == "doctor":
        doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
        if not doctor or record.doctor_id != doctor.id:
            # Allow doctors to view records they didn't create if they treat the patient
            # This would need additional logic based on appointment history
            pass
    
    # Add doctor name
    if record.doctor_id:
        doctor = db.query(Doctor).filter(Doctor.id == record.doctor_id).first()
        if doctor:
            doctor_user = db.query(User).filter(User.id == doctor.user_id).first()
            if doctor_user:
                record.doctor_name = doctor_user.full_name
    
    return record

@router.put("/{record_id}", response_model=MedicalRecordResponse)
async def update_medical_record(
    record_id: int,
    record_update: MedicalRecordUpdate,
    current_user: User = Depends(role_required("doctor", "admin")),
    db: Session = Depends(get_db)
):
    """Update a medical record (Doctors and Admins only)"""
    
    record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Medical record not found")
    
    update_data = record_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(record, field, value)
    
    record.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(record)
    
    return record

@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_medical_record(
    record_id: int,
    current_user: User = Depends(role_required("doctor", "admin")),
    db: Session = Depends(get_db)
):
    """Delete a medical record (Doctors and Admins only)"""
    
    record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Medical record not found")
    
    db.delete(record)
    db.commit()
    
    return None

@router.get("/patient/{patient_id}/summary", response_model=PatientRecordSummary)
async def get_patient_record_summary(
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get summary of patient's medical records"""
    
    # Check authorization
    if current_user.role == "patient":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient or patient.id != patient_id:
            raise HTTPException(status_code=403, detail="Not authorized")
    
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    patient_user = db.query(User).filter(User.id == patient.user_id).first()
    
    records = db.query(MedicalRecord).filter(MedicalRecord.patient_id == patient_id).all()
    
    # Group by record type
    records_by_type = {}
    for record in records:
        if record.record_type.value not in records_by_type:
            records_by_type[record.record_type.value] = []
        records_by_type[record.record_type.value].append(record)
    
    from ..schemas.record import RecordCategorySummary
    
    categories = []
    for record_type, type_records in records_by_type.items():
        categories.append(
            RecordCategorySummary(
                record_type=RecordType(record_type),
                count=len(type_records),
                latest_record_date=max(r.record_date for r in type_records) if type_records else None
            )
        )
    
    last_record_date = max((r.record_date for r in records), default=None) if records else None
    
    return PatientRecordSummary(
        patient_id=patient_id,
        patient_name=patient_user.full_name if patient_user else "Unknown",
        total_records=len(records),
        records_by_type=categories,
        last_record_date=last_record_date
    )