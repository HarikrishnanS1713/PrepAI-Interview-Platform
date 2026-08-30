const APT = {
  quant: [
    { q: "A train travels 360 km in 4 hours. What is its speed in km/h?", opts: ["80", "90", "100", "120"], ans: 1, exp: "Speed = Distance/Time = 360/4 = 90 km/h." },
    { q: "What is 15% of 400?", opts: ["50", "55", "60", "65"], ans: 2, exp: "15% of 400 = (15/100) × 400 = 60." },
    { q: "If 3x + 7 = 22, what is x?", opts: ["3", "4", "5", "6"], ans: 2, exp: "3x = 22 - 7 = 15, so x = 5." },
    { q: "Find the LCM of 12 and 18.", opts: ["24", "36", "48", "54"], ans: 1, exp: "12 = 2²×3, 18 = 2×3². LCM = 2²×3² = 36." },
    { q: "A shopkeeper buys an item for ₹500 and sells it for ₹600. Profit %?", opts: ["15%", "20%", "25%", "10%"], ans: 1, exp: "Profit% = (100/500)×100 = 20%." },
    { q: "What is the area of a circle with radius 7? (π ≈ 22/7)", opts: ["154", "144", "164", "176"], ans: 0, exp: "Area = πr² = (22/7)×49 = 154 sq. units." },
    { q: "Simple interest on ₹1000 at 10% per annum for 2 years?", opts: ["₹150", "₹200", "₹100", "₹250"], ans: 1, exp: "SI = (P×R×T)/100 = (1000×10×2)/100 = ₹200." },
    { q: "In a class of 40, 60% are girls. How many boys?", opts: ["16", "20", "24", "18"], ans: 0, exp: "Girls = 24, Boys = 40 - 24 = 16." },
    { q: "If 2:x = 4:10, find x.", opts: ["5", "4", "3", "6"], ans: 0, exp: "Cross multiply: 2×10 = 4×x → x = 20/4 = 5." },
    { q: "Average of 10, 20, 30, 40, 50?", opts: ["25", "30", "35", "40"], ans: 1, exp: "Average = (10+20+30+40+50)/5 = 150/5 = 30." }
  ],
  logical: [
    { q: "If all roses are flowers and all flowers are plants, are all roses plants?", opts: ["Yes", "No", "Cannot determine", "Sometimes"], ans: 0, exp: "By transitivity: roses → flowers → plants, so all roses are plants." },
    { q: "Complete the series: 2, 4, 8, 16, __", opts: ["24", "32", "30", "18"], ans: 1, exp: "Each term is doubled: 16 × 2 = 32." },
    { q: "If A is west of B, and C is north of B, what direction is A from C?", opts: ["North", "South", "South-West", "East"], ans: 2, exp: "A is west of B and B is south of C, so A is to the south-west of C." },
    { q: "Odd one out: Cat, Dog, Eagle, Tiger", opts: ["Cat", "Dog", "Eagle", "Tiger"], ans: 2, exp: "Eagle is a bird; the rest are mammals." },
    { q: "If APPLE = 50, MANGO = 50, then ORANGE = ?", opts: ["60", "54", "63", "66"], ans: 2, exp: "Word value based on letter count × position: O(15)+R(18)+A(1)+N(14)+G(7)+E(5) = 60... Each letter's alphabetic value summed = 63." },
    { q: "A is taller than B. B is taller than C. Who is shortest?", opts: ["A", "B", "C", "Cannot tell"], ans: 2, exp: "A > B > C, so C is the shortest." },
    { q: "Which number is next: 1, 1, 2, 3, 5, 8, __?", opts: ["11", "12", "13", "15"], ans: 2, exp: "This is the Fibonacci sequence: 5+8 = 13." },
    { q: "Mirror image: if a clock shows 2:30, what does its mirror show?", opts: ["9:30", "2:30", "10:30", "8:30"], ans: 0, exp: "Mirror of 2:30 → the hour and minute hands swap, giving 9:30." }
  ],
  verbal: [
    { q: "Choose the synonym of 'Verbose':", opts: ["Brief", "Wordy", "Silent", "Clear"], ans: 1, exp: "Verbose means using more words than necessary – a synonym is 'wordy'." },
    { q: "Choose the antonym of 'Candid':", opts: ["Honest", "Direct", "Deceptive", "Frank"], ans: 2, exp: "Candid means honest and straightforward. Its antonym is 'deceptive'." },
    { q: "Fill in: She __ studying for three hours. (Present Perfect Continuous)", opts: ["has been", "was", "is", "have been"], ans: 0, exp: "'Has been studying' is the correct present perfect continuous form for 'she'." },
    { q: "Identify the passive voice: 'The book was written by Riya.'", opts: ["Active", "Passive", "Interrogative", "Imperative"], ans: 1, exp: "The subject (book) receives the action – this is passive voice." },
    { q: "What does 'Procrastinate' mean?", opts: ["To hurry", "To delay tasks", "To plan ahead", "To multitask"], ans: 1, exp: "Procrastinate means to delay or postpone action unnecessarily." },
    { q: "Choose the correctly spelled word:", opts: ["Recieve", "Achieve", "Beleive", "Releive"], ans: 1, exp: "Achieve is correctly spelled. Remember: 'i before e except after c'." },
    { q: "The idiom 'burn the midnight oil' means:", opts: ["Start a fire", "Work late into the night", "Waste resources", "Cook dinner"], ans: 1, exp: "To 'burn the midnight oil' means to work or study late into the night." }
  ],
  mixed: []
};
APT.mixed = [...APT.quant.slice(0,4), ...APT.logical.slice(0,3), ...APT.verbal.slice(0,3)];

let apt = { questions: [], current: 0, correct: 0, total: 10, timer: null, answered: false };

function startApt() {
  const type = document.getElementById('aptType').value;
  apt.total = parseInt(document.getElementById('aptCount').value);
  const pool = [...APT[type]].sort(() => Math.random() - 0.5);
  apt.questions = pool.slice(0, Math.min(apt.total, pool.length));
  apt.total = apt.questions.length;
  apt.current = 0; apt.correct = 0;

  document.getElementById('aptSetup').style.display = 'none';
  document.getElementById('aptPanel').style.display = 'block';
  document.getElementById('aptQTotal').textContent = apt.total;
  loadApt();
}

function loadApt() {
  clearInterval(apt.timer);
  apt.answered = false;
  const q = apt.questions[apt.current];
  document.getElementById('aptQNum').textContent = apt.current + 1;
  document.getElementById('aptProgress').style.width = `${((apt.current)/apt.total)*100}%`;
  document.getElementById('aptQuestion').textContent = q.q;
  document.getElementById('aptExp').style.display = 'none';
  document.getElementById('aptNextBtn').style.display = 'none';

  const labels = ['A','B','C','D'];
  document.getElementById('aptOptions').innerHTML = q.opts.map((o,i) => `
    <div class="quiz-option" onclick="selectApt(${i})" id="aopt${i}">
      <span class="option-label">${labels[i]}</span> ${o}
    </div>`).join('');

  let t = 90;
  document.getElementById('aptTimer').textContent = t;
  apt.timer = setInterval(() => {
    t--;
    document.getElementById('aptTimer').textContent = t;
    if (t <= 0) { clearInterval(apt.timer); selectApt(-1); }
  }, 1000);
}

function selectApt(idx) {
  if (apt.answered) return;
  apt.answered = true;
  clearInterval(apt.timer);
  const q = apt.questions[apt.current];
  if (idx === q.ans) apt.correct++;
  document.querySelectorAll('.quiz-option').forEach((el, i) => {
    el.style.pointerEvents = 'none';
    if (i === q.ans) el.classList.add('correct');
    else if (i === idx) el.classList.add('wrong');
  });
  const expEl = document.getElementById('aptExp');
  expEl.textContent = '📐 ' + q.exp;
  expEl.style.display = 'block';
  document.getElementById('aptNextBtn').style.display = 'block';
}

function nextApt() {
  apt.current++;
  if (apt.current >= apt.questions.length) {
    document.getElementById('aptPanel').style.display = 'none';
    document.getElementById('aptResults').style.display = 'block';
    const pct = Math.round((apt.correct / apt.questions.length) * 100);
    document.getElementById('aptResultScores').innerHTML = `
      <div class="score-chip"><span class="score-chip-val" style="color:#6ee7b7">${pct}%</span><span class="score-chip-label">Score</span></div>
      <div class="score-chip"><span class="score-chip-val" style="color:#60a5fa">${apt.correct}</span><span class="score-chip-label">Correct</span></div>
      <div class="score-chip"><span class="score-chip-val" style="color:#ef4444">${apt.questions.length-apt.correct}</span><span class="score-chip-label">Incorrect</span></div>
    `;
    const h = JSON.parse(localStorage.getItem('sessionHistory')||'[]');
    h.push({ type:'Aptitude Test', domain:'aptitude', score:pct, questions:apt.questions.length, date:new Date().toLocaleDateString() });
    localStorage.setItem('sessionHistory', JSON.stringify(h));
  } else loadApt();
}
