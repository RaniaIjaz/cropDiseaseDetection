import os

from fastapi import FastAPI
from app.auth.auth import auth_router
from app.routes.model_routes import router as model_router
from app.routes.wheat_routes import router as wheat_router
from app.routes.reports_routes import router as reports_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="FastAPI Auth System with MongoDB")

# Local dev origins plus any deployed frontends, e.g.
# ALLOWED_ORIGINS="https://agridoctor.vercel.app,https://www.example.com"
origins = ["http://localhost:3000", "http://localhost:3001"] + [
    o.strip().rstrip("/") for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()
]
# Optional regex for preview deployments, e.g. r"https://.*\.vercel\.app"
origin_regex = os.getenv("ALLOWED_ORIGIN_REGEX") or None

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hosted containers start from a clean filesystem, where uploads/ may not exist.
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.include_router(auth_router)
app.include_router(model_router)
app.include_router(reports_router)
app.include_router(wheat_router)


