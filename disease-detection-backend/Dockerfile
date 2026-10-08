# Backend image for Hugging Face Spaces (Docker SDK, free CPU tier).
# Also works on any Docker host: the app listens on $PORT (default 7860).
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    HF_HOME=/app/.hf-cache \
    TF_CPP_MIN_LOG_LEVEL=2 \
    PORT=7860

# Spaces run the container as UID 1000.
RUN useradd -m -u 1000 user
WORKDIR /app

# CPU-only PyTorch first (the default wheel bundles ~2 GB of CUDA libraries);
# torch==2.9.1+cpu satisfies the torch==2.9.1 pin in requirements.txt.
RUN pip install --index-url https://download.pytorch.org/whl/cpu torch==2.9.1
COPY requirements.txt .
RUN pip install -r requirements.txt

# Bake the CLIP weights into the image so a cold start doesn't download them.
RUN python -c "from transformers import CLIPModel, CLIPProcessor; \
CLIPModel.from_pretrained('openai/clip-vit-base-patch32'); \
CLIPProcessor.from_pretrained('openai/clip-vit-base-patch32')"

COPY --chown=user . .
RUN mkdir -p uploads && chown -R user:user /app
USER user

EXPOSE 7860
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
