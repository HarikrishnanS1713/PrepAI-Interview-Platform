"""
Sessions routes: /api/sessions/
  GET  /              – list sessions for current user
  POST /              – create session
  GET  /<id>          – get single session
  PUT  /<id>/complete – mark session complete with score
  GET  /stats         – user performance stats
"""

from flask import Blueprint, request, jsonify
from utils.db import query, execute
from utils.auth_helper import token_required
import datetime

sessions_bp = Blueprint('sessions', __name__)


# ── List user sessions ──────────────────────────────────────────────────────────
@sessions_bp.route('/', methods=['GET'])
@token_required
def list_sessions():
    user_id = request.current_user['user_id']
    limit   = min(int(request.args.get('limit', 20)), 100)
    offset  = int(request.args.get('offset', 0))

    sessions = query(
        '''SELECT s.*, COUNT(r.id) AS answers_given
           FROM sessions s
           LEFT JOIN responses r ON r.session_id = s.id
           WHERE s.user_id = %s
           GROUP BY s.id
           ORDER BY s.created_at DESC
           LIMIT %s OFFSET %s''',
        (user_id, limit, offset)
    )
    return jsonify({'sessions': sessions})


# ── Create session ──────────────────────────────────────────────────────────────
@sessions_bp.route('/', methods=['POST'])
@token_required
def create_session():
    user_id = request.current_user['user_id']
    data    = request.get_json() or {}

    session_type = data.get('type', 'interview')   # interview | quiz | aptitude | hr
    domain       = data.get('domain', 'programming')
    difficulty   = data.get('difficulty', 'medium')
    total_q      = int(data.get('total_questions', 10))

    sid = execute(
        '''INSERT INTO sessions (user_id, type, domain, difficulty, total_questions, status)
           VALUES (%s, %s, %s, %s, %s, 'active')''',
        (user_id, session_type, domain, difficulty, total_q)
    )
    return jsonify({'session_id': sid, 'status': 'active'}), 201


# ── Get single session ──────────────────────────────────────────────────────────
@sessions_bp.route('/<int:sid>', methods=['GET'])
@token_required
def get_session(sid):
    user_id = request.current_user['user_id']
    session = query(
        'SELECT * FROM sessions WHERE id = %s AND user_id = %s',
        (sid, user_id), fetch='one'
    )
    if not session:
        return jsonify({'error': 'Session not found.'}), 404

    responses = query(
        'SELECT r.*, q.question_text FROM responses r JOIN questions q ON q.id = r.question_id WHERE r.session_id = %s',
        (sid,)
    )
    session['responses'] = responses
    return jsonify({'session': session})


# ── Complete session ────────────────────────────────────────────────────────────
@sessions_bp.route('/<int:sid>/complete', methods=['PUT'])
@token_required
def complete_session(sid):
    user_id = request.current_user['user_id']
    data    = request.get_json() or {}
    score   = data.get('score', 0)

    session = query(
        'SELECT id FROM sessions WHERE id = %s AND user_id = %s',
        (sid, user_id), fetch='one'
    )
    if not session:
        return jsonify({'error': 'Session not found.'}), 404

    execute(
        'UPDATE sessions SET status = %s, score = %s, completed_at = %s WHERE id = %s',
        ('completed', score, datetime.datetime.utcnow(), sid)
    )
    return jsonify({'message': 'Session completed.', 'score': score})


# ── User performance stats ──────────────────────────────────────────────────────
@sessions_bp.route('/stats', methods=['GET'])
@token_required
def user_stats():
    user_id = request.current_user['user_id']

    overall = query(
        '''SELECT
             COUNT(*) AS total_sessions,
             IFNULL(AVG(score), 0) AS avg_score,
             IFNULL(MAX(score), 0) AS best_score,
             SUM(total_questions) AS total_questions
           FROM sessions
           WHERE user_id = %s AND status = 'completed' ''',
        (user_id,), fetch='one'
    )

    by_domain = query(
        '''SELECT domain,
             COUNT(*) AS sessions,
             IFNULL(AVG(score), 0) AS avg_score
           FROM sessions
           WHERE user_id = %s AND status = 'completed'
           GROUP BY domain''',
        (user_id,)
    )

    by_type = query(
        '''SELECT type,
             COUNT(*) AS sessions,
             IFNULL(AVG(score), 0) AS avg_score
           FROM sessions
           WHERE user_id = %s AND status = 'completed'
           GROUP BY type''',
        (user_id,)
    )

    trend = query(
        '''SELECT DATE(completed_at) AS date, ROUND(AVG(score), 1) AS avg_score
           FROM sessions
           WHERE user_id = %s AND status = 'completed'
           GROUP BY DATE(completed_at)
           ORDER BY date DESC LIMIT 30''',
        (user_id,)
    )

    return jsonify({
        'overall':   overall,
        'by_domain': by_domain,
        'by_type':   by_type,
        'trend':     trend
    })
