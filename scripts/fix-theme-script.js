const fs = require('fs');
const path = require('path');

// テーマ適用スクリプト
const themeScript = `  <!-- テーマ適用の先行スクリプト - FOUC/白画面解消 -->
  <script>try{var d=document.documentElement;var s=(new URLSearchParams(location.search).get("theme"))||localStorage.getItem("theme")||"light";if(s==="light"||s==="dark"){d.setAttribute("data-theme",s);localStorage.setItem("theme",s);}d.classList.add("theme-loaded");}catch(e){document.documentElement.classList.add("theme-loaded");}</script>`;

// pagesディレクトリ内のHTMLファイルを処理
const pagesDir = path.join(__dirname, '../pages');
const files = fs.readdirSync(pagesDir).filter(file => file.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 既にテーマスクリプトが含まれているかチェック
  if (content.includes('テーマ適用の先行スクリプト')) {
    console.log(`✅ ${file}: 既にテーマスクリプトが含まれています`);
    return;
  }
  
  // <head>タグの直後にテーマスクリプトを挿入
  content = content.replace(
    /<head>\s*\n/,
    `<head>\n${themeScript}\n`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${file}: テーマスクリプトを追加しました`);
});

console.log('\n=== テーマスクリプト追加完了 ===');
