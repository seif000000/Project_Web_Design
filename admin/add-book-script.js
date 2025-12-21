// admin/add-book-script.js — Uses /api/books with admin auth
document.addEventListener("DOMContentLoaded", function () {
  // File name display
  document.getElementById("bookCover").addEventListener("change", function (e) {
    document.getElementById("coverFileName").textContent =
      e.target.files[0]?.name || "لم يتم اختيار ملف";
  });
  document.getElementById("bookPDF").addEventListener("change", function (e) {
    document.getElementById("pdfFileName").textContent =
      e.target.files[0]?.name || "لم يتم اختيار ملف";
  });

  // Form submission
  document
    .getElementById("addBookForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const token = localStorage.getItem("token"); // ← Critical: 'token', not 'adminToken'
      if (!token) {
        alert("يجب تسجيل الدخول أولاً");
        window.location.href = "login.html";
        return;
      }

      // Get form data
      const formData = {
        title: {
          ar: document.getElementById("bookTitle").value,
          en: document.getElementById("bookTitle").value,
        },
        author: {
          ar: document.getElementById("bookAuthor").value,
          en: document.getElementById("bookAuthor").value,
        },
        category: {
          ar: document.getElementById("bookCategory").value,
          en: document.getElementById("bookCategory").value,
        },
        description: document.getElementById("bookDescription").value,
        price: parseFloat(document.getElementById("bookPrice").value),
        image_url: "../image/placeholder-book.webp", // Use existing placeholder
        cover: "../image/placeholder-book.webp",
        stock: 10,
        rating: 4.5,
        genre: document.getElementById("bookCategory").value,
        isbn: "",
        numberOfPages: 300,
        isAvailable: true,
      };

      try {
        const response = await fetch("/api/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ← Send JWT
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          alert(" تم إضافة الكتاب بنجاح!");
          document.getElementById("addBookForm").reset();
          document.getElementById("coverFileName").textContent =
            "لم يتم اختيار ملف";
          document.getElementById("pdfFileName").textContent =
            "لم يتم اختيار ملف";
        } else {
          throw new Error(result.error || "فشل الإضافة");
        }
      } catch (error) {
        console.error("Error:", error);
        alert(" خطأ: " + error.message);
      }
    });

  // Navigation
  window.goToAdmin = () => (window.location.href = "admin-page.html");
  window.goToHome = () => (window.location.href = "../index.html");
});
