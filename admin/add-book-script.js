// Display selected file names
document.getElementById('bookCover').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || 'لم يتم اختيار ملف';
    document.getElementById('coverFileName').textContent = fileName;
});

document.getElementById('bookPDF').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || 'لم يتم اختيار ملف';
    document.getElementById('pdfFileName').textContent = fileName;
});

// Handle form submission
document.getElementById('addBookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const bookData = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        category: document.getElementById('bookCategory').value,
        description: document.getElementById('bookDescription').value,
        price: document.getElementById('bookPrice').value,
        coverFile: document.getElementById('bookCover').files[0],
        pdfFile: document.getElementById('bookPDF').files[0]
    };
    
    // Validate files
    if (!bookData.coverFile || !bookData.pdfFile) {
        alert('الرجاء اختيار صورة الغلاف وملف PDF');
        return;
    }
    
    // In a real application, you would send this data to a server
    // For now, we'll just simulate the upload
    console.log('Book data to be uploaded:', bookData);
    
    // Show success modal
    showSuccessModal();
    
    // Reset form
    document.getElementById('addBookForm').reset();
    document.getElementById('coverFileName').textContent = 'لم يتم اختيار ملف';
    document.getElementById('pdfFileName').textContent = 'لم يتم اختيار ملف';
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
    window.location.href = 'index.html'; // or whatever your main page is called
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
