import os
import json
import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import jwt
import datetime
import bcrypt

load_dotenv('.env.python')

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Serve static files and index.html
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Gemini Configuration
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-flash-latest')

# Firebase Configuration (using REST API for now due to lack of service account)
FIREBASE_DB_URL = os.getenv("FIREBASE_DB_URL")
FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")

def get_firebase_data(path):
    response = requests.get(f"{FIREBASE_DB_URL}/{path}.json")
    return response.json()

def set_firebase_data(path, data):
    response = requests.patch(f"{FIREBASE_DB_URL}/{path}.json", json=data)
    return response.json()

def post_firebase_data(path, data):
    response = requests.post(f"{FIREBASE_DB_URL}/{path}.json", json=data)
    return response.json()

# Auth Routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    users = get_firebase_data('users')
    if not users:
        return jsonify({"message": "Invalid credentials"}), 400

    user_found = None
    user_id = None

    for uid, udata in users.items():
        if udata.get('email', '').lower() == email:
            user_found = udata
            user_id = uid
            break

    if not user_found:
        return jsonify({"message": "Invalid credentials"}), 400

    if not bcrypt.checkpw(password.encode('utf-8'), user_found['password_hash'].encode('utf-8')):
        return jsonify({"message": "Invalid credentials"}), 400

    token = jwt.encode({
        'id': user_id,
        'role': user_found.get('role', 'worker'),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, os.getenv("JWT_SECRET"), algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {
            "id": user_id,
            "name": user_found.get('name'),
            "email": user_found.get('email'),
            "role": user_found.get('role'),
            "organization": user_found.get('organization'),
            "language": user_found.get('preferred_language', 'English')
        }
    })

# Patient Routes
@app.route('/api/patient/<path:subpath>', methods=['GET', 'POST'])
def patient_routes(subpath):
    if request.method == 'GET':
        return jsonify(get_firebase_data(f'patients/{subpath}') or [])
    return jsonify(post_firebase_data(f'patients/{subpath}', request.json))

# Policy Routes
@app.route('/api/policy', methods=['GET'])
def get_policies():
    return jsonify(get_firebase_data('policies') or [])

# Hospital Routes
@app.route('/api/hospital', methods=['GET'])
def get_hospitals():
    return jsonify(get_firebase_data('hospitals') or [])

# Company Routes
@app.route('/api/company/employees', methods=['GET'])
def get_employees():
    return jsonify(get_firebase_data('users') or [])

# AI Routes
@app.route('/api/ai/chat', methods=['POST'])
def chat():
    data = request.json
    language = data.get('language', 'English')
    message = data.get('message', '')
    role = data.get('role', 'guest')
    
    print(f"DEBUG: Chat request - Language: {language}, Role: {role}, Message: {message[:50]}...")

    if not message:
        return jsonify({"message": "Message is required"}), 400

    prompt = f"""
    You are 'MC' (MigrantConnect AI Assistant), a premium, multilingual, and empathetic assistant for a healthcare management system for migrant workers.
    
    SYSTEM INSTRUCTION: You MUST speak and respond ONLY in the user's selected language.
    USER PREFERRED LANGUAGE: {language}
    
    CRITICAL: ALWAYS provide your response in {language}. If {language} is 'Hindi', you must use Hindi script (Devanagari). 
    If {language} is 'Marathi', use Marathi script. 
    Even if the user writes in English or any other language, your response MUST be in {language} unless they explicitly ask you to change the system language.
    
    Current User Role: {role}
    
    System Context: MigrantConnect bridges the gap for migrant workers by providing access to health records, welfare schemes, and verified clinics.
    
    Guidelines:
    - Provide helpful, concise, and professional responses.
    - Use **Markdown formatting** (bolding, lists, paragraphs) in your {language} response.
    - Help with navigation (e.g., finding clinics, checking welfare schemes).
    - Provide general health advice but NO medical diagnosis.
    - Maintain an empathetic and supportive tone.
    
    User message: {message}
    """

    try:
        response = model.generate_content(prompt)
        return jsonify({"reply": response.text})
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Gemini error: {e}")
        print(f"Details: {error_details}")
        return jsonify({"message": f"AI Assistant Error: {str(e)}"}), 500

@app.route('/api/ai/voice-text', methods=['POST'])
def voice_text():
    return jsonify({"message": "Use browser Web Speech API for voice"}), 200

# Health check
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    # Increase stability for background process
    app.run(port=5000, debug=False, host='0.0.0.0')
