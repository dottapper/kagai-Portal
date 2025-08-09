// Overseas Page JavaScript - Bilingual functionality
document.addEventListener('DOMContentLoaded', function() {
    initLanguageToggle();
    initFAQ();
    initContentAnimations();
    initAccessibilityFeatures();
    initLanguagePreference();
    initPerformanceMonitoring();
});

// Language toggle functionality
function initLanguageToggle() {
    const langButtons = document.querySelectorAll('.lang-button');
    const jaElements = document.querySelectorAll('[class*="-ja"], .content-ja');
    const enElements = document.querySelectorAll('[class*="-en"], .content-en');
    
    let currentLanguage = 'ja'; // Default language
    
    // Initialize from localStorage or browser language
    const savedLanguage = localStorage.getItem('overseas-language');
    const browserLanguage = navigator.language.startsWith('ja') ? 'ja' : 'en';
    currentLanguage = savedLanguage || browserLanguage;
    
    // Set initial language
    switchLanguage(currentLanguage);
    
    // Language button click handlers
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetLanguage = this.dataset.lang;
            switchLanguage(targetLanguage);
            
            // Announce language change for screen readers
            announceLanguageChange(targetLanguage);
        });
        
        // Keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    function switchLanguage(language) {
        // Update button states
        langButtons.forEach(button => {
            button.classList.remove('active');
            button.setAttribute('aria-pressed', 'false');
        });
        
        const activeButton = document.querySelector(`[data-lang="${language}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
            activeButton.setAttribute('aria-pressed', 'true');
        }
        
        // Animate language switch
        const elementsToHide = language === 'ja' ? enElements : jaElements;
        const elementsToShow = language === 'ja' ? jaElements : enElements;
        
        // Fade out current language
        elementsToHide.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    element.style.display = 'none';
                    
                    // After hiding, show new language
                    const correspondingElement = elementsToShow[index];
                    if (correspondingElement) {
                        correspondingElement.style.display = '';
                        correspondingElement.style.opacity = '0';
                        correspondingElement.style.transform = 'translateY(10px)';
                        
                        // Trigger reflow
                        correspondingElement.offsetHeight;
                        
                        correspondingElement.style.transition = 'opacity 300ms ease-out, transform 300ms ease-out';
                        correspondingElement.style.opacity = '1';
                        correspondingElement.style.transform = 'translateY(0)';
                    }
                }, 150);
            }, index * 20);
        });
        
        // Update current language
        currentLanguage = language;
        
        // Save preference
        localStorage.setItem('overseas-language', language);
        
        // Update document language attribute
        document.documentElement.lang = language;
        
        // Update page title
        updatePageTitle(language);
        
        // Update meta description
        updateMetaDescription(language);
    }
    
    function announceLanguageChange(language) {
        const languageNames = {
            'ja': '日本語',
            'en': 'English'
        };
        
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.textContent = `Language switched to ${languageNames[language]}`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    function updatePageTitle(language) {
        const titles = {
            'ja': 'For International Visitors - 海外の方へ | 全国花街ポータルサイト',
            'en': 'For International Visitors - Experience Japan\'s Kagai Culture'
        };
        
        document.title = titles[language];
    }
    
    function updateMetaDescription(language) {
        const descriptions = {
            'ja': '海外からお越しの皆様に、花街・芸者文化の美しい世界をご案内します。英語対応可能なガイドと詳細な文化説明、予約方法をご紹介。',
            'en': 'Experience the beauty of Japan\'s Kagai culture. Comprehensive guide for international visitors with cultural explanations, etiquette, and booking information.'
        };
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', descriptions[language]);
        }
    }
    
    // Expose function for external use
    window.switchLanguage = switchLanguage;
    window.getCurrentLanguage = () => currentLanguage;
}

// FAQ functionality with bilingual support
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.style.maxHeight = '0';
                }
            });
            
            // Toggle current item
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0';
            } else {
                this.setAttribute('aria-expanded', 'true');
                
                // Calculate height including both languages
                const tempDiv = answer.cloneNode(true);
                tempDiv.style.position = 'absolute';
                tempDiv.style.visibility = 'hidden';
                tempDiv.style.maxHeight = 'none';
                tempDiv.style.height = 'auto';
                
                // Show all content temporarily to measure
                const allContent = tempDiv.querySelectorAll('[style*="display: none"]');
                allContent.forEach(el => el.style.display = '');
                
                document.body.appendChild(tempDiv);
                const fullHeight = tempDiv.scrollHeight;
                document.body.removeChild(tempDiv);
                
                answer.style.maxHeight = fullHeight + 'px';
                
                // Smooth scroll to question if needed
                setTimeout(() => {
                    const rect = question.getBoundingClientRect();
                    if (rect.top < 100) {
                        question.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 300);
            }
        });
        
        // Keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Content animations with intersection observer
function initContentAnimations() {
    const animateElements = document.querySelectorAll(
        '.guide-item, .etiquette-item, .tip-item, .option-item, .step-item, .contact-item'
    );
    
    // Set initial styles
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        el.style.transitionDelay = `${(index % 6) * 0.1}s`;
    });
    
    // Create intersection observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Accessibility enhancements
function initAccessibilityFeatures() {
    // Add ARIA labels and descriptions
    const langButtons = document.querySelectorAll('.lang-button');
    langButtons.forEach(button => {
        button.setAttribute('role', 'switch');
        button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
        
        const lang = button.dataset.lang;
        const languageNames = {
            'ja': '日本語に切り替え',
            'en': 'Switch to English'
        };
        button.setAttribute('aria-label', languageNames[lang]);
    });
    
    // Add skip links for different sections
    addSkipLinks();
    
    // Enhance focus management
    enhanceFocusManagement();
    
    // Add language indicator for screen readers
    addLanguageIndicators();
}

// Add skip links for better navigation
function addSkipLinks() {
    const skipLinksContainer = document.createElement('nav');
    skipLinksContainer.className = 'overseas-skip-links';
    skipLinksContainer.setAttribute('aria-label', 'ページ内ナビゲーション');
    skipLinksContainer.style.cssText = `
        position: absolute;
        top: -100px;
        left: 10px;
        z-index: 2000;
        background: var(--primary-color);
        padding: 10px;
        border-radius: 5px;
        transition: top 0.3s;
    `;
    
    const skipLinksList = document.createElement('ul');
    skipLinksList.style.cssText = `
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    `;
    
    const sections = [
        { id: 'introduction', nameJa: '花街文化とは', nameEn: 'About Kagai' },
        { id: 'cultural-guide', nameJa: '文化ガイド', nameEn: 'Cultural Guide' },
        { id: 'etiquette-guide', nameJa: 'マナーガイド', nameEn: 'Etiquette Guide' },
        { id: 'booking-guide', nameJa: '予約ガイド', nameEn: 'Booking Guide' },
        { id: 'faq-section', nameJa: 'よくある質問', nameEn: 'FAQ' },
        { id: 'contact-info', nameJa: 'お問い合わせ', nameEn: 'Contact' }
    ];
    
    sections.forEach(section => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${section.id}`;
        link.textContent = `${section.nameJa}/${section.nameEn}へ`;
        link.style.cssText = `
            color: white;
            text-decoration: none;
            padding: 5px 10px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            font-size: 12px;
            white-space: nowrap;
        `;
        
        link.addEventListener('focus', function() {
            skipLinksContainer.style.top = '90px';
        });
        
        link.addEventListener('blur', function() {
            setTimeout(() => {
                if (!skipLinksContainer.contains(document.activeElement)) {
                    skipLinksContainer.style.top = '-100px';
                }
            }, 100);
        });
        
        li.appendChild(link);
        skipLinksList.appendChild(li);
    });
    
    skipLinksContainer.appendChild(skipLinksList);
    document.body.insertBefore(skipLinksContainer, document.body.firstChild);
}

// Enhanced focus management
function enhanceFocusManagement() {
    // Language button focus handling
    const langButtons = document.querySelectorAll('.lang-button');
    langButtons.forEach(button => {
        button.addEventListener('focus', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('blur', function() {
            this.style.transform = '';
        });
    });
    
    // Interactive elements focus handling
    const interactiveElements = document.querySelectorAll(
        '.guide-item, .etiquette-item, .tip-item, .option-item, .step-item'
    );
    
    interactiveElements.forEach(element => {
        // Make elements focusable
        if (!element.getAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        
        // Add focus styles
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--accent-color)';
            this.style.outlineOffset = '2px';
            this.style.transform = 'scale(1.02)';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
            this.style.transform = '';
        });
    });
}

// Add language indicators for screen readers
function addLanguageIndicators() {
    const jaElements = document.querySelectorAll('.content-ja');
    const enElements = document.querySelectorAll('.content-en');
    
    jaElements.forEach(element => {
        element.setAttribute('lang', 'ja');
    });
    
    enElements.forEach(element => {
        element.setAttribute('lang', 'en');
    });
}

// Language preference initialization
function initLanguagePreference() {
    // Detect user's preferred language from various sources
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    const storedLang = localStorage.getItem('overseas-language');
    const browserLang = navigator.language.startsWith('ja') ? 'ja' : 'en';
    
    // Priority: URL parameter > stored preference > browser language
    const preferredLang = urlLang || storedLang || browserLang;
    
    // Apply the preferred language if it's different from default
    if (preferredLang === 'en' && window.getCurrentLanguage && window.getCurrentLanguage() === 'ja') {
        setTimeout(() => {
            window.switchLanguage('en');
        }, 100);
    }
    
    // Update URL without refreshing page
    if (urlLang) {
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('lang');
        window.history.replaceState({}, document.title, newUrl);
    }
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor language switch performance
    let languageSwitchStartTime;
    
    document.querySelectorAll('.lang-button').forEach(button => {
        button.addEventListener('click', function() {
            languageSwitchStartTime = performance.now();
        });
    });
    
    // Monitor when content becomes visible after language switch
    const performanceObserver = new MutationObserver(function(mutations) {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'style' && 
                languageSwitchStartTime) {
                const switchDuration = performance.now() - languageSwitchStartTime;
                if (switchDuration > 500) {
                    console.warn(`Slow language switch detected: ${switchDuration}ms`);
                }
                languageSwitchStartTime = null;
            }
        });
    });
    
    // Observe style changes on bilingual content
    document.querySelectorAll('.content-ja, .content-en').forEach(element => {
        performanceObserver.observe(element, {
            attributes: true,
            attributeFilter: ['style']
        });
    });
    
    // Memory monitoring
    if ('memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                console.warn('High memory usage detected on overseas page');
            }
        }, 30000);
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scrolling enhancement
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const langToggleHeight = document.querySelector('.language-toggle').offsetHeight;
                const offsetPosition = target.getBoundingClientRect().top + 
                                     window.pageYOffset - headerHeight - langToggleHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize smooth scrolling
initSmoothScrolling();

// Print functionality
function initPrintSupport() {
    // Add print styles
    const printStyles = document.createElement('style');
    printStyles.textContent = `
        @media print {
            .language-toggle,
            .overseas-cta,
            .footer,
            .header {
                display: none !important;
            }
            
            .content-en {
                display: block !important;
                margin-top: 0.5rem;
                font-size: 0.9em;
                color: #666 !important;
                font-style: italic;
            }
            
            .bilingual-content {
                page-break-inside: avoid;
            }
            
            .guide-item, .etiquette-item, .tip-item {
                page-break-inside: avoid;
                margin-bottom: 1rem;
            }
        }
    `;
    document.head.appendChild(printStyles);
    
    // Add print button
    const printButton = document.createElement('button');
    printButton.innerHTML = `
        <span class="print-ja">印刷用ページ</span>
        <span class="print-en" style="display: none;">Print Page</span>
    `;
    printButton.className = 'print-button';
    printButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        z-index: 1000;
        font-family: 'Noto Serif JP', serif;
    `;
    
    printButton.addEventListener('click', function() {
        // Before printing, ensure both languages are visible
        const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'ja';
        
        // Temporarily show all content for printing
        const hiddenElements = document.querySelectorAll('[style*="display: none"]');
        const originalDisplay = [];
        
        hiddenElements.forEach((el, index) => {
            originalDisplay[index] = el.style.display;
            el.style.display = '';
        });
        
        window.print();
        
        // Restore original display states
        setTimeout(() => {
            hiddenElements.forEach((el, index) => {
                el.style.display = originalDisplay[index];
            });
        }, 1000);
    });
    
    printButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    printButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Hide on mobile devices
    if (window.innerWidth > 768) {
        document.body.appendChild(printButton);
        
        // Update print button text based on language
        const observer = new MutationObserver(() => {
            const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'ja';
            const jaText = printButton.querySelector('.print-ja');
            const enText = printButton.querySelector('.print-en');
            
            if (currentLang === 'en') {
                jaText.style.display = 'none';
                enText.style.display = '';
            } else {
                jaText.style.display = '';
                enText.style.display = 'none';
            }
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['lang']
        });
    }
}

// Initialize print support
initPrintSupport();

// Resize handler
const handleResize = debounce(function() {
    // Update print button visibility
    const printButton = document.querySelector('.print-button');
    if (printButton) {
        printButton.style.display = window.innerWidth > 768 ? 'block' : 'none';
    }
    
    // Recalculate FAQ heights on resize
    const openAnswers = document.querySelectorAll('.faq-answer[style*="max-height"]');
    openAnswers.forEach(answer => {
        if (answer.style.maxHeight !== '0px') {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
}, 250);

window.addEventListener('resize', handleResize);

// Page visibility change handler
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        console.log('Overseas page is now visible');
        
        // Re-trigger animations for visible elements
        const visibleElements = document.querySelectorAll('[style*="opacity: 1"]');
        visibleElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Overseas page error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error ? e.error.stack : 'No stack trace available'
    });
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection on overseas page:', e.reason);
});

// Language detection from browser settings
function detectOptimalLanguage() {
    const supportedLanguages = ['ja', 'en'];
    const browserLanguages = navigator.languages || [navigator.language || navigator.userLanguage];
    
    for (let browserLang of browserLanguages) {
        const langCode = browserLang.split('-')[0];
        if (supportedLanguages.includes(langCode)) {
            return langCode;
        }
    }
    
    return 'ja'; // Default fallback
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initLanguageToggle,
        initFAQ,
        initContentAnimations,
        initAccessibilityFeatures,
        detectOptimalLanguage
    };
}