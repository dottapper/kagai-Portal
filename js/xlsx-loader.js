/**
 * XLSXライブラリの遅延読込ユーティリティ
 * 必要になった時点でXLSXライブラリを動的に読み込む
 */

let xlsxLoaded = false;
let xlsxLoading = false;
let xlsxLoadPromise = null;

/**
 * XLSXライブラリを遅延読込する
 * @returns {Promise} XLSXライブラリが読み込まれたPromise
 */
function loadXLSXLibrary() {
  // 既に読み込み済みの場合は即座に解決
  if (xlsxLoaded) {
    return Promise.resolve(window.XLSX);
  }

  // 読み込み中の場合は既存のPromiseを返す
  if (xlsxLoading && xlsxLoadPromise) {
    return xlsxLoadPromise;
  }

  // 新しい読み込みを開始
  xlsxLoading = true;
  xlsxLoadPromise = new Promise((resolve, reject) => {
    // スクリプトタグを作成
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.async = true;
    
    // 読み込み成功時の処理
    script.onload = () => {
      xlsxLoaded = true;
      xlsxLoading = false;
      resolve(window.XLSX);
    };
    
    // 読み込み失敗時の処理
    script.onerror = (error) => {
      xlsxLoading = false;
      xlsxLoadPromise = null;
      console.error('XLSXライブラリの読み込みに失敗しました:', error);
      reject(new Error('XLSXライブラリの読み込みに失敗しました'));
    };
    
    // スクリプトをheadに追加
    document.head.appendChild(script);
  });

  return xlsxLoadPromise;
}

/**
 * XLSXライブラリが読み込まれているかチェック
 * @returns {boolean} 読み込み済みかどうか
 */
function isXLSXLoaded() {
  return xlsxLoaded && typeof window.XLSX !== 'undefined';
}

/**
 * Excelファイルを読み込んでJSONに変換する（遅延読込版）
 * @param {string} filePath - Excelファイルのパス
 * @returns {Promise<Object>} 変換されたJSONデータ
 */
async function loadExcelAsJSON(filePath) {
  try {
    // XLSXライブラリを遅延読込
    const XLSX = await loadXLSXLibrary();
    
    // ファイルを取得
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`ファイルの取得に失敗しました: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    
    // Excelファイルを読み込み
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // JSONに変換
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
    return jsonData;
  } catch (error) {
    console.error('Excelファイルの読み込みに失敗しました:', error);
    throw error;
  }
}

// グローバルに公開
window.loadXLSXLibrary = loadXLSXLibrary;
window.isXLSXLoaded = isXLSXLoaded;
window.loadExcelAsJSON = loadExcelAsJSON;
