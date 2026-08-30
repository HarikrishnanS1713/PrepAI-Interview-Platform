document.addEventListener('DOMContentLoaded', () => {
  const history = JSON.parse(localStorage.getItem('sessionHistory') || '[]');

  if (!history.length) {
    document.getElementById('pSessions').textContent = '0';
    document.getElementById('noChartMsg').style.display = 'block';
    document.getElementById('recommendations').innerHTML = '<p>No sessions yet. Start practicing to see your personalized recommendations!</p>';
    return;
  }

  // Stats
  const scores = history.map(h => h.score || 0);
  const avg = Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
  const best = Math.max(...scores);
  const totalQ = history.reduce((s,h) => s+(h.questions||0), 0);

  document.getElementById('pAvg').textContent = avg + '%';
  document.getElementById('pSessions').textContent = history.length;
  document.getElementById('pQuestions').textContent = totalQ;
  document.getElementById('pBest').textContent = best + '%';

  // Trend Chart
  const ctx = document.getElementById('trendChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: history.map((_, i) => `S${i+1}`),
      datasets: [{
        label: 'Score %',
        data: scores,
        borderColor: '#6ee7b7',
        backgroundColor: 'rgba(110,231,183,0.08)',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: '#6ee7b7',
        pointRadius: 4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: 0, max: 100,
          grid: { color: 'rgba(30,42,64,0.8)' },
          ticks: { color: '#7a8fa6', font: { family: 'DM Sans' } }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#7a8fa6', font: { family: 'DM Sans' } }
        }
      }
    }
  });

  // Domain breakdown
  const domainMap = {};
  history.forEach(h => {
    if (!domainMap[h.domain]) domainMap[h.domain] = { total: 0, count: 0 };
    domainMap[h.domain].total += h.score || 0;
    domainMap[h.domain].count++;
  });
  const domainBreak = document.getElementById('domainBreakdown');
  domainBreak.innerHTML = Object.entries(domainMap).map(([d, v]) => {
    const avg = Math.round(v.total / v.count);
    const color = avg >= 75 ? '#6ee7b7' : avg >= 55 ? '#f59e0b' : '#ef4444';
    return `
      <div style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:0.85rem;">
          <span>${d.charAt(0).toUpperCase()+d.slice(1)}</span>
          <span style="color:${color};font-weight:600;">${avg}%</span>
        </div>
        <div class="bar" style="height:8px;">
          <div class="bar-fill" style="width:${avg}%;background:${color};"></div>
        </div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:3px;">${v.count} session${v.count>1?'s':''}</div>
      </div>`;
  }).join('');

  // Type breakdown
  const typeMap = {};
  history.forEach(h => {
    const t = h.type || 'Other';
    if (!typeMap[t]) typeMap[t] = { total: 0, count: 0 };
    typeMap[t].total += h.score || 0;
    typeMap[t].count++;
  });
  document.getElementById('typeBreakdown').innerHTML = Object.entries(typeMap).map(([t,v]) => {
    const a = Math.round(v.total/v.count);
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);font-size:0.88rem;">
        <span>${t}</span>
        <div style="text-align:right;">
          <div style="font-family:var(--font-display);font-weight:700;color:#6ee7b7;">${a}%</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">${v.count} sessions</div>
        </div>
      </div>`;
  }).join('');

  // Recommendations
  const recs = [];
  Object.entries(domainMap).forEach(([d, v]) => {
    const a = Math.round(v.total/v.count);
    if (a < 60) recs.push(`📌 Your <strong>${d}</strong> scores are below 60%. Focus more practice sessions on this domain.`);
    else if (a < 75) recs.push(`📈 Your <strong>${d}</strong> performance is improving. Try harder difficulty to level up.`);
  });
  if (scores.length >= 3) {
    const recent3 = scores.slice(-3);
    const trend = recent3[2] - recent3[0];
    if (trend > 0) recs.push('🚀 Your scores are trending upward! Keep up the momentum.');
    else if (trend < -5) recs.push('⚠️ Your recent scores have dipped. Consider reviewing fundamentals before new sessions.');
  }
  if (totalQ < 30) recs.push('🎯 Practice more frequently – aim for at least 20 questions per day for rapid improvement.');
  recs.push('💡 Tip: Combine technical quiz practice with mock interviews for a well-rounded preparation strategy.');
  document.getElementById('recommendations').innerHTML = recs.map(r => `<p style="margin-bottom:10px;">${r}</p>`).join('');
});
