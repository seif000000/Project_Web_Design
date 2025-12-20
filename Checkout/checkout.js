const translations = {
    ar: {
        titleCheckout: "🛒 إكمال طلبك وتفاصيل التوصيل",
        summaryTitle: "ملخص مشترياتك",
        subtotal: "الإجمالي الفرعي:",
        deliveryArea: "منطقة التوصيل:",
        shippingCost: "تكلفة التوصيل:",
        finalTotal: "الإجمالي النهائي:",
        continueBtn: "متابعة لإدخال بيانات التوصيل",
        deliveryDetails: "إدخال تفاصيل التوصيل",
        confirmBtn: "تأكيد الطلب والدفع",
        // يجب إضافة ترجمات حقول النموذج إذا استخدمتها في HTML
    },

    en: {
        titleCheckout: "🛒 Complete Your Order & Delivery Details",
        summaryTitle: "Your Order Summary",
        subtotal: "Subtotal:",
        deliveryArea: "Delivery Area:",
        shippingCost: "Shipping Cost:",
        finalTotal: "Final Total:",
        continueBtn: "Continue to Delivery Details",
        deliveryDetails: "Enter Delivery Details",
        confirmBtn: "Confirm Order & Payment",
        // يجب إضافة ترجمات حقول النموذج إذا استخدمتها في HTML
    }
};

const SHIPPING_FEES = {
    "none": { ar: "اختر المحافظة", en: "Select Governorate", price: 0 },
    "cairo": { ar: "القاهرة", en: "Cairo", price: 100.00 },
    "giza": { ar: "الجيزة", en: "Giza", price: 80.00 },
    "alexandria": { ar: "الإسكندرية", en: "Alexandria", price: 90.00 },
    "suez": { ar: "السويس", en: "Suez", price: 95.00 },
    "luxor": { ar: "الأقصر", en: "Luxor", price: 110.00 },
    "Hurgada": { ar: "الغردقه", en: "Hurgada", price: 120.00 },
    "Beheira": { ar: "البحيره", en: "Beheira", price: 130.00 },
    "Sharqia": { ar: "الشرقيه", en: "Sharqia", price: 110.00 }
};

/* =====================================
   اللغة — حفظ واستدعاء
===================================== */

let currentLang = localStorage.getItem("checkoutLang") || "ar";

function applyLanguage() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

    // زر اللغة
    const btn = document.getElementById("lang-toggle");
    if(btn) btn.textContent = currentLang === "ar" ? "EN" : "AR";

    // ترجمات النصوص
    document.querySelectorAll("[data-key]").forEach(el => {
        const key = el.getAttribute("data-key");
        if (translations[currentLang] && translations[currentLang][key]) {
             el.textContent = translations[currentLang][key];
         }
    });

    // تحديث الـ placeholders
    document.querySelectorAll("[data-placeholder-ar]").forEach(input => {
        input.placeholder = currentLang === "ar"
            ? input.getAttribute("data-placeholder-ar")
            : input.getAttribute("data-placeholder-en");
    });

    // يجب إعادة تهيئة القائمة باللغة الجديدة
    initGovernorateDropdown(); 
    
    // تحديث الإجمالي بعد تغيير اللغة، باستخدام القيمة المختارة حاليًا
    const selectedGov = document.getElementById("governorate-select")?.value || 'none';
    updateShippingAndTotal(selectedGov);
}

document.getElementById("lang-toggle")?.addEventListener("click", () => {
    currentLang = currentLang === "ar" ? "en" : "ar";
    localStorage.setItem("checkoutLang", currentLang);
    applyLanguage();
});

/* =====================================
    وظائف صفحة الشراء الأساسية
===================================== */

const deliveryFormContainer = document.getElementById('delivery-form-container');
const summaryBox = document.getElementById('order-summary');
const cartListContainer = document.getElementById('cart-items-list');

let currentCartBooks = [];
let cartSubtotal = 0;
let currentShippingPrice = 0;

// ✅ مُعدَّلة: إضافة Event Listener لـ 'change' لضمان التحديث
function initGovernorateDropdown() {
    const selectEl = document.getElementById('governorate-select');
    if (!selectEl) return;
    const lang = currentLang;

    selectEl.innerHTML = "";
    for (const key in SHIPPING_FEES) {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = SHIPPING_FEES[key][lang];
        selectEl.appendChild(option);
    }

    // 🛑 الإضافة الضرورية: ربط حدث التغيير ليعمل تحديث السعر
    selectEl.addEventListener('change', (event) => {
        const selectedKey = event.target.value;
        updateShippingAndTotal(selectedKey);
    });
}

function updateShippingAndTotal(governorateKey) {
    
    const feeInfo = SHIPPING_FEES[governorateKey] || SHIPPING_FEES['none'];
    currentShippingPrice = feeInfo.price;
    
    const finalTotal = cartSubtotal + currentShippingPrice;
    
    const shippingPriceEl = document.getElementById('shipping-price');
    const finalTotalEl = document.getElementById('final-total');

    if (shippingPriceEl) {
        shippingPriceEl.textContent = `$${currentShippingPrice.toFixed(2)}`;
    }
    if (finalTotalEl) {
        finalTotalEl.textContent = `$${finalTotal.toFixed(2)}`;
    }
}

// API base URL - detect automatically
function getApiBaseUrl() {
    if (window.location.port === '5502' || window.location.hostname === '127.0.0.1') {
        return 'http://127.0.0.1:5000/api';
    }
    return 'http://localhost:5000/api';
}
const API_BASE_URL = getApiBaseUrl();

// Load books from database
let booksDataFromDB = [];

async function loadBooksFromDatabase() {
    try {
        const response = await fetch(`${API_BASE_URL}/books`);
        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        
        const books = await response.json();
        
        // Convert database format to frontend format
        booksDataFromDB = books.map(book => ({
            id: book.id,
            category: {
                en: book.category_name || 'Uncategorized',
                ar: book.category_name || 'غير مصنف'
            },
            title: {
                en: book.title,
                ar: book.title
            },
            author: {
                en: book.author,
                ar: book.author
            },
            cover: book.image_url ? `http://127.0.0.1:5000/${book.image_url}` : '../image/book_image.jpg',
            price: book.price || 0,
            description: book.description || ''
        }));
        
        return booksDataFromDB;
    } catch (error) {
        console.error('Error loading books from database:', error);
        return [];
    }
}

function getCart() {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
}

async function renderCart() {
    const cartIds = getCart();
    let subtotal = 0;
    
    cartListContainer.innerHTML = '<p>جاري تحميل الكتب...</p>'; 
    
    // Load books from database
    if (booksDataFromDB.length === 0) {
        booksDataFromDB = await loadBooksFromDatabase();
    }
    
    // Fallback to static booksData if available
    const allBooks = booksDataFromDB.length > 0 ? booksDataFromDB : (typeof booksData !== 'undefined' ? booksData : []);
    
    if (allBooks.length === 0) {
        cartListContainer.innerHTML = '<p style="color:red;">خطأ: لم يتم تحميل بيانات الكتب.</p>';
        return;
    }
    
    if (cartIds.length === 0) {
        cartListContainer.innerHTML = '<p style="text-align: center; color: var(--muted);">سلة المشتريات فارغة. عد إلى صفحة الكتب لإضافة عناصر.</p>';
        document.getElementById('proceed-to-delivery').disabled = true;
        document.getElementById('subtotal-price').textContent = '$0.00';
        document.getElementById('shipping-price').textContent = '$0.00';
        document.getElementById('final-total').textContent = '$0.00';
        return;
    }

    currentCartBooks = allBooks.filter(b => cartIds.includes(b.id.toString()));

    currentCartBooks.forEach(book => {
        const bookPrice = typeof book.price === 'object' ? (book.price[currentLang] || book.price.en || book.price.ar || 0) : (book.price || 0);
        subtotal += bookPrice;

        const item = document.createElement("div");
        item.className = "summary-item cart-item";
        const bookTitle = typeof book.title === 'object' ? (book.title[currentLang] || book.title.ar || book.title.en) : book.title;
        item.innerHTML = `
            <span>${bookTitle}</span>
            <span class="summary-price">$${bookPrice.toFixed(2)}</span>
        `;
        cartListContainer.appendChild(item);
    });

    // 1. تعيين الإجمالي الفرعي
    cartSubtotal = subtotal;
    document.getElementById("subtotal-price").textContent = `$${subtotal.toFixed(2)}`;
    
    // 2. تطبيق سعر الشحن الافتراضي
    const initialGov = document.getElementById('governorate-select')?.value || 'none';
    updateShippingAndTotal(initialGov); 
}

function setupCheckoutSteps() {
    deliveryFormContainer.style.display = "none";

    document.getElementById("proceed-to-delivery")?.addEventListener("click", () => {
        summaryBox.style.display = "none";
        deliveryFormContainer.style.display = "block";
    });

    document.getElementById("delivery-form")?.addEventListener("submit", async e => {
        e.preventDefault();
        
        // Check if user is logged in
        const authenticated = sessionStorage.getItem('authenticated');
        if (authenticated !== 'true') {
            alert('يجب تسجيل الدخول أولاً لإتمام الطلب');
            window.location.href = '../personal/login.html';
            return;
        }
        
        const form = e.target;
        const formData = new FormData(form);
        const fullName = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const phone = form.querySelector('input[type="tel"]').value;
        const address = form.querySelector('textarea').value;
        const governorate = document.getElementById('governorate-select').value;
        
        // Prepare order items
        const orderItems = currentCartBooks.map(book => {
            const bookPrice = typeof book.price === 'object' ? (book.price[currentLang] || book.price.en || book.price.ar || 0) : (book.price || 0);
            return {
                book_id: book.id,
                quantity: 1,
                price: bookPrice
            };
        });
        
        const shippingAddress = `${address}, ${SHIPPING_FEES[governorate][currentLang]}, ${fullName}, ${phone}, ${email}`;
        const finalTotal = cartSubtotal + currentShippingPrice;
        
        try {
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'جاري إنشاء الطلب...';
            
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    items: orderItems,
                    shipping_address: shippingAddress,
                    total_price: finalTotal
                })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                alert("✅ تم تأكيد طلبك بنجاح! رقم الطلب: " + result.order.id);
                localStorage.removeItem("shoppingCart");
                window.location.href = "../index.html";
            } else {
                alert('حدث خطأ أثناء إنشاء الطلب: ' + (result.message || 'خطأ غير معروف'));
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('حدث خطأ في الاتصال بالخادم. تأكد من تشغيل الخادم');
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'تأكيد الطلب والدفع';
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    // يجب أن تبدأ بتطبيق اللغة أولاً لتهيئة currentLang
    applyLanguage(); 
    await renderCart();
    setupCheckoutSteps();
});