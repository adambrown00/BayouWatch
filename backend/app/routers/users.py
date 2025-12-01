from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import FloodReport, User
from app.schemas import UserResponse, UserUpdate
from app.auth import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the authenticated user's profile info
    Requires the JWT token
    """

    # Count user's reports by severity
    total_reports = db.query(FloodReport).filter(FloodReport.user_id == current_user.id).count()
    severe_reports = db.query(FloodReport).filter(
        FloodReport.user_id == current_user.id,
        FloodReport.severity == "severe"
    ).count()
    moderate_reports = db.query(FloodReport).filter(
        FloodReport.user_id == current_user.id,
        FloodReport.severity == "moderate"
    ).count()
    minor_reports = db.query(FloodReport).filter(
        FloodReport.user_id == current_user.id,
        FloodReport.severity == "minor"
    ).count()

    # Get the user's most recent reports (up to 5)
    recent_reports = db.query(FloodReport)\
        .filter(FloodReport.user_id == current_user.id)\
        .order_by(FloodReport.created_at.desc())\
        .limit(5)\
        .all()

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "created_at": current_user.created_at,
        "role": current_user.role,
        "stats": {
            "total_reports": total_reports,
            "severe_reports": severe_reports,
            "moderate_reports": moderate_reports,
            "minor_reports": minor_reports
        },
        "recent_reports": [
            {
                "id": report.id,
                "severity": report.severity.value,
                "description": report.description,
                "created_at": report.created_at.isoformat(),
                "latitude": report.latitude,
                "longitude": report.longitude
            }
            for report in recent_reports
        ]
    }

@router.put("/me", response_model=UserResponse)
def update_user_profile(
    updates: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update the authenticated user's profile info
    Allows changing username and email
    """

    # Check if the new email is already taken by another user
    if updates.email != current_user.email:
        existing_user = db.query(User).filter(User.email == updates.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
    # Check if the new username is already taken by another user
    if updates.username != current_user.username:
        existing_user = db.query(User).filter(User.username == updates.username).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already in use"
            )

    # If not in use, update the fields
    current_user.email = updates.email
    current_user.username = updates.username
    db.commit()
    db.refresh(current_user)

    return current_user