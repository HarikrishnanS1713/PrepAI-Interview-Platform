// Auth helper functions
function showAlert(msg, type='error') {
  const box = document.getElementById('alertBox');
  if (!box) return;
  box.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
  setTimeout(() => box.innerHTML = '', 4000);
}

// Login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const btn = document.getElementById('loginBtn');
    const btnText = document.getElementById('btnText');

    if (!email || !password) { showAlert('Please fill in all fields.'); return; }
    btnText.textContent = 'Logging in...';
    btn.disabled = true;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = 'dashboard.html';
      } else {
        showAlert(data.error || 'Login failed.');
      }
    } catch {
      // Demo mode – no backend
      if (email && password.length >= 4) {
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('user', JSON.stringify({ name: 'Demo User', email, domain: 'programming', experience: 'fresher' }));
        window.location.href = 'dashboard.html';
      } else {
        showAlert('Invalid credentials. (Demo: any email + 4+ char password)');
      }
    } finally {
      btnText.textContent = 'Log In';
      btn.disabled = false;
    }
  });
}

// Register form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const domain = document.getElementById('domain').value;
    const experience = document.getElementById('experience').value;

    if (!name || !email || !password || !domain) { showAlert('Please fill in all required fields.'); return; }
    if (password.length < 8) { showAlert('Password must be at least 8 characters.'); return; }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, domain, experience })
      });
      const data = await res.json();
      if (res.ok) {
        showAlert('Account created! Redirecting...', 'success');
        setTimeout(() => window.location.href = 'login.html', 1500);
      } else {
        showAlert(data.error || 'Registration failed.');
      }
    } catch {
      // Demo mode
      localStorage.setItem('user', JSON.stringify({ name, email, domain, experience }));
      showAlert('Account created! Redirecting to login...', 'success');
      setTimeout(() => window.location.href = 'login.html', 1500);
    }
  });
}
