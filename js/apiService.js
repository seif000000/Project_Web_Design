const API_BASE_URL = window.location.origin;
const API_ENDPOINT = "/api/books"; // Use new API endpoint
const FALLBACK_ENDPOINT = "/admin/books"; // Fallback to admin endpoint

let booksCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function transformApiBook(apiBook) {
  const getTitle = (book) => {
    if (typeof book.title === "object" && book.title !== null) {
      return book.title;
    }
    return { en: book.title || "Untitled", ar: book.title || "بدون عنوان" };
  };

  const getAuthor = (book) => {
    if (typeof book.author === "object" && book.author !== null) {
      return book.author;
    }
    return { en: book.author || "Unknown", ar: book.author || "غير معروف" };
  };

  const getCategory = (book) => {
    if (typeof book.category === "object" && book.category !== null) {
      return book.category;
    }
    const catStr = book.category || book.genre || "Uncategorized";
    return { en: catStr, ar: catStr };
  };

  return {
    id: apiBook.id || apiBook._id || apiBook._id?.toString(),
    _id: apiBook._id || apiBook.id,
    title: getTitle(apiBook),
    author: getAuthor(apiBook),
    category: getCategory(apiBook),
    genre:
      typeof apiBook.category === "object"
        ? apiBook.category.en
        : apiBook.category || apiBook.genre || "",
    cover:
      apiBook.cover ||
      apiBook.image_url ||
      apiBook.coverImageUrl ||
      "../image/book_image.jpg",
    image_url: apiBook.image_url || apiBook.cover || apiBook.coverImageUrl,
    price: apiBook.price || 0,
    description: apiBook.description || "",
    isNewArrival: apiBook.isNewArrival || false,
    stock: apiBook.stock || 0,
    rating: apiBook.rating || 0,
    numberOfPages: apiBook.numberOfPages || null,
  };
}

async function loadBooksFromAPI(forceRefresh = false) {
  try {
    if (!forceRefresh && booksCache && cacheTimestamp) {
      const now = Date.now();
      if (now - cacheTimestamp < CACHE_DURATION) {
        console.log("📚 Using cached books data");
        return booksCache;
      }
    }

    console.log("📚 Fetching books from API...");

    // Try new API endpoint first (/api/books)
    let response = await fetch(`${API_BASE_URL}${API_ENDPOINT}`);
    let apiBooks;

    if (!response.ok) {
      console.log(" Trying fallback endpoint...");
      response = await fetch(`${API_BASE_URL}${FALLBACK_ENDPOINT}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch books: ${response.status} ${response.statusText}`,
        );
      }
      apiBooks = await response.json();
    } else {
      const data = await response.json();
      apiBooks = Array.isArray(data) ? data : data.books || [];
    }

    // Transform books to frontend format
    const transformedBooks = apiBooks.map(transformApiBook);

    booksCache = transformedBooks;
    cacheTimestamp = Date.now();

    console.log(` Loaded ${transformedBooks.length} books from API`);
    return transformedBooks;
  } catch (error) {
    console.error(" Error loading books from API:", error);

    // Return cached data if available, even if expired
    if (booksCache) {
      console.warn(" Using expired cache due to API error");
      return booksCache;
    }

    return [];
  }
}

async function getBookById(bookId) {
  try {
    const books = await loadBooksFromAPI();
    const book = books.find(
      (b) =>
        b.id === bookId ||
        b.id?.toString() === bookId.toString() ||
        b._id?.toString() === bookId.toString(),
    );
    return book || null;
  } catch (error) {
    console.error("Error getting book by ID:", error);
    return null;
  }
}

async function getBooksByCategory(category) {
  try {
    const books = await loadBooksFromAPI();
    return books.filter((book) => {
      const bookCategory =
        typeof book.category === "object"
          ? book.category.en
          : book.category || book.genre;
      return bookCategory.toLowerCase() === category.toLowerCase();
    });
  } catch (error) {
    console.error("Error getting books by category:", error);
    return [];
  }
}

async function getNewArrivalBooks() {
  try {
    const books = await loadBooksFromAPI();
    return books.filter((book) => book.isNewArrival === true);
  } catch (error) {
    console.error("Error getting new arrival books:", error);
    return [];
  }
}

async function searchBooks(query) {
  try {
    const books = await loadBooksFromAPI();
    const lowerQuery = query.toLowerCase();

    return books.filter((book) => {
      const title =
        typeof book.title === "object"
          ? (book.title.en + " " + book.title.ar).toLowerCase()
          : book.title.toLowerCase();
      const author =
        typeof book.author === "object"
          ? (book.author.en + " " + book.author.ar).toLowerCase()
          : book.author.toLowerCase();
      const category =
        typeof book.category === "object"
          ? (book.category.en + " " + book.category.ar).toLowerCase()
          : (book.category || "").toLowerCase();

      return (
        title.includes(lowerQuery) ||
        author.includes(lowerQuery) ||
        category.includes(lowerQuery)
      );
    });
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
}

function clearBooksCache() {
  booksCache = null;
  cacheTimestamp = null;
}

if (typeof window !== "undefined") {
  window.booksAPI = {
    loadBooks: loadBooksFromAPI,
    getBookById: getBookById,
    getBooksByCategory: getBooksByCategory,
    getNewArrivalBooks: getNewArrivalBooks,
    searchBooks: searchBooks,
    clearCache: clearBooksCache,
    transformBook: transformApiBook,
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    loadBooks: loadBooksFromAPI,
    getBookById: getBookById,
    getBooksByCategory: getBooksByCategory,
    getNewArrivalBooks: getNewArrivalBooks,
    searchBooks: searchBooks,
    clearCache: clearBooksCache,
    transformBook: transformApiBook,
  };
}
