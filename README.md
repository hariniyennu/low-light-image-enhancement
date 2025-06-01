# 🧠 AI Image Enhancer

An AI-powered web application to enhance low-light images using deep learning (Zero-DCE) with webcam support and a sleek, interactive frontend.

---

## 📸 Features

- Upload or capture an image using your webcam
- AI-based enhancement using a pre-trained Zero-DCE model
- Real-time preview of original vs enhanced images
- Fullscreen view and download options
- User login/signup with localStorage
- Dark mode toggle

---

## 📁 Project Structure

```
project/
│
├── app.py                     # Flask backend for image processing
├── model.py                   # Zero-DCE model definition                  
├── snapshots/
│   └── Epoch99.pth            # Pre-trained model weights
│
├── static/
│   ├── css/
│   │   └── index.css          # Styles
│   ├── js/
│   │   └── index.js           # Frontend logic
│   └── uploads/               # Saved images (auto-created)
│
├── templates/
│   └── index.html             # Main frontend HTML
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/hariniyennu/low-light-image-enhancement.git
cd low-light-image-enhancement
```

### 2. Set up the environment

Make sure you're using Python 3.8 or compatible.

```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Run the Flask app

```bash
python app.py
```

Then open your browser and go to:  
👉 http://127.0.0.1:5000/

---

## 🧠 Model Details

- **Model**: [Zero-DCE](https://github.com/Li-Chongyi/Zero-DCE)
- **Input Size**: 256x256
- **Weights**: `snapshots/Epoch99.pth`

---

## 📦 Customize & Extend

| Feature        | You Can Modify                                        |
|----------------|--------------------------------------------------------|
| Model          | Replace with MIRNet, EnlightenGAN, etc.                |
| Storage        | Integrate with database or cloud for image history     |
| Authentication | Switch from localStorage to Firebase/Auth0             |
| Deployment     | Deploy with Heroku, Render, or Docker                  |

---

