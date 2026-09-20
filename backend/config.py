import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

class Config:
    """Application Configuration"""
    
    # Database Configuration
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/skiniify")
    
    # Redis Configuration (for caching price data)
    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
    
    # Steam API Configuration
    STEAM_WEB_API_KEY = os.getenv("STEAM_WEB_API_KEY", "")  # Free key from steamcommunity.com/dev/apikey
    
    # CORS Configuration (for frontend access)
    ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    
    # JWT Token Settings
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    
    # App Settings
    API_V1_PREFIX = "/api/v1"
    PROJECT_NAME = "Skiniify"
    
    def get_database_url(self):
        return self.DATABASE_URL