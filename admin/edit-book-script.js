// API base URL - detect automatically
function getApiBaseUrl() {
    if (window.location.port === '5502' || window.location.hostname === '127.0.0.1') {
        return 'http://127.0.0.1:5000/api';
    }
    return 'http://localhost:5000/api';
}
window.API_BASE_URL = window.API_BASE_URL || getApiBaseUrl();
window.API_BASE_URL_FALLBACK = window.API_BASE_URL_FALLBACK || (window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000/api' 
    : 'http://127.0.0.1:5000/api');
window.BACKEND_BASE = window.BACKEND_BASE || window.API_BASE_URL.replace(/\/api$/, '');

// Get book ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

// Display selected file names
document.getElementById('bookCover').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || 'لم يتم اختيار ملف';
    document.getElementById('coverFileName').textContent = fileName;
});

document.getElementById('bookPDF').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || 'لم يتم اختيار ملف';
    document.getElementById('pdfFileName').textContent = fileName;
});

// Load book data on page load
document.addEventListener('DOMContentLoaded', async function() {
    if (!bookId) {
        alert('معرف الكتاب غير موجود في الرابط');
        window.location.href = 'remove-books.html';
        return;
    }
    
    await loadBookData();
    
    // Add smooth animation on page load
    const formContainer = document.querySelector('.form-container');
    formContainer.style.opacity = '0';
    formContainer.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        formContainer.style.transition = 'all 0.6s ease';
        formContainer.style.opacity = '1';
        formContainer.style.transform = 'translateY(0)';
    }, 200);
});

// Load book data from API
async function loadBookData() {
    try {
        const response = await fetch(`${window.API_BASE_URL}/books/${bookId}`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch book');
        }
        
        const book = await response.json();
        
        // Populate form fields
        document.getElementById('bookId').value = book.id;
        document.getElementById('bookTitle').value = book.title || '';
        document.getElementById('bookAuthor').value = book.author || '';
        document.getElementById('bookCategory').value = book.category_name || '';
        document.getElementById('bookDescription').value = book.description || '';
        document.getElementById('bookPrice').value = book.price || 0;
        
        // Show current cover image if available
        if (book.image_url) {
            const previewDiv = document.getElementById('currentCoverPreview');
            const imgSrc = `${window.BACKEND_BASE}/${book.image_url}`;
            previewDiv.innerHTML = `
                <p style="margin-bottom: 5px;">الصورة الحالية:</p>
                <img src="${imgSrc}" alt="Current cover" style="max-width: 200px; max-height: 300px; border: 1px solid #ddd; border-radius: 5px;">
            `;
        }
        
    } catch (error) {
        console.error('Error loading book:', error);
        alert('حدث خطأ في تحميل بيانات الكتاب. تأكد من تشغيل الخادم على http://localhost:5000');
        window.location.href = 'remove-books.html';
    }
}

// Handle form submission
document.getElementById('editBookForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const bookId = document.getElementById('bookId').value;
    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const category = document.getElementById('bookCategory').value.trim();
    const description = document.getElementById('bookDescription').value.trim();
    const price = document.getElementById('bookPrice').value;
    const coverFile = document.getElementById('bookCover').files[0];
    const pdfFile = document.getElementById('bookPDF').files[0];
    
    // Validate required fields
    if (!title || !author || !category || !description || !price) {
        alert('الرجاء ملء جميع الحقول المطلوبة');
        return;
    }
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('price', price);
    
    // Only append files if they were selected
    if (coverFile) {
        formData.append('cover', coverFile);
    }
    if (pdfFile) {
        formData.append('pdf', pdfFile);
    }
    
    try {
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري التحديث...';
        
        // Send PUT request to Flask API
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
            method: 'PUT',
            credentials: 'include',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Show success modal
            showSuccessModal();
        } else {
            alert('حدث خطأ أثناء تحديث الكتاب: ' + (result.message || 'خطأ غير معروف'));
        }
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ في الاتصال بالخادم. تأكد من تشغيل الخادم على http://localhost:5000');
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'تحديث الكتاب ✨';
    }
});

// Function to show success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
    
    // Redirect to remove-books page after 2 seconds
    setTimeout(() => {
        window.location.href = 'remove-books.html';
    }, 2000);
}

// Function to go back to admin page
function goToAdmin() {
    window.location.href = 'admin-page.html';
}

// Function to go to home page
function goToHome() {
    window.location.href = '../index.html';
}

