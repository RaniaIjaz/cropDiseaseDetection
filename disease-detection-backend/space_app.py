"""Entry point for the Hugging Face Space (Gradio SDK, ZeroGPU hardware).

Free Hugging Face accounts can only run Gradio Spaces on ZeroGPU, so this file
wraps the existing FastAPI backend (app/main.py) in a Gradio Space. Every API
route (/auth, /predict, /reports, /docs, ...) is served unchanged; Gradio only
adds a small status page at "/".

Run locally with:  python space_app.py   (or keep using: uvicorn app.main:app)
"""

# On ZeroGPU, `spaces` must be imported before torch / CUDA-related packages.
try:
    import spaces
except ImportError:  # running locally without the `spaces` package
    spaces = None

import os

import gradio as gr
import uvicorn

from app.main import app as api

if spaces is not None:

    @spaces.GPU(duration=5)
    def _gpu_probe() -> str:
        # ZeroGPU expects at least one @spaces.GPU function. Inference itself
        # (TensorFlow models + CLIP) runs on the Space's CPU, so the free daily
        # GPU quota is never spent.
        return "ok"


with gr.Blocks(title="AgriDoctor API") as status_page:
    gr.Markdown(
        "# AgriDoctor API\n"
        "Wheat and cotton disease detection backend is running.\n\n"
        "Interactive API documentation: [/docs](/docs)"
    )

# API routes are registered first, so they take precedence over this mount.
app = gr.mount_gradio_app(api, status_page, path="/")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "7860")))
