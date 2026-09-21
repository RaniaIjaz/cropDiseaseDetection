

import asyncio
from pydantic import ValidationError
from app.models.diseases import DiseaseBase
from app.data.data import cotton_diseases_data
from app.db.mongo import diseases_collection
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def upload_to_mongodb():
    """Upload all disease data to MongoDB"""
    # Connect to MongoDB (connection is already handled by diseases_collection import)
    
    # Clear existing data (optional)
    await diseases_collection.delete_many({})
    logger.info("Cleared existing data")
    
    # Validate and prepare data
    validated_data = []
    
    for disease in cotton_diseases_data:
        try:
            # Convert CropType strings to Enum values
            if isinstance(disease["cropType"], str):
                disease["cropType"] = disease["cropType"]
            
            # Validate using Pydantic model
            disease_dict = DiseaseBase(**disease).dict()
            
            # Add timestamps
            disease_dict["createdAt"] = datetime.utcnow()
            disease_dict["updatedAt"] = datetime.utcnow()
            
            # Convert CropType back to string for MongoDB storage
            if hasattr(disease_dict["cropType"], "value"):
                disease_dict["cropType"] = disease_dict["cropType"].value
            
            validated_data.append(disease_dict)
            logger.info(f"Validated: {disease_dict['diseaseName']}")
            
        except ValidationError as e:
            logger.error(f"Validation error for {disease.get('diseaseName', 'Unknown')}: {e}")
        except Exception as e:
            logger.error(f"Error processing {disease.get('diseaseName', 'Unknown')}: {e}")
    
    if validated_data:
        try:
            # Insert validated data
            result = await diseases_collection.insert_many(validated_data)
            logger.info(f"Successfully uploaded {len(result.inserted_ids)} diseases to MongoDB")
            
            # Verify count
            count = await diseases_collection.count_documents({})
            logger.info(f"Total documents in collection: {count}")
            
        except Exception as e:
            logger.error(f"Error uploading data to MongoDB: {str(e)}")
    else:
        logger.error("No valid data to insert")

async def verify_data():
    """Verify the uploaded data"""
    # Get all diseases
    diseases = await diseases_collection.find().to_list(length=None)
    
    logger.info(f"Found {len(diseases)} diseases in database")
    
    # Print sample
    if diseases:
        sample = diseases[0]
        logger.info(f"Sample disease: {sample.get('diseaseKey', 'Unknown')}")
        
        # Check structure
        if 'translations' in sample:
            logger.info(f"Translations available: {list(sample['translations'].keys())}")
            if 'en' in sample['translations']:
                logger.info(f"English name: {sample['translations']['en']['diseaseName']}")
            if 'ur' in sample['translations']:
                logger.info(f"Urdu name: {sample['translations']['ur']['diseaseName']}")
        elif 'diseaseName' in sample:
            # Old structure
            logger.info(f"Disease name: {sample['diseaseName']}")

if __name__ == "__main__":
    # Run the upload
    asyncio.run(upload_to_mongodb())
    
    # Verify the data
    asyncio.run(verify_data())