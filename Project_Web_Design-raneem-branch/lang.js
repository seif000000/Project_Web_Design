let translations = {};
let currentLang = 'ar'; // اللغة الافتراضية

// تحميل الترجمات من JSON
export async function loadTranslations() {
    try {
        const response = await fetch('translation.json');
        translations = await response.json();
        updateLanguage(); // بعد التحميل نطبق اللغة الافتراضية
    } catch (err) {
        console.error("خطأ في تحميل الترجمات:", err);
    }
}

// تبديل اللغة
export function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    const html = document.documentElement;

    if (currentLang === 'ar') {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        document.querySelector('.lang-btn').textContent = 'EN';
    } else {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        document.querySelector('.lang-btn').textContent = 'AR';
    }

    updateLanguage();
}

// تحديث النصوص
export function updateLanguage() {
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
}
