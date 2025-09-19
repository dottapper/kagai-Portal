// Language Switcher JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const langSwitcher = document.getElementById('langSwitcher');
    const langCurrent = langSwitcher?.querySelector('.lang-current');
    const langMenu = langSwitcher?.querySelector('.lang-menu');
    const langOptions = langSwitcher?.querySelectorAll('.lang-option');
    
    if (!langSwitcher || !langCurrent || !langMenu) return;

    // Language data
    const languages = {
        ja: { flag: '🇯🇵', name: '日本語' },
        en: { flag: '🇺🇸', name: 'English' },
        zh: { flag: '🇨🇳', name: '中文' },
        ko: { flag: '🇰🇷', name: '한국어' }
    };

    // Get current language from localStorage or default to 'ja'
    let currentLang = localStorage.getItem('selectedLanguage') || 'ja';

    // Initialize current language display
    function updateCurrentLanguage(lang) {
        const langData = languages[lang];
        if (langData) {
            const flagSpan = langCurrent.querySelector('.lang-flag');
            const nameSpan = langCurrent.querySelector('.lang-name');
            
            if (flagSpan) flagSpan.textContent = langData.flag;
            if (nameSpan) nameSpan.textContent = langData.name;
            
            // Update active state in menu
            langOptions.forEach(option => {
                option.classList.toggle('active', option.dataset.lang === lang);
            });
        }
    }

    // Toggle menu visibility
    function toggleMenu(show = null) {
        const isActive = show !== null ? show : !langSwitcher.classList.contains('active');
        langSwitcher.classList.toggle('active', isActive);
        langCurrent.setAttribute('aria-expanded', isActive.toString());
    }

    // Close menu when clicking outside
    function closeMenuOnClickOutside(event) {
        if (!langSwitcher.contains(event.target)) {
            toggleMenu(false);
        }
    }

    // Handle language selection
    function selectLanguage(lang, event) {
        event?.preventDefault();
        
        if (lang === currentLang) {
            toggleMenu(false);
            return;
        }

        currentLang = lang;
        localStorage.setItem('selectedLanguage', lang);
        updateCurrentLanguage(lang);
        toggleMenu(false);
        
        // Apply language to page content
        applyLanguage(lang);
        
        // Dispatch custom event for other components to listen to
        document.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: lang } 
        }));
    }

    // Apply language to page content
    function applyLanguage(lang) {
        // Hide all language content
        const allLangContent = document.querySelectorAll('[data-lang]');
        allLangContent.forEach(element => {
            element.style.display = 'none';
        });

        // Show content for selected language
        const selectedLangContent = document.querySelectorAll(`[data-lang="${lang}"]`);
        selectedLangContent.forEach(element => {
            element.style.display = '';
        });

        // If no content exists for selected language, show default (Japanese)
        if (selectedLangContent.length === 0 && lang !== 'ja') {
            const defaultContent = document.querySelectorAll('[data-lang="ja"]');
            defaultContent.forEach(element => {
                element.style.display = '';
            });
        }

        // Update page language attribute
        document.documentElement.lang = lang;
        
        // Show language notice for non-Japanese languages
        showLanguageNotice(lang);
    }

    // Show notice for machine translation
    function showLanguageNotice(lang) {
        // Remove existing notice
        const existingNotice = document.querySelector('.lang-notice');
        if (existingNotice) {
            existingNotice.remove();
        }

        // Show notice for non-Japanese languages
        if (lang !== 'ja') {
            const notice = document.createElement('div');
            notice.className = 'lang-notice';
            notice.innerHTML = `
                <div class="container">
                    <p>
                        <span data-lang="en" style="display: ${lang === 'en' ? 'inline' : 'none'}">
                            🌐 This page is automatically translated. Some cultural terms may not be accurately represented.
                        </span>
                        <span data-lang="zh" style="display: ${lang === 'zh' ? 'inline' : 'none'}">
                            🌐 此页面为自动翻译。某些文化术语可能无法准确表达。
                        </span>
                        <span data-lang="ko" style="display: ${lang === 'ko' ? 'inline' : 'none'}">
                            🌐 이 페이지는 자동 번역되었습니다. 일부 문화 용어가 정확하게 표현되지 않을 수 있습니다.
                        </span>
                        <button class="lang-notice-close" aria-label="Close notice">×</button>
                    </p>
                </div>
            `;
            
            // Add styles
            notice.style.cssText = `
                background: rgba(212, 176, 114, 0.1);
                border-bottom: 1px solid rgba(212, 176, 114, 0.2);
                padding: var(--s-3) 0;
                font-size: 0.9rem;
                color: var(--text-dim);
                position: relative;
                z-index: 999;
            `;
            
            // Insert after header
            const header = document.querySelector('.site-header');
            if (header) {
                header.insertAdjacentElement('afterend', notice);
                
                // Add close functionality
                const closeBtn = notice.querySelector('.lang-notice-close');
                if (closeBtn) {
                    closeBtn.style.cssText = `
                        background: none;
                        border: none;
                        color: var(--text-dim);
                        cursor: pointer;
                        font-size: 1.2rem;
                        margin-left: var(--s-2);
                        padding: 0;
                    `;
                    closeBtn.addEventListener('click', () => notice.remove());
                }
            }
        }
    }

    // Event listeners
    langCurrent.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu();
    });

    // Handle option clicks
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            selectLanguage(option.dataset.lang, e);
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', closeMenuOnClickOutside);

    // Keyboard navigation
    langSwitcher.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleMenu(false);
            langCurrent.focus();
        }
    });

    // Initialize
    updateCurrentLanguage(currentLang);
    applyLanguage(currentLang);

    // Google Translate integration (fallback)
    window.googleTranslateElementInit = function() {
        // This can be implemented later for fallback translation
    };
});
