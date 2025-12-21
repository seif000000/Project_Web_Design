// === Ahmyd Search Integration (with dorking) ===
// Now uses centralized API service instead of static booksData

document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("get-books");
  const searchBtn = document.getElementById("search-button"); // Get the search button element
  const cardsContainer = document.getElementById("cards-container");
  // const categorySelect = document.getElementById("category-filter"); // REMOVED: No longer needed
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const pageInfo = document.getElementById("pageInfo");

  const perPage = 10;
  let currentPage = 1;
  let filtered = [];

  // Load books from API using centralized service
  // Wait for API service to be loaded
  if (typeof window.booksAPI === 'undefined') {
    console.error('Books API service not loaded. Make sure js/apiService.js is included before this script.');
    return;
  }

  const mergedBooksData = await window.booksAPI.loadBooks();
  
  if (mergedBooksData.length === 0) {
    cardsContainer.innerHTML = '<p style="text-align:center;color:#777;padding:2rem;">No books available. Please check your database connection.</p>';
    console.warn('⚠️ No books loaded from API');
  }

  // Get unique categories from the merged book list - Still needed for dorking
  const categories = [];
  mergedBooksData.forEach(book => {
    const en = book.category.en;
    const ar = book.category.ar;
    // Only add if it's not already in the list
    if (!categories.find(c => c.en === en)) {
      categories.push({ en, ar });
    }
  });

  // Function to update the search box placeholder when language changes
  function updateSearchPlaceholder(lang) {
    if (!input) return; // Stop if the input doesn't exist
    // Get the translated placeholder text, or use default
    const placeholderText = window.langData && window.langData[lang] ? window.langData[lang].search_placeholder : (lang === "ar" ? "ابحث عن كتاب أو مؤلف..." : "Search books or authors...");
    input.placeholder = placeholderText;
  }

  // Function to update the search button text when language changes
  function updateSearchButtonText(lang) {
    if (!searchBtn) return; // Stop if the button doesn't exist
    // Get the translated button text, or use default
    const buttonText = window.langData && window.langData[lang] ? window.langData[lang].search_button : (lang === "ar" ? "بحث" : "Search");
    searchBtn.textContent = buttonText;
  }

  // This function is called by lang.js when the user clicks the language button
  window.updateBooksLang = (lang) => {
    // REMOVED: No need to update category dropdown
    updateSearchPlaceholder(lang); // Update the search box text
    updateSearchButtonText(lang); // Update the button text
    filterBooks(false); // Run the search again to show correct language for books
  };

  // Run this code once when the page loads to set the initial language
  const initialLang = localStorage.getItem("lang") || "ar";
  // REMOVED: No need to populate category dropdown initially
  updateSearchPlaceholder(initialLang);
  updateSearchButtonText(initialLang);

  // REMOVED: No need to restore category selection from localStorage
  input.value = localStorage.getItem("ahmydQuery") || "";

  
  
  
  
  
  
  
  
  
  
  
  
  
 // --- Filtering logic with Dorking Support  ---
  
 function filterBooks(resetPage = true) {
    const rawQuery = input.value.trim(); // Get the raw input string
    const currentLang = localStorage.getItem("lang") || "ar"; // Get current language

    // Save filters (using raw query for storage)
    // REMOVED: No need to save category selection
    localStorage.setItem("ahmydQuery", rawQuery);

    // --- NEW: Parse the raw query for dorking commands ---
    // Original regex structure, but make the value part (including spaces) optional
    // (\w+) matches the command name
    // : matches the colon
    // \s* matches any optional whitespace after the colon
    // (?:...) is a non-capturing group containing the value part
    //   \s* matches optional whitespace before the value
    //   (?:"([^"]+)"|(\S+)) matches either "quoted value" (capturing content in [2]) or non-whitespace value (capturing in [3])
    // The entire non-capturing group (?:\s*(?:"([^"]+)"|(\S+))) is made optional with a ?
    // This allows matching 'command:' alone
    const commandRegex = /(\w+):\s*(?:"([^"]*)"|(\S+))?/g;
    const commands = {};
    let parsedQuery = rawQuery; // Start with the full query
    let match;

    while ((match = commandRegex.exec(parsedQuery)) !== null) {
      const command = match[1].toLowerCase(); // e.g., "category", "author"
      // The value is captured by group [2] (quoted, can be empty "") or [3] (unquoted, must be non-empty \S+)
      // If neither [2] nor [3] matched (i.e., just command: was typed), both will be undefined.
      // We assign the captured value (quoted or unquoted) or default to an empty string if neither existed.
      // Since (\S+) requires at least one char, typing 'category:N' will not match [3] until 'N' is followed by space/end (which it isn't during typing).
      // The regex (\S+) inside the optional group means it must match something if it's going to match.
      // The original /(\w+):\s*("([^"]+)"|(\S+))/g required something after the colon.
      // To allow empty after colon, we use /(\w+):\s*(?:"([^"]*)"|(\S+))?/g
      // Now, "([^"]*)" can match an empty quoted string "", and (\S+) matches non-empty unquoted.
      // If neither part matches (just 'command:'), match[2] and match[3] are undefined.
      const quotedValue = match[2]; // Captured from "..."
      const unquotedValue = match[3]; // Captured from \S+

      // Assign the found value or default to empty string if neither was found
      // Prefer quoted value (even if empty "") over unquoted (which must be non-empty if captured by \S+)
      let value = "";
      if (quotedValue !== undefined) {
          value = quotedValue; // Could be an empty string ""
      } else if (unquotedValue !== undefined) {
          value = unquotedValue; // Guaranteed non-empty due to \S+
      }
      // If both are undefined (meaning command: alone was typed), value remains ""

      commands[command] = value.trim().toLowerCase(); // Store as lowercase for comparison
    }

    // Remove the matched command parts from the query to get any remaining general search terms
    // Using the same regex to remove the matched parts
    const generalQuery = parsedQuery.replace(commandRegex, '').trim().toLowerCase();

    // --- NEW: Apply Filters based on commands and general query only ---
    filtered = mergedBooksData.filter(b => {
      const title = b.title[currentLang].toLowerCase();
      const author = b.author[currentLang].toLowerCase();
      const categoryEn = b.category.en.toLowerCase(); // Use English name for category matching
      const categoryLocal = b.category[currentLang].toLowerCase(); // Use local name for query matching

      // Start with the assumption that the book matches all commands
      let matchesAllSpecifiedCommands = true;

      // Apply Category Filter (only if a non-empty value was provided)
      if (commands.category !== undefined) { // Check if the command was present at all
          // Check if a value was provided after 'category:' (ignoring leading/trailing spaces)
          if (commands.category.trim() !== "") {
              // A value was provided, apply the filter
              matchesAllSpecifiedCommands = matchesAllSpecifiedCommands && (categoryEn.includes(commands.category) || categoryLocal.includes(commands.category));
          }
          // If commands.category is empty or just spaces, do nothing, matchesAllSpecifiedCommands remains true for this part
      }

      // Apply Author/Writer Filter (only if a non-empty value was provided)
      if (commands.author !== undefined || commands.writer !== undefined) {
          const authorValue = commands.author;
          const writerValue = commands.writer;

          // Check if author was specified with a value
          if (authorValue !== undefined && authorValue.trim() !== "") {
              matchesAllSpecifiedCommands = matchesAllSpecifiedCommands && author.includes(authorValue);
          }
          // Check if writer was specified with a value (and author wasn't, or was empty)
          // Note: This logic assumes 'author' takes precedence if both are specified with values
          if (writerValue !== undefined && writerValue.trim() !== "" && (authorValue === undefined || authorValue.trim() === "")) {
              matchesAllSpecifiedCommands = matchesAllSpecifiedCommands && author.includes(writerValue); // Uses same author field
          }
      }

      // Add more commands here if needed (e.g., title:, id:)
      // if (commands.title !== undefined && commands.title.trim() !== "") {
      //   matchesAllSpecifiedCommands = matchesAllSpecifiedCommands && title.includes(commands.title);
      // }

      // Check if book matches the general query (anything not a command)
      let matchesGeneralQuery = true;
      if (generalQuery) {
         // Check if the remaining query text matches title, author, or local category
         matchesGeneralQuery = title.includes(generalQuery) || author.includes(generalQuery) || categoryLocal.includes(generalQuery);
      }

      // Book is included if it matches ALL specified commands (that have values) AND the general query (if any)
      return matchesAllSpecifiedCommands && matchesGeneralQuery;
    });

    if (resetPage) currentPage = 1;
    renderPage();
  }


  // This function shows the current page of books
  function renderPage() {
    cardsContainer.innerHTML = ""; // Clear the container
    const currentLang = localStorage.getItem("lang") || "ar";
    // Get translations, or use default English if not found
    const t = window.langData ? window.langData[currentLang] : {
      preview: "Preview",
      details: "Details",
      author: "Author",
      category: "Category",
      page: "Page",
      no_results: "No results found "
    };

    // Calculate total pages
    const totalPages = Math.ceil(filtered.length / perPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages; // Don't go past the last page

    // Get the books for the current page
    const start = (currentPage - 1) * perPage;
    const slice = filtered.slice(start, start + perPage);

    if (slice.length === 0) {
      // Show "no results" message
      cardsContainer.innerHTML = <p style="text-align:center;color:#777;">${t.no_results}</p>;
      pageInfo.textContent = ""; // Clear page info
      nextBtn.disabled = true; // Disable buttons
      prevBtn.disabled = true;
      return; // Stop here
    }

    // Create and add a card for each book on this page
    slice.forEach((book, idx) => {
      const card = document.createElement("article");
      card.className = "card";
      // Fill the card with book info using the correct language
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
      // Add click listeners to the buttons on the card
      card.querySelector(".preview-btn").addEventListener("click", () => openPreview(book.id));
      card.querySelector(".details-btn").addEventListener("click", () => openDetails(book.id));
      cardsContainer.appendChild(card);
      // Add animation delay for each card
      setTimeout(() => card.classList.add("show"), 60 * idx);
    });

    // Update the page number display and button states
    pageInfo.textContent = `${t.page} ${currentPage} / ${totalPages}`;
    prevBtn.disabled = currentPage <= 1; // Disable previous button on first page
    nextBtn.disabled = currentPage >= totalPages; // Disable next button on last page
  }

  // Event listeners for pagination buttons
  nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filtered.length / perPage) || 1;
    if (currentPage < totalPages) {
      currentPage++; // Go to next page
      renderPage(); // Show the next page
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--; // Go to previous page
      renderPage(); // Show the previous page
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
    }
  });

  // Event listeners for search input and category dropdown
  input.addEventListener("input", () => filterBooks(true));
  searchBtn.addEventListener("click", () => filterBooks(true));
  // REMOVED: No need for categorySelect change listener

  // Load the first page of books when the page starts
  filterBooks(true);
});