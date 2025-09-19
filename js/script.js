/**
 * 全国花街ポータル - 2025 Portal UI Script
 * モダン・高パフォーマンス・アクセシビリティ配慮
 */

class PortalUI {
  constructor() {
    this.cache();
    this.bind();
    this.interactions();
  }

  cache() {
    this.header = document.getElementById('siteHeader');
    this.navToggle = document.getElementById('navToggle');
    this.globalNav = document.getElementById('globalNav');
    this.scrollDown = document.getElementById('scrollDown');
    this.heroVideo = document.querySelector('.hero__video');
    this.html = document.documentElement;

    this.lastY = 0;
    this.menuOpen = false;
    this.ticking = false;
  }

  bind() {
    // モバイルメニュー
    this.navToggle?.addEventListener('click', () => this.toggleMenu());

    // アウトサイドクリック
    document.addEventListener('click', (e) => {
      if (!this.menuOpen) return;
      const within = this.globalNav?.contains(e.target) || this.navToggle?.contains(e.target);
      if (!within) this.toggleMenu(false);
    });

    // ESCで閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.menuOpen) this.toggleMenu(false);
    });

    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => this.smoothScroll(e));
    });

    // スクロール監視
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    window.addEventListener('resize', () => this.onResize(), { passive: true });

    // スクロールダウン
    this.scrollDown?.addEventListener('click', () => this.scrollToNext());

    // ページロード
    window.addEventListener('load', () => this.onLoad());
  }

  toggleMenu(force) {
    this.menuOpen = typeof force === 'boolean' ? force : !this.menuOpen;
    this.globalNav?.classList.toggle('active', this.menuOpen);
    this.navToggle?.setAttribute('aria-expanded', String(this.menuOpen));
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  smoothScroll(e) {
    const target = e.currentTarget;
    const href = target.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const id = href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;

    e.preventDefault();
    const headerH = this.header?.offsetHeight || 0;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
    if (this.menuOpen) this.toggleMenu(false);
  }

  onScroll() {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      // ヘッダーの出し入れ
      if (y > 100) this.header?.classList.add('scrolled');
      else this.header?.classList.remove('scrolled');

      if (y > this.lastY && y > 200) {
        this.header && (this.header.style.transform = 'translateY(-100%)');
      } else {
        this.header && (this.header.style.transform = 'translateY(0)');
      }

      // スクロールインジケータのフェード
      if (this.scrollDown) {
        const opacity = Math.max(0, 1 - y / (window.innerHeight * 0.5));
        this.scrollDown.style.opacity = String(opacity);
      }

      // パララックス
      if (this.heroVideo && y < window.innerHeight) {
        const speed = 0.45;
        this.heroVideo.style.transform = `translateY(${-(y * speed)}px)`;
      }

      this.lastY = y;
      this.ticking = false;
    });
  }

  onResize() {
    if (window.innerWidth > 980 && this.menuOpen) this.toggleMenu(false);
  }

  scrollToNext() {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }

  onLoad() {
    this.observe();
    // ネイティブのloading="lazy"を使用しているため、カスタム遅延読み込みは不要
  }

  interactions() {
    // 追加のインタラクションはここに
  }

  observe() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10%' });

    const targets = [
      '.section__header',
      '.module-card',
      '.editorial__lead',
      '.editorial__item',
      '.news-card'
    ];

    targets.forEach((sel) => document.querySelectorAll(sel).forEach((el) => {
      el.classList.add('fade-in');
      observer.observe(el);
    }));
  }

}

// init
document.addEventListener('DOMContentLoaded', () => {
  window.portalUI = new PortalUI();
});

// エラー監視（将来的にはSentryやLogRocketなどの外部サービスへの統合を検討）
window.addEventListener('error', (e) => {
  console.error('JS Error:', e.error);
  // 本番環境では外部エラー追跡サービスに送信
  // if (typeof Sentry !== 'undefined') Sentry.captureException(e.error);
});
