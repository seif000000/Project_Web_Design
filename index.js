// Placeholder for CoursesData (replace with actual data or fetch from JSON)
const CoursesData = {
  Courses: {
    Marketing: [
      {
        title: 'Digital Marketing 101',
        CourseImage: '/Images/course-01.jpg',
        lessons: 10,
        level: 'Beginner',
        rating: 4.5,
        reviews: 120,
        InstructorImage: '/Images/instructor-01.jpg',
        instructor: 'John Doe',
        price: 49,
        enrollLink: 'Enroll Now',
      },
      {
        title: 'Advanced Marketing Strategies',
        CourseImage: '/Images/course-02.jpg',
        lessons: 15,
        level: 'Advanced',
        rating: 4.8,
        reviews: 200,
        InstructorImage: '/Images/instructor-02.jpg',
        instructor: 'Jane Smith',
        price: 79,
        enrollLink: 'Enroll Now',
      },
    ],
    Development: [
      {
        title: 'Web Development Bootcamp',
        CourseImage: '/Images/course-03.jpg',
        lessons: 20,
        level: 'Intermediate',
        rating: 4.7,
        reviews: 150,
        InstructorImage: '/Images/instructor-03.jpg',
        instructor: 'Mike Johnson',
        price: 99,
        enrollLink: 'Enroll Now',
      },
    ],
  },
};

// Initialize Swiper
document.addEventListener('DOMContentLoaded', () => {
  new Swiper('.feature-wrapper', {
    slidesPerView: 3,
    spaceBetween: 20,
    loop: true,
    breakpoints: {
      1399: { slidesPerView: 3 },
      1199: { slidesPerView: 2.5 },
      767: { slidesPerView: 2 },
      0: { slidesPerView: 1 },
    },
  });
});

// Category Filter and Courses Rendering
const categories = ['All', ...Object.keys(CoursesData.Courses)];
let activeCategory = 'All';

function getCourses() {
  if (activeCategory === 'All') {
    return Object.keys(CoursesData.Courses).flatMap((cat) => {
      if (cat === 'Marketing') return CoursesData.Courses[cat].slice(0, 2);
      return CoursesData.Courses[cat].slice(0, 1);
    });
  }
  return CoursesData.Courses[activeCategory] || [];
}

function renderCategories() {
  const filterContainer = document.getElementById('category-filter');
  filterContainer.innerHTML = categories.map(category => `
    <button class="px-4 py-3 rounded-full text-sm font-medium transition cursor-pointer shadow-md ${activeCategory === category ? 'bg-blue-600 text-white active-category' : 'bg-[#f3f9ff] text-[#404a60]'}" onclick="setCategory('${category}')">
      ${category}
    </button>
  `).join('');
}

function renderCourses() {
  const courses = getCourses();
  const gridContainer = document.getElementById('courses-grid');
  if (courses.length > 0) {
    gridContainer.innerHTML = courses.map(course => `
      <div class="bg-white p-3 rounded-xl group hover:shadow-lg transition relative">
        <div class="h-[230px] rounded-xl overflow-hidden relative bg-gray-200">
          <div class="absolute inset-0 animate-pulse bg-gray-200"></div>
          <img src="${course.CourseImage}" alt="${course.title}" loading="lazy" class="relative z-10 group-hover:scale-110 transition duration-500 h-full w-full object-cover" onload="this.previousSibling.style.display='none'">
        </div>
        <div class="p-3">
          <h4 class="text-[#222e48] font-bold sm:text-xl hover:text-[#006dca] transition-colors duration-500">${course.title}</h4>
          <div class="flex justify-between items-center my-2">
            <span><i class="bi bi-camera-video pe-2"></i>${course.lessons} Lessons</span>
            <span><i class="bi bi-bar-chart pe-2"></i>${course.level}</span>
          </div>
          <div class="flex justify-between items-center my-2">
            <span><i class="bi bi-star-fill text-yellow-400 pe-2"></i>${course.rating} (${course.reviews})</span>
            <div class="flex items-center">
              <img src="${course.InstructorImage}" alt="${course.instructor}" class="rounded-full h-10 w-10 object-cover me-2">
              <span>${course.instructor}</span>
            </div>
          </div>
          <div class="border-t-2 border-dotted pt-5 flex justify-between items-center">
            <h4 class="text-[#f37739] text-2xl font-semibold">$${course.price}</h4>
            <button class="text-[#076dcd] hover:text-black font-medium cursor-pointer px-5 py-3 rounded-full w-fit text-sm transition-colors duration-300 custom-btn">
              ${course.enrollLink} <i class="bi bi-arrow-up-right ps-2"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } else {
    gridContainer.innerHTML = '<p class="col-span-full text-center text-gray-600">No course available</p>';
  }
}

function setCategory(category) {
  activeCategory = category;
  renderCategories();
  renderCourses();
}

// Initial render
renderCategories();
renderCourses();