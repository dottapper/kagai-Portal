// Culture Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initTabNavigation();
    initContentAnimations();
    initImageLazyLoading();
    initAccessibilityFeatures();
    initIntersectionObserver();
    initPerformanceMonitoring();
});

// Tab navigation functionality
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const cultureSections = document.querySelectorAll('.culture-section');
    let activeTab = 'dance'; // Default active tab
    
    // Initialize first tab
    showTab(activeTab);
    
    // Tab click handlers
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            showTab(tabId);
            
            // Update URL hash
            history.replaceState(null, null, `#${tabId}`);
            
            // Announce tab change for screen readers
            announceTabChange(tabId);
        });
        
        // Keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateTabsWithKeyboard(e.key === 'ArrowRight');
            }
        });
    });
    
    // Initialize from URL hash
    const hash = window.location.hash.replace('#', '');
    if (hash && document.querySelector(`[data-tab="${hash}"]`)) {
        showTab(hash);
    }
    
    function showTab(tabId) {
        // Update tab buttons
        tabButtons.forEach(button => {
            button.classList.remove('active');
            button.setAttribute('aria-selected', 'false');
        });
        
        // Update sections
        cultureSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Activate selected tab and section
        const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
        const activeSection = document.querySelector(`#${tabId}`);
        
        if (activeButton && activeSection) {
            activeButton.classList.add('active');
            activeButton.setAttribute('aria-selected', 'true');
            activeSection.classList.add('active');
            activeTab = tabId;
            
            // Scroll to section smoothly
            setTimeout(() => {
                activeSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Re-trigger animations for newly visible content
                triggerSectionAnimations(activeSection);
            }, 100);
        }
    }
    
    function navigateTabsWithKeyboard(forward) {
        const currentIndex = Array.from(tabButtons).findIndex(btn => btn.classList.contains('active'));
        let nextIndex = forward ? currentIndex + 1 : currentIndex - 1;
        
        if (nextIndex >= tabButtons.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = tabButtons.length - 1;
        
        tabButtons[nextIndex].focus();
        tabButtons[nextIndex].click();
    }
    
    function announceTabChange(tabId) {
        const tabNames = {
            'dance': '日本舞踊',
            'music': '音楽',
            'tea': '茶道',
            'flower': '華道',
            'kimono': '着物・装身'
        };
        
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.textContent = `${tabNames[tabId]}タブが選択されました`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Content animations
function initContentAnimations() {
    const animationElements = document.querySelectorAll(
        '.technique-item, .philosophy-item, .school-item, .instrument-card, ' +
        '.principle-card, .style-item, .kimono-item, .accessory-category'
    );
    
    // Set initial styles
    animationElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        el.style.transitionDelay = `${(index % 8) * 0.1}s`;
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
    animationElements.forEach(el => {
        observer.observe(el);
    });
}

// Trigger animations for a specific section
function triggerSectionAnimations(section) {
    const elements = section.querySelectorAll(
        '.technique-item, .philosophy-item, .school-item, .instrument-card, ' +
        '.principle-card, .style-item, .kimono-item, .accessory-category'
    );
    
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Image lazy loading with intersection observer
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add loading class
                    img.classList.add('loading');
                    
                    img.addEventListener('load', function() {
                        img.classList.remove('loading');
                        img.classList.add('loaded');
                    });
                    
                    img.addEventListener('error', function() {
                        img.classList.remove('loading');
                        img.classList.add('error');
                        img.alt = '画像の読み込みに失敗しました';
                    });
                    
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Accessibility enhancements
function initAccessibilityFeatures() {
    // Add ARIA labels and roles
    const tabButtons = document.querySelectorAll('.tab-button');
    const cultureSections = document.querySelectorAll('.culture-section');
    
    // Set up tab panel relationships
    tabButtons.forEach(button => {
        const tabId = button.dataset.tab;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', tabId);
        button.setAttribute('id', `tab-${tabId}`);
        
        if (!button.classList.contains('active')) {
            button.setAttribute('aria-selected', 'false');
        }
    });
    
    cultureSections.forEach(section => {
        const tabId = section.dataset.tab;
        section.setAttribute('role', 'tabpanel');
        section.setAttribute('aria-labelledby', `tab-${tabId}`);
        
        if (!section.classList.contains('active')) {
            section.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Tab navigation container
    const navTabs = document.querySelector('.nav-tabs');
    if (navTabs) {
        navTabs.setAttribute('role', 'tablist');
        navTabs.setAttribute('aria-label', '文化コンテンツのタブ');
    }
    
    // Add skip links for each section
    addSkipLinks();
    
    // Enhanced keyboard navigation
    enhanceKeyboardNavigation();
    
    // Focus management for tab changes
    manageFocusForTabs();
}

// Add skip links for better navigation
function addSkipLinks() {
    const skipLinksContainer = document.createElement('nav');
    skipLinksContainer.className = 'culture-skip-links';
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
        { id: 'dance', name: '日本舞踊' },
        { id: 'music', name: '音楽' },
        { id: 'tea', name: '茶道' },
        { id: 'flower', name: '華道' },
        { id: 'kimono', name: '着物・装身' }
    ];
    
    sections.forEach(section => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${section.id}`;
        link.textContent = `${section.name}へ`;
        link.style.cssText = `
            color: white;
            text-decoration: none;
            padding: 5px 10px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            font-size: 14px;
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
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = document.querySelector(`[data-tab="${section.id}"]`);
            if (targetTab) {
                targetTab.click();
                setTimeout(() => {
                    targetTab.focus();
                }, 300);
            }
        });
        
        li.appendChild(link);
        skipLinksList.appendChild(li);
    });
    
    skipLinksContainer.appendChild(skipLinksList);
    document.body.insertBefore(skipLinksContainer, document.body.firstChild);
}

// Enhanced keyboard navigation
function enhanceKeyboardNavigation() {
    // Add tabindex to interactive elements that need focus
    const interactiveElements = document.querySelectorAll(
        '.technique-item, .philosophy-item, .school-item, .instrument-card, ' +
        '.principle-card, .style-item, '.kimono-item'
    );
    
    interactiveElements.forEach(element => {
        if (!element.getAttribute('tabindex') && !element.matches('button, a, input')) {
            element.setAttribute('tabindex', '0');
        }
        
        // Enhanced focus styles
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

// Focus management for tab changes
function manageFocusForTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // When a tab is activated, focus should remain on the tab button
            // This is handled automatically by the click event
            
            // Announce to screen readers that content has changed
            const section = document.querySelector(`#${this.dataset.tab}`);
            if (section) {
                const firstHeading = section.querySelector('h2, h3');
                if (firstHeading) {
                    // Temporarily make heading focusable and focus it
                    const originalTabIndex = firstHeading.getAttribute('tabindex');
                    firstHeading.setAttribute('tabindex', '-1');
                    setTimeout(() => {
                        firstHeading.focus();
                        if (originalTabIndex) {
                            firstHeading.setAttribute('tabindex', originalTabIndex);
                        } else {
                            firstHeading.removeAttribute('tabindex');
                        }
                    }, 300);
                }
            }
        });
    });
}

// Intersection observer for advanced animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: [0.1, 0.25, 0.5, 0.75],
        rootMargin: '0px 0px -100px 0px'
    };
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            const section = entry.target;
            const tabId = section.dataset.tab;
            const tabButton = document.querySelector(`[data-tab="${tabId}"]`);
            
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                // Update active tab based on scroll position
                if (!tabButton.classList.contains('active')) {
                    // Don't auto-switch tabs if user is actively clicking
                    if (!section.hasAttribute('data-user-selected')) {
                        // Optional: Auto-switch tabs based on scroll
                        // tabButton.click();
                    }
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.culture-section').forEach(section => {
        sectionObserver.observe(section);
    });
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor tab switching performance
    let tabSwitchStartTime;
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            tabSwitchStartTime = performance.now();
        });
    });
    
    // Monitor when content is visible
    const performanceObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && tabSwitchStartTime) {
                const switchDuration = performance.now() - tabSwitchStartTime;
                if (switchDuration > 100) {
                    console.warn(`Slow tab switch detected: ${switchDuration}ms`);
                }
                tabSwitchStartTime = null;
            }
        });
    });
    
    document.querySelectorAll('.culture-section').forEach(section => {
        performanceObserver.observe(section);
    });
    
    // Memory usage monitoring
    if ('memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                console.warn('High memory usage detected on culture page');
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
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
                const cultureNavHeight = document.querySelector('.culture-nav').offsetHeight;
                const offsetPosition = target.getBoundingClientRect().top + 
                                     window.pageYOffset - headerHeight - cultureNavHeight - 20;
                
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
    // Add print styles dynamically
    const printStyles = document.createElement('style');
    printStyles.textContent = `
        @media print {
            .culture-nav,
            .culture-cta,
            .footer,
            .header {
                display: none !important;
            }
            
            .culture-section {
                display: block !important;
                page-break-after: always;
            }
            
            .culture-section:last-child {
                page-break-after: auto;
            }
            
            .culture-content {
                grid-template-columns: 1fr !important;
            }
            
            .content-sidebar {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(printStyles);
    
    // Add print button
    const printButton = document.createElement('button');
    printButton.textContent = '印刷用ページ';
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
        window.print();
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
    
    // Reset any animations on resize
    const animatedElements = document.querySelectorAll('[style*="opacity"]');
    animatedElements.forEach(el => {
        if (el.style.opacity === '0') {
            // Re-trigger intersection observer check
            const event = new CustomEvent('resize-retrigger');
            el.dispatchEvent(event);
        }
    });
}, 250);

window.addEventListener('resize', handleResize);

// Page visibility change handler
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Page is visible again, check for any updates needed
        console.log('Culture page is now visible');
        
        // Re-trigger animations for visible elements
        const visibleSection = document.querySelector('.culture-section.active');
        if (visibleSection) {
            triggerSectionAnimations(visibleSection);
        }
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Culture page error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error ? e.error.stack : 'No stack trace available'
    });
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection on culture page:', e.reason);
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initTabNavigation,
        initContentAnimations,
        initImageLazyLoading,
        initAccessibilityFeatures,
        triggerSectionAnimations
    };
}