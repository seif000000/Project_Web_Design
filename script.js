// ---- Translation ----
let translations = {};
let currentLang = 'ar'; // اللغة الافتراضية عربي

async function loadTranslations() {
    try {
        const response = await fetch('./translations.json');
        translations = await response.json();
        
        // استرجاع اللغة المحفوظة
        const savedLang = localStorage.getItem('language');
        if (savedLang) {
            currentLang = savedLang;
        }
        
        applyTranslations();
    } catch (err) {
        console.error('Error loading translations:', err);
    }
}

function applyTranslations() {
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang);

    const elementsToTranslate = document.querySelectorAll('[data-lang], [data-key]');
    
    elementsToTranslate.forEach(el => {
        const key = el.getAttribute('data-key') || el.getAttribute('data-lang'); 
        
        if (key && translations[currentLang] && translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    
    const langBtn = document.querySelector('.lang-btn');
    if (langBtn) {
        langBtn.textContent = currentLang === 'ar' ? 'EN' : 'AR';
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    
    // حفظ اللغة في localStorage للاستمرارية
    localStorage.setItem('language', currentLang);
    
    applyTranslations();
}

// تحميل الترجمات أول ما الصفحة تفتح
loadTranslations();

// ربط زر اللغة
document.querySelector('.lang-btn').addEventListener('click', toggleLanguage);


// ---- Carousel ----
let currentSlide = 0;
const bookCards = document.querySelectorAll('.book-card');
const next = document.querySelector('.arrow-right');
const prev = document.querySelector('.arrow-left');

function updateCarousel() {
    bookCards.forEach((card, index) => {
        card.style.opacity = index === currentSlide ? '1' : '0.5';
        card.style.transform = index === currentSlide ? 'scale(1.05)' : 'scale(1)';
    });
}

// أزرار التنقل
next.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % bookCards.length;
    updateCarousel();
});

prev.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + bookCards.length) % bookCards.length;
    updateCarousel();
});

// تحديث الكاروسيل أول مرة
updateCarousel();
// ============================================
// DARK MODE FUNCTIONALITY
// ============================================

// Get theme toggle button and icons
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const htmlElement = document.documentElement;
const bodyElement = document.body;

// Check for saved theme preference or default to 'light' mode
const currentTheme = localStorage.getItem('theme') || 'light';

// Apply the saved theme on page load
if (currentTheme === 'dark') {
    enableDarkMode();
}

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    // Toggle between light and dark mode
    if (htmlElement.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

// Function to enable dark mode
function enableDarkMode() {
    htmlElement.classList.add('dark-mode');
    bodyElement.classList.add('dark-mode');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'inline';
    localStorage.setItem('theme', 'dark');
}

// Function to disable dark mode
function disableDarkMode() {
    htmlElement.classList.remove('dark-mode');
    bodyElement.classList.remove('dark-mode');
    sunIcon.style.display = 'inline';
    moonIcon.style.display = 'none';
    localStorage.setItem('theme', 'light');
}

// ============================================
// HOMEPAGE REDIRECT FUNCTION
// ============================================
function homepage() {
    window.location.href = '../index.html';
}

// ============================================
// CART COUNTER (إذا كنت تستخدمه)
// ============================================
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});