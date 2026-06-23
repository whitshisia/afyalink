from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional, List
from enum import Enum

# Payment Status Enum
class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    CANCELLED = "cancelled"

# Payment Method Enum
class PaymentMethod(str, Enum):
    MPESA = "mpesa"
    CARD = "card"
    BANK_TRANSFER = "bank_transfer"
    CASH = "cash"
    INSURANCE = "insurance"

# Currency Enum
class Currency(str, Enum):
    KES = "KES"
    USD = "USD"
    EUR = "EUR"
    GBP = "GBP"

# Base Payment Schema
class PaymentBase(BaseModel):
    amount: float = Field(..., gt=0, description="Payment amount")
    currency: Currency = Field(Currency.KES, description="Currency code")
    payment_method: PaymentMethod = Field(..., description="Payment method used")
    payment_details: Optional[str] = Field(None, max_length=1000, description="Additional payment details")
    
    @field_validator('amount')
    @classmethod
    def validate_amount(cls, v: float) -> float:
        if v <= 0:
            raise ValueError('Amount must be greater than 0')
        if v > 1000000:  # Max 1,000,000 KES
            raise ValueError('Amount exceeds maximum allowed')
        return round(v, 2)

# Schema for creating a payment
class PaymentCreate(PaymentBase):
    patient_id: int = Field(..., description="ID of the patient making payment")
    appointment_id: int = Field(..., description="ID of the appointment being paid for")
    phone_number: Optional[str] = Field(None, description="Phone number for M-Pesa payment")
    
    @field_validator('patient_id', 'appointment_id')
    @classmethod
    def validate_ids(cls, v: int) -> int:
        if v <= 0:
            raise ValueError('ID must be a positive integer')
        return v
    
    @field_validator('phone_number')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            # Remove any non-digit characters
            cleaned = ''.join(filter(str.isdigit, v))
            if len(cleaned) < 9 or len(cleaned) > 12:
                raise ValueError('Invalid phone number format')
        return v

# Schema for M-Pesa STK Push request
class MpesaSTKPushRequest(BaseModel):
    phone_number: str = Field(..., description="Customer phone number")
    amount: float = Field(..., gt=0, description="Amount to pay")
    account_reference: str = Field(..., min_length=3, max_length=12, description="Account reference")
    transaction_desc: str = Field(..., min_length=1, max_length=50, description="Transaction description")
    
    @field_validator('phone_number')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # Remove any non-digit characters
        cleaned = ''.join(filter(str.isdigit, v))
        if len(cleaned) < 9 or len(cleaned) > 12:
            raise ValueError('Invalid phone number format')
        # Format to 254XXXXXXXXX
        if cleaned.startswith('0'):
            cleaned = '254' + cleaned[1:]
        elif cleaned.startswith('254'):
            pass
        elif cleaned.startswith('7') or cleaned.startswith('1'):
            cleaned = '254' + cleaned
        return cleaned
    
    @field_validator('amount')
    @classmethod
    def validate_amount(cls, v: float) -> float:
        if v < 1:
            raise ValueError('Minimum amount is 1 KES')
        if v > 150000:
            raise ValueError('Maximum amount is 150,000 KES')
        return round(v, 2)

# Schema for M-Pesa STK Push response
class MpesaSTKPushResponse(BaseModel):
    merchant_request_id: str
    checkout_request_id: str
    response_code: str
    response_description: str
    customer_message: str
    
    model_config = {
        "from_attributes": True
    }

# Schema for M-Pesa callback
class MpesaCallbackMetadata(BaseModel):
    amount: Optional[float] = None
    mpesa_receipt_number: Optional[str] = None
    transaction_date: Optional[str] = None
    phone_number: Optional[str] = None

class MpesaCallbackItem(BaseModel):
    name: str
    value: Optional[str] = None

class MpesaCallbackData(BaseModel):
    merchant_request_id: str
    checkout_request_id: str
    result_code: int
    result_desc: str
    callback_metadata: Optional[List[MpesaCallbackItem]] = None

class MpesaCallback(BaseModel):
    body: dict
    
    @property
    def is_successful(self) -> bool:
        return self.body.get('stkCallback', {}).get('ResultCode', 1) == 0
    
    @property
    def checkout_request_id(self) -> Optional[str]:
        return self.body.get('stkCallback', {}).get('CheckoutRequestID')
    
    @property
    def result_code(self) -> int:
        return self.body.get('stkCallback', {}).get('ResultCode', 1)
    
    @property
    def result_desc(self) -> str:
        return self.body.get('stkCallback', {}).get('ResultDesc', 'Unknown error')

# Schema for updating payment status
class PaymentStatusUpdate(BaseModel):
    payment_status: PaymentStatus
    transaction_id: Optional[str] = None
    mpesa_receipt_number: Optional[str] = None
    failure_reason: Optional[str] = Field(None, max_length=500)
    
    model_config = {
        "from_attributes": True
    }

# Schema for response
class PaymentResponse(PaymentBase):
    id: int
    patient_id: int
    appointment_id: int
    payment_status: PaymentStatus
    transaction_id: Optional[str] = None
    mpesa_receipt_number: Optional[str] = None
    stripe_payment_intent_id: Optional[str] = None
    paid_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Optional fields for response
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    appointment_date: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }

# Schema for payment list response
class PaymentListResponse(BaseModel):
    payments: List[PaymentResponse] = []
    total: int = 0
    page: int = 1
    per_page: int = 20
    total_pages: int = 0
    total_amount: float = 0.0
    
    model_config = {
        "from_attributes": True
    }

# Schema for payment summary (patient dashboard)
class PaymentSummary(BaseModel):
    total_paid: float = 0.0
    total_pending: float = 0.0
    total_refunded: float = 0.0
    total_transactions: int = 0
    last_payment_date: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }

# Schema for payment filters
class PaymentFilters(BaseModel):
    patient_id: Optional[int] = None
    appointment_id: Optional[int] = None
    payment_status: Optional[PaymentStatus] = None
    payment_method: Optional[PaymentMethod] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    min_amount: Optional[float] = Field(None, ge=0)
    max_amount: Optional[float] = Field(None, ge=0)
    
    model_config = {
        "from_attributes": True
    }

# Schema for payment refund request
class PaymentRefundRequest(BaseModel):
    payment_id: int
    reason: str = Field(..., min_length=1, max_length=500)
    amount: Optional[float] = Field(None, gt=0, description="Amount to refund (if partial)")
    
    @field_validator('payment_id')
    @classmethod
    def validate_payment_id(cls, v: int) -> int:
        if v <= 0:
            raise ValueError('Payment ID must be a positive integer')
        return v
    
    @field_validator('amount')
    @classmethod
    def validate_refund_amount(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v <= 0:
            raise ValueError('Refund amount must be greater than 0')
        return v
    
    model_config = {
        "from_attributes": True
    }

# Schema for payment refund response
class PaymentRefundResponse(BaseModel):
    refund_id: int
    payment_id: int
    amount: float
    status: str
    transaction_id: Optional[str] = None
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }

# Schema for payment webhook (for third-party integrations)
class PaymentWebhook(BaseModel):
    event_type: str = Field(..., pattern="^(payment_success|payment_failed|payment_refunded)$")
    payment_id: int
    transaction_id: Optional[str] = None
    timestamp: datetime
    data: dict
    
    model_config = {
        "from_attributes": True
    }

# Schema for payment analytics (admin dashboard)
class PaymentAnalytics(BaseModel):
    total_revenue: float = 0.0
    total_transactions: int = 0
    successful_transactions: int = 0
    failed_transactions: int = 0
    refunded_transactions: int = 0
    average_transaction_value: float = 0.0
    revenue_by_method: dict = {}
    revenue_by_month: dict = {}
    
    model_config = {
        "from_attributes": True
    }

# Schema for invoice generation
class InvoiceRequest(BaseModel):
    payment_id: int
    include_company_details: bool = True
    format: str = Field("pdf", pattern="^(pdf|html)$")
    
    model_config = {
        "from_attributes": True
    }

# Schema for invoice response
class InvoiceResponse(BaseModel):
    invoice_url: str
    invoice_number: str
    generated_at: datetime
    
    model_config = {
        "from_attributes": True
    }

# Schema for bulk payment status check
class BulkPaymentStatusRequest(BaseModel):
    payment_ids: List[int] = Field(..., min_length=1, max_length=50)
    
    @field_validator('payment_ids')
    @classmethod
    def validate_payment_ids(cls, v: List[int]) -> List[int]:
        if len(v) > 50:
            raise ValueError('Cannot check more than 50 payments at once')
        return v
    
    model_config = {
        "from_attributes": True
    }

# Schema for bulk payment status response
class BulkPaymentStatusResponse(BaseModel):
    payments: List[PaymentResponse] = []
    total: int = 0
    
    model_config = {
        "from_attributes": True
    }

# Schema for payment receipt email
class PaymentReceiptEmail(BaseModel):
    payment_id: int
    recipient_email: str
    recipient_name: str
    
    model_config = {
        "from_attributes": True
    }

# Schema for subscription payment (for recurring payments)
class SubscriptionPayment(BaseModel):
    subscription_id: int
    amount: float
    currency: Currency = Currency.KES
    payment_method: PaymentMethod
    auto_renew: bool = True
    
    model_config = {
        "from_attributes": True
    }

# Schema for payment statistics by doctor
class DoctorPaymentStatistics(BaseModel):
    doctor_id: int
    doctor_name: str
    total_earnings: float = 0.0
    total_appointments: int = 0
    average_consultation_fee: float = 0.0
    last_payment_date: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }