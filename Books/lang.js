const LANG_STORAGE_KEY = "lang"; 
let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || "ar"; 
window.langData = {}; 

const fallbackTranslation = {
    all_categories: currentLang === "ar" ? "الكل" : "All",
    page: currentLang === "ar" ? "صفحة" : "Page",
    author: currentLang === "ar" ? "المؤلف" : "Author",
    category: currentLang === "ar" ? "التصنيف" : "Category",
    preview: currentLang === "ar" ? "معاينة" : "Preview",
    details: currentLang === "ar" ? "تفاصيل" : "Details",
    free: currentLang === "ar" ? "مجاني" : "FREE",
    price_label: currentLang === "ar" ? "السعر" : "Price", 
    purchase_required: currentLang === "ar"
        ? "يجب شراء الكتاب لمعرفة التفاصيل كاملة."
        : "Purchase is required for full book details.",
    light_mode: "☀️",
    dark_mode: "🌙 ",
    prev: currentLang === "ar" ? "السابق" : "Prev",
    next: currentLang === "ar" ? "التالي" : "Next",
    search: currentLang === "ar" ? "بحث" : "Search",
    placeholder_search: currentLang === "ar" ? "بحث" : "Search"
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

/*  search button & placeholder updater */
function updateSearchPlaceholder() {
    const input = document.getElementById("get-books");
    if (!input) return;
    input.placeholder = currentLang === "ar" ? "بحث" : "Search";
}
function updateSearchButton() {
    const btn = document.getElementById("search-button");
    if (!btn) return;
    btn.textContent = currentLang === "ar" ? "بحث" : "Search";
}

function loadLanguage() {
    return fetch("lang.json")
        .then(res => res.json())
        .then(data => {
            window.langData = data;
            const t = data[currentLang] || {};

            translateStaticElements(t);

            updateSearchPlaceholder();   
            updateSearchButton();        

            document.documentElement.lang = currentLang;
            document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

            updateToggleText();

            if (typeof window.updateBooksLang === "function") {
                window.updateBooksLang(currentLang);
            }
            
            initNavbarLang();
        })
        .catch(err => {
            console.error("Failed to load lang.json", err);
            updateSearchPlaceholder();
            updateSearchButton();
        });
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


function parseAdvancedSearch(query) {
    const filters = {};
    const parts = query.split(",").map(p => p.trim()).filter(Boolean);
    parts.forEach(part => {
        const [k, ...rest] = part.split(":");
        if (!k || rest.length === 0) return;
        const v = rest.join(":").trim();
        if (!v) return;
        filters[k.trim().toLowerCase()] = v.toLowerCase();
    });
    return filters;
}

function localizedField(book, field) {
    try {
        const val = book[field];
        if (!val) return "";
        if (typeof val === "object") {
            return String(val[currentLang] || val.en || "").toLowerCase();
        }
        return String(val).toLowerCase();
    } catch (e) {
        return "";
    }
}

function searchBooks(query) {
    query = (query || "").trim();
    if (!query) return null;

    const lower = query.toLowerCase();

    if (lower.includes(":")) {
        const filters = parseAdvancedSearch(lower);
        return booksData.filter(book => {
            for (const k in filters) {
                const want = filters[k];
                if (k === "title" || k === "name") {
                    if (!localizedField(book, "title").includes(want)) return false;
                } else if (k === "author" || k === "writer") {
                    if (!localizedField(book, "author").includes(want)) return false;
                } else if (k === "category") {
                    if (!localizedField(book, "category").includes(want)) return false;
                } else if (k === "year") {
                    const yr = (book.year ? String(book.year).toLowerCase() : "");
                    if (!yr.includes(want)) return false;
                } else if (k === "language") {
                    const langField = (book.language ? String(book.language).toLowerCase() : "");
                    if (!langField.includes(want)) return false;
                } else {
                    const combined = (localizedField(book,"title") + " " + localizedField(book,"author") + " " + localizedField(book,"category"));
                    if (!combined.includes(want)) return false;
                }
            }
            return true;
        });
    }

    return booksData.filter(book =>
        localizedField(book, "title").includes(lower) ||
        localizedField(book, "author").includes(lower) ||
        localizedField(book, "category").includes(lower)
    );
}

// ====================================================
// IIFE — كما هو مع الإصلاحات
// ====================================================

let filteredSearchResults = null;

(async function(){
    // Wait for API service to load
    if (typeof window.booksAPI === 'undefined') {
        console.error('Books API service not loaded. Make sure js/apiService.js is included before this script.');
        return;
    }

    // Load books from API
    const booksData = await window.booksAPI.loadBooks();
    
    if (!booksData || booksData.length === 0) {
        console.warn('No books loaded from API');
        return;
    }

    const perPage = 10;
    const params = new URLSearchParams(location.search);
    let page = parseInt(params.get('page')) || 1;

    const container = document.getElementById('cards-container');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    const categoriesContainer = document.getElementById('categories');

    let currentCategory = "all";

    // Extract categories from books
    const categorySet = new Set();
    booksData.forEach(b => {
        const cat = typeof b.category === 'object' ? b.category.en : (b.category || b.genre || '');
        if (cat) categorySet.add(cat);
    });
    const categories = ["all", ...Array.from(categorySet)];

    function openDetails(id) {
        window.location.href = `../Project_Web_Design-raneem-branch/index.html?id=${id}`; 
    }
    
    function openPreview(id) {
        window.location.href = `../Summary/summary.html?id=${id}`; 
    }

    function handleDetails(book, t) {
        const CHECKOUT_PAGE_URL = `../Checkout/checkout.html`; 
        
        if (book.price === 0) {
            openDetails(book.id); 
        } else {
            const confirmationMessage = currentLang === "ar"
                ? `هذا الكتاب بسعر $${book.price.toFixed(2)}. هل ترغب في إضافته إلى سلة الشراء؟`
                : `This book costs $${book.price.toFixed(2)}. Add to cart?`;

            if (confirm(confirmationMessage)) {

                const cartIds = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
                
                const bookIdStr = (book.id || book._id)?.toString(); 

                if (!cartIds.includes(bookIdStr)) {
                    cartIds.push(bookIdStr);
                    localStorage.setItem('shoppingCart', JSON.stringify(cartIds));

                    if (typeof updateCartCount === 'function') {
                        updateCartCount(); 
                    }
                }
                
                alert(currentLang === "ar" 
                    ? "✅ تم إضافة الكتاب إلى سلة مشترياتك!" 
                    : "✅ Book added to cart!");
            }
        }
    }

    function updateCartCount() {
        const cartCountEl = document.getElementById('cart-count');
        if (!cartCountEl) return;

        const cart = localStorage.getItem('shoppingCart');
        const cartIds = cart ? JSON.parse(cart) : [];
        
        const count = cartIds.length;
        cartCountEl.textContent = count;

        cartCountEl.style.display = count > 0 ? 'block' : 'none';
    }

    document.addEventListener("DOMContentLoaded", () => {
        initThemeToggle();
        updateCartCount();
    });

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
                filteredSearchResults = null;
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

        let filtered = filteredSearchResults || booksData;

        if (!filteredSearchResults && currentCategory !== "all") {
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
        
        const priceText = book.price === 0 
            ? `<span class="price-free">${t.free || 'FREE'}</span>`
            : `<span class="price-value">$${book.price.toFixed(2)}</span>`;

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

    // ---------------------------
    // SEARCH — كما هو
    // ---------------------------

    const searchBlock = document.getElementById("search-block");
    const searchInput = document.getElementById("get-books");
    const searchBtn = document.getElementById("search-button");

    let suggestionsBox = document.getElementById("suggestions-list");
    if (!suggestionsBox) {
        suggestionsBox = document.createElement("div");
        suggestionsBox.id = "suggestions-list";
        suggestionsBox.style.position = "absolute";
        suggestionsBox.style.background = "#fff";
        suggestionsBox.style.border = "1px solid #ccc";
        suggestionsBox.style.borderRadius = "6px";
        suggestionsBox.style.marginTop = "6px";
        suggestionsBox.style.padding = "6px 0";
        suggestionsBox.style.maxHeight = "220px";
        suggestionsBox.style.overflowY = "auto";
        suggestionsBox.style.width = searchBlock ? `${searchBlock.offsetWidth}px` : "300px";
        suggestionsBox.style.display = "none";
        suggestionsBox.style.zIndex = 999;
        if (searchBlock) {
            searchBlock.style.position = searchBlock.style.position || "relative";
            searchBlock.appendChild(suggestionsBox);
        } else {
            document.body.appendChild(suggestionsBox);
        }
    }

    function debounce(fn, ms = 250) {
        let id;
        return (...args) => {
            clearTimeout(id);
            id = setTimeout(()=> fn(...args), ms);
        };
    }

    function showSuggestions(query) {
        if (!suggestionsBox) return;
        suggestionsBox.innerHTML = "";
        if (!query || query.trim().length < 1) {
            suggestionsBox.style.display = "none";
            return;
        }
        const q = query.toLowerCase();
        const suggestions = [];

        booksData.forEach(book => {
            const title = localizedField(book, "title");
            const author = localizedField(book, "author");
            const cat = localizedField(book, "category");

            if (title.includes(q)) suggestions.push({ type: "title", text: book.title[currentLang] });
            if (author.includes(q)) suggestions.push({ type: "author", text: book.author[currentLang] });
            if (cat.includes(q)) suggestions.push({ type: "category", text: book.category[currentLang] });
        });

        const unique = [];
        const seen = new Set();
        for (const s of suggestions) {
            const key = s.type + "|" + s.text;
            if (!seen.has(key)) {
                unique.push(s);
                seen.add(key);
            }
            if (unique.length >= 8) break;
        }

        if (unique.length === 0) {
            suggestionsBox.style.display = "none";
            return;
        }

        unique.forEach(item => {
            const div = document.createElement("div");
            div.className = "suggest-item";
            div.style.padding = "8px 12px";
            div.style.cursor = "pointer";
            div.textContent = item.text;
            div.addEventListener("click", () => {
                if (!searchInput) return;
                searchInput.value = item.text;
                suggestionsBox.style.display = "none";
                filteredSearchResults = searchBooks(item.text);
                currentCategory = "all";
                renderPage(1);
            });
            suggestionsBox.appendChild(div);
        });

        suggestionsBox.style.display = "block";
    }

    const liveHandler = debounce(() => {
        if (!searchInput) return;
        const q = searchInput.value.trim();
        if (!q) {
            filteredSearchResults = null;
            renderPage(1);
            suggestionsBox.style.display = "none";
            return;
        }
        filteredSearchResults = searchBooks(q);
        currentCategory = "all";
        renderPage(1);
        showSuggestions(q);
    }, 200);

    if (searchInput) {
        searchInput.addEventListener("input", liveHandler);
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const q = searchInput.value.trim();
                filteredSearchResults = searchBooks(q);
                currentCategory = "all";
                renderPage(1);
                suggestionsBox.style.display = "none";
            } else if (e.key === "Escape") {
                suggestionsBox.style.display = "none";
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (!searchInput) return;
            const q = searchInput.value.trim();
            filteredSearchResults = searchBooks(q);
            currentCategory = "all";
            renderPage(1);
            suggestionsBox.style.display = "none";
        });
    }

    document.addEventListener("click", (e) => {
        if (!suggestionsBox) return;
        if (searchBlock && (searchBlock.contains(e.target))) return;
        suggestionsBox.style.display = "none";
    });

    window.addEventListener("resize", () => {
        if (searchBlock && suggestionsBox) {
            suggestionsBox.style.width = `${searchBlock.offsetWidth}px`;
        }
    });

    window.updateBooksLang = (lang) => {
        currentLang = lang;
        updateSearchPlaceholder();
        updateSearchButton();
        renderCategories();
        renderPage(page);
    };

    window.renderCategories = renderCategories;
    window.renderPage = renderPage;

})(); // end IIFE

async function initBooksPage() {
    // Wait for API service and language data
    if (typeof window.booksAPI === "undefined" || !window.langData || !window.langData[currentLang]) {
        setTimeout(initBooksPage, 100);
        return;
    }

    const t = window.langData[currentLang] || fallbackTranslation;

    // Ensure books are loaded
    await window.booksAPI.loadBooks();

    if (typeof renderCategories === "function") renderCategories();
    if (typeof renderPage === "function") renderPage(1);
}

loadLanguage().then(() => {
    initThemeToggle();
    initBooksPage();
});
