const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // テンプレートエンジンの設定
  eleventyConfig.setTemplateFormats([
    "md",
    "html",
    "njk",
    "liquid"
  ]);

  // 静的ファイルのコピー
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("pages");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");

  // フィルターの追加
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("yyyy年MM月dd日");
  });

  // ショートコードの追加（削除済み - テンプレートファイルを使用）

  // 設定
  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    }
  };
};
