const HR_QUESTIONS = [
  { q: "Tell me about yourself.", cat: "behavioral", tip: "Structure: Education → Experience → Skills → Goals. Keep it under 2 minutes." },
  { q: "What are your greatest strengths?", cat: "behavioral", tip: "Name 2–3 strengths with specific examples. Align them to the job role." },
  { q: "What is your biggest weakness?", cat: "behavioral", tip: "Be honest, but show self-awareness. Mention what you're doing to improve." },
  { q: "Where do you see yourself in 5 years?", cat: "motivation", tip: "Show ambition aligned with the company's growth. Avoid 'your job' or 'retired'." },
  { q: "Why do you want to work for our company?", cat: "motivation", tip: "Research the company. Mention specific products, culture, or values that resonate." },
  { q: "Tell me about a time you worked under pressure.", cat: "situational", tip: "Use STAR. Be specific about the deadline and what you prioritized." },
  { q: "Describe a situation where you resolved a conflict with a team member.", cat: "teamwork", tip: "Focus on communication, empathy, and constructive resolution. Avoid blaming." },
  { q: "Tell me about a project you led. What was the outcome?", cat: "behavioral", tip: "Highlight leadership, delegation, and measurable results." },
  { q: "How do you handle failure or rejection?", cat: "behavioral", tip: "Show resilience. Describe learning and improvement after a setback." },
  { q: "What motivates you at work?", cat: "motivation", tip: "Be authentic. Examples: problem-solving, impact, learning, team success." },
  { q: "Describe a time you had to adapt to a major change.", cat: "situational", tip: "Show flexibility and a positive attitude towards change." },
  { q: "Have you ever disagreed with your manager? How did you handle it?", cat: "behavioral", tip: "Show respect and professional communication while asserting your view with data/reasoning." },
  { q: "What makes you a good team player?", cat: "teamwork", tip: "Give 1–2 specific examples of collaboration, helping others, or shared ownership." },
  { q: "Tell me about a time you went above and beyond at work.", cat: "behavioral", tip: "Quantify the extra effort and its impact on the team or project." },
  { q: "How do you prioritize when you have multiple deadlines?", cat: "situational", tip: "Mention tools (task lists, calendars) and decision criteria (urgency, impact)." }
];

let currentQ = null;

function renderQuestions(filter='all') {
  const list = document.getElementById('hrQuestionsList');
  const filtered = filter === 'all' ? HR_QUESTIONS : HR_QUESTIONS.filter(q => q.cat === filter);
  list.innerHTML = filtered.map((q, i) => `
    <div class="question-card">
      <span class="question-tag tag-hr">${q.cat.charAt(0).toUpperCase()+q.cat.slice(1)}</span>
      <div class="question-text">${q.q}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:0.8rem;color:var(--text-muted);font-style:italic;">💡 ${q.tip}</div>
        <button class="btn-sm primary" onclick="openPractice(${HR_QUESTIONS.indexOf(q)})">Practice</button>
      </div>
    </div>
  `).join('');
}

function filterHR() {
  renderQuestions(document.getElementById('hrCategory').value);
}

function openPractice(idx) {
  currentQ = HR_QUESTIONS[idx];
  document.getElementById('modalQuestion').textContent = currentQ.q;
  document.getElementById('modalCategory').textContent = currentQ.cat.charAt(0).toUpperCase()+currentQ.cat.slice(1);
  document.getElementById('hrAnswer').value = '';
  document.getElementById('hrFeedback').style.display = 'none';
  const overlay = document.getElementById('practiceOverlay');
  overlay.style.display = 'flex';
}

function closePractice() {
  document.getElementById('practiceOverlay').style.display = 'none';
}

function submitHR() {
  const answer = document.getElementById('hrAnswer').value.trim();
  if (!answer) { alert('Please write your answer first.'); return; }

  const words = answer.split(/\s+/).length;
  const hasStar = /situation|task|action|result/i.test(answer);
  const hasNumbers = /\d+%|\d+ years|\d+ months|increased|reduced|improved|achieved/i.test(answer);
  const hasExample = /for example|instance|specifically|when i|in my/i.test(answer);

  let score = 50;
  if (words > 60) score += 15;
  if (hasStar) score += 20;
  if (hasNumbers) score += 10;
  if (hasExample) score += 5;
  score = Math.min(100, score);

  const tips = [];
  if (!hasStar) tips.push('Structure your answer using the STAR method (Situation, Task, Action, Result).');
  if (!hasNumbers) tips.push('Add quantifiable results – numbers make your answer more credible (e.g., "improved efficiency by 30%").');
  if (words < 60) tips.push('Expand your answer to at least 80–120 words for an impactful response.');
  if (!hasExample) tips.push('Include a specific personal example rather than speaking in generalities.');

  const text = `Your answer scored ${score}/100. ${score >= 75 ? 'Strong response with good structure.' : score >= 55 ? 'Decent answer that could use more depth.' : 'This answer needs significant improvement.'} ${hasStar ? '✓ Good use of the STAR structure.' : ''} ${tips.length ? 'Suggestions: ' + tips[0] : 'Keep practicing to build fluency.'}`;

  const fb = document.getElementById('hrFeedback');
  document.getElementById('hrFeedbackText').textContent = text;
  fb.style.display = 'block';
}

renderQuestions();
