// Display selected file names
document.getElementById('bookCover').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || 'لم يتم اختيار ملف';
    document.getElementById('coverFileName').textContent = fileName;
});

document.getElementById('bookPDF').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || 'لم يتم اختيار ملف';
    document.getElementById('pdfFileName').textContent = fileName;
});

// API base URL - detect automatically based on current page
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

// Helper function to fetch with fallback
async function fetchWithFallback(url, fallbackUrl, options) {
    try {
        const response = await fetch(url, options);
        if (response.ok || response.status < 500) {
            return response;
        }
        throw new Error('Primary URL failed');
    } catch (error) {
        console.log('Trying fallback URL...');
        return await fetch(fallbackUrl, options);
    }
}

// Ensure credentials are included in fetch requests (not used globally here)

// Handle form submission
document.getElementById('addBookForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
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
    
    // Validate files
    if (!coverFile || !pdfFile) {
        alert('الرجاء اختيار صورة الغلاف وملف PDF');
        return;
    }
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('cover', coverFile);
    formData.append('pdf', pdfFile);
    
    try {
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري الإضافة...';
        
        // Send POST request to Flask API
        const response = await fetch(`${window.API_BASE_URL}/books`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Show success modal
            showSuccessModal();
            
            // Reset form
            document.getElementById('addBookForm').reset();
            document.getElementById('coverFileName').textContent = 'لم يتم اختيار ملف';
            document.getElementById('pdfFileName').textContent = 'لم يتم اختيار ملف';
        } else {
            alert('حدث خطأ أثناء إضافة الكتاب: ' + (result.message || 'خطأ غير معروف'));
        }
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ في الاتصال بالخادم. تأكد من تشغيل الخادم على http://localhost:5000');
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'إضافة الكتاب ✨';
    }
});

// Function to show success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
    
    // Redirect to admin page after 3 seconds
    setTimeout(() => {
        window.location.href = 'admin-page.html';
    }, 3000);
}

// Function to go back to admin page
function goToAdmin() {
    window.location.href = 'admin-page.html';
}

// Function to go to home page
function goToHome() {
    window.location.href = '../index.html';
}

// Add smooth animation on page load
document.addEventListener('DOMContentLoaded', function() {
    const formContainer = document.querySelector('.form-container');
    formContainer.style.opacity = '0';
    formContainer.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        formContainer.style.transition = 'all 0.6s ease';
        formContainer.style.opacity = '1';
        formContainer.style.transform = 'translateY(0)';
    }, 200);
});