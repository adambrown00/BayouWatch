from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import FloodReport, User, ReportStatus
from app.schemas import FloodReportCreate, FloodReportResponse
from app.auth import get_current_user, get_current_admin

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
                "username": report.user.username,
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
        status=ReportStatus.pending # New reports are listed as 'approved' by default (can add admin role later)
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

@router.get("/pending")
def get_pending_reports(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get all the pending flood reports awaiting admin approval.
    Only admins are able to access this endpoint.
    """
    reports = db.query(FloodReport)\
        .filter(FloodReport.status == "pending")\
        .order_by(FloodReport.created_at.desc())\
        .all()
    
    return {
        "reports": [
            {
                "id": report.id,
                "user_id": report.user_id,
                "username": report.user.username,
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

@router.put("/{report_id}/status")
def update_report_status(
    report_id: int,
    status: str,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Approve or reject a pending flood report.
    Only admins are able to access this endpoint.
    """
    
    # Validate status
    if status not in ["approved", "rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be either 'approved' or 'rejected'"
        )
    
    # Get the report
    report = db.query(FloodReport).filter(FloodReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Update the status
    report.status = status
    db.commit()
    db.refresh(report)

    return {
        "id": report.id,
        "status": report.status.value,
        "message": f"Report {status} successfully."
    }