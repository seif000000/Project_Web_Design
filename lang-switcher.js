// lang-switcher.js
(() => {
  const DEFAULT_LANG = 'en';
  const LANG_KEY = 'site_lang';
  const LANG_FOLDER = './locales/'; 
  const LANG_FILE_EXT = '.json';

  function getStoredLang() {
    const lang = localStorage.getItem(LANG_KEY);
    return lang ? lang : DEFAULT_LANG;
  }

  function storeLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
  }

  async function loadLangJson(lang) {
    const path = `${LANG_FOLDER}${lang}${LANG_FILE_EXT}`;
    try {
      const resp = await fetch(path);
      if (!resp.ok) {
        console.warn(`Translation file not found: ${path}`);
        if (lang !== DEFAULT_LANG) {
          return loadLangJson(DEFAULT_LANG);
        }
        return {};
      }
      const json = await resp.json();
      return json;
    } catch (err) {
      console.error('Error loading translation JSON:', err);
      if (lang !== DEFAULT_LANG) {
        return loadLangJson(DEFAULT_LANG);
      }
      return {};
    }
  }

  function getTranslationByKey(obj, keyPath) {
    return keyPath.split('.').reduce((o, k) => (o && k in o ? o[k] : null), obj);
  }

  function applyTranslations(translations) {
    const els = document.querySelectorAll('[data-i18n]');
    els.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = getTranslationByKey(translations, key);
      if (text !== null && text !== undefined) {
        el.textContent = text;
      }
    });

   
    const curr = getStoredLang();
    if (curr === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }

  async function changeLanguage(lang) {
    const translations = await loadLangJson(lang);
    applyTranslations(translations);
    storeLang(lang);
  }

  function setupLangSwitchers() {
    const btns = document.querySelectorAll('.lang-switch');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const newLang = btn.getAttribute('data-lang');
        changeLanguage(newLang);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const lang = getStoredLang();
    await changeLanguage(lang);
    setupLangSwitchers();
  });
})();
