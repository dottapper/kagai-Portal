// Press Release Page functionality
document.addEventListener('DOMContentLoaded', function() {
    initPressFilters();
    initPressPagination();
});

function initPressFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const pressItems = document.querySelectorAll('.press-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter press items
            pressItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Show item with animation
                    item.classList.remove('filtering-out');
                    item.classList.add('filtering-in');
                    item.classList.remove('hidden');
                } else {
                    // Hide item with animation
                    item.classList.remove('filtering-in');
                    item.classList.add('filtering-out');
                    
                    // Hide after animation completes
                    setTimeout(() => {
                        if (item.classList.contains('filtering-out')) {
                            item.classList.add('hidden');
                        }
                    }, 300);
                }
            });
            
            // Update URL parameter for bookmarking
            const url = new URL(window.location);
            if (filterValue === 'all') {
                url.searchParams.delete('filter');
            } else {
                url.searchParams.set('filter', filterValue);
            }
            window.history.pushState({}, '', url);
        });
    });
    
    // Initialize filter from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam && filterParam !== 'all') {
        const filterBtn = document.querySelector(`[data-filter="${filterParam}"]`);
        if (filterBtn) {
            filterBtn.click();
        }
    }
}

function initPressPagination() {
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    const itemsPerPage = 8;
    const pressItems = document.querySelectorAll('.press-item');
    let currentPage = 1;
    
    function showPage(page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        pressItems.forEach((item, index) => {
            if (index >= startIndex && index < endIndex && !item.classList.contains('hidden')) {
                item.style.display = 'grid';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Update pagination buttons
        paginationBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent == page) {
                btn.classList.add('active');
            }
        });
        
        // Scroll to top of press section
        const pressSection = document.querySelector('.press-section');
        if (pressSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const elementPosition = pressSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent === '次へ') {
                const totalPages = Math.ceil(pressItems.length / itemsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    showPage(currentPage);
                }
            } else if (!isNaN(parseInt(this.textContent))) {
                currentPage = parseInt(this.textContent);
                showPage(currentPage);
            }
        });
    });
    
    // Initial page load
    showPage(1);
}

// Press item interaction
document.addEventListener('DOMContentLoaded', function() {
    const pressLinks = document.querySelectorAll('.press-link');
    
    pressLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get press item details
            const pressItem = this.closest('.press-item');
            const title = pressItem.querySelector('.press-title').textContent;
            const summary = pressItem.querySelector('.press-summary').textContent;
            const source = pressItem.querySelector('.press-source').textContent;
            const category = pressItem.querySelector('.category-tag').textContent;
            const dateElements = pressItem.querySelectorAll('.press-date span');
            const date = `${dateElements[0].textContent}年${dateElements[1].textContent}月${dateElements[2].textContent}日`;
            
            showPressModal(title, summary, source, category, date);
        });
    });
});

function showPressModal(title, summary, source, category, date) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'press-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'press-modal';
    modal.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 700px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        position: relative;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;
    
    modal.innerHTML = `
        <button class="modal-close" style="
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        ">&times;</button>
        <div class="modal-header" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <span class="modal-date" style="color: var(--text-light); font-size: 0.875rem;">${date}</span>
                <span class="modal-category" style="
                    background: var(--accent-color);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 500;
                ">${category}</span>
            </div>
            <h2 style="color: var(--primary-color); font-size: 1.75rem; line-height: 1.3; margin-bottom: 0.5rem;">${title}</h2>
            <p style="color: var(--text-light); font-size: 0.875rem;">発表元: ${source}</p>
        </div>
        <div class="modal-body">
            <p style="color: var(--text-color); line-height: 1.7; margin-bottom: 2rem;">${summary}</p>
            <div style="background: var(--bg-color); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                <p style="color: var(--text-color); line-height: 1.7; margin-bottom: 1rem;">
                    この発表に関する詳細な情報は、発表元の公式サイトをご確認ください。
                    報道関係者の方は、取材に関するお問い合わせを受け付けております。
                </p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <a href="#" style="
                        display: inline-block;
                        padding: 0.5rem 1rem;
                        background: var(--primary-color);
                        color: white;
                        text-decoration: none;
                        border-radius: 4px;
                        font-size: 0.875rem;
                        font-weight: 500;
                    ">公式サイト</a>
                    <a href="#" style="
                        display: inline-block;
                        padding: 0.5rem 1rem;
                        border: 1px solid var(--primary-color);
                        color: var(--primary-color);
                        text-decoration: none;
                        border-radius: 4px;
                        font-size: 0.875rem;
                        font-weight: 500;
                    ">お問い合わせ</a>
                </div>
            </div>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Animate in
    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
    
    // Close modal handlers
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    function closeModal() {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 300);
    }
    
    // Close on ESC key
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Restore body scroll when modal closes
    const originalCloseModal = closeModal;
    closeModal = function() {
        document.body.style.overflow = '';
        originalCloseModal();
    };
}

// Contact form handlers
document.addEventListener('DOMContentLoaded', function() {
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.textContent;
            
            if (linkText.includes('取材申し込み')) {
                showContactForm('取材申し込み');
            } else if (linkText.includes('プレスキット')) {
                showDownloadModal();
            } else {
                // Handle other contact links
                window.location.href = 'mailto:press@kagai-portal.jp';
            }
        });
    });
});

function showContactForm(type) {
    // This would typically show a contact form modal
    // For now, we'll show a simple alert
    alert(`${type}フォームを開きます。実際の実装では、詳細な入力フォームが表示されます。`);
}

function showDownloadModal() {
    // This would typically show download options
    // For now, we'll show a simple alert
    alert('プレスキットのダウンロードが開始されます。実際の実装では、ZIPファイルのダウンロードリンクが提供されます。');
}