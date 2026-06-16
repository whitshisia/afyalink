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

            if text_content:
                text_part = MIMEText(text_content, "plain")
                message.attach(text_part)

            html_part = MIMEText(html_content, "html")
            message.attach(html_part)

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

    # ============ Verification & Welcome Emails ============

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

    # ============ Appointment Emails ============

    async def send_appointment_notification(self, email: str, appointment) -> bool:
        """Send appointment confirmation notification"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Appointment Confirmed</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #16a863; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background: #f9f9f9; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Appointment Confirmed!</h1>
                </div>
                <div class="content">
                    <p>Your appointment has been confirmed.</p>
                    <p><strong>Doctor:</strong> {appointment.doctor.user.full_name}</p>
                    <p><strong>Date:</strong> {appointment.scheduled_time.strftime('%B %d, %Y at %I:%M %p')}</p>
                    <p><strong>Type:</strong> {appointment.appointment_type}</p>
                    <p>You can view your appointment details in your dashboard.</p>
                </div>
            </div>
        </body>
        </html>
        """
        return await self.send_email(email, "Appointment Confirmed - AfyaLink", html_content)

    async def send_appointment_reminder(self, email: str, patient_name: str, doctor_name: str, date: str, time: str) -> bool:
        """Send appointment reminder"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Appointment Reminder</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #f59e0b; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background: #f9f9f9; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Appointment Reminder</h1>
                </div>
                <div class="content">
                    <p>Dear {patient_name},</p>
                    <p>This is a reminder about your upcoming appointment.</p>
                    <p><strong>Doctor:</strong> Dr. {doctor_name}</p>
                    <p><strong>Date:</strong> {date}</p>
                    <p><strong>Time:</strong> {time}</p>
                    <p>Please arrive 10 minutes early.</p>
                </div>
            </div>
        </body>
        </html>
        """
        return await self.send_email(email, "Appointment Reminder - AfyaLink", html_content)

    # ============ Doctor Approval Emails ============

    async def send_doctor_approval_email(self, email: str, full_name: str) -> bool:
        """Send email to doctor when approved"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Account Approved - AfyaLink</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #16a863; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 30px; background: #f9f9f9; }}
                .button {{ display: inline-block; padding: 12px 24px; background: #16a863; color: white; text-decoration: none; border-radius: 5px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to AfyaLink, Dr. {full_name}!</h1>
                </div>
                <div class="content">
                    <p>Congratulations! Your application has been <strong>approved</strong>.</p>
                    <p>You can now:</p>
                    <ul>
                        <li>Set up your practice profile</li>
                        <li>Manage your availability</li>
                        <li>Start accepting patient appointments</li>
                    </ul>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="http://localhost:5173/login" class="button">Log In Now</a>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        return await self.send_email(email, "Welcome to AfyaLink - Account Approved", html_content)

    async def send_doctor_rejection_email(self, email: str, full_name: str, reason: str = None) -> bool:
        """Send email to doctor when rejected"""
        reason_text = f"<p><strong>Reason:</strong> {reason}</p>" if reason else ""
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Application Update - AfyaLink</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #dc2626; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 30px; background: #f9f9f9; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Application Update</h1>
                </div>
                <div class="content">
                    <p>Dear Dr. {full_name},</p>
                    <p>Thank you for your interest in AfyaLink. After careful review, we are unable to approve your application at this time.</p>
                    {reason_text}
                    <p>If you have questions, please contact support@afyalink.com</p>
                </div>
            </div>
        </body>
        </html>
        """
        return await self.send_email(email, "Update on Your AfyaLink Application", html_content)

    # ============ Demo & Contact Emails ============

    async def send_demo_request_email(self, demo_data) -> bool:
        """Send demo request notification to admins"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>New Demo Request</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #16a863; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background: #f9f9f9; }}
                .detail {{ margin: 10px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔔 New Demo Request</h1>
                </div>
                <div class="content">
                    <h3>Contact Information</h3>
                    <p class="detail"><strong>Name:</strong> {demo_data.first_name} {demo_data.last_name}</p>
                    <p class="detail"><strong>Email:</strong> {demo_data.email}</p>
                    <p class="detail"><strong>Phone:</strong> {demo_data.phone}</p>
                    <p class="detail"><strong>Organization:</strong> {demo_data.organization or 'N/A'}</p>
                    
                    <h3>Demo Details</h3>
                    <p class="detail"><strong>Role:</strong> {demo_data.role}</p>
                    <p class="detail"><strong>Preferred Date:</strong> {demo_data.preferred_date or 'Not specified'}</p>
                    <p class="detail"><strong>Preferred Time:</strong> {demo_data.preferred_time or 'Not specified'}</p>
                    <p class="detail"><strong>Demo Type:</strong> {demo_data.appointment_type}</p>
                    
                    <h3>Message</h3>
                    <p>{demo_data.message or 'No message provided'}</p>
                    
                    <hr>
                    <p style="color: #666; font-size: 12px;">This is an automated notification from AfyaLink.</p>
                </div>
            </div>
        </body>
        </html>
        """
        return await self.send_email("admin@afyalink.com", "New Demo Request - AfyaLink", html_content)

    async def send_demo_confirmation_email(self, email: str, first_name: str) -> bool:
        """Send confirmation email to user after demo request"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Demo Request Received</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #16a863; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 30px; background: #f9f9f9; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Thank You, {first_name}!</h1>
                </div>
                <div class="content">
                    <p>We've received your demo request. Our team will contact you within 24 hours to schedule your personalized demo.</p>
                    <p>In the meantime, feel free to explore our website:</p>
                    <ul>
                        <li>Learn about our <a href="http://localhost:5173/features">features</a></li>
                        <li>See our <a href="http://localhost:5173/pricing">pricing plans</a></li>
                    </ul>
                    <p>Best regards,<br><strong>The AfyaLink Team</strong></p>
                </div>
            </div>
        </body>
        </html>
        """
        return await self.send_email(email, "Demo Request Confirmed - AfyaLink", html_content)

    async def send_contact_email(self, contact_data) -> bool:
        """Send contact form message to admins"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>New Contact Message</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #16a863; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background: #f9f9f9; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📧 New Contact Message</h1>
                </div>
                <div class="content">
                    <p><strong>Name:</strong> {contact_data.name}</p>
                    <p><strong>Email:</strong> {contact_data.email}</p>
                    <p><strong>Subject:</strong> {contact_data.subject}</p>
                    <h3>Message</h3>
                    <p style="background: #fff; padding: 15px; border-radius: 5px; border-left: 4px solid #16a863;">
                        {contact_data.message}
                    </p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">This is an automated notification from AfyaLink.</p>
                </div>
            </div>
        </body>
        </html>
        """
        return await self.send_email("support@afyalink.com", f"Contact Form: {contact_data.subject}", html_content)

    async def send_contact_auto_reply(self, email: str, name: str) -> bool:
        """Send auto-reply to user after contact form submission"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>We've Received Your Message</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #16a863; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 30px; background: #f9f9f9; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Thank You, {name}!</h1>
                </div>
                <div class="content">
                    <p>We've received your message and will respond within 24 hours.</p>
                    <p>In the meantime, you can:</p>
                    <ul>
                        <li>Visit our <a href="http://localhost:5173/faq">FAQ page</a></li>
                        <li>Check out our <a href="http://localhost:5173/patients">patient resources</a></li>
                    </ul>
                    <p>Best regards,<br><strong>The AfyaLink Team</strong></p>
                </div>
            </div>
        </body>
        </html>
        """
        return await self.send_email(email, "We've Received Your Message - AfyaLink", html_content)

    # ============ Payment Receipt Email ============

    async def send_payment_receipt(self, email: str, patient_name: str, amount: float, receipt_number: str, date: str) -> bool:
        """Send payment receipt to patient"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Payment Receipt</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #16a863; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background: #f9f9f9; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Payment Receipt</h1>
                </div>
                <div class="content">
                    <p>Dear {patient_name},</p>
                    <p>Thank you for your payment.</p>
                    <p><strong>Amount:</strong> KES {amount:,.2f}</p>
                    <p><strong>Receipt Number:</strong> {receipt_number}</p>
                    <p><strong>Date:</strong> {date}</p>
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
    token = f"dummy_token_{user_id}"
    return await email_service.send_verification_email(email, user_id, token)

async def send_appointment_notification(email: str, appointment):
    return await email_service.send_appointment_notification(email, appointment)