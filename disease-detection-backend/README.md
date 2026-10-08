---
title: AgriDoctor API
emoji: 🌾
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# AgriDoctor backend

FastAPI service for wheat and cotton disease detection (MobileNetV2 models, CLIP image validation, MongoDB).

The YAML header above configures this folder as a Hugging Face Docker Space. The folder is published to the
Space by `.github/workflows/deploy-backend.yml`; see the root README's "Deploy" section for setup.

Interactive API docs are served at `/docs`.
