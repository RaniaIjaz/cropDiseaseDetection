"""Report retrieval: one report by id, and a user's list with its tallies."""

import datetime

import pytest
from bson import ObjectId

from app.db import mongo as mongo_module

USER_ID = "507f1f77bcf86cd799439011"
OTHER_USER_ID = "507f1f77bcf86cd799439099"


async def seed_report(crop_type="Cotton", disease="Leaf Redding", user_id=USER_ID):
    """Insert a linked image + report pair and return the report id."""
    image_result = await mongo_module.db["images"].insert_one(
        {
            "userId": user_id,
            "cropType": crop_type,
            "imageUrl": "/uploads/seeded.png",
            "status": "processed",
        }
    )
    report_result = await mongo_module.db["reports"].insert_one(
        {
            "userId": user_id,
            "imageId": str(image_result.inserted_id),
            "cropType": crop_type,
            "predictedDisease": disease,
            "confidence": 91.5,
            "description": f"{disease} description",
            "symptoms": ["spots", "yellowing"],
            "solutions": ["apply fungicide"],
            "prevention": ["rotate crops"],
            "treatmentSteps": ["step one"],
            "preventiveGuidelines": ["scout weekly"],
            "createdAt": datetime.datetime.now(datetime.timezone.utc),
            "status": "completed",
        }
    )
    return str(report_result.inserted_id)


@pytest.mark.asyncio
async def test_fetch_single_report_by_id(client):
    report_id = await seed_report()

    res = client.get(f"/reports/{report_id}")

    assert res.status_code == 200, res.text
    body = res.json()
    assert body["id"] == report_id
    assert body["cropType"] == "Cotton"
    assert body["predictedDisease"] == "Leaf Redding"
    assert body["symptoms"] == ["spots", "yellowing"]
    # report_helper joins the image and builds an absolute URL.
    assert body["imageUrl"].endswith("/uploads/seeded.png")


@pytest.mark.asyncio
async def test_missing_report_returns_404(client):
    res = client.get(f"/reports/{ObjectId()}")

    assert res.status_code == 404


def test_malformed_report_id_is_an_error_not_a_crash(client):
    res = client.get("/reports/this-is-not-an-objectid")

    assert res.status_code in (400, 404, 500)


@pytest.mark.asyncio
async def test_user_report_list_includes_tallies(client):
    await seed_report(crop_type="Cotton", disease="Leaf Redding")
    await seed_report(crop_type="Cotton", disease="Leaf Redding")
    await seed_report(crop_type="Wheat", disease="Smut")
    # Belongs to someone else; must not appear.
    await seed_report(crop_type="Wheat", disease="Mildew", user_id=OTHER_USER_ID)

    res = client.get(f"/reports/user/{USER_ID}")

    assert res.status_code == 200, res.text
    body = res.json()
    assert body["totalReports"] == 3
    assert len(body["reports"]) == 3
    assert body["cropCounts"] == {"Cotton": 2, "Wheat": 1}
    assert body["diseaseCounts"] == {"Leaf Redding": 2, "Smut": 1}


def test_user_with_no_reports_gets_empty_payload(client):
    res = client.get(f"/reports/user/{OTHER_USER_ID}")

    assert res.status_code == 200
    body = res.json()
    assert body["totalReports"] == 0
    assert body["reports"] == []
    assert body["cropCounts"] == {}
    assert body["diseaseCounts"] == {}
