// Fetch JSON data
fetch('js/books-data.json')
  .then(response => response.json())
  .then(booksData => {
    // Get book ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    const book = booksData[bookId];

    if (book) {
      // Fill book information
      document.getElementById('bookCover').src = book.cover;
      document.getElementById('bookTitle').textContent = `Book Title: ${book.title}`;
      document.getElementById('bookAuthor').textContent = book.author;
      document.getElementById('bookYear').textContent = book.year;
      document.getElementById('bookPages').textContent = book.pages;
      document.getElementById('bookDescription').textContent = book.description;

      // Button functionality
      const readBtn = document.getElementById('readBtn');
      const closeBtn = document.getElementById('closeBtn');
      const iframe = document.getElementById('flipbook');

      // When "Read Book" button is clicked
      readBtn.addEventListener('click', () => {
        iframe.src = book.flipbookUrl;
        iframe.style.display = 'block';
        readBtn.style.display = 'none';
        closeBtn.style.display = 'inline-block';
        window.scrollTo({ top: iframe.offsetTop, behavior: 'smooth' });
      });

      // When "Close Book" button is clicked
      closeBtn.addEventListener('click', () => {
        iframe.style.display = 'none';
        iframe.src = '';
        readBtn.style.display = 'inline-block';
        closeBtn.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  })
  .catch(error => console.error('Error loading books:', error));