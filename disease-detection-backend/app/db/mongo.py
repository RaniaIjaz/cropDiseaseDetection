import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI not set in .env file")

# Connect to MongoDB Atlas
client = AsyncIOMotorClient(MONGO_URI)

# Select your database
db = client["DiseaseDetection"]

# Collections
users_collection = db["users"]
diseases_collection = db["diseases"]  
reports_collection = db["reports"] 
images_collection = db["images"]



# Plain ASCII: when stdout is a redirected pipe on Windows it falls back to the
# cp1252 locale encoding, and a non-ASCII character here raises
# UnicodeEncodeError at import time — killing the server before it can bind.
print("[db] Using MongoDB database:", db.name)
