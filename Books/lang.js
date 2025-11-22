const LANG_STORAGE_KEY = "lang"; 
let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || "ar"; 
window.langData = {}; 

// يجب أن تكون هذه قيمة احتياطية في حالة عدم تحميل lang.json
const fallbackTranslation = {
    all_categories: currentLang === "ar" ? "الكل" : "All",
    page: currentLang === "ar" ? "صفحة" : "Page",
    author: currentLang === "ar" ? "المؤلف" : "Author",
    category: currentLang === "ar" ? "التصنيف" : "Category",
    preview: currentLang === "ar" ? "معاينة" : "Preview",
    details: currentLang === "ar" ? "تفاصيل" : "Details",
    free: currentLang === "ar" ? "مجاني" : "FREE",
    price_label: currentLang === "ar" ? "السعر" : "Price", 
    purchase_required: currentLang === "ar" ? "يجب شراء الكتاب لمعرفة التفاصيل كاملة." : "Purchase is required for full book details.",
    light_mode: "☀️",
    dark_mode: "🌙 ",
    prev: currentLang === "ar" ? "السابق" : "Prev",
    next: currentLang === "ar" ? "التالي" : "Next",
};


function updateToggleText() {
    const themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) return;
    
    const lang = document.documentElement.lang || currentLang;
    const t = window.langData?.[lang] || {}; 

    const isDarkMode = document.documentElement.classList.contains("dark-mode");
    const lightText = t.light_mode || "☀️"; 
    const darkText = t.dark_mode || "🌙 ";

    themeToggle.textContent = isDarkMode ? darkText : lightText; 
}

function initThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) return;
    if (themeToggle.dataset.bound === "true") return;
    themeToggle.dataset.bound = "true";

    themeToggle.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark-mode");
        localStorage.setItem(
            "theme",
            document.documentElement.classList.contains("dark-mode") ? "dark" : "light"
        );
        updateToggleText();
    });

    // محاولة تحميل الوضع المحفوظ
    if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark-mode");
    }
    updateToggleText();
}

document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
});

const observer = new MutationObserver(() => {
    initThemeToggle();
    initNavbarLang();
});
observer.observe(document.body, { childList: true, subtree: true });


function translateStaticElements(t) {
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (t[key]) {
            element.textContent = t[key];
        }
    });

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
}


function loadLanguage() {
    return fetch("lang.json")
        .then(res => res.json())
        .then(data => {
            window.langData = data;
            const t = data[currentLang] || {};

            translateStaticElements(t);

            document.documentElement.lang = currentLang;
            document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

            updateToggleText();

            if (typeof window.updateBooksLang === "function") {
                window.updateBooksLang(currentLang);
            }
            
            initNavbarLang(); 
        })
        .catch(err => console.error("Failed to load lang.json", err));
}

function initNavbarLang() {
    const btn = document.getElementById("language-toggle-btn");
    
    if (!btn) return;
    if (btn.dataset.bound === "true") return; 
    btn.dataset.bound = "true";

    btn.textContent = currentLang === "ar" ? "EN" : "AR";

    btn.addEventListener("click", () => {
        currentLang = currentLang === "ar" ? "en" : "ar";
        localStorage.setItem(LANG_STORAGE_KEY, currentLang);
        
        loadLanguage(); 
    });
}


(function(){
    // تأكد من أن booksData معرّف ومتاح هنا
    if (typeof booksData === 'undefined') return;

    const perPage = 10;
    const params = new URLSearchParams(location.search);
    let page = parseInt(params.get('page')) || 1;

    const container = document.getElementById('cards-container');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    const categoriesContainer = document.getElementById('categories');

    let currentCategory = "all";

    const categories = ["all", ...new Set(booksData.map(b => b.category.en))];

    function openDetails(id) {
        window.location.href = `../Project_Web_Design-raneem-branch/index.html?id=${id}`; 
    }
    
    function openPreview(id) {
        window.location.href = `../Summary/summary.html?id=${id}`; 
    }
    
// *** وظيفة جديدة للتحقق من السعر قبل التفاصيل ***
function handleDetails(book, t) {
    // ⚠️ تصحيح: يجب أن يكون الرابط رابطاً عاماً لصفحة الدفع
    const CHECKOUT_PAGE_URL = `../Checkout/checkout.html`; 
    
    if (book.price === 0) {
        // الكتاب مجاني: فتح التفاصيل مباشرة
        openDetails(book.id); 
    } else {
        // الكتاب مدفوع: عرض رسالة تأكيد "إضافة للسلة"
        
        const confirmationMessage = currentLang === "ar"
            ? `هذا الكتاب بسعر $${book.price.toFixed(2)}. هل ترغب في إضافته إلى سلة الشراء ومتابعة الطلب؟`
            : `This book costs $${book.price.toFixed(2)}. Do you want to add it to your cart and proceed to checkout?`;
        
// ... (داخل الدالة handleDetails)

// ... (داخل الدالة handleDetails)

        if (confirm(confirmationMessage)) {
            
            // 🛑 التصحيح الأول: قراءة السلة الحالية بالكامل
            // إذا لم يجد شيئاً، يبدأ بمصفوفة فارغة
            const cartIds = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
            
            const bookIdStr = book.id.toString(); 

            // (A) إضافة الكتاب إذا لم يكن موجوداً
            if (!cartIds.includes(bookIdStr)) {
                cartIds.push(bookIdStr);
                
                // (B) حفظ المصفوفة المحدثة مرة أخرى في localStorage
                localStorage.setItem('shoppingCart', JSON.stringify(cartIds));
                console.log(`Book ID ${bookIdStr} added to cart!`);
                
                // ⚠️ يجب تحديث عداد السلة هنا
                if (typeof updateCartCount === 'function') {
                    updateCartCount(); 
                }
            } else {
                console.log(`Book ID ${bookIdStr} is already in the cart.`);
            }
            
            // 🛑 التصحيح الثاني: عدم التوجيه مباشرة بعد إضافة كتاب واحد
            // -------------------------------------------------------------
            // بدلاً من التوجيه لصفحة الدفع، يمكن إظهار رسالة نجاح.
            // لإبقاء المستخدم في صفحة الكتب لإضافة المزيد:

            alert(currentLang === "ar" 
                ? "✅ تم إضافة الكتاب إلى سلة مشترياتك!" 
                : "✅ Book added to your shopping cart!");
            
            // -------------------------------------------------------------
            
            // إذا كان لا بد من التوجيه لصفحة الدفع مباشرة (وهذا غير مستحسن):
            // window.location.href = `../Checkout/checkout.html`; 

            // لا تفعل أي شيء آخر هنا لتبقى في صفحة الكتب.
        } 
// ...
// ...
    }
}

// في ملف lang.js (مع باقي الدوال العامة)

function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (!cartCountEl) return;
    
    // قراءة السلة من localStorage
    const cart = localStorage.getItem('shoppingCart');
    const cartIds = cart ? JSON.parse(cart) : [];
    
    const count = cartIds.length;
    cartCountEl.textContent = count;
    
    // إظهار العنصر إذا كان العدد أكبر من صفر، وإخفاؤه إذا كان صفراً
    cartCountEl.style.display = count > 0 ? 'block' : 'none';
}

// ----------------------------------------------------
// يجب تشغيل تحديث العداد عند تحميل الصفحة أيضاً:
document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    updateCartCount(); // 👈 تشغيل عند تحميل الصفحة
});
// ----------------------------------------------------
// *************************************************
    function renderCategories() {
        if (!categoriesContainer) return;
        categoriesContainer.innerHTML = "";
        
        const t = window.langData ? window.langData[currentLang] : fallbackTranslation; 
        
        categories.forEach(cat => {
            const catEl = document.createElement("button");
            catEl.className = "cat-btn";
            
            catEl.textContent = cat === "all" 
                ? (currentLang === "ar" ? t.all_categories || "الكل" : t.all_categories || "All") 
                : (currentLang === "ar"
                    ? booksData.find(b => b.category.en === cat)?.category.ar || cat
                    : cat);

            catEl.addEventListener("click", () => {
                currentCategory = cat;
                renderPage(1);
                highlightActiveCategory(cat);
            });
            categoriesContainer.appendChild(catEl);
        });
        highlightActiveCategory(currentCategory);
    }

    function highlightActiveCategory(cat) {
        document.querySelectorAll(".cat-btn").forEach(btn => {
            const t = window.langData ? window.langData[currentLang] : fallbackTranslation;
            const translatedCat = cat === "all" 
                ? (currentLang === "ar" ? t.all_categories || "الكل" : t.all_categories || "All") 
                : (currentLang === "ar" 
                    ? booksData.find(b => b.category.en === cat)?.category.ar || cat
                    : cat);

            btn.classList.toggle("active", btn.textContent === translatedCat);
        });
    }

    function renderPage(p){
        if (!container) return;
        container.innerHTML = '';
        
        const t = window.langData ? window.langData[currentLang] : fallbackTranslation; 

        let filtered = booksData;
        if (currentCategory !== "all") {
            filtered = booksData.filter(b => b.category.en === currentCategory);
        }

        const start = (p - 1) * perPage;
        const slice = filtered.slice(start, start + perPage);
        const totalPagesFiltered = Math.ceil(filtered.length / perPage);

        slice.forEach((book, idx) => {
            const card = createCard(book, t);
            container.appendChild(card);
            setTimeout(()=> card.classList.add('show'), 60 * idx);
        });

        if (pageInfo) pageInfo.textContent = `${t.page || "Page"} ${p} / ${totalPagesFiltered}`;
        if (prevBtn) prevBtn.disabled = p <= 1;
        if (nextBtn) nextBtn.disabled = p >= totalPagesFiltered;
        
        page = p;
    }
function createCard(book, t){
    const el = document.createElement('article');
    el.className = 'card';

    const title = book.title[currentLang];
    const author = book.author[currentLang];
    const category = book.category[currentLang];
    
    // تحديد نص السعر والعملة
    const priceText = book.price === 0 
        ? `<span class="price-free">${t.free || 'FREE'}</span>`
        : `<span class="price-value">$${book.price.toFixed(2)}</span>`;

    // دمج التصنيف والسعر في فقرة واحدة
    const categoryAndPriceHTML = `
        <p class="category-price">
            <span>${t.category || 'Category'}: ${category}</span>
            <span class="price-label">${t.price_label || 'Price'}: ${priceText}</span>
        </p>
    `;

    el.innerHTML = `
        <img class="cover" src="${book.cover}" alt="${title}" loading="lazy" />
        <div class="body">
            <h3>${title}</h3>
            <p class="author">${t.author || 'Author'}: ${author}</p>
            ${categoryAndPriceHTML}
            <div class="actions">
                <button class="btn preview-btn">${t.preview || 'Preview'}</button>
                <button class="btn details-btn">${t.details || 'Details'}</button>
            </div>
        </div>
    `;

    // ربط الأزرار (الباقي من الدالة يظل كما هو)
    el.querySelector('.preview-btn').addEventListener('click', ()=> openPreview(book.id));
    el.querySelector('.details-btn').addEventListener('click', ()=> handleDetails(book, t));
    
    return el;
}

    if (prevBtn) {
        prevBtn.addEventListener('click', ()=> {
            if(page <= 1) return;
            page--;
            renderPage(page);
            window.scrollTo({top:0, behavior:'smooth'});
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', ()=> {
            page++;
            renderPage(page);
            window.scrollTo({top:0, behavior:'smooth'});
        });
    }

    window.updateBooksLang = (lang) => {
        currentLang = lang;
        renderCategories();
        renderPage(page); 
     };

})();



loadLanguage(); 
initThemeToggle();