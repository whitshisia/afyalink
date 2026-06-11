import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
from pathlib import Path
import aiosmtplib
from jinja2 import Environment, FileSystemLoader
import logging
from ..core.config import settings

logger = logging.getLogger(__name__)

# Setup Jinja2 template environment
template_dir = Path(__file__).parent.parent / "templates" / "emails"
template_dir.mkdir(parents=True, exist_ok=True)

env = Environment(loader=FileSystemLoader(str(template_dir)))

class EmailService:
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.SMTP_FROM

    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """Send an email"""
        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self.from_email
            message["To"] = to_email

            # Add plain text version
            if text_content:
                text_part = MIMEText(text_content, "plain")
                message.attach(text_part)

            # Add HTML version
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)

            # Send email
            await aiosmtplib.send(
                message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.smtp_user,
                password=self.smtp_password,
                use_tls=True
            )
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    async def send_verification_email(self, email: str, user_id: int, token: str) -> bool:
        """Send email verification link"""
        verification_url = f"http://localhost:8000/api/v1/auth/verify-email/{user_id}/{token}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding: 20px 0; background: #16a863; color: white; border-radius: 10px 10px 0 0; }}
                .content {{ padding: 30px; background: #f9f9f9; }}
                .button {{ display: inline-block; padding: 12px 24px; background: #16a863; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>AfyaLink</h1>
                </div>
                <div class="content">
                    <h2>Verify Your Email Address</h2>
                    <p>Thank you for signing up with AfyaLink! Please click the button below to verify your email address.</p>
                    <div style="text-align: center;">
                        <a href="{verification_url}" class="button">Verify Email Address</a>
                    </div>
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; font-size: 12px; color: #666;">{verification_url}</p>
                    <p>This link will expire in 24 hours.</p>
                </div>
                <div class="footer">
                    <p>© 2025 AfyaLink. All rights reserved.</p>
                    <p>Your health, connected.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"Please verify your email by clicking this link: {verification_url}"
        
        return await self.send_email(email, "Verify Your Email - AfyaLink", html_content, text_content)

    async def send_welcome_email(self, email: str, full_name: str) -> bool:
        """Send welcome email after registration"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Welcome to AfyaLink</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding: 20px 0; background: #16a863; color: white; border-radius: 10px 10px 0 0; }}
                .content {{ padding: 30px; background: #f9f9f9; }}
                .button {{ display: inline-block; padding: 12px 24px; background: #16a863; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to AfyaLink, {full_name}!</h1>
                </div>
                <div class="content">
                    <h2>Your Health Journey Starts Here</h2>
                    <p>We're excited to have you on board! With AfyaLink, you can:</p>
                    <ul>
                        <li>Book appointments with top doctors</li>
                        <li>Access your medical records securely</li>
                        <li>Get prescriptions online</li>
                        <li>Consult with specialists via video calls</li>
                    </ul>
                    <div style="text-align: center;">
                        <a href="http://localhost:5173/dashboard" class="button">Go to Dashboard</a>
                    </div>
                </div>
                <div class="footer">
                    <p>Need help? Contact us at support@afyalink.com</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"Welcome to AfyaLink, {full_name}! Get started at http://localhost:5173/dashboard"
        
        return await self.send_email(email, "Welcome to AfyaLink!", html_content, text_content)

    async def send_password_reset_email(self, email: str, reset_token: str) -> bool:
        """Send password reset email"""
        reset_url = f"http://localhost:5173/reset-password?token={reset_token}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Reset Your Password</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding: 20px 0; background: #16a863; color: white; border-radius: 10px 10px 0 0; }}
                .content {{ padding: 30px; background: #f9f9f9; }}
                .button {{ display: inline-block; padding: 12px 24px; background: #16a863; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Reset Your Password</h1>
                </div>
                <div class="content">
                    <p>We received a request to reset your password. Click the button below to create a new password.</p>
                    <div style="text-align: center;">
                        <a href="{reset_url}" class="button">Reset Password</a>
                    </div>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                    <p>This link will expire in 1 hour.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"Reset your password by clicking this link: {reset_url}"
        
        return await self.send_email(email, "Reset Your Password - AfyaLink", html_content, text_content)

    async def send_appointment_confirmation(
        self,
        email: str,
        patient_name: str,
        doctor_name: str,
        appointment_date: str,
        appointment_time: str,
        appointment_type: str,
        meeting_link: Optional[str] = None
    ) -> bool:
        """Send appointment confirmation email"""
        meeting_link_html = f'<p>Video Meeting Link: <a href="{meeting_link}">{meeting_link}</a></p>' if meeting_link else ""
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Appointment Confirmation</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding: 20px 0; background: #16a863; color: white; border-radius: 10px 10px 0 0; }}
                .content {{ padding: 30px; background: #f9f9f9; }}
                .details {{ background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Appointment Confirmed</h1>
                </div>
                <div class="content">
                    <h2>Hello {patient_name},</h2>
                    <p>Your appointment has been confirmed!</p>
                    
                    <div class="details">
                        <h3>Appointment Details:</h3>
                        <p><strong>Doctor:</strong> Dr. {doctor_name}</p>
                        <p><strong>Date:</strong> {appointment_date}</p>
                        <p><strong>Time:</strong> {appointment_time}</p>
                        <p><strong>Type:</strong> {appointment_type}</p>
                        {meeting_link_html}
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="http://localhost:5173/appointments" class="button">View My Appointments</a>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        return await self.send_email(email, "Appointment Confirmed - AfyaLink", html_content)

    async def send_appointment_reminder(
        self,
        email: str,
        patient_name: str,
        doctor_name: str,
        appointment_date: str,
        appointment_time: str,
        meeting_link: Optional[str] = None
    ) -> bool:
        """Send appointment reminder email"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Appointment Reminder</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding: 20px 0; background: #f59e0b; color: white; border-radius: 10px 10px 0 0; }}
                .content {{ padding: 30px; background: #f9f9f9; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Appointment Reminder</h1>
                </div>
                <div class="content">
                    <h2>Hello {patient_name},</h2>
                    <p>This is a reminder about your upcoming appointment.</p>
                    
                    <p><strong>Doctor:</strong> Dr. {doctor_name}</p>
                    <p><strong>Date:</strong> {appointment_date}</p>
                    <p><strong>Time:</strong> {appointment_time}</p>
                    {f'<p><strong>Meeting Link:</strong> <a href="{meeting_link}">{meeting_link}</a></p>' if meeting_link else ""}
                    
                    <p>Please arrive 10 minutes early for your appointment.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return await self.send_email(email, "Appointment Reminder - AfyaLink", html_content)

    async def send_payment_receipt(
        self,
        email: str,
        patient_name: str,
        amount: float,
        transaction_id: str,
        appointment_date: str
    ) -> bool:
        """Send payment receipt email"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Payment Receipt</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding: 20px 0; background: #16a863; color: white; border-radius: 10px 10px 0 0; }}
                .content {{ padding: 30px; background: #f9f9f9; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Payment Receipt</h1>
                </div>
                <div class="content">
                    <h2>Thank you for your payment, {patient_name}!</h2>
                    
                    <p><strong>Amount:</strong> KES {amount:,.2f}</p>
                    <p><strong>Transaction ID:</strong> {transaction_id}</p>
                    <p><strong>Appointment Date:</strong> {appointment_date}</p>
                    
                    <p>Your payment has been processed successfully.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return await self.send_email(email, "Payment Receipt - AfyaLink", html_content)

# Create singleton instance
email_service = EmailService()

# Helper functions for backward compatibility
async def send_verification_email(email: str, user_id: int):
    token = f"dummy_token_{user_id}"  # In production, generate real token
    return await email_service.send_verification_email(email, user_id, token)

async def send_appointment_notification(email: str, appointment):
    return await email_service.send_appointment_confirmation(
        email=email,
        patient_name=appointment.patient.user.full_name,
        doctor_name=appointment.doctor.user.full_name,
        appointment_date=appointment.scheduled_time.strftime("%B %d, %Y"),
        appointment_time=appointment.scheduled_time.strftime("%I:%M %p"),
        appointment_type=appointment.appointment_type.value,
        meeting_link=appointment.video_meeting_link
    )