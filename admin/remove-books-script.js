// Sample book data - In a real application, this would come from a database
let books = [
    {
        id: 1,
        title: "Into the Wild",
        author: "Jon Krakauer",
        cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%23134E4A' width='300' height='400'/%3E%3Ctext x='50%25' y='45%25' font-size='60' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3EInto the%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='80' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Arial' font-style='italic'%3EWild%3C/text%3E%3C/svg%3E"
    },
    {
        id: 2,
        title: "This Dark Road",
        author: "Kathryn Morris",
        cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%238B2727' width='300' height='400'/%3E%3Ctext x='50%25' y='30%25' font-size='40' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3EKathryn%3C/text%3E%3Ctext x='50%25' y='40%25' font-size='50' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3EMORIS%3C/text%3E%3Ctext x='50%25' y='60%25' font-size='45' fill='%23FDB750' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3EThis Dark Road%3C/text%3E%3C/svg%3E"
    },
    {
        id: 3,
        title: "The Castle",
        author: "Franz Kafka",
        cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%231a1a1a' width='300' height='400'/%3E%3Ctext x='50%25' y='40%25' font-size='50' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3ETHE%3C/text%3E%3Ctext x='50%25' y='50%25' font-size='45' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='serif'%3ECASTLE%3C/text%3E%3C/svg%3E"
    },
    {
        id: 4,
        title: "1984",
        author: "George Orwell",
        cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%23B22222' width='300' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='120' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Arial' font-weight='bold'%3E1984%3C/text%3E%3C/svg%3E"
    },
    {
        id: 5,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%23002366' width='300' height='400'/%3E%3Ctext x='50%25' y='40%25' font-size='40' fill='%23FFD700' text-anchor='middle' dominant-baseline='middle' font-family='Georgia'%3EThe Great%3C/text%3E%3Ctext x='50%25' y='50%25' font-size='50' fill='%23FFD700' text-anchor='middle' dominant-baseline='middle' font-family='Georgia' font-style='italic'%3EGatsby%3C/text%3E%3C/svg%3E"
    },
    {
        id: 6,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%23654321' width='300' height='400'/%3E%3Ctext x='50%25' y='45%25' font-size='35' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3ETo Kill a%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='40' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3EMockingbird%3C/text%3E%3C/svg%3E"
    }
];

// Load books on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
});

// Function to load and display all books
function loadBooks() {
    const booksGrid = document.getElementById('booksGrid');
    booksGrid.innerHTML = '';

    books.forEach(book => {
        const bookElement = createBookElement(book);
        booksGrid.appendChild(bookElement);
    });
}

// Function to create a book element
function createBookElement(book) {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book-item';
    bookDiv.style.opacity = '0';
    bookDiv.style.transform = 'translateY(20px)';
    
    bookDiv.innerHTML = `
        <img src="${book.cover}" alt="${book.title}" class="book-cover">
        <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${book.author}</p>
        </div>
        <button class="remove-btn" onclick="removeBook(${book.id})" title="حذف الكتاب">✕</button>
    `;
    
    // Animate the book element
    setTimeout(() => {
        bookDiv.style.transition = 'all 0.5s ease';
        bookDiv.style.opacity = '1';
        bookDiv.style.transform = 'translateY(0)';
    }, 50);
    
    return bookDiv;
}

// Function to remove a book
function removeBook(bookId) {
    if (confirm('هل أنت متأكد من حذف هذا الكتاب؟')) {
        // Find the book index
        const bookIndex = books.findIndex(book => book.id === bookId);
        
        if (bookIndex !== -1) {
            // Remove book from array
            books.splice(bookIndex, 1);
            
            // Reload the books display
            loadBooks();
            
            // Show success message
            alert('تم حذف الكتاب بنجاح!');
        }
    }
}

// Function to go back to admin page
function goToAdmin() {
    window.location.href = 'admin-page.html';
}

// Function to go to home page
function goToHome() {
    window.location.href = 'index.html'; // or whatever your main page is called
}