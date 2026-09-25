"""Prediction endpoint.

Every model here is a stub from conftest: no TensorFlow, no CLIP download.
The point is the request contract and the failure paths, not model accuracy.
"""

from tests.conftest import COTTON_CLASSES, COTTON_PREDICTED_INDEX, WHEAT_CLASSES, WHEAT_PREDICTED_INDEX

ENDPOINT = "/predict/predict-disease/"


def post_image(client, png, crop_type="cotton", user_id="507f1f77bcf86cd799439011",
               filename="leaf.png", content_type="image/png", locale="en"):
    data = {"locale": locale}
    if crop_type is not None:
        data["cropType"] = crop_type
    if user_id is not None:
        data["userId"] = user_id
    return client.post(
        ENDPOINT,
        data=data,
        files={"file": (filename, png, content_type)},
    )


def test_valid_cotton_image_returns_prediction(client, png_bytes):
    res = post_image(client, png_bytes, crop_type="cotton")

    assert res.status_code == 200, res.text
    body = res.json()
    assert body["status"] == "success"
    assert body["crop"] == "Cotton"
    # The stub pins argmax, so the label is deterministic.
    assert body["predictedDisease"] == COTTON_CLASSES[str(COTTON_PREDICTED_INDEX)]
    assert 0 < body["confidence"] <= 100
    assert body["is_healthy"] is False


def test_valid_wheat_image_returns_prediction(client, png_bytes):
    res = post_image(client, png_bytes, crop_type="wheat")

    assert res.status_code == 200, res.text
    body = res.json()
    assert body["crop"] == "Wheat"
    assert body["predictedDisease"] == WHEAT_CLASSES[str(WHEAT_PREDICTED_INDEX)]


def test_crop_type_is_case_insensitive(client, png_bytes):
    res = post_image(client, png_bytes, crop_type="CoTToN")

    assert res.status_code == 200, res.text
    assert res.json()["crop"] == "Cotton"


def test_unknown_crop_type_is_rejected(client, png_bytes):
    res = post_image(client, png_bytes, crop_type="rice")

    assert res.status_code == 400
    assert "cotton" in res.json()["detail"].lower()


def test_missing_crop_type_is_rejected(client, png_bytes):
    res = post_image(client, png_bytes, crop_type=None)

    # cropType is a required Form field, so FastAPI rejects before the handler.
    assert res.status_code == 422


def test_non_image_file_is_rejected(client):
    res = client.post(
        ENDPOINT,
        data={"cropType": "cotton", "userId": "507f1f77bcf86cd799439011", "locale": "en"},
        files={"file": ("notes.txt", b"this is plain text, not an image", "text/plain")},
    )

    assert res.status_code == 400
    assert "image" in res.json()["detail"].lower()


def test_empty_file_is_rejected(client):
    res = client.post(
        ENDPOINT,
        data={"cropType": "cotton", "userId": "507f1f77bcf86cd799439011", "locale": "en"},
        files={"file": ("empty.png", b"", "image/png")},
    )

    assert res.status_code == 400
    assert "empty" in res.json()["detail"].lower()


def test_corrupted_image_does_not_500_silently(client):
    """Bytes that claim to be a PNG but are not decodable."""
    res = client.post(
        ENDPOINT,
        data={"cropType": "cotton", "userId": "507f1f77bcf86cd799439011", "locale": "en"},
        files={"file": ("broken.png", b"\x89PNG\r\n\x1a\n" + b"\x00" * 40, "image/png")},
    )

    # The handler wraps decode failures; what matters is that it is reported as
    # an error rather than being treated as a successful prediction.
    assert res.status_code in (400, 500)
    assert res.json().get("status") != "success"


def test_cotton_requires_a_user_id(client, png_bytes):
    res = post_image(client, png_bytes, crop_type="cotton", user_id=None)

    assert res.status_code in (400, 422)


def test_image_of_the_wrong_subject_is_reported_not_predicted(
    client, png_bytes, reject_crop_images
):
    """When the CLIP validator rejects the photo, no prediction is returned."""
    res = post_image(client, png_bytes, crop_type="cotton")

    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "validation_failed"
    assert "predictedDisease" not in body
