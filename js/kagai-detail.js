(function() {
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  async function loadExcel() {
    try {
      // XLSXライブラリを遅延読込
      const XLSX = await window.loadXLSXLibrary();
      const url = encodeURI('../assets/花街map.xlsx');
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Excel fetch failed: ${res.status}`);
      const buf = await res.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      return XLSX.utils.sheet_to_json(sheet, { defval: '' });
    } catch (error) {
      console.error('Excelファイルの読み込みに失敗しました:', error);
      return {};
    }
  }

  function normalize(row) {
    const get = (keys) => {
      for (const k of keys) {
        if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') return String(row[k]).trim();
      }
      return '';
    };
    const pref = get(['都道府県', '県', '府', '地域', 'pref', 'Prefecture']);
    const name = get(['花街名', '名称', 'name', 'Name']);
    const area = get(['エリア', '地区', 'Area']);
    const image = get(['画像', 'Image', 'photo']);
    const link = get(['リンク', 'URL', 'Link']);
    const desc = get(['説明', '概要', 'Description', 'details', '詳細']);
    const idRaw = get(['ID', 'id']);
    const id = idRaw || `${pref}-${name}`.toLowerCase().replace(/\s+/g, '-');
    return { id, pref, name, area, image, link, desc };
  }

  function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
  function setHtml(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }

  async function loadFromJson(id) {
    try {
      const isSubpage = location.pathname.includes('/pages/');
      const path = `${isSubpage ? '..' : '.'}/assets/kagai-data.json`;
      const res = await fetch(path);
      if (!res.ok) throw new Error('kagai-data.json の取得に失敗');
      const data = await res.json();
      // すべての地域を横断してID一致を探す
      const all = Object.values(data).flat();
      return all.find(r => r.id === id) || null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  document.addEventListener('DOMContentLoaded', async function() {
    const id = getQueryParam('id');
    const detailEl = document.getElementById('kagai-detail');
    
    if (!id) {
      if (detailEl) detailEl.classList.add('error');
      setText('page-title', '花街が見つかりません');
      setText('page-desc', 'URLパラメータが正しくありません。');
      return;
    }

    // ローディング状態を表示
    if (detailEl) detailEl.classList.add('loading');
    
    try {
      // 1) まずJSONから読み込み（高速・安定）
      let item = await loadFromJson(id);
      // 2) 見つからなければExcelをフォールバック
      if (!item) {
        const rows = await loadExcel();
        const items = rows.map(normalize);
        item = items.find(r => r.id === id) || null;
      }
      
      if (!item) {
        if (detailEl) {
          detailEl.classList.remove('loading');
          detailEl.classList.add('error');
        }
        setText('page-title', '花街が見つかりません');
        setText('page-desc', '指定された花街の情報が見つかりませんでした。');
        return;
      }

      // ローディング状態を解除
      if (detailEl) detailEl.classList.remove('loading');

      setText('crumb-title', item.name);
      setText('page-title', item.name);
      setText('page-desc', `${item.pref}の花街「${item.name}」の詳細情報です。`);
      
      // 画像の表示
      if (item.image && item.image.trim()) {
        setHtml('hana-image', `<img src="${item.image}" alt="${item.name}" loading="lazy">`);
      } else {
        setHtml('hana-image', ''); // プレースホルダーが表示される
      }
      
      setText('hana-pref', `📍 都道府県: ${item.pref || '-'}`);
      setText('hana-area', `🗺 エリア: ${item.area || '-'}`);
      
      // リンクの表示
      if (item.link && item.link.trim()) {
        setHtml('hana-links', `🔗 リンク: <a href="${item.link}" target="_blank" rel="noopener noreferrer">公式サイト</a>`);
      } else {
        setText('hana-links', '🔗 リンク: -');
      }
      
      // 説明文の表示
      const desc = item.desc || item.details || '';
      if (desc && desc.trim()) {
        setHtml('hana-description', `<p>${desc}</p>`);
      } else {
        setHtml('hana-description', '<p>詳細情報は準備中です。</p>');
      }
      
    } catch (e) {
      console.error('花街詳細の読み込みエラー:', e);
      if (detailEl) {
        detailEl.classList.remove('loading');
        detailEl.classList.add('error');
      }
      setText('page-title', '読み込みエラー');
      setText('page-desc', 'データの読み込み中にエラーが発生しました。');
    }
  });
})();


