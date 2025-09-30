from fastapi import FastAPI
from app.database import engine, Base

# Create the FastAPI app
app = FastAPI(title="BayouWatch Flood Tracker")

# Simple health check endpoint (Just to verify the app is running correctly)
@app.get("/")
def read_root():
    return {"message": "BayouWatch API is running!"}

