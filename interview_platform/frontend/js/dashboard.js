// Dashboard JS
document.addEventListener('DOMContentLoaded', () => {
  // Load user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const name = user.name || 'User';
  const initial = name.charAt(0).toUpperCase();

  document.getElementById('userName').textContent = name.split(' ')[0];
  document.getElementById('sidebarUserName').textContent = name;
  document.getElementById('userAvatarInitial').textContent = initial;

  // Load stats from localStorage (demo)
  const history = JSON.parse(localStorage.getItem('sessionHistory') || '[]');
  const sessions = history.length;
  const totalScore = history.reduce((s, h) => s + (h.score || 0), 0);
  const avgScore = sessions ? Math.round(totalScore / sessions) : 0;
  const totalQ = history.reduce((s, h) => s + (h.questions || 0), 0);

  document.getElementById('statSessions').textContent = sessions;
  document.getElementById('statScore').textContent = sessions ? avgScore + '%' : '–';
  document.getElementById('statStreak').textContent = Math.min(sessions, 7);
  document.getElementById('statQuestions').textContent = totalQ;

  // Recent activity table
  const tbody = document.getElementById('recentActivity');
  if (history.length > 0) {
    const recent = history.slice(-5).reverse();
    tbody.innerHTML = recent.map(h => `
      <tr>
        <td>${h.type || 'Mock Interview'}</td>
        <td>${h.domain || '–'}</td>
        <td>${h.score || 0}%</td>
        <td><span class="badge ${h.score >= 60 ? 'badge-pass' : 'badge-fail'}">${h.score >= 60 ? 'Pass' : 'Fail'}</span></td>
        <td>${h.date || '–'}</td>
      </tr>
    `).join('');
  }

  // Greet by time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const h1 = document.querySelector('.page-header h1');
  if (h1) h1.innerHTML = `${greeting}, <span id="userName">${name.split(' ')[0]}</span> 👋`;
});
