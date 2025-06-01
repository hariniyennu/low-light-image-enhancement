from flask import Flask, render_template, request, jsonify, url_for
import os
import torch
import torchvision.transforms as transforms
from PIL import Image
from model import enhance_net_nopool
import uuid
import time

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Load Zero-DCE model
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = enhance_net_nopool().to(device)
model.load_state_dict(torch.load('snapshots/Epoch99.pth', map_location=device))
model.eval()

# Image transformation
transform = transforms.Compose([
    transforms.Resize((256, 256)),  # Zero-DCE typically uses 256x256
    transforms.ToTensor()
])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/enhance', methods=['POST'])
def enhance():
    if 'media' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['media']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Generate unique filenames
        timestamp = str(int(time.time()))
        unique_id = uuid.uuid4().hex
        original_filename = f'original_{timestamp}_{unique_id}.png'
        enhanced_filename = f'enhanced_{timestamp}_{unique_id}.png'
        
        # Save original image
        original_path = os.path.join(app.config['UPLOAD_FOLDER'], original_filename)
        file.save(original_path)
        
        # Process image with Zero-DCE
        img = Image.open(original_path).convert('RGB')
        input_tensor = transform(img).unsqueeze(0).to(device)
        
        with torch.no_grad():
            enhanced_tensor = model(input_tensor)[0]  # Get first output
        
        # Convert and save enhanced image
        enhanced_img = transforms.ToPILImage()(enhanced_tensor.squeeze(0).clamp(0, 1).cpu())
        enhanced_path = os.path.join(app.config['UPLOAD_FOLDER'], enhanced_filename)
        enhanced_img.save(enhanced_path)
        
        # Return URLs for both images
        return jsonify({
            'original': url_for('static', filename=f'uploads/{original_filename}'),
            'enhanced': url_for('static', filename=f'uploads/{enhanced_filename}')
        }), 200
    
    except torch.cuda.OutOfMemoryError:
        return jsonify({'error': 'GPU out of memory. Try a smaller image or wait a moment.'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)