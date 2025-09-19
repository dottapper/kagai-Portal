#!/usr/bin/env node

/**
 * Template Verifier - テンプレートシステムの動作確認
 */

const fs = require('fs');
const path = require('path');

// 検証対象のページ
const pages = [
  'contact.html',
  'about.html',
  'columns.html',
  'events.html',
  'guide.html'
];

function verifyPage(pageName) {
  const pagePath = path.join(__dirname, '../pages', pageName);
  
  if (!fs.existsSync(pagePath)) {
    console.log(`❌ ファイルが見つかりません: ${pageName}`);
    return false;
  }

  const content = fs.readFileSync(pagePath, 'utf8');
  let issues = [];

  // テンプレートスクリプトの確認
  if (!content.includes('template-loader.js')) {
    issues.push('テンプレートスクリプトが挿入されていません');
  }

  // 古いナビ構成の確認
  if (content.includes('News・イベント') || content.includes('プレスリリース')) {
    issues.push('古いナビ構成が残っています');
  }

  // 古いロゴパスの確認
  if (content.includes('../images/logo.png')) {
    issues.push('古いロゴパスが残っています');
  }

  // 古いヘッダーの確認
  if (content.includes('<header class="site-header" id="siteHeader">')) {
    issues.push('古いヘッダーが残っています');
  }

  // 古いフッターの確認
  if (content.includes('<footer class="site-footer"')) {
    issues.push('古いフッターが残っています');
  }

  if (issues.length === 0) {
    console.log(`✅ ${pageName}: 正常`);
    return true;
  } else {
    console.log(`❌ ${pageName}:`);
    issues.forEach(issue => console.log(`   - ${issue}`));
    return false;
  }
}

function main() {
  console.log('🔍 テンプレートシステムの検証を開始...\n');
  
  let passed = 0;
  let total = pages.length;
  
  pages.forEach(page => {
    if (verifyPage(page)) {
      passed++;
    }
  });
  
  console.log(`\n📊 検証結果: ${passed}/${total} ページが正常`);
  
  if (passed === total) {
    console.log('🎉 全てのページが正常に更新されています！');
  } else {
    console.log('⚠️  一部のページに問題があります。');
  }
}

if (require.main === module) {
  main();
}

module.exports = { verifyPage, main };
