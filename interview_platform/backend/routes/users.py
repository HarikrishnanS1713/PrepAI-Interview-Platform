"""
Users routes: /api/users/
  GET  /profile          – get current user profile
  PUT  /profile          – update profile
  PUT  /change-password  – change password
  DELETE /               – delete account
"""

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from utils.db import query, execute
from utils.auth_helper import token_required

users_bp = Blueprint('users', __name__)


# ── Get profile ─────────────────────────────────────────────────────────────────
@users_bp.route('/profile', methods=['GET'])
@token_required
def get_profile():
    user_id = request.current_user['user_id']
    user = query(
        'SELECT id, name, email, domain, experience, org, target_role, created_at FROM users WHERE id = %s',
        (user_id,), fetch='one'
    )
    if not user:
        return jsonify({'error': 'User not found.'}), 404
    return jsonify({'user': user})


# ── Update profile ──────────────────────────────────────────────────────────────
@users_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    user_id = request.current_user['user_id']
    data    = request.get_json() or {}

    name        = (data.get('name') or '').strip()
    domain      = data.get('domain', '')
    experience  = data.get('experience', '')
    org         = data.get('org', '')
    target_role = data.get('target_role', '')

    if not name:
        return jsonify({'error': 'Name cannot be empty.'}), 400

    execute(
        'UPDATE users SET name = %s, domain = %s, experience = %s, org = %s, target_role = %s WHERE id = %s',
        (name, domain, experience, org, target_role, user_id)
    )
    return jsonify({'message': 'Profile updated successfully.'})


# ── Change password ─────────────────────────────────────────────────────────────
@users_bp.route('/change-password', methods=['PUT'])
@token_required
def change_password():
    user_id = request.current_user['user_id']
    data    = request.get_json() or {}

    current  = data.get('current_password', '')
    new_pwd  = data.get('new_password', '')

    if not current or not new_pwd:
        return jsonify({'error': 'Both current and new password are required.'}), 400
    if len(new_pwd) < 8:
        return jsonify({'error': 'New password must be at least 8 characters.'}), 400

    user = query('SELECT password_hash FROM users WHERE id = %s', (user_id,), fetch='one')
    if not user or not check_password_hash(user['password_hash'], current):
        return jsonify({'error': 'Current password is incorrect.'}), 401

    execute(
        'UPDATE users SET password_hash = %s WHERE id = %s',
        (generate_password_hash(new_pwd), user_id)
    )
    return jsonify({'message': 'Password changed successfully.'})


# ── Delete account ──────────────────────────────────────────────────────────────
@users_bp.route('/', methods=['DELETE'])
@token_required
def delete_account():
    user_id = request.current_user['user_id']
    execute('DELETE FROM users WHERE id = %s', (user_id,))
    return jsonify({'message': 'Account deleted.'})
