(function () {
  let currentLang = 'en';

  const translations = {
    en: {
      nav: ['Home', 'About', 'Courses', 'Contact'],
      signin: 'Sign In',
      signup: 'Sign Up',
      id: 'Student ID',
      name: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      confirm: 'Confirm Password',
      switch_signup: "Don’t have an account?",
      switch_signin: "Already have an account?"
    },
    ar: {
      nav: ['الرئيسية', 'من نحن', 'الدورات', 'تواصل معنا'],
      signin: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      id: 'الرقم التعريفي',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirm: 'تأكيد كلمة المرور',
      switch_signup: 'ليس لديك حساب؟',
      switch_signin: 'هل لديك حساب بالفعل؟'
    }
  };

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  function getNavLinks() {
    const navUl = $('nav ul') || $('nav');
    if (!navUl) return [];
    const anchors = Array.from(navUl.querySelectorAll('a'));
    return anchors.slice(0, 4);
  }

  function applyLang(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    const t = translations[lang];

    document.documentElement.lang = lang;
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Navbar
    getNavLinks().forEach((a, i) => { if (t.nav[i]) a.textContent = t.nav[i]; });

    const signinForm = $('#signin-form');
    const signupForm = $('#signup-form');
    const isSignInVisible = signinForm && !signinForm.classList.contains('hidden');

    const title = $('#form-title');
    if (title) title.textContent = isSignInVisible ? t.signin : t.signup;

    if (signinForm) {
      const i = signinForm.querySelectorAll('input');
      if (i[0]) i[0].placeholder = t.id;
      if (i[1]) i[1].placeholder = t.email;
      if (i[2]) i[2].placeholder = t.password;
      const btn = signinForm.querySelector('button[type="submit"]');
      if (btn) btn.textContent = t.signin;
    }

    if (signupForm) {
      const i = signupForm.querySelectorAll('input');
      if (i[0]) i[0].placeholder = t.name;
      if (i[1]) i[1].placeholder = t.id;
      if (i[2]) i[2].placeholder = t.email;
      if (i[3]) i[3].placeholder = t.password;
      if (i[4]) i[4].placeholder = t.confirm;
      const btn = signupForm.querySelector('button[type="submit"]');
      if (btn) btn.textContent = t.signup;
    }

    const switchMode = $('#switch-mode');
    if (switchMode) {
      switchMode.innerHTML = isSignInVisible
        ? `${t.switch_signup} <span id="toggle-form" class="text-[#006dca] cursor-pointer font-semibold">${t.signup}</span>`
        : `${t.switch_signin} <span id="toggle-form" class="text-[#006dca] cursor-pointer font-semibold">${t.signin}</span>`;
    }

    // Keep cards centered but inputs aligned naturally
    const card = $('.card') || $('.form-box') || $('#sign-container');
    if (card) card.style.textAlign = 'center';
    $$('.input').forEach(input => {
      input.style.textAlign = lang === 'ar' ? 'right' : 'left';
    });

    // re-bind toggle
    bindToggleHandler();
  }

  function bindToggleHandler() {
    const toggle = $('#toggle-form');
    if (toggle) {
      toggle.onclick = () => {
        const signin = $('#signin-form');
        const signup = $('#signup-form');
        if (signin && signup) {
          signin.classList.toggle('hidden');
          signup.classList.toggle('hidden');
        }
        setTimeout(() => applyLang(currentLang), 30);
      };
    }
  }

  function attachLangButtons() {
    document.querySelectorAll('.lang-switch, #en-btn, #ar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang || (btn.id === 'ar-btn' ? 'ar' : 'en');
        applyLang(lang);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    attachLangButtons();
    applyLang(currentLang);
  });
})();
