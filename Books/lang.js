
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;
  if (themeToggle.dataset.bound === "true") return; // منع الربط المكرر
  themeToggle.dataset.bound = "true";

  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark-mode");
    localStorage.setItem(
      "theme",
      document.documentElement.classList.contains("dark-mode") ? "dark" : "light"
    );
    updateToggleText();
  });

  // نص الزر حسب اللغة
  updateToggleText();
}

/* نص زر الثيم يعتمد على اللغة والـ lang.json */
function updateToggleText() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;
  const lang = document.documentElement.lang || "ar";
  const t = window.langData?.[lang];
  if (!t) return;
  themeToggle.textContent = document.documentElement.classList.contains("dark-mode")
    ? t.light_mode || "☀️"
    : t.dark_mode || "🌙 ";
}

/* محاولة تحميل الوضع المحفوظ */
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark-mode");
  }
  initThemeToggle();
});

/* MutationObserver: يراقب DOM ويشغّل initThemeToggle و initNavbarLang عندما يظهر navbar ديناميكياً */
const observer = new MutationObserver(() => {
  initThemeToggle();
  initNavbarLang();
});
observer.observe(document.body, { childList: true, subtree: true });

/* ===== إعداد اللغة مع JSON ===== */
let currentLang = localStorage.getItem("lang") || "ar";
window.langData = {};

function loadLanguage() {
  return fetch("lang.json")
    .then(res => res.json())
    .then(data => {
      window.langData = data;
      const t = data[currentLang] || {};

      // تحديث العناصر إن وُجدت
      const pageTitle = document.getElementById("page-title");
      const booksTitle = document.getElementById("books-title");
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
      const navbarLangBtn = document.getElementById("navbarLangBtn");

      if (pageTitle) pageTitle.textContent = t.books || pageTitle.textContent;
      if (booksTitle) booksTitle.textContent = t.books || booksTitle.textContent;
      if (prevBtn && t.prev) prevBtn.textContent = t.prev;
      if (nextBtn && t.next) nextBtn.textContent = t.next;
      if (navbarLangBtn) navbarLangBtn.textContent = currentLang === "ar" ? "EN" : "AR";

      document.documentElement.lang = currentLang;
      document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

      updateToggleText();

      if (typeof window.updateBooksLang === "function") {
        window.updateBooksLang(currentLang);
      }
    })
    .catch(err => console.error("Failed to load lang.json", err));
}

/* ===== ربط زر اللغة في الـ navbar (يعمل حتى لو الـ navbar يُحمّل لاحقاً) ===== */
function initNavbarLang() {
  const btn = document.getElementById("navbarLangBtn");
  if (!btn) return;
  if (btn.dataset.bound === "true") return;
  btn.dataset.bound = "true";

  // نص أولي
  btn.textContent = currentLang === "ar" ? "EN" : "AR";

  btn.addEventListener("click", () => {
    currentLang = currentLang === "ar" ? "en" : "ar";
    localStorage.setItem("lang", currentLang);
    loadLanguage().then(() => {
      // لو أردنا إعادة تحميل الصفحة:
      location.reload();
    });
  });
}

/* ===== تهيئة أولية ===== */
loadLanguage();
initNavbarLang();
initThemeToggle();

