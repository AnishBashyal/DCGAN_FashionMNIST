from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
import io
import numpy as np
import base64
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import math

app = Flask(__name__)
CORS(app)


LATENT_DIM = 100
GENERATOR_PATH = 'generator.pth'
IMAGE_SIZE = 64
CHANNELS = 1
GENERATOR_FEATURE_MAP = 64


class Generator(nn.Module):
    def __init__(self, latent_dim, feature_map, channels):
        super(Generator, self).__init__()
        self.main = nn.Sequential(
            nn.ConvTranspose2d(latent_dim, feature_map * 8, 4, 1, 0, bias=False),
            nn.BatchNorm2d(feature_map * 8),
            nn.ReLU(True),

            nn.ConvTranspose2d(feature_map * 8, feature_map * 4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(feature_map * 4),
            nn.ReLU(True),

            nn.ConvTranspose2d(feature_map * 4, feature_map * 2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(feature_map * 2),
            nn.ReLU(True),

            nn.ConvTranspose2d(feature_map * 2, feature_map, 4, 2, 1, bias=False),
            nn.BatchNorm2d(feature_map),
            nn.ReLU(True),

            nn.ConvTranspose2d(feature_map, channels, 4, 2, 1, bias=False),
            nn.Tanh()
        )

    def forward(self, x):
        x = x.view(x.size(0), x.size(1), 1, 1)  # Ensure shape: (B, 100, 1, 1)
        return self.main(x)


generator = Generator(LATENT_DIM, GENERATOR_FEATURE_MAP, CHANNELS)
generator.load_state_dict(torch.load(GENERATOR_PATH, map_location=torch.device('cpu')))
generator.eval()


def generate_latent_vector():
    return torch.randn(1, LATENT_DIM)


def generate_image(latent_vector, target_size=256):
    with torch.no_grad():
        fake_image = generator(latent_vector).cpu().squeeze(0)
        fake_image = (fake_image + 1) / 2.0  # Rescale to [0,1]
        img = transforms.ToPILImage()(fake_image)
        resized_img = img.resize((target_size, target_size), Image.Resampling.LANCZOS)
        img_buffer = io.BytesIO()
        resized_img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        return img_buffer


@app.route('/')
def index():
    return jsonify({
        "message": "Backend is running with AI image generation!",
        "endpoints": {
            "/generate_single": "GET - Generates a base64-encoded AI-generated image and a random latent vector.",
            "/morph": "POST - Accepts 'start_vector' and 'end_vector' and returns a list of base64-encoded morphing images."
        }
    })


@app.route('/generate_single', methods=['GET'])
def generate_single():
    latent_vector = generate_latent_vector()
    latent_list = latent_vector.tolist()[0]
    img_buffer = generate_image(latent_vector.view(1, LATENT_DIM, 1, 1), target_size=256)
    base64_image = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
    return jsonify({'latent_vector': latent_list, 'image': base64_image})


@app.route('/morph', methods=['POST'])
def morph_images():
    data = request.get_json()
    start_vector_list = data.get('start_vector')
    end_vector_list = data.get('end_vector')
    steps = data.get('steps', 50)
    non_linear = data.get('non_linear', True)
    return_latents = data.get('return_latents', False)

    if not start_vector_list or not end_vector_list:
        return jsonify({'error': 'Missing start_vector or end_vector'}), 400

    start_vector_tensor = torch.tensor(start_vector_list, dtype=torch.float).view(1, LATENT_DIM, 1, 1)
    end_vector_tensor = torch.tensor(end_vector_list, dtype=torch.float).view(1, LATENT_DIM, 1, 1)

    morphing_data = {'images': []}
    if return_latents:
        morphing_data['latents'] = []

    for i in range(steps + 1):
        alpha = i / steps
        if non_linear:
            alpha = 0.5 * (1 - math.cos(math.pi * alpha))  # Smooth interpolation

        interpolated_vector = (1 - alpha) * start_vector_tensor + alpha * end_vector_tensor
        img_buffer = generate_image(interpolated_vector)
        base64_image = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
        morphing_data['images'].append(base64_image)

        if return_latents:
            morphing_data['latents'].append(interpolated_vector.squeeze().tolist())

    return jsonify(morphing_data)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
