// Mock Interview Logic
const QUESTIONS = {
  programming: [
    "Explain the difference between stack and queue data structures. When would you use each?",
    "What is Big O notation? Explain O(1), O(n), and O(n log n) with examples.",
    "What is the difference between an abstract class and an interface in OOP?",
    "Explain recursion with an example. What is a base case?",
    "What are the differences between REST and GraphQL APIs?",
    "Explain the concept of closures in programming.",
    "What is the difference between synchronous and asynchronous programming?",
    "Describe the MVC design pattern and its advantages.",
    "What is dependency injection and why is it useful?",
    "Explain memory management and garbage collection.",
    "What is a hash map and how does it handle collisions?",
    "Explain the difference between deep copy and shallow copy.",
    "What are SOLID principles in software design?",
    "How does a binary search tree differ from a regular binary tree?",
    "Explain the concept of threads and multithreading."
  ],
  hr: [
    "Tell me about yourself and your background.",
    "What are your greatest strengths and weaknesses?",
    "Describe a time when you had to work with a difficult team member. How did you handle it?",
    "Where do you see yourself in 5 years?",
    "Tell me about a project you are most proud of.",
    "How do you handle tight deadlines and pressure?",
    "Describe a situation where you showed leadership.",
    "Why do you want to work for our company?",
    "What motivates you in your work?",
    "Tell me about a time you made a mistake and what you learned from it."
  ],
  technical: [
    "Explain the difference between PRIMARY KEY and UNIQUE KEY in SQL.",
    "What is normalization in databases? Explain 1NF, 2NF, 3NF.",
    "What is a deadlock in operating systems? How can it be prevented?",
    "Explain the differences between TCP and UDP protocols.",
    "What is virtual memory and how does paging work?",
    "Explain ACID properties in database transactions.",
    "What is the difference between process and thread?",
    "Explain indexing in databases and its types.",
    "What is a JOIN in SQL? Explain INNER, LEFT, RIGHT, and FULL JOIN.",
    "What is the OSI model? Name all 7 layers."
  ],
  mixed: []
};

// Mix questions for 'mixed' domain
QUESTIONS.mixed = [...QUESTIONS.programming.slice(0,4), ...QUESTIONS.hr.slice(0,3), ...QUESTIONS.technical.slice(0,3)];

let state = {
  questions: [],
  current: 0,
  total: 10,
  domain: 'programming',
  scores: [],
  answered: false
};

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function startInterview() {
  state.domain = document.getElementById('interviewDomain').value;
  state.total = parseInt(document.getElementById('numQuestions').value);
  const pool = shuffle([...QUESTIONS[state.domain]]);
  state.questions = pool.slice(0, state.total);
  state.current = 0;
  state.scores = [];

  document.getElementById('setupPanel').style.display = 'none';
  document.getElementById('sessionPanel').style.display = 'block';
  document.getElementById('totalQ').textContent = state.total;

  const tagMap = { programming:'tag-programming', hr:'tag-hr', technical:'tag-technical', mixed:'tag-aptitude' };
  document.getElementById('domainBadge').className = 'question-tag ' + tagMap[state.domain];
  document.getElementById('domainBadge').textContent = state.domain.charAt(0).toUpperCase() + state.domain.slice(1);

  loadQuestion();
}

function loadQuestion() {
  const q = state.questions[state.current];
  document.getElementById('currentQ').textContent = state.current + 1;
  document.getElementById('questionNum').textContent = `Q${state.current + 1}`;
  document.getElementById('questionContent').textContent = q;
  document.getElementById('answerArea').value = '';
  document.getElementById('progressFill').style.width = `${((state.current) / state.total) * 100}%`;
  document.getElementById('feedbackPanel').classList.remove('visible');
  document.getElementById('submitBtn').disabled = false;
  state.answered = false;
}

async function submitAnswer() {
  const answer = document.getElementById('answerArea').value.trim();
  if (!answer) { alert('Please write an answer before submitting.'); return; }
  if (state.answered) return;
  state.answered = true;

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Analyzing...';

  // Generate AI feedback
  const feedback = await generateFeedback(state.questions[state.current], answer, state.domain);
  displayFeedback(feedback);

  state.scores.push(feedback.overallScore);
  btn.innerHTML = 'Submit Answer <i class="fas fa-arrow-right"></i>';
}

async function generateFeedback(question, answer, domain) {
  // Try real AI API first
  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify({ question, answer, domain })
    });
    if (res.ok) return await res.json();
  } catch {}

  // Local scoring fallback (demo mode)
  return localScoring(question, answer, domain);
}

function localScoring(question, answer, domain) {
  const words = answer.trim().split(/\s+/).length;
  const hasExample = /example|instance|for instance|such as|e\.g\./i.test(answer);
  const hasStructure = /first|second|also|however|because|therefore/i.test(answer);
  const hasTechTerms = /algorithm|function|class|object|method|variable|array|loop|database|server|api|process|memory/i.test(answer);

  let clarity = Math.min(100, 40 + (words > 30 ? 20 : words > 15 ? 10 : 0) + (hasStructure ? 20 : 0) + Math.floor(Math.random()*20));
  let depth = Math.min(100, 30 + (words > 50 ? 25 : words > 25 ? 15 : 0) + (hasExample ? 20 : 0) + (hasTechTerms ? 15 : 0) + Math.floor(Math.random()*10));
  let confidence = Math.min(100, 35 + (words > 20 ? 15 : 0) + (hasStructure ? 20 : 0) + Math.floor(Math.random()*30));
  let relevance = Math.min(100, 50 + (hasTechTerms ? 20 : 0) + (hasExample ? 10 : 0) + Math.floor(Math.random()*20));
  let overallScore = Math.round((clarity + depth + confidence + relevance) / 4);

  const suggestions = [];
  if (words < 30) suggestions.push('Expand your answer – aim for at least 80–100 words with full explanations.');
  if (!hasExample) suggestions.push('Include a concrete real-world example to demonstrate understanding.');
  if (!hasStructure) suggestions.push('Use transitional words (first, then, however) to improve answer flow.');
  if (domain === 'programming' && !hasTechTerms) suggestions.push('Mention relevant technical terms, algorithms, or data structures.');
  if (domain === 'hr') suggestions.push('Use the STAR method: Situation, Task, Action, Result.');
  if (suggestions.length === 0) suggestions.push('Great answer! Consider adding more depth with edge cases or alternatives.');

  const texts = [
    `Your answer covers the basics ${overallScore > 70 ? 'very well' : 'adequately'}. ${hasExample ? 'Good use of examples.' : 'Adding examples would strengthen it.'} ${hasStructure ? 'Your response is well-structured.' : 'A clearer structure would help readability.'}`,
    `${overallScore > 75 ? 'Strong response overall.' : 'Decent attempt.'} ${words < 40 ? 'Try to be more elaborate in your explanations.' : 'Good level of detail.'} Focus on demonstrating both theoretical knowledge and practical application.`
  ];

  return { clarity, depth, confidence, relevance, overallScore, text: texts[Math.floor(Math.random()*2)], suggestions };
}

function displayFeedback(f) {
  const panel = document.getElementById('feedbackPanel');
  const scores = document.getElementById('feedbackScores');
  const text = document.getElementById('feedbackText');
  const sugg = document.getElementById('feedbackSuggestions');

  const scoreColor = s => s >= 75 ? '#6ee7b7' : s >= 55 ? '#f59e0b' : '#ef4444';

  scores.innerHTML = [
    { label: 'Clarity', val: f.clarity },
    { label: 'Depth', val: f.depth },
    { label: 'Confidence', val: f.confidence },
    { label: 'Relevance', val: f.relevance },
    { label: 'Overall', val: f.overallScore }
  ].map(s => `
    <div class="score-chip">
      <span class="score-chip-val" style="color:${scoreColor(s.val)}">${s.val}%</span>
      <span class="score-chip-label">${s.label}</span>
    </div>
  `).join('');

  text.textContent = f.text;
  sugg.innerHTML = f.suggestions.map(s => `<li>${s}</li>`).join('');
  panel.classList.add('visible');
}

function skipQuestion() {
  state.scores.push(0);
  nextQuestion();
}

function nextQuestion() {
  state.current++;
  if (state.current >= state.total) {
    showResults();
  } else {
    loadQuestion();
  }
}

function showResults() {
  document.getElementById('sessionPanel').style.display = 'none';
  document.getElementById('resultsPanel').style.display = 'block';

  const avg = Math.round(state.scores.reduce((a,b)=>a+b,0)/state.scores.length);
  const max = Math.max(...state.scores);
  const min = Math.min(...state.scores.filter(s=>s>0));

  document.getElementById('resultScores').innerHTML = `
    <div class="score-chip"><span class="score-chip-val" style="color:#6ee7b7">${avg}%</span><span class="score-chip-label">Avg Score</span></div>
    <div class="score-chip"><span class="score-chip-val" style="color:#60a5fa">${state.total}</span><span class="score-chip-label">Questions</span></div>
    <div class="score-chip"><span class="score-chip-val" style="color:#f59e0b">${max}%</span><span class="score-chip-label">Best Answer</span></div>
  `;

  // Save to history
  const history = JSON.parse(localStorage.getItem('sessionHistory') || '[]');
  history.push({
    type: 'Mock Interview',
    domain: state.domain,
    score: avg,
    questions: state.total,
    date: new Date().toLocaleDateString()
  });
  localStorage.setItem('sessionHistory', JSON.stringify(history));
}
