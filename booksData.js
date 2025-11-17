const booksData = [
  {
    id: 1,
    category: { en: "Novels & Stories", ar: "الروايات والقصص" },
    title: { en: "Pride and Prejudice", ar: "كبرياء وهوى" },
    author: { en: "Jane Austen", ar: "جين أوستن" },
    cover: "image/Pride and Prejudice.webp"
  },
  {
    id: 2,
    category: { en: "Novels & Stories", ar: "الروايات والقصص" },
    title: { en: "To Kill a Mockingbird", ar: "لقتل طائر بريء" },
    author: { en: "Harper Lee", ar: "هاربر لي" },
    cover: "image/To-Kill-a-Mockingbird.jpg"
  },
  {
    id: 3,
    category: { en: "Novels & Stories", ar: "الروايات والقصص" },
    title: { en: "The Great Gatsby", ar: "غاتسبي العظيم" },
    author: { en: "F. Scott Fitzgerald", ar: "فرانسيس سكوت فيتزجيرالد" },
    cover: "image/The Great Gatsby.webp"
  },
  {
    id: 4,
    category: { en: "Novels & Stories", ar: "الروايات والقصص" },
    title: { en: "The Alchemist", ar: "الخيميائي" },
    author: { en: "Paulo Coelho", ar: "باولو كويلو" },
    cover: "image/The Alchemist.jpeg"
  },
  {
    id: 5,
    category: { en: "Novels & Stories", ar: "الروايات والقصص" },
    title: { en: "The Kite Runner", ar: "عداء الطائرة الورقية" },
    author: { en: "Khaled Hosseini", ar: "خالد الحسيني" },
    cover: "image/The Kite Runner.jpg"
  },
  {
    id: 6,
    category: { en: "Novels & Stories", ar: "الروايات والقصص" },
    title: { en: "Little Women", ar: "نساء صغيرات" },
    author: { en: "Louisa May Alcott", ar: "لويزا ماي ألكوت" },
    cover: "image/Little Women.webp"
  },
  {
    id: 7,
    category: { en: "Novels & Stories", ar: "الروايات والقصص" },
    title: { en: "The Catcher in the Rye", ar: "الحارس في حقل الشوفان" },
    author: { en: "J.D. Salinger", ar: "ج. د. سالينجر" },
    cover: "image/The Catcher in the Rye.webp"
  },


  {
    id: 8,
    category: { en: "Fantasy & Sci-Fi", ar: "الخيال والعلوم الغامضة" },
    title: { en: "Harry Potter and the Sorcerer’s Stone", ar: "هاري بوتر وحجر الفيلسوف" },
    author: { en: "J.K. Rowling", ar: "ج. ك. رولينغ" },
    cover: "image/Harry Potter and the Sorcerer’s Stone.png"
  },
  {
    id: 9,
    category: { en: "Fantasy & Sci-Fi", ar: "الخيال والعلوم الغامضة" },
    title: { en: "Harry Potter and the Chamber of Secrets", ar: "هاري بوتر وحجرة الأسرار" },
    author: { en: "J.K. Rowling", ar: "ج. ك. رولينغ" },
    cover: "image/Harry Potter and the Chamber of Secrets.png"
  },
  {
    id: 10,
    category: { en: "Fantasy & Sci-Fi", ar: "الخيال والعلوم الغامضة" },
    title: { en: "Harry Potter and the Prisoner of Azkaban", ar: "هاري بوتر وسجين أزكابان" },
    author: { en: "J.K. Rowling", ar: "ج. ك. رولينغ" },
    cover: "image/Harry Potter and the Prisoner of Azkaban.jpeg"
  },
  {
    id: 11,
    category: { en: "Fantasy & Sci-Fi", ar: "الخيال والعلوم الغامضة" },
    title: { en: "Harry Potter and the Goblet of Fire", ar: "هاري بوتر وكأس النار" },
    author: { en: "J.K. Rowling", ar: "ج. ك. رولينغ" },
    cover: "image/Harry Potter and the Goblet of Fire.webp"
  },
  {
    id: 12,
    category: { en: "Fantasy & Sci-Fi", ar: "الخيال والعلوم الغامضة" },
    title: { en: "Harry Potter and the Order of the Phoenix", ar: "هاري بوتر وجماعة العنقاء" },
    author: { en: "J.K. Rowling", ar: "ج. ك. رولينغ" },
    cover: "image/Harry Potter and the Order of the Phoenix.png"
  },
  {
    id: 13,
    category: { en: "Fantasy & Sci-Fi", ar: "الخيال والعلوم الغامضة" },
    title: { en: "Harry Potter and the Half-Blood Prince", ar: "هاري بوتر والأمير الهجين" },
    author: { en: "J.K. Rowling", ar: "ج. ك. رولينغ" },
    cover: "image/Harry Potter and the Half-Blood Prince.png"
  },
  {
    id: 14,
    category: { en: "Fantasy & Sci-Fi", ar: "الخيال والعلوم الغامضة" },
    title: { en: "Harry Potter and the Deathly Hallows", ar: "هاري بوتر ومقدسات الموت" },
    author: { en: "J.K. Rowling", ar: "ج. ك. رولينغ" },
    cover: "image/Harry Potter and the Deathly Hallows.png"
  },
  {
    id: 15,
    category: { en: "Fantasy & Sci-Fi", ar: "الخيال والعلوم الغامضة" },
    title: { en: "The Hobbit", ar: "الهوبيت" },
    author: { en: "J.R.R. Tolkien", ar: "ج. ر. ر. تولكين" },
    cover: "image/The Hobbit.png"
  },
  {
    id: 16,
    category: { en: "Fantasy & Sci-Fi", ar: "الخيال والعلوم الغامضة" },
    title: { en: "The Lord of the Rings", ar: "سيد الخواتم" },
    author: { en: "J.R.R. Tolkien", ar: "ج. ر. ر. تولكين" },
    cover: "image/The Lord of the Rings.png"
  },
  {
    id: 17,
    category: { en: "Fantasy & Sci-Fi", ar: "الخيال والعلوم الغامضة" },
    title: { en: "Dune", ar: "كثيب" },
    author: { en: "Frank Herbert", ar: "فرانك هيربرت" },
    cover: "image/Dune.png"
  },

  // 🎬 قسم 3: Movies & Art
  {
    id: 18,
    category: { en: "Movies & Art", ar: "السينما والفن" },
    title: { en: "The Art of Pixar", ar: "فن بيكسار" },
    author: { en: "Amid Amidi", ar: "أميد أميدي" },
    cover: "image/The Art of Pixar.webp"
  },
  {
    id: 19,
    category: { en: "Movies & Art", ar: "السينما والفن" },
    title: { en: "Cinematic Storytelling", ar: "السرد السينمائي" },
    author: { en: "Jennifer Van Sijll", ar: "جينيفر فان سيجل" },
    cover: "image/Cinematic Storytelling.webp"
  },
  {
    id: 20,
    category: { en: "Movies & Art", ar: "السينما والفن" },
    title: { en: "The Art of Star Wars", ar: "فن حرب النجوم" },
    author: { en: "Phil Szostak", ar: "فيل سزوستاك" },
    cover: "image/The Art of Star Wars.png"
  },
  {
    id: 21,
    category: { en: "Movies & Art", ar: "السينما والفن" },
    title: { en: "The Story of Film", ar: "قصة السينما" },
    author: { en: "Mark Cousins", ar: "مارك كوزينز" },
    cover: "image/The Story of Film.png"
  },
  {
    id: 22,
    category: { en: "Movies & Art", ar: "السينما والفن" },
    title: { en: "ِArt of iron man", ar: "  فن آيرون مان" },
    author: { en: "John Rhett Thomas", ar: "جون ريت توماس" },
    cover: "image/Art of iron man.webp"
  },
  {
    id: 23,
    category: { en: "Movies & Art", ar: "السينما والفن" },
    title: { en: "The Art of Captain America", ar: "فن كابتن أمريكا" },
    author: { en: "Matthew K. Manning", ar: "ماثيو كيه. مانينغ" },
    cover: "image/The Art of Captain America.webp"
  },
  {
    id: 24,
    category: { en: "Movies & Art", ar: "السينما والفن" },
    title: { en: "The Art of Thor", ar: "فن ثور" },
    author: { en: "Matthew K. Manning", ar: "ماثيو كيه. مانينغ" },
    cover: "image/The Art of Thor.webp"
  },
  {
    id: 25,
    category: { en: "Movies & Art", ar: "السينما والفن" },
    title: { en: "The Art of The Avengers", ar: "فن المنتقمون" },
    author: { en: "John Rhett Thomas", ar: "جون ريت توماس" },
    cover: "image/The Art of The Avengers.webp"
  }
];
