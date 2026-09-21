
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum

# Add this enum
class ReportStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    error = "error"

class ReportBase(BaseModel):
    userId: str
    imageId: str
    imageUrl: str 
    cropType: str
    predictedDisease: str
    confidence: float
    description: str
    symptoms: List[str]
    solutions: List[str]
    prevention: List[str]
    treatmentSteps: Optional[List[str]] = None
    preventiveGuidelines: Optional[List[str]] = None
    language: str = "en"
    status: ReportStatus = ReportStatus.completed
    diseaseKey: Optional[str] = None
    createdAt: datetime = datetime.utcnow()
    updatedAt: datetime = datetime.utcnow()

class ReportOut(ReportBase):
    id: str