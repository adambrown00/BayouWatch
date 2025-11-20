from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserLogin, Token, UserCreate, UserResponse
from app.auth import hash_password, verify_password, create_access_token
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

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account
    No authentication required"""

    # Check if email is already in use
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username is already in use
    existing_user = db.query(User).filter(User.username == user_data.username).first
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Hash the password
    hashed_password = hash_password(user_data.password)

    # Create the new user
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)  

    # Return the created user (without password)
    return new_user
