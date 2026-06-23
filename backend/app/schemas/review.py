from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, List
from enum import Enum

# Review Rating Enum
class RatingValue(int, Enum):
    ONE_STAR = 1
    TWO_STARS = 2
    THREE_STARS = 3
    FOUR_STARS = 4
    FIVE_STARS = 5

# Base Review Schema
class ReviewBase(BaseModel):
    rating: float = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    comment: Optional[str] = Field(None, max_length=1000, description="Review comment")
    
    @validator('rating')
    def validate_rating(cls, v):
        if v < 1 or v > 5:
            raise ValueError('Rating must be between 1 and 5')
        return round(v, 1)

# Schema for creating a review
class ReviewCreate(ReviewBase):
    doctor_id: int = Field(..., description="ID of the doctor being reviewed")
    appointment_id: Optional[int] = Field(None, description="ID of the appointment (optional)")
    
    @validator('doctor_id')
    def validate_doctor_id(cls, v):
        if v <= 0:
            raise ValueError('Doctor ID must be a positive integer')
        return v

# Schema for updating a review
class ReviewUpdate(BaseModel):
    rating: Optional[float] = Field(None, ge=1, le=5, description="Updated rating")
    comment: Optional[str] = Field(None, max_length=1000, description="Updated comment")
    
    @validator('rating')
    def validate_rating(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError('Rating must be between 1 and 5')
        return round(v, 1) if v else v

# Schema for response (includes all fields)
class ReviewResponse(ReviewBase):
    id: int
    patient_id: int
    doctor_id: int
    appointment_id: Optional[int] = None
    is_verified: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Optional: Include patient and doctor info
    patient_name: Optional[str] = None
    patient_avatar: Optional[str] = None
    doctor_name: Optional[str] = None
    
    class Config:
        from_attributes = True

# Schema for doctor's rating summary
class DoctorRatingSummary(BaseModel):
    doctor_id: int
    doctor_name: str
    average_rating: float = 0.0
    total_reviews: int = 0
    rating_distribution: dict = Field(default_factory=lambda: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    })
    
    class Config:
        from_attributes = True

# Schema for listing reviews with pagination
class ReviewListResponse(BaseModel):
    reviews: List[ReviewResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
    
    class Config:
        orm_mode = True  # for Pydantic v1

# Schema for review analytics
class ReviewAnalytics(BaseModel):
    total_reviews: int
    average_rating: float
    five_star_count: int
    four_star_count: int
    three_star_count: int
    two_star_count: int
    one_star_count: int
    verified_reviews_count: int
    unverified_reviews_count: int
    recent_reviews_count: int  # Last 30 days
    
    class Config:
        from_attributes = True

# Schema for creating a review response (admin only)
class ReviewResponseCreate(BaseModel):
    review_id: int
    response_text: str = Field(..., min_length=1, max_length=2000)
    
    class Config:
        from_attributes = True

# Schema for review response (admin response to review)
class ReviewResponseData(BaseModel):
    id: int
    review_id: int
    response_text: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Schema for flagging a review (admin/moderation)
class ReviewFlag(BaseModel):
    review_id: int
    reason: str = Field(..., min_length=1, max_length=500)
    flag_type: str = Field(..., pattern="^(inappropriate|spam|fake|offensive|other)$")
    
    class Config:
        from_attributes = True

# Schema for review moderation (admin)
class ReviewModeration(BaseModel):
    review_id: int
    action: str = Field(..., pattern="^(approve|hide|delete)$")
    reason: Optional[str] = Field(None, max_length=500)
    
    class Config:
        from_attributes = True

# Schema for review statistics (patient-specific)
class PatientReviewStatistics(BaseModel):
    patient_id: int
    total_reviews_written: int
    average_rating_given: float
    last_review_date: Optional[datetime] = None
    helpful_votes_received: int = 0
    
    class Config:
        from_attributes = True

# Schema for review with doctor details (for patient view)
class ReviewWithDoctorDetails(ReviewResponse):
    doctor_specialization: Optional[str] = None
    doctor_experience: Optional[int] = None
    consultation_fee: Optional[float] = None
    
    class Config:
        from_attributes = True

# Schema for review with patient details (for doctor view)
class ReviewWithPatientDetails(ReviewResponse):
    patient_phone: Optional[str] = None
    patient_email: Optional[str] = None
    appointment_date: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Schema for bulk review request (admin/data import)
class BulkReviewCreate(BaseModel):
    reviews: List[ReviewCreate]
    
    class Config:
        from_attributes = True

# Schema for review search filters
class ReviewFilters(BaseModel):
    min_rating: Optional[float] = Field(None, ge=1, le=5)
    max_rating: Optional[float] = Field(None, ge=1, le=5)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_verified: Optional[bool] = None
    has_comment: Optional[bool] = None
    doctor_id: Optional[int] = None
    patient_id: Optional[int] = None
    
    class Config:
        from_attributes = True

# Schema for review export (CSV/Excel)
class ReviewExportData(BaseModel):
    review_id: int
    patient_name: str
    doctor_name: str
    rating: float
    comment: str
    is_verified: bool
    created_at: datetime
    appointment_date: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Schema for helpful vote on review
class HelpfulVote(BaseModel):
    review_id: int
    user_id: int
    is_helpful: bool = True
    
    class Config:
        from_attributes = True

# Schema for review template (for quick feedback)
class ReviewTemplate(BaseModel):
    id: int
    title: str
    text: str
    rating: int
    category: str = Field(..., pattern="^(positive|neutral|negative)$")
    is_active: bool = True
    
    class Config:
        from_attributes = True

# Schema for review reminder (for patients after appointment)
class ReviewReminder(BaseModel):
    patient_id: int
    patient_email: str
    patient_name: str
    doctor_name: str
    appointment_id: int
    appointment_date: datetime
    reminder_sent_at: datetime
    
    class Config:
        from_attributes = True

# Schema for review webhook (for third-party integrations)
class ReviewWebhook(BaseModel):
    event_type: str = Field(..., pattern="^(review_created|review_updated|review_deleted|review_responded)$")
    review_id: int
    timestamp: datetime
    data: dict
    
    class Config:
        from_attributes = True