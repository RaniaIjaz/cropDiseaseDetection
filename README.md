# Crop Disease Detection System

[![CI](https://github.com/RaniaIjaz/cropDiseaseDetection/actions/workflows/ci.yml/badge.svg)](https://github.com/RaniaIjaz/cropDiseaseDetection/actions/workflows/ci.yml)

A full-stack final-year project for detecting wheat and cotton diseases from leaf images. The system combines trained deep-learning models with a bilingual web application, user authentication, prediction history, and report management.

![Home page](docs/screenshots/01-home-en.jpg)

## Screenshots

### Diagnosis

Pick the crop, upload a leaf image, and run detection. The image is checked with CLIP first, so a photo that is not the selected crop is rejected before it reaches the model.

![Uploading a leaf image for detection](docs/screenshots/03a-upload.png)

The result gives the disease and a description, then symptoms, treatment solutions and step-by-step treatment, followed by prevention measures and preventive guidelines.

![Detection result](docs/screenshots/03b-result.png)

### Detection history

Every prediction is stored and charted: top diseases, a daily timeline, and the split between crops.

![Detection history and charts](docs/screenshots/04-history-charts.png)

### How it works

![How it works](docs/screenshots/02-how-it-works.png)

### Bilingual — English and Urdu

The Urdu locale is fully right-to-left, with the layout mirrored and a Nastaliq typeface.

![Urdu interface](docs/screenshots/05-urdu-home.jpg)

### Responsive

<img src="docs/screenshots/06-mobile-home.jpg" alt="Mobile layout" width="320">

## Highlights

- Wheat and cotton disease classification from uploaded images
- Image validation with CLIP before model inference
- English and Urdu user interfaces
- JWT-based registration and login
- Email OTP password recovery
- Persistent prediction reports and image metadata in MongoDB
- Responsive dashboard with prediction history and charts
- Interactive FastAPI documentation

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js 15, React 19, Redux Toolkit, Tailwind CSS, next-intl |
| Backend | FastAPI, Motor, MongoDB, Pydantic |
| Machine learning | TensorFlow/Keras, PyTorch, Hugging Face Transformers/CLIP |
| Authentication | JWT, Passlib, bcrypt |

## Repository structure

```text
.
├── crop-disease-detection-frontend/  # Next.js web application
└── disease-detection-backend/        # FastAPI API and trained models
```

The frontend and backend are committed as ordinary directories, so a standard clone contains the complete project.

## Run locally

### Prerequisites

- Node.js 20 or newer
- Python 3.11 or newer
- A running MongoDB instance or MongoDB Atlas database

### 1. Backend

```bash
cd disease-detection-backend
python -m venv .venv
```

Activate the environment:

```powershell
# Windows PowerShell
.venv\Scripts\Activate.ps1
```

```bash
# macOS or Linux
source .venv/bin/activate
```

Install dependencies and configure the application:

```bash
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

On Windows Command Prompt, use `copy .env.example .env` instead of `cp`.

The API runs at `http://localhost:8000`; Swagger UI is available at `http://localhost:8000/docs`.

To seed the disease reference data after configuring MongoDB:

```bash
python upload_to_mongo.py
```

### 2. Frontend

In a second terminal:

```bash
cd crop-disease-detection-frontend
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Create `disease-detection-backend/.env` from the committed `.env.example` file.

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign access tokens |
| `JWT_ALGORITHM` | JWT signing algorithm; defaults to `HS256` |
| `BASE_URL` | Public backend URL used for generated image links |
| `MAIL_USERNAME` | SMTP account username |
| `MAIL_PASSWORD` | SMTP app password |
| `MAIL_FROM` | Sender address for password-reset messages |
| `MAIL_PORT` | SMTP port; defaults to `587` |
| `MAIL_SERVER` | SMTP host; defaults to `smtp.gmail.com` |
| `ALLOWED_ORIGINS` | Deployed frontend URL(s) allowed by CORS, comma-separated |
| `ALLOWED_ORIGIN_REGEX` | Optional CORS regex, e.g. `https://.*\.vercel\.app` for preview deployments |

The frontend reads `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`).

Never commit the real `.env` file. It is ignored by Git.

## Deploy (free tier)

The frontend runs on **Vercel**, the backend on a **Hugging Face Gradio Space** with **ZeroGPU** hardware (the only
Space type a free Hugging Face account can run; Docker and CPU Spaces need a paid plan), and the data on
**MongoDB Atlas** (free M0 cluster). `disease-detection-backend/space_app.py` serves the FastAPI app inside the Gradio
Space; the models and CLIP run on the Space's CPU, so the ZeroGPU daily GPU quota is not used.

### 1. Database: MongoDB Atlas

1. Create a free M0 cluster, a database user, and allow network access from `0.0.0.0/0`.
2. Copy the connection string (`mongodb+srv://...`); this is `MONGO_URI`.
3. Load the disease information once, from your machine, with that URI in `disease-detection-backend/.env`:
   `cd disease-detection-backend && python upload_to_mongo.py`

### 2. Backend: Hugging Face Space

1. On huggingface.co create a new **Space** → SDK **Gradio** → **Blank**, hardware **ZeroGPU**,
   e.g. `your-hf-username/agridoctor-api`. (Free accounts can have up to 2 ZeroGPU Spaces.)
2. In the Space's **Settings → Variables and secrets**, add as secrets: `MONGO_URI`, `JWT_SECRET`, `MAIL_USERNAME`,
   `MAIL_PASSWORD`, `MAIL_FROM`; and as variables: `JWT_ALGORITHM=HS256`, `MAIL_PORT=587`,
   `MAIL_SERVER=smtp.gmail.com`, `BASE_URL=https://your-hf-username-agridoctor-api.hf.space`,
   `ALLOWED_ORIGINS=https://your-app.vercel.app` (fill in after step 3).
3. Create a Hugging Face access token with **write** permission (Settings → Access Tokens).
4. In this GitHub repo, **Settings → Secrets and variables → Actions**: add secret `HF_TOKEN` (the token) and
   variable `HF_SPACE` (`your-hf-username/agridoctor-api`).
5. Run **Actions → Deploy backend to Hugging Face Space → Run workflow**. Later pushes to `main` that touch the
   backend redeploy automatically. The first build takes several minutes; the API is then live at
   `https://your-hf-username-agridoctor-api.hf.space/docs`.

### 3. Frontend: Vercel

1. On vercel.com, **Add New → Project** and import this repository.
2. Set **Root Directory** to `crop-disease-detection-frontend` (framework: Next.js).
3. Add the environment variable `NEXT_PUBLIC_API_URL=https://your-hf-username-agridoctor-api.hf.space`, then deploy.
4. Put the resulting `https://….vercel.app` address into the Space's `ALLOWED_ORIGINS` variable and restart the Space.

**Free-tier notes:** a Space sleeps after about 48 hours without traffic and takes a minute or two to wake up
(the first request after sleeping is slow). Uploaded images are stored on the Space's disk, which is reset on
restart, so older report images can disappear; the reports themselves stay in MongoDB.

## Main API routes

- `POST /auth/register` and `POST /auth/login`
- `POST /auth/forget-password` and `POST /auth/reset-password`
- `POST /predict/predict-disease/`
- `POST /predict/cotton/`
- `POST /predict/wheat/`
- `GET /reports/{report_id}`
- `GET /reports/user/{user_id}`

See `/docs` for request schemas and the complete generated API reference.

## Models and datasets

The trained Keras model files and class-name mappings are included under `disease-detection-backend/models/` so the project works after cloning.

Training data sources:

- [Wheat Plant Diseases dataset](https://www.kaggle.com/datasets/kushagra3204/wheat-plant-diseases/data)
- [Cotton disease image dataset](https://prod-dcd-datasets-public-files-eu-west-1.s3.eu-west-1.amazonaws.com/4ea42385-6559-41b1-9934-b69c4b769305)
