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

let books = [];

// Load books on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
});

// Function to load and display all books from API
async function loadBooks() {
    const booksGrid = document.getElementById('booksGrid');
    booksGrid.innerHTML = '<div class="loading">جاري تحميل الكتب...</div>';

    try {
        const response = await fetch(`${window.API_BASE_URL}/books`, {
            credentials: 'include'  // Important for session cookies
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        
        books = await response.json();
        
        if (books.length === 0) {
            booksGrid.innerHTML = '<div class="no-books">لا توجد كتب في المكتبة</div>';
            return;
        }
        
        booksGrid.innerHTML = '';
        books.forEach(book => {
            const bookElement = createBookElement(book);
            booksGrid.appendChild(bookElement);
        });
        
    } catch (error) {
        console.error('Error loading books:', error);
        booksGrid.innerHTML = '<div class="error">حدث خطأ في تحميل الكتب. تأكد من تشغيل الخادم على http://localhost:5000</div>';
    }
}

// Function to create a book element
function createBookElement(book) {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book-item';
    bookDiv.style.opacity = '0';
    bookDiv.style.transform = 'translateY(20px)';
    
    // Use image_url if available, otherwise use a placeholder
    const coverImage = book.image_url 
        ? `${window.BACKEND_BASE}/${book.image_url}` 
        : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect fill="%23ddd" width="300" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3Eلا توجد صورة%3C/text%3E%3C/svg%3E';
    
    bookDiv.innerHTML = `
        <img src="${coverImage}" alt="${book.title}" class="book-cover" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'400\'%3E%3Crect fill=\'%23ddd\' width=\'300\' height=\'400\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' font-size=\'20\' fill=\'%23999\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3Eلا توجد صورة%3C/text%3E%3C/svg%3E'">
        <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${book.author}</p>
            ${book.price ? `<p class="book-price">${book.price} جنيه</p>` : ''}
        </div>
        <div class="book-actions">
            <button class="edit-btn" onclick="editBook(${book.id})" title="تعديل الكتاب">✏️</button>
            <button class="remove-btn" onclick="removeBook(${book.id})" title="حذف الكتاب">✕</button>
        </div>
    `;
    
    // Animate the book element
    setTimeout(() => {
        bookDiv.style.transition = 'all 0.5s ease';
        bookDiv.style.opacity = '1';
        bookDiv.style.transform = 'translateY(0)';
    }, 50);
    
    return bookDiv;
}

// Function to edit a book
function editBook(bookId) {
    window.location.href = `edit-book.html?id=${bookId}`;
}

// Function to remove a book
async function removeBook(bookId) {
    if (!confirm('هل أنت متأكد من حذف هذا الكتاب؟')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Reload the books display
            await loadBooks();
            
            // Show success message
            alert('تم حذف الكتاب بنجاح!');
        } else {
            alert('حدث خطأ أثناء حذف الكتاب: ' + (result.message || 'خطأ غير معروف'));
        }
        
    } catch (error) {
        console.error('Error deleting book:', error);
        alert('حدث خطأ في الاتصال بالخادم. تأكد من تشغيل الخادم على http://localhost:5000');
    }
}

// Function to go back to admin page
function goToAdmin() {
    window.location.href = 'admin-page.html';
}

// Function to go to home page
function goToHome() {
    window.location.href = '../index.html';
}