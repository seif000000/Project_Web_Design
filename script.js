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
    // تغيير اتجاه الصفحة
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang);
    
    // تحديث النصوص
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    
    // تحديث نص زر اللغة
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