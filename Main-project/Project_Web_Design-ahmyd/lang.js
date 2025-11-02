// ===== 1️⃣ جلب زر Dark/Light Mode =====
const themeToggle = document.getElementById("theme-toggle");

// ===== 2️⃣ دالة تحديث نص الزر =====
function updateToggleText() {
  if (!themeToggle) return; // تأكد أن الزر موجود
  const lang = document.documentElement.lang || "ar";
  if (!window.langData[lang]) return;

  const t = window.langData[lang];
  if (document.documentElement.classList.contains("dark-mode")) {
    themeToggle.textContent = t.light_mode || "☀️ Light Mode";
  } else {
    themeToggle.textContent = t.dark_mode || "🌙 Dark Mode";
  }
}

// ===== 3️⃣ إعداد Dark/Light Mode =====
themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    document.documentElement.classList.contains("dark-mode") ? "dark" : "light"
  );
  updateToggleText();
});

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark-mode");
  }
  updateToggleText();
});

// ===== 4️⃣ إعداد تغيير اللغة مع JSON =====
let currentLang = localStorage.getItem("lang") || "ar";
window.langData = {};

function loadLanguage() {
  fetch("lang.json")
    .then(res => res.json())
    .then(data => {
      window.langData = data;
      const t = data[currentLang];

      document.getElementById("page-title").textContent = t.books;
      document.getElementById("books-title").textContent = t.books;
      document.getElementById("prevBtn").textContent = t.prev;
      document.getElementById("nextBtn").textContent = t.next;
      document.getElementById("langBtn").textContent = t.language;

      document.documentElement.lang = currentLang;
      document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

      // ✅ استدعاء بعد تحميل JSON والتأكد أن الزر موجود
      updateToggleText();

      if (typeof window.updateBooksLang === "function") {
        window.updateBooksLang(currentLang);
      }
    });
}

document.getElementById("langBtn").addEventListener("click", () => {
  currentLang = currentLang === "ar" ? "en" : "ar";
  localStorage.setItem("lang", currentLang);
  loadLanguage();
  // ahmyd solving problem > _ < 
    location.reload();
});

// تحميل اللغة عند بدء الصفحة
loadLanguage();

