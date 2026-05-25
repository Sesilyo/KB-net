// FILENAME: scripts/login_signup.js

// ── Tab switcher ─────────────────────────────────────────────────────────────
function switchTab(tab) {
  const loginForm  = document.getElementById('form-login');
  const signupForm = document.getElementById('form-signup');
  const tabLogin   = document.getElementById('tab-login');
  const tabSignup  = document.getElementById('tab-signup');
  const indicator  = document.getElementById('tab-indicator');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    loginForm.classList.add('visible');
    signupForm.classList.add('hidden');
    signupForm.classList.remove('visible');
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    indicator.style.transform = 'translateX(0)';
  } else {
    signupForm.classList.remove('hidden');
    signupForm.classList.add('visible');
    loginForm.classList.add('hidden');
    loginForm.classList.remove('visible');
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    indicator.style.transform = 'translateX(100%)';
  }
}

// ── Sign Up ──────────────────────────────────────────────────────────────────
async function handleSignup() {
  const body = new FormData();
  body.append('student_id', document.getElementById('signup-sid').value);
  body.append('first_name', document.getElementById('signup-first').value);
  body.append('last_name',  document.getElementById('signup-last').value);
  body.append('email',      document.getElementById('signup-email').value);
  body.append('password',   document.getElementById('signup-password').value);

  const res  = await fetch('../api/adduser.php', { method: 'POST', body });
  const data = await res.json();
  console.log(data);

  if (data.success) {
    document.getElementById('signup-msg').textContent = 'Account created successfully!';
    ['signup-sid', 'signup-first', 'signup-last', 'signup-email', 'signup-password']
      .forEach(id => document.getElementById(id).value = '');
  } else {
    document.getElementById('signup-msg').textContent = data.message;
  }
}

// ── Log In ───────────────────────────────────────────────────────────────────
async function handleLogin() {
  // TODO: implement login endpoint
}

// ── Event Listeners ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tab-login') .addEventListener('click', () => switchTab('login'));
  document.getElementById('tab-signup').addEventListener('click', () => switchTab('signup'));

  document.querySelectorAll('[data-switch]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.switch));
  });

  document.getElementById('btn-login') .addEventListener('click', handleLogin);
  document.getElementById('btn-signup').addEventListener('click', handleSignup);
});