
// document.addEventListener('DOMContentLoaded', () => {
//     let currentLang = 'ar';
//     let translations = {};

//     async function loadTranslations() {
//         try {
//             const response = await fetch('../translations.json');
//             translations = await response.json();
//             loadContent(currentLang);
//         } catch (error) {
//             console.error('Error loading translations:', error);
//         }
//     }

//     function loadContent(lang) {
//         const data = translations[lang];
//         if (!data) return;

//         document.getElementById('logoText').textContent = data.logoText;
//         document.getElementById('langBtn').textContent = data.langBtn;
//         document.getElementById('heroTitle').textContent = data.heroTitle;
//         document.getElementById('heroDesc').textContent = data.heroDesc;
//         document.getElementById('storyTitle').textContent = data.storyTitle;
//         document.getElementById('storyP1').textContent = data.storyP1;
//         document.getElementById('storyP2').textContent = data.storyP2;
//         document.getElementById('storyP3').textContent = data.storyP3;
//         document.getElementById('teamTitle').textContent = data.teamTitle;
//         document.getElementById('teamSubtitle').textContent = data.teamSubtitle;
//         document.getElementById('valuesTitle').textContent = data.valuesTitle;

//         // ⚡ هنا مهم نتأكد إن العنصر موجود قبل تعديل innerHTML
//         const footerEl = document.getElementById('footerText');
//         if (footerEl) footerEl.innerHTML = data.footerText;

//         // Load team members
//         const teamGrid = document.getElementById('teamGrid');
//         if (teamGrid) {
//             teamGrid.innerHTML = '';
//             data.team.forEach(member => {
//                 teamGrid.innerHTML += `
//                     <div class="team-card">
//                         <div class="team-image">
//                             <img src="${member.image}" alt="${member.name}">
//                             <div class="team-overlay">
//                                 <div class="social-links">
//                                     <a href="#" class="social-link">in</a>
//                                     <a href="#" class="social-link">tw</a>
//                                     <a href="#" class="social-link">fb</a>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="team-info">
//                             <h3>${member.name}</h3>
//                             <div class="role">${member.role}</div>
//                             <p>${member.desc}</p>
//                         </div>
//                     </div>
//                 `;
//             });
//         }

//         // Load values
//         const valuesGrid = document.getElementById('valuesGrid');
//         if (valuesGrid) {
//             valuesGrid.innerHTML = '';
//             data.values.forEach(value => {
//                 valuesGrid.innerHTML += `
//                     <div class="value-card">
//                         <div class="value-icon">${value.icon}</div>
//                         <h3>${value.title}</h3>
//                         <p>${value.desc}</p>
//                     </div>
//                 `;
//             });
//         }

//         document.documentElement.setAttribute('lang', lang);
//         document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
//     }

//     function toggleLanguage() {
//         currentLang = currentLang === 'ar' ? 'en' : 'ar';
//         loadContent(currentLang);
//     }

//     loadTranslations();
// });

document.addEventListener('DOMContentLoaded', () => {
    let currentLang = 'ar';
    let translations = {};

    async function loadTranslations() {
        try {
            const response = await fetch('../translations.json');
            translations = await response.json();
            
            // استرجاع اللغة المحفوظة
            const savedLang = localStorage.getItem('language');
            if (savedLang) {
                currentLang = savedLang;
            }
            
            loadContent(currentLang);
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    function loadContent(lang) {
        const data = translations[lang];
        if (!data) return;

        // تحديث اتجاه الصفحة
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        // تحديث المحتوى الخاص بصفحة About
        const elements = {
            'logoText': data.logoText,
            'langBtn': data.langBtn,
            'heroTitle': data.heroTitle,
            'heroDesc': data.heroDesc,
            'storyTitle': data.storyTitle,
            'storyP1': data.storyP1,
            'storyP2': data.storyP2,
            'storyP3': data.storyP3,
            'teamTitle': data.teamTitle,
            'teamSubtitle': data.teamSubtitle,
            'valuesTitle': data.valuesTitle
        };

        // تطبيق الترجمات على العناصر
        Object.keys(elements).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = elements[id];
        });

        // ✅ تحديث كل العناصر اللي عليها data-lang (للـ Footer)
        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            if (data[key]) {
                el.textContent = data[key];
            }
        });

        // Load team members
        const teamGrid = document.getElementById('teamGrid');
        if (teamGrid && data.team) {
            teamGrid.innerHTML = '';
            data.team.forEach(member => {
                // Fix image path - ensure it uses correct relative path
                let imagePath = member.image;
                // If it's already a relative path starting with ../image/, keep it
                // If it's a full URL, keep it
                // Otherwise, ensure it's ../image/filename
                if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('../')) {
                    // Extract filename if it's a full path
                    const filename = imagePath.split('/').pop();
                    imagePath = `../image/${filename}`;
                }
                
                teamGrid.innerHTML += `
                    <div class="team-card">
                        <div class="team-image">
                            <img src="${imagePath}" alt="${member.name}" onerror="this.src='../image/user_avatar.jpg'">
                            <div class="team-overlay">
                                <div class="social-links">
                                    <a href="#" class="social-link">in</a>
                                    <a href="#" class="social-link">tw</a>
                                    <a href="#" class="social-link">fb</a>
                                </div>
                            </div>
                        </div>
                        <div class="team-info">
                            <h3>${member.name}</h3>
                            <div class="role">${member.role}</div>
                            <p>${member.desc}</p>
                        </div>
                    </div>
                `;
            });
        }

        // Load values
        const valuesGrid = document.getElementById('valuesGrid');
        if (valuesGrid && data.values) {
            valuesGrid.innerHTML = '';
            data.values.forEach(value => {
                valuesGrid.innerHTML += `
                    <div class="value-card">
                        <div class="value-icon">${value.icon}</div>
                        <h3>${value.title}</h3>
                        <p>${value.desc}</p>
                    </div>
                `;
            });
        }
    }

    // ✅ تعريف الدالة عشان تكون متاحة للـ onclick في HTML
    window.toggleLanguage = function() {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        
        // حفظ اللغة في localStorage
        localStorage.setItem('language', currentLang);
        
        loadContent(currentLang);
    };

    loadTranslations();
});
function toggleDarkMode() {
    document.body.classList.toggle("dark");

    // حفظ الوضع في localStorage
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        document.getElementById("darkBtn").textContent = "☀️";
    } else {
        localStorage.setItem("theme", "light");
        document.getElementById("darkBtn").textContent = "🌙";
    }
}

// تشغيل الدارك مود تلقائياً لو محفوظ
window.onload = () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        document.getElementById("darkBtn").textContent = "☀️";
    }
};
