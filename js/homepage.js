/**
 * Homepage Script
 * Loads books from database and displays them dynamically
 */

// Wait for API service to load
document.addEventListener('DOMContentLoaded', async () => {
    // Check if API service is available
    if (typeof window.booksAPI === 'undefined') {
        console.error('Books API service not loaded. Make sure js/apiService.js is included.');
        return;
    }

    try {
        // Load books from API
        const books = await window.booksAPI.loadBooks();
        
        if (books.length === 0) {
            console.warn('No books loaded from API');
            return;
        }

        // Update hero section with books from database
        updateHeroBooks(books);
        
        // Update categories section with real books
        updateCategories(books);
        
    } catch (error) {
        console.error('Error loading books for homepage:', error);
    }
});

/**
 * Update hero section with books from database
 */
function updateHeroBooks(books) {
    const heroBooksContainer = document.querySelector('.hero-books');
    if (!heroBooksContainer) {
        console.warn('Hero books container not found');
        return;
    }

    // Get first 3 books (or random 3)
    const featuredBooks = books.slice(0, 3);
    
    if (featuredBooks.length === 0) {
        console.warn('No books available for hero section');
        return;
    }
    
    // Find all book-card elements in hero
    const bookCards = heroBooksContainer.querySelectorAll('.book-card');
    
    featuredBooks.forEach((book, index) => {
        if (bookCards[index]) {
            const img = bookCards[index].querySelector('img');
            if (img) {
                // Fix image path - remove ../ if present, add proper path
                let coverPath = book.cover || book.image_url || book.coverImageUrl;
                if (coverPath && coverPath.startsWith('../')) {
                    coverPath = coverPath.substring(3); // Remove ../
                }
                if (coverPath && !coverPath.startsWith('http') && !coverPath.startsWith('/')) {
                    coverPath = 'image/' + coverPath.replace(/^.*\//, ''); // Get filename only
                }
                img.src = coverPath || 'image/book_image.jpg';
                img.alt = typeof book.title === 'object' ? (book.title.en || book.title.ar) : book.title;
                console.log(`✅ Updated hero book ${index + 1}: ${img.alt}`);
            }
        }
    });
}

/**
 * Update categories section with real books from database
 */
function updateCategories(books) {
    const categoriesGrid = document.querySelector('.categories-grid');
    if (!categoriesGrid) {
        console.warn('Categories grid not found');
        return;
    }

    // Get unique categories
    const categoryMap = new Map();
    books.forEach(book => {
        const category = typeof book.category === 'object' 
            ? book.category.en 
            : (book.category || book.genre || 'Uncategorized');
        
        if (!categoryMap.has(category)) {
            // Find first book in this category
            const categoryBook = books.find(b => {
                const bCategory = typeof b.category === 'object' 
                    ? b.category.en 
                    : (b.category || b.genre || '');
                return bCategory === category;
            });
            
            if (categoryBook) {
                categoryMap.set(category, categoryBook);
            }
        }
    });

    // Update category cards with real book covers
    const categoryCards = categoriesGrid.querySelectorAll('.category-card');
    const categories = Array.from(categoryMap.values()).slice(0, categoryCards.length);
    
    categories.forEach((book, index) => {
        if (categoryCards[index]) {
            const img = categoryCards[index].querySelector('img');
            if (img) {
                // Fix image path
                let coverPath = book.cover || book.image_url || book.coverImageUrl;
                if (coverPath && coverPath.startsWith('../')) {
                    coverPath = coverPath.substring(3);
                }
                if (coverPath && !coverPath.startsWith('http') && !coverPath.startsWith('/')) {
                    coverPath = 'image/' + coverPath.replace(/^.*\//, '');
                }
                img.src = coverPath || img.src; // Keep original if no cover
                img.alt = typeof book.title === 'object' ? (book.title.en || book.title.ar) : book.title;
                console.log(`✅ Updated category ${index + 1}: ${img.alt}`);
            }
        }
    });
}

