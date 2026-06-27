from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import ConfigDict, field_validator
import json
import os
import logging

try:
    from passlib.handlers.bcrypt import bcrypt
    # Safely truncate or encode the underlying byte strings
    bcrypt._calc_checksum = lambda secret, config: bcrypt._backend._hashpw(secret, config)
except Exception:
    logging.warning("Passlib bcrypt patch could not be applied.")
    
class Settings(BaseSettings):
    # Database
    DATABASE_URL: Optional[str] = None
    TEST_DATABASE_URL: Optional[str] = None 
    
    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def fix_postgres_driver_prefix(cls, v: Optional[str]) -> Optional[str]:
        if v and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v
    
    
    # Security
    SECRET_KEY: str = "becedb80ea9d0f5617b0933e83186531ef7f91d6e8ce08aa8c372b7cd16d9a3c"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 465
    SMTP_USER: str = "shisiawhitney215@gmail.com"
    SMTP_PASSWORD: str = "bnxynidwkcajqqua"
    SMTP_FROM: str = "noreply@afyalink.com"
        
    # M-Pesa
    MPESA_ENVIRONMENT: str = "sandbox"
    MPESA_CONSUMER_KEY: str = "ynr0QGt5EDAHkBafrJvyFWjFKqJTQrvTWwDTGlk7WwZO2QMz"
    MPESA_CONSUMER_SECRET: str = "YjnP6vnTkRbdGDkxEtY6lbFyThHhk9eA0xBvry4HqbKfHUZ2tRsaRXzJR6duN4Zj"
    MPESA_PASSKEY: str = "your-passkey"
    MPESA_SHORTCODE: str = "174379"
    MPESA_CALLBACK_URL: str = "https://your-domain.com/api/v1/payments/mpesa-callback"
    
    # Stripe
    STRIPE_SECRET_KEY: str = "sk_test_51Th3Ah5g17PE31PyClg8H6iGX9UmcK3kChsmrzULWDiAYq22mC3L2gAMZi4W8KjIY2cvKsFRmFMwFqcUKNOcM02c00lDdkyPrQ"
    STRIPE_WEBHOOK_SECRET: str = "mock"
    
    # App
    APP_NAME: str = "AfyaLink"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    CORS_ORIGINS: str = '["http://localhost:5173", "https://afyalink-ke.onrender.com"]'
    
    @property
    def cors_origins_list(self) -> List[str]:
        try:
            return json.loads(self.CORS_ORIGINS)
        except Exception:
            return ["http://localhost:5173", "https://afyalink-ke.onrender.com"]
    
    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )

settings = Settings()
