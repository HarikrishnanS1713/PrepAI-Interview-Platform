"""
Authentication routes: /api/auth/
  POST /register
  POST /login
  POST /logout
  GET  /me
"""

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import re

from utils.db import query, execute
from utils.auth_helper import generate_token, token_required
from utils.db import query, execute
from utils.auth_helper import generate_token, token_required
from utils.google_sheets import log_successful_login

auth_bp = Blueprint('auth', __name__)


def _valid_email(email: str) -> bool:
    return bool(re.match(r'^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$', email))


# ── Register ────────────────────────────────────────────────────────────────────
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name       = (data.get('name') or '').strip()
    email      = (data.get('email') or '').strip().lower()
    password   = data.get('password') or ''
    domain     = data.get('domain', 'general')
    experience = data.get('experience', 'fresher')

    # Validation
    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required.'}), 400
    if len(name) < 2:
        return jsonify({'error': 'Name must be at least 2 characters.'}), 400
    if not _valid_email(email):
        return jsonify({'error': 'Invalid email address.'}), 400
    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters.'}), 400

    # Check duplicate
    existing = query('SELECT id FROM users WHERE email = %s', (email,), fetch='one')
    if existing:
        return jsonify({'error': 'An account with this email already exists.'}), 409

    hashed = generate_password_hash(password)
    user_id = execute(
        'INSERT INTO users (name, email, password_hash, domain, experience) VALUES (%s, %s, %s, %s, %s)',
        (name, email, hashed, domain, experience)
    )

    return jsonify({'message': 'Account created successfully.', 'user_id': user_id}), 201


# ── Login ───────────────────────────────────────────────────────────────────────
@auth_bp.route('/login', methods=['POST'])
def login():
    data     = request.get_json() or {}
    email    = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    user = query('SELECT * FROM users WHERE email = %s', (email,), fetch='one')
    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Invalid email or password.'}), 401

    
    token = generate_token(user['id'], user['email'])

    log_successful_login(user['email'])

    return jsonify({
        'token': token,
        'user': {
            'id':         user['id'],
            'name':       user['name'],
            'email':      user['email'],
            'domain':     user['domain'],
            'experience': user['experience']
        }
    })


# ── Me (get current user) ───────────────────────────────────────────────────────
@auth_bp.route('/me', methods=['GET'])
@token_required
def me():
    user_id = request.current_user['user_id']
    user = query('SELECT id, name, email, domain, experience, created_at FROM users WHERE id = %s',
                 (user_id,), fetch='one')
    if not user:
        return jsonify({'error': 'User not found.'}), 404
    return jsonify({'user': user})


# ── Logout (client-side token drop; server acknowledges) ───────────────────────
@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout():
    return jsonify({'message': 'Logged out successfully.'})
