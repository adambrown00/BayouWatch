from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

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

    class Config:
        from_attributes = True # Allows for the conversion from SQLAlchemy models