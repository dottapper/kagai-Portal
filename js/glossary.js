// Glossary Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const glossaryItems = document.querySelectorAll('.glossary-item');
    const glossarySections = document.querySelectorAll('.glossary-section');
    
    let currentFilter = 'all';
    let currentSearch = '';

    // Search functionality
    searchInput.addEventListener('input', function() {
        currentSearch = this.value.toLowerCase().trim();
        filterItems();
    });

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update current filter
            currentFilter = this.dataset.filter;
            filterItems();
        });
    });

    // Filter items based on search and category
    function filterItems() {
        let visibleItemsCount = 0;
        
        glossarySections.forEach(section => {
            let sectionHasVisibleItems = false;
            const items = section.querySelectorAll('.glossary-item');
            
            items.forEach(item => {
                const term = item.querySelector('.term').textContent.toLowerCase();
                const definition = item.querySelector('.definition p').textContent.toLowerCase();
                const category = item.dataset.category;
                
                // Check if item matches search
                const matchesSearch = currentSearch === '' || 
                    term.includes(currentSearch) || 
                    definition.includes(currentSearch);
                
                // Check if item matches category filter
                const matchesFilter = currentFilter === 'all' || category === currentFilter;
                
                // Show/hide item
                if (matchesSearch && matchesFilter) {
                    item.classList.remove('hidden');
                    sectionHasVisibleItems = true;
                    visibleItemsCount++;
                } else {
                    item.classList.add('hidden');
                }
            });
            
            // Show/hide section based on whether it has visible items
            if (sectionHasVisibleItems) {
                section.style.display = 'flex';
            } else {
                section.style.display = 'none';
            }
        });
        
        // Show no results message if needed
        showNoResults(visibleItemsCount === 0);
    }

    // Show/hide no results message
    function showNoResults(show) {
        let noResultsMsg = document.querySelector('.no-results');
        
        if (show && !noResultsMsg) {
            // Create no results message
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.textContent = '検索条件に一致する用語が見つかりませんでした。';
            
            const glossaryGrid = document.querySelector('.glossary-grid');
            glossaryGrid.appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.classList.add('hidden');
        } else if (show && noResultsMsg) {
            noResultsMsg.classList.remove('hidden');
        }
    }

    // Smooth scroll to sections (for future anchor links)
    function scrollToSection(kana) {
        const section = document.querySelector(`[data-kana="${kana}"]`);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Clear search when clicking clear button (if added in future)
    function clearSearch() {
        searchInput.value = '';
        currentSearch = '';
        filterItems();
        searchInput.focus();
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Focus search with Ctrl/Cmd + F
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Clear search with Escape when focused
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            clearSearch();
        }
    });

    // Initialize
    filterItems();
});
