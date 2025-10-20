from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="BayouWatch API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "BayouWatch API is running!", "status": "healthy"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Mock endpoint - just to show it works
@app.get("/api/reports")
def get_reports():
    return {
        "reports": [
            {
                "id": 1,
                "latitude": 30.4515,
                "longitude": -91.1871,
                "severity": "moderate",
                "description": "Water rising on Highland Road near LSU",
                "created_at": "2025-10-20T14:30:00Z"
            },
            {
                "id": 2,
                "latitude": 30.4583,
                "longitude": -91.1403,
                "severity": "severe",
                "description": "Flooded intersection at College and Nicholson",
                "created_at": "2025-10-20T15:45:00Z"
            },
            {
                "id": 3,
                "latitude": 30.4280,
                "longitude": -91.1825,
                "severity": "minor",
                "description": "Puddles forming on Perkins Road",
                "created_at": "2025-10-20T16:00:00Z"
            }
        ]
    }