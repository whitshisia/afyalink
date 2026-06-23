from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, List
from enum import Enum

# Record Type Enum
class RecordType(str, Enum):
    LAB_RESULT = "lab_result"
    RADIOLOGY = "radiology"
    PRESCRIPTION = "prescription"
    DISCHARGE_SUMMARY = "discharge_summary"
    SURGERY_REPORT = "surgery_report"
    VACCINATION = "vaccination"
    GENERAL = "general"

# Base Medical Record Schema
class MedicalRecordBase(BaseModel):
    record_type: RecordType = Field(..., description="Type of medical record")
    title: str = Field(..., min_length=1, max_length=255, description="Record title")
    description: Optional[str] = Field(None, max_length=2000, description="Record description")
    record_date: datetime = Field(..., description="Date of the medical record")
    doctor_id: Optional[int] = Field(None, description="ID of the doctor who created the record")
    appointment_id: Optional[int] = Field(None, description="Associated appointment ID")

# Schema for creating a medical record
class MedicalRecordCreate(MedicalRecordBase):
    patient_id: int = Field(..., description="ID of the patient")
    
    @validator('patient_id')
    def validate_patient_id(cls, v):
        if v <= 0:
            raise ValueError('Patient ID must be a positive integer')
        return v

# Schema for creating a medical record with file upload
class MedicalRecordWithFile(MedicalRecordCreate):
    file_url: Optional[str] = Field(None, max_length=500, description="URL to the uploaded file")
    file_name: Optional[str] = Field(None, max_length=255, description="Original file name")
    file_size: Optional[int] = Field(None, description="File size in bytes")
    file_type: Optional[str] = Field(None, max_length=100, description="MIME type of the file")

# Schema for updating a medical record
class MedicalRecordUpdate(BaseModel):
    record_type: Optional[RecordType] = None
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    record_date: Optional[datetime] = None
    doctor_id: Optional[int] = None

# Schema for response
class MedicalRecordResponse(MedicalRecordBase):
    id: int
    patient_id: int
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    file_type: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Optional fields for response
    doctor_name: Optional[str] = None
    patient_name: Optional[str] = None
    
    class Config:
        orm_mode = True

# Schema for listing records with pagination
class MedicalRecordListResponse(BaseModel):
    records: List[MedicalRecordResponse] = []
    total: int = 0
    page: int = 1
    per_page: int = 20
    total_pages: int = 0
    
    class Config:
        orm_mode = True

# Schema for record search filters
class MedicalRecordFilters(BaseModel):
    patient_id: Optional[int] = None
    doctor_id: Optional[int] = None
    record_type: Optional[RecordType] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    search: Optional[str] = Field(None, max_length=100, description="Search in title and description")
    
    class Config:
        orm_mode = True

# Schema for sharing a medical record
class MedicalRecordShare(BaseModel):
    record_id: int
    share_with_email: str = Field(..., description="Email to share the record with")
    share_with_phone: Optional[str] = Field(None, description="Phone number to share the record with")
    expiry_days: int = Field(7, ge=1, le=30, description="Number of days the share link is valid")
    
    class Config:
        orm_mode = True

# Schema for shared record response
class SharedRecordResponse(BaseModel):
    share_token: str
    record_id: int
    expires_at: datetime
    share_url: str
    
    class Config:
        orm_mode = True

# Schema for record category/summary
class RecordCategorySummary(BaseModel):
    record_type: RecordType
    count: int = 0
    latest_record_date: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Schema for patient record summary
class PatientRecordSummary(BaseModel):
    patient_id: int
    patient_name: str
    total_records: int = 0
    records_by_type: List[RecordCategorySummary] = []
    last_record_date: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Schema for record export request
class RecordExportRequest(BaseModel):
    patient_id: int
    record_ids: Optional[List[int]] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    format: str = Field("pdf", pattern="^(pdf|zip|json)$")
    
    class Config:
        orm_mode = True

# Schema for file upload response
class FileUploadResponse(BaseModel):
    file_url: str
    file_name: str
    file_size: int
    file_type: str
    record_id: int
    
    class Config:
        orm_mode = True

# Schema for record deletion (batch)
class BatchRecordDelete(BaseModel):
    record_ids: List[int] = Field(..., min_items=1, max_items=100)
    
    class Config:
        orm_mode = True

# Schema for record transfer (between patients)
class RecordTransfer(BaseModel):
    record_ids: List[int] = Field(..., min_items=1)
    target_patient_id: int
    reason: Optional[str] = Field(None, max_length=500)
    
    class Config:
        orm_mode = True

# Schema for record analytics
class RecordAnalytics(BaseModel):
    total_records: int = 0
    records_by_type: dict = {}
    records_by_month: dict = {}
    total_file_size_mb: float = 0.0
    average_records_per_patient: float = 0.0
    
    class Config:
        orm_mode = True

# Schema for record template (for common record types)
class RecordTemplate(BaseModel):
    id: int
    name: str
    record_type: RecordType
    template_fields: dict
    is_active: bool = True
    
    class Config:
        orm_mode = True