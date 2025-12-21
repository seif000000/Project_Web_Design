// admin/remove-books-script.js — Uses /api/books with admin auth
document.addEventListener("DOMContentLoaded", function () {
  loadBooks();

  // Navigation
  window.goToAdmin = () => (window.location.href = "admin-page.html");
  window.goToHome = () => (window.location.href = "../index.html");
});

async function loadBooks() {
  const grid = document.getElementById("booksGrid");
  grid.innerHTML =
    '<p style="text-align:center;padding:2rem;">جارٍ التحميل...</p>';

  try {
    const response = await fetch("/api/books?limit=100");
    if (!response.ok) throw new Error("فشل التحميل");

    const data = await response.json();
    renderBooks(data.books || data);
  } catch (err) {
    grid.innerHTML = `<p style="text-align:center;color:red;">خطأ: ${err.message}</p>`;
  }
}

function renderBooks(books) {
  const grid = document.getElementById("booksGrid");
  if (books.length === 0) {
    grid.innerHTML =
      '<p style="text-align:center;padding:2rem;">لا توجد كتب</p>';
    return;
  }

  grid.innerHTML = books
    .map(
      (book) => `
    <div class="book-item">
      <img src="${book.image_url || "../image/placeholder-book.webp"}" 
           alt="${book.title?.ar || book.title || "Book"}" 
           class="book-cover"
           onerror="this.src='../image/placeholder-book.webp'">
      <div class="book-info">
        <h3 class="book-title">${book.title?.ar || book.title?.en || "---"}</h3>
        <p class="book-author">${book.author?.ar || book.author?.en || "---"}</p>
      </div>
      <button class="remove-btn" 
              onclick="removeBook('${book._id}', this)"
              title="حذف الكتاب">✕</button>
    </div>
  `,
    )
    .join("");
}

async function removeBook(id, button) {
  if (!confirm("هل أنت متأكد من الحذف؟")) return;

  const token = localStorage.getItem("token"); // ← 'token', not 'adminToken'
  if (!token) {
    alert("يجب تسجيل الدخول أولاً");
    window.location.href = "login.html";
    return;
  }

  try {
    button.disabled = true;
    button.textContent = "...";

    const response = await fetch(`/api/books/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      button.closest(".book-item").style.opacity = "0";
      setTimeout(() => button.closest(".book-item").remove(), 300);
    } else {
      const err = await response.json();
      throw new Error(err.error || "فشل الحذف");
    }
  } catch (err) {
    alert("خطأ: " + err.message);
    button.disabled = false;
    button.textContent = "✕";
  }
}
