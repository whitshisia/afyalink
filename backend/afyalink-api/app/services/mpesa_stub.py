import json
import base64
import random
import string
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import httpx
import logging
from ..core.config import settings

logger = logging.getLogger(__name__)

class MpesaStub:
    """M-Pesa API Stub for development and testing"""
    
    def __init__(self):
        self.environment = settings.MPESA_ENVIRONMENT
        self.consumer_key = settings.MPESA_CONSUMER_KEY
        self.consumer_secret = settings.MPESA_CONSUMER_SECRET
        self.passkey = settings.MPESA_PASSKEY
        self.shortcode = settings.MPESA_SHORTCODE
        self.callback_url = settings.MPESA_CALLBACK_URL
        
        # In-memory storage for testing
        self.access_token = None
        self.token_expiry = None
        self.transactions = {}
        
    def _generate_random_string(self, length: int = 10) -> str:
        """Generate random string"""
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
    
    def _generate_password(self) -> str:
        """Generate password for STK push"""
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_str = f"{self.shortcode}{self.passkey}{timestamp}"
        password = base64.b64encode(password_str.encode()).decode('utf-8')
        return password, timestamp
    
    async def get_access_token(self) -> Optional[str]:
        """Get OAuth access token (stub version)"""
        # In stub mode, return a dummy token
        if self.environment == "sandbox":
            return "dummy_access_token_" + self._generate_random_string(20)
        
        # Real implementation for production
        try:
            auth = base64.b64encode(f"{self.consumer_key}:{self.consumer_secret}".encode()).decode()
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
                    headers={"Authorization": f"Basic {auth}"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    self.access_token = data.get("access_token")
                    self.token_expiry = datetime.now() + timedelta(seconds=data.get("expires_in", 3600))
                    return self.access_token
                else:
                    logger.error(f"Failed to get M-Pesa token: {response.text}")
                    return None
        except Exception as e:
            logger.error(f"Error getting M-Pesa token: {str(e)}")
            return None
    
    async def stk_push(
        self,
        phone_number: str,
        amount: float,
        account_reference: str,
        transaction_desc: str = "Payment to AfyaLink"
    ) -> Dict[str, Any]:
        """Initiate STK Push (Lipa Na M-Pesa Online)"""
        
        # Format phone number (remove leading 0 or +254)
        phone_number = self._format_phone_number(phone_number)
        
        # Generate password and timestamp
        password, timestamp = self._generate_password()
        
        # For stub mode, simulate successful response
        if self.environment == "sandbox":
            # Generate a dummy checkout request ID
            checkout_request_id = f"ws_CO_{self._generate_random_string(15)}"
            merchant_request_id = f"ws_MR_{self._generate_random_string(15)}"
            
            # Store transaction for callback simulation
            transaction = {
                "checkout_request_id": checkout_request_id,
                "merchant_request_id": merchant_request_id,
                "phone_number": phone_number,
                "amount": amount,
                "account_reference": account_reference,
                "transaction_desc": transaction_desc,
                "status": "pending",
                "created_at": datetime.now().isoformat()
            }
            self.transactions[checkout_request_id] = transaction
            
            # Simulate callback after 5 seconds (in real scenario, this would be async)
            # For testing, we'll return immediately and you can test callback separately
            
            return {
                "ResponseCode": "0",
                "ResponseDescription": "Success. Request accepted for processing",
                "MerchantRequestID": merchant_request_id,
                "CheckoutRequestID": checkout_request_id,
                "CustomerMessage": "Success. Request accepted for processing"
            }
        
        # Real implementation for production
        try:
            access_token = await self.get_access_token()
            if not access_token:
                return {
                    "ResponseCode": "1",
                    "ResponseDescription": "Failed to get access token"
                }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "BusinessShortCode": self.shortcode,
                        "Password": password,
                        "Timestamp": timestamp,
                        "TransactionType": "CustomerPayBillOnline",
                        "Amount": int(amount),
                        "PartyA": phone_number,
                        "PartyB": self.shortcode,
                        "PhoneNumber": phone_number,
                        "CallBackURL": self.callback_url,
                        "AccountReference": account_reference,
                        "TransactionDesc": transaction_desc
                    }
                )
                
                return response.json()
                
        except Exception as e:
            logger.error(f"STK Push error: {str(e)}")
            return {
                "ResponseCode": "1",
                "ResponseDescription": f"Error: {str(e)}"
            }
    
    async def query_status(self, checkout_request_id: str) -> Dict[str, Any]:
        """Query STK Push transaction status"""
        
        # For stub mode, return simulated status
        if self.environment == "sandbox":
            transaction = self.transactions.get(checkout_request_id, {})
            
            # Simulate successful payment after some time
            if transaction:
                return {
                    "ResponseCode": "0",
                    "ResponseDescription": "Success",
                    "ResultCode": "0",
                    "ResultDesc": "The service request is processed successfully.",
                    "CheckoutRequestID": checkout_request_id,
                    "Amount": transaction.get("amount"),
                    "MpesaReceiptNumber": f"MPESA{self._generate_random_string(10)}",
                    "TransactionDate": datetime.now().strftime("%Y%m%d%H%M%S"),
                    "PhoneNumber": transaction.get("phone_number")
                }
            else:
                return {
                    "ResponseCode": "1",
                    "ResponseDescription": "Transaction not found"
                }
        
        # Real implementation
        try:
            access_token = await self.get_access_token()
            if not access_token:
                return {"ResponseCode": "1", "ResponseDescription": "Failed to get access token"}
            
            password, timestamp = self._generate_password()
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query",
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "BusinessShortCode": self.shortcode,
                        "Password": password,
                        "Timestamp": timestamp,
                        "CheckoutRequestID": checkout_request_id
                    }
                )
                
                return response.json()
                
        except Exception as e:
            logger.error(f"Query status error: {str(e)}")
            return {"ResponseCode": "1", "ResponseDescription": str(e)}
    
    async def simulate_callback(self, checkout_request_id: str, success: bool = True) -> Dict[str, Any]:
        """Simulate M-Pesa callback for testing"""
        
        transaction = self.transactions.get(checkout_request_id, {})
        
        if success:
            return {
                "Body": {
                    "stkCallback": {
                        "MerchantRequestID": transaction.get("merchant_request_id"),
                        "CheckoutRequestID": checkout_request_id,
                        "ResultCode": 0,
                        "ResultDesc": "Success",
                        "CallbackMetadata": {
                            "Item": [
                                {"Name": "Amount", "Value": transaction.get("amount", 0)},
                                {"Name": "MpesaReceiptNumber", "Value": f"MPESA{self._generate_random_string(10)}"},
                                {"Name": "TransactionDate", "Value": datetime.now().strftime("%Y%m%d%H%M%S")},
                                {"Name": "PhoneNumber", "Value": transaction.get("phone_number", "")}
                            ]
                        }
                    }
                }
            }
        else:
            return {
                "Body": {
                    "stkCallback": {
                        "MerchantRequestID": transaction.get("merchant_request_id"),
                        "CheckoutRequestID": checkout_request_id,
                        "ResultCode": 1,
                        "ResultDesc": "Payment failed"
                    }
                }
            }
    
    def _format_phone_number(self, phone_number: str) -> str:
        """Format phone number to 254XXXXXXXXX format"""
        # Remove any spaces, dashes, or plus signs
        cleaned = ''.join(filter(str.isdigit, phone_number))
        
        # Handle different formats
        if cleaned.startswith('0'):
            cleaned = '254' + cleaned[1:]
        elif cleaned.startswith('254'):
            pass
        elif cleaned.startswith('7') or cleaned.startswith('1'):
            cleaned = '254' + cleaned
        else:
            cleaned = '254' + cleaned[-9:] if len(cleaned) >= 9 else cleaned
            
        return cleaned
    
    async def register_urls(self) -> Dict[str, Any]:
        """Register validation and confirmation URLs"""
        
        if self.environment == "sandbox":
            return {
                "ResponseCode": "0",
                "ResponseDescription": "Success",
                "OriginatorCoversationID": self._generate_random_string(15)
            }
        
        try:
            access_token = await self.get_access_token()
            if not access_token:
                return {"ResponseCode": "1", "ResponseDescription": "Failed to get access token"}
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl",
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "ShortCode": self.shortcode,
                        "ResponseType": "Completed",
                        "ConfirmationURL": f"{self.callback_url}/confirmation",
                        "ValidationURL": f"{self.callback_url}/validation"
                    }
                )
                
                return response.json()
                
        except Exception as e:
            logger.error(f"Register URLs error: {str(e)}")
            return {"ResponseCode": "1", "ResponseDescription": str(e)}

# Create singleton instance
mpesa_stub = MpesaStub()

# Helper function for backward compatibility
async def call_mpesa_stk_push(phone_number: str, amount: float, account_reference: str, transaction_desc: str):
    return await mpesa_stub.stk_push(phone_number, amount, account_reference, transaction_desc)