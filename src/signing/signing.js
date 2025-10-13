document.addEventListener('DOMContentLoaded', () => {
  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');
  const toggle = document.getElementById('toggle-form');
  const formTitle = document.getElementById('form-title');
  const switchMode = document.getElementById('switch-mode');
  const toast = document.getElementById('toast');

  // ✅ Show custom toast notification
  function showToast(message, type = "info") {
    toast.textContent = message;
    toast.className =
      `fixed top-5 right-5 px-5 py-3 rounded-md shadow-lg text-sm transition-all duration-500 z-50 ${type === 'error'
        ? 'bg-red-500 text-white'
        : 'bg-[#006dca] text-white'
      }`;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2500);
  }

  // ✅ Switch between sign-in and sign-up forms
  function toggleForm() {
    signinForm.classList.toggle('hidden');
    signupForm.classList.toggle('hidden');

    if (signinForm.classList.contains('hidden')) {
      formTitle.textContent = 'Sign Up';
      switchMode.innerHTML =
        'Already have an account? <span id="toggle-form" class="text-[#006dca] cursor-pointer font-semibold">Sign In</span>';
    } else {
      formTitle.textContent = 'Sign In';
      switchMode.innerHTML =
        'Don’t have an account? <span id="toggle-form" class="text-[#006dca] cursor-pointer font-semibold">Sign Up</span>';
    }

    // Rebind click handler after switching
    document.getElementById('toggle-form').addEventListener('click', toggleForm);
  }

  if (toggle) toggle.addEventListener('click', toggleForm);

  // ✅ Handle Sign In
  signinForm.addEventListener('submit', e => {
    e.preventDefault();

    const id = document.getElementById('signin-id').value.trim();
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value.trim();

    if (!id || !email || !password) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    // Simulate success (replace with real auth later)
    showToast('Sign in successful!');
    setTimeout(() => {
      window.location.href = '../../index.html'; // Redirect to homepage
    }, 1500);
  });

  // ✅ Handle Sign Up
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const id = document.getElementById('signup-id').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const confirm = document.getElementById('signup-confirm').value.trim();

    if (!name || !id || !email || !password || !confirm) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    if (password !== confirm) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    // Simulate account creation
    showToast('Account created successfully!');
    setTimeout(() => {
      window.location.href = '../../index.html'; // Redirect to homepage
    }, 1500);
  });
  
});
