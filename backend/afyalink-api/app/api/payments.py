from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List
import httpx
from ..database import get_db
from ..models.payment import Payment, PaymentStatus, PaymentMethod
from ..models.appointment import Appointment
from ..models.patient import Patient
from ..models.user import User
from ..schemas.payment import PaymentResponse, PaymentCreate, MpesaCallback
from ..core.dependencies import get_current_user
from ..core.config import settings

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.post("/mpesa/stk-push")
async def initiate_mpesa_payment(
    payment_data: PaymentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Initiate M-Pesa STK Push payment"""
    # Get appointment
    appointment = db.query(Appointment).filter(Appointment.id == payment_data.appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Get patient
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Create payment record
    payment = Payment(
        patient_id=patient.id,
        appointment_id=appointment.id,
        amount=payment_data.amount,
        payment_method=PaymentMethod.MPESA,
        payment_status=PaymentStatus.PENDING
    )
    db.add(payment)
    db.commit()
    
    # In production, you would call M-Pesa API here
    # This is a stub for demonstration
    # mpesa_response = await call_mpesa_stk_push(
    #     phone_number=payment_data.phone_number,
    #     amount=payment_data.amount,
    #     account_reference=f"AFYALINK{payment.id}",
    #     transaction_desc=f"Appointment payment for Dr. {appointment.doctor_id}"
    # )
    
    return {
        "message": "STK Push sent to your phone",
        "payment_id": payment.id,
        "checkout_request_id": "ws_CO_123456789"  # This would come from M-Pesa
    }

@router.post("/mpesa/callback")
async def mpesa_callback(request: Request, db: Session = Depends(get_db)):
    """M-Pesa payment callback"""
    callback_data = await request.json()
    
    # Process callback data
    result_code = callback_data.get("Body", {}).get("stkCallback", {}).get("ResultCode")
    checkout_request_id = callback_data.get("Body", {}).get("stkCallback", {}).get("CheckoutRequestID")
    
    if result_code == 0:  # Payment successful
        # Update payment status
        payment = db.query(Payment).filter(Payment.transaction_id == checkout_request_id).first()
        if payment:
            payment.payment_status = PaymentStatus.COMPLETED
            payment.paid_at = datetime.utcnow()
            payment.mpesa_receipt_number = callback_data.get("Body", {}).get("stkCallback", {}).get("CallbackMetadata", {}).get("Item", [{}])[1].get("Value")
            db.commit()
    
    return {"ResultCode": 0, "ResultDesc": "Success"}

@router.get("/my-payments", response_model=List[PaymentResponse])
async def get_my_payments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's payment history"""
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    payments = db.query(Payment).filter(Payment.patient_id == patient.id).all()
    return payments