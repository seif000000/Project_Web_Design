// ====== 1. الإعدادات والبيانات الموحدة =============================
const THEME_KEY = 'bookWormTheme'; // مفتاح الثيم
const LANG_KEY = 'bookWormLang'; // مفتاح اللغة
let currentLang = localStorage.getItem(LANG_KEY) || 'ar'; // اللغة الافتراضية (العربية)

// ⚠️ قاموس الترجمة لجميع النصوص الثابتة في الصفحة (الناف بار، الفوتر، وعناصر البطاقات)
const translations = {
    en: {
        siteName: "Book Worms",
        navContact: "Contact Us",
        navAbout: "About Us",
        navEditors: "Editors' Picks",
        navBestsellers: "Bestsellers",
        navNewArrivals: "New Arrivals",
        navAllBooks: "All Books",
        // مفاتيح خاصة بصفحة وصل حديثاً
        books: "New Arrivals", // لعنوان الصفحة
        author: "Author", // لبطاقة الكتاب
        category: "Category", // لبطاقة الكتاب
        preview: "Preview", // لزر المعاينة
        details: "Details", // لزر التفاصيل
        no_results: "No new books have arrived recently.", // رسالة عدم وجود نتائج
        // مفاتيح الفوتر (للاكمال)
        footerQuickLinksTitle: "Quick Links",
        navOffers: "Offers",
        footerDiscoverTitle: "Discover",
        navDiscounts: "Discounts",
        navBest2022: "Best of 2022",
        navFeatured: "Featured",
        footerHelpTitle: "Help",
        helpTrackOrder: "Track Order",
        helpShippingReturns: "Shipping & Returns",
        helpFAQ: "FAQ",
        helpCommunity: "Community",
        footerCopyright: "Copyright © 2025 Book Worms | Developed by Book Worms",
    },
    ar: {
        siteName: "Book Worms",
        navContact: "اتصل بنا",
        navAbout: "من نحن",
        navEditors: "اختيار المحررين",
        navBestsellers: "الأكثر مبيعاً",
        navNewArrivals: "وصل حديثاً",
        navAllBooks: "جميع الكتب",
        // مفاتيح خاصة بصفحة وصل حديثاً
        books: "وصل حديثاً", // لعنوان الصفحة
        author: "المؤلف", // لبطاقة الكتاب
        category: "التصنيف", // لبطاقة الكتاب
        preview: "معاينة", // لزر المعاينة
        details: "التفاصيل", // لزر التفاصيل
        no_results: "لم تصل أي كتب جديدة مؤخراً.", // رسالة عدم وجود نتائج
        // مفاتيح الفوتر (للاكمال)
        footerQuickLinksTitle: "روابط سريعة",
        navOffers: "العروض",
        footerDiscoverTitle: "استكشف",
        navDiscounts: "التخفيضات",
        navBest2022: "الأفضل 2022",
        navFeatured: "المميزة",
        footerHelpTitle: "المساعدة",
        helpTrackOrder: "تتبع الطلب",
        helpShippingReturns: "التوصيل والإرجاع",
        helpFAQ: "الأسئلة الشائعة",
        helpCommunity: "المجتمع",
        footerCopyright: "Book Warms حقوق النشر © 2025 Book Warms | تم التطوير بواسطة ",
    }
};

// 🎯 دالة لترجمة النصوص: تبحث عن المفتاح في قاموس اللغة الحالي
function translateText(key, lang = currentLang) {
    if (translations[lang] && translations[lang][key] !== undefined) {
        return translations[lang][key];
    }
    return key;
}

// 🎯 دالة لتطبيق اللغة على جميع العناصر الثابتة
function applyTranslations(lang) {
    const htmlElement = document.documentElement;
    const bodyElement = document.body; // 🛑 جديد: عنصر الجسم

    // 1. ترجمة النصوص الثابتة (باستخدام data-key و data-translate-key)
    // ... (هذا الجزء يبقى كما هو) ...
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        element.textContent = translateText(key, lang); 
    });

    document.querySelectorAll('[data-translate-key]').forEach(element => {
        const key = element.getAttribute('data-translate-key');
        element.textContent = translateText(key, lang); 
    });
    
    htmlElement.setAttribute('lang', lang);
    document.title = translateText('books', lang); 

    if (lang === 'ar') {
        bodyElement.classList.add('rtl'); 
    } else {
        bodyElement.classList.remove('rtl'); 
    }
    
   
    const langToggleBtn = document.getElementById('language-toggle-btn');
    if (langToggleBtn) {
        if (lang === 'ar') {
            langToggleBtn.textContent = 'EN';
            langToggleBtn.setAttribute('data-lang', 'en'); 
        } else {
            langToggleBtn.textContent = 'AR';
            langToggleBtn.setAttribute('data-lang', 'ar'); 
        }
    }
}


function applyTheme(isDark) {
    const root = document.documentElement;
    const sunIcon = document.getElementById('sun-icon'); 
    const moonIcon = document.getElementById('moon-icon'); 

    if (isDark) {
        root.classList.add('dark-mode');
        localStorage.setItem(THEME_KEY, 'dark');
        if (sunIcon && moonIcon) {
            sunIcon.style.display = 'block'; 
            moonIcon.style.display = 'none'; 
        }
    } else {
        root.classList.remove('dark-mode');
        localStorage.setItem(THEME_KEY, 'light');
        if (sunIcon && moonIcon) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block'; 
        }
    }
}

function setupThemeToggle() {
    const toggleButton = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialDark = storedTheme === 'dark' || (storedTheme === null && prefersDark);
    applyTheme(initialDark);

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const isCurrentlyDark = document.documentElement.classList.contains('dark-mode');
            applyTheme(!isCurrentlyDark); 
        });
    }
}

function setupLanguageToggle() {
    const langToggleBtn = document.getElementById('language-toggle-btn');
    
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', (event) => {
            const nextLang = event.currentTarget.getAttribute('data-lang');
            currentLang = nextLang;
            localStorage.setItem(LANG_KEY, currentLang);
            window.location.reload(); 
        });
    }
    
    applyTranslations(currentLang);
}

function homepage() {
    window.location.href = '../index.html';
}


document.addEventListener('DOMContentLoaded', async () => {
    
    // إعداد الثيم واللغة عند تحميل الصفحة
    setupThemeToggle();
    setupLanguageToggle(); 

    // Check if API service is available
    if (typeof window.booksAPI === 'undefined') {
        console.error("Books API service not loaded. Make sure js/apiService.js is included before this script.");
        const noBooksMessage = document.getElementById('no-books-message');
        if (noBooksMessage) {
            noBooksMessage.textContent = currentLang === 'ar' 
                ? 'خطأ: لم يتم تحميل خدمة API للكتب'
                : 'Error: Books API service not loaded';
            noBooksMessage.style.display = 'block';
        }
        return;
    }

    const template = document.getElementById('book-card-template');
    const booksContainer = document.getElementById('books-container');
    const noBooksMessage = document.getElementById('no-books-message');
    
    // Load new arrival books from API
    const newBooks = await window.booksAPI.getNewArrivalBooks(); 
    
    function openBookDetails(id) {
        window.location.href = `../Project_Web_Design-raneem-branch/index.html?id=${id}`; 
    }

    function openBookPreview(id) {
        window.location.href = `../Summary/summary.html?id=${id}`; 
    }

    if (newBooks.length === 0) {
        noBooksMessage.textContent = translateText('no_results', currentLang); 
        noBooksMessage.style.display = 'block';
    } else {
        newBooks.forEach(book => {
            // 🛑 1. استنساخ القالب
            const bookCard = document.importNode(template.content, true);
            
            // 🛑 2. تطبيق الترجمة على العناصر الثابتة داخل البطاقة (مثل: المؤلف، التصنيف، معاينة، تفاصيل)
            bookCard.querySelectorAll('[data-translate-key]').forEach(element => {
                const key = element.getAttribute('data-translate-key');
                element.textContent = translateText(key, currentLang); 
            });
            
            // جلب العناصر لملء البيانات
            const coverElement = bookCard.querySelector('[data-id="cover"]');
            const titleElement = bookCard.querySelector('[data-id="title"]');
            const authorElement = bookCard.querySelector('[data-id="author"]');
            const categoryElement = bookCard.querySelector('[data-id="category"]');
            const previewBtn = bookCard.querySelector('[data-id="preview-btn"]');
            const detailsBtn = bookCard.querySelector('[data-id="details-btn"]');
            
            coverElement.src = book.cover || '';
            coverElement.alt = book.title[currentLang] || book.title.ar;
            
            titleElement.textContent = book.title[currentLang] || book.title.ar;
            authorElement.textContent = book.author[currentLang] || book.author.ar;
            categoryElement.textContent = book.category[currentLang] || book.category.ar;
            
            // ربط وظائف الأزرار
            previewBtn.addEventListener('click', () => openBookPreview(book.id));
            detailsBtn.addEventListener('click', () => openBookDetails(book.id));
            
            booksContainer.appendChild(bookCard);
        });
        noBooksMessage.style.display = 'none';
    }
});