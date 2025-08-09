// Guide Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initGuideNavigation();
    initFAQ();
    initScrollSpy();
    initStepAnimations();
    initAccessibilityFeatures();
});

// Guide step navigation functionality
function initGuideNavigation() {
    const steps = document.querySelectorAll('.step');
    const guideSteps = document.querySelectorAll('.guide-step');
    let currentStep = 1;
    
    // Step click handlers
    steps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = parseInt(this.dataset.step);
            showStep(stepNumber);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' && currentStep < steps.length) {
            e.preventDefault();
            showStep(currentStep + 1);
        } else if (e.key === 'ArrowLeft' && currentStep > 1) {
            e.preventDefault();
            showStep(currentStep - 1);
        }
    });
    
    function showStep(stepNumber) {
        // Update step indicators
        steps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Update guide step content
        guideSteps.forEach(guideStep => {
            guideStep.classList.remove('active');
        });
        
        // Activate current step
        const activeStep = document.querySelector(`[data-step="${stepNumber}"]`);
        const activeGuideStep = document.querySelector(`#step${stepNumber}`);
        
        if (activeStep && activeGuideStep) {
            activeStep.classList.add('active');
            activeGuideStep.classList.add('active');
            currentStep = stepNumber;
            
            // Smooth scroll to step content
            activeGuideStep.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL hash without triggering scroll
            history.replaceState(null, null, `#step${stepNumber}`);
            
            // Announce step change for screen readers
            announceStepChange(stepNumber);
        }
    }
    
    // Initialize from URL hash
    const hash = window.location.hash;
    if (hash && hash.match(/^#step[1-4]$/)) {
        const stepNumber = parseInt(hash.replace('#step', ''));
        showStep(stepNumber);
    }
    
    function announceStepChange(stepNumber) {
        const stepLabels = ['基本知識', 'マナー', '体験の流れ', 'よくある質問'];
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.textContent = `ステップ${stepNumber}: ${stepLabels[stepNumber - 1]}が表示されました`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// FAQ functionality
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
                answer.style.maxHeight = answer.scrollHeight + 'px';
                
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

// Scroll spy for progress navigation
function initScrollSpy() {
    const progressSteps = document.querySelectorAll('.step');
    const guideSteps = document.querySelectorAll('.guide-step');
    
    // Create intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stepNumber = parseInt(entry.target.dataset.step);
                updateActiveStep(stepNumber);
            }
        });
    }, observerOptions);
    
    // Observe all guide steps
    guideSteps.forEach(step => {
        observer.observe(step);
    });
    
    function updateActiveStep(stepNumber) {
        progressSteps.forEach(step => {
            step.classList.remove('active');
        });
        
        const activeStep = document.querySelector(`[data-step="${stepNumber}"]`);
        if (activeStep) {
            activeStep.classList.add('active');
        }
    }
}

// Step animations
function initStepAnimations() {
    const animateElements = document.querySelectorAll(
        '.knowledge-card, .manner-item, .tip-item, .timeline-item, .faq-item'
    );
    
    // Intersection Observer for animations
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
    
    // Set initial styles and observe elements
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        el.style.transitionDelay = `${(index % 6) * 0.1}s`;
        observer.observe(el);
    });
}

// Accessibility features
function initAccessibilityFeatures() {
    // Add skip links for each step
    const steps = document.querySelectorAll('.guide-step');
    const skipLinksContainer = document.createElement('nav');
    skipLinksContainer.className = 'skip-links';
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
    `;
    
    steps.forEach((step, index) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#step${index + 1}`;
        link.textContent = `ステップ${index + 1}へ`;
        link.style.cssText = `
            color: white;
            text-decoration: none;
            padding: 5px 10px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            font-size: 14px;
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
    
    // Enhanced keyboard navigation for interactive elements
    const interactiveElements = document.querySelectorAll(
        '.step, .faq-question, .knowledge-card, .manner-item'
    );
    
    interactiveElements.forEach(element => {
        // Make elements focusable if they aren't already
        if (!element.getAttribute('tabindex') && !element.matches('button, a')) {
            element.setAttribute('tabindex', '0');
        }
        
        // Add focus styles
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--accent-color)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Add ARIA labels to interactive elements
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNumber = step.dataset.step;
        const stepLabels = ['基本知識', 'マナー', '体験の流れ', 'よくある質問'];
        step.setAttribute('aria-label', `ステップ${stepNumber}: ${stepLabels[index]}`);
        step.setAttribute('role', 'tab');
    });
    
    // Progress navigation ARIA
    const progressNav = document.querySelector('.progress-nav');
    if (progressNav) {
        progressNav.setAttribute('aria-label', 'ガイドのステップ');
        const progressSteps = progressNav.querySelector('.progress-steps');
        if (progressSteps) {
            progressSteps.setAttribute('role', 'tablist');
        }
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

// Print functionality
function initPrintSupport() {
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
    
    document.body.appendChild(printButton);
    
    // Hide print button on mobile
    if (window.innerWidth <= 768) {
        printButton.style.display = 'none';
    }
}

// Initialize print support
initPrintSupport();

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 50) {
                        console.warn('Long task detected:', entry);
                    }
                });
            });
            observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            // PerformanceObserver not fully supported
        }
    }
    
    // Monitor memory usage
    if ('memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                console.warn('High memory usage detected');
            }
        }, 30000);
    }
}

// Initialize performance monitoring
initPerformanceMonitoring();

// Error handling
window.addEventListener('error', function(e) {
    console.error('Guide page error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
    });
});

// Resize handler
const handleResize = debounce(function() {
    // Update print button visibility on mobile
    const printButton = document.querySelector('.print-button');
    if (printButton) {
        printButton.style.display = window.innerWidth <= 768 ? 'none' : 'block';
    }
    
    // Reset FAQ heights on resize
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
        // Page is visible again, check for any updates needed
        console.log('Guide page is now visible');
    }
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initGuideNavigation,
        initFAQ,
        initScrollSpy,
        initStepAnimations,
        initAccessibilityFeatures
    };
}