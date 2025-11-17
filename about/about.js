
document.addEventListener('DOMContentLoaded', () => {
    let currentLang = 'ar';
    let translations = {};

    async function loadTranslations() {
        try {
            const response = await fetch('../translations.json');
            translations = await response.json();
            loadContent(currentLang);
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    function loadContent(lang) {
        const data = translations[lang];
        if (!data) return;

        document.getElementById('logoText').textContent = data.logoText;
        document.getElementById('langBtn').textContent = data.langBtn;
        document.getElementById('heroTitle').textContent = data.heroTitle;
        document.getElementById('heroDesc').textContent = data.heroDesc;
        document.getElementById('storyTitle').textContent = data.storyTitle;
        document.getElementById('storyP1').textContent = data.storyP1;
        document.getElementById('storyP2').textContent = data.storyP2;
        document.getElementById('storyP3').textContent = data.storyP3;
        document.getElementById('teamTitle').textContent = data.teamTitle;
        document.getElementById('teamSubtitle').textContent = data.teamSubtitle;
        document.getElementById('valuesTitle').textContent = data.valuesTitle;

        // ⚡ هنا مهم نتأكد إن العنصر موجود قبل تعديل innerHTML
        const footerEl = document.getElementById('footerText');
        if (footerEl) footerEl.innerHTML = data.footerText;

        // Load team members
        const teamGrid = document.getElementById('teamGrid');
        if (teamGrid) {
            teamGrid.innerHTML = '';
            data.team.forEach(member => {
                teamGrid.innerHTML += `
                    <div class="team-card">
                        <div class="team-image">
                            <img src="${member.image}" alt="${member.name}">
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
        if (valuesGrid) {
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

        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    }

    function toggleLanguage() {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        loadContent(currentLang);
    }

    loadTranslations();
});
