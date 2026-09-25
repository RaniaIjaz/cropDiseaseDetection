

from fastapi import UploadFile, File, APIRouter, HTTPException
# tensorflow is imported lazily inside load_model_and_classes() so the module
# can be imported without it (see model_routes.py for the same treatment).
import numpy as np
from PIL import Image
import io
import json
import logging
from typing import Dict, List, Any


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/predict", tags=["predict"])


class_indices = None  # Use only one mapping
wheat_model = None


_load_attempted = False


def load_model_and_classes():
    """Load model and class information"""
    global  class_indices, wheat_model, _load_attempted

    # Guards against FastAPI's double invocation of a router startup handler,
    # which otherwise logged the same missing-file error twice.
    if _load_attempted:
        return
    _load_attempted = True

    from tensorflow.keras.models import load_model

    try:
        # Load model
        # cotton_model = load_model("models/disease_detection_model.h5")
        # logger.info("Model loaded successfully")
        
        # wheat_model = load_model("models/xception_best.keras")
        wheat_model = load_model("models/xception_best.keras", compile=False)

        logger.info("Model loaded successfully")
       
            
        with open("models/wheat_class_names.json", "r") as f:
            class_indices = json.load(f)
            
        logger.info(f"Loaded {len(class_indices)} classes: {list(class_indices.values())}")
        
    except Exception as e:
        # Non-fatal: this router's model (xception_best.keras) is optional and
        # is not what /predict/predict-disease/ uses. Re-raising here aborted
        # application startup entirely, taking down every other route with it.
        # The endpoints below report 503 while the model is unavailable.
        logger.error(f"Error loading model or class files: {str(e)}")


# Load model on startup
@router.on_event("startup")
async def startup_event():
    load_model_and_classes()


def _require_wheat_model():
    """Guard for endpoints that cannot work without the optional model."""
    if wheat_model is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "Wheat model unavailable: models/xception_best.keras is missing. "
                "Use /predict/predict-disease/ instead."
            ),
        )

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


@router.post("/wheat/")
async def predict_cotton_disease(file: UploadFile = File(...)):
    """
    Predict wheat disease from leaf image
    """
    _require_wheat_model()

    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        logger.info(f"Processing image: {file.filename}")
        
        # Read and validate image
        img_bytes = await file.read()
        if len(img_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty file")
        
        # Open and validate image
        img = Image.open(io.BytesIO(img_bytes))
        
        # Preprocess image
        processed_image = preprocess_image(img)
        
        # Make prediction
        predictions = wheat_model.predict(processed_image, verbose=0)
        
        # Get top prediction
        predicted_class_index = np.argmax(predictions, axis=1)[0]
        confidence = float(np.max(predictions) * 100)
        
        # Get class name using the consistent class_indices mapping
        class_name = class_indices.get(str(predicted_class_index)) or f"Class_{predicted_class_index}"
        
        # Get top 3 predictions for more detailed response
        top_predictions = get_top_predictions(predictions, top_k=3)
        
        # Determine if leaf is healthy
        is_healthy = "Healthy" in class_name
        
        logger.info(f"Prediction: {class_name} (index: {predicted_class_index}) with {confidence:.2f}% confidence")
        
        return {
            "crop": "Wheat",
            "predicted_disease": class_name,
            "confidence": confidence,
            "is_healthy": is_healthy,
            "top_predictions": top_predictions,
            "predicted_index": int(predicted_class_index),
            "status": "success"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
    
    
    

@router.get("/debug/wheat-model-info")
async def debug_model_info():
    """Debug endpoint to check model and class mappings"""
    if wheat_model is None:
        return {"error": "Model not loaded"}
    
    # Test prediction with a simple array to see raw outputs
    test_input = np.random.random((1, 224, 224, 3)).astype('float32')
    test_prediction = wheat_model.predict(test_input, verbose=0)
    
    return {
        "model_input_shape": wheat_model.input_shape,
        "model_output_shape": wheat_model.output_shape,
        "class_indices": class_indices,
        "test_prediction_shape": test_prediction.shape,
        "test_prediction_values": test_prediction[0].tolist(),
        "number_of_classes": len(class_indices) if class_indices else 0,
        "class_mapping_verified": True if class_indices else False
    }
    
    
    

@router.get("/wheat/classes/")
async def get_classes():
    """
    Get all available disease classes
    """
    return {
        "classes": class_indices or {},
        "total_classes": len(class_indices or {})
    }

@router.get("/wheat-model-health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "model_loaded": wheat_model is not None,
        "classes_loaded": class_indices is not None,
        "total_classes": len(class_indices) if class_indices else 0
    }


# @router.post("/predict-disease/")
# async def predict_disease(
#     cropType: str = Form(..., description="Crop type: 'cotton' or 'wheat'"),
#     userId: str = Form(None, description="User ID (required for cotton, optional for wheat)"),
#     file: UploadFile = File(...)
# ):
#     """
#     Upload crop leaf image, run appropriate model prediction, and generate report
#     """
#     try:
#         # Validate crop type
#         cropType = cropType.lower()
#         if cropType not in ["cotton", "wheat"]:
#             raise HTTPException(status_code=400, detail="Crop type must be 'cotton' or 'wheat'")
        
#         # Validate file type
#         if not file.content_type.startswith("image/"):
#             raise HTTPException(status_code=400, detail="File must be an image")
        
#         # Validate userId for cotton
#         if cropType == "cotton" and not userId:
#             raise HTTPException(status_code=400, detail="User ID is required for cotton predictions")
        
#         # Read image bytes
#         img_bytes = await file.read()
#         if len(img_bytes) == 0:
#             raise HTTPException(status_code=400, detail="Empty file")
        
#         # Open and preprocess image
#         img = Image.open(io.BytesIO(img_bytes))
#         processed_image = preprocess_image(img)
        
#         if cropType == "cotton":
#             return await _process_cotton_prediction(userId, file, img_bytes, processed_image)
#         else:  # wheat
#             return await _process_wheat_prediction(userId, file, processed_image)
            
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"Prediction error: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# async def _process_cotton_prediction(userId: str, file: UploadFile, img_bytes: bytes, processed_image):
#     """Process cotton prediction with full reporting"""
#     # Save image info to MongoDB first
#     image_entry = ImageBase(
#         userId=userId,
#         cropType="Cotton",
#         imageUrl=f"/uploads/{uuid.uuid4()}_{file.filename}",
#         status=ImageStatus.processing
#     )
#     result = await images_collection.insert_one(image_entry.dict())
#     image_id = str(result.inserted_id)
    
#     try:
#         # Run cotton prediction
#         predictions = cotton_model.predict(processed_image, verbose=0)
#         predicted_class_index = int(np.argmax(predictions, axis=1)[0])
#         confidence = float(np.max(predictions) * 100)
#         class_name = class_indices.get(str(predicted_class_index)) or f"Class_{predicted_class_index}"
#         is_healthy = "Healthy" in class_name
        
#         # Get disease details from database
#         disease_info = await diseases_collection.find_one({"diseaseName": class_name, "cropType": "Cotton"})
#         if not disease_info:
#             disease_info = {}  # fallback if disease info missing
        
#         # Generate report
#         report = ReportBase(
#             userId=userId,
#             imageId=image_id,
#             cropType="Cotton",
#             predictedDisease=class_name,
#             confidence=confidence,
#             description=disease_info.get("description", ""),
#             symptoms=disease_info.get("symptoms", []),
#             solutions=disease_info.get("solutions", []),
#             prevention=disease_info.get("prevention", []),
#             treatmentSteps=disease_info.get("treatmentSteps"),
#             preventiveGuidelines=disease_info.get("preventiveGuidelines"),
#             status="completed"
#         )
#         await reports_collection.insert_one(report.dict())
        
#         # Update image status in DB
#         await images_collection.update_one(
#             {"_id": result.inserted_id},
#             {"$set": {
#                 "status": ImageStatus.completed,
#                 "predictedDisease": class_name,
#                 "confidence": confidence
#             }}
#         )
        
#         return {
#             "status": "success",
#             "crop": "Cotton",
#             "predictedDisease": class_name,
#             "confidence": confidence,
#             "is_healthy": is_healthy,
#             "imageId": image_id,
#             "hasDetailedReport": True
#         }
        
#     except Exception as e:
#         # Update image status to error if something goes wrong
#         await images_collection.update_one(
#             {"_id": result.inserted_id},
#             {"$set": {"status": ImageStatus.error}}
#         )
#         raise e

# async def _process_wheat_prediction(userId: str, file: UploadFile, processed_image):
#     """Process wheat prediction with basic response"""
#     # Run wheat prediction
#     predictions = wheat_model.predict(processed_image, verbose=0)
    
#     # Get top prediction
#     predicted_class_index = np.argmax(predictions, axis=1)[0]
#     confidence = float(np.max(predictions) * 100)
    
#     # Get class name using the consistent class_indices mapping
#     class_name = class_indices.get(str(predicted_class_index)) or f"Class_{predicted_class_index}"
    
#     # Get top 3 predictions for more detailed response
#     top_predictions = get_top_predictions(predictions, top_k=3)
    
#     # Determine if leaf is healthy
#     is_healthy = "Healthy" in class_name
    
#     logger.info(f"Wheat prediction: {class_name} (index: {predicted_class_index}) with {confidence:.2f}% confidence")
    
#     response = {
#         "status": "success",
#         "crop": "Wheat",
#         "predicted_disease": class_name,
#         "confidence": confidence,
#         "is_healthy": is_healthy,
#         "top_predictions": top_predictions,
#         "predicted_index": int(predicted_class_index),
#         "hasDetailedReport": False
#     }
    
#     # Add userId to response if provided for wheat
#     if userId:
#         response["userId"] = userId
    
#     return response