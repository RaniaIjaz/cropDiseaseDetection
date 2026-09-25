"""Shared test fixtures.

Two things have to happen before ``app`` is imported at all:

1. ``app/db/mongo.py`` builds an ``AsyncIOMotorClient`` at module scope, so the
   motor class is swapped for ``mongomock_motor`` first. No MongoDB required.
2. The app reads config from the environment at import time, so placeholder
   values are set here rather than relying on a ``.env`` being present in CI.

TensorFlow, torch and transformers are never imported: the app defers those to
its loader functions, and the loaders are stubbed out below.
"""

import asyncio
import os
import sys
from pathlib import Path

import pytest

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

# --- 1. placeholder config -------------------------------------------------
os.environ.setdefault("MONGO_URI", "mongodb://localhost:27017/test")
os.environ.setdefault("JWT_SECRET", "test-secret-not-a-real-key")
os.environ.setdefault("JWT_ALGORITHM", "HS256")
os.environ.setdefault("BASE_URL", "http://testserver")
os.environ.setdefault("GEMINI_API_KEY", "test-key")
os.environ.setdefault("MAIL_USERNAME", "test@example.com")
os.environ.setdefault("MAIL_PASSWORD", "test-password")
os.environ.setdefault("MAIL_FROM", "test@example.com")
os.environ.setdefault("MAIL_SERVER", "smtp.example.com")
os.environ.setdefault("MAIL_PORT", "587")

# --- 2. in-memory MongoDB --------------------------------------------------
import motor.motor_asyncio  # noqa: E402
from mongomock_motor import AsyncMongoMockClient  # noqa: E402

motor.motor_asyncio.AsyncIOMotorClient = AsyncMongoMockClient

# `uploads/` is written to by the prediction endpoints.
(BACKEND_ROOT / "uploads").mkdir(exist_ok=True)

from fastapi.testclient import TestClient  # noqa: E402

from app.db import mongo as mongo_module  # noqa: E402
from app.routes import model_routes  # noqa: E402
from app.routes import wheat_routes  # noqa: E402
from app.main import app  # noqa: E402


class FakeModel:
    """Stand-in for a Keras model.

    Returns a fixed probability vector so assertions are deterministic; the
    argmax is pinned to ``predicted_index``.
    """

    def __init__(self, num_classes: int, predicted_index: int):
        self.num_classes = num_classes
        self.predicted_index = predicted_index
        self.input_shape = (None, 224, 224, 3)
        self.output_shape = (None, num_classes)

    def predict(self, _processed_image, verbose=0):
        import numpy as np

        probs = np.full((1, self.num_classes), 0.01, dtype="float32")
        probs[0, self.predicted_index] = 0.9
        return probs


COTTON_CLASSES = {
    "0": "Bacterial Blight",
    "1": "Curl Virus",
    "2": "Healthy Leaf",
    "3": "Herbicide Growth Damage",
    "4": "Leaf Hopper Jassids",
    "5": "Leaf Redding",
    "6": "Leaf Variegation",
}

WHEAT_CLASSES = {
    "0": "Aphid",
    "1": "Black Rust",
    "2": "Blast",
    "3": "Brown Rust",
    "4": "Common Root Rot",
    "5": "Fusarium Head Blight",
    "6": "Healthy",
    "7": "Leaf Blight",
    "8": "Mildew",
    "9": "Mite",
    "10": "Septoria",
    "11": "Smut",
    "12": "Stem fly",
    "13": "Tan spot",
    "14": "Yellow Rust",
}

COTTON_PREDICTED_INDEX = 5  # "Leaf Redding"
WHEAT_PREDICTED_INDEX = 11  # "Smut"


@pytest.fixture(autouse=True)
def stub_models(monkeypatch):
    """Replace every real model with a fake, and neuter the loaders.

    Without this the startup events would try to read the `.keras` files and
    download the CLIP weights.
    """
    cotton = FakeModel(len(COTTON_CLASSES), COTTON_PREDICTED_INDEX)
    wheat = FakeModel(len(WHEAT_CLASSES), WHEAT_PREDICTED_INDEX)

    monkeypatch.setattr(model_routes, "cotton_model", cotton, raising=False)
    monkeypatch.setattr(model_routes, "cotton_model2", cotton, raising=False)
    monkeypatch.setattr(model_routes, "wheat_model", wheat, raising=False)
    monkeypatch.setattr(model_routes, "class_indices", COTTON_CLASSES, raising=False)
    monkeypatch.setattr(model_routes, "wheat_class_indices", WHEAT_CLASSES, raising=False)
    monkeypatch.setattr(model_routes, "clip_model", object(), raising=False)
    monkeypatch.setattr(model_routes, "clip_processor", object(), raising=False)

    monkeypatch.setattr(model_routes, "load_model_and_classes", lambda: None)
    monkeypatch.setattr(model_routes, "load_clip_model", lambda: None)
    monkeypatch.setattr(wheat_routes, "load_model_and_classes", lambda: None)

    # The CLIP crop validator is an async call into torch; accept everything by
    # default. `reject_crop_images` below flips it for the negative case.
    async def _accept(_img_bytes, _crop_type):
        return True

    monkeypatch.setattr(model_routes, "is_valid_crop_image", _accept)

    yield


@pytest.fixture
def reject_crop_images(monkeypatch):
    """Make the CLIP validator reject the image (wrong-subject photo)."""

    async def _reject(_img_bytes, _crop_type):
        return False

    monkeypatch.setattr(model_routes, "is_valid_crop_image", _reject)


@pytest.fixture(autouse=True)
def clean_db():
    """Drop every collection between tests so they cannot bleed into each other."""

    async def _drop():
        for collection in ("users", "reports", "images", "diseases"):
            await mongo_module.db[collection].delete_many({})

    asyncio.get_event_loop_policy().new_event_loop().run_until_complete(_drop())
    yield


def _disease_doc(disease_key, crop_type, name):
    """A `diseases` document in the shape get_translation() expects."""
    return {
        "diseaseKey": disease_key,
        "cropType": crop_type,
        "translations": {
            "en": {
                "diseaseName": name,
                "description": f"{name} description in English.",
                "symptoms": ["spots on leaves", "yellowing"],
                "solutions": ["apply the recommended fungicide"],
                "prevention": ["rotate crops"],
                "treatmentSteps": ["remove infected debris"],
                "preventiveGuidelines": ["scout fields weekly"],
            },
            "ur": {
                "diseaseName": f"{name} (ur)",
                "description": f"{name} description in Urdu.",
                "symptoms": ["symptom-ur"],
                "solutions": ["solution-ur"],
                "prevention": ["prevention-ur"],
                "treatmentSteps": ["step-ur"],
                "preventiveGuidelines": ["guideline-ur"],
            },
        },
    }


@pytest.fixture(autouse=True)
def seed_diseases():
    """The prediction handlers resolve the disease name from Mongo, not from the
    class map, so the lookup rows have to exist for a prediction to be named."""
    docs = [
        _disease_doc(
            COTTON_CLASSES[str(COTTON_PREDICTED_INDEX)].replace(" ", "_").lower(),
            "Cotton",
            COTTON_CLASSES[str(COTTON_PREDICTED_INDEX)],
        ),
        _disease_doc(
            WHEAT_CLASSES[str(WHEAT_PREDICTED_INDEX)].replace(" ", "_").lower(),
            "Wheat",
            WHEAT_CLASSES[str(WHEAT_PREDICTED_INDEX)],
        ),
    ]

    async def _insert():
        await mongo_module.db["diseases"].insert_many(docs)

    asyncio.get_event_loop_policy().new_event_loop().run_until_complete(_insert())
    yield


@pytest.fixture
def client():
    """TestClient without triggering lifespan startup (models are stubbed)."""
    return TestClient(app)


@pytest.fixture
def png_bytes():
    """A tiny valid PNG."""
    import io

    from PIL import Image

    buf = io.BytesIO()
    Image.new("RGB", (32, 32), (60, 140, 90)).save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def unique_email():
    import uuid

    return f"user-{uuid.uuid4().hex[:10]}@example.com"
