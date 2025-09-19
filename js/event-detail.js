(function() {
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  function normalizeType(tRaw) {
    const t = String(tRaw || '').toLowerCase();
    if (t.includes('公演') || t.includes('performance')) return 'performance';
    if (t.includes('体験') || t.includes('workshop') || t.includes('experience')) return 'experience';
    return 'event';
  }

  function generateEventId({ idRaw, title, year, month, day }) {
    if (idRaw) return String(idRaw);
    const base = `${year}-${month}-${day}-${title}`.toLowerCase();
    return base
      .replace(/\s+/g, '-')
      .replace(/[\u3000]/g, '-')
      .replace(/[^a-z0-9\-ぁ-んァ-ン一-龯]/g, '')
      .slice(0, 96);
  }

  async function fetchExcelEvents() {
    try {
      // XLSXライブラリを遅延読込
      const XLSX = await window.loadXLSXLibrary();
      const url = encodeURI('../assets/全国花街ポータルサイト_東京_仮行事スケ_上半期_20250907.xlsx');
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    const eventsById = {};
    for (const row of rows) {
      const get = (keys) => {
        for (const k of keys) {
          if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
            return String(row[k]).trim();
          }
        }
        return '';
      };

      const dateRaw = get(['日付', '日時', '開催日', 'DATE', 'date']);
      let date;
      if (dateRaw instanceof Date) {
        date = dateRaw;
      } else if (dateRaw) {
        if (!isNaN(Number(dateRaw))) {
          try {
            const parsed = XLSX.SSF.parse_date_code(Number(dateRaw));
            if (parsed) date = new Date(parsed.y, parsed.m - 1, parsed.d);
          } catch (error) {
            console.warn('XLSXライブラリの読み込みに失敗しました:', error);
          }
        }
        if (!date && !isNaN(Date.parse(dateRaw))) {
          date = new Date(dateRaw);
        }
      }
      if (!(date instanceof Date) || isNaN(date.getTime())) continue;

      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDate();

      const title = get(['タイトル', '件名', 'イベント名', '名称', 'title', '題名']);
      const locationName = get(['場所', '会場', 'エリア', '所在地', 'location']);
      const time = get(['時間', '開演', '開場', 'start', 'time']);
      const price = get(['料金', '価格', '金額', 'price']);
      const description = get(['説明', '概要', '詳細', 'description', '解説']);
      const typeRaw = get(['種別', 'カテゴリ', '分類', 'type', 'カテゴリ1']);
      const image = get(['画像', 'image', 'サムネイル']);
      const idRaw = get(['ID', 'id', 'イベントID']);

      const id = generateEventId({ idRaw, title, year: y, month: m, day: d });
      eventsById[id] = {
        id,
        title: title || `${y}/${m}/${d} イベント` ,
        type: normalizeType(typeRaw),
        time: time || '',
        location: locationName || '',
        price: price || '',
        description: description || '',
        image: image || '../images/1.jpg',
        year: y, month: m, day: d
      };
    }
    return eventsById;
    } catch (error) {
      console.error('Excelファイルの読み込みに失敗しました:', error);
      return {};
    }
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setHtml(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', async function() {
    const eventId = getQueryParam('id');
    if (!eventId) return;

    try {
      const byId = await fetchExcelEvents();
      const ev = byId[eventId];
      if (!ev) return;

      setText('crumb-title', ev.title);
      setText('page-title', ev.title);
      setText('event-title', ev.title);
      setHtml('event-image', `<img src="${ev.image}" alt="${ev.title}" />`);
      setText('event-date', `📅 日時: ${ev.year}年${ev.month}月${ev.day}日 ${ev.time || ''}`);
      setText('event-location', `📍 場所: ${ev.location || '-'}`);
      setText('event-price', `💴 料金: ${ev.price || '-'}`);
      setText('event-type', `🏷 種別: ${ev.type}`);
      setHtml('event-description', ev.description ? `<p>${ev.description}</p>` : '');
    } catch (e) {
      console.error(e);
    }
  });
})();


