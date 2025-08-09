/**
 * Interactive Calendar for News & Events Page
 * Handles calendar navigation, event display, and modal interactions
 */

class EventCalendar {
    constructor() {
        this.currentDate = new Date();
        this.today = new Date();
        this.events = this.loadEvents();
        this.init();
    }

    init() {
        this.monthElement = document.querySelector('.calendar-month');
        this.yearElement = document.querySelector('.calendar-year');
        this.prevButton = document.querySelector('.prev-month');
        this.nextButton = document.querySelector('.next-month');
        this.calendarGrid = document.querySelector('.calendar-grid');
        this.modal = document.getElementById('event-modal');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        this.bindEvents();
        this.renderCalendar();
        this.setupFilters();
        
        console.log('Event Calendar initialized');
    }

    bindEvents() {
        // Calendar navigation
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.previousMonth());
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextMonth());
        }

        // Modal events
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal || e.target.classList.contains('modal-close')) {
                    this.closeModal();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }
    }

    loadEvents() {
        // Sample event data - in a real application, this would come from an API
        return {
            '2024-3-5': [{
                title: '花街文化体験教室',
                type: 'experience',
                time: '14:00-16:00',
                location: '東京・新橋',
                price: '5,000円',
                description: '茶道、華道、日本舞踊など、花街文化を体験できる特別教室です。',
                image: '../images/3.jpg'
            }],
            '2024-3-10': [{
                title: '新人芸者のお披露目会',
                type: 'news',
                time: '詳細は各花街にお問い合わせ',
                location: '各花街',
                description: 'この春、新たに芸者としてデビューする方々のお披露目会が行われます。',
                image: '../images/2.jpg'
            }],
            '2024-3-12': [{
                title: '花街文化体験教室',
                type: 'experience',
                time: '14:00-16:00',
                location: '東京・新橋',
                price: '5,000円',
                description: '茶道、華道、日本舞踊など、花街文化を体験できる特別教室です。',
                image: '../images/3.jpg'
            }],
            '2024-3-15': [{
                title: '春の特別公演「桜舞踊会」',
                type: 'event',
                time: '19:00-21:00',
                location: '京都・祇園',
                price: '8,000円～',
                description: '桜の季節に合わせた特別な舞踊をお楽しみください。芸妓・舞妓の皆さんによる華やかな舞台をご堪能いただけます。',
                image: '../images/1.jpg'
            }],
            '2024-3-19': [{
                title: '花街文化体験教室',
                type: 'experience',
                time: '14:00-16:00',
                location: '東京・新橋',
                price: '5,000円',
                description: '茶道、華道、日本舞踊など、花街文化を体験できる特別教室です。',
                image: '../images/3.jpg'
            }],
            '2024-3-26': [{
                title: '花街文化体験教室',
                type: 'experience',
                time: '14:00-16:00',
                location: '東京・新橋',
                price: '5,000円',
                description: '茶道、華道、日本舞踊など、花街文化を体験できる特別教室です。',
                image: '../images/3.jpg'
            }],
            '2024-4-5': [{
                title: '花見の宴',
                type: 'event',
                time: '18:00-20:00',
                location: '京都・祇園',
                price: '12,000円～',
                description: '桜の季節の特別な宴をお楽しみください。',
                image: '../images/4.jpg'
            }],
            '2024-4-12': [{
                title: '春の特別公演',
                type: 'performance',
                time: '19:30-21:30',
                location: '大阪・新地',
                price: '10,000円～',
                description: '春の美しい季節にちなんだ特別公演です。',
                image: '../images/4.jpg'
            }]
        };
    }

    renderCalendar() {
        if (!this.monthElement || !this.yearElement) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month and year display
        const monthNames = [
            '1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'
        ];
        this.monthElement.textContent = monthNames[month];
        this.yearElement.textContent = year.toString();

        // Clear existing calendar days (except weekdays)
        const existingDays = this.calendarGrid.querySelectorAll('.calendar-day');
        existingDays.forEach(day => day.remove());

        // Generate calendar days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();

        // Add previous month's trailing days
        const prevMonth = new Date(year, month - 1, 0);
        const prevMonthDays = prevMonth.getDate();
        
        for (let i = startDay - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            const dayElement = this.createDayElement(day, 'prev-month');
            this.calendarGrid.appendChild(dayElement);
        }

        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = this.createDayElement(day, 'current-month', year, month);
            this.calendarGrid.appendChild(dayElement);
        }

        // Add next month's leading days
        const totalCells = this.calendarGrid.children.length - 7; // Subtract weekday headers
        const remainingCells = 42 - totalCells; // 6 rows × 7 days
        
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createDayElement(day, 'next-month');
            this.calendarGrid.appendChild(dayElement);
        }
    }

    createDayElement(day, monthType, year = null, month = null) {
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day ${monthType}`;
        dayElement.textContent = day;

        if (monthType === 'current-month') {
            // Check if this is today
            if (year === this.today.getFullYear() && 
                month === this.today.getMonth() && 
                day === this.today.getDate()) {
                dayElement.classList.add('today');
            }

            // Check for events
            const dateString = `${year}-${month + 1}-${day}`;
            const events = this.events[dateString];
            
            if (events && events.length > 0) {
                dayElement.classList.add('has-event');
                dayElement.dataset.event = events[0].title;
                
                // Add event indicator dot
                const indicator = document.createElement('div');
                indicator.className = 'event-indicator';
                indicator.style.cssText = `
                    position: absolute;
                    bottom: 8px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 6px;
                    height: 6px;
                    background: var(--primary-color);
                    border-radius: 50%;
                `;
                dayElement.appendChild(indicator);

                // Add click handler for events
                dayElement.addEventListener('click', () => {
                    this.showEventModal(events[0], dateString);
                });
                
                dayElement.style.cursor = 'pointer';
            }
        }

        return dayElement;
    }

    showEventModal(event, dateString) {
        if (!this.modal) return;

        const modalTitle = document.getElementById('modal-title');
        const modalImage = document.getElementById('modal-image');
        const modalDescription = document.getElementById('modal-description');
        const modalDetails = document.getElementById('modal-details');

        if (modalTitle) modalTitle.textContent = event.title;
        
        if (modalImage) {
            modalImage.innerHTML = `<img src="${event.image}" alt="${event.title}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;">`;
        }
        
        if (modalDescription) {
            modalDescription.innerHTML = `<p>${event.description}</p>`;
        }
        
        if (modalDetails) {
            modalDetails.innerHTML = `
                <div class="event-details">
                    <div class="detail-item">
                        <strong>📅 日時:</strong> ${this.formatDate(dateString)} ${event.time}
                    </div>
                    <div class="detail-item">
                        <strong>📍 場所:</strong> ${event.location}
                    </div>
                    ${event.price ? `<div class="detail-item"><strong>💴 料金:</strong> ${event.price}</div>` : ''}
                </div>
            `;
        }

        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${year}年${month}月${day}日`;
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
        this.animateCalendar('prev');
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
        this.animateCalendar('next');
    }

    animateCalendar(direction) {
        const calendarContainer = document.querySelector('.calendar-container');
        if (!calendarContainer) return;

        calendarContainer.style.transform = direction === 'next' ? 
            'translateX(-20px)' : 'translateX(20px)';
        calendarContainer.style.opacity = '0.7';

        setTimeout(() => {
            calendarContainer.style.transform = 'translateX(0)';
            calendarContainer.style.opacity = '1';
        }, 150);
    }

    setupFilters() {
        if (!this.filterButtons.length) return;

        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active filter
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Get filter value
                const filter = button.dataset.filter;
                this.applyFilter(filter);
            });
        });
    }

    applyFilter(filter) {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach(item => {
            const category = item.dataset.category;
            
            if (filter === 'all' || category === filter) {
                item.style.display = '';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                // Animate in
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                // Animate out
                item.style.opacity = '0';
                item.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const emailInput = e.target.querySelector('input[type="email"]');
        const submitButton = e.target.querySelector('button[type="submit"]');
        
        if (!emailInput || !emailInput.value) return;

        // Show loading state
        const originalText = submitButton.textContent;
        submitButton.textContent = '登録中...';
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Show success message
            if (window.hanamachiPortal) {
                window.hanamachiPortal.showNotification(
                    'ニュースレターの登録が完了しました。ありがとうございます！',
                    'success'
                );
            }
            
            // Reset form
            emailInput.value = '';
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    }

    // Public API methods
    goToMonth(year, month) {
        this.currentDate = new Date(year, month - 1);
        this.renderCalendar();
    }

    addEvent(dateString, event) {
        if (!this.events[dateString]) {
            this.events[dateString] = [];
        }
        this.events[dateString].push(event);
        this.renderCalendar();
    }

    getEventsForDate(dateString) {
        return this.events[dateString] || [];
    }
}

// Additional utility functions for calendar
function getJapaneseMonthName(monthIndex) {
    const months = [
        '1月', '2月', '3月', '4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月'
    ];
    return months[monthIndex];
}

function getJapaneseDayName(dayIndex) {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[dayIndex];
}

function formatJapaneseDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

// Initialize calendar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the news page
    if (document.querySelector('.calendar-container')) {
        window.eventCalendar = new EventCalendar();
    }
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventCalendar;
}
