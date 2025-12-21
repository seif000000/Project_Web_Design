// Language translations for admin pages
const translations = {
    ar: {
        // Admin Dashboard
        adminWelcome: "مرحباً بك في لوحة التحكم",
        adminSubtitle: "إدارة الكتب والمحتوى بسهولة",
        addBook: "إضافة كتاب",
        addBookDesc: "أضف كتاباً جديداً إلى المكتبة",
        removeBook: "حذف كتاب",
        removeBookDesc: "إزالة كتاب من المكتبة",
        
        // Remove Books Page
        removePageTitle: "اختر الكتاب المراد حذفه",
        
        // Add Book Form
        addBookTitle: "إضافة كتاب جديد",
        bookTitle: "عنوان الكتاب",
        bookTitlePlaceholder: "أدخل عنوان الكتاب",
        bookAuthor: "اسم المؤلف",
        bookAuthorPlaceholder: "أدخل اسم المؤلف",
        bookCategory: "الفئة",
        bookCategoryPlaceholder: "مثال: رواية، خيال علمي، تاريخ",
        bookDescription: "وصف الكتاب",
        bookDescPlaceholder: "أدخل وصفاً مختصراً للكتاب",
        bookPrice: "السعر (بالجنيه)",
        bookPricePlaceholder: "أدخل سعر الكتاب",
        bookCover: "صورة غلاف الكتاب",
        chooseCover: "📷 اختر صورة الغلاف",
        bookPDF: "ملف PDF للكتاب",
        choosePDF: "📄 اختر ملف PDF",
        noFile: "لم يتم اختيار ملف",
        submitBtn: "إضافة الكتاب ✨",
        
        // Success Modal
        successTitle: "شكراً لإضافة هذه القطعة الفنية!",
        successText: "سيقوم فريقنا بمراجعة الكتاب وسيتم رفعه خلال 24 ساعة كحد أقصى",
        
        // Footer
        copyright: "حقوق النشر © 2025 Book Worms | لوحة التحكم",
        
        // Navbar
        siteName: "Book Worms - لوحة التحكم",
        removePageName: "Book Worms - حذف كتاب",
        addPageName: "Book Worms - إضافة كتاب",
        adminTooltip: "لوحة التحكم"
    },
    en: {
        // Admin Dashboard
        adminWelcome: "Welcome to the Admin Dashboard",
        adminSubtitle: "Manage books and content easily",
        addBook: "Add Book",
        addBookDesc: "Add a new book to the library",
        removeBook: "Remove Book",
        removeBookDesc: "Remove a book from the library",
        
        // Remove Books Page
        removePageTitle: "Select the Book to Remove",
        
        // Add Book Form
        addBookTitle: "Add New Book",
        bookTitle: "Book Title",
        bookTitlePlaceholder: "Enter book title",
        bookAuthor: "Author Name",
        bookAuthorPlaceholder: "Enter author name",
        bookCategory: "Category",
        bookCategoryPlaceholder: "Example: Novel, Sci-Fi, History",
        bookDescription: "Book Description",
        bookDescPlaceholder: "Enter a brief description of the book",
        bookPrice: "Price (EGP)",
        bookPricePlaceholder: "Enter book price",
        bookCover: "Book Cover Image",
        chooseCover: "📷 Choose Cover Image",
        bookPDF: "Book PDF File",
        choosePDF: "📄 Choose PDF File",
        noFile: "No file chosen",
        submitBtn: "Add Book ✨",
        
        // Success Modal
        successTitle: "Thank You for Adding This Piece of Art!",
        successText: "Our team will review the book and it will be uploaded within 24 hours max",
        
        // Footer
        copyright: "Copyright © 2025 Book Worms | Admin Panel",
        
        // Navbar
        siteName: "Book Worms - Admin Panel",
        removePageName: "Book Worms - Remove Book",
        addPageName: "Book Worms - Add Book",
        adminTooltip: "Admin Panel"
    }
};

// Get current language from localStorage or default to Arabic
let currentLang = localStorage.getItem('adminLanguage') || 'ar';

// Apply language on page load
document.addEventListener('DOMContentLoaded', function() {
    applyLanguage(currentLang);
    updateLangButton();
});

// Toggle language function
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('adminLanguage', currentLang);
    applyLanguage(currentLang);
    updateLangButton();
}

// Apply language to the page
function applyLanguage(lang) {
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', lang);
    
    // Update all elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    // Update title attribute (tooltips)
    document.querySelectorAll('[data-lang-title]').forEach(element => {
        const key = element.getAttribute('data-lang-title');
        if (translations[lang][key]) {
            element.setAttribute('title', translations[lang][key]);
        }
    });
}

// Update language button text
function updateLangButton() {
    const langBtn = document.querySelector('.lang-btn');
    if (langBtn) {
        langBtn.textContent = currentLang === 'ar' ? 'EN' : 'AR';
    }
}