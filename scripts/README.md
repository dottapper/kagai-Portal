# データビルドスクリプト

このディレクトリには、ExcelファイルをJSONに変換するビルドスクリプトが含まれています。

## 使用方法

### 1. 依存関係のインストール
```bash
npm install
```

### 2. Excel→JSON変換の実行
```bash
npm run build:json
```

または

```bash
node excel-to-json.js
```

## ファイル説明

- `excel-to-json.js`: Excelファイル（`../assets/花街map.xlsx`）をJSONファイル（`../assets/hanamachi-data.json`）に変換
- `package.json`: Node.js依存関係とビルドスクリプトの定義

## 出力

変換されたJSONファイルは `../assets/hanamachi-data.json` に保存され、以下の構造になります：

```json
{
  "kyoto": [
    {
      "id": "京都府-祇園甲部（ぎおんこうぶ）",
      "pref": "京都府",
      "name": "祇園甲部（ぎおんこうぶ）",
      "area": "京都府京都市東山区祇園町南側周辺",
      "image": "",
      "details": "日本最大の花街で...",
      "regionKey": "kyoto"
    }
  ],
  "tokyo": [...],
  "ishikawa": [...]
}
```

## 注意事項

- Excelファイルの構造が変更された場合は、`excel-to-json.js`の列名マッピングを更新してください
- 新しい地域を追加する場合は、`extractPrefecture`と`getRegionKey`関数を更新してください
