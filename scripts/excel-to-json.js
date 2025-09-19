#!/usr/bin/env node

/**
 * Excel to JSON Converter
 * ExcelファイルをJSONに変換して、XLSXライブラリの依存を削除
 */

const fs = require('fs');
const path = require('path');

// XLSXライブラリを読み込み（Node.js環境用）
let XLSX;
try {
  XLSX = require('xlsx');
} catch (error) {
  console.error('XLSXライブラリが見つかりません。以下のコマンドでインストールしてください：');
  console.error('npm install xlsx');
  process.exit(1);
}

function convertExcelToJson() {
  const excelPath = path.join(__dirname, '../assets/花街map.xlsx');
  const outputPath = path.join(__dirname, '../assets/kagai-data.json');
  
  console.log('Excelファイルを読み込み中...', excelPath);
  
  try {
    // Excelファイルを読み込み
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // JSONに変換
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
    console.log(`変換完了: ${jsonData.length}件のデータ`);
    console.log('最初の3行のデータ:');
    console.log(JSON.stringify(jsonData.slice(0, 3), null, 2));
    
    // データを整理
    const processedData = jsonData.map((row, index) => {
      const get = (keys) => {
        for (const k of keys) {
          if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
            return String(row[k]).trim();
          }
        }
        return '';
      };
      
      const name = get(['花街名', '名称', 'name', 'Name', '名前']);
      const area = get(['エリア', '地区', 'Area', '住所（エリア）']);
      const image = get(['画像', 'Image', 'photo']);
      const link = get(['リンク', 'URL', 'Link']);
      const idRaw = get(['ID', 'id']);
      const details = get(['詳細', 'description', 'Description']);
      
      // 住所から都道府県を抽出
      const pref = extractPrefecture(area);
      const id = idRaw || `${pref}-${name}`.toLowerCase().replace(/\s+/g, '-');
      
      return {
        id,
        pref,
        name,
        area,
        image,
        link,
        details,
        desc: details, // 後方互換用にdescも出力
        regionKey: getRegionKey(pref)
      };
    }).filter(item => item.name && item.pref); // 名前と都道府県があるもののみ
    
    // 地域別にグループ化
    const groupedData = {};
    processedData.forEach(item => {
      if (!groupedData[item.regionKey]) {
        groupedData[item.regionKey] = [];
      }
      groupedData[item.regionKey].push(item);
    });
    
    // JSONファイルに保存
    fs.writeFileSync(outputPath, JSON.stringify(groupedData, null, 2), 'utf8');
    
    console.log('JSONファイルを生成しました:', outputPath);
    console.log('地域別データ数:');
    Object.keys(groupedData).forEach(key => {
      console.log(`  ${key}: ${groupedData[key].length}件`);
    });
    
  } catch (error) {
    console.error('変換エラー:', error.message);
    process.exit(1);
  }
}

function extractPrefecture(area) {
  if (!area) return '';
  
  const areaStr = String(area);
  
  // 都道府県のパターンマッチング
  const prefecturePatterns = [
    { pattern: /東京都/, pref: '東京都' },
    { pattern: /京都府/, pref: '京都府' },
    { pattern: /石川県/, pref: '石川県' },
    { pattern: /山形県/, pref: '山形県' },
    { pattern: /新潟県/, pref: '新潟県' },
    { pattern: /福岡県/, pref: '福岡県' },
    { pattern: /秋田県/, pref: '秋田県' },
    { pattern: /福井県/, pref: '福井県' },
    { pattern: /京都/, pref: '京都府' },
    { pattern: /東京/, pref: '東京都' },
    { pattern: /石川/, pref: '石川県' },
    { pattern: /山形/, pref: '山形県' },
    { pattern: /新潟/, pref: '新潟県' },
    { pattern: /福岡/, pref: '福岡県' },
    { pattern: /秋田/, pref: '秋田県' },
    { pattern: /福井/, pref: '福井県' }
  ];
  
  for (const { pattern, pref } of prefecturePatterns) {
    if (pattern.test(areaStr)) {
      return pref;
    }
  }
  
  return '';
}

function getRegionKey(prefLabel) {
  prefLabel = String(prefLabel || '');
  if (/東京/.test(prefLabel)) return 'tokyo';
  if (/京都/.test(prefLabel)) return 'kyoto';
  if (/石川/.test(prefLabel)) return 'ishikawa';
  if (/山形/.test(prefLabel)) return 'yamagata';
  if (/新潟/.test(prefLabel)) return 'niigata';
  if (/福岡/.test(prefLabel)) return 'fukuoka';
  if (/秋田/.test(prefLabel)) return 'akita';
  if (/福井/.test(prefLabel)) return 'fukui';
  return 'other';
}

// 実行
if (require.main === module) {
  convertExcelToJson();
}

module.exports = { convertExcelToJson };
