
from fastapi import APIRouter, HTTPException
from bson import ObjectId
from collections import Counter
from typing import List, Dict
from app.models.reports import ReportOut
from app.db.mongo import reports_collection, images_collection

BASE_URL = "http://localhost:8000"  # adjust to your server

router = APIRouter(prefix="/reports", tags=["reports"])

# Helper to convert MongoDB report to ReportOut with image URL
async def report_helper(report_doc):
    if not report_doc:
        return None

    # Fetch image using imageId from reports
    image_doc = await images_collection.find_one({"_id": ObjectId(report_doc["imageId"])})

    # Build full URL if image exists
    image_url = None
    if image_doc and "imageUrl" in image_doc:
        relative_path = image_doc["imageUrl"]
        image_url = relative_path if relative_path.startswith("http") else f"{BASE_URL}{relative_path}"

    return ReportOut(
        id=str(report_doc.get("_id")),
        userId=report_doc.get("userId"),
        imageId=report_doc.get("imageId"),
        imageUrl=image_url,
        cropType=report_doc.get("cropType"),
        predictedDisease=report_doc.get("predictedDisease"),
        confidence=report_doc.get("confidence"),
        description=report_doc.get("description"),
        symptoms=report_doc.get("symptoms") or [],
        solutions=report_doc.get("solutions") or [],
        prevention=report_doc.get("prevention") or [],
        treatmentSteps=report_doc.get("treatmentSteps"),
        preventiveGuidelines=report_doc.get("preventiveGuidelines"),
        createdAt=report_doc.get("createdAt"),
        status=report_doc.get("status"),
    )


# Get single report by report_id
@router.get("/{report_id}", response_model=ReportOut)
async def get_report_by_id(report_id: str):
    try:
        report_doc = await reports_collection.find_one({"_id": ObjectId(report_id)})
        if not report_doc:
            raise HTTPException(status_code=404, detail="Report not found")
        return await report_helper(report_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch report: {str(e)}")


@router.get("/user/{user_id}")
async def get_reports_by_user(user_id: str):
    try:
        reports_cursor = reports_collection.find({"userId": user_id})
        reports = []
        crop_counts = Counter()
        disease_counts = Counter()
        
        async for report_doc in reports_cursor:
            report = await report_helper(report_doc)
            reports.append(report)
            
            # Count crop type
            crop_counts[report.cropType] += 1
            
            # Count disease
            disease_counts[report.predictedDisease] += 1
        
        return {
            "reports": reports,
            "cropCounts": dict(crop_counts),
            "diseaseCounts": dict(disease_counts),
            "totalReports": len(reports)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch user reports: {str(e)}")
