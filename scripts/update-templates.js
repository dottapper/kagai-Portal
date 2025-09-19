#!/usr/bin/env node

/**
 * Template Updater - 全ページのヘッダー/フッターを統一テンプレートに更新
 */

const fs = require('fs');
const path = require('path');

// 更新対象のページ
const pages = [
  'press.html',
  'overseas.html', 
  'culture.html',
  'manners.html',
  'columns.html',
  'glossary.html',
  'updates.html',
  'guide.html',
  'privacy.html'
];

// 古いヘッダーパターン
const oldHeaderPattern = /<header class="site-header" id="siteHeader">[\s\S]*?<\/header>/g;

// 古いフッターパターン
const oldFooterPattern = /<footer class="site-footer"[\s\S]*?<\/footer>/g;

// テンプレートスクリプトの挿入パターン
const templateScriptPattern = /<link rel="stylesheet" href="\.\.\/css\/[^"]+" \/>/;

function updatePage(pageName) {
  const pagePath = path.join(__dirname, '../pages', pageName);
  
  if (!fs.existsSync(pagePath)) {
    console.log(`⚠️  ファイルが見つかりません: ${pageName}`);
    return;
  }

  console.log(`📝 更新中: ${pageName}`);
  
  let content = fs.readFileSync(pagePath, 'utf8');
  
  // 古いヘッダーを削除
  content = content.replace(oldHeaderPattern, '');
  
  // 古いフッターを削除
  content = content.replace(oldFooterPattern, '');
  
  // テンプレートスクリプトを挿入
  if (!content.includes('template-loader.js')) {
    content = content.replace(
      templateScriptPattern,
      '$&\n  <script src="../js/template-loader.js"></script>'
    );
  }
  
  // ファイルを保存
  fs.writeFileSync(pagePath, content, 'utf8');
  console.log(`✅ 完了: ${pageName}`);
}

function main() {
  console.log('🚀 ページテンプレートの更新を開始...\n');
  
  pages.forEach(updatePage);
  
  console.log('\n🎉 全ページの更新が完了しました！');
  console.log('\n📋 更新内容:');
  console.log('  - 古いヘッダー/フッターを削除');
  console.log('  - 統一テンプレートシステムを適用');
  console.log('  - 新しいナビ構成（イベント、花街ガイド、コラム・読み物、SNS・リンク、更新情報）');
}

if (require.main === module) {
  main();
}

module.exports = { updatePage, main };
