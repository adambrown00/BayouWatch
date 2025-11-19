import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
import os
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User

load_dotenv()

# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")

if SECRET_KEY == "dev-secret-key":
    print("WARNING: Using default secret key. This is insecure for production!")

ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# PASSWORD FUNCTIONS (using bcrypt directly)

def hash_password(password: str) -> str:
    """
    Convert plain text password to bcrypt hash
    Example: "mypassword123" → "$2b$12$KIXqZ7g8h3JvF2n..."
    """
    # Convert string to bytes
    password_bytes = password.encode('utf-8')
    # Generate salt and hash
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    # Return as string
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Check if plain password matches the hashed password
    Returns True if match, False if not
    """
    try:
        # Convert both to bytes
        password_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        # Check if they match
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception as e:
        print(f"Error verifying password: {e}")
        return False

# JWT TOKEN FUNCTIONS
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT token with user data
    
    Args:
        data: Usually {"sub": user_email}
        expires_delta: How long token is valid (default: 30 min)
    
    Returns:
        JWT token string
    """
    # Make a copy so we don't modify the original
    to_encode = data.copy()
    
    # Set expiration time
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # Add expiration to token data
    to_encode.update({"exp": expire})
    
    # Create the token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# OAuth2 scheme for FastAPI
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Extracts and validates the current user from the JWT token.
    Returns the current user.
    This will be used as a dependency in protected routes.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try: 
        # Decode the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")

        if user_id is None:
            raise credentials_exception
        
        # Get the user from the database
        user = db.query(User).filter(User.id == user_id).first()

        if user is None:
            raise credentials_exception
        
        return user
    
    except JWTError:
        raise credentials_exception
                             