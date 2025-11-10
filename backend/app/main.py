from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app import models

# Create database tables
Base.metadata.create_all(bind=engine)

# Create the FastAPI app
app = FastAPI(title="BayouWatch Flood Tracker")

# Configure CORS - allows frontnend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple health check endpoint (Just to verify the app is running correctly)
@app.get("/")
def read_root():
    return {"message": "BayouWatch API is running!", "status": "healthy"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/reports")
def get_mock_reports():
    return {
        "reports": [
            {
                "id": 1,
                "latitude": 30.4515,
                "longitude": -91.1871,
                "severity": "moderate",
                "description": "Water rising on Highland Road near LSU",
                "created_at": "2024-11-01T14:30:00Z"
            },
            {
                "id": 2,
                "latitude": 30.4583,
                "longitude": -91.1403,
                "severity": "severe",
                "description": "Flooded intersection at College and Nicholson",
                "created_at": "2024-11-01T15:45:00Z"
            }
        ]
    }