import { loadTranslations, toggleLanguage } from './lang.js';

// تحميل الترجمات أول ما الصفحة تعمل
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

next.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % bookCards.length;
    updateCarousel();
});

prev.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + bookCards.length) % bookCards.length;
    updateCarousel();
});

updateCarousel();

