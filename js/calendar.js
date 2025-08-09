// Calendar functionality for News page
document.addEventListener('DOMContentLoaded', function() {
    initCalendar();
    initPageNavigation();
});

function initCalendar() {
    const calendar = document.getElementById('calendar');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevButton = document.getElementById('prevMonth');
    const nextButton = document.getElementById('nextMonth');
    
    if (!calendar || !currentMonthElement || !prevButton || !nextButton) {
        return;
    }
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Sample event data
    const events = {
        '2024-3-20': { type: 'performance', title: '春の特別公演' },
        '2024-3-25': { type: 'workshop', title: '文化体験教室' },
        '2024-3-30': { type: 'festival', title: '桜まつり前夜祭' },
        '2024-4-1': { type: 'special', title: '桜まつり開始' },
        '2024-4-15': { type: 'performance', title: '春の舞踊会' },
        '2024-4-29': { type: 'festival', title: '昭和の日特別企画' },
        '2024-5-3': { type: 'festival', title: 'こどもの日イベント' },
        '2024-5-15': { type: 'special', title: '新緑祭' },
    };
    
    function renderCalendar(month, year) {
        const monthNames = [
            '1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'
        ];
        
        currentMonthElement.textContent = `${year}年 ${monthNames[month]}`;
        
        // Clear previous calendar days
        const existingDays = calendar.querySelectorAll('.calendar-day');
        existingDays.forEach(day => day.remove());
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        // Add previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = document.createElement('div');
            day.className = 'calendar-day other-month';
            day.textContent = daysInPrevMonth - i;
            calendar.appendChild(day);
        }
        
        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Check if this is today
            const today = new Date();
            if (year === today.getFullYear() && 
                month === today.getMonth() && 
                day === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            // Check if this day has events
            const eventKey = `${year}-${month + 1}-${day}`;
            if (events[eventKey]) {
                dayElement.classList.add('has-event');
                dayElement.setAttribute('data-event', events[eventKey].title);
                dayElement.setAttribute('data-event-type', events[eventKey].type);
                
                // Add click handler for event details
                dayElement.addEventListener('click', function() {
                    showEventPopup(events[eventKey], day, month + 1, year);
                });
                
                dayElement.style.cursor = 'pointer';
            }
            
            calendar.appendChild(dayElement);
        }
        
        // Add next month's leading days
        const totalCells = calendar.children.length - 7; // Subtract header cells
        const remainingCells = 42 - totalCells; // 6 rows × 7 days = 42 cells
        
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = day;
            calendar.appendChild(dayElement);
        }
    }
    
    function showEventPopup(event, day, month, year) {
        // Create popup overlay
        const overlay = document.createElement('div');
        overlay.className = 'event-popup-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Create popup content
        const popup = document.createElement('div');
        popup.className = 'event-popup';
        popup.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 8px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            position: relative;
        `;
        
        popup.innerHTML = `
            <button class="popup-close" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
            ">&times;</button>
            <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">
                ${event.title}
            </h3>
            <p style="color: var(--text-light); margin-bottom: 1rem;">
                ${year}年${month}月${day}日
            </p>
            <div class="event-type-badge" style="
                display: inline-block;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.875rem;
                font-weight: 500;
                color: white;
                background: ${getEventTypeColor(event.type)};
            ">
                ${getEventTypeName(event.type)}
            </div>
        `;
        
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        
        // Close popup handlers
        const closeBtn = popup.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => document.body.removeChild(overlay));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function closeOnEsc(e) {
            if (e.key === 'Escape') {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
                document.removeEventListener('keydown', closeOnEsc);
            }
        });
    }
    
    function getEventTypeColor(type) {
        const colors = {
            'performance': '#e74c3c',
            'workshop': '#3498db',
            'festival': '#f39c12',
            'special': '#d4af37'
        };
        return colors[type] || '#666';
    }
    
    function getEventTypeName(type) {
        const names = {
            'performance': '公演・舞台',
            'workshop': '体験教室',
            'festival': '祭り・行事',
            'special': '特別イベント'
        };
        return names[type] || 'イベント';
    }
    
    // Navigation event listeners
    prevButton.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    nextButton.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    // Initial render
    renderCalendar(currentMonth, currentYear);
}

function initPageNavigation() {
    const navLinks = document.querySelectorAll('.page-nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= headerHeight + 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Pagination functionality
document.addEventListener('DOMContentLoaded', function() {
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent === '次へ') {
                // Handle next page
                console.log('Next page clicked');
                return;
            }
            
            // Remove active class from all buttons
            paginationBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Here you would typically load new content
            console.log('Page', this.textContent, 'clicked');
        });
    });
});