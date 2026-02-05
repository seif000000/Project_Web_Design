# 📚 Book Worms - Digital Bookstore

Welcome to **Book Worms**, a comprehensive digital bookstore application designed with a focus on user experience, responsiveness, and functionality. This project provides a complete e-commerce experience for book lovers, including a catalog, shopping cart, and admin management tools.

---

## 🚀 Features

- **🌍 Multilingual Support**: Seamlessly switch between **Arabic** and **English**. The application automatically adjusts the layout (RTL/LTR) based on the selected language.
- **🌙 Dark Mode**: A sleek dark theme for comfortable reading at night, with a persistent theme toggle.
- **🛒 Shopping Cart**: Add books to your cart and manage your selections. Uses `localStorage` to persist your cart items.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop screens.
- **🔐 User Accounts**: Dedicated pages for User Registration, Login, and Profile management.
- **🛠️ Admin Dashboard**: Specialized dashboard for administrators to add or remove books from the library.
- **🔍 Categorized Catalog**: Browse books by categories like Novels, Fantasy, Sci-Fi, and Art.
- **✨ Interactive UI**: Features smooth carousels, hover effects, and micro-animations for an engaging experience.

---

## 📁 Project Structure

The project is organized into logical modules for better maintainability:

- **Root Directory**:
    - `index.html`: The main landing page featuring hero sections, categories, and featured books.
    - `style.css`: Global styles including theme variables and layout utilities.
    - `script.js`: Core logic for translation, theme toggling, and global UI components.
    - `translations.json`: Translation strings for the main application.

- **`Books/`**: 
    - Contains the book listing page (`books.html`) and associated scripts.
    - `booksData.js`: The central "database" of books available in the store.
    - `lang.json`: Specific translations for the books module.

- **`Checkout/`**: 
    - Handles the shopping cart and checkout process.
    - `checkout.html`: Displays selected items and total price.

- **`admin/`**: 
    - Tools for bookstore management.
    - `admin-page.html`: The main dashboard for administrators.
    - `add-book.html` & `remove-books.html`: Specific management actions.

- **`personal/`**: 
    - User account pages.
    - `login.html`, `register.html`, and `profile.html`.

- **`Summary/`**: 
    - Provides a summary view of orders or site statistics.

- **`about/` & `contact/`**: 
    - Static pages providing information about the brand and contact methods.

- **`image/`**: 
    - Centralized storage for book covers and site assets.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic structure for accessibility and SEO.
- **CSS3**: Custom styling with CSS Variables for theme management and Flexbox/Grid for layouts.
- **JavaScript (ES6+)**: Dynamic functionality, local storage management, and asynchronous data fetching.
- **JSON**: Used for data storage and multilingual translation mapping.

---

## 🏁 Getting Started

To view the project locally:
1. Clone or download the repository.
2. Open `index.html` in any modern web browser.
3. Use the **AR/EN** button in the navbar to switch languages.
4. Click the **Sun/Moon** icon to toggle Dark Mode.

---

## 📝 Functionality Analysis

### 1. Translation System
The app uses a `data-lang` or `data-key` attribute in HTML. The `loadTranslations()` function in `script.js` fetches the JSON file and updates the text content of elements dynamically without reloading the page.

### 2. Theme Management
Theme preferences are saved in `localStorage`. The `enableDarkMode()` and `disableDarkMode()` functions toggle a `.dark-mode` class on the `<html>` element, which updates colors via CSS variables.

### 3. Data Flow
Book data is stored as a JavaScript object array in `Books/booksData.js`. This allows the application to dynamically generate book cards across different pages while maintaining a single source of truth.

---

*Developed by the Book Worms Team.*
