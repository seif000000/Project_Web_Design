// === Ahmyd Search Integration (with category-based pagination) ===
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("get-books");
  const searchBtn = document.getElementById("search-button");
  const cardsContainer = document.getElementById("cards-container");
  const categorySelect = document.getElementById("category-filter");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const pageInfo = document.getElementById("pageInfo");

  const perPage = 10;
  let currentPage = 1;
  let filtered = [];

  // --- Get unique categories from booksData ---
  const categories = [];
  booksData.forEach(book => {
    const en = book.category.en;
    const ar = book.category.ar;
    if (!categories.find(c => c.en === en)) {
      categories.push({ en, ar });
    }
  });

  // --- Populate dropdown ---
  const currentLang = localStorage.getItem("lang") || "ar";
  categorySelect.innerHTML = ""; // clear in case something existed

  // Add "All" manually first
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = currentLang === "ar" ? "الكل" : "All";
  categorySelect.appendChild(allOption);

  // Add the rest (skipping any duplicate "all")
  categories.forEach(cat => {
    if (cat.en.toLowerCase() === "all") return;
    const opt = document.createElement("option");
    opt.value = cat.en;
    opt.textContent = cat[currentLang];
    categorySelect.appendChild(opt);
  });

  // Restore last selected state
  categorySelect.value = localStorage.getItem("ahmydCategory") || "all";
  input.value = localStorage.getItem("ahmydQuery") || "";

  // --- Filtering logic ---
  function filterBooks(resetPage = true) {
    const query = input.value.trim().toLowerCase();
    const selectedCategory = categorySelect.value;
    const currentLang = localStorage.getItem("lang") || "ar";

    // Save filters
    localStorage.setItem("ahmydCategory", selectedCategory);
    localStorage.setItem("ahmydQuery", query);

    // Filter logic
    filtered = booksData.filter(b => {
      const title = b.title[currentLang].toLowerCase();
      const author = b.author[currentLang].toLowerCase();
      const categoryEn = b.category.en;
      const categoryLocal = b.category[currentLang].toLowerCase();

      const matchesQuery =
        title.includes(query) || author.includes(query) || categoryLocal.includes(query);

      const matchesCategory =
        selectedCategory === "all" || categoryEn === selectedCategory;

      return matchesQuery && matchesCategory;
    });

    if (resetPage) currentPage = 1;
    renderPage();
  }

  // --- Render page and control pagination ---
  function renderPage() {
    cardsContainer.innerHTML = "";
    const currentLang = localStorage.getItem("lang") || "ar";
    const t = window.langData ? window.langData[currentLang] : {
      preview: "Preview",
      details: "Details",
      author: "Author",
      category: "Category",
      page: "Page"
    };

    const totalPages = Math.ceil(filtered.length / perPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * perPage;
    const slice = filtered.slice(start, start + perPage);

    if (slice.length === 0) {
      cardsContainer.innerHTML = `<p style="text-align:center;color:#777;">No results found 😔</p>`;
      pageInfo.textContent = "";
      nextBtn.disabled = true;
      prevBtn.disabled = true;
      return;
    }

    // --- Render each book card ---
    slice.forEach((book, idx) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <img class="cover" src="${book.cover}" alt="${book.title[currentLang]}" loading="lazy" />
        <div class="body">
          <h3>${book.title[currentLang]}</h3>
          <p class="author">${t.author}: ${book.author[currentLang]}</p>
          <p class="category">${t.category}: ${book.category[currentLang]}</p>
          <div class="actions">
            <button class="btn preview-btn">${t.preview}</button>
            <button class="btn details-btn">${t.details}</button>
          </div>
        </div>
      `;
      card.querySelector(".preview-btn").addEventListener("click", () => openPreview(book.id));
      card.querySelector(".details-btn").addEventListener("click", () => openDetails(book.id));
      cardsContainer.appendChild(card);
      setTimeout(() => card.classList.add("show"), 60 * idx);
    });

    // --- Pagination info and button states ---
    pageInfo.textContent = `${t.page} ${currentPage} / ${totalPages}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages; // disables when reaching the end
  }

  // --- Pagination button events ---
  nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filtered.length / perPage) || 1;
    if (currentPage < totalPages) {
      currentPage++;
      renderPage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // --- Events ---
  input.addEventListener("input", () => filterBooks(true));
  searchBtn.addEventListener("click", () => filterBooks(true));
  categorySelect.addEventListener("change", () => filterBooks(true));

  // --- Initial load ---
  filterBooks(true);
});
