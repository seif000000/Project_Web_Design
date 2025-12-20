// Navigation functions for admin dashboard
function navigateToAddBook() {
    window.location.href = 'add-book.html';
}

function navigateToRemoveBook() {
    window.location.href = 'remove-books.html';
}

function goToHome() {
    window.location.href = '../index.html';
}

// Add smooth animation on page load
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.admin-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * (index + 1));
    });
});