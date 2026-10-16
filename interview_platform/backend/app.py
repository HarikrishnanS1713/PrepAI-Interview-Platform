"""
PrepAI – AI Interview Preparation Platform
Backend: Python Flask + MySQL
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

from routes.auth import auth_bp
from routes.questions import questions_bp
from routes.sessions import sessions_bp
from routes.feedback import feedback_bp
from routes.users import users_bp

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

# ── Configuration ──────────────────────────────────────────────────────────────
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'prepai-secret-key-change-in-production')
app.config['DB_HOST']     = os.environ.get('DB_HOST', 'localhost')
app.config['DB_USER']     = os.environ.get('DB_USER', 'root')
app.config['DB_PASSWORD'] = os.environ.get('DB_PASSWORD', '')
app.config['DB_NAME']     = os.environ.get('DB_NAME', 'prepai_db')

# ── Register Blueprints ─────────────────────────────────────────────────────────
app.register_blueprint(auth_bp,      url_prefix='/api/auth')
app.register_blueprint(questions_bp, url_prefix='/api/questions')
app.register_blueprint(sessions_bp,  url_prefix='/api/sessions')
app.register_blueprint(feedback_bp,  url_prefix='/api/feedback')
app.register_blueprint(users_bp,     url_prefix='/api/users')

# ── Serve Frontend ──────────────────────────────────────────────────────────────
@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/pages/<path:filename>')
def serve_page(filename):
    return send_from_directory('../frontend/pages', filename)

# ── Health Check ────────────────────────────────────────────────────────────────
@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'app': 'PrepAI', 'version': '1.0.0'})

# ── Error Handlers ──────────────────────────────────────────────────────────────
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
    print(f"🚀 PrepAI server starting on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
