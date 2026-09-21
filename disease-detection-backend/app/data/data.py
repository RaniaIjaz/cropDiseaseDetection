from pydantic import HttpUrl
from typing import List, Optional
from uuid import uuid4


# cotton_diseases_data = [
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Bacterial Blight",
#         "cropType": "Cotton",
#         "description": "A bacterial infection causing water-soaked lesions on leaves and stems, leading to reduced growth and yield.",
#         "symptoms": ["Water-soaked lesions", "Leaf yellowing", "Necrotic spots"],
#         "solutions": ["Use certified disease-free seeds", "Apply copper-based bactericides", "Remove infected plant parts"],
#         "prevention": ["Crop rotation", "Avoid overhead irrigation", "Sanitize tools"],
#         "treatmentSteps": [
#             "Identify infected plants early",
#             "Remove and destroy infected leaves",
#             "Apply copper bactericide spray weekly"
#         ],
#         "preventiveGuidelines": [
#             "Rotate cotton with non-host crops",
#             "Maintain proper field sanitation",
#             "Monitor regularly for symptoms"
#         ],
     
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Curl Virus",
#         "cropType": "Cotton",
#         "description": "A viral infection transmitted by whiteflies, causing leaf curling, distortion, and stunted growth.",
#         "symptoms": ["Leaf curling", "Yellowing veins", "Stunted growth"],
#         "solutions": ["Remove infected plants", "Control whitefly population", "Use resistant varieties"],
#         "prevention": ["Regular field monitoring", "Install yellow sticky traps for whiteflies", "Practice crop rotation"],
#         "treatmentSteps": [
#             "Inspect plants for whiteflies",
#             "Remove and destroy infected plants",
#             "Spray insecticide if infestation is high"
#         ],
#         "preventiveGuidelines": [
#             "Use certified virus-free seeds",
#             "Avoid planting cotton near other infected crops",
#             "Monitor vector populations"
#         ],
     
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Healthy Leaf",
#         "cropType": "Cotton",
#         "description": "Indicates a healthy cotton leaf with no signs of disease or pest infestation.",
#         "symptoms": ["Green leaf", "No spots", "Normal growth"],
#         "solutions": [],
#         "prevention": ["Maintain regular irrigation", "Monitor for pests regularly", "Apply balanced fertilizers"],
#         "treatmentSteps": None,
#         "preventiveGuidelines": ["Keep the field clean", "Rotate crops to prevent disease build-up"],
        
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Herbicide Growth Damage",
#         "cropType": "Cotton",
#         "description": "Damage caused by herbicide exposure leading to leaf yellowing, curling, and abnormal growth patterns.",
#         "symptoms": ["Yellowing leaves", "Leaf curling", "Stunted growth"],
#         "solutions": ["Stop herbicide application", "Provide adequate irrigation", "Apply foliar nutrients"],
#         "prevention": ["Avoid herbicide drift", "Follow recommended doses", "Protect sensitive crops"],
#         "treatmentSteps": [
#             "Identify affected plants",
#             "Wash off any herbicide residues",
#             "Support recovery with proper fertilization"
#         ],
#         "preventiveGuidelines": ["Use buffer zones", "Avoid spraying on windy days"],
     
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Leaf Hopper Jassids",
#         "cropType": "Cotton",
#         "description": "Infestation of leaf hoppers causing yellowing, curling, and stunted growth due to sap-sucking.",
#         "symptoms": ["Yellowing leaves", "Curling of leaf edges", "Stunted growth"],
#         "solutions": ["Apply neem-based insecticides", "Introduce natural predators", "Spray systemic insecticides"],
#         "prevention": ["Regular field inspection", "Maintain plant spacing", "Remove weeds nearby"],
#         "treatmentSteps": [
#             "Monitor hopper population weekly",
#             "Apply neem oil spray early morning",
#             "Release natural predators like ladybugs"
#         ],
#         "preventiveGuidelines": ["Avoid over-fertilization", "Keep fields weed-free"],
     
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Leaf Redding",
#         "cropType": "Cotton",
#         "description": "Leaves turn reddish or brown due to nutrient deficiencies, often caused by potassium or magnesium shortage.",
#         "symptoms": ["Reddish-brown leaves", "Yellowing along veins", "Reduced yield"],
#         "solutions": ["Apply potassium-magnesium fertilizers", "Improve soil pH", "Maintain balanced fertilization schedule"],
#         "prevention": ["Soil testing before planting", "Avoid overwatering", "Apply compost regularly"],
#         "treatmentSteps": [
#             "Identify deficiency symptoms",
#             "Correct soil nutrient imbalance",
#             "Apply foliar sprays if needed"
#         ],
#         "preventiveGuidelines": ["Regularly monitor soil nutrients", "Follow fertilization guidelines"],
        
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Leaf Variegation",
#         "cropType": "Cotton",
#         "description": "Appearance of leaves with yellow or white patches, sometimes caused by virus, genetic mutation, or nutrient imbalance.",
#         "symptoms": ["Yellow/white leaf patches", "Uneven coloring", "Occasional stunted growth"],
#         "solutions": ["Remove infected leaves if viral", "Correct nutrient imbalance", "Plant resistant varieties"],
#         "prevention": ["Regular nutrient monitoring", "Avoid virus-infected plants nearby"],
#         "treatmentSteps": [
#             "Assess cause (viral or nutrient)",
#             "Apply corrective fertilizers",
#             "Monitor for spread"
#         ],
#         "preventiveGuidelines": ["Use clean seeds", "Maintain field hygiene"],
       
#     },
#      {
#         "id": str(uuid4()),
#         "diseaseName": "Aphid",
#         "cropType": "Wheat",
#         "description": "Small sap-sucking insects that colonize wheat plants, causing yellowing, stunted growth, and reduced yield. They can also transmit viral diseases.",
#         "symptoms": ["Yellowing leaves", "Stunted growth", "Honeydew secretion", "Sooty mold growth", "Curling leaves"],
#         "solutions": ["Apply imidacloprid or thiamethoxam", "Use insecticidal soaps", "Release natural predators like ladybugs", "Apply neem oil spray"],
#         "prevention": ["Monitor fields regularly", "Use resistant varieties", "Avoid excessive nitrogen fertilization", "Maintain field sanitation"],
#         "treatmentSteps": [
#             "Identify aphid colonies early",
#             "Apply systemic insecticides if threshold exceeded",
#             "Use foliar sprays for immediate control",
#             "Monitor for re-infestation"
#         ],
#         "preventiveGuidelines": [
#             "Plant early to avoid peak aphid season",
#             "Use yellow sticky traps for monitoring",
#             "Conserve natural enemy populations"
#         ],
    
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Black Rust",
#         "cropType": "Wheat",
#         "description": "Also known as stem rust, caused by fungus Puccinia graminis. Characterized by dark reddish-brown pustules on stems and leaves.",
#         "symptoms": ["Dark reddish-brown pustules", "Blisters on stems and leaves", "Premature leaf death", "Reduced grain fill"],
#         "solutions": ["Apply fungicides like triazoles", "Use resistant varieties", "Remove volunteer wheat plants", "Apply strobilurin-based fungicides"],
#         "prevention": ["Plant resistant cultivars", "Destroy crop residues", "Avoid late planting", "Practice crop rotation"],
#         "treatmentSteps": [
#             "Monitor for early symptoms",
#             "Apply protective fungicides at first sign",
#             "Use systemic fungicides for established infections",
#             "Repeat application if needed"
#         ],
#         "preventiveGuidelines": [
#             "Use certified disease-free seeds",
#             "Maintain proper plant spacing",
#             "Avoid excessive nitrogen application"
#         ],
       
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Blast",
#         "cropType": "Wheat",
#         "description": "Fungal disease caused by Magnaporthe oryzae, causing bleached spikelets and significant yield loss under favorable conditions.",
#         "symptoms": ["Bleached spikelets", "White to gray lesions on heads", "Node infections", "Plant lodging"],
#         "solutions": ["Apply triazole fungicides", "Use blast-resistant varieties", "Apply silicon fertilizers", "Use strobilurin fungicides"],
#         "prevention": ["Avoid planting in blast-prone areas", "Use balanced fertilization", "Ensure proper drainage", "Remove infected plant debris"],
#         "treatmentSteps": [
#             "Identify infected heads early",
#             "Apply systemic fungicides promptly",
#             "Monitor weather conditions",
#             "Harvest early if severe infection"
#         ],
#         "preventiveGuidelines": [
#             "Plant at recommended times",
#             "Use integrated pest management",
#             "Monitor humidity levels"
#         ],
       
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Brown Rust",
#         "cropType": "Wheat",
#         "description": "Caused by Puccinia recondita, characterized by small, orange-brown pustules primarily on leaves, reducing photosynthetic area.",
#         "symptoms": ["Orange-brown pustules", "Yellow halos around lesions", "Premature leaf senescence", "Reduced grain size"],
#         "solutions": ["Apply triazole fungicides", "Use resistant cultivars", "Apply mixture fungicides", "Use biological controls"],
#         "prevention": ["Plant early maturing varieties", "Destroy green bridge plants", "Practice crop rotation", "Monitor regularly"],
#         "treatmentSteps": [
#             "Detect early leaf lesions",
#             "Apply fungicides at flag leaf stage",
#             "Use curative products if infection established",
#             "Repeat based on disease pressure"
#         ],
#         "preventiveGuidelines": [
#             "Avoid dense planting",
#             "Use balanced NPK fertilization",
#             "Remove volunteer wheat"
#         ],
    
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Common Root Rot",
#         "cropType": "Wheat",
#         "description": "Soil-borne fungal disease causing root decay, reduced nutrient uptake, and premature plant death under severe conditions.",
#         "symptoms": ["Brown root discoloration", "Stunted growth", "Yellowing lower leaves", "Poor tillering", "White heads"],
#         "solutions": ["Apply seed treatment fungicides", "Use resistant varieties", "Improve soil drainage", "Apply phosphonate fungicides"],
#         "prevention": ["Practice crop rotation", "Avoid continuous wheat cropping", "Improve soil organic matter", "Ensure proper drainage"],
#         "treatmentSteps": [
#             "Diagnose root health early",
#             "Apply soil drench fungicides",
#             "Improve soil conditions",
#             "Monitor plant recovery"
#         ],
#         "preventiveGuidelines": [
#             "Use certified treated seeds",
#             "Maintain soil pH around 6.0-7.0",
#             "Avoid compaction"
#         ],
   
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Fusarium Head Blight",
#         "cropType": "Wheat",
#         "description": "Also called scab, caused by Fusarium species, leading to bleached spikelets, shriveled grains, and mycotoxin contamination.",
#         "symptoms": ["Bleached spikelets", "Pink-orange mold", "Shriveled kernels", "Tombstone kernels"],
#         "solutions": ["Apply triazole fungicides at flowering", "Use resistant varieties", "Apply biological controls", "Use proper harvest timing"],
#         "prevention": ["Avoid planting after corn", "Use crop rotation", "Destroy infected residues", "Monitor weather during flowering"],
#         "treatmentSteps": [
#             "Apply fungicides at early flowering",
#             "Use products with good scab efficacy",
#             "Adjust harvest for infected fields",
#             "Test for mycotoxins"
#         ],
#         "preventiveGuidelines": [
#             "Plant moderately resistant varieties",
#             "Time fungicide application carefully",
#             "Manage crop residues"
#         ],
       
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Healthy",
#         "cropType": "Wheat",
#         "description": "Indicates a healthy wheat plant with no signs of disease or pest infestation, showing normal growth and development.",
#         "symptoms": ["Green leaves", "Normal growth", "No spots or discoloration", "Proper tillering"],
#         "solutions": [],
#         "prevention": ["Regular monitoring", "Balanced fertilization", "Proper irrigation", "Crop rotation"],
#         "treatmentSteps": None,
#         "preventiveGuidelines": ["Maintain soil health", "Use certified seeds", "Practice integrated pest management"],
        
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Leaf Blight",
#         "cropType": "Wheat",
#         "description": "Fungal disease causing elongated brown lesions on leaves, often starting from leaf tips and margins.",
#         "symptoms": ["Brown elongated lesions", "Yellow halos", "Leaf tip dieback", "Reduced photosynthetic area"],
#         "solutions": ["Apply chlorothalonil fungicides", "Use strobilurin products", "Apply copper-based fungicides", "Use resistant varieties"],
#         "prevention": ["Destroy crop residues", "Practice crop rotation", "Avoid overhead irrigation", "Use clean seeds"],
#         "treatmentSteps": [
#             "Identify early leaf spots",
#             "Apply protective fungicides",
#             "Use systemic products for control",
#             "Monitor disease progression"
#         ],
#         "preventiveGuidelines": [
#             "Maintain proper plant spacing",
#             "Avoid water stress",
#             "Use balanced fertilization"
#         ],
       
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Mildew",
#         "cropType": "Wheat",
#         "description": "Powdery mildew caused by Blumeria graminis, appearing as white powdery growth on leaves and stems.",
#         "symptoms": ["White powdery growth", "Yellowing leaves", "Stunted growth", "Reduced tillering"],
#         "solutions": ["Apply sulfur dust", "Use triazole fungicides", "Apply bicarbonate sprays", "Use milk solution as organic control"],
#         "prevention": ["Plant resistant varieties", "Avoid dense planting", "Ensure good air circulation", "Remove infected debris"],
#         "treatmentSteps": [
#             "Detect early powder formation",
#             "Apply fungicides at first sign",
#             "Use contact and systemic products",
#             "Repeat if conditions favorable"
#         ],
#         "preventiveGuidelines": [
#             "Avoid excessive nitrogen",
#             "Maintain proper plant density",
#             "Monitor humidity levels"
#         ],
      
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Mite",
#         "cropType": "Wheat",
#         "description": "Infestation by various mite species causing stippling, yellowing, and reduced plant vigor through sap feeding.",
#         "symptoms": ["Yellow stippling on leaves", "Fine webbing", "Leaf curling", "Bronzed appearance", "Stunted growth"],
#         "solutions": ["Apply miticides like abamectin", "Use insecticidal soaps", "Release predatory mites", "Apply horticultural oils"],
#         "prevention": ["Monitor field edges", "Maintain plant health", "Avoid water stress", "Remove weed hosts"],
#         "treatmentSteps": [
#             "Confirm mite presence",
#             "Apply selective miticides",
#             "Use biological controls",
#             "Monitor for resurgence"
#         ],
#         "preventiveGuidelines": [
#             "Avoid broad-spectrum insecticides",
#             "Conserve natural enemies",
#             "Maintain field hygiene"
#         ],
       
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Septoria",
#         "cropType": "Wheat",
#         "description": "Septoria leaf blotch caused by Zymoseptoria tritici, forming irregular brown lesions with black pycnidia.",
#         "symptoms": ["Brown irregular lesions", "Yellow halos", "Black pycnidia in centers", "Premature leaf death"],
#         "solutions": ["Apply triazole fungicides", "Use strobilurin products", "Apply mixture fungicides", "Use resistant varieties"],
#         "prevention": ["Destroy infected residues", "Practice crop rotation", "Use certified seeds", "Avoid early sowing"],
#         "treatmentSteps": [
#             "Monitor lower leaves first",
#             "Apply fungicides at flag leaf emergence",
#             "Use curative treatments if needed",
#             "Protect upper canopy"
#         ],
#         "preventiveGuidelines": [
#             "Use integrated disease management",
#             "Monitor weather conditions",
#             "Avoid high nitrogen rates"
#         ],
       
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Smut",
#         "cropType": "Wheat",
#         "description": "Fungal disease where grains are replaced by black spore masses, causing significant yield loss and quality reduction.",
#         "symptoms": ["Black powdery spore masses", "Transformed grains", "Soiled appearance", "Characteristic odor"],
#         "solutions": ["Use systemic seed treatments", "Apply carboxin fungicides", "Use hot water treatment", "Apply biological controls"],
#         "prevention": ["Use certified smut-free seeds", "Practice seed treatment", "Avoid contaminated equipment", "Destroy infected plants"],
#         "treatmentSteps": [
#             "Identify infected heads",
#             "Remove and destroy infected plants",
#             "Treat seeds for next season",
#             "Clean equipment thoroughly"
#         ],
#         "preventiveGuidelines": [
#             "Always use treated seeds",
#             "Maintain field sanitation",
#             "Rotate with non-host crops"
#         ],
       
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Stem Fly",
#         "cropType": "Wheat",
#         "description": "Insect pest whose larvae tunnel into wheat stems, causing dead hearts, white ears, and lodging.",
#         "symptoms": ["Dead hearts", "White ears", "Stem tunneling", "Lodging", "Reduced yield"],
#         "solutions": ["Apply systemic insecticides", "Use pheromone traps", "Apply neem-based products", "Use biological controls"],
#         "prevention": ["Destroy crop residues", "Practice deep plowing", "Use resistant varieties", "Monitor adult flies"],
#         "treatmentSteps": [
#             "Monitor for adult flies",
#             "Apply insecticides at egg-laying stage",
#             "Use stem protection products",
#             "Remove infected plants"
#         ],
#         "preventiveGuidelines": [
#             "Avoid late planting",
#             "Maintain field hygiene",
#             "Use integrated pest management"
#         ],
     
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Tan Spot",
#         "cropType": "Wheat",
#         "description": "Caused by Pyrenophora tritici-repentis, forming tan lesions with yellow halos on leaves, reducing photosynthetic capacity.",
#         "symptoms": ["Tan elliptical lesions", "Yellow halos", "Dark centers", "Leaf blighting", "Premature senescence"],
#         "solutions": ["Apply strobilurin fungicides", "Use triazole products", "Apply mixture fungicides", "Use resistant varieties"],
#         "prevention": ["Destroy wheat stubble", "Practice crop rotation", "Use clean tillage", "Avoid continuous wheat"],
#         "treatmentSteps": [
#             "Identify early leaf spots",
#             "Apply fungicides at tillering",
#             "Use systemic products",
#             "Protect flag leaves"
#         ],
#         "preventiveGuidelines": [
#             "Manage crop residues effectively",
#             "Use balanced fertilization",
#             "Monitor disease development"
#         ],
       
#     },
#     {
#         "id": str(uuid4()),
#         "diseaseName": "Yellow Rust",
#         "cropType": "Wheat",
#         "description": "Stripe rust caused by Puccinia striiformis, characterized by yellow-orange pustules arranged in stripes on leaves.",
#         "symptoms": ["Yellow-orange pustules", "Striped pattern on leaves", "Yellowing", "Reduced grain fill", "Premature senescence"],
#         "solutions": ["Apply triazole fungicides", "Use strobilurin products", "Apply mixture fungicides", "Use resistant varieties"],
#         "prevention": ["Plant resistant cultivars", "Avoid late planting", "Destroy green bridges", "Monitor regularly"],
#         "treatmentSteps": [
#             "Detect early stripe formation",
#             "Apply fungicides promptly",
#             "Use systemic products for control",
#             "Repeat if disease persists"
#         ],
#         "preventiveGuidelines": [
#             "Use certified disease-free seeds",
#             "Avoid excessive nitrogen",
#             "Maintain proper plant spacing"
#         ],
        
#     }
# ]

# from uuid import uuid4
# from datetime import datetime

# # Combined English and Urdu translations for all diseases
# combined_diseases_data = [
#     {
#         "diseaseKey": "bacterial_blight",
#         "cropType": "Cotton",
#         "translations": {
#             "en": {
#                 "diseaseName": "Bacterial Blight",
#                 "description": "A bacterial infection causing water-soaked lesions on leaves and stems, leading to reduced growth and yield.",
#                 "symptoms": ["Water-soaked lesions", "Leaf yellowing", "Necrotic spots"],
#                 "solutions": ["Use certified disease-free seeds", "Apply copper-based bactericides", "Remove infected plant parts"],
#                 "prevention": ["Crop rotation", "Avoid overhead irrigation", "Sanitize tools"],
#                 "treatmentSteps": ["Identify infected plants early", "Remove and destroy infected leaves", "Apply copper bactericide spray weekly"],
#                 "preventiveGuidelines": ["Rotate cotton with non-host crops", "Maintain proper field sanitation", "Monitor regularly for symptoms"]
#             },
#             "ur": {
#                 "diseaseName": "بیکٹیریل بلائٹ",
#                 "description": "ایک بیکٹیریل انفیکشن جو پتوں اور تنوں پر پانی سے بھرے زخم پیدا کرتا ہے، جس سے نشوونما اور پیداوار کم ہوتی ہے۔",
#                 "symptoms": ["پانی سے بھرے زخم", "پتوں کا پیلا پڑنا", "نیکروٹک دھبے"],
#                 "solutions": ["سرٹیفائیڈ بیماری سے پاک بیج استعمال کریں", "تانبے پر مبنی بیکٹیریسائڈز لگائیں", "متاثرہ پودوں کے حصے ہٹائیں"],
#                 "prevention": ["فصل کی گردش", "اوور ہیڈ آبپاشی سے گریز کریں", "اوزاروں کو صاف کریں"],
#                 "treatmentSteps": ["متاثرہ پودوں کو ابتدائی مرحلے میں شناخت کریں", "متاثرہ پتوں کو ہٹا کر تباہ کریں", "ہفتہ وار تانبے کا بیکٹیریسائڈ سپرے کریں"],
#                 "preventiveGuidelines": ["کپاس کو غیر میزبان فصلوں کے ساتھ گردش دیں", "مناسب کھیت کی صفائی برقرار رکھیں", "علامات کے لیے باقاعدگی سے نگرانی کریں"]
#             }
#         },
#         "createdAt": datetime.utcnow(),
#         "updatedAt": datetime.utcnow()
#     },
#     {
#         "diseaseKey": "curl_virus",
#         "cropType": "Cotton",
#         "translations": {
#             "en": {
#                 "diseaseName": "Curl Virus",
#                 "description": "A viral infection transmitted by whiteflies, causing leaf curling, distortion, and stunted growth.",
#                 "symptoms": ["Leaf curling", "Yellowing veins", "Stunted growth"],
#                 "solutions": ["Remove infected plants", "Control whitefly population", "Use resistant varieties"],
#                 "prevention": ["Regular field monitoring", "Install yellow sticky traps for whiteflies", "Practice crop rotation"],
#                 "treatmentSteps": ["Inspect plants for whiteflies", "Remove and destroy infected plants", "Spray insecticide if infestation is high"],
#                 "preventiveGuidelines": ["Use certified virus-free seeds", "Avoid planting cotton near other infected crops", "Monitor vector populations"]
#             },
#             "ur": {
#                 "diseaseName": "کرل وائرس",
#                 "description": "وائٹ فلائز کے ذریعے منتقل ہونے والا وائرس انفیکشن، جس سے پتوں کا مڑنا، بگاڑ اور نشوونما رک جاتی ہے۔",
#                 "symptoms": ["پتوں کا مڑنا", "رگوں کا پیلا پڑنا", "نشوونما رکنا"],
#                 "solutions": ["متاثرہ پودے ہٹائیں", "وائٹ فلائی آبادی کو کنٹرول کریں", "مزاحم اقسام استعمال کریں"],
#                 "prevention": ["کھیت کی باقاعدہ نگرانی", "وائٹ فلائز کے لیے پیلا چپکنے والا ٹریپ لگائیں", "فصل کی گردش کا طریقہ اپنائیں"],
#                 "treatmentSteps": ["پودوں کا وائٹ فلائز کے لیے معائنہ کریں", "متاثرہ پودوں کو ہٹا کر تباہ کریں", "اگر آبادی زیادہ ہو تو کیڑے مار دوا کا سپرے کریں"],
#                 "preventiveGuidelines": ["سرٹیفائیڈ وائرس سے پاک بیج استعمال کریں", "کپاس کو دوسری متاثرہ فصلوں کے قریب نہ لگائیں", "ویکٹر آبادی کی نگرانی کریں"]
#             }
#         },
#         "createdAt": datetime.utcnow(),
#         "updatedAt": datetime.utcnow()
#     },
#     {
#         "diseaseKey": "healthy_leaf",
#         "cropType": "Cotton",
#         "translations": {
#             "en": {
#                 "diseaseName": "Healthy Leaf",
#                 "description": "Indicates a healthy cotton leaf with no signs of disease or pest infestation.",
#                 "symptoms": ["Green leaf", "No spots", "Normal growth"],
#                 "solutions": [],
#                 "prevention": ["Maintain regular irrigation", "Monitor for pests regularly", "Apply balanced fertilizers"],
#                 "treatmentSteps": None,
#                 "preventiveGuidelines": ["Keep the field clean", "Rotate crops to prevent disease build-up"]
#             },
#             "ur": {
#                 "diseaseName": "صحت مند پتا",
#                 "description": "کپاس کا صحت مند پتا جس پر بیماری یا کیڑوں کے حملے کے کوئی آثار نہیں ہیں۔",
#                 "symptoms": ["سبز پتا", "کوئی دھبے نہیں", "عام نشوونما"],
#                 "solutions": [],
#                 "prevention": ["باقاعدہ آبپاشی برقرار رکھیں", "کیڑوں کے لیے باقاعدگی سے نگرانی کریں", "متوازن کھادیں ڈالیں"],
#                 "treatmentSteps": None,
#                 "preventiveGuidelines": ["کھیت کو صاف رکھیں", "بیماریوں کے جمع ہونے سے بچنے کے لیے فصلوں کی گردش کریں"]
#             }
#         },
#         "createdAt": datetime.utcnow(),
#         "updatedAt": datetime.utcnow()
#     },
#     {
#         "diseaseKey": "herbicide_growth_damage",
#         "cropType": "Cotton",
#         "translations": {
#             "en": {
#                 "diseaseName": "Herbicide Growth Damage",
#                 "description": "Damage caused by herbicide exposure leading to leaf yellowing, curling, and abnormal growth patterns.",
#                 "symptoms": ["Yellowing leaves", "Leaf curling", "Stunted growth"],
#                 "solutions": ["Stop herbicide application", "Provide adequate irrigation", "Apply foliar nutrients"],
#                 "prevention": ["Avoid herbicide drift", "Follow recommended doses", "Protect sensitive crops"],
#                 "treatmentSteps": ["Identify affected plants", "Wash off any herbicide residues", "Support recovery with proper fertilization"],
#                 "preventiveGuidelines": ["Use buffer zones", "Avoid spraying on windy days"]
#             },
#             "ur": {
#                 "diseaseName": "ہربیسائڈ کے ذریعے نقصان",
#                 "description": "ہربیسائڈ کی نمائش کی وجہ سے پتوں کا پیلا پڑنا، مڑنا اور غیر معمولی نشوونما کے نمونے۔",
#                 "symptoms": ["پیلا پڑتے پتے", "پتوں کا مڑنا", "نشوونما رکنا"],
#                 "solutions": ["ہربیسائڈ کا استعمال بند کریں", "مناسب آبپاشی فراہم کریں", "پتوں کی کھادیں ڈالیں"],
#                 "prevention": ["ہربیسائڈ کے اڑنے سے بچیں", "تجویز کردہ خوراکیں استعمال کریں", "حساس فصلوں کی حفاظت کریں"],
#                 "treatmentSteps": ["متاثرہ پودوں کی شناخت کریں", "کوئی بھی ہربیسائڈ کے باقیات دھو دیں", "مناسب کھاد کے ساتھ بحالی کو سپورٹ کریں"],
#                 "preventiveGuidelines": ["بفر زونز استعمال کریں", "ہوادار دنوں میں سپرے سے گریز کریں"]
#             }
#         },
#         "createdAt": datetime.utcnow(),
#         "updatedAt": datetime.utcnow()
#     },
#     {
#         "diseaseKey": "leaf_hopper_jassids",
#         "cropType": "Cotton",
#         "translations": {
#             "en": {
#                 "diseaseName": "Leaf Hopper Jassids",
#                 "description": "Infestation of leaf hoppers causing yellowing, curling, and stunted growth due to sap-sucking.",
#                 "symptoms": ["Yellowing leaves", "Curling of leaf edges", "Stunted growth"],
#                 "solutions": ["Apply neem-based insecticides", "Introduce natural predators", "Spray systemic insecticides"],
#                 "prevention": ["Regular field inspection", "Maintain plant spacing", "Remove weeds nearby"],
#                 "treatmentSteps": ["Monitor hopper population weekly", "Apply neem oil spray early morning", "Release natural predators like ladybugs"],
#                 "preventiveGuidelines": ["Avoid over-fertilization", "Keep fields weed-free"]
#             },
#             "ur": {
#                 "diseaseName": "لیف ہاپر جیسڈز",
#                 "description": "لیف ہاپرز کا حملہ جس کی وجہ سے رس چوسنے سے پتوں کا پیلا پڑنا، مڑنا اور نشوونما رک جاتی ہے۔",
#                 "symptoms": ["پیلا پڑتے پتے", "پتوں کے کناروں کا مڑنا", "نشوونما رکنا"],
#                 "solutions": ["نیم پر مبنی کیڑے مار ادویات لگائیں", "قدرتی شکاری متعارف کرائیں", "سسٹمک کیڑے مار ادویات کا سپرے کریں"],
#                 "prevention": ["کھیت کا باقاعدہ معائنہ", "پودوں کے درمیان مناسب فاصلہ برقرار رکھیں", "قریبی گھاس پھوس ہٹائیں"],
#                 "treatmentSteps": ["ہاپر آبادی کی ہفتہ وار نگرانی کریں", "صبح سویرے نیم کے تیل کا سپرے کریں", "لیڈی بگز جیسے قدرتی شکاری چھوڑیں"],
#                 "preventiveGuidelines": ["ضرورت سے زیادہ کھاد سے پرہیز کریں", "کھیتوں کو گھاس پھوس سے پاک رکھیں"]
#             }
#         },
#         "createdAt": datetime.utcnow(),
#         "updatedAt": datetime.utcnow()
#     },
#     {
#         "diseaseKey": "leaf_redding",
#         "cropType": "Cotton",
#         "translations": {
#             "en": {
#                 "diseaseName": "Leaf Redding",
#                 "description": "Leaves turn reddish or brown due to nutrient deficiencies, often caused by potassium or magnesium shortage.",
#                 "symptoms": ["Reddish-brown leaves", "Yellowing along veins", "Reduced yield"],
#                 "solutions": ["Apply potassium-magnesium fertilizers", "Improve soil pH", "Maintain balanced fertilization schedule"],
#                 "prevention": ["Soil testing before planting", "Avoid overwatering", "Apply compost regularly"],
#                 "treatmentSteps": ["Identify deficiency symptoms", "Correct soil nutrient imbalance", "Apply foliar sprays if needed"],
#                 "preventiveGuidelines": ["Regularly monitor soil nutrients", "Follow fertilization guidelines"]
#             },
#             "ur": {
#                 "diseaseName": "پتے کا سرخ ہونا",
#                 "description": "پتے غذائی اجزاء کی کمی کی وجہ سے سرخی مائل یا بھورے ہو جاتے ہیں، جو اکثر پوٹاشیم یا میگنیشیم کی کمی کی وجہ سے ہوتا ہے۔",
#                 "symptoms": ["سرخی مائل بھورے پتے", "رگوں کے ساتھ پیلا پڑنا", "پیداوار میں کمی"],
#                 "solutions": ["پوٹاشیم-میگنیشیم کھادیں ڈالیں", "مٹی کا پی ایچ بہتر بنائیں", "متوازن کھاد کا شیڈول برقرار رکھیں"],
#                 "prevention": ["پودے لگانے سے پہلے مٹی کا ٹیسٹ کروائیں", "ضرورت سے زیادہ پانی دینے سے گریز کریں", "کمپوسٹ باقاعدگی سے ڈالیں"],
#                 "treatmentSteps": ["کمی کی علامات کی شناخت کریں", "مٹی کے غذائی اجزاء کے عدم توازن کو درست کریں", "اگر ضرورت ہو تو پتوں کے سپرے ڈالیں"],
#                 "preventiveGuidelines": ["مٹی کے غذائی اجزاء کی باقاعدہ نگرانی کریں", "کھاد کے رہنما اصولوں پر عمل کریں"]
#             }
#         },
#         "createdAt": datetime.utcnow(),
#         "updatedAt": datetime.utcnow()
#     },
#     {
#         "diseaseKey": "leaf_variegation",
#         "cropType": "Cotton",
#         "translations": {
#             "en": {
#                 "diseaseName": "Leaf Variegation",
#                 "description": "Appearance of leaves with yellow or white patches, sometimes caused by virus, genetic mutation, or nutrient imbalance.",
#                 "symptoms": ["Yellow/white leaf patches", "Uneven coloring", "Occasional stunted growth"],
#                 "solutions": ["Remove infected leaves if viral", "Correct nutrient imbalance", "Plant resistant varieties"],
#                 "prevention": ["Regular nutrient monitoring", "Avoid virus-infected plants nearby"],
#                 "treatmentSteps": ["Assess cause (viral or nutrient)", "Apply corrective fertilizers", "Monitor for spread"],
#                 "preventiveGuidelines": ["Use clean seeds", "Maintain field hygiene"]
#             },
#             "ur": {
#                 "diseaseName": "پتے کی مختلف رنگیں",
#                 "description": "پیلے یا سفید دھبوں والے پتوں کا ظاہر ہونا، کبھی کبھی وائرس، جینیاتی تغیر، یا غذائی عدم توازن کی وجہ سے ہوتا ہے۔",
#                 "symptoms": ["پیلے/سفید پتے کے دھبے", "غیر متوازن رنگ", "کبھی کبھار نشوونما رکنا"],
#                 "solutions": ["اگر وائرل ہو تو متاثرہ پتے ہٹائیں", "غذائی عدم توازن کو درست کریں", "مزاحم اقسام لگائیں"],
#                 "prevention": ["غذائی اجزاء کی باقاعدہ نگرانی", "قریب کے وائرس سے متاثرہ پودوں سے گریز کریں"],
#                 "treatmentSteps": ["وجہ کا اندازہ لگائیں (وائرل یا غذائی)", "اصلاحی کھادیں ڈالیں", "پھیلاؤ کی نگرانی کریں"],
#                 "preventiveGuidelines": ["صاف بیج استعمال کریں", "کھیت کی حفظان صحت برقرار رکھیں"]
#             }
#         },
#         "createdAt": datetime.utcnow(),
#         "updatedAt": datetime.utcnow()
#     },
#     {
#         "diseaseKey": "aphid",
#         "cropType": "Wheat",
#         "translations": {
#             "en": {
#                 "diseaseName": "Aphid",
#                 "description": "Small sap-sucking insects that colonize wheat plants, causing yellowing, stunted growth, and reduced yield. They can also transmit viral diseases.",
#                 "symptoms": ["Yellowing leaves", "Stunted growth", "Honeydew secretion", "Sooty mold growth", "Curling leaves"],
#                 "solutions": ["Apply imidacloprid or thiamethoxam", "Use insecticidal soaps", "Release natural predators like ladybugs", "Apply neem oil spray"],
#                 "prevention": ["Monitor fields regularly", "Use resistant varieties", "Avoid excessive nitrogen fertilization", "Maintain field sanitation"],
#                 "treatmentSteps": ["Identify aphid colonies early", "Apply systemic insecticides if threshold exceeded", "Use foliar sprays for immediate control", "Monitor for re-infestation"],
#                 "preventiveGuidelines": ["Plant early to avoid peak aphid season", "Use yellow sticky traps for monitoring", "Conserve natural enemy populations"]
#             },
#             "ur": {
#                 "diseaseName": "افڈ",
#                 "description": "چھوٹے رس چوسنے والے کیڑے جو گندم کے پودوں پر آباد ہوتے ہیں، جس سے پیلا پڑنا، نشوونما رکنا اور پیداوار کم ہوتی ہے۔ وہ وائرل بیماریاں بھی منتقل کر سکتے ہیں۔",
#                 "symptoms": ["پیلا پڑتے پتے", "نشوونما رکنا", "ہنی ڈیو کا اخراج", "سوٹی مولڈ کی نشوونما", "مڑتے پتے"],
#                 "solutions": ["امیڈاکلوپرڈ یا تھائیامیتھوکسام لگائیں", "کیڑے مار صابن استعمال کریں", "لیڈی بگز جیسے قدرتی شکاری چھوڑیں", "نیم کے تیل کا سپرے کریں"],
#                 "prevention": ["کھیتوں کی باقاعدہ نگرانی کریں", "مزاحم اقسام استعمال کریں", "ضرورت سے زیادہ نائٹروجن کھاد سے پرہیز کریں", "کھیت کی صفائی برقرار رکھیں"],
#                 "treatmentSteps": ["افڈ کالونیوں کو ابتدائی مرحلے میں شناخت کریں", "اگر حد سے زیادہ ہو تو سسٹمک کیڑے مار ادویات لگائیں", "فوری کنٹرول کے لیے پتوں کے سپرے استعمال کریں", "دوبارہ حملے کی نگرانی کریں"],
#                 "preventiveGuidelines": ["افڈ کے موسم سے بچنے کے لیے جلد پودے لگائیں", "نگرانی کے لیے پیلا چپکنے والا ٹریپ استعمال کریں", "قدرتی دشمن آبادی کو محفوظ رکھیں"]
#             }
#         },
#         "createdAt": datetime.utcnow(),
#         "updatedAt": datetime.utcnow()
#     },
#     {
#         "diseaseKey": "black_rust",
#         "cropType": "Wheat",
#         "translations": {
#             "en": {
#                 "diseaseName": "Black Rust",
#                 "description": "Also known as stem rust, caused by fungus Puccinia graminis. Characterized by dark reddish-brown pustules on stems and leaves.",
#                 "symptoms": ["Dark reddish-brown pustules", "Blisters on stems and leaves", "Premature leaf death", "Reduced grain fill"],
#                 "solutions": ["Apply fungicides like triazoles", "Use resistant varieties", "Remove volunteer wheat plants", "Apply strobilurin-based fungicides"],
#                 "prevention": ["Plant resistant cultivars", "Destroy crop residues", "Avoid late planting", "Practice crop rotation"],
#                 "treatmentSteps": ["Monitor for early symptoms", "Apply protective fungicides at first sign", "Use systemic fungicides for established infections", "Repeat application if needed"],
#                 "preventiveGuidelines": ["Use certified disease-free seeds", "Maintain proper plant spacing", "Monitor fields regularly"]
#             },
#             "ur": {
#                 "diseaseName": "کالی زنگ",
#                 "description": "جسے اسٹیم رسٹ بھی کہا جاتا ہے، فنگس Puccinia graminis کی وجہ سے ہوتا ہے۔ تنوں اور پتوں پر گہرے سرخ بھورے دانوں کے ذریعے پہچانا جاتا ہے۔",
#                 "symptoms": ["گہرے سرخ بھورے دانے", "تنے اور پتوں پر چھالیں", "ابتدائی پتے مرنا", "پیداوار میں کمی"],
#                 "solutions": ["ٹریازول جیسے فنگسائڈز لگائیں", "مزاحم اقسام استعمال کریں", "رضاکارانہ گندم کے پودے ہٹائیں", "سٹروبیلورین پر مبنی فنگسائڈز لگائیں"],
#                 "prevention": ["مزاحم قسمیں لگائیں", "فصل کے باقیات کو تباہ کریں", "دیر سے بوائی سے گریز کریں", "فصل کی گردش کریں"],
#                 "treatmentSteps": ["ابتدائی علامات کی نگرانی کریں", "پہلے آثار پر حفاظتی فنگسائڈ لگائیں", "مستقل انفیکشن کے لیے سسٹمک فنگسائڈ استعمال کریں", "ضرورت پڑنے پر دوبارہ لگائیں"],
#                 "preventiveGuidelines": ["سرٹیفائیڈ بیماری سے پاک بیج استعمال کریں", "مناسب پودے کے فاصلے برقرار رکھیں", "کھیتوں کی باقاعدہ نگرانی کریں"]
#             }
#         },
#         "createdAt": datetime.utcnow(),
#         "updatedAt": datetime.utcnow()
#     },
#     {
#         "diseaseKey": "brown_rust",
#         "cropType": "Wheat",
#         "translations": {
#             "en": {
#                 "diseaseName": "Brown Rust",
#                 "description": "Caused by the fungus Puccinia triticina, resulting in small, reddish-brown pustules mainly on leaf surfaces.",
#                 "symptoms": ["Reddish-brown pustules on leaves", "Premature leaf drying", "Reduced photosynthesis", "Lower grain yield"],
#                 "solutions": ["Use resistant varieties", "Apply fungicides if outbreak occurs", "Remove infected plant debris"],
#                 "prevention": ["Plant resistant cultivars", "Practice crop rotation", "Destroy volunteer wheat plants"],
#                 "treatmentSteps": ["Scout fields weekly", "Apply protective fungicides", "Remove severely infected leaves"],
#                 "preventiveGuidelines": ["Avoid late sowing", "Monitor regularly for early infection"]
#             },
#             "ur": {
#                 "diseaseName": "بھوری زنگ",
#                 "description": "فنگس Puccinia triticina کی وجہ سے پیدا ہونے والی بیماری، جس سے پتوں پر چھوٹے سرخ بھورے دانے بنتے ہیں۔",
#                 "symptoms": ["پتوں پر سرخ بھورے دانے", "ابتدائی پتوں کا خشک ہونا", "فوٹوسنتھیسس میں کمی", "پیداوار میں کمی"],
#                 "solutions": ["مزاحم اقسام استعمال کریں", "اگر حملہ ہو تو فنگسائڈ لگائیں", "متاثرہ پودوں کو ہٹا دیں"],
#                 "prevention": ["مزاحم اقسام لگائیں", "فصل کی گردش کریں", "رضاکارانہ گندم کے پودے تباہ کریں"],
#                 "treatmentSteps": ["کھیت کی ہفتہ وار نگرانی کریں", "حفاظتی فنگسائڈ لگائیں", "شدید متاثرہ پتے ہٹا دیں"],
#                 "preventiveGuidelines": ["دیر سے بوائی سے بچیں", "ابتدائی علامات کی نگرانی کریں"]
#             }
#         },
#         "createdAt": datetime.utcnow(),
#         "updatedAt": datetime.utcnow()
#     },
#     {
#         "diseaseKey": "yellow_rust",
#         "cropType": "Wheat",
#         "translations": {
#             "en": {
#                 "diseaseName": "Yellow Rust",
#                 "description": "Caused by the fungus Puccinia striiformis, forming yellow-orange pustules along leaf veins, reducing yield.",
#                 "symptoms": ["Yellow-orange stripes on leaves", "Leaf curling", "Premature leaf death", "Reduced photosynthesis"],
#                 "solutions": ["Use resistant varieties", "Apply fungicides", "Remove volunteer wheat plants"],
#                 "prevention": ["Monitor fields regularly", "Plant resistant cultivars", "Practice crop rotation"],
#                 "treatmentSteps": ["Inspect crops for pustules", "Apply fungicides when detected", "Remove severely infected leaves"],
#                 "preventiveGuidelines": ["Avoid late sowing", "Maintain proper spacing between plants"]
#             },
#             "ur": {
#                 "diseaseName": "پیلی زنگ",
#                 "description": "فنگس Puccinia striiformis کی وجہ سے پیدا ہونے والی بیماری، جو پتوں کی رگوں کے ساتھ پیلا-نارنجی دانے بناتی ہے اور پیداوار کم کرتی ہے۔",
#                 "symptoms": ["پتوں پر پیلا-نارنجی دھاری", "پتوں کا مڑنا", "ابتدائی پتوں کا مرنا", "فوٹوسنتھیسس میں کمی"],
#                 "solutions": ["مزاحم اقسام لگائیں", "فنگسائڈ لگائیں", "رضاکارانہ گندم کے پودے ہٹا دیں"],
#                 "prevention": ["کھیتوں کی باقاعدہ نگرانی کریں", "مزاحم اقسام لگائیں", "فصل کی گردش کریں"],
#                 "treatmentSteps": ["پودوں کا معائنہ کریں", "دریافت ہونے پر فنگسائڈ لگائیں", "شدید متاثرہ پتے ہٹا دیں"],
#                 "preventiveGuidelines": ["دیر سے بوائی سے بچیں", "پودوں کے درمیان مناسب فاصلہ رکھیں"]
#             }
#         },
#         "createdAt": datetime.utcnow(),
#         "updatedAt": datetime.utcnow()
#     },
#     {
#         "diseaseKey": "powdery_mildew",
#         "cropType": "Wheat",
#         "translations": {
#             "en": {
#                 "diseaseName": "Powdery Mildew",
#                 "description": "Caused by fungus Blumeria graminis, appearing as white powdery patches on leaf surfaces and stems.",
#                 "symptoms": ["White powdery patches", "Curling leaves", "Distorted growth", "Reduced grain filling"],
#                 "solutions": ["Apply sulfur or triazole fungicides", "Use resistant varieties", "Remove infected plant debris"],
#                 "prevention": ["Plant resistant cultivars", "Avoid excessive nitrogen fertilization", "Maintain field hygiene"],
#                 "treatmentSteps": ["Inspect crops regularly", "Apply fungicides at early signs", "Remove heavily infected leaves"],
#                 "preventiveGuidelines": ["Avoid dense planting", "Rotate crops to prevent buildup"]
#             },
#             "ur": {
#                 "diseaseName": "پاؤڈر ملیو",
#                 "description": "فنگس Blumeria graminis کی وجہ سے پیدا ہونے والی بیماری، جو پتوں اور تنوں پر سفید پاؤڈر کے دھبے بناتی ہے۔",
#                 "symptoms": ["سفید پاؤڈر کے دھبے", "پتوں کا مڑنا", "بگاڑی ہوئی نشوونما", "پیداوار میں کمی"],
#                 "solutions": ["گندھک یا ٹریازول فنگسائڈ لگائیں", "مزاحم اقسام استعمال کریں", "متاثرہ پودوں کو ہٹا دیں"],
#                 "prevention": ["مزاحم اقسام لگائیں", "ضرورت سے زیادہ نائٹروجن کھاد سے گریز کریں", "کھیت کی صفائی برقرار رکھیں"],
#                 "treatmentSteps": ["کھیت کی باقاعدہ نگرانی کریں", "ابتدائی علامات پر فنگسائڈ لگائیں", "شدید متاثرہ پتے ہٹا دیں"],
#                 "preventiveGuidelines": ["گنجان بوائی سے پرہیز کریں", "فصل کی گردش کریں"]
#             }
#         },
#         "createdAt": datetime.utcnow(),
#         "updatedAt": datetime.utcnow()
#     },
#     {
#         "diseaseKey": "leaf_spot",
#         "cropType": "Wheat",
#         "translations": {
#             "en": {
#                 "diseaseName": "Leaf Spot",
#                 "description": "Fungal infection causing brown or black spots on wheat leaves, reducing photosynthetic area and yield.",
#                 "symptoms": ["Brown/black spots on leaves", "Leaf yellowing around spots", "Premature leaf drop", "Reduced grain fill"],
#                 "solutions": ["Apply appropriate fungicides", "Remove infected plant debris", "Use resistant varieties"],
#                 "prevention": ["Practice crop rotation", "Maintain proper field sanitation", "Avoid overhead irrigation"],
#                 "treatmentSteps": ["Identify infected leaves early", "Apply fungicides on time", "Remove severely affected leaves"],
#                 "preventiveGuidelines": ["Monitor fields regularly", "Use certified disease-free seeds"]
#             },
#             "ur": {
#                 "diseaseName": "پتے کے دھبے",
#                 "description": "فنگل انفیکشن جو گندم کے پتوں پر بھورے یا کالے دھبے پیدا کرتا ہے، فوٹوسنتھیسس کی جگہ کم کرتا ہے اور پیداوار کم کرتا ہے۔",
#                 "symptoms": ["پتوں پر بھورے/کالے دھبے", "دھبوں کے گرد پتوں کا پیلا پڑنا", "ابتدائی پتوں کا گرنا", "پیداوار میں کمی"],
#                 "solutions": ["مناسب فنگسائڈ لگائیں", "متاثرہ پودوں کو ہٹا دیں", "مزاحم اقسام استعمال کریں"],
#                 "prevention": ["فصل کی گردش کریں", "کھیت کی صفائی برقرار رکھیں", "اوور ہیڈ آبپاشی سے بچیں"],
#                 "treatmentSteps": ["متاثرہ پتوں کی ابتدائی شناخت کریں", "وقت پر فنگسائڈ لگائیں", "شدید متاثرہ پتے ہٹا دیں"],
#                 "preventiveGuidelines": ["کھیت کی باقاعدہ نگرانی کریں", "سرٹیفائیڈ بیماری سے پاک بیج استعمال کریں"]
#             }
#         },
#         "createdAt": datetime.utcnow(),
#         "updatedAt": datetime.utcnow()
#     }
   
# ]

# # You can now insert this list into MongoDB using Motor or PyMongo



import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
import logging
from typing import List, Dict
from enum import Enum

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Enum definitions
class CropType(str, Enum):
    wheat = "Wheat"
    cotton = "Cotton"

# Disease data with English and Urdu translations
cotton_diseases_data = [
    {
        "diseaseKey": "bacterial_blight",
        "cropType": CropType.cotton,
        "translations": {
            "en": {
                "diseaseName": "Bacterial Blight",
                "description": "A bacterial infection causing water-soaked lesions on leaves and stems, leading to reduced growth and yield.",
                "symptoms": ["Water-soaked lesions", "Leaf yellowing", "Necrotic spots"],
                "solutions": ["Use certified disease-free seeds", "Apply copper-based bactericides", "Remove infected plant parts"],
                "prevention": ["Crop rotation", "Avoid overhead irrigation", "Sanitize tools"],
                "treatmentSteps": [
                    "Identify infected plants early",
                    "Remove and destroy infected leaves",
                    "Apply copper bactericide spray weekly"
                ],
                "preventiveGuidelines": [
                    "Rotate cotton with non-host crops",
                    "Maintain proper field sanitation",
                    "Monitor regularly for symptoms"
                ]
            },
            "ur": {
                "diseaseName": "بیکٹیریل بلائٹ",
                "description": "ایک بیکٹیریل انفیکشن جو پتوں اور تنوں پر پانی سے بھرے زخم پیدا کرتا ہے، جس سے نشوونما اور پیداوار کم ہوتی ہے۔",
                "symptoms": ["پانی سے بھرے زخم", "پتوں کا پیلا پڑنا", "نیکروٹک دھبے"],
                "solutions": ["سرٹیفائیڈ بیماری سے پاک بیج استعمال کریں", "تانبے پر مبنی بیکٹیریسائڈز لگائیں", "متاثرہ پودوں کے حصے ہٹائیں"],
                "prevention": ["فصل کی گردش", "اوور ہیڈ آبپاشی سے گریز کریں", "اوزاروں کو صاف کریں"],
                "treatmentSteps": [
                    "متاثرہ پودوں کو ابتدائی مرحلے میں شناخت کریں",
                    "متاثرہ پتوں کو ہٹا کر تباہ کریں",
                    "ہفتہ وار تانبے کا بیکٹیریسائڈ سپرے کریں"
                ],
                "preventiveGuidelines": [
                    "کپاس کو غیر میزبان فصلوں کے ساتھ گردش دیں",
                    "مناسب کھیت کی صفائی برقرار رکھیں",
                    "علامات کے لیے باقاعدگی سے نگرانی کریں"
                ]
            }
        }
    },
    {
        "diseaseKey": "curl_virus",
        "cropType": CropType.cotton,
        "translations": {
            "en": {
                "diseaseName": "Curl Virus",
                "description": "A viral infection transmitted by whiteflies, causing leaf curling, distortion, and stunted growth.",
                "symptoms": ["Leaf curling", "Yellowing veins", "Stunted growth"],
                "solutions": ["Remove infected plants", "Control whitefly population", "Use resistant varieties"],
                "prevention": ["Regular field monitoring", "Install yellow sticky traps for whiteflies", "Practice crop rotation"],
                "treatmentSteps": [
                    "Inspect plants for whiteflies",
                    "Remove and destroy infected plants",
                    "Spray insecticide if infestation is high"
                ],
                "preventiveGuidelines": [
                    "Use certified virus-free seeds",
                    "Avoid planting cotton near other infected crops",
                    "Monitor vector populations"
                ]
            },
            "ur": {
                "diseaseName": "کرل وائرس",
                "description": "وائٹ فلائز کے ذریعے منتقل ہونے والا وائرس انفیکشن، جس سے پتوں کا مڑنا، بگاڑ اور نشوونما رک جاتی ہے۔",
                "symptoms": ["پتوں کا مڑنا", "رگوں کا پیلا پڑنا", "نشوونما رکنا"],
                "solutions": ["متاثرہ پودے ہٹائیں", "وائٹ فلائی آبادی کو کنٹرول کریں", "مزاحم اقسام استعمال کریں"],
                "prevention": ["کھیت کی باقاعدہ نگرانی", "وائٹ فلائز کے لیے پیلا چپکنے والا ٹریپ لگائیں", "فصل کی گردش کا طریقہ اپنائیں"],
                "treatmentSteps": [
                    "پودوں کا وائٹ فلائز کے لیے معائنہ کریں",
                    "متاثرہ پودوں کو ہٹا کر تباہ کریں",
                    "اگر آبادی زیادہ ہو تو کیڑے مار دوا کا سپرے کریں"
                ],
                "preventiveGuidelines": [
                    "سرٹیفائیڈ وائرس سے پاک بیج استعمال کریں",
                    "کپاس کو دوسری متاثرہ فصلوں کے قریب نہ لگائیں",
                    "ویکٹر آبادی کی نگرانی کریں"
                ]
            }
        }
    },
    {
        "diseaseKey": "healthy_leaf",
        "cropType": CropType.cotton,
        "translations": {
            "en": {
                "diseaseName": "Healthy Leaf",
                "description": "Indicates a healthy cotton leaf with no signs of disease or pest infestation.",
                "symptoms": ["Green leaf", "No spots", "Normal growth"],
                "solutions": [],
                "prevention": ["Maintain regular irrigation", "Monitor for pests regularly", "Apply balanced fertilizers"],
                "treatmentSteps": None,
                "preventiveGuidelines": ["Keep the field clean", "Rotate crops to prevent disease build-up"]
            },
            "ur": {
                "diseaseName": "صحت مند پتا",
                "description": "کپاس کا صحت مند پتا جس پر بیماری یا کیڑوں کے حملے کے کوئی آثار نہیں ہیں۔",
                "symptoms": ["سبز پتا", "کوئی دھبے نہیں", "عام نشوونما"],
                "solutions": [],
                "prevention": ["باقاعدہ آبپاشی برقرار رکھیں", "کیڑوں کے لیے باقاعدگی سے نگرانی کریں", "متوازن کھادیں ڈالیں"],
                "treatmentSteps": None,
                "preventiveGuidelines": ["کھیت کو صاف رکھیں", "بیماریوں کے جمع ہونے سے بچنے کے لیے فصلوں کی گردش کریں"]
            }
        }
    },
    {
        "diseaseKey": "herbicide_growth_damage",
        "cropType": CropType.cotton,
        "translations": {
            "en": {
                "diseaseName": "Herbicide Growth Damage",
                "description": "Damage caused by herbicide exposure leading to leaf yellowing, curling, and abnormal growth patterns.",
                "symptoms": ["Yellowing leaves", "Leaf curling", "Stunted growth"],
                "solutions": ["Stop herbicide application", "Provide adequate irrigation", "Apply foliar nutrients"],
                "prevention": ["Avoid herbicide drift", "Follow recommended doses", "Protect sensitive crops"],
                "treatmentSteps": [
                    "Identify affected plants",
                    "Wash off any herbicide residues",
                    "Support recovery with proper fertilization"
                ],
                "preventiveGuidelines": ["Use buffer zones", "Avoid spraying on windy days"]
            },
            "ur": {
                "diseaseName": "ہربیسائڈ کے ذریعے نقصان",
                "description": "ہربیسائڈ کی نمائش کی وجہ سے پتوں کا پیلا پڑنا، مڑنا اور غیر معمولی نشوونما کے نمونے۔",
                "symptoms": ["پیلا پڑتے پتے", "پتوں کا مڑنا", "نشوونما رکنا"],
                "solutions": ["ہربیسائڈ کا استعمال بند کریں", "مناسب آبپاشی فراہم کریں", "پتوں کی کھادیں ڈالیں"],
                "prevention": ["ہربیسائڈ کے اڑنے سے بچیں", "تجویز کردہ خوراکیں استعمال کریں", "حساس فصلوں کی حفاظت کریں"],
                "treatmentSteps": [
                    "متاثرہ پودوں کی شناخت کریں",
                    "کوئی بھی ہربیسائڈ کے باقیات دھو دیں",
                    "مناسب کھاد کے ساتھ بحالی کو سپورٹ کریں"
                ],
                "preventiveGuidelines": ["بفر زونز استعمال کریں", "ہوادار دنوں میں سپرے سے گریز کریں"]
            }
        }
    },
    {
        "diseaseKey": "leaf_hopper_jassids",
        "cropType": CropType.cotton,
        "translations": {
            "en": {
                "diseaseName": "Leaf Hopper Jassids",
                "description": "Infestation of leaf hoppers causing yellowing, curling, and stunted growth due to sap-sucking.",
                "symptoms": ["Yellowing leaves", "Curling of leaf edges", "Stunted growth"],
                "solutions": ["Apply neem-based insecticides", "Introduce natural predators", "Spray systemic insecticides"],
                "prevention": ["Regular field inspection", "Maintain plant spacing", "Remove weeds nearby"],
                "treatmentSteps": [
                    "Monitor hopper population weekly",
                    "Apply neem oil spray early morning",
                    "Release natural predators like ladybugs"
                ],
                "preventiveGuidelines": ["Avoid over-fertilization", "Keep fields weed-free"]
            },
            "ur": {
                "diseaseName": "لیف ہاپر جیسڈز",
                "description": "لیف ہاپرز کا حملہ جس کی وجہ سے رس چوسنے سے پتوں کا پیلا پڑنا، مڑنا اور نشوونما رک جاتی ہے۔",
                "symptoms": ["پیلا پڑتے پتے", "پتوں کے کناروں کا مڑنا", "نشوونما رکنا"],
                "solutions": ["نیم پر مبنی کیڑے مار ادویات لگائیں", "قدرتی شکاری متعارف کرائیں", "سسٹمک کیڑے مار ادویات کا سپرے کریں"],
                "prevention": ["کھیت کا باقاعدہ معائنہ", "پودوں کے درمیان مناسب فاصلہ برقرار رکھیں", "قریبی گھاس پھوس ہٹائیں"],
                "treatmentSteps": [
                    "ہاپر آبادی کی ہفتہ وار نگرانی کریں",
                    "صبح سویرے نیم کے تیل کا سپرے کریں",
                    "لیڈی بگز جیسے قدرتی شکاری چھوڑیں"
                ],
                "preventiveGuidelines": ["ضرورت سے زیادہ کھاد سے پرہیز کریں", "کھیتوں کو گھاس پھوس سے پاک رکھیں"]
            }
        }
    },
    {
        "diseaseKey": "leaf_redding",
        "cropType": CropType.cotton,
        "translations": {
            "en": {
                "diseaseName": "Leaf Redding",
                "description": "Leaves turn reddish or brown due to nutrient deficiencies, often caused by potassium or magnesium shortage.",
                "symptoms": ["Reddish-brown leaves", "Yellowing along veins", "Reduced yield"],
                "solutions": ["Apply potassium-magnesium fertilizers", "Improve soil pH", "Maintain balanced fertilization schedule"],
                "prevention": ["Soil testing before planting", "Avoid overwatering", "Apply compost regularly"],
                "treatmentSteps": [
                    "Identify deficiency symptoms",
                    "Correct soil nutrient imbalance",
                    "Apply foliar sprays if needed"
                ],
                "preventiveGuidelines": ["Regularly monitor soil nutrients", "Follow fertilization guidelines"]
            },
            "ur": {
                "diseaseName": "پتے کا سرخ ہونا",
                "description": "پتے غذائی اجزاء کی کمی کی وجہ سے سرخی مائل یا بھورے ہو جاتے ہیں، جو اکثر پوٹاشیم یا میگنیشیم کی کمی کی وجہ سے ہوتا ہے۔",
                "symptoms": ["سرخی مائل بھورے پتے", "رگوں کے ساتھ پیلا پڑنا", "پیداوار میں کمی"],
                "solutions": ["پوٹاشیم-میگنیشیم کھادیں ڈالیں", "مٹی کا پی ایچ بہتر بنائیں", "متوازن کھاد کا شیڈول برقرار رکھیں"],
                "prevention": ["پودے لگانے سے پہلے مٹی کا ٹیسٹ کروائیں", "ضرورت سے زیادہ پانی دینے سے گریز کریں", "کمپوسٹ باقاعدگی سے ڈالیں"],
                "treatmentSteps": [
                    "کمی کی علامات کی شناخت کریں",
                    "مٹی کے غذائی اجزاء کے عدم توازن کو درست کریں",
                    "اگر ضرورت ہو تو پتوں کے سپرے ڈالیں"
                ],
                "preventiveGuidelines": ["مٹی کے غذائی اجزاء کی باقاعدہ نگرانی کریں", "کھاد کے رہنما اصولوں پر عمل کریں"]
            }
        }
    },
    {
        "diseaseKey": "leaf_variegation",
        "cropType": CropType.cotton,
        "translations": {
            "en": {
                "diseaseName": "Leaf Variegation",
                "description": "Appearance of leaves with yellow or white patches, sometimes caused by virus, genetic mutation, or nutrient imbalance.",
                "symptoms": ["Yellow/white leaf patches", "Uneven coloring", "Occasional stunted growth"],
                "solutions": ["Remove infected leaves if viral", "Correct nutrient imbalance", "Plant resistant varieties"],
                "prevention": ["Regular nutrient monitoring", "Avoid virus-infected plants nearby"],
                "treatmentSteps": [
                    "Assess cause (viral or nutrient)",
                    "Apply corrective fertilizers",
                    "Monitor for spread"
                ],
                "preventiveGuidelines": ["Use clean seeds", "Maintain field hygiene"]
            },
            "ur": {
                "diseaseName": "پتے کی مختلف رنگیں",
                "description": "پیلے یا سفید دھبوں والے پتوں کا ظاہر ہونا، کبھی کبھی وائرس، جینیاتی تغیر، یا غذائی عدم توازن کی وجہ سے ہوتا ہے۔",
                "symptoms": ["پیلے/سفید پتے کے دھبے", "غیر متوازن رنگ", "کبھی کبھار نشوونما رکنا"],
                "solutions": ["اگر وائرل ہو تو متاثرہ پتے ہٹائیں", "غذائی عدم توازن کو درست کریں", "مزاحم اقسام لگائیں"],
                "prevention": ["غذائی اجزاء کی باقاعدہ نگرانی", "قریب کے وائرس سے متاثرہ پودوں سے گریز کریں"],
                "treatmentSteps": [
                    "وجہ کا اندازہ لگائیں (وائرل یا غذائی)",
                    "اصلاحی کھادیں ڈالیں",
                    "پھیلاؤ کی نگرانی کریں"
                ],
                "preventiveGuidelines": ["صاف بیج استعمال کریں", "کھیت کی حفظان صحت برقرار رکھیں"]
            }
        }
    },
    {
        "diseaseKey": "aphid",
        "cropType": CropType.wheat,
        "translations": {
            "en": {
                "diseaseName": "Aphid",
                "description": "Small sap-sucking insects that colonize wheat plants, causing yellowing, stunted growth, and reduced yield. They can also transmit viral diseases.",
                "symptoms": ["Yellowing leaves", "Stunted growth", "Honeydew secretion", "Sooty mold growth", "Curling leaves"],
                "solutions": ["Apply imidacloprid or thiamethoxam", "Use insecticidal soaps", "Release natural predators like ladybugs", "Apply neem oil spray"],
                "prevention": ["Monitor fields regularly", "Use resistant varieties", "Avoid excessive nitrogen fertilization", "Maintain field sanitation"],
                "treatmentSteps": [
                    "Identify aphid colonies early",
                    "Apply systemic insecticides if threshold exceeded",
                    "Use foliar sprays for immediate control",
                    "Monitor for re-infestation"
                ],
                "preventiveGuidelines": [
                    "Plant early to avoid peak aphid season",
                    "Use yellow sticky traps for monitoring",
                    "Conserve natural enemy populations"
                ]
            },
            "ur": {
                "diseaseName": "افڈ",
                "description": "چھوٹے رس چوسنے والے کیڑے جو گندم کے پودوں پر آباد ہوتے ہیں، جس سے پیلا پڑنا، نشوونما رکنا اور پیداوار کم ہوتی ہے۔ وہ وائرل بیماریاں بھی منتقل کر سکتے ہیں۔",
                "symptoms": ["پیلا پڑتے پتے", "نشوونما رکنا", "ہنی ڈیو کا اخراج", "سوٹی مولڈ کی نشوونما", "مڑتے پتے"],
                "solutions": ["امیڈاکلوپرڈ یا تھائیامیتھوکسام لگائیں", "کیڑے مار صابن استعمال کریں", "لیڈی بگز جیسے قدرتی شکاری چھوڑیں", "نیم کے تیل کا سپرے کریں"],
                "prevention": ["کھیتوں کی باقاعدہ نگرانی کریں", "مزاحم اقسام استعمال کریں", "ضرورت سے زیادہ نائٹروجن کھاد سے پرہیز کریں", "کھیت کی صفائی برقرار رکھیں"],
                "treatmentSteps": [
                    "افڈ کالونیوں کو ابتدائی مرحلے میں شناخت کریں",
                    "اگر حد سے زیادہ ہو تو سسٹمک کیڑے مار ادویات لگائیں",
                    "فوری کنٹرول کے لیے پتوں کے سپرے استعمال کریں",
                    "دوبارہ حملے کی نگرانی کریں"
                ],
                "preventiveGuidelines": [
                    "افڈ کے موسم سے بچنے کے لیے جلد پودے لگائیں",
                    "نگرانی کے لیے پیلا چپکنے والا ٹریپ استعمال کریں",
                    "قدرتی دشمن آبادی کو محفوظ رکھیں"
                ]
            }
        }
    },
    {
        "diseaseKey": "black_rust",
        "cropType": CropType.wheat,
        "translations": {
            "en": {
                "diseaseName": "Black Rust",
                "description": "Also known as stem rust, caused by fungus Puccinia graminis. Characterized by dark reddish-brown pustules on stems and leaves.",
                "symptoms": ["Dark reddish-brown pustules", "Blisters on stems and leaves", "Premature leaf death", "Reduced grain fill"],
                "solutions": ["Apply fungicides like triazoles", "Use resistant varieties", "Remove volunteer wheat plants", "Apply strobilurin-based fungicides"],
                "prevention": ["Plant resistant cultivars", "Destroy crop residues", "Avoid late planting", "Practice crop rotation"],
                "treatmentSteps": [
                    "Monitor for early symptoms",
                    "Apply protective fungicides at first sign",
                    "Use systemic fungicides for established infections",
                    "Repeat application if needed"
                ],
                "preventiveGuidelines": [
                    "Use certified disease-free seeds",
                    "Maintain proper plant spacing",
                    "Avoid excessive nitrogen application"
                ]
            },
            "ur": {
                "diseaseName": "کالی زنگ",
                "description": "جسے سٹیم رسٹ بھی کہا جاتا ہے، فنگس Puccinia graminis کی وجہ سے ہوتا ہے۔ تنوں اور پتوں پر گہرے سرخی مائل بھورے پسٹولز کی خصوصیت ہے۔",
                "symptoms": ["گہرے سرخی مائل بھورے پسٹولز", "تنوں اور پتوں پر چھالے", "پتوں کی قبل از وقت موت", "اناج بھرنے میں کمی"],
                "solutions": ["ٹرائازول فنگیسائڈز لگائیں", "مزاحم اقسام استعمال کریں", "رضاکار گندم کے پودے ہٹائیں", "سٹروبیلورین پر مبنی فنگیسائڈز لگائیں"],
                "prevention": ["مزاحم اقسام لگائیں", "فصل کے باقیات تباہ کریں", "دیر سے پودے لگانے سے گریز کریں", "فصل کی گردش کا طریقہ اپنائیں"],
                "treatmentSteps": [
                    "ابتدائی علامات کی نگرانی کریں",
                    "پہلی علامت پر حفاظتی فنگیسائڈز لگائیں",
                    "قائم انفیکشن کے لیے سسٹمک فنگیسائڈز استعمال کریں",
                    "اگر ضرورت ہو تو دوبارہ درخواست دیں"
                ],
                "preventiveGuidelines": [
                    "سرٹیفائیڈ بیماری سے پاک بیج استعمال کریں",
                    "مناسب پودوں کا فاصلہ برقرار رکھیں",
                    "ضرورت سے زیادہ نائٹروجن کی درخواست سے پرہیز کریں"
                ]
            }
        }
    },
    {
        "diseaseKey": "common_root_rot",
        "cropType": CropType.wheat,
        "translations": {
            "en": {
                "diseaseName": "Common Root Rot",
                "description": "Soil-borne fungal disease causing root decay, reduced nutrient uptake, and premature plant death under severe conditions.",
                "symptoms": ["Brown root discoloration", "Stunted growth", "Yellowing lower leaves", "Poor tillering", "White heads"],
                "solutions": ["Apply seed treatment fungicides", "Use resistant varieties", "Improve soil drainage", "Apply phosphonate fungicides"],
                "prevention": ["Practice crop rotation", "Avoid continuous wheat cropping", "Improve soil organic matter", "Ensure proper drainage"],
                "treatmentSteps": [
                    "Diagnose root health early",
                    "Apply soil drench fungicides",
                    "Improve soil conditions",
                    "Monitor plant recovery"
                ],
                "preventiveGuidelines": [
                    "Use certified treated seeds",
                    "Maintain soil pH around 6.0-7.0",
                    "Avoid compaction"
                ]
            },
            "ur": {
                "diseaseName": "عام جڑ سڑن",
                "description": "مٹی سے پھیلنے والی فنگل بیماری جو جڑوں کی سڑن، غذائی اجزاء کی کم جذب اور شدید حالات میں پودوں کی قبل از وقت موت کا باعث بنتی ہے۔",
                "symptoms": ["جڑوں کا بھورا رنگ", "نشوونما رکنا", "نیچے کے پتوں کا پیلا پڑنا", "کم ٹلرنگ", "سفید سروں"],
                "solutions": ["بیج کی تیاری کے فنگیسائڈز لگائیں", "مزاحم اقسام استعمال کریں", "مٹی کی نکاسی بہتر بنائیں", "فاسفیونیٹ فنگیسائڈز لگائیں"],
                "prevention": ["فصل کی گردش کا طریقہ اپنائیں", "مسلسل گندم کی کاشت سے گریز کریں", "مٹی کی نامیاتی مادہ بہتر بنائیں", "مناسب نکاسی آب یقینی بنائیں"],
                "treatmentSteps": [
                    "جڑوں کی صحت کی ابتدائی تشخیص کریں",
                    "مٹی کی ڈریچ فنگیسائڈز لگائیں",
                    "مٹی کی حالات بہتر بنائیں",
                    "پودوں کی بحالی کی نگرانی کریں"
                ],
                "preventiveGuidelines": [
                    "سرٹیفائیڈ تیار شدہ بیج استعمال کریں",
                    "مٹی کا پی ایچ 6.0-7.0 کے درمیان رکھیں",
                    "کمپیکشن سے بچیں"
                ]
            }
        }
    },
    {
        "diseaseKey": "fusarium_head_blight",
        "cropType": CropType.wheat,
        "translations": {
            "en": {
                "diseaseName": "Fusarium Head Blight",
                "description": "Also called scab, caused by Fusarium species, leading to bleached spikelets, shriveled grains, and mycotoxin contamination.",
                "symptoms": ["Bleached spikelets", "Pink-orange mold", "Shriveled kernels", "Tombstone kernels"],
                "solutions": ["Apply triazole fungicides at flowering", "Use resistant varieties", "Apply biological controls", "Use proper harvest timing"],
                "prevention": ["Avoid planting after corn", "Use crop rotation", "Destroy infected residues", "Monitor weather during flowering"],
                "treatmentSteps": [
                    "Apply fungicides at early flowering",
                    "Use products with good scab efficacy",
                    "Adjust harvest for infected fields",
                    "Test for mycotoxins"
                ],
                "preventiveGuidelines": [
                    "Plant moderately resistant varieties",
                    "Time fungicide application carefully",
                    "Manage crop residues"
                ]
            },
            "ur": {
                "diseaseName": "فیوزیریم ہیڈ بلائٹ",
                "description": "جسے سکیب بھی کہا جاتا ہے، فیوزیریم انواع کی وجہ سے ہوتا ہے، جس سے بلیچڈ اسپائکلیٹس، سکڑے ہوئے اناج اور مائیکوٹوکسین کی آلودگی ہوتی ہے۔",
                "symptoms": ["بلیچڈ اسپائکلیٹس", "گلابی-نارنجی مولڈ", "سکڑے ہوئے اناج", "قبر کے پتھر جیسے اناج"],
                "solutions": ["پھول آنے پر ٹرائازول فنگیسائڈز لگائیں", "مزاحم اقسام استعمال کریں", "حیاتیاتی کنٹرول لگائیں", "مناسب کٹائی کا وقت استعمال کریں"],
                "prevention": ["مکئی کے بعد پودے لگانے سے گریز کریں", "فصل کی گردش کا طریقہ اپنائیں", "متاثرہ باقیات تباہ کریں", "پھول آنے کے دوران موسم کی نگرانی کریں"],
                "treatmentSteps": [
                    "ابتدائی پھول آنے پر فنگیسائڈز لگائیں",
                    "اچھی سکیب اثر والی مصنوعات استعمال کریں",
                    "متاثرہ کھیتوں کے لیے کٹائی کو ایڈجسٹ کریں",
                    "مائیکوٹوکسین کے لیے ٹیسٹ کریں"
                ],
                "preventiveGuidelines": [
                    "معتدل مزاحم اقسام لگائیں",
                    "فنگیسائڈز کا اطلاق احتیاط سے کریں",
                    "فصل کے باقیات کا انتظام کریں"
                ]
            }
        }
    },
    {
        "diseaseKey": "leaf_blight",
        "cropType": CropType.wheat,
        "translations": {
            "en": {
                "diseaseName": "Leaf Blight",
                "description": "Fungal disease causing elongated brown lesions on leaves, often starting from leaf tips and margins.",
                "symptoms": ["Brown elongated lesions", "Yellow halos", "Leaf tip dieback", "Reduced photosynthetic area"],
                "solutions": ["Apply chlorothalonil fungicides", "Use strobilurin products", "Apply copper-based fungicides", "Use resistant varieties"],
                "prevention": ["Destroy crop residues", "Practice crop rotation", "Avoid overhead irrigation", "Use clean seeds"],
                "treatmentSteps": [
                    "Identify early leaf spots",
                    "Apply protective fungicides",
                    "Use systemic products for control",
                    "Monitor disease progression"
                ],
                "preventiveGuidelines": [
                    "Maintain proper plant spacing",
                    "Avoid water stress",
                    "Use balanced fertilization"
                ]
            },
            "ur": {
                "diseaseName": "پتے کی بلائٹ",
                "description": "فنگل بیماری جو پتوں پر لمبے بھورے زخم پیدا کرتی ہے، جو اکثر پتوں کے کناروں اور نوکوں سے شروع ہوتی ہے۔",
                "symptoms": ["بھورے لمبے زخم", "پیلا ہالو", "پتے کے نوک کا مرجانا", "فوٹو سنتھیٹک ایریا کم ہونا"],
                "solutions": ["کلوروتھالونیل فنگیسائڈز لگائیں", "سٹروبیلورین مصنوعات استعمال کریں", "تانبے پر مبنی فنگیسائڈز لگائیں", "مزاحم اقسام استعمال کریں"],
                "prevention": ["فصل کے باقیات تباہ کریں", "فصل کی گردش کا طریقہ اپنائیں", "اوور ہیڈ آبپاشی سے گریز کریں", "صاف بیج استعمال کریں"],
                "treatmentSteps": [
                    "ابتدائی پتے کے دھبوں کی شناخت کریں",
                    "حفاظتی فنگیسائڈز لگائیں",
                    "کنٹرول کے لیے سسٹمک مصنوعات استعمال کریں",
                    "بیماری کی ترقی کی نگرانی کریں"
                ],
                "preventiveGuidelines": [
                    "مناسب پودوں کا فاصلہ برقرار رکھیں",
                    "پانی کے تناؤ سے بچیں",
                    "متوازن کھاد کا استعمال کریں"
                ]
            }
        }
    },
    {
        "diseaseKey": "mildew",
        "cropType": CropType.wheat,
        "translations": {
            "en": {
                "diseaseName": "Mildew",
                "description": "Powdery mildew caused by Blumeria graminis, appearing as white powdery growth on leaves and stems.",
                "symptoms": ["White powdery growth", "Yellowing leaves", "Stunted growth", "Reduced tillering"],
                "solutions": ["Apply sulfur dust", "Use triazole fungicides", "Apply bicarbonate sprays", "Use milk solution as organic control"],
                "prevention": ["Plant resistant varieties", "Avoid dense planting", "Ensure good air circulation", "Remove infected debris"],
                "treatmentSteps": [
                    "Detect early powder formation",
                    "Apply fungicides at first sign",
                    "Use contact and systemic products",
                    "Repeat if conditions favorable"
                ],
                "preventiveGuidelines": [
                    "Avoid excessive nitrogen",
                    "Maintain proper plant density",
                    "Monitor humidity levels"
                ]
            },
            "ur": {
                "diseaseName": "مِلڈیو",
                "description": "پاؤڈری ملیڈیو جو Blumeria graminis کی وجہ سے ہوتا ہے، پتوں اور تنوں پر سفید پاؤڈری نمو کے طور پر ظاہر ہوتا ہے۔",
                "symptoms": ["سفید پاؤڈری نمو", "پیلا پڑتے پتے", "نشوونما رکنا", "ٹلرنگ کم ہونا"],
                "solutions": ["سلفر ڈسٹ لگائیں", "ٹرائازول فنگیسائڈز استعمال کریں", "بائی کاربونیٹ سپرے لگائیں", "نامیاتی کنٹرول کے لیے دودھ کا محلول استعمال کریں"],
                "prevention": ["مزاحم اقسام لگائیں", "گھنے پودے لگانے سے گریز کریں", "اچھی ہوا کی گردش یقینی بنائیں", "متاثرہ ملبہ ہٹائیں"],
                "treatmentSteps": [
                    "ابتدائی پاؤڈر بننے کا پتہ لگائیں",
                    "پہلی علامت پر فنگیسائڈز لگائیں",
                    "رابطہ اور سسٹمک مصنوعات استعمال کریں",
                    "اگر حالات سازگار ہوں تو دہرائیں"
                ],
                "preventiveGuidelines": [
                    "ضرورت سے زیادہ نائٹروجن سے پرہیز کریں",
                    "مناسب پودوں کی کثافت برقرار رکھیں",
                    "نمی کی سطح کی نگرانی کریں"
                ]
            }
        }
    },
    {
        "diseaseKey": "mite",
        "cropType": CropType.wheat,
        "translations": {
            "en": {
                "diseaseName": "Mite",
                "description": "Infestation by various mite species causing stippling, yellowing, and reduced plant vigor through sap feeding.",
                "symptoms": ["Yellow stippling on leaves", "Fine webbing", "Leaf curling", "Bronzed appearance", "Stunted growth"],
                "solutions": ["Apply miticides like abamectin", "Use insecticidal soaps", "Release predatory mites", "Apply horticultural oils"],
                "prevention": ["Monitor field edges", "Maintain plant health", "Avoid water stress", "Remove weed hosts"],
                "treatmentSteps": [
                    "Confirm mite presence",
                    "Apply selective miticides",
                    "Use biological controls",
                    "Monitor for resurgence"
                ],
                "preventiveGuidelines": [
                    "Avoid broad-spectrum insecticides",
                    "Conserve natural enemies",
                    "Maintain field hygiene"
                ]
            },
            "ur": {
                "diseaseName": "مائٹ",
                "description": "مختلف مائٹ انواع کے حملے جو رس چوسنے سے پتوں پر دھبے، پیلا پڑنا اور پودوں کی طاقت کم کرتے ہیں۔",
                "symptoms": ["پتوں پر پیلا دھبے", "باریک جالی", "پتوں کا مڑنا", "کانسی کے رنگ کی ظاہری شکل", "نشوونما رکنا"],
                "solutions": ["ابامیکٹن جیسے مائٹیسائڈز لگائیں", "کیڑے مار صابن استعمال کریں", "شکاری مائٹس چھوڑیں", "باغبانی کے تیل لگائیں"],
                "prevention": ["کھیت کے کناروں کی نگرانی کریں", "پودوں کی صحت برقرار رکھیں", "پانی کے تناؤ سے بچیں", "گھاس پھوس کے میزبان ہٹائیں"],
                "treatmentSteps": [
                    "مائٹ کی موجودگی کی تصدیق کریں",
                    "منتخب مائٹیسائڈز لگائیں",
                    "حیاتیاتی کنٹرول استعمال کریں",
                    "دوبارہ ابھرنے کی نگرانی کریں"
                ],
                "preventiveGuidelines": [
                    "وسیع اسپیکٹرم کیڑے مار ادویات سے پرہیز کریں",
                    "قدرتی دشمنوں کو محفوظ رکھیں",
                    "کھیت کی حفظان صحت برقرار رکھیں"
                ]
            }
        }
    },
    {
        "diseaseKey": "septoria",
        "cropType": CropType.wheat,
        "translations": {
            "en": {
                "diseaseName": "Septoria",
                "description": "Septoria leaf blotch caused by Zymoseptoria tritici, forming irregular brown lesions with black pycnidia.",
                "symptoms": ["Brown irregular lesions", "Yellow halos", "Black pycnidia in centers", "Premature leaf death"],
                "solutions": ["Apply triazole fungicides", "Use strobilurin products", "Apply mixture fungicides", "Use resistant varieties"],
                "prevention": ["Destroy infected residues", "Practice crop rotation", "Use certified seeds", "Avoid early sowing"],
                "treatmentSteps": [
                    "Monitor lower leaves first",
                    "Apply fungicides at flag leaf emergence",
                    "Use curative treatments if needed",
                    "Protect upper canopy"
                ],
                "preventiveGuidelines": [
                    "Use integrated disease management",
                    "Monitor weather conditions",
                    "Avoid high nitrogen rates"
                ]
            },
            "ur": {
                "diseaseName": "سیپٹوریا",
                "description": "سیپٹوریا لیف بلوچ جو Zymoseptoria tritici کی وجہ سے ہوتا ہے، جو بے ترتیب بھورے زخم بناتا ہے جن کے مرکز میں سیاہ پائکنیڈیا ہوتے ہیں۔",
                "symptoms": ["بے ترتیب بھورے زخم", "پیلا ہالو", "مرکز میں سیاہ پائکنیڈیا", "پتوں کی قبل از وقت موت"],
                "solutions": ["ٹرائازول فنگیسائڈز لگائیں", "سٹروبیلورین مصنوعات استعمال کریں", "مرکب فنگیسائڈز لگائیں", "مزاحم اقسام استعمال کریں"],
                "prevention": ["متاثرہ باقیات تباہ کریں", "فصل کی گردش کا طریقہ اپنائیں", "سرٹیفائیڈ بیج استعمال کریں", "جلد بوائی سے گریز کریں"],
                "treatmentSteps": [
                    "پہلے نیچے کے پتوں کی نگرانی کریں",
                    "فلیگ لیف نکلنے پر فنگیسائڈز لگائیں",
                    "اگر ضرورت ہو تو علاج کے علاج استعمال کریں",
                    "اوپری چھتری کی حفاظت کریں"
                ],
                "preventiveGuidelines": [
                    "مربوط بیماری کے انتظام کا استعمال کریں",
                    "موسمی حالات کی نگرانی کریں",
                    "اعلی نائٹروجن کی شرح سے پرہیز کریں"
                ]
            }
        }
    },
    {
        "diseaseKey": "smut",
        "cropType": CropType.wheat,
        "translations": {
            "en": {
                "diseaseName": "Smut",
                "description": "Fungal disease where grains are replaced by black spore masses, causing significant yield loss and quality reduction.",
                "symptoms": ["Black powdery spore masses", "Transformed grains", "Soiled appearance", "Characteristic odor"],
                "solutions": ["Use systemic seed treatments", "Apply carboxin fungicides", "Use hot water treatment", "Apply biological controls"],
                "prevention": ["Use certified smut-free seeds", "Practice seed treatment", "Avoid contaminated equipment", "Destroy infected plants"],
                "treatmentSteps": [
                    "Identify infected heads",
                    "Remove and destroy infected plants",
                    "Treat seeds for next season",
                    "Clean equipment thoroughly"
                ],
                "preventiveGuidelines": [
                    "Always use treated seeds",
                    "Maintain field sanitation",
                    "Rotate with non-host crops"
                ]
            },
            "ur": {
                "diseaseName": "سموٹ",
                "description": "فنگل بیماری جس میں اناج کی جگہ سیاہ سپور ماسز لے لیتے ہیں، جس سے پیداوار میں نمایاں کمی اور معیار میں کمی واقع ہوتی ہے۔",
                "symptoms": ["سیاہ پاؤڈری سپور ماسز", "تبدیل شدہ اناج", "گندہ ظاہری شکل", "خصوصی بو"],
                "solutions": ["سسٹمک بیج کے علاج استعمال کریں", "کاربوکسین فنگیسائڈز لگائیں", "گرم پانی کا علاج استعمال کریں", "حیاتیاتی کنٹرول لگائیں"],
                "prevention": ["سرٹیفائیڈ سموٹ سے پاک بیج استعمال کریں", "بیج کا علاج کریں", "آلودہ آلات سے گریز کریں", "متاثرہ پودوں کو تباہ کریں"],
                "treatmentSteps": [
                    "متاثرہ سروں کی شناخت کریں",
                    "متاثرہ پودوں کو ہٹا کر تباہ کریں",
                    "اگلے سیزن کے لیے بیج کا علاج کریں",
                    "آلات کو اچھی طرح صاف کریں"
                ],
                "preventiveGuidelines": [
                    "ہمیشہ تیار شدہ بیج استعمال کریں",
                    "کھیت کی حفظان صحت برقرار رکھیں",
                    "غیر میزبان فصلوں کے ساتھ گردش کریں"
                ]
            }
        }
    },
    {
        "diseaseKey": "stem_fly",
        "cropType": CropType.wheat,
        "translations": {
            "en": {
                "diseaseName": "Stem Fly",
                "description": "Insect pest whose larvae tunnel into wheat stems, causing dead hearts, white ears, and lodging.",
                "symptoms": ["Dead hearts", "White ears", "Stem tunneling", "Lodging", "Reduced yield"],
                "solutions": ["Apply systemic insecticides", "Use pheromone traps", "Apply neem-based products", "Use biological controls"],
                "prevention": ["Destroy crop residues", "Practice deep plowing", "Use resistant varieties", "Monitor adult flies"],
                "treatmentSteps": [
                    "Monitor for adult flies",
                    "Apply insecticides at egg-laying stage",
                    "Use stem protection products",
                    "Remove infected plants"
                ],
                "preventiveGuidelines": [
                    "Avoid late planting",
                    "Maintain field hygiene",
                    "Use integrated pest management"
                ]
            },
            "ur": {
                "diseaseName": "سٹیم فلائی",
                "description": "کیڑے کا کیڑا جس کے لاروا گندم کے تنوں میں سرنگ بناتے ہیں، جس سے مردہ دل، سفید کان اور لاجنگ ہوتی ہے۔",
                "symptoms": ["مردہ دل", "سفید کان", "تنوں میں سرنگ", "لاجنگ", "پیداوار میں کمی"],
                "solutions": ["سسٹمک کیڑے مار ادویات لگائیں", "فیرومون ٹریپ استعمال کریں", "نیم پر مبنی مصنوعات لگائیں", "حیاتیاتی کنٹرول استعمال کریں"],
                "prevention": ["فصل کے باقیات تباہ کریں", "گہری جوتائی کریں", "مزاحم اقسام استعمال کریں", "بالغ مکھیوں کی نگرانی کریں"],
                "treatmentSteps": [
                    "بالغ مکھیوں کی نگرانی کریں",
                    "انڈے دینے کے مرحلے پر کیڑے مار ادویات لگائیں",
                    "تنوں کی حفاظت کی مصنوعات استعمال کریں",
                    "متاثرہ پودوں کو ہٹائیں"
                ],
                "preventiveGuidelines": [
                    "دیر سے پودے لگانے سے گریز کریں",
                    "کھیت کی حفظان صحت برقرار رکھیں",
                    "مربوط کیڑوں کے انتظام کا استعمال کریں"
                ]
            }
        }
    },
    {
        "diseaseKey": "tan_spot",
        "cropType": CropType.wheat,
        "translations": {
            "en": {
                "diseaseName": "Tan Spot",
                "description": "Caused by Pyrenophora tritici-repentis, forming tan lesions with yellow halos on leaves, reducing photosynthetic capacity.",
                "symptoms": ["Tan elliptical lesions", "Yellow halos", "Dark centers", "Leaf blighting", "Premature senescence"],
                "solutions": ["Apply strobilurin fungicides", "Use triazole products", "Apply mixture fungicides", "Use resistant varieties"],
                "prevention": ["Destroy wheat stubble", "Practice crop rotation", "Use clean tillage", "Avoid continuous wheat"],
                "treatmentSteps": [
                    "Identify early leaf spots",
                    "Apply fungicides at tillering",
                    "Use systemic products",
                    "Protect flag leaves"
                ],
                "preventiveGuidelines": [
                    "Manage crop residues effectively",
                    "Use balanced fertilization",
                    "Monitor disease development"
                ]
            },
            "ur": {
                "diseaseName": "ٹین اسپاٹ",
                "description": "Pyrenophora tritici-repentis کی وجہ سے ہوتا ہے، جو پتوں پر پیلا ہالو والے ٹین زخم بناتا ہے، فوٹو سنتھیٹک صلاحیت کو کم کرتا ہے۔",
                "symptoms": ["ٹین انڈاکار زخم", "پیلا ہالو", "گہرے مرکز", "پتے کی بلائٹنگ", "قبل از وقت بوڑھا ہونا"],
                "solutions": ["سٹروبیلورین فنگیسائڈز لگائیں", "ٹرائازول مصنوعات استعمال کریں", "مرکب فنگیسائڈز لگائیں", "مزاحم اقسام استعمال کریں"],
                "prevention": ["گندم کے سٹبل تباہ کریں", "فصل کی گردش کا طریقہ اپنائیں", "صاف جوتائی استعمال کریں", "مسلسل گندم سے گریز کریں"],
                "treatmentSteps": [
                    "ابتدائی پتے کے دھبوں کی شناخت کریں",
                    "ٹلرنگ پر فنگیسائڈز لگائیں",
                    "سسٹمک مصنوعات استعمال کریں",
                    "فلیگ پتوں کی حفاظت کریں"
                ],
                "preventiveGuidelines": [
                    "فصل کے باقیات کو مؤثر طریقے سے منظم کریں",
                    "متوازن کھاد کا استعمال کریں",
                    "بیماری کی ترقی کی نگرانی کریں"
                ]
            }
        }
    },
    {
        "diseaseKey": "yellow_rust",
        "cropType": CropType.wheat,
        "translations": {
            "en": {
                "diseaseName": "Yellow Rust",
                "description": "Stripe rust caused by Puccinia striiformis, characterized by yellow-orange pustules arranged in stripes on leaves.",
                "symptoms": ["Yellow-orange pustules", "Striped pattern on leaves", "Yellowing", "Reduced grain fill", "Premature senescence"],
                "solutions": ["Apply triazole fungicides", "Use strobilurin products", "Apply mixture fungicides", "Use resistant varieties"],
                "prevention": ["Plant resistant cultivars", "Avoid late planting", "Destroy green bridges", "Monitor regularly"],
                "treatmentSteps": [
                    "Detect early stripe formation",
                    "Apply fungicides promptly",
                    "Use systemic products for control",
                    "Repeat if disease persists"
                ],
                "preventiveGuidelines": [
                    "Use certified disease-free seeds",
                    "Avoid excessive nitrogen",
                    "Maintain proper plant spacing"
                ]
            },
            "ur": {
                "diseaseName": "پیلا زنگ",
                "description": "سٹرائپ رسٹ جو Puccinia striiformis کی وجہ سے ہوتا ہے، جس کی خصوصیت پتوں پر پٹیوں میں ترتیب دیے گئے پیلا-نارنجی پسٹولز ہیں۔",
                "symptoms": ["پیلا-نارنجی پسٹولز", "پتوں پر پٹی دار نمونہ", "پیلا پڑنا", "اناج بھرنے میں کمی", "قبل از وقت بوڑھا ہونا"],
                "solutions": ["ٹرائازول فنگیسائڈز لگائیں", "سٹروبیلورین مصنوعات استعمال کریں", "مرکب فنگیسائڈز لگائیں", "مزاحم اقسام استعمال کریں"],
                "prevention": ["مزاحم اقسام لگائیں", "دیر سے پودے لگانے سے گریز کریں", "گرین برج تباہ کریں", "باقاعدگی سے نگرانی کریں"],
                "treatmentSteps": [
                    "ابتدائی پٹی بننے کا پتہ لگائیں",
                    "فوری طور پر فنگیسائڈز لگائیں",
                    "کنٹرول کے لیے سسٹمک مصنوعات استعمال کریں",
                    "اگر بیماری برقرار رہے تو دہرائیں"
                ],
                "preventiveGuidelines": [
                    "سرٹیفائیڈ بیماری سے پاک بیج استعمال کریں",
                    "ضرورت سے زیادہ نائٹروجن سے پرہیز کریں",
                    "مناسب پودوں کا فاصلہ برقرار رکھیں"
                ]
            }
        }
    },
    
    {
    "diseaseKey": "blast",
    "cropType": CropType.wheat,
    "translations": {
        "en": {
            "diseaseName": "Blast",
            "description": "Fungal disease caused by Magnaporthe oryzae, causing bleached spikelets and significant yield loss under favorable conditions.",
            "symptoms": ["Bleached spikelets", "White to gray lesions on heads", "Node infections", "Plant lodging"],
            "solutions": ["Apply triazole fungicides", "Use blast-resistant varieties", "Apply silicon fertilizers", "Use strobilurin fungicides"],
            "prevention": ["Avoid planting in blast-prone areas", "Use balanced fertilization", "Ensure proper drainage", "Remove infected plant debris"],
            "treatmentSteps": [
                "Identify infected heads early",
                "Apply systemic fungicides promptly",
                "Monitor weather conditions",
                "Harvest early if severe infection"
            ],
            "preventiveGuidelines": [
                "Plant at recommended times",
                "Use integrated pest management",
                "Monitor humidity levels"
            ]
        },
        "ur": {
            "diseaseName": "بلاست",
            "description": "Magnaporthe oryzae کی وجہ سے ہونے والی فنگل بیماری، جس سے بلیچڈ اسپائکلیٹس اور سازگار حالات میں پیداوار میں نمایاں کمی واقع ہوتی ہے۔",
            "symptoms": ["بلیچڈ اسپائکلیٹس", "سروں پر سفید سے گرے لیشن", "نوڈ انفیکشنز", "پلانٹ لاجنگ"],
            "solutions": ["ٹرائازول فنگیسائڈز لگائیں", "بلاست مزاحم اقسام استعمال کریں", "سلیکون کھادیں ڈالیں", "سٹروبیلورین فنگیسائڈز استعمال کریں"],
            "prevention": ["بلاست کے حساس علاقوں میں پودے لگانے سے گریز کریں", "متوازن کھاد کا استعمال کریں", "مناسب نکاسی آب یقینی بنائیں", "متاثرہ پلانٹ ڈیبری ہٹائیں"],
            "treatmentSteps": [
                "متاثرہ سروں کی ابتدائی شناخت کریں",
                "فوری طور پر سسٹمک فنگیسائڈز لگائیں",
                "موسمی حالات کی نگرانی کریں",
                "اگر سنگین انفیکشن ہو تو جلد کٹائی کریں"
            ],
            "preventiveGuidelines": [
                "تجویز کردہ اوقات میں پودے لگائیں",
                "مربوط کیڑوں کے انتظام کا استعمال کریں",
                "نمی کی سطح کی نگرانی کریں"
            ]
        }
    }
},
    # Healthy Wheat
{
    "diseaseKey": "healthy",
    "cropType": CropType.wheat,
    "translations": {
        "en": {
            "diseaseName": "Healthy",
            "description": "Indicates a healthy wheat plant with no signs of disease or pest infestation, showing normal growth and development.",
            "symptoms": ["Green leaves", "Normal growth", "No spots or discoloration", "Proper tillering"],
            "solutions": [],
            "prevention": ["Regular monitoring", "Balanced fertilization", "Proper irrigation", "Crop rotation"],
            "treatmentSteps": None,
            "preventiveGuidelines": ["Maintain soil health", "Use certified seeds", "Practice integrated pest management"]
        },
        "ur": {
            "diseaseName": "صحت مند گندم",
            "description": "گندم کا ایک صحت مند پودا جس پر بیماری یا کیڑوں کے حملے کے کوئی آثار نہیں ہیں، جو عام نشوونما اور ترقی دکھا رہا ہے۔",
            "symptoms": ["سبز پتے", "عام نشوونما", "کوئی دھبے یا رنگت کی تبدیلی نہیں", "مناسب ٹلرنگ"],
            "solutions": [],
            "prevention": ["باقاعدہ نگرانی", "متوازن کھاد", "مناسب آبپاشی", "فصل کی گردش"],
            "treatmentSteps": None,
            "preventiveGuidelines": ["مٹی کی صحت برقرار رکھیں", "سرٹیفائیڈ بیج استعمال کریں", "مربوط کیڑوں کے انتظام کا طریقہ اپنائیں"]
        }
    }
},

# Brown Rust
{
    "diseaseKey": "brown_rust",
    "cropType": CropType.wheat,
    "translations": {
        "en": {
            "diseaseName": "Brown Rust",
            "description": "Caused by Puccinia recondita, characterized by small, orange-brown pustules primarily on leaves, reducing photosynthetic area.",
            "symptoms": ["Orange-brown pustules", "Yellow halos around lesions", "Premature leaf senescence", "Reduced grain size"],
            "solutions": ["Apply triazole fungicides", "Use resistant cultivars", "Apply mixture fungicides", "Use biological controls"],
            "prevention": ["Plant early maturing varieties", "Destroy green bridge plants", "Practice crop rotation", "Monitor regularly"],
            "treatmentSteps": [
                "Detect early leaf lesions",
                "Apply fungicides at flag leaf stage",
                "Use curative products if infection established",
                "Repeat based on disease pressure"
            ],
            "preventiveGuidelines": [
                "Avoid dense planting",
                "Use balanced NPK fertilization",
                "Remove volunteer wheat"
            ]
        },
        "ur": {
            "diseaseName": "براؤن رسٹ",
            "description": "Puccinia recondita کی وجہ سے ہوتا ہے، جس کی خصوصیت چھوٹے، اورنج-براؤن پسٹولز ہیں جو بنیادی طور پر پتوں پر ہوتے ہیں، فوٹو سنتھیٹک ایریا کو کم کرتے ہیں۔",
            "symptoms": ["اورنج-براؤن پسٹولز", "لیژن کے ارد گرد پیلا ہالو", "پتوں کی قبل از وقت بوڑھا ہونا", "اناج کا سائز کم ہونا"],
            "solutions": ["ٹرائازول فنگیسائڈز لگائیں", "مزاحم اقسام استعمال کریں", "مرکب فنگیسائڈز لگائیں", "حیاتیاتی کنٹرول استعمال کریں"],
            "prevention": ["جلد پکنے والی اقسام لگائیں", "گرین برج پلانٹس تباہ کریں", "فصل کی گردش کا طریقہ اپنائیں", "باقاعدگی سے نگرانی کریں"],
            "treatmentSteps": [
                "ابتدائی پتوں کے لیژن کا پتہ لگائیں",
                "فلیگ لیف سٹیج پر فنگیسائڈز لگائیں",
                "اگر انفیکشن قائم ہو جائے تو علاج کے مصنوعات استعمال کریں",
                "بیماری کے دباؤ کی بنیاد پر دہرائیں"
            ],
            "preventiveGuidelines": [
                "گھنے پودے لگانے سے گریز کریں",
                "متوازن این پی کے کھاد کا استعمال کریں",
                "رضاکار گندم ہٹائیں"
            ]
        }
    }
}
]
