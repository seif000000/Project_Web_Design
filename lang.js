let currentLang = localStorage.getItem("lang") || "ar";
window.langData = {}; 

function loadLanguage() {
  fetch("lang.json")
    .then(res => res.json())
    .then(data => {
      window.langData = data; 
      const t = data[currentLang];

      document.getElementById("page-title").textContent = t.books;
      document.getElementById("books-title").textContent = t.books;
      document.getElementById("prevBtn").textContent = t.prev;
      document.getElementById("nextBtn").textContent = t.next;
      document.getElementById("langBtn").textContent = t.language;

      document.documentElement.lang = currentLang;
      document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

      if (typeof window.updateBooksLang === "function") {
        window.updateBooksLang(currentLang);
      }
    });
}

document.getElementById("langBtn").addEventListener("click", () => {
  currentLang = currentLang === "ar" ? "en" : "ar";
  localStorage.setItem("lang", currentLang);
  loadLanguage();
});

loadLanguage();

