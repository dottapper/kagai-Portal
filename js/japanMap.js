(function() {
  const HOTSPOTS = [
    // name: ラベル, percent based position on the map image wrapper
    { key: 'tokyo',   label: '東京',   x: 56, y: 61 },
    { key: 'kyoto',   label: '京都',   x: 36, y: 62 },
    { key: 'ishikawa',label: '石川',   x: 43, y: 54 },
    { key: 'yamagata',label: '山形',   x: 58, y: 43 },
    { key: 'niigata', label: '新潟',   x: 53, y: 50 },
    { key: 'fukuoka', label: '福岡',   x: 12, y: 72 },
    { key: 'akita',   label: '秋田',   x: 60, y: 34 },
    { key: 'fukui',   label: '福井',   x: 40, y: 58 },
  ];

  // XLSXライブラリの遅延読込
  async function ensureXLSX() {
    if (typeof XLSX !== 'undefined') return;
    await new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  const PREF_LABELS = {
    tokyo: '東京都', kyoto: '京都府', ishikawa: '石川県', yamagata: '山形県',
    niigata: '新潟県', fukuoka: '福岡県', akita: '秋田県', fukui: '福井県'
  };

  function createHotspots() {
    const container = document.getElementById('mapSpots');
    if (!container) return;
    HOTSPOTS.forEach(h => {
      const spot = document.createElement('button');
      spot.className = 'map-spot';
      spot.style.left = h.x + '%';
      spot.style.top = h.y + '%';
      spot.setAttribute('data-key', h.key);
      spot.setAttribute('data-label', h.label);
      spot.setAttribute('aria-label', h.label);
      spot.addEventListener('click', () => openRegionModal(h.key));
      container.appendChild(spot);
    });
  }

  // Modal
  function ensureModal() {
    let modal = document.getElementById('mapModal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'mapModal';
    modal.className = 'map-modal';
    modal.innerHTML = `
      <div class="map-modal__dialog">
        <div class="map-modal__header">
          <h3 class="map-modal__title" id="mapModalTitle">地域</h3>
          <button class="map-modal__close" aria-label="閉じる">×</button>
        </div>
        <div class="map-modal__body">
          <div class="hanamachi-grid" id="hanamachiGrid"></div>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('map-modal__close')) closeModal();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    return modal;
  }

  async function openRegionModal(regionKey) {
    const modal = ensureModal();
    const title = document.getElementById('mapModalTitle');
    const grid = document.getElementById('hanamachiGrid');
    if (title) title.textContent = PREF_LABELS[regionKey] || '地域';
    if (grid) {
      grid.innerHTML = `
        <div class="map-modal__loading">
          <div class="loading-spinner"></div>
          <p>データを読み込み中...</p>
        </div>`;
    }

    // 履歴に状態を追加
    const modalState = { region: regionKey, timestamp: Date.now() };
    history.pushState(modalState, '', `#modal-${regionKey}`);
    
    // モーダルを即座に表示
    modal.style.display = 'block';
    modal.dataset.activeRegion = regionKey;
    document.body.style.overflow = 'hidden';
    
    // フォーカストラップを設定
    setupFocusTrap(modal);

    // XLSXライブラリを必要時に読み込み
    await ensureXLSX();

    loadHanamachiFromJSON(regionKey).then(list => {
      if (!grid) return;
      
      // ローディング表示をクリア
      grid.innerHTML = '';
      
      if (list.length === 0) {
        grid.innerHTML = '<p class="map-modal__empty">該当する花街が見つかりませんでした。</p>';
        return;
      }
      
      for (const item of list) {
        const card = document.createElement('a');
        const detailBase = location.pathname.includes('/pages/') ? 'kagai-detail.html' : 'pages/kagai-detail.html';
        const url = `${detailBase}?id=${encodeURIComponent(item.id)}`;
        card.className = 'hanamachi-card';
        card.href = url;
        card.innerHTML = `
          <div class="hanamachi-card__media">${item.image ? `<img src="${item.image}" alt="${item.name}">` : ''}</div>
          <div class="hanamachi-card__body">
            <h4 class="hanamachi-card__title">${item.name}</h4>
            <p class="hanamachi-card__meta">${item.area || ''}</p>
            <span class="hanamachi-card__link">詳細を見る</span>
          </div>`;
        grid.appendChild(card);
      }
      
      // 最初のカードにフォーカス
      const firstCard = grid.querySelector('.hanamachi-card');
      if (firstCard) {
        firstCard.focus();
      }
    }).catch(err => {
      console.error(err);
      if (grid) {
        grid.innerHTML = '<p class="map-modal__error">データの読み込みに失敗しました。</p>';
      }
    });
  }

  function closeModal() {
    const modal = document.getElementById('mapModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      
      // 履歴からモーダル状態を削除
      if (history.state && history.state.region) {
        history.back();
      }
      
      // トリガー要素にフォーカスを戻す
      const activeRegion = document.querySelector(`[data-key="${modal.dataset.activeRegion}"]`);
      if (activeRegion) {
        activeRegion.focus();
      }
    }
  }

  // フォーカストラップ設定
  function setupFocusTrap(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    });
  }

  // 履歴管理
  window.addEventListener('popstate', (e) => {
    const modal = document.getElementById('mapModal');
    if (modal && modal.style.display === 'block') {
      closeModal();
    } else if (e.state && e.state.region) {
      // 戻るボタンでモーダルを再オープン
      openRegionModal(e.state.region);
    }
  });

  // JSONデータのキャッシュ
  let hanamachiData = null;
  let dataLoading = null;

  // JSON: assets/kagai-data.json を読み込み、地域キーで絞り込み
  async function loadHanamachiFromJSON(regionKey) {
    try {
      // データが既に読み込まれている場合はキャッシュから返す
      if (hanamachiData) {
        return hanamachiData[regionKey] || [];
      }

      // 既に読み込み中の場合はそのPromiseを返す
      if (dataLoading) {
        await dataLoading;
        return hanamachiData[regionKey] || [];
      }

      // JSONファイルを読み込み
      dataLoading = new Promise(async (resolve, reject) => {
        try {
          const isSubpage = location.pathname.includes('/pages/');
          const path = `${isSubpage ? '..' : '.'}/assets/kagai-data.json`;
          const url = encodeURI(path);
          const res = await fetch(url);
          
          if (!res.ok) {
            throw new Error(`JSON fetch failed: ${res.status}`);
          }
          
          hanamachiData = await res.json();
          resolve(hanamachiData);
        } catch (error) {
          console.error('Failed to load hanamachi data:', error);
          hanamachiData = {};
          reject(error);
        }
      });

      await dataLoading;
      return hanamachiData[regionKey] || [];
      
    } catch (error) {
      console.error('Error loading hanamachi data:', error);
      return [];
    }
  }


  document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('mapSpots')) {
      createHotspots();
    }
  });
})();


