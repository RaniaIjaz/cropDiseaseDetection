

from fastapi import UploadFile, File, APIRouter, HTTPException,Form
# tensorflow / torch / transformers are imported lazily inside the loader
# functions below. They are only needed once a model is actually loaded, and
# keeping them off the module's import path lets the app (and its tests) be
# imported in an environment where those very large packages are absent.
import numpy as np
from PIL import Image

import io
import json
import logging
from typing import Dict, List, Any
from dotenv import load_dotenv
# `google.genai` is currently unused at runtime (the client construction below
# is commented out). Importing it eagerly forced the dependency on anything
# that merely imports this module, so it is left out until it is needed again.
from app.models.reports import ReportBase,ReportStatus
from app.models.images import ImageBase, ImageStatus
from app.db.mongo import images_collection, reports_collection, diseases_collection
import os
import uuid

load_dotenv()




# # genai_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
# # Initialize with explicit v1 API version
# genai_client = genai.Client(
#     api_key=os.getenv("GEMINI_API_KEY"),
#     http_options={'api_version': 'v1'}  # <--- Force v1 instead of v1beta
# )
# Set up logging
BASE_URL = os.getenv("BASE_URL")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/predict", tags=["predict"])


# Global variables for model and class info
cotton_model = None
cotton_model2 = None
class_indices = None  # Use only one mapping
wheat_model = None
wheat_class_indices = None

#for the clip model
clip_model = None
clip_processor = None

def load_model_and_classes():
    """Load model and class information"""
    global cotton_model, class_indices, wheat_model, wheat_class_indices, cotton_model2

    # FastAPI's merged_lifespan invokes an included router's on_event("startup")
    # handler more than once, which loaded both .keras files twice.
    if cotton_model is not None and wheat_model is not None:
        logger.debug("Models already loaded; skipping reload")
        return

    from tensorflow.keras.models import load_model

    try:
        # Load model
        cotton_model = load_model("models/disease_detection.keras") #disease_detection_model.h5
        # /predict/predict-disease/ reads `cotton_model2`, which was declared but
        # never assigned — every cotton request failed with
        # "'NoneType' object has no attribute 'predict'". Same weights, same
        # preprocess_image() pipeline and same class_indices as /predict/cotton/.
        cotton_model2 = cotton_model
        logger.info("Model loaded successfully")
        
        wheat_model = load_model("models/fine_tuned_best_model.keras")
        logger.info("Model loaded successfully")
        
        
        # Load class indices from generator (this is the correct mapping from training)
        with open("models/class_indices.json", "r") as f:
            class_indices = json.load(f)
        
        with open("models/wheat_class_names.json", "r") as f:
            wheat_class_indices = json.load(f)
            
        
            
        # The second line previously repeated the cotton mapping verbatim, so a
        # bad wheat mapping would never have shown up in the logs.
        logger.info(f"Loaded {len(class_indices)} cotton classes: {list(class_indices.values())}")
        logger.info(f"Loaded {len(wheat_class_indices)} wheat classes: {list(wheat_class_indices.values())}")

        # Fail loudly if a label file and its model disagree: a silent mismatch
        # returns a confident, wrongly-named disease rather than an error.
        for name, model, mapping in (
            ("cotton", cotton_model, class_indices),
            ("wheat", wheat_model, wheat_class_indices),
        ):
            outputs = model.output_shape[-1]
            if outputs != len(mapping):
                raise ValueError(
                    f"{name} model outputs {outputs} classes but its label file "
                    f"has {len(mapping)} entries"
                )
        
    except Exception as e:
        logger.error(f"Error loading model or class files: {str(e)}")
        raise
    
    #for clip model
def load_clip_model():
    """Load CLIP model for zero-cost image validation"""
    global clip_model, clip_processor

    # Same double-invocation guard; CLIP is by far the heaviest of the three.
    if clip_model is not None and clip_processor is not None:
        logger.debug("CLIP model already loaded; skipping reload")
        return

    from transformers import CLIPProcessor, CLIPModel

    try:
        clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        logger.info("CLIP model loaded successfully")
    except Exception as e:
        logger.error(f"Error loading CLIP model: {str(e)}")
        raise


# Load clip and other model on startup
@router.on_event("startup")
async def startup_event():
    load_model_and_classes()
    load_clip_model()

def preprocess_image(img: Image.Image, target_size: tuple = (224, 224)) -> np.ndarray:
    """Preprocess image exactly like during training"""
    # Convert to RGB if necessary
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Resize to target size
    img = img.resize(target_size)
    
    # Convert to array and normalize (same as training)
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array.astype('float32') / 255.0
    
    return img_array

def get_top_predictions(predictions: np.ndarray, top_k: int = 3) -> List[Dict[str, Any]]:
    """Get top K predictions with confidence scores"""
    # Get indices of top K predictions
    top_indices = np.argsort(predictions[0])[-top_k:][::-1]
    
    top_predictions = []
    for idx in top_indices:
        # Use class_indices mapping consistently
        class_name = class_indices.get(str(idx)) or f"Class_{idx}"
        confidence = float(predictions[0][idx] * 100)
        
        top_predictions.append({
            "class": class_name,
            "confidence": confidence,
            "class_index": int(idx)
        })
    
    return top_predictions


def get_translation(disease_info: Dict, locale: str) -> Dict[str, Any]:
    """Get translation for specific locale, fallback to English"""
    if not disease_info:
        return {
            "diseaseName": "",
            "description": "",
            "symptoms": [],
            "solutions": [],
            "prevention": [],
            "treatmentSteps": None,
            "preventiveGuidelines": None
        }
    
    # Get translations dict
    translations = disease_info.get("translations", {})
    
    # Get requested locale, fallback to English
    if locale in translations:
        translation = translations[locale]
    elif "en" in translations:
        translation = translations["en"]
        logger.warning(f"No translation for locale '{locale}', using English")
    else:
        # Fallback to old format
        translation = {
            "diseaseName": disease_info.get("diseaseName", ""),
            "description": disease_info.get("description", ""),
            "symptoms": disease_info.get("symptoms", []),
            "solutions": disease_info.get("solutions", []),
            "prevention": disease_info.get("prevention", []),
            "treatmentSteps": disease_info.get("treatmentSteps"),
            "preventiveGuidelines": disease_info.get("preventiveGuidelines")
        }
    
    return translation

       # validation of image
async def is_valid_crop_image(img_bytes: bytes, cropType: str) -> bool:
    """
    Use free CLIP model to validate crop images locally (no API costs)
    """
    import torch

    try:
        # Open image
        img = Image.open(io.BytesIO(img_bytes))

        # Define text prompts
        positive_texts = [
            f"a photo of {cropType} plant",
            f"a photo of {cropType} leaves",
            f"a photo of diseased {cropType}",
            f"{cropType} crop in a field"
        ]
        
        negative_texts = [
            "a photo of a person",
            "a photo of a vehicle",
            "a photo of a building",
            "a photo of an animal",
            "random objects"
        ]
        
        # Prepare inputs
        inputs = clip_processor(
            text=positive_texts + negative_texts,
            images=img,
            return_tensors="pt",
            padding=True
        )
        
        # Get predictions
        with torch.no_grad():
            outputs = clip_model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)
        
        # Check if any positive prompt has higher probability
        positive_prob = probs[0, :len(positive_texts)].sum().item()
        negative_prob = probs[0, len(positive_texts):].sum().item()
        
        logger.info(f"CLIP validation - Positive: {positive_prob:.2f}, Negative: {negative_prob:.2f}")
        
        # Image is valid if positive score is higher
        return positive_prob > negative_prob
        
    except Exception as e:
        logger.error(f"CLIP validation error: {str(e)}")
        return True  # Default to accepting on error

@router.post("/predict-disease/")
async def predict_disease(
    cropType: str = Form(..., description="Crop type: 'cotton' or 'wheat'"),
    userId: str = Form(None, description="User ID (required for cotton, optional for wheat)"),
    locale: str = Form("en", description="Language preference: 'en' or 'ur'"),
    file: UploadFile = File(...)
):
    """
    Upload crop leaf image, run appropriate model prediction, and generate report
    """
    try:
        # Validate crop type
        cropType = cropType.lower()
        if cropType not in ["cotton", "wheat"]:
            raise HTTPException(status_code=400, detail="Crop type must be 'cotton' or 'wheat'")
        
        # Validate locale
        locale = locale.lower()
        if locale not in ["en", "ur"]:
            locale = "en"  # default to English
        
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Validate userId for cotton
        if cropType == "cotton" and not userId:
            raise HTTPException(status_code=400, detail="User ID is required for cotton predictions")
        
        # Read image bytes
        img_bytes = await file.read()
        if len(img_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty file")
        
        
        #calling the validation function
        valid_crop = await is_valid_crop_image(img_bytes, cropType)

        if not valid_crop:
                # Return a more informative error
            return {
                "status": "validation_failed",
                "message": f"This image does not appear to be related to {cropType} crop.",
                "details": "Please upload an image containing the crop plant, leaves, stem, or related agricultural context.",
                "image_accepted_types": [
                    f"{cropType} leaves",
                    f"{cropType} plants",
                    f"{cropType} field",
                    "diseased crop parts",
                    "agricultural context"
                ]
            }

        
        # Open and preprocess image
        img = Image.open(io.BytesIO(img_bytes))
        processed_image = preprocess_image(img)
        
        if cropType == "cotton":
            return await _process_cotton_prediction(userId, file, img_bytes, processed_image, locale)
        else:  # wheat
            return await _process_wheat_prediction(userId, file, img_bytes, processed_image, locale)
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

async def _process_cotton_prediction(userId: str, file: UploadFile, img_bytes: bytes, processed_image, locale: str = "en"):
    """Process cotton prediction with full reporting"""
    # Save image info to MongoDB first
    file_location = f"uploads/{uuid.uuid4()}_{file.filename}"

    with open(file_location, "wb") as f:
        f.write(img_bytes)

    image_entry = ImageBase(
        userId=userId,
        cropType="Cotton",
        imageUrl=f"{BASE_URL}/{file_location}",
        status=ImageStatus.processing
    )
    result = await images_collection.insert_one(image_entry.dict())
    image_id = str(result.inserted_id)
    
    try:
        # Run cotton prediction
        predictions = cotton_model2.predict(processed_image, verbose=0)
        predicted_class_index = int(np.argmax(predictions, axis=1)[0])
        confidence = float(np.max(predictions) * 100)
        
        # Get English class name from indices
        english_class_name = class_indices.get(str(predicted_class_index)) or f"Class_{predicted_class_index}"
        
        # Convert to disease key format
        disease_key = english_class_name.replace(" ", "_").lower()
        
        # Get disease details from database with translations
        disease_info = await diseases_collection.find_one({
            "diseaseKey": disease_key,
            "cropType": "Cotton"
        })
        
        # Get translation for requested locale
        translation = get_translation(disease_info, locale)
        
        # If translation has no diseaseName, use English
        if not translation["diseaseName"] and disease_info:
            translation["diseaseName"] = disease_info.get("diseaseName", english_class_name)
        
        is_healthy = "healthy" in disease_key.lower()
        
        # Generate report
        report = ReportBase(
            userId=userId,
            imageId=image_id,
            imageUrl=f"{BASE_URL}/{file_location}",
            cropType="Cotton",
            predictedDisease=translation["diseaseName"],
            confidence=confidence,
            description=translation["description"],
            symptoms=translation["symptoms"],
            solutions=translation["solutions"],
            prevention=translation["prevention"],
            treatmentSteps=translation.get("treatmentSteps"),
            preventiveGuidelines=translation.get("preventiveGuidelines"),
            language=locale,
            status=ReportStatus.completed,
            diseaseKey=disease_key
        )
        await reports_collection.insert_one(report.dict())
        
        # Update image status in DB
        await images_collection.update_one(
            {"_id": result.inserted_id},
            {"$set": {
                "status": ImageStatus.completed,
                "predictedDisease": translation["diseaseName"],
                "confidence": confidence,
                "language": locale
            }}
        )
        
        return {
            "status": "success",
            "crop": "Cotton",
            "predictedDisease": translation["diseaseName"],
            "confidence": confidence,
            "is_healthy": is_healthy,
            "imageUrl":f"{BASE_URL}/{file_location}",
            "imageId": image_id,
            "locale": locale,
            "hasDetailedReport": True,
            "report": {
                "description": translation["description"],
                "symptoms": translation["symptoms"],
                "solutions": translation["solutions"],
                "prevention": translation["prevention"],
                "treatmentSteps": translation.get("treatmentSteps"),
                "preventiveGuidelines": translation.get("preventiveGuidelines")
            },
        }
        
    except Exception as e:
        # Update image status to error if something goes wrong
        await images_collection.update_one(
            {"_id": result.inserted_id},
            {"$set": {"status": ImageStatus.error}}
        )
        logger.error(f"Cotton prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Cotton prediction failed: {str(e)}")

async def _process_wheat_prediction(userId: str, file: UploadFile, img_bytes: bytes, processed_image, locale: str = "en"):
    """Process wheat prediction with full reporting"""
    # Save image info to MongoDB first
    file_location = f"uploads/{uuid.uuid4()}_{file.filename}"

    with open(file_location, "wb") as f:
        f.write(img_bytes)
    
    image_entry = ImageBase(
        userId=userId,
        cropType="Wheat",
        imageUrl=f"{BASE_URL}/{file_location}",
        status=ImageStatus.processing
    )
    result = await images_collection.insert_one(image_entry.dict())
    image_id = str(result.inserted_id)
    
    try:
        # Run wheat prediction
        predictions = wheat_model.predict(processed_image, verbose=0)
        predicted_class_index = int(np.argmax(predictions, axis=1)[0])
        confidence = float(np.max(predictions) * 100)
        
        # Get English class name from indices
        english_class_name = wheat_class_indices.get(str(predicted_class_index)) or f"Class_{predicted_class_index}"
        
        # Convert to disease key format
        disease_key = english_class_name.replace(" ", "_").lower()
        
        # Get disease details from database with translations
        disease_info = await diseases_collection.find_one({
            "diseaseKey": disease_key,
            "cropType": "Wheat"
        })
        
        # Get translation for requested locale
        translation = get_translation(disease_info, locale)
        
        # If translation has no diseaseName, use English
        if not translation["diseaseName"] and disease_info:
            translation["diseaseName"] = disease_info.get("diseaseName", english_class_name)
        
        is_healthy = "healthy" in disease_key.lower()
        
        # Generate report
        report = ReportBase(
            userId=userId,
            imageId=image_id,
            imageUrl=f"{BASE_URL}/{file_location}",
            cropType="Wheat",
            predictedDisease=translation["diseaseName"],
            confidence=confidence,
            description=translation["description"],
            symptoms=translation["symptoms"],
            solutions=translation["solutions"],
            prevention=translation["prevention"],
            treatmentSteps=translation.get("treatmentSteps"),
            preventiveGuidelines=translation.get("preventiveGuidelines"),
            language=locale,
            status=ReportStatus.completed,
            diseaseKey=disease_key
        )
        await reports_collection.insert_one(report.dict())
        
        # Update image status in DB
        await images_collection.update_one(
            {"_id": result.inserted_id},
            {"$set": {
                "status": ImageStatus.completed,
                "predictedDisease": translation["diseaseName"],
                "confidence": confidence,
                "language": locale
            }}
        )
        
        return {
            "status": "success",
            "crop": "Wheat",
            "predictedDisease": translation["diseaseName"],
            "confidence": confidence,
            "is_healthy": is_healthy,
            "imageId": image_id,
           "imageUrl":f"{BASE_URL}/{file_location}",
            "locale": locale,
            "hasDetailedReport": True,
            "report": {
                "description": translation["description"],
                "symptoms": translation["symptoms"],
                "solutions": translation["solutions"],
                "prevention": translation["prevention"],
                "treatmentSteps": translation.get("treatmentSteps"),
                "preventiveGuidelines": translation.get("preventiveGuidelines")
            },
        }
        
    except Exception as e:
        # Update image status to error if something goes wrong
        await images_collection.update_one(
            {"_id": result.inserted_id},
            {"$set": {"status": ImageStatus.error}}
        )
        logger.error(f"Wheat prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Wheat prediction failed: {str(e)}")


@router.post("/cotton/")
async def predict_cotton_disease(userId: str, file: UploadFile = File(...)):
    """
    Upload cotton leaf image, store it, run prediction, generate report
    """
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image bytes
        img_bytes = await file.read()
        if len(img_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty file")
        
        # Save image info to MongoDB first
        image_entry = ImageBase(
            userId=userId,
            cropType="Cotton",
            imageUrl=f"/uploads/{uuid.uuid4()}_{file.filename}",  # or actual storage URL
            status=ImageStatus.processing
        )
        result = await images_collection.insert_one(image_entry.dict())
        image_id = str(result.inserted_id)
        
        # Preprocess image for model
        img = Image.open(io.BytesIO(img_bytes))
        processed_image = preprocess_image(img)
        
        # Run prediction
        predictions = cotton_model.predict(processed_image, verbose=0)
        predicted_class_index = int(np.argmax(predictions, axis=1)[0])
        confidence = float(np.max(predictions) * 100)
        class_name = class_indices.get(str(predicted_class_index)) or f"Class_{predicted_class_index}"
        is_healthy = "Healthy" in class_name
        
        # Get disease details from database
        disease_info = await diseases_collection.find_one({"diseaseName": class_name, "cropType": "Cotton"})
        if not disease_info:
            disease_info = {}  # fallback if disease info missing
        
        # supplier_links = disease_info.get("supplierLinks")
        # if supplier_links:
        #     supplier_links = [str(link) for link in supplier_links]
        
        # Generate report
        report = ReportBase(
            userId=userId,
            imageId=image_id,
            cropType="Cotton",
            predictedDisease=class_name,
            confidence=confidence,
            description=disease_info.get("description", ""),
            symptoms=disease_info.get("symptoms", []),
            solutions=disease_info.get("solutions", []),
            prevention=disease_info.get("prevention", []),
            treatmentSteps=disease_info.get("treatmentSteps"),
            preventiveGuidelines=disease_info.get("preventiveGuidelines"),
            # supplierLinks=supplier_links,
            status="completed"
        )
        await reports_collection.insert_one(report.dict())
        
        # Update image status in DB
        await images_collection.update_one(
            {"_id": result.inserted_id},
            {"$set": {
                "status": ImageStatus.completed,
                "predictedDisease": class_name,
                "confidence": confidence
            }}
        )
        
        return {
            "status": "success",
            "predictedDisease": class_name,
            "confidence": confidence,
            "is_healthy": is_healthy,
            "imageId": image_id,
        }
        
    except HTTPException:
        raise
    except Exception as e:
        # Update image status to error if something goes wrong
        if 'image_id' in locals():
            await images_collection.update_one(
                {"_id": result.inserted_id},
                {"$set": {"status": ImageStatus.error}}
            )
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/debug/model-info")
async def debug_model_info():
    """Debug endpoint to check model and class mappings"""
    if cotton_model is None:
        return {"error": "Model not loaded"}
    
    # Test prediction with a simple array to see raw outputs
    test_input = np.random.random((1, 224, 224, 3)).astype('float32')
    test_prediction = cotton_model.predict(test_input, verbose=0)
    
    return {
        "model_input_shape": cotton_model.input_shape,
        "model_output_shape": cotton_model.output_shape,
        "class_indices": class_indices,
        "test_prediction_shape": test_prediction.shape,
        "test_prediction_values": test_prediction[0].tolist(),
        "number_of_classes": len(class_indices) if class_indices else 0,
        "class_mapping_verified": True if class_indices else False
    }
    
    
@router.post("/cotton/batch/")
async def predict_cotton_disease_batch(files: List[UploadFile] = File(...)):
    """
    Predict cotton diseases for multiple leaf images at once
    """
    try:
        if len(files) == 0:
            raise HTTPException(status_code=400, detail="No files provided")
        
        logger.info(f"Processing {len(files)} images in batch")
        
        results = []
        
        for file in files:
            try:
                # Validate file type
                if not file.content_type.startswith('image/'):
                    results.append({
                        "filename": file.filename,
                        "status": "error",
                        "error": "File must be an image"
                    })
                    continue
                
                # Read and validate image
                img_bytes = await file.read()
                if len(img_bytes) == 0:
                    results.append({
                        "filename": file.filename,
                        "status": "error",
                        "error": "Empty file"
                    })
                    continue
                
                # Open and validate image
                img = Image.open(io.BytesIO(img_bytes))
                
                # Preprocess image
                processed_image = preprocess_image(img)
                
                # Make prediction
                predictions = cotton_model.predict(processed_image, verbose=0)
                
                # Get top prediction
                predicted_class_index = np.argmax(predictions, axis=1)[0]
                confidence = float(np.max(predictions) * 100)
                
                # Get class name
                class_name = class_indices.get(str(predicted_class_index)) or f"Class_{predicted_class_index}"
                
                # Get top 3 predictions
                top_indices = np.argsort(predictions[0])[-3:][::-1]
                top_predictions = []
                for idx in top_indices:
                    top_class_name = class_indices.get(str(idx)) or f"Class_{idx}"
                    top_confidence = float(predictions[0][idx] * 100)
                    top_predictions.append({
                        "class": top_class_name,
                        "confidence": top_confidence,
                        "class_index": int(idx)
                    })
                
                # Determine if leaf is healthy
                is_healthy = "Healthy" in class_name
                
                results.append({
                    "filename": file.filename,
                    "predicted_disease": class_name,
                    "confidence": confidence,
                    "is_healthy": is_healthy,
                    "top_predictions": top_predictions,
                    "predicted_index": int(predicted_class_index),
                    "status": "success"
                })
                
                logger.info(f"Processed {file.filename}: {class_name} with {confidence:.2f}% confidence")
                
            except Exception as e:
                results.append({
                    "filename": file.filename,
                    "status": "error",
                    "error": str(e)
                })
                logger.error(f"Error processing {file.filename}: {str(e)}")
        
        # Calculate summary
        successful_predictions = len([r for r in results if r["status"] == "success"])
        
        return {
            "batch_results": results,
            "summary": {
                "total_files": len(files),
                "successful_predictions": successful_predictions,
                "failed_predictions": len(files) - successful_predictions,
                "success_rate": f"{(successful_predictions / len(files)) * 100:.2f}%"
            }
        }
        
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")    

@router.get("/cotton/classes/")
async def get_classes():
    """
    Get all available disease classes
    """
    return {
        "classes": class_indices,
        "total_classes": len(class_indices)
    }

@router.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "model_loaded": cotton_model is not None,
        "classes_loaded": class_indices is not None,
        "total_classes": len(class_indices) if class_indices else 0
    }
    
    
    