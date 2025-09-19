class HeroSlider {
  constructor() {
    this.slideImages = [
      'images/top/top1.jpg',
      'images/top/top2.jpg',
      'images/top/top3.jpg'
    ];
    
    this.slideDescriptions = [
      '花街の美しい風景',
      '伝統文化の継承',
      '花街マップ'
    ];
    
    this.currentSlide = 0;
    this.slideInterval = null;
    this.slideDuration = 5000; // 5秒
    this.isPaused = false;
    this.announcementElement = null;
    
    this.init();
  }

  init() {
    this.replaceVideoWithSlider();
    this.createSliderControls();
    this.startAutoSlide();
    this.addEventListeners();
  }

  replaceVideoWithSlider() {
    // HTMLに既にスライダーが存在する場合は何もしない
    const existingSlider = document.querySelector('.hero-slider');
    if (existingSlider) return;

    const heroVideo = document.querySelector('.hero__video');
    if (!heroVideo) return;

    const heroBg = heroVideo.parentElement;
    heroBg.removeChild(heroVideo);

    // スライダーHTML作成
    const sliderHTML = `
      <div class="hero-slider">
        <div class="hero-slide active">
          <img src="${this.slideImages[0]}" alt="花街の美しい風景" class="hero-slide__image" />
          <div class="hero-slide__overlay"></div>
          <div class="container hero-slide__content">
            <div class="hero__stack">
              <img class="hero__logo" src="assets/logo.png" alt="全国花街ポータル ロゴ" />
              <p class="hero__desc">全国の花街文化を一箇所で。美しく静謐な情報体験を。</p>
            </div>
          </div>
        </div>
        <div class="hero-slide">
          <img src="${this.slideImages[1]}" alt="伝統文化の継承" class="hero-slide__image" />
          <div class="hero-slide__overlay"></div>
          <div class="container hero-slide__content">
            <div class="hero__stack">
              <img class="hero__logo" src="assets/logo.png" alt="全国花街ポータル ロゴ" />
              <p class="hero__desc">受け継がれる技芸と四季の美をお届けします。</p>
            </div>
          </div>
        </div>
        <div class="hero-slide">
          <img src="${this.slideImages[2]}" alt="花街マップ" class="hero-slide__image" />
          <div class="hero-slide__overlay"></div>
          <div class="container hero-slide__content">
            <div class="hero__stack">
              <img class="hero__logo" src="assets/logo.png" alt="全国花街ポータル ロゴ" />
              <p class="hero__desc">全国の花街をマップで探索できます。</p>
            </div>
          </div>
        </div>
        <div class="hero-slider__controls">
          <button class="hero-slider__prev" aria-label="前のスライド">‹</button>
          <button class="hero-slider__next" aria-label="次のスライド">›</button>
        </div>
        <div class="hero-slider__indicators">
          <button class="indicator active" data-slide="0"></button>
          <button class="indicator" data-slide="1"></button>
          <button class="indicator" data-slide="2"></button>
        </div>
      </div>
    `;

    heroBg.insertAdjacentHTML('afterbegin', sliderHTML);
  }

  createSliderControls() {
    // HTMLに既にコントロールが存在する場合は何もしない
    const existingControls = document.querySelector('.hero-slider__controls');
    if (existingControls) return;

    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const controlsHTML = `
      <div class="hero-slider__controls">
        <button class="hero-slider__prev" aria-label="前のスライド">‹</button>
        <button class="hero-slider__next" aria-label="次のスライド">›</button>
        <button class="hero-slider__pause" aria-label="スライドショーを一時停止" title="スライドショーを一時停止/再開">
          <span class="pause-icon">⏸</span>
          <span class="play-icon" style="display: none;">▶</span>
        </button>
      </div>
      <div class="hero-slider__indicators">
        ${this.slideImages.map((_, index) => `
          <button class="indicator ${index === 0 ? 'active' : ''}" data-slide="${index}" aria-label="スライド ${index + 1}"></button>
        `).join('')}
      </div>
    `;

    heroSection.insertAdjacentHTML('beforeend', controlsHTML);
  }

  addEventListeners() {
    // 前/次ボタン
    const prevBtn = document.querySelector('.hero-slider__prev');
    const nextBtn = document.querySelector('.hero-slider__next');
    const pauseBtn = document.querySelector('.hero-slider__pause');
    
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
    if (pauseBtn) pauseBtn.addEventListener('click', () => this.togglePause());

    // ドットナビゲーション
    document.querySelectorAll('.indicator').forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const slideIndex = parseInt(e.target.getAttribute('data-slide'));
        this.goToSlide(slideIndex);
      });
    });

    // キーボード操作
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        this.togglePause();
      }
    });

    // マウスホバーで自動再生停止
    const slider = document.querySelector('.hero-slider');
    if (slider) {
      slider.addEventListener('mouseenter', () => this.stopAutoSlide());
      slider.addEventListener('mouseleave', () => {
        if (!this.isPaused) this.startAutoSlide();
      });
    }

    // タッチスワイプ対応
    this.addTouchSupport();
  }

  addTouchSupport() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    let startX = 0;
    let endX = 0;

    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    slider.addEventListener('touchmove', (e) => {
      e.preventDefault();
    });

    slider.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) { // 50px以上のスワイプで反応
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    });
  }

  goToSlide(index) {
    // 現在のスライドを非アクティブに
    const currentSlide = document.querySelector('.hero-slide.active');
    const currentDot = document.querySelector('.indicator.active');
    
    if (currentSlide) currentSlide.classList.remove('active');
    if (currentDot) currentDot.classList.remove('active');

    // 新しいスライドをアクティブに
    this.currentSlide = index;
    const newSlide = document.querySelectorAll('.hero-slide')[index];
    const newDot = document.querySelectorAll('.indicator')[index];
    
    if (newSlide) newSlide.classList.add('active');
    if (newDot) newDot.classList.add('active');
    
    // スクリーンリーダーに通知
    this.updateSlideAnnouncement();
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slideImages.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slideImages.length) % this.slideImages.length;
    this.goToSlide(prevIndex);
  }

  startAutoSlide() {
    this.stopAutoSlide();
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, this.slideDuration);
  }

  stopAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  // pause/resume機能
  togglePause() {
    this.isPaused = !this.isPaused;
    const pauseBtn = document.querySelector('.hero-slider__pause');
    const pauseIcon = pauseBtn?.querySelector('.pause-icon');
    const playIcon = pauseBtn?.querySelector('.play-icon');
    
    if (this.isPaused) {
      this.stopAutoSlide();
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (playIcon) playIcon.style.display = 'inline';
      if (pauseBtn) pauseBtn.setAttribute('aria-label', 'スライドショーを再開');
      this.announceToScreenReader('スライドショーが一時停止されました');
    } else {
      this.startAutoSlide();
      if (pauseIcon) pauseIcon.style.display = 'inline';
      if (playIcon) playIcon.style.display = 'none';
      if (pauseBtn) pauseBtn.setAttribute('aria-label', 'スライドショーを一時停止');
      this.announceToScreenReader('スライドショーが再開されました');
    }
  }

  // aria-liveによる通知機能
  announceToScreenReader(message) {
    if (!this.announcementElement) {
      this.announcementElement = document.createElement('div');
      this.announcementElement.setAttribute('aria-live', 'polite');
      this.announcementElement.setAttribute('role', 'status');
      this.announcementElement.style.position = 'absolute';
      this.announcementElement.style.left = '-10000px';
      this.announcementElement.style.width = '1px';
      this.announcementElement.style.height = '1px';
      this.announcementElement.style.overflow = 'hidden';
      document.body.appendChild(this.announcementElement);
    }
    
    this.announcementElement.textContent = message;
  }

  // スライド変更時の通知
  updateSlideAnnouncement() {
    const slideNumber = this.currentSlide + 1;
    const totalSlides = this.slideImages.length;
    const description = this.slideDescriptions[this.currentSlide];
    this.announceToScreenReader(`スライド ${slideNumber}/${totalSlides}: ${description}`);
  }

  // ページ離脱時にインターバルをクリア
  destroy() {
    this.stopAutoSlide();
    if (this.announcementElement) {
      document.body.removeChild(this.announcementElement);
    }
  }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
  new HeroSlider();
});

// ページ離脱時にクリーンアップ
window.addEventListener('beforeunload', () => {
  if (window.heroSlider) {
    window.heroSlider.destroy();
  }
});