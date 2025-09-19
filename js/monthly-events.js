/**
 * Monthly Events Page Handler
 * 月別イベント詳細ページの月切り替え機能
 */

class MonthlyEventsPage {
  constructor() {
    this.monthButtons = [];
    this.monthContents = [];
    this.currentMonth = 1;
    
    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.setInitialMonth();
  }

  cacheElements() {
    this.monthButtons = document.querySelectorAll('.month-btn');
    this.monthContents = document.querySelectorAll('.month-content');
  }

  bindEvents() {
    // 月ボタンのクリックイベント
    this.monthButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const month = parseInt(e.target.dataset.month);
        this.switchMonth(month);
      });
    });

    // キーボードナビゲーション
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.navigateMonth(-1);
      } else if (e.key === 'ArrowRight') {
        this.navigateMonth(1);
      }
    });

    // URL パラメータでの月指定
    this.handleUrlParams();
  }

  setInitialMonth() {
    // URLパラメータから月を取得、なければ現在の月を使用
    const urlParams = new URLSearchParams(window.location.search);
    const monthParam = urlParams.get('month');
    const currentDate = new Date();
    
    let initialMonth;
    if (monthParam && monthParam >= 1 && monthParam <= 12) {
      initialMonth = parseInt(monthParam);
    } else {
      initialMonth = currentDate.getMonth() + 1; // 0ベースなので+1
    }
    
    this.switchMonth(initialMonth);
  }

  switchMonth(month) {
    if (month < 1 || month > 12) return;
    
    this.currentMonth = month;
    
    // すべてのボタンとコンテンツを非アクティブにする
    this.monthButtons.forEach(btn => btn.classList.remove('active'));
    this.monthContents.forEach(content => content.classList.remove('active'));
    
    // 指定された月をアクティブにする
    const targetButton = document.querySelector(`[data-month="${month}"]`);
    const targetContent = document.querySelector(`.month-content[data-month="${month}"]`);
    
    if (targetButton && targetContent) {
      targetButton.classList.add('active');
      targetContent.classList.add('active');
      
      // スムーズスクロールでコンテンツエリアに移動
      targetContent.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // URLを更新（ページリロードなし）
      this.updateUrl(month);
    }
  }

  navigateMonth(direction) {
    let newMonth = this.currentMonth + direction;
    
    // 12月の次は1月、1月の前は12月
    if (newMonth > 12) newMonth = 1;
    if (newMonth < 1) newMonth = 12;
    
    this.switchMonth(newMonth);
  }

  updateUrl(month) {
    const url = new URL(window.location);
    url.searchParams.set('month', month);
    window.history.replaceState({}, '', url);
  }

  handleUrlParams() {
    // ページ読み込み時のURLパラメータ処理は setInitialMonth で実行
    
    // ブラウザの戻る/進むボタン対応
    window.addEventListener('popstate', () => {
      this.setInitialMonth();
    });
  }

  // 外部から月を切り替えるためのパブリックメソッド
  goToMonth(month) {
    this.switchMonth(month);
  }

  // 現在の月を取得するメソッド
  getCurrentMonth() {
    return this.currentMonth;
  }
}

// 月名の日本語変換
const MONTH_NAMES = {
  1: '睦月',
  2: '如月', 
  3: '弥生',
  4: '卯月',
  5: '皐月',
  6: '水無月',
  7: '文月',
  8: '葉月',
  9: '長月',
  10: '神無月',
  11: '霜月',
  12: '師走'
};

// ユーティリティ関数
function getMonthName(month) {
  return MONTH_NAMES[month] || `${month}月`;
}

function getSeasonFromMonth(month) {
  if (month >= 3 && month <= 5) return '春';
  if (month >= 6 && month <= 8) return '夏';  
  if (month >= 9 && month <= 11) return '秋';
  return '冬';
}

// ページ読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
  window.monthlyEventsPage = new MonthlyEventsPage();
  
  // 月間ナビゲーションの改良
  enhanceMonthNavigation();
  
  // 画像の遅延読み込み
  setupLazyLoading();
});

// 月間ナビゲーションの改良
function enhanceMonthNavigation() {
  const monthNav = document.querySelector('.month-nav');
  if (!monthNav) return;
  
  // 月ボタンにツールチップを追加
  const monthButtons = monthNav.querySelectorAll('.month-btn');
  monthButtons.forEach(button => {
    const month = parseInt(button.dataset.month);
    const monthName = getMonthName(month);
    const season = getSeasonFromMonth(month);
    
    button.title = `${monthName}（${season}）`;
    
    // 月ボタンに季節クラスを追加
    button.classList.add(`season-${season.toLowerCase()}`);
  });
}

// 画像の遅延読み込み設定
function setupLazyLoading() {
  // Intersection Observer API を使用した遅延読み込み
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        }
      });
    });

    // lazy クラスを持つ画像を監視
    document.querySelectorAll('img.lazy').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// キーボードショートカット情報を表示する関数
function showKeyboardShortcuts() {
  console.log(`
月別イベントページ - キーボードショートカット:
← 前の月
→ 次の月
1-9 直接月指定（1月-9月）
  `);
}

// 開発用：コンソールでショートカット情報を表示
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('月別イベントページが読み込まれました');
  showKeyboardShortcuts();
}