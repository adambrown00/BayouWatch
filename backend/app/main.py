from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app import models
from app.routers import reports, alerts, auth, users # Import the routers

# Create database tables
Base.metadata.create_all(bind=engine)

# Create the FastAPI app
app = FastAPI(title="BayouWatch Flood Tracker")

# Configure CORS - allows frontnend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/users", tags=["users"])

# Simple health check endpoint (Just to verify the app is running correctly)
@app.get("/")
def read_root():
    return {"message": "BayouWatch API is running!", "status": "healthy"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
