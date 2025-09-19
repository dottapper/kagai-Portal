/**
 * Press Release Page JavaScript
 * Handles press filtering, modal interactions, and form submissions
 */

class PressManager {
    constructor() {
        this.pressData = this.loadPressData();
        this.currentFilter = 'all';
        this.currentYear = '2024';
        this.loadedItems = 6; // Initial number of items shown
        this.init();
    }

    init() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.pressCards = document.querySelectorAll('.press-card');
        this.modal = document.getElementById('press-modal');
        this.loadMoreBtn = document.querySelector('.load-more-btn');
        this.archiveButtons = document.querySelectorAll('.archive-btn');
        this.mediaContactForm = document.querySelector('.media-contact-form');
        
        this.bindEvents();
        this.setupIntersectionObserver();
        this.animateStatsCounters();
    }

    bindEvents() {
        // Filter buttons
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Press card buttons
        document.querySelectorAll('.press-card-button').forEach(button => {
            button.addEventListener('click', (e) => this.showPressModal(e));
        });

        // Modal events
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal || e.target.classList.contains('modal-close')) {
                    this.closeModal();
                }
            });
        }

        // Load more button
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => this.loadMorePress());
        }

        // Archive buttons
        this.archiveButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleArchiveChange(e));
        });

        // Media contact form
        if (this.mediaContactForm) {
            this.mediaContactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    loadPressData() {
        // Sample press data - in a real application, this would come from an API
        return {
            'sakura-performance': {
                title: '春の特別公演「桜舞踊会」開催決定',
                date: '2024年3月10日',
                category: 'event',
                source: '祇園甲部歌舞会',
                contact: 'press@gion-kobu.or.jp',
                image: '../images/1.jpg',
                content: `
                    <p>京都・祇園甲部にて、桜の季節に合わせた特別公演「桜舞踊会」の開催が決定いたしました。</p>
                    
                    <h4>公演概要</h4>
                    <ul>
                        <li><strong>日時:</strong> 2024年4月1日〜4月15日（期間中毎日開催）</li>
                        <li><strong>時間:</strong> 第1部 14:00〜、第2部 18:00〜</li>
                        <li><strong>会場:</strong> 京都・祇園甲部歌舞練場</li>
                        <li><strong>料金:</strong> S席 8,000円、A席 6,000円、B席 4,000円</li>
                    </ul>
                    
                    <h4>演目について</h4>
                    <p>今年の「桜舞踊会」では、春の訪れを告げる桜をテーマにした古典舞踊を中心に、芸妓・舞妓の皆さんが華やかな舞台をお届けします。特に注目は、祇園甲部に古くから伝わる「桜川」の舞で、満開の桜を背景にした幻想的な演出をお楽しみいただけます。</p>
                    
                    <h4>チケット販売</h4>
                    <p>3月15日より一般発売開始。お申し込みは祇園甲部歌舞会まで。</p>
                `
            },
            'nhk-program': {
                title: 'NHK特別番組「花街の四季」撮影協力について',
                date: '2024年3月8日',
                category: 'media',
                source: 'NHK・花街文化保存会',
                contact: 'media@hanamachi-bunka.jp',
                image: '../images/4.jpg',
                content: `
                    <p>NHKにて放送予定の特別番組「花街の四季」の撮影に協力することが決定いたしました。</p>
                    
                    <h4>番組概要</h4>
                    <ul>
                        <li><strong>番組名:</strong> 「花街の四季〜受け継がれる美と技〜」</li>
                        <li><strong>放送予定:</strong> 2024年5月（詳細日時は後日発表）</li>
                        <li><strong>放送時間:</strong> 90分スペシャル</li>
                        <li><strong>制作:</strong> NHK</li>
                    </ul>
                    
                    <h4>撮影内容</h4>
                    <p>一年を通じた花街の美しい文化と、芸妓・舞妓の皆さんの日常を丁寧に記録します。特に、季節ごとの行事や稽古の様子、伝統的な技の継承について詳しく紹介する予定です。</p>
                    
                    <h4>協力地域</h4>
                    <p>京都・祇園、東京・新橋、大阪・新地など、全国の主要花街が撮影に協力いたします。</p>
                `
            },
            'cultural-award': {
                title: '「文化功労者賞」受賞のお知らせ',
                date: '2024年3月5日',
                category: 'award',
                source: '文化庁',
                contact: 'awards@bunka.go.jp',
                image: '../images/2.jpg',
                content: `
                    <p>長年にわたり花街文化の継承と発展に貢献された〇〇さんが、この度「文化功労者賞」を受賞されましたことをお知らせいたします。</p>
                    
                    <h4>受賞者について</h4>
                    <p>〇〇さんは、60年以上にわたり芸妓として活動され、多くの後進の指導にも携わってこられました。特に、日本舞踊の技術継承と国際的な文化交流に大きく貢献されています。</p>
                    
                    <h4>主な功績</h4>
                    <ul>
                        <li>日本舞踊の技術継承と指導（60年間）</li>
                        <li>海外での日本文化紹介活動（20カ国以上）</li>
                        <li>若手芸妓・舞妓の育成指導</li>
                        <li>伝統文化保存への貢献</li>
                    </ul>
                    
                    <h4>授賞式について</h4>
                    <p>授賞式は2024年4月10日、文化庁にて行われる予定です。</p>
                `
            }
        };
    }

    handleFilter(e) {
        const filter = e.target.dataset.filter;
        
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Apply filter
        this.currentFilter = filter;
        this.applyFilter(filter);
    }

    applyFilter(filter) {
        this.pressCards.forEach((card, index) => {
            const category = card.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                // Show with animation
                card.style.display = '';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            } else {
                // Hide with animation
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    showPressModal(e) {
        const pressId = e.target.dataset.pressId;
        const pressInfo = this.pressData[pressId];
        
        if (!pressInfo || !this.modal) return;

        // Populate modal content
        const modalTitle = document.getElementById('press-modal-title');
        const modalMeta = document.getElementById('press-modal-meta');
        const modalImage = document.getElementById('press-modal-image');
        const modalContent = document.getElementById('press-modal-content');

        if (modalTitle) modalTitle.textContent = pressInfo.title;
        
        if (modalMeta) {
            modalMeta.innerHTML = `
                <span class="press-date">${pressInfo.date}</span>
                <span class="press-category ${pressInfo.category}">${this.getCategoryName(pressInfo.category)}</span>
            `;
        }
        
        if (modalImage) {
            modalImage.innerHTML = `<img src="${pressInfo.image}" alt="${pressInfo.title}">`;
        }
        
        if (modalContent) {
            modalContent.innerHTML = `
                <div class="press-source-info">
                    <p><strong>発表者:</strong> ${pressInfo.source}</p>
                    <p><strong>お問い合わせ:</strong> <a href="mailto:${pressInfo.contact}">${pressInfo.contact}</a></p>
                </div>
                <div class="press-full-content">
                    ${pressInfo.content}
                </div>
            `;
        }

        // Show modal
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add animation
        const modalContent = this.modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.7)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }, 50);
    }

    closeModal() {
        if (this.modal) {
            const modalContent = this.modal.querySelector('.modal-content');
            modalContent.style.transform = 'scale(0.7)';
            modalContent.style.opacity = '0';
            
            setTimeout(() => {
                this.modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 200);
        }
    }

    loadMorePress() {
        // Simulate loading more press releases
        if (this.loadMoreBtn) {
            const originalText = this.loadMoreBtn.textContent;
            this.loadMoreBtn.textContent = '読み込み中...';
            this.loadMoreBtn.disabled = true;

            setTimeout(() => {
                // In a real application, you would load more data here
                this.loadedItems += 3;
                
                // Show success message
                if (window.hanamachiPortal) {
                    window.hanamachiPortal.showNotification(
                        `${this.loadedItems}件のプレスリリースを表示しています`,
                        'info'
                    );
                }
                
                this.loadMoreBtn.textContent = originalText;
                this.loadMoreBtn.disabled = false;
                
                // Hide button if all items are loaded (simulate)
                if (this.loadedItems >= 15) {
                    this.loadMoreBtn.style.display = 'none';
                    document.querySelector('.load-more-text').textContent = 'すべてのプレスリリースを表示しました';
                }
            }, 1500);
        }
    }

    handleArchiveChange(e) {
        const year = e.target.dataset.year;
        
        // Update active button
        this.archiveButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update stats based on year
        this.currentYear = year;
        this.updateArchiveStats(year);
    }

    updateArchiveStats(year) {
        // Simulate different stats for different years
        const statsData = {
            '2024': { releases: 28, media: 15, awards: 8, events: 42 },
            '2023': { releases: 35, media: 22, awards: 12, events: 58 },
            '2022': { releases: 42, media: 28, awards: 15, events: 65 },
            '2021': { releases: 38, media: 25, awards: 10, events: 52 }
        };
        
        const stats = statsData[year];
        const statNumbers = document.querySelectorAll('.stat-card .stat-number');
        
        if (statNumbers.length >= 4) {
            this.animateCounter(statNumbers[0], stats.releases);
            this.animateCounter(statNumbers[1], stats.media);
            this.animateCounter(statNumbers[2], stats.awards);
            this.animateCounter(statNumbers[3], stats.events);
        }
    }

    animateCounter(element, targetValue) {
        const startValue = 0;
        const duration = 1000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * this.easeOutCubic(progress));
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = targetValue;
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    handleContactSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const submitButton = e.target.querySelector('button[type="submit"]');
        
        // Show loading state
        const originalText = submitButton.textContent;
        submitButton.textContent = '送信中...';
        submitButton.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Show success message
            if (window.hanamachiPortal) {
                window.hanamachiPortal.showNotification(
                    'お申し込みを受け付けました。担当者よりご連絡いたします。',
                    'success'
                );
            }
            
            // Reset form
            e.target.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, options);

        // Observe press cards and stat cards
        document.querySelectorAll('.press-card, .stat-card').forEach(card => {
            observer.observe(card);
        });
    }

    animateStatsCounters() {
        const statNumbers = document.querySelectorAll('.stat-card .stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetValue = parseInt(entry.target.textContent);
                    entry.target.textContent = '0';
                    this.animateCounter(entry.target, targetValue);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    getCategoryName(category) {
        const categoryMap = {
            announcement: 'お知らせ',
            event: 'イベント発表',
            media: 'メディア情報',
            award: '受賞・表彰'
        };
        return categoryMap[category] || category;
    }

    // Public API methods
    filterByCategory(category) {
        this.applyFilter(category);
    }

    showPress(pressId) {
        const pressInfo = this.pressData[pressId];
        if (pressInfo) {
            this.showPressModal({ target: { dataset: { pressId } } });
        }
    }

    addPressRelease(pressData) {
        // Add new press release to the data
        this.pressData[pressData.id] = pressData;
        // Re-render the press list if needed
    }
}

// Utility functions
function formatPressDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the press page
    if (document.querySelector('.press-list-section')) {
        window.pressManager = new PressManager();
    }
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PressManager;
}
