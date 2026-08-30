"""
Questions routes: /api/questions/
  GET  /               – list questions (filters: domain, type, difficulty)
  GET  /<id>           – single question
  GET  /random         – random question set for a session
  POST /               – add question (admin)
"""

from flask import Blueprint, request, jsonify
from utils.db import query, execute
from utils.auth_helper import token_required

questions_bp = Blueprint('questions', __name__)


# ── List questions ──────────────────────────────────────────────────────────────
@questions_bp.route('/', methods=['GET'])
@token_required
def list_questions():
    domain     = request.args.get('domain')
    q_type     = request.args.get('type')
    difficulty = request.args.get('difficulty')
    limit      = min(int(request.args.get('limit', 20)), 100)
    offset     = int(request.args.get('offset', 0))

    sql    = 'SELECT * FROM questions WHERE 1=1'
    params = []

    if domain:
        sql += ' AND domain = %s'
        params.append(domain)
    if q_type:
        sql += ' AND type = %s'
        params.append(q_type)
    if difficulty:
        sql += ' AND difficulty = %s'
        params.append(difficulty)

    sql += ' ORDER BY created_at DESC LIMIT %s OFFSET %s'
    params.extend([limit, offset])

    questions = query(sql, params)
    total     = query('SELECT COUNT(*) AS cnt FROM questions WHERE 1=1', [])[0]['cnt'] if not params else len(questions)

    return jsonify({'questions': questions, 'total': total, 'limit': limit, 'offset': offset})


# ── Get single question ─────────────────────────────────────────────────────────
@questions_bp.route('/<int:qid>', methods=['GET'])
@token_required
def get_question(qid):
    q = query('SELECT * FROM questions WHERE id = %s', (qid,), fetch='one')
    if not q:
        return jsonify({'error': 'Question not found.'}), 404
    return jsonify({'question': q})


# ── Get random question set ─────────────────────────────────────────────────────
@questions_bp.route('/random', methods=['GET'])
@token_required
def random_questions():
    domain     = request.args.get('domain', 'programming')
    q_type     = request.args.get('type', 'interview')
    difficulty = request.args.get('difficulty', 'medium')
    count      = min(int(request.args.get('count', 10)), 25)

    questions = query(
        'SELECT * FROM questions WHERE domain = %s AND type = %s AND difficulty = %s ORDER BY RAND() LIMIT %s',
        (domain, q_type, difficulty, count)
    )
    return jsonify({'questions': questions, 'count': len(questions)})


# ── Add question (admin) ────────────────────────────────────────────────────────
@questions_bp.route('/', methods=['POST'])
@token_required
def add_question():
    data = request.get_json() or {}
    required = ['question_text', 'domain', 'type', 'difficulty']
    missing  = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({'error': f"Missing fields: {', '.join(missing)}"}), 400

    qid = execute(
        '''INSERT INTO questions
           (question_text, domain, type, difficulty, options, correct_answer,
            explanation, created_by)
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s)''',
        (
            data['question_text'],
            data['domain'],
            data['type'],
            data['difficulty'],
            data.get('options'),          # JSON string for MCQ
            data.get('correct_answer'),
            data.get('explanation'),
            request.current_user['user_id']
        )
    )
    return jsonify({'message': 'Question added.', 'id': qid}), 201
