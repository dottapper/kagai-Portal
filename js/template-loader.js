/**
 * Template Loader - ヘッダー/フッターの統一管理
 * 静的サイトでヘッダー/フッターを動的に挿入するシステム
 */

(function() {
  'use strict';

  // テンプレートの定義（エスケープされたプレースホルダーを使用）
  const templates = {
    header: `
      <header class="site-header" id="siteHeader">
        <div class="container header__inner">
          <a class="brand" href="\${homeUrl}index.html">
            <img class="brand__mark" src="\${logoUrl}" alt="花街ロゴ" />
            <span class="brand__type">全国花街ポータル</span>
          </a>

          <div class="header-tools">
            <button class="nav-toggle" id="navToggle" aria-label="メニューを開く" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
          </div>

          <nav class="global-nav" id="globalNav" aria-label="グローバルナビ">
            <ul class="nav-list">
              <li class="nav-item">
                <a href="\${homeUrl}pages/events.html" class="nav-link">イベント</a>
              </li>
              <li class="nav-item">
                <a href="\${homeUrl}pages/guide.html" class="nav-link">花街ガイド</a>
              </li>
              <li class="nav-item">
                <a href="\${homeUrl}pages/columns.html" class="nav-link">コラム・読み物</a>
              </li>
              <li class="nav-item">
                <a href="\${homeUrl}pages/sns-links.html" class="nav-link">SNS・リンク</a>
              </li>
              <li class="nav-item">
                <a href="\${homeUrl}pages/updates.html" class="nav-link">更新情報</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    `,

    footer: `
      <footer class="site-footer" id="footer">
        <div class="container">
          <div class="footer__inner">
            <div class="footer__brand">
              <a class="footer__logo" href="\${homeUrl}index.html">
                <img src="\${logoUrl}" alt="全国花街ポータル ロゴ" />
                <span class="footer__brand-text">全国花街ポータル</span>
              </a>
              <p class="footer__desc">日本の伝統文化である花街・芸者文化の正しい理解と継承を支えるポータルです。</p>
            </div>
            <div class="footer__nav">
              <div class="footer__col">
                <h4 class="footer__title">メインコンテンツ</h4>
                <ul class="footer__links">
                  <li><a href="\${homeUrl}pages/events.html">イベント</a></li>
                  <li><a href="\${homeUrl}pages/guide.html">花街ガイド</a></li>
                  <li><a href="\${homeUrl}pages/columns.html">コラム・読み物</a></li>
                  <li><a href="\${homeUrl}pages/sns-links.html">SNS・リンク</a></li>
                  <li><a href="\${homeUrl}pages/updates.html">更新情報</a></li>
                </ul>
              </div>
              <div class="footer__col">
                <h4 class="footer__title">サイト情報</h4>
                <ul class="footer__links">
                  <li><a href="\${homeUrl}pages/about.html">サイト概要</a></li>
                  <li><a href="\${homeUrl}pages/contact.html">お問い合わせ</a></li>
                  <li><a href="\${homeUrl}pages/privacy.html">利用規約・プライバシーポリシー</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer__bottom">
            <p class="footer__copyright">© 2025 全国花街ポータル. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `
  };

  // パス設定の取得
  function getPathConfig() {
    const isSubpage = window.location.pathname.includes('/pages/');
    return {
      homeUrl: isSubpage ? '../' : './',
      logoUrl: isSubpage ? '../assets/logo.png' : 'assets/logo.png'
    };
  }

  // テンプレートのレンダリング
  function renderTemplate(template, config) {
    return template.replace(/\$\{(\w+)\}/g, (match, key) => {
      return config[key] || '';
    });
  }

  // ヘッダーの挿入
  function insertHeader() {
    const config = getPathConfig();
    const headerHtml = renderTemplate(templates.header, config);
    
    // 既存のヘッダーを置換
    const existingHeader = document.querySelector('header.site-header');
    if (existingHeader) {
      existingHeader.outerHTML = headerHtml;
    } else {
      // ヘッダーがない場合はbodyの最初に挿入
      document.body.insertAdjacentHTML('afterbegin', headerHtml);
    }
  }

  // フッターの挿入
  function insertFooter() {
    const config = getPathConfig();
    const footerHtml = renderTemplate(templates.footer, config);
    
    // 既存のフッターを置換
    const existingFooter = document.querySelector('footer.site-footer');
    if (existingFooter) {
      existingFooter.outerHTML = footerHtml;
    } else {
      // フッターがない場合はbodyの最後に挿入
      document.body.insertAdjacentHTML('beforeend', footerHtml);
    }
  }

  // ナビゲーション機能の初期化
  function initNavigation() {
    // モバイルナビのトグル機能
    const navToggle = document.getElementById('navToggle');
    const globalNav = document.getElementById('globalNav');
    
    if (navToggle && globalNav) {
      navToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        globalNav.classList.toggle('active');
      });
    }

    // メガメニューは削除済み - シンプルなナビゲーションのみ使用
  }

  // 現在のページを判定してaria-current="page"を付与
  function setActiveNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      // パスの正規化
      const normalizedHref = href.replace(/^\.\.\//, '').replace(/^\.\//, '');
      const normalizedPath = currentPath.replace(/^\/+/, '').replace(/\/+$/, '');
      
      // 現在のページかどうかを判定
      const isCurrentPage = 
        normalizedPath === normalizedHref ||
        normalizedPath.endsWith(normalizedHref) ||
        (normalizedHref === 'index.html' && (normalizedPath === '' || normalizedPath === 'index.html'));
      
      if (isCurrentPage) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('active');
      } else {
        link.removeAttribute('aria-current');
        link.classList.remove('active');
      }
    });
  }

  // パンくずを動的に生成
  function generateBreadcrumb() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const config = getPathConfig();
    
    // ページ名のマッピング
    const pageNames = {
      'index.html': 'ホーム',
      'events.html': 'イベント',
      'about.html': 'このサイトについて',
      'contact.html': 'お問い合わせ',
      'culture.html': '花街文化',
      'manners.html': '基本マナー',
      'columns.html': 'コラム',
      'glossary.html': '用語集',
      'updates.html': '更新情報',
      'overseas.html': '海外向け情報',
      'press.html': 'プレスリリース',
      'guide.html': '花街ガイド',
      'privacy.html': 'プライバシーポリシー',
      'sns-links.html': 'SNSリンク',
      'event-detail.html': 'イベント詳細',
      'kagai-detail.html': '花街詳細'
    };
    
    const currentPageName = pageNames[currentPage] || 'ページ';
    
    const breadcrumbHTML = `
      <div class="breadcrumb">
        <a href="${config.homeUrl}index.html">ホーム</a>
        <span>/</span>
        <span>${currentPageName}</span>
      </div>
    `;
    
    // 既存のパンくずを置き換え
    const existingBreadcrumb = document.querySelector('.breadcrumb');
    if (existingBreadcrumb) {
      existingBreadcrumb.outerHTML = breadcrumbHTML;
    } else {
      // パンくずがない場合は適切な場所に挿入
      const pageHero = document.querySelector('.page-hero .container');
      if (pageHero) {
        pageHero.insertAdjacentHTML('afterbegin', breadcrumbHTML);
      }
    }
  }

  // 初期化
  function init() {
    // DOMContentLoadedを待つ
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        insertHeader();
        insertFooter();
        initNavigation();
        setActiveNavigation();
        generateBreadcrumb();
      });
    } else {
      // 既に読み込み完了している場合
      insertHeader();
      insertFooter();
      initNavigation();
      setActiveNavigation();
      generateBreadcrumb();
    }
  }

  // グローバルに公開
  window.TemplateLoader = {
    init: init,
    insertHeader: insertHeader,
    insertFooter: insertFooter,
    initNavigation: initNavigation
  };

  // 自動初期化
  init();

})();
