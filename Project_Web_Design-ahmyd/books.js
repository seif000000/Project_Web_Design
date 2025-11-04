(function(){
  const perPage = 10;
  const params = new URLSearchParams(location.search);
  let page = parseInt(params.get('page')) || 1;

  const total = booksData.length;
  const totalPages = Math.ceil(total / perPage);

  const container = document.getElementById('cards-container');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageInfo = document.getElementById('pageInfo');
  const categoriesContainer = document.getElementById('categories');

  let currentLang = localStorage.getItem("lang") || "ar";
  let currentCategory = "all";

  const categories = ["all", ...new Set(booksData.map(b => b.category.en))];

  function renderCategories() {
    categoriesContainer.innerHTML = "";
    const t = window.langData ? window.langData[currentLang] : {};
    categories.forEach(cat => {
      const catEl = document.createElement("button");
      catEl.className = "cat-btn";
      catEl.textContent = cat === "all" ? (currentLang === "ar" ? "الكل" : "All") : (currentLang === "ar"
  ?   booksData.find(b => b.category.en === cat).category.ar
      : cat);

      catEl.addEventListener("click", () => {
        currentCategory = cat;
        renderPage(1);
        highlightActiveCategory(cat);
      });
      categoriesContainer.appendChild(catEl);
    });
    highlightActiveCategory(currentCategory);
  }

  function highlightActiveCategory(cat) {
    document.querySelectorAll(".cat-btn").forEach(btn => {
      btn.classList.toggle("active", btn.textContent === 
        (cat === "all" ? (currentLang === "ar" ? "الكل" : "All") : 
        (currentLang === "ar" ? booksData.find(b => b.category.en === cat).category.ar : cat)));
    });
  }

  function renderPage(p){
    container.innerHTML = '';
    const t = window.langData ? window.langData[currentLang] : {
      preview: "Preview",
      details: "Details",
      author: "Author",
      category: "Category"
    };

    let filtered = booksData;
    if (currentCategory !== "all") {
      filtered = booksData.filter(b => b.category.en === currentCategory);
    }

    const start = (p - 1) * perPage;
    const slice = filtered.slice(start, start + perPage);
    const totalPagesFiltered = Math.ceil(filtered.length / perPage);

    slice.forEach((book, idx) => {
      const card = createCard(book, t);
      container.appendChild(card);
      setTimeout(()=> card.classList.add('show'), 60 * idx);
    });

    pageInfo.textContent = `${t.page || "Page"} ${p} / ${totalPagesFiltered}`;
    prevBtn.disabled = p <= 1;
    nextBtn.disabled = p >= totalPagesFiltered;
  }

  function createCard(book, t){
    console.log("Creating card:", book.id, book.title[currentLang]);
    const el = document.createElement('article');
    el.className = 'card';

    const title = book.title[currentLang];
    const author = book.author[currentLang];
    const category = book.category[currentLang];

    el.innerHTML = `
      <img class="cover" src="${book.cover}" alt="${title}" loading="lazy" />
      <div class="body">
        <h3>${title}</h3>
        <p class="author">${t.author}: ${author}</p>
        <p class="category">${t.category}: ${category}</p>
        <div class="actions">
          <button class="btn preview-btn">${t.preview}</button>
          <button class="btn details-btn">${t.details}</button>
        </div>
      </div>
    `;

    el.querySelector('.preview-btn').addEventListener('click', ()=> openPreview(book.id));
    el.querySelector('.details-btn').addEventListener('click', ()=> openDetails(book.id));
    return el;
  }

  


  prevBtn.addEventListener('click', ()=> {
    if(page <= 1) return;
    page--;
    renderPage(page);
    window.scrollTo({top:0, behavior:'smooth'});
  });

  nextBtn.addEventListener('click', ()=> {
    page++;
    renderPage(page);
    window.scrollTo({top:0, behavior:'smooth'});
  });

  window.updateBooksLang = (lang) => {
    currentLang = lang;
    renderCategories();
    renderPage(1);
  };



  renderCategories();
  renderPage(page);
})();














