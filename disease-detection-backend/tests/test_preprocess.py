"""Pixel scaling must match how each model was trained.

cotton: ImageDataGenerator(rescale=1./255)         -> [0, 1]
wheat:  mobilenet_v2.preprocess_input (x/127.5 - 1) -> [-1, 1]
"""

import numpy as np
from PIL import Image

from app.routes.model_routes import preprocess_image


def _image(value):
    return Image.new("RGB", (300, 200), (value, value, value))


def test_cotton_scaling_is_zero_to_one():
    black = preprocess_image(_image(0), crop_type="cotton")
    white = preprocess_image(_image(255), crop_type="cotton")
    assert black.shape == (1, 224, 224, 3)
    assert np.allclose(black, 0.0)
    assert np.allclose(white, 1.0)


def test_default_is_cotton_scaling():
    assert np.allclose(preprocess_image(_image(255)), 1.0)


def test_wheat_scaling_matches_mobilenet_v2_preprocess_input():
    black = preprocess_image(_image(0), crop_type="wheat")
    white = preprocess_image(_image(255), crop_type="wheat")
    assert black.shape == (1, 224, 224, 3)
    assert np.allclose(black, -1.0)
    assert np.allclose(white, 1.0)


def test_wheat_crop_type_is_case_insensitive():
    assert np.allclose(preprocess_image(_image(0), crop_type="Wheat"), -1.0)
