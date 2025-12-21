// script.js — Enhanced with User Auth Support
document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      updateThemeIcons(isDark);
    });
  }

  // Language toggle
  const langToggle = document.getElementById("language-toggle-btn");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      const current = getCurrentLanguage();
      const next = current === "ar" ? "en" : "ar";
      setLanguage(next);
    });
  }

  updateCartCount();

  updateUserNavbar();

  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
  updateThemeIcons(savedTheme === "dark");

  const savedLang = localStorage.getItem("language") || "ar";
  setLanguage(savedLang);
});

function updateThemeIcons(isDark) {
  const sun = document.getElementById("sun-icon");
  const moon = document.getElementById("moon-icon");
  if (sun && moon) {
    sun.style.display = isDark ? "none" : "inline";
    moon.style.display = isDark ? "inline" : "none";
  }
}

// Language helpers
function getCurrentLanguage() {
  return document.documentElement.lang || "ar";
}

function setLanguage(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  const btn = document.getElementById("language-toggle-btn");
  if (btn) {
    btn.textContent = lang.toUpperCase();
    btn.setAttribute("data-lang", lang);
  }

  loadTranslations().catch((err) => console.warn("Translations failed:", err));
  localStorage.setItem("language", lang);

  updateUserNavbar();
}

// Translations
async function loadTranslations() {
  try {
    const res = await fetch("/translations.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    window.translations = data;
    applyTranslations();
  } catch (err) {
    console.error(" Failed to load translations:", err);
  }
}

function applyTranslations() {
  const lang = getCurrentLanguage();
  const trans = window.translations?.[lang] || {};

  document.querySelectorAll("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key");
    if (key && trans[key]) el.textContent = trans[key];
  });

  document.querySelectorAll("[data-lang]").forEach((el) => {
    const key = el.getAttribute("data-lang");
    if (key && trans[key]) el.textContent = trans[key];
  });
}

// Cart
function updateCartCount() {
  const cartCountEl = document.getElementById("cart-count");
  if (!cartCountEl) return;
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCountEl.textContent = count;
  } catch (e) {
    cartCountEl.textContent = "0";
  }
}

function updateUserNavbar() {
  const userIconContainer = document.querySelector(
    ".nav-section.nav-right .user-icon",
  );
  if (!userIconContainer) return;

  const user = JSON.parse(localStorage.getItem("user"));
  const isArabic = getCurrentLanguage() === "ar";

  if (user && user.username) {
    userIconContainer.innerHTML = `
            <a href="personal/profile.html" 
               style="text-decoration: none; display: inline-block; position: relative;"
               id="user-icon-link">
                <span>👤 ${user.username}</span>
                <div id="user-menu" style="
                    position: absolute;
                    top: 100%;
                    ${isArabic ? "left" : "right"}: 0;
                    background: var(--card-bg);
                    border: 1px solid var(--muted);
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: none;
                    z-index: 1000;
                    min-width: 180px;
                ">
                    <button onclick="logout(); return false;" 
                            style="display: block; width:100%; text-align: ${isArabic ? "right" : "left"}; padding: 0.75rem 1rem; background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 0.95rem;">
                        ${isArabic ? "تسجيل الخروج" : "Logout"}
                    </button>
                </div>
            </a>
        `;

    const iconLink = document.getElementById("user-icon-link");
    const menu = document.getElementById("user-menu");

    if (iconLink && menu) {
      iconLink.addEventListener("mouseenter", () => {
        menu.style.display = "block";
      });
      iconLink.addEventListener("mouseleave", () => {
        menu.style.display = "none";
      });

      // Keep open when hovering menu
      menu.addEventListener("mouseenter", () => {
        menu.style.display = "block";
      });
      menu.addEventListener("mouseleave", () => {
        menu.style.display = "none";
      });
    }
  } else {
    userIconContainer.innerHTML = `<a href="personal/login.html" class="user-icon">👤</a>`;
  }
}
window.logout = function () {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.reload();
};

window.updateCartCount = updateCartCount;
window.setLanguage = setLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.logout = logout;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadTranslations);
} else {
  loadTranslations();
}
