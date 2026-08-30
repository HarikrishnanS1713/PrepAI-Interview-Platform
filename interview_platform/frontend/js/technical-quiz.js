// Technical Quiz JS
const QUIZ_BANK = {
  dsa: [
    { q: "What is the time complexity of binary search?", opts: ["O(n)", "O(log n)", "O(n²)", "O(1)"], ans: 1, exp: "Binary search divides the search space in half each step, giving O(log n) time complexity." },
    { q: "Which data structure uses LIFO (Last In, First Out)?", opts: ["Queue", "Stack", "Deque", "Linked List"], ans: 1, exp: "Stack uses LIFO – the last element added is the first removed." },
    { q: "What is the worst-case time complexity of QuickSort?", opts: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], ans: 2, exp: "QuickSort's worst case is O(n²) when the pivot is always the smallest or largest element." },
    { q: "Which traversal visits: root, left, right?", opts: ["Inorder", "Postorder", "Preorder", "Level order"], ans: 2, exp: "Preorder traversal visits the root first, then left subtree, then right subtree." },
    { q: "What is a hash collision?", opts: ["Two keys produce the same hash value", "Hash table is full", "Key not found", "Hash function error"], ans: 0, exp: "A collision occurs when two different keys produce the same hash index." },
    { q: "Which sorting algorithm has the best average-case performance?", opts: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"], ans: 2, exp: "Merge Sort guarantees O(n log n) in all cases." },
    { q: "What is a min-heap?", opts: ["Tree where root is maximum", "Tree where root is minimum", "Sorted array", "Binary search tree"], ans: 1, exp: "A min-heap is a complete binary tree where each node is smaller than its children." },
    { q: "BFS uses which data structure?", opts: ["Stack", "Priority Queue", "Queue", "Deque"], ans: 2, exp: "BFS (Breadth-First Search) uses a queue to explore nodes level by level." },
    { q: "What is the space complexity of an array of n elements?", opts: ["O(1)", "O(log n)", "O(n)", "O(n²)"], ans: 2, exp: "An array of n elements requires O(n) space." },
    { q: "Which is NOT a graph traversal algorithm?", opts: ["DFS", "BFS", "Dijkstra's", "QuickSort"], ans: 3, exp: "QuickSort is a sorting algorithm, not a graph traversal algorithm." }
  ],
  oop: [
    { q: "Which OOP principle hides internal implementation details?", opts: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"], ans: 2, exp: "Encapsulation bundles data and methods, hiding internal details from outside." },
    { q: "What is method overloading?", opts: ["Same method name, different return types", "Same method name, different parameters", "Inheriting parent methods", "Overriding virtual methods"], ans: 1, exp: "Method overloading allows multiple methods with the same name but different parameters." },
    { q: "Which keyword is used for inheritance in Java?", opts: ["implements", "inherits", "extends", "uses"], ans: 2, exp: "In Java, 'extends' is used to inherit from a parent class." },
    { q: "What is the purpose of a constructor?", opts: ["To destroy objects", "To initialize objects", "To inherit properties", "To define methods"], ans: 1, exp: "A constructor initializes an object when it is created." },
    { q: "What is polymorphism?", opts: ["One class, many subclasses", "Many classes, one interface", "Same name, different behaviors", "Data hiding technique"], ans: 2, exp: "Polymorphism allows objects of different classes to be treated as the same type, with different behaviors." },
    { q: "An abstract class in Java:", opts: ["Cannot have methods", "Can be instantiated", "Cannot be instantiated", "Has no constructors"], ans: 2, exp: "An abstract class cannot be instantiated directly; it must be subclassed." },
    { q: "What is an interface in OOP?", opts: ["A class with private methods", "A contract defining method signatures", "A type of inheritance", "An instance of a class"], ans: 1, exp: "An interface defines a contract – a set of method signatures that implementing classes must provide." },
    { q: "Which OOP concept allows a subclass to provide specific implementation?", opts: ["Encapsulation", "Abstraction", "Overloading", "Overriding"], ans: 3, exp: "Method overriding allows a subclass to provide its own implementation of a parent class method." }
  ],
  dbms: [
    { q: "What does ACID stand for in databases?", opts: ["Atomicity, Consistency, Isolation, Durability", "Async, Concurrent, Indexed, Distributed", "Atomic, Complete, Integrated, Durable", "None of the above"], ans: 0, exp: "ACID ensures reliable database transactions: Atomicity, Consistency, Isolation, Durability." },
    { q: "Which SQL command retrieves data?", opts: ["INSERT", "UPDATE", "SELECT", "DELETE"], ans: 2, exp: "SELECT is used to query and retrieve data from a database." },
    { q: "What is a foreign key?", opts: ["A primary key in another table", "A key that references another table's primary key", "An indexed column", "A unique identifier"], ans: 1, exp: "A foreign key is a column that references the primary key of another table, establishing a relationship." },
    { q: "What is normalization?", opts: ["Speeding up queries", "Organizing tables to reduce redundancy", "Adding indexes", "Backing up data"], ans: 1, exp: "Normalization organizes database tables to reduce data redundancy and improve integrity." },
    { q: "Which JOIN returns all rows from both tables?", opts: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], ans: 3, exp: "FULL OUTER JOIN returns all rows from both tables, with NULLs where no match exists." },
    { q: "What does DDL stand for?", opts: ["Data Definition Language", "Data Display Layer", "Dynamic Data Logic", "Database Design Language"], ans: 0, exp: "DDL (Data Definition Language) includes commands like CREATE, ALTER, DROP that define database structure." },
    { q: "What is a view in SQL?", opts: ["A physical table", "A virtual table based on a query", "An index type", "A stored procedure"], ans: 1, exp: "A view is a virtual table whose contents are defined by a SQL query." }
  ],
  os: [
    { q: "What is a process?", opts: ["A program on disk", "A program in execution", "A thread", "A system call"], ans: 1, exp: "A process is a program that is currently being executed, with its own memory space." },
    { q: "What causes a deadlock?", opts: ["Too many processes", "Circular wait for resources", "High CPU usage", "Memory overflow"], ans: 1, exp: "A deadlock occurs when processes form a circular chain, each waiting for a resource held by another." },
    { q: "What is virtual memory?", opts: ["RAM", "CPU cache", "Disk space used as RAM", "ROM"], ans: 2, exp: "Virtual memory uses disk space to extend the apparent amount of RAM available to processes." },
    { q: "Which scheduling algorithm gives equal time slices to all processes?", opts: ["FCFS", "SJF", "Round Robin", "Priority"], ans: 2, exp: "Round Robin scheduling gives each process an equal, fixed time quantum in a cyclic order." },
    { q: "What is a semaphore used for?", opts: ["Memory management", "Process synchronization", "CPU scheduling", "File management"], ans: 1, exp: "Semaphores are synchronization primitives used to control access to shared resources." },
    { q: "What is thrashing?", opts: ["High CPU usage", "Excessive paging activity", "Memory leak", "Cache miss"], ans: 1, exp: "Thrashing occurs when a system spends more time paging than executing, causing performance collapse." }
  ],
  networking: [
    { q: "What does HTTP stand for?", opts: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Transport Program", "None"], ans: 0, exp: "HTTP (HyperText Transfer Protocol) is the foundation of data communication on the web." },
    { q: "Which layer of OSI handles routing?", opts: ["Data Link", "Transport", "Network", "Session"], ans: 2, exp: "The Network layer (Layer 3) handles logical addressing and routing between networks." },
    { q: "What is the default port for HTTPS?", opts: ["80", "21", "443", "8080"], ans: 2, exp: "HTTPS uses port 443 by default for secure web communication." },
    { q: "What is DNS?", opts: ["Domain Name System", "Data Network Service", "Dynamic Name Server", "Distributed Node System"], ans: 0, exp: "DNS translates human-readable domain names into IP addresses." },
    { q: "Which protocol is connectionless?", opts: ["TCP", "HTTP", "FTP", "UDP"], ans: 3, exp: "UDP is a connectionless protocol – it sends datagrams without establishing a connection first." },
    { q: "What is a subnet mask used for?", opts: ["Encrypting data", "Dividing IP networks", "Routing protocols", "DNS resolution"], ans: 1, exp: "A subnet mask divides an IP address into network and host portions, enabling subnetting." }
  ]
};

let quiz = { questions: [], current: 0, correct: 0, total: 10, timePerQ: 60, timer: null, topic: 'dsa', answered: false, results: [] };

function startQuiz() {
  quiz.topic = document.getElementById('quizTopic').value;
  quiz.total = parseInt(document.getElementById('quizCount').value);
  quiz.timePerQ = parseInt(document.getElementById('quizTime').value);
  const pool = [...QUIZ_BANK[quiz.topic]].sort(() => Math.random() - 0.5);
  quiz.questions = pool.slice(0, Math.min(quiz.total, pool.length));
  quiz.total = quiz.questions.length;
  quiz.current = 0; quiz.correct = 0; quiz.results = [];

  document.getElementById('quizSetup').style.display = 'none';
  document.getElementById('quizPanel').style.display = 'block';
  document.getElementById('qTotal').textContent = quiz.total;
  document.getElementById('timerDisplay').style.display = quiz.timePerQ ? 'inline-flex' : 'none';
  loadQuizQ();
}

function loadQuizQ() {
  clearInterval(quiz.timer);
  quiz.answered = false;
  const q = quiz.questions[quiz.current];
  document.getElementById('qNum').textContent = quiz.current + 1;
  document.getElementById('qProgress').style.width = `${((quiz.current) / quiz.total) * 100}%`;
  document.getElementById('quizQuestion').textContent = q.q;
  document.getElementById('quizExplanation').style.display = 'none';
  document.getElementById('nextQBtn').style.display = 'none';

  const optsDiv = document.getElementById('quizOptions');
  const labels = ['A', 'B', 'C', 'D'];
  optsDiv.innerHTML = q.opts.map((o, i) => `
    <div class="quiz-option" onclick="selectAnswer(${i})" id="opt${i}">
      <span class="option-label">${labels[i]}</span> ${o}
    </div>
  `).join('');

  if (quiz.timePerQ > 0) {
    let t = quiz.timePerQ;
    document.getElementById('timerVal').textContent = t;
    quiz.timer = setInterval(() => {
      t--;
      document.getElementById('timerVal').textContent = t;
      if (t <= 0) { clearInterval(quiz.timer); selectAnswer(-1); }
    }, 1000);
  }
}

function selectAnswer(idx) {
  if (quiz.answered) return;
  quiz.answered = true;
  clearInterval(quiz.timer);

  const q = quiz.questions[quiz.current];
  const isCorrect = idx === q.ans;
  if (isCorrect) quiz.correct++;

  quiz.results.push({ q: q.q, selected: idx, correct: q.ans, isCorrect });

  document.querySelectorAll('.quiz-option').forEach((el, i) => {
    el.style.pointerEvents = 'none';
    if (i === q.ans) el.classList.add('correct');
    else if (i === idx && !isCorrect) el.classList.add('wrong');
  });

  const expEl = document.getElementById('quizExplanation');
  expEl.textContent = '💡 ' + q.exp;
  expEl.style.display = 'block';
  document.getElementById('nextQBtn').style.display = 'block';
}

function nextQuizQ() {
  quiz.current++;
  if (quiz.current >= quiz.questions.length) showQuizResults();
  else loadQuizQ();
}

function showQuizResults() {
  document.getElementById('quizPanel').style.display = 'none';
  document.getElementById('quizResults').style.display = 'block';

  const pct = Math.round((quiz.correct / quiz.questions.length) * 100);
  const emojis = { high: '🏆', mid: '👍', low: '💪' };
  document.getElementById('resultEmoji').textContent = pct >= 80 ? emojis.high : pct >= 50 ? emojis.mid : emojis.low;

  document.getElementById('quizResultScores').innerHTML = `
    <div class="score-chip"><span class="score-chip-val" style="color:#6ee7b7">${pct}%</span><span class="score-chip-label">Score</span></div>
    <div class="score-chip"><span class="score-chip-val" style="color:#60a5fa">${quiz.correct}</span><span class="score-chip-label">Correct</span></div>
    <div class="score-chip"><span class="score-chip-val" style="color:#ef4444">${quiz.questions.length - quiz.correct}</span><span class="score-chip-label">Wrong</span></div>
  `;

  // Review list
  document.getElementById('quizReviewList').innerHTML = quiz.results.map((r, i) => `
    <div style="padding:10px;border-bottom:1px solid var(--border);font-size:0.85rem;">
      <span style="color:${r.isCorrect ? '#6ee7b7' : '#ef4444'};margin-right:8px;">${r.isCorrect ? '✓' : '✗'}</span>
      ${r.q}
    </div>
  `).join('');

  // Save
  const history = JSON.parse(localStorage.getItem('sessionHistory') || '[]');
  history.push({ type: 'Technical Quiz', domain: quiz.topic, score: pct, questions: quiz.questions.length, date: new Date().toLocaleDateString() });
  localStorage.setItem('sessionHistory', JSON.stringify(history));
}
