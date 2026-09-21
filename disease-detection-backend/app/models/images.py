from pydantic import BaseModel, HttpUrl
from typing import Optional
from enum import Enum
from datetime import datetime

class CropType(str, Enum):
    wheat = "Wheat"
    cotton = "Cotton"

class ImageStatus(str, Enum):
    pending = "pending"        # uploaded but not processed
    processing = "processing"  # model is running
    completed = "completed"    # prediction done
    error = "error"            # failed to process


class ImageBase(BaseModel):
    userId: str                         # MongoDB ObjectId as string
    cropType: CropType
    imageUrl: str
    uploadedAt: datetime = datetime.utcnow()
    predictedDisease: Optional[str] = None
    confidence: Optional[float] = None
    status: ImageStatus = ImageStatus.pending

class ImageOut(ImageBase):
    id: str  # MongoDB _id
