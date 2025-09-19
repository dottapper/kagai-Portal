const fs = require('fs');
const path = require('path');

/**
 * Static Site Generator for Header/Footer Commonization
 * ヘッダー/フッターの静的生成システム
 */

// 設定
const config = {
  templatesDir: path.join(__dirname, '../templates'),
  pagesDir: path.join(__dirname, '../pages'),
  outputDir: path.join(__dirname, '../dist'),
  homeUrl: '../', // サブページ用の相対パス
  logoUrl: '../assets/logo.png'
};

// テンプレート読み込み
function loadTemplate(templateName) {
  const templatePath = path.join(config.templatesDir, `${templateName}.html`);
  return fs.readFileSync(templatePath, 'utf8');
}

// テンプレート変数の置換
function replaceTemplateVars(template, vars) {
  let result = template;
  Object.keys(vars).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, vars[key]);
  });
  return result;
}

// ページのヘッダー/フッターを置換
function processPage(pagePath, isSubPage = true) {
  const content = fs.readFileSync(pagePath, 'utf8');
  
  // テンプレート変数
  const vars = {
    homeUrl: isSubPage ? config.homeUrl : './',
    logoUrl: isSubPage ? config.logoUrl : './assets/logo.png'
  };
  
  // ヘッダー/フッターテンプレート読み込み
  const headerTemplate = loadTemplate('header');
  const footerTemplate = loadTemplate('footer');
  
  // テンプレート変数置換
  const header = replaceTemplateVars(headerTemplate, vars);
  const footer = replaceTemplateVars(footerTemplate, vars);
  
  // 既存のヘッダー/フッターを削除
  let processedContent = content
    .replace(/<header[^>]*>[\s\S]*?<\/header>/g, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/g, '')
    .replace(/<script[^>]*template-loader\.js[^>]*><\/script>/g, '');
  
  // 新しいヘッダー/フッターを挿入
  processedContent = processedContent.replace(
    /<body[^>]*>/,
    `$&\n${header}`
  );
  
  processedContent = processedContent.replace(
    /<\/body>/,
    `${footer}\n$&`
  );
  
  return processedContent;
}

// メイン処理
function buildStatic() {
  console.log('🚀 Static Site Generation 開始...');
  
  // 出力ディレクトリ作成
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
  
  // ページ一覧取得
  const pages = [
    { file: 'index.html', isSubPage: false },
    ...fs.readdirSync(config.pagesDir)
      .filter(file => file.endsWith('.html'))
      .map(file => ({ file, isSubPage: true }))
  ];
  
  // 各ページを処理
  pages.forEach(({ file, isSubPage }) => {
    const inputPath = isSubPage 
      ? path.join(config.pagesDir, file)
      : path.join(__dirname, '..', file);
    const outputPath = path.join(config.outputDir, file);
    
    try {
      const processedContent = processPage(inputPath, isSubPage);
      fs.writeFileSync(outputPath, processedContent, 'utf8');
      console.log(`✅ ${file} を生成しました`);
    } catch (error) {
      console.error(`❌ ${file} の処理中にエラー:`, error.message);
    }
  });
  
  // 静的アセットをコピー
  const assetsDir = path.join(config.outputDir, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  
  // CSS、JS、画像をコピー
  const staticDirs = ['css', 'js', 'images', 'assets'];
  staticDirs.forEach(dir => {
    const srcDir = path.join(__dirname, '..', dir);
    const destDir = path.join(config.outputDir, dir);
    
    if (fs.existsSync(srcDir)) {
      fs.cpSync(srcDir, destDir, { recursive: true });
      console.log(`📁 ${dir} をコピーしました`);
    }
  });
  
  console.log('🎉 Static Site Generation 完了！');
  console.log(`📂 出力先: ${config.outputDir}`);
}

// 実行
if (require.main === module) {
  buildStatic();
}

module.exports = { buildStatic, processPage };
