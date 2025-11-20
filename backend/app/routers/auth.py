from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserLogin, Token
from app.auth import verify_password, create_access_token
from datetime import timedelta

# Create router for authentication endpoints
router = APIRouter()

@router.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login endpoint - verifies email/password and returns JWT token
    
    Steps/Process:
        1) Look up user by email
        2) Verify password
        3) Generate JWT token
        4) Return token + user information
    """

    # 1) Look up the user by email; query the users table WHERE email = user_credentials.email
    user = db.query(User)\
        .filter(User.email == user_credentials.email)\
        .first()
    
    # 2) Check if user exists
    if not user:
        # user not found - return 401 status code (unauthorized)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # 3) Verify password; compare the plain password with hashed password in the database
    if not verify_password(user_credentials.password, user.hashed_password):
        # Password doesn't match, return 401 error
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # 4) Generate the JWT token; token contains the user's email (the "subject")
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=30)
    )

    # Return token and user info
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

