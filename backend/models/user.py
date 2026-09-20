from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    """Steam login request model"""
    steam_id: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "steam_id": "76561198000000000"
            }
        }

class UserSchema(BaseModel):
    """User model for tracking"""
    steam_id: str
    username: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "steam_id": "76561198000000000",
                "username": "Shii-000"
            }
        }

class UserResponse(BaseModel):
    """User info response"""
    username: str
    steam_id: str
    account_created: str