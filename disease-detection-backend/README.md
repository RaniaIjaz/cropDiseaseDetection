---
title: AgriDoctor API
emoji: 🌾
colorFrom: green
colorTo: blue
sdk: gradio
sdk_version: 5.49.1
python_version: "3.12"
app_file: space_app.py
pinned: false
---

# AgriDoctor backend

FastAPI service for wheat and cotton disease detection (MobileNetV2 models, CLIP image validation, MongoDB).

The YAML header above configures this folder as a Hugging Face **Gradio** Space (free accounts run Gradio Spaces on
ZeroGPU hardware). `space_app.py` serves the FastAPI app through Gradio, so all API routes work as before. The folder is
published to the Space by `.github/workflows/deploy-backend.yml`; see the root README's "Deploy" section for setup.

Interactive API docs are served at `/docs`.
