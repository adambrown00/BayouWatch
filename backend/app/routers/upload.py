from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from datetime import datetime

router = APIRouter()

# Directory to store uploaded photos
UPLOAD_DIR = "uploads/photos"

# Create the directory if it doesn't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-photo")
async def upload_photo(file: UploadFile = File(...)):
    """
    Upload a flood report photo.
    Returns the URL to access the uploaded photo.
    """
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename using timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"flood_{timestamp}.{file_extension}"
    
    # Save file to disk
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return the URL to access this photo
    photo_url = f"http://localhost:8000/uploads/photos/{unique_filename}"
    
    return {"photo_url": photo_url}