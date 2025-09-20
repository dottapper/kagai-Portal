# 全国花街ポータルサイト

日本の伝統文化である花街・芸者文化を紹介するポータルサイトです。Eleventy を使用した静的サイトジェネレーターで構築されています。

## 📁 プロジェクト構造

```
全国花街サイト/
├── package.json                   # npm設定ファイル
├── .eleventy.js                   # Eleventy設定
├── index.html                     # トップページ（レガシー）
├── _layouts/                      # Eleventyレイアウト
│   └── base.njk                   # ベースレイアウト
├── _includes/                     # Eleventyインクルード
│   ├── header.njk                 # ヘッダーテンプレート
│   └── footer.njk                 # フッターテンプレート
├── _data/                         # グローバルデータ
│   └── site.json                  # サイト設定・ナビゲーション
├── pages/                         # レガシーHTMLページ
│   ├── events.html               # イベントページ
│   ├── guide.html                # 花街ガイド
│   ├── columns.html              # コラム・読み物
│   ├── sns-links.html            # SNS・リンク
│   ├── updates.html              # ニュース
│   ├── about.html                # サイト概要
│   ├── contact.html              # お問い合わせ
│   ├── privacy.html              # プライバシーポリシー
│   ├── culture.html              # 文化
│   ├── glossary.html             # 用語集
│   ├── manners.html              # マナー
│   ├── overseas.html             # 海外向け
│   ├── press.html                # プレスリリース
│   ├── event-detail.html         # イベント詳細
│   └── kagai-detail.html         # 花街詳細
├── *.njk                         # Eleventyテンプレート（新規）
│   ├── events.njk                # イベントページ（移行済み）
│   ├── guide.njk                 # 花街ガイド（移行済み）
│   ├── columns.njk               # コラム・読み物（移行済み）
│   └── events-eleventy.njk       # サンプルページ
├── css/                          # スタイルシート
│   ├── styles.css                # メインスタイル
│   ├── events.css                # イベントページ専用
│   ├── guide.css                 # 花街ガイド専用
│   ├── columns.css               # コラム・読み物専用
│   ├── sns-links.css             # SNS・リンク専用
│   ├── updates.css               # ニュース専用
│   ├── heroSlider.css            # ヒーロースライダー
│   ├── japanMapSpace.css         # 日本地図
│   ├── contact.css               # お問い合わせ
│   ├── privacy.css               # プライバシーポリシー
│   ├── culture.css               # 文化
│   ├── glossary.css              # 用語集
│   ├── manners.css               # マナー
│   ├── overseas.css              # 海外向け
│   └── press.css                 # プレスリリース
├── js/                           # JavaScript
│   ├── script.js                 # メインスクリプト
│   ├── heroSlider.js             # ヒーロースライダー
│   ├── lang-switcher.js          # 言語切り替え
│   ├── calendar.js               # カレンダー機能
│   ├── glossary.js               # 用語集機能
│   ├── contact.js                # お問い合わせフォーム
│   ├── press.js                  # プレスリリース機能
│   ├── japanMap.js               # 日本地図機能
│   ├── kagai-detail.js           # 花街詳細
│   ├── event-detail.js           # イベント詳細
│   ├── template-loader.js        # テンプレートローダー
│   └── xlsx-loader.js            # Excel読み込み
├── images/                       # 画像ファイル
│   ├── top/                      # トップページ用画像
│   ├── 1月/～12月/               # 月別イベント画像
│   └── *.jpg, *.jpeg, *.webp    # その他画像
├── assets/                       # アセットファイル
│   ├── logo.png                  # サイトロゴ
│   ├── map.png                   # 日本地図
│   ├── kagai-data.json           # 花街データ
│   └── *.xlsx                    # Excelファイル
├── templates/                    # レガシーテンプレート
│   ├── header.html               # ヘッダーテンプレート
│   └── footer.html               # フッターテンプレート
├── scripts/                      # ビルドスクリプト
│   ├── excel-to-json.js          # Excel→JSON変換
│   ├── update-templates.js       # テンプレート更新
│   └── verify-templates.js       # テンプレート検証
├── _site/                        # ビルド出力（自動生成）
├── sitemap.xml                   # サイトマップ
├── robots.txt                    # ロボット設定
└── README.md                     # このファイル
```

## 🚀 開発・ビルド

### 必要な環境

- Node.js 16.0.0 以上
- npm

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 本番ビルド
npm run build
```

### 利用可能なコマンド

- `npm run build` - 完全ビルド（JSON 変換 + Eleventy）
- `npm run build:json` - Excel→JSON 変換のみ
- `npm run build:eleventy` - Eleventy ビルドのみ
- `npm run serve` - 開発サーバー起動
- `npm run dev` - ビルド + 開発サーバー
- `npm run clean` - ビルド成果物の削除

## 🎯 サイト構造

### メインナビゲーション

1. **イベント** - 月別カレンダー、年中行事一覧、過去イベントアーカイブ
2. **花街ガイド** - 花街とは、歴史と文化、体験方法、基本マナー
3. **コラム・読み物** - 特集記事、インタビュー、エッセイ
4. **SNS・リンク** - 各花街 Instagram、関連リンク集
5. **ニュース** - サイトからのお知らせ、コンテンツ追加履歴

### フッターメニュー

- サイト概要
- お問い合わせ
- プライバシーポリシー

## 🎨 デザイン特徴

- **明朝体フォント** - Noto Serif JP による上品な表示
- **完全レスポンシブ** - モバイル、タブレット、デスクトップ対応
- **モダンデザイン** - 洗練された UI/UX
- **アクセシビリティ** - ARIA 属性、キーボードナビゲーション、スキップリンク対応
- **パフォーマンス最適化** - 高速読み込みと滑らかなアニメーション
- **テーマ切り替え** - ライトテーマ（デフォルト）とダークテーマ対応
- **地域タグ色分け** - 各花街地域を色で識別

### 🏷️ 地域タグの色分け

イベントカードやモーダルで使用される地域タグの色分けは以下の通りです：

| 地域名 | 背景色            | CSS クラス       |
| ------ | ----------------- | ---------------- |
| 葭町   | #6BA276（緑）     | `tag-yoshicho`   |
| 新橋   | #9CC3D5（青）     | `tag-shinbashi`  |
| 赤坂   | #E6B39A（橙）     | `tag-akasaka`    |
| 神楽坂 | #FFF200（黄）     | `tag-kagurazaka` |
| 浅草   | #B8DBA0（薄緑）   | `tag-asakusa`    |
| 向島   | #E6C8DE（薄紫）   | `tag-mukojima`   |
| 八王子 | #B266A0（紫）     | `tag-hachioji`   |
| 渋谷   | #F6B500（濃い黄） | `tag-shibuya`    |

**使用例:**

```html
<div class="event-tag tag-asakusa">タグ：浅草</div>
<div class="kagai-tag tag-kagurazaka">神楽坂</div>
```

**CSS ファイル:**

- `css/events.css` - カレンダーモーダル用
- `css/monthly-events.css` - 月別イベントページ用

## 🔧 技術仕様

- **Eleventy** - 静的サイトジェネレーター
- **Nunjucks** - テンプレートエンジン
- **HTML5** - セマンティックマークアップ
- **CSS3** - Grid Layout、Flexbox、CSS Variables
- **Vanilla JavaScript** - フレームワークなしの高速実装
- **レスポンシブデザイン** - Mobile-First アプローチ
- **Web Standards** - W3C 準拠

## 📊 移行状況

### ✅ 移行完了

- `events.html` → `events.njk` (464 行削減)
- `guide.html` → `guide.njk` (コンテンツ保持)
- `columns.html` → `columns.njk` (37 行削減)

### 🔄 移行予定

- `sns-links.html` → `sns-links.njk`
- `updates.html` → `updates.njk`
- `culture.html` → `culture.njk`
- `manners.html` → `manners.njk`
- その他のページ

### 📈 移行効果

- **重複コード削除**: 約 500 行の重複コードを排除
- **保守性向上**: ヘッダー・フッターの一元管理
- **開発効率**: テンプレート化による効率化
- **パフォーマンス**: ファイルサイズの削減

## 🚀 使用方法

1. `npm run dev` で開発サーバーを起動
2. `http://localhost:8080` でサイトを確認
3. メニューから各ページにナビゲート
4. インタラクティブな機能を体験

## 📱 動作確認済み環境

- **ブラウザ**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **デバイス**: Desktop, Tablet, Mobile
- **解像度**: 320px〜4K 対応

## 📅 現在の日付表示機能

### 動的月表示

サイトは現在の日付に基づいて適切な月のタブを自動的に表示します：

- **イベントページ** (`pages/events.html`): 現在の月のイベントタブがアクティブに表示
- **月別イベント詳細ページ** (`pages/monthly-events.html`): 現在の月のイベント詳細タブがアクティブに表示
- **カレンダー** (`js/calendar.js`): 現在の月のカレンダーが表示

### 実装方法

```javascript
// 現在の月を動的に設定
document.addEventListener("DOMContentLoaded", function () {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 0ベースなので+1

  // 現在の月のタブをアクティブに設定
  const currentMonthBtn = document.querySelector(
    `[data-month="${currentMonth}"]`
  );
  const currentMonthContent = document.querySelector(
    `.month-content[data-month="${currentMonth}"]`
  );

  if (currentMonthBtn) currentMonthBtn.classList.add("active");
  if (currentMonthContent) currentMonthContent.classList.add("active");
});
```

### 静的サイトでの動作

この機能は**静的サイトでも完全に動作**します：

- **クライアントサイド JavaScript**: ブラウザで現在の日付を取得
- **サーバーサイド不要**: 静的ファイルとして配信可能
- **Eleventy 不要**: ビルド時に日付を埋め込む必要がない
- **リアルタイム更新**: ページを開くたびに現在の日付を取得

## 🔧 後で修正したい箇所

### イベントカードのタグ表示

- **6 月のカードのタグを 2 つ表示させる**: 第一回札幌をどりのイベントで、新橋・赤坂の 2 つのタグを正しく表示する機能の改善
  - 現在は 5 月の形式を参考に手動で 2 つのタグを配置しているが、より柔軟な複数タグ表示システムの実装を検討
  - カレンダーモーダル、イベントカード、月別イベント詳細ページでの一貫した複数タグ表示の統一

## 📝 ライセンス

© 2025 全国花街ポータルサイト. All rights reserved.
