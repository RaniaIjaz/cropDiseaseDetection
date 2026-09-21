import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("❌ MONGO_URI not set in .env file")

# Connect to MongoDB Atlas
client = AsyncIOMotorClient(MONGO_URI)

# Select your database
db = client["DiseaseDetection"]

# Collections
users_collection = db["users"]
diseases_collection = db["diseases"]  
reports_collection = db["reports"] 
images_collection = db["images"]



print("✅ Connected to MongoDB:", db.name)
