from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from app.models import SeverityLevel, ReportStatus

# What the frontend sends when logging in
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# What the backend returns after a successful login attempt
class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserResponse"

# What the backend returns for user information
class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime

# What the frontend sends when creating a flood report
class FloodReportCreate(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    severity: SeverityLevel
    description: Optional[str] = None
    photo_url: Optional[str] = None

# What the backend returns after creating a flood report
class FloodReportResponse(BaseModel):
    id: int
    user_id: int
    latitude: float
    longitude: float
    severity: SeverityLevel
    description: Optional[str] = None
    photo_url: Optional[str] = None
    status: ReportStatus
    created_at: datetime

    class Config:
        from_attributes = True # Allows for the conversion from SQLAlchemy models