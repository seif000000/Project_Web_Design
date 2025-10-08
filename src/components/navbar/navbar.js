    // ✅ Scroll behavior: Add shadow and background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("main-navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("bg-white", "shadow-lg");
  } else {
    navbar.classList.remove("bg-white", "shadow-lg");
  }
});

// ✅ Sidebar toggle
document.getElementById("openSidebar").addEventListener("click", () => {
  document.getElementById("sidebar").classList.add("active");
});

document.getElementById("closeSidebar").addEventListener("click", () => {
  document.getElementById("sidebar").classList.remove("active");
});
