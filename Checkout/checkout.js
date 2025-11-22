const SHIPPING_FEES = {
    "none": { ar: "اختر المحافظة", en: "Select Governorate", price: 0 },
    "cairo": { ar: "القاهرة", en: "Cairo", price: 100.00 },
    "giza": { ar: "الجيزة", en: "Giza", price: 80.00 },
    "alexandria": { ar: "الإسكندرية", en: "Alexandria", price: 90.00 },
    "suez": { ar: "السويس", en: "Suez", price: 95.00 },
    "luxor": { ar: "الأقصر", en: "Luxor", price: 110.00 },
    "Hurgada":{ar: "الغردقه", en: "Hurgada", price: 120.00 },
    "Beheira":{ar: "البحيره", en: "Beheira", price: 130.00 },
    "Sharqia":{ar: "الشرقيه", en: "Sharqia", price: 110.00 }

};

const deliveryFormContainer = document.getElementById('delivery-form-container');
const summaryBox = document.getElementById('order-summary');
const cartListContainer = document.getElementById('cart-items-list');

let currentCartBooks = [];     
let cartSubtotal = 0;           
let currentShippingPrice = 0;   

function initGovernorateDropdown() {
    const selectEl = document.getElementById('governorate-select');
    if (!selectEl) return;

    const lang = document.documentElement.lang || 'ar';

    selectEl.innerHTML = '';
    for (const key in SHIPPING_FEES) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = SHIPPING_FEES[key][lang];
        selectEl.appendChild(option);
    }
    
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
        cartListContainer.innerHTML = '<p style="color: red; font-weight: bold;">خطأ: بيانات الكتب غير محملة. تأكد من مسار booksData.js</p>';
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

    const lang = document.documentElement.lang || 'ar'; 
    currentCartBooks = booksData.filter(book => cartIds.includes(book.id.toString()));
    
    currentCartBooks.forEach(book => {
        const itemPrice = book.price;
        subtotal += itemPrice; 
        
        const cartItem = document.createElement('div');
        cartItem.className = 'summary-item cart-item';
        cartItem.innerHTML = `
            <span>${book.title[lang]}</span>
            <span class="summary-price">$${itemPrice.toFixed(2)}</span>
        `;
        cartListContainer.appendChild(cartItem);
    });

    document.getElementById('subtotal-price').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('proceed-to-delivery').disabled = false;
    
    cartSubtotal = subtotal; 
    
    const initialGov = document.getElementById('governorate-select')?.value || 'none';
    updateShippingAndTotal(initialGov); 
}

function setupCheckoutSteps() {
    const proceedButton = document.getElementById('proceed-to-delivery');
    const pageTitle = document.querySelector('.page-title');
    const deliveryForm = document.getElementById('delivery-form'); 

    initGovernorateDropdown(); 
    
    deliveryFormContainer.style.display = 'none';

    proceedButton.addEventListener('click', () => {
        summaryBox.style.display = 'none';
        deliveryFormContainer.style.display = 'block';
        
        pageTitle.textContent = '📝 تفاصيل التوصيل والدفع';
    });
    
    deliveryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const finalOrderDetails = {
            books: currentCartBooks.map(b => ({ id: b.id, title: b.title.ar, price: b.price })),
            subtotal: cartSubtotal,
            shippingFee: currentShippingPrice,
            finalTotal: (cartSubtotal + currentShippingPrice),
            customerName: document.querySelector('#delivery-form input[type="text"]').value,
            address: document.querySelector('#delivery-form textarea').value,
            governorate: document.getElementById('governorate-select').options[document.getElementById('governorate-select').selectedIndex].textContent,
        };
        
        console.log("Final Order Details:", finalOrderDetails);

        alert('✅ تم تأكيد طلبك بنجاح! سيتم توصيل الكتب قريباً.');
        localStorage.removeItem('shoppingCart'); 
        
        window.location.href = "../index.html"; 
    });
}


document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    setupCheckoutSteps();
});