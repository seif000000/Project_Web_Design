document.addEventListener("DOMContentLoaded", () => {

  // favorite books data
  const favoriteBooks = [
   { 
    title: { ar: "الأمير", en: "The Prince" }, 
    author: { ar: "نيكولو مكيافيلي", en: "Niccolò Machiavelli" }, 
    cover: "image/Art of iron man.webp" 
  },
  { 
    title: { ar: "الخيميائي", en: "The Alchemist" }, 
    author: { ar: "باولو كويلو", en: "Paulo Coelho" }, 
    cover: "image/The Alchemist.jpeg" 
  },
  { 
    title: { ar: "العادات السبع للناس الأكثر فعالية", en: "The 7 Habits of Highly Effective People" }, 
    author: { ar: "ستيفن كوفي", en: "Stephen Covey" }, 
    cover: "image/The Art of Captain America.webp" 
  }
  ];

  // language texts
  const texts = {
    ar: { profile: "الملف الشخصي", favorites: "كتبي المفضلة", logout: "تسجيل الخروج", add: "اضافه كتاب", username: "اسم المستخدم", email: "البريد الإلكتروني", view: "عرض", toggle: "English" },
    en: { profile: "Profile", favorites: "My Favorite Books", logout: "Logout", add: "Add Book", username: "Username", email: "Email", view: "View", toggle: "العربية" }
  };

  // render books
  function renderBooks(lang) {
  const booksContainer = document.getElementById("books-container");
  booksContainer.innerHTML = "";
  favoriteBooks.forEach(book => {
    const card = document.createElement("div");
    card.className = "card show";
    card.innerHTML = `
      <img class="cover" src="${book.cover}" alt="${book.title[lang]}">
      <div class="body">
        <h3>${book.title[lang]}</h3>
        <p>${book.author[lang]}</p>
        <div class="actions">
          <button class="btn">${texts[lang].view}</button>
        </div>
      </div>
    `;
    booksContainer.appendChild(card);
  });
}


  // update UI texts
  function updateUI(lang) {
  const t = texts[lang];

  // update text content
  document.getElementById("profile-title").textContent = t.profile;
  document.getElementById("books-title").textContent = t.favorites;
  document.getElementById("logout-btn").textContent = t.logout;

  const storedUsername = localStorage.getItem("username") || "";
  const storedEmail = localStorage.getItem("email") || "";
  document.getElementById("display-username").textContent = `${t.username} : ${storedUsername}`;
  document.getElementById("display-email").textContent = `${t.email} : ${storedEmail}`;

  // render books
  renderBooks(lang);

  // update toggle button text
  document.getElementById("langBtn").textContent = t.toggle;

  // update text direction for the whole page
  if (lang === "ar") {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "ar");
  } else {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.setAttribute("lang", "en");
  }
}

  // logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    window.location.href = "login.html";
  });

  // initialize
  let currentLang = localStorage.getItem("lang") || "ar";
  updateUI(currentLang);

  // toggle button
  document.getElementById("langBtn").addEventListener("click", () => {
    currentLang = currentLang === "ar" ? "en" : "ar";
    localStorage.setItem("lang", currentLang);
    updateUI(currentLang);
  });

});




// Fall down :) 


const favBooks = document.querySelector('.favorite-books');

window.addEventListener('scroll', () => {
  const rect = favBooks.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Calculate scroll progress from 0 (top) to 1 (bottom)
  let progress = 1 - (rect.top / windowHeight);
  if (progress < 0) progress = 0;
  if (progress > 1) progress = 1;

  // Apply subtle shake + bounce based on scroll
  const rotate = Math.sin(progress * Math.PI * 4) * 3; // rotate back/forth
  const translateY = Math.sin(progress * Math.PI * 2) * 10; // bounce up/down
  favBooks.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
});




const usernameDiv = document.getElementById('display-username');

usernameDiv.addEventListener('click', () => {
  const parentDiv = usernameDiv.parentElement; // the .item-block
  parentDiv.classList.add('fall-down');

  parentDiv.addEventListener('animationend', () => {
    const avatar = document.querySelector('.profile-avatar');

    // Grow the avatar
    avatar.style.transition = "all 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
    avatar.style.width = "350px";
    avatar.style.height = "350px";

    // Remove the username block to collapse space
    parentDiv.remove();
  }, { once: true });
});


const emailDiv = document.getElementById('display-email');
emailDiv.addEventListener('click', () => {
    alert("متعملش كده تاني");
    location.reload();
}
);

