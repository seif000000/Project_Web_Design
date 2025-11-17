// ===== تحميل بيانات الكتاب من JSON =====
async function loadBook() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id")); // مثال: summary.html?id=4

  const res = await fetch("summaryData.js"); // اسم الملف الجديد
  const books = await res.json();
  const book = books.find(b => b.id === id);

  if (!book) {
    document.querySelector(".container").innerHTML = "<h2>Book not found!</h2>";
    return;
  }

  // تعبئة البيانات في الصفحة
  document.getElementById("book-title").textContent = book.title;
  document.getElementById("book-author").textContent = book.author;
  document.getElementById("book-image").src = book.cover;
  document.getElementById("short-summary").textContent = book.shortSummary;
  document.getElementById("full-summary").textContent = book.fullSummary;

  // ===== فتح وغلق الملخص الكامل =====
  const toggleBtn = document.getElementById('toggle-summary');
  const fullDiv = document.getElementById('full-summary');
  toggleBtn.addEventListener('click', () => {
    fullDiv.classList.toggle('show');
    toggleBtn.textContent = fullDiv.classList.contains('show') ? 'Hide Full Summary' : 'Read Full Summary';
  });

  // ===== تحميل PDF =====
  document.getElementById("downloadBtn").addEventListener("click", () => downloadPDF(book));
}

// ===== تحميل PDF =====
function downloadPDF(book) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;

  doc.setFontSize(18);
  doc.text(book.title, 10, y);
  y += 10;

  doc.setFontSize(14);
  doc.text(`Author: ${book.author}`, 10, y);
  y += 10;

  doc.setFontSize(12);
  const lines = doc.splitTextToSize(book.fullSummary, 180);
  doc.text(lines, 10, y);

  doc.save(`${book.title}.pdf`);
}

// ===== الوضع الليلي =====
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const btn = document.getElementById('themeToggle');
  btn.textContent = document.body.classList.contains('dark') ? '☀️ Day Mode' : '🌙 Night Mode';
});

// ===== تشغيل عند تحميل الصفحة =====
loadBook();
