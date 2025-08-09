/**
 * 全国花街ポータルサイト - メインJavaScript
 * Modern vanilla JavaScript for enhanced user experience
 */

class HanamachiPortal {
    constructor() {
        this.init();
        this.bindEvents();
        this.setupScrollAnimations();
    }

    init() {
        // Initialize components
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.heroVideo = document.querySelector('.hero-video');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        
        // State
        this.isScrolling = false;
        this.lastScrollTop = 0;
        
        // Setup intersection observer for animations
        this.setupIntersectionObserver();
        
        console.log('花街ポータルサイト initialized');
    }

    bindEvents() {
        // Mobile navigation toggle
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => this.toggleMobileNav());
        }

        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        // Resize events
        window.addEventListener('resize', () => this.handleResize(), { passive: true });
        
        // Navigation link smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNav(e));
        
        // Video error handling
        if (this.heroVideo) {
            this.heroVideo.addEventListener('error', () => this.handleVideoError());
            this.heroVideo.addEventListener('loadeddata', () => this.handleVideoLoaded());
        }

        // Scroll indicator click
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => this.scrollToContent());
        }

        // Form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        });

        // Card hover effects
        this.setupCardHoverEffects();
        
        // Loading state management
        window.addEventListener('load', () => this.handlePageLoad());
    }

    // ===================================
    // Navigation & Mobile Menu
    // ===================================

    toggleMobileNav() {
        const isActive = this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
        
        // Animate hamburger
        this.animateHamburger(isActive);
        
        // Update aria attributes
        this.hamburger.setAttribute('aria-expanded', isActive);
        this.navMenu.setAttribute('aria-hidden', !isActive);
    }

    animateHamburger(isActive) {
        const spans = this.hamburger.querySelectorAll('span');
        if (isActive) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    }

    handleOutsideClick(e) {
        if (this.navMenu.classList.contains('active') && 
            !this.navMenu.contains(e.target) && 
            !this.hamburger.contains(e.target)) {
            this.toggleMobileNav();
        }
    }

    handleKeyboardNav(e) {
        // ESC key to close mobile nav
        if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
            this.toggleMobileNav();
        }
    }

    // ===================================
    // Scroll Handling
    // ===================================

    handleScroll() {
        if (!this.isScrolling) {
            window.requestAnimationFrame(() => {
                this.updateNavbarOnScroll();
                this.updateScrollIndicator();
                this.isScrolling = false;
            });
            this.isScrolling = true;
        }
    }

    updateNavbarOnScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('.header');
        
        if (header) {
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Hide/show navbar on scroll
        if (scrollTop > this.lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header?.style.setProperty('transform', 'translateY(-100%)');
        } else {
            // Scrolling up
            header?.style.setProperty('transform', 'translateY(0)');
        }
        
        this.lastScrollTop = scrollTop;
    }

    updateScrollIndicator() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        if (this.scrollIndicator) {
            if (scrollTop > windowHeight * 0.3) {
                this.scrollIndicator.style.opacity = '0';
            } else {
                this.scrollIndicator.style.opacity = '1';
            }
        }
    }

    handleSmoothScroll(e) {
        const href = e.target.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = this.navbar ? this.navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile nav if open
                if (this.navMenu.classList.contains('active')) {
                    this.toggleMobileNav();
                }
            }
        }
    }

    scrollToContent() {
        const windowHeight = window.innerHeight;
        window.scrollTo({
            top: windowHeight,
            behavior: 'smooth'
        });
    }

    // ===================================
    // Intersection Observer for Animations
    // ===================================

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-10% 0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, options);

        // Observe elements for animation
        this.observeAnimationElements();
    }

    observeAnimationElements() {
        const elementsToAnimate = [
            '.section-header',
            '.news-card',
            '.guide-card',
            '.feature-content',
            '.cta-content'
        ];

        elementsToAnimate.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                this.observer.observe(element);
            });
        });
    }

    animateElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        
        // Trigger animation
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
        
        // Stop observing this element
        this.observer.unobserve(element);
    }

    setupScrollAnimations() {
        // Counter animation for stats
        this.setupCounterAnimations();
        
        // Parallax effects
        this.setupParallaxEffects();
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/[\d+]/g, '');
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentNumber = Math.floor(number * this.easeOutCubic(progress));
            
            element.textContent = currentNumber + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero-video');
        
        if (parallaxElements.length === 0) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            parallaxElements.forEach(element => {
                if (scrolled < windowHeight) {
                    const speed = 0.5;
                    element.style.transform = `translateY(${scrolled * speed}px)`;
                }
            });
        }, { passive: true });
    }

    // ===================================
    // Video Handling
    // ===================================

    handleVideoError() {
        console.warn('Hero video failed to load');
        const videoContainer = document.querySelector('.hero-video-container');
        if (videoContainer) {
            videoContainer.style.backgroundColor = '#2C3E50';
            // Add fallback image if available
            const fallbackImg = document.createElement('img');
            fallbackImg.src = 'images/1.jpg';
            fallbackImg.style.width = '100%';
            fallbackImg.style.height = '100%';
            fallbackImg.style.objectFit = 'cover';
            videoContainer.appendChild(fallbackImg);
        }
    }

    handleVideoLoaded() {
        console.log('Hero video loaded successfully');
        if (this.heroVideo) {
            this.heroVideo.style.opacity = '1';
        }
    }

    // ===================================
    // Card Hover Effects
    // ===================================

    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.news-card, .guide-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.enhanceCardHover(card));
            card.addEventListener('mouseleave', () => this.resetCardHover(card));
        });
    }

    enhanceCardHover(card) {
        const image = card.querySelector('img');
        if (image) {
            image.style.transform = 'scale(1.05)';
        }
    }

    resetCardHover(card) {
        const image = card.querySelector('img');
        if (image) {
            image.style.transform = 'scale(1)';
        }
    }

    // ===================================
    // Form Handling
    // ===================================

    handleFormSubmit(e) {
        const form = e.target;
        const submitBtn = form.querySelector('[type="submit"]');
        
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Re-enable after 3 seconds (or after actual submission)
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }, 3000);
        }
    }

    // ===================================
    // Utility Functions
    // ===================================

    handleResize() {
        // Close mobile nav on resize to larger screen
        if (window.innerWidth > 768 && this.navMenu.classList.contains('active')) {
            this.toggleMobileNav();
        }
        
        // Reset any transform styles that might cause issues
        this.resetTransformStyles();
    }

    resetTransformStyles() {
        // Reset any problematic styles on resize
        const elementsWithTransforms = document.querySelectorAll('[style*="transform"]');
        elementsWithTransforms.forEach(element => {
            if (!element.classList.contains('hamburger') && 
                !element.querySelector('span')) {
                // Don't reset hamburger transforms
            }
        });
    }

    handlePageLoad() {
        document.body.classList.add('loaded');
        
        // Hide loading indicators
        const loaders = document.querySelectorAll('.loader');
        loaders.forEach(loader => {
            loader.style.display = 'none';
        });
        
        // Initialize any lazy-loaded content
        this.initializeLazyContent();
    }

    initializeLazyContent() {
        // Lazy load images
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('fade-in');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ===================================
    // Public API Methods
    // ===================================

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ===================================
// Additional Utility Functions
// ===================================

// Debounce function for performance
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

// Throttle function for scroll events
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.hanamachiPortal = new HanamachiPortal();
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HanamachiPortal;
}
