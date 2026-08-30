"""
AI Feedback Engine for PrepAI
Analyses user answers and generates structured feedback scores + suggestions.
Uses simple NLP heuristics (no external API required for basic mode).
"""

import re
import random
from typing import Any


# ── Keyword banks ──────────────────────────────────────────────────────────────
TECH_TERMS = re.compile(
    r'\b(algorithm|function|class|object|method|variable|array|loop|database|'
    r'server|api|process|memory|recursion|complexity|binary|tree|graph|hash|'
    r'stack|queue|pointer|thread|mutex|sql|index|query|cache|protocol|http|'
    r'tcp|rest|oop|inheritance|polymorphism|encapsulation|abstraction|'
    r'sorting|searching|big.?o|time.complexity|space.complexity)\b',
    re.IGNORECASE
)

STRUCTURE_WORDS = re.compile(
    r'\b(first|second|third|also|however|because|therefore|furthermore|'
    r'additionally|on the other hand|for example|such as|in conclusion|'
    r'finally|next|then|as a result|consequently)\b',
    re.IGNORECASE
)

EXAMPLE_WORDS = re.compile(
    r'\b(for example|for instance|such as|e\.g\.|like|consider|'
    r'specifically|in my experience|when i|in one project|'
    r'i used|i implemented|i built|i worked)\b',
    re.IGNORECASE
)

QUANTIFIERS = re.compile(
    r'\b(\d+\s*%|\d+\s*(years?|months?|days?|hours?|users?|records?|'
    r'requests?|ms|seconds?|times?|x faster|x slower)|\d+\s*to\s*\d+)\b',
    re.IGNORECASE
)

STAR_WORDS = re.compile(
    r'\b(situation|task|action|result|outcome|challenge|responsibility|'
    r'i did|i took|i resolved|i achieved|led to|resulted in)\b',
    re.IGNORECASE
)


def analyse_answer(question: str, answer: str, domain: str) -> dict[str, Any]:
    """
    Analyse a candidate answer and return structured feedback.

    Returns:
        {
          clarity      : int (0–100),
          depth        : int (0–100),
          confidence   : int (0–100),
          relevance    : int (0–100),
          overall_score: int (0–100),
          text         : str,
          suggestions  : list[str]
        }
    """
    words = answer.strip().split()
    word_count = len(words)
    sentences = re.split(r'[.!?]+', answer)
    sentence_count = max(1, len([s for s in sentences if s.strip()]))

    has_tech    = bool(TECH_TERMS.search(answer))
    has_struct  = bool(STRUCTURE_WORDS.search(answer))
    has_example = bool(EXAMPLE_WORDS.search(answer))
    has_numbers = bool(QUANTIFIERS.search(answer))
    has_star    = bool(STAR_WORDS.search(answer))
    avg_sent_len = word_count / sentence_count

    # ── Score dimensions ────────────────────────────────────────────────────────
    # Clarity: word count, structure, sentence length
    clarity = 30
    clarity += min(25, word_count // 4)          # up to 25 pts for length
    clarity += 15 if has_struct else 0
    clarity += 10 if avg_sent_len < 25 else 0    # concise sentences
    clarity += 10 if avg_sent_len > 5  else 0    # not too choppy
    clarity += random.randint(0, 10)
    clarity = min(100, clarity)

    # Depth: technical content, examples, numbers
    depth = 25
    depth += 20 if has_tech    else 0
    depth += 20 if has_example else 0
    depth += 15 if has_numbers else 0
    depth += min(20, word_count // 5)
    depth += random.randint(0, 10)
    depth = min(100, depth)

    # Confidence: assertive language, completeness
    confidence = 30
    if word_count > 50: confidence += 20
    if has_struct:      confidence += 15
    if has_example:     confidence += 10
    confidence += random.randint(0, 25)
    confidence = min(100, confidence)

    # Relevance: domain-specific scoring
    relevance = 40
    if domain in ('programming', 'technical') and has_tech:
        relevance += 30
    if domain == 'hr' and has_star:
        relevance += 30
    if domain == 'aptitude':
        relevance += 20 if has_numbers else 5
    relevance += 10 if has_example else 0
    relevance += random.randint(0, 15)
    relevance = min(100, relevance)

    overall_score = round((clarity * 0.25 + depth * 0.30 + confidence * 0.20 + relevance * 0.25))

    # ── Generate suggestions ────────────────────────────────────────────────────
    suggestions: list[str] = []

    if word_count < 40:
        suggestions.append("Expand your answer – aim for 80–150 words. Interviewers want thorough explanations.")
    if not has_example:
        suggestions.append("Include a concrete real-world example or personal experience to support your answer.")
    if not has_struct:
        suggestions.append("Use transitional phrases (first, then, however, finally) to structure your response.")
    if domain in ('programming', 'technical') and not has_tech:
        suggestions.append("Incorporate relevant technical terminology, algorithms, or data structures in your answer.")
    if domain == 'hr' and not has_star:
        suggestions.append("Apply the STAR method: describe the Situation, Task, Action taken, and the Result.")
    if not has_numbers and domain != 'hr':
        suggestions.append("Use quantifiable data (e.g., 'reduced latency by 40%') to make your answer more credible.")
    if avg_sent_len > 30:
        suggestions.append("Break long sentences into shorter ones for better readability and impact.")

    if not suggestions:
        suggestions.append("Excellent response! For even more impact, consider briefly mentioning alternative approaches or trade-offs.")

    # ── Summary text ────────────────────────────────────────────────────────────
    if overall_score >= 80:
        summary = (f"Strong answer! You demonstrated good {'' if not has_tech else 'technical '}"
                   f"knowledge with clear structure.")
    elif overall_score >= 60:
        summary = ("Decent response. There's room to improve depth and provide more concrete examples.")
    else:
        summary = ("This answer needs more development. Focus on completeness, structure, and relevant examples.")

    if has_example:
        summary += " Good use of specific examples."
    if domain == 'hr' and has_star:
        summary += " STAR structure detected – great approach for behavioral questions."

    return {
        'clarity':       clarity,
        'depth':         depth,
        'confidence':    confidence,
        'relevance':     relevance,
        'overall_score': overall_score,
        'text':          summary,
        'suggestions':   suggestions[:4]   # cap at 4
    }
