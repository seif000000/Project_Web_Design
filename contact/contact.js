        const THEME_KEY = 'contactAppTheme';
        const LANG_KEY = 'contactAppLang';

        const translations = {
            en: {
                pageTitle: "Contact Us",
                pageContentTitle: "We'd love to hear from you.",
                siteName: "Book Worms",
                navContact: "Contact Us",
                navAbout: "About Us",
                navEditors: "Editors' Picks",
                navBestsellers: "Bestsellers",
                navNewArrivals: "New Arrivals",
                navAllBooks: "All Books",
                formTitle: "Send a Message",
                labelName: "Full Name",
                labelEmail: "Email Address",
                labelMessage: "Your Message",
                submitButton: "Send Message",
                infoTitle: "Contact Information",
                infoEmailLabel: "General Inquiries",
                infoPhoneLabel: "Customer Support",
                infoAddressLabel: "Headquarters",
                
                footerQuickLinksTitle: "Quick Links",
                navOffers: "Offers",
                footerDiscoverTitle: "Discover",
                navDiscounts: "Discounts",
                navBest2022: "Best of 2022",
                navFeatured: "Featured",
                footerHelpTitle: "Help",
                helpTrackOrder: "Track Order",
                helpShippingReturns: "Shipping & Returns",
                helpFAQ: "FAQ",
                helpCommunity: "Community",
                footerCopyright: "Copyright © 2025 Book Worms | Developed by Book Worms",
            },
            ar: {
                pageTitle: "تواصل معنا",
                pageContentTitle: "يسعدنا أن نسمع منك.",
                navContact: "اتصل بنا",
                navAbout: "من نحن",
                navEditors: "اختيار المحررين",
                navBestsellers: "الأكثر مبيعاً",
                navNewArrivals: "وصل حديثاً",
                navAllBooks: "جميع الكتب",
                formTitle: "أرسل رسالة",
                labelName: "الاسم بالكامل",
                labelEmail: "البريد الإلكتروني",
                labelMessage: "رسالتك",
                submitButton: "إرسال الرسالة",
                infoTitle: "معلومات الاتصال",
                infoEmailLabel: "للاستفسارات العامة",
                infoPhoneLabel: "دعم العملاء",
                infoAddressLabel: "المكتب الرئيسي",
                
                footerQuickLinksTitle: "روابط سريعة",
                navOffers: "العروض",
                footerDiscoverTitle: "استكشف",
                navDiscounts: "التخفيضات",
                navBest2022: "الأفضل 2022",
                navFeatured: "المميزة",
                footerHelpTitle: "المساعدة",
                helpTrackOrder: "تتبع الطلب",
                helpShippingReturns: "التوصيل والإرجاع",
                helpFAQ: "الأسئلة الشائعة",
                helpCommunity: "المجتمع",
                footerCopyright: "Book Warms حقوق النشر © 2025 Book Warms | تم التطوير بواسطة ",
            }
        };

        let currentLang = localStorage.getItem(LANG_KEY) || 'en';
        
        function applyTheme(isDark) {
            const root = document.documentElement;
            const moonIcon = document.getElementById('moon-icon');
            const sunIcon = document.getElementById('sun-icon');

            if (isDark) {
                root.classList.add('dark-mode');
                moonIcon.style.display = 'block';
                sunIcon.style.display = 'none';
                localStorage.setItem(THEME_KEY, 'dark');
            } else {
                root.classList.remove('dark-mode');
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'block';
                localStorage.setItem(THEME_KEY, 'light');
            }
        }

        function setupThemeToggle() {
            const toggleButton = document.getElementById('theme-toggle');
            const storedTheme = localStorage.getItem(THEME_KEY);
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            const initialDark = storedTheme === 'dark' || (storedTheme === null && prefersDark);
            applyTheme(initialDark);

            toggleButton.addEventListener('click', () => {
                const isCurrentlyDark = document.documentElement.classList.contains('dark-mode');
                applyTheme(!isCurrentlyDark); 
            });
        }

        function updateLanguage(lang) {
            currentLang = lang;
            localStorage.setItem(LANG_KEY, lang);
            const translation = translations[lang];
            const langToggleBtn = document.getElementById('language-toggle-btn');

            document.querySelectorAll('[data-key]').forEach(element => {
                const key = element.getAttribute('data-key');
                if (translation[key]) {
                    element.textContent = translation[key];
                }
            });

            document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
            
            if (lang === 'ar') {
                langToggleBtn.textContent = 'EN';
                langToggleBtn.setAttribute('data-lang', 'en');
            } else {
                langToggleBtn.textContent = 'AR';
                langToggleBtn.setAttribute('data-lang', 'ar');
            }
        }

        function setupLanguageToggle() {
            const langToggleBtn = document.getElementById('language-toggle-btn');
            
            langToggleBtn.addEventListener('click', (event) => {
                const nextLang = event.target.getAttribute('data-lang');
                updateLanguage(nextLang);
            });
            
            updateLanguage(currentLang);
        }

        function setupFormSubmission() {
            document.getElementById('contact-form').addEventListener('submit', function(event) {
                event.preventDefault();
                
                const form = event.target;
                
                const submitButton = form.querySelector('.btn');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.textContent = currentLang === 'ar' ? 'تم الإرسال بنجاح!' : 'Sent Successfully!';

                setTimeout(() => {
                    const finalOriginalText = translations[currentLang].submitButton;
                    submitButton.textContent = finalOriginalText;
                    submitButton.disabled = false;
                    form.reset(); 
                }, 3000);
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            setupThemeToggle();
            setupLanguageToggle();
            setupFormSubmission();
        });
        
        function homepage() {
            window.location.href = '../index.html';
        }
