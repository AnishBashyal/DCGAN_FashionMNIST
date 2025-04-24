## Overview

This a web application for visualizing and analyzing DCGAN training.  It allows users to:

* Browse generated images by epoch.
* Visualize training loss (discriminator and generator).
* Compare generated images from different epochs.
* Control animation of images across epochs.
* Morph image from one epoch to another, to show latent space exploration


## Setup

1.  **Clone the Repository:**
    ```bash
    git clone <your_repository_url>
    cd <your_repository_directory>
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    ```

3.  **Set up Backend (Python):**
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate  # On Linux/macOS
    # venv\Scripts\activate  # On Windows
    pip install -r requirements.txt
    ```

4.  **Prepare Data:**

    * Place generated images in `frontend/public/intermediate_images/` (e.g., `epoch_001.png`).
    * Place `dcgan_losses.csv` in `frontend/public/`.

5.  **Run the Application:**

    * Start the backend:
        ```bash
        cd backend
        python app.py
        ```
    * Start the frontend:
        ```bash
        cd frontend
        npm run dev
        ```
        The application will be served at `http://localhost:5173`.
