from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import ConfigDict
import json

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    TEST_DATABASE_URL: Optional[str] = None
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Email
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=465
    SMTP_USER=shisiawhitney215@gmail.com
    SMTP_PASSWORD=bnxynidwkcajqqua
    SMTP_FROM=noreply@afyalink.com
        
    # M-Pesa
    MPESA_ENVIRONMENT=sandbox
    MPESA_CONSUMER_KEY=ynr0QGt5EDAHkBafrJvyFWjFKqJTQrvTWwDTGlk7WwZO2QMz
    MPESA_CONSUMER_SECRET=YjnP6vnTkRbdGDkxEtY6lbFyThHhk9eA0xBvry4HqbKfHUZ2tRsaRXzJR6duN4Zj
    MPESA_PASSKEY=your-passkey
    MPESA_SHORTCODE=174379
    MPESA_CALLBACK_URL=https://your-domain.com/api/v1/payments/mpesa-callback

    
    # Stripe
    STRIPE_SECRET_KEY=sk_test_51Th3Ah5g17PE31PyClg8H6iGX9UmcK3kChsmrzULWDiAYq22mC3L2gAMZi4W8KjIY2cvKsFRmFMwFqcUKNOcM02c00lDdkyPrQ
    STRIPE_WEBHOOK_SECRET=mock
    
    # Cloudinary
    # CLOUDINARY_CLOUD_NAME: str
    # CLOUDINARY_API_KEY: str
    # CLOUDINARY_API_SECRET: str
    
    # App
    APP_NAME: str = "AfyaLink"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    CORS_ORIGINS: str = '["http://localhost:5173"]'
    
    @property
    def cors_origins_list(self) -> List[str]:
        return json.loads(self.CORS_ORIGINS)
    
    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )

settings = Settings()