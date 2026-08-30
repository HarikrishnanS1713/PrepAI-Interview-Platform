"""
Feedback routes: /api/feedback/
  POST /        – analyse answer and return AI feedback
  POST /save    – save a response + feedback to DB
"""

from flask import Blueprint, request, jsonify
from utils.db import execute
from utils.auth_helper import token_required
from utils.feedback_engine import analyse_answer

feedback_bp = Blueprint('feedback', __name__)


# ── Analyse answer ──────────────────────────────────────────────────────────────
@feedback_bp.route('/', methods=['POST'])
@token_required
def get_feedback():
    data = request.get_json() or {}

    question = (data.get('question') or '').strip()
    answer   = (data.get('answer')   or '').strip()
    domain   = data.get('domain', 'programming')

    if not question or not answer:
        return jsonify({'error': 'Both question and answer are required.'}), 400
    if len(answer) < 5:
        return jsonify({'error': 'Answer is too short to analyse.'}), 400

    feedback = analyse_answer(question, answer, domain)
    return jsonify(feedback)


# ── Save response + feedback ────────────────────────────────────────────────────
@feedback_bp.route('/save', methods=['POST'])
@token_required
def save_response():
    data       = request.get_json() or {}
    user_id    = request.current_user['user_id']
    session_id = data.get('session_id')
    question_id= data.get('question_id')
    answer_text= data.get('answer_text', '')
    score      = data.get('score', 0)
    feedback   = data.get('feedback', '')

    if not session_id or not question_id:
        return jsonify({'error': 'session_id and question_id are required.'}), 400

    rid = execute(
        '''INSERT INTO responses
           (session_id, user_id, question_id, answer_text, score, feedback)
           VALUES (%s, %s, %s, %s, %s, %s)''',
        (session_id, user_id, question_id, answer_text, score, str(feedback))
    )
    return jsonify({'message': 'Response saved.', 'response_id': rid}), 201
