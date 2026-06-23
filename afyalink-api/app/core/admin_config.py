from passlib.context import CryptContext
import os

# Admin preset password (change this to something secure)
# In production, store this in environment variables
ADMIN_PRESET_PASSWORD = os.getenv("ADMIN_PRESET_PASSWORD", "AdminMaster@2025")
ADMIN_EMAIL_DOMAIN = "@afyalink.com"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_admin_password(password: str) -> bool:
    """Verify admin preset password"""
    return password == ADMIN_PRESET_PASSWORD

def get_admin_password_hash() -> str:
    """Get hashed version of admin password for storage"""
    return pwd_context.hash(ADMIN_PRESET_PASSWORD)