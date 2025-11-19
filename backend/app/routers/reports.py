from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import FloodReport

# Create a router for report-related endpoints
router = APIRouter()

@router.get("/")
def get_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    
    # Get all approved flood reports from the database
    reports = db.query(FloodReport)\
    .filter(FloodReport.status == "approved")\
    .order_by(FloodReport.created_at.desc())\
    .offset(skip)\
    .limit(limit)\
    .all()

    # Convert the SQL Alchemy objects into json for easier use on the frontend
    # Loop through each report and extract the relevant fields
    return {
        "reports": [
            {
                "id": report.id,
                "user_id": report.user_id,
                "latitude": report.latitude,
                "longitude": report.longitude,
                "severity": report.severity.value,
                "description": report.description,
                "photo_url": report.photo_url,
                "status": report.status.value,
                "created_at": report.created_at.isoformat()
            }
            for report in reports
        ]
    }