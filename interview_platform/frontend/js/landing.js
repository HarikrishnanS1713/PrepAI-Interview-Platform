// Landing page interactions
document.addEventListener('DOMContentLoaded', () => {

  // Typing animation in hero mock card
  const lines = [
    "I have worked extensively with data structures ",
    "including arrays, linked lists, trees, and graphs. ",
    "For example, I implemented a balanced BST to ",
    "optimize search operations from O(n) to O(log n)..."
  ];
  let lineIdx = 0, charIdx = 0;
  const typingEl = document.getElementById('typingText');
  let fullText = '';

  function type() {
    if (!typingEl) return;
    if (lineIdx < lines.length) {
      if (charIdx < lines[lineIdx].length) {
        fullText += lines[lineIdx][charIdx++];
        typingEl.textContent = fullText;
        setTimeout(type, 38);
      } else {
        lineIdx++; charIdx = 0;
        setTimeout(type, 300);
      }
    }
  }
  setTimeout(type, 1200);

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor = window.scrollY > 40
      ? 'rgba(30,42,64,0.8)' : 'var(--border)';
  });

  // Animate feedback bars on scroll
  const bars = document.querySelectorAll('.bar-fill');
  const widths = [];
  bars.forEach(b => { widths.push(b.style.width); b.style.width = '0'; });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        bars.forEach((b, i) => { b.style.width = widths[i]; });
        obs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  const card = document.querySelector('.mock-card');
  if (card) obs.observe(card);

  // Hamburger (mobile)
  const ham = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (ham) {
    ham.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '64px';
      navLinks.style.left = 0; navLinks.style.right = 0;
      navLinks.style.background = 'var(--bg2)';
      navLinks.style.padding = '20px';
      navLinks.style.borderBottom = '1px solid var(--border)';
    });
  }
});
