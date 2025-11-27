from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import FloodReport, User, ReportStatus
from app.schemas import FloodReportCreate, FloodReportResponse
from app.auth import get_current_user

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

@router.post("/", response_model=FloodReportResponse)
def create_report(
    report: FloodReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new flood report; requires authentication.
    """

    db_report = FloodReport(
        user_id=current_user.id,
        latitude=report.latitude,
        longitude=report.longitude,
        severity=report.severity,
        description=report.description,
        photo_url=report.photo_url,
        status=ReportStatus.approved # New reports are listed as 'approved' by default (can add admin role later)
    )
    try:
        db.add(db_report)
        db.commit()
        db.refresh(db_report) # Get the created report with ID
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating report"
        )

    return db_report