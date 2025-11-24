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

function getCart() {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
}

function renderCart() {
    const cartIds = getCart();
    let subtotal = 0;
    
    cartListContainer.innerHTML = ''; 
    
    if (typeof booksData === 'undefined') {
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

    currentCartBooks = booksData.filter(b => cartIds.includes(b.id.toString()));

    currentCartBooks.forEach(book => {
        subtotal += book.price;

        const item = document.createElement("div");
        item.className = "summary-item cart-item";
        item.innerHTML = `
            <span>${book.title[currentLang]}</span>
            <span class="summary-price">$${book.price.toFixed(2)}</span>
        `;
        cartListContainer.appendChild(item);
    });

    // 1. تعيين الإجمالي الفرعي
    cartSubtotal = subtotal;
    document.getElementById("subtotal-price").textContent = `$${subtotal.toFixed(2)}`;
    
    // 2. تطبيق سعر الشحن الافتراضي (وهذا هو المفتاح)
    const initialGov = document.getElementById('governorate-select')?.value || 'none';
    updateShippingAndTotal(initialGov); 
}

function setupCheckoutSteps() {
    deliveryFormContainer.style.display = "none";

    document.getElementById("proceed-to-delivery")?.addEventListener("click", () => {
        summaryBox.style.display = "none";
        deliveryFormContainer.style.display = "block";
    });

    document.getElementById("delivery-form")?.addEventListener("submit", e => {
        e.preventDefault();
        
        // ⚠️ هنا يجب أن يكون التحقق من صحة النموذج (Client-Side Validation)
        
        alert("تم تأكيد طلبك!");
        localStorage.removeItem("shoppingCart");
        window.location.href = "../index.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // يجب أن تبدأ بتطبيق اللغة أولاً لتهيئة currentLang
    applyLanguage(); 
    renderCart();
    setupCheckoutSteps();
});