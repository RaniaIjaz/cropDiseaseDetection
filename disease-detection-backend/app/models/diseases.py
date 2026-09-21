
from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict
from enum import Enum
from datetime import datetime

class Language(str, Enum):
    en = "en"
    ur = "ur"

class CropType(str, Enum):
    wheat = "Wheat"
    cotton = "Cotton"

class DiseaseTranslation(BaseModel):
    diseaseName: str
    description: str
    symptoms: List[str]
    solutions: List[str]
    prevention: List[str]
    treatmentSteps: Optional[List[str]] = None
    preventiveGuidelines: Optional[List[str]] = None

class DiseaseBase(BaseModel):
    diseaseKey: str  # Unique identifier e.g., "wheat_brown_rust", "cotton_bacterial_blight"
    cropType: CropType
    translations: Dict[str, DiseaseTranslation]  # {"en": {...}, "ur": {...}}
    
    
    createdAt: datetime = datetime.utcnow()
    updatedAt: datetime = datetime.utcnow()

class DiseaseOut(DiseaseBase):
    id: str