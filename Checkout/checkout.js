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
    btn.textContent = currentLang === "ar" ? "EN" : "AR";

    // ترجمات النصوص
    document.querySelectorAll("[data-key]").forEach(el => {
        const key = el.getAttribute("data-key");
        el.textContent = translations[currentLang][key];
    });

    // تحديث الـ placeholders
    document.querySelectorAll("[data-placeholder-ar]").forEach(input => {
        input.placeholder = currentLang === "ar"
            ? input.getAttribute("data-placeholder-ar")
            : input.getAttribute("data-placeholder-en");
    });

    // تحديث المحافظات
    initGovernorateDropdown();
    updateShippingAndTotal(document.getElementById("governorate-select").value);
}

document.getElementById("lang-toggle").addEventListener("click", () => {
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

function initGovernorateDropdown() {
    const selectEl = document.getElementById('governorate-select');
    const lang = currentLang;

    selectEl.innerHTML = "";
    for (const key in SHIPPING_FEES) {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = SHIPPING_FEES[key][lang];
        selectEl.appendChild(option);
    }
}

function updateShippingAndTotal(governorateKey) {
    const fee = SHIPPING_FEES[governorateKey] || SHIPPING_FEES["none"];
    currentShippingPrice = fee.price;

    document.getElementById("shipping-price").textContent = `$${fee.price.toFixed(2)}`;
    document.getElementById("final-total").textContent = `$${(cartSubtotal + fee.price).toFixed(2)}`;
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
        cartListContainer.innerHTML = '<p style="text-align:center;">سلة المشتريات فارغة.</p>';
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

    cartSubtotal = subtotal;
    document.getElementById("subtotal-price").textContent = `$${subtotal.toFixed(2)}`;
}

function setupCheckoutSteps() {
    deliveryFormContainer.style.display = "none";

    document.getElementById("proceed-to-delivery").addEventListener("click", () => {
        summaryBox.style.display = "none";
        deliveryFormContainer.style.display = "block";
    });

    document.getElementById("delivery-form").addEventListener("submit", e => {
        e.preventDefault();
        alert("تم تأكيد طلبك!");
        localStorage.removeItem("shoppingCart");
        window.location.href = "../index.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    setupCheckoutSteps();
    applyLanguage();  // ← تشغيل الترجمة عند فتح الصفحة
});
