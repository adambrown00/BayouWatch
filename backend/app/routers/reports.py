from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import FloodReport, ReportStatus
from app.schemas import FloodReportCreate, FloodReportResponse

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
    db: Session = Depends(get_db)
):
    # TODO: Get user_id from JWT token after authentication is implemented
    # For now a hardcoded user_id = 1 is used

    db_report = FloodReport(
        user_id=1,
        latitude=report.latitude,
        longitude=report.longitude,
        severity=report.severity,
        description=report.description,
        photo_url=report.photo_url,
        status=ReportStatus.pending # New reports are listed as 'pending' by default
    )

    db.add(db_report)
    db.commit()
    db.refresh(db_report) # Get the created report with ID

    return db_report