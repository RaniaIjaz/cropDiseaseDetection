from fastapi import FastAPI
from app.auth.auth import auth_router
from app.routes.model_routes import router as model_router
from app.routes.wheat_routes import router as wheat_router
from app.routes.reports_routes import router as reports_router
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image
import numpy as np
import io
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="FastAPI Auth System with MongoDB")

origins = [
    "http://localhost:3000", "http://localhost:3001"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.include_router(auth_router)
app.include_router(model_router)
app.include_router(reports_router)
app.include_router(wheat_router)


