from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import OfficialAlert

# Create router for alert-related endpoints
router = APIRouter()

@router.get("/")
def get_alerts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Get all active official alerts from database
    alerts = db.query(OfficialAlert)\
        .filter(OfficialAlert.is_active == 1)\
        .order_by(OfficialAlert.issued_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    # Convert models to JSON
    return {
        "alerts": [
            {
                "id": alert.id,
                "title": alert.title,
                "description": alert.description,
                "severity": alert.severity.value,  # ← .value converts Enum to string
                "area_affected": alert.area_affected,
                "issued_at": alert.issued_at.isoformat(),
                # If expires_at is NULL, return None, otherwise convert to string
                "expires_at": alert.expires_at.isoformat() if alert.expires_at else None,
                "is_active": alert.is_active
            }
            for alert in alerts
        ]
    }