const fs = require('fs');
const path = require('path');

const normalizeBasePath = (value = "/") => {
  if (!value || value === "/") {
    return "/";
  }

  let base = value.trim();
  if (!base.startsWith("/")) {
    base = `/${base}`;
  }
  if (!base.endsWith("/")) {
    base = `${base}/`;
  }

  return base.replace(/\/{2,}/g, "/");
};

const joinWithBase = (base, target = "") => {
  const normalizedTarget = target.startsWith("/") ? target.slice(1) : target;
  if (!normalizedTarget) {
    return base;
  }
  if (base === "/") {
    return `/${normalizedTarget}`.replace(/\/{2,}/g, "/");
  }
  return `${base}${normalizedTarget}`.replace(/\/{2,}/g, "/");
};

const resolveBasePath = () => {
  const explicit = process.env.ELEVENTY_BASE_PATH || process.env.BASE_PATH;
  if (explicit) {
    return explicit;
  }

  const isGitHubPages = process.env.GITHUB_PAGES === 'true';
  const hasCname = fs.existsSync(path.join(__dirname, '..', 'CNAME'));

  if (isGitHubPages && !hasCname) {
    const repo = process.env.GITHUB_REPOSITORY || '';
    const repoName = repo.split('/')[1];
    if (repoName) {
      return `/${repoName}/`;
    }
  }

  return "/";
};

const basePath = normalizeBasePath(resolveBasePath());
const withBase = (target) => joinWithBase(basePath, target);

module.exports = {
  title: "全国花街ポータル",
  description: "全国の花街文化を一箇所で。美しく静謐な情報体験を。",
  url: "https://hanamachi-portal.com",
  author: "全国花街ポータル",
  basePath,
  paths: {
    root: basePath,
    css: withBase("/css/"),
    js: withBase("/js/"),
    images: withBase("/images/"),
    assets: withBase("/assets/"),
    pages: withBase("/pages/")
  },
  social: {
    twitter: "@hanamachi_portal",
    facebook: "hanamachi.portal",
    instagram: "hanamachi_portal"
  },
  navigation: [
    {
      title: "イベント",
      url: withBase("/pages/events.html")
    },
    {
      title: "花街ガイド",
      url: withBase("/pages/guide.html")
    },
    {
      title: "コラム・読み物",
      url: withBase("/pages/columns.html")
    },
    {
      title: "SNS・リンク",
      url: withBase("/pages/sns-links.html")
    },
    {
      title: "ニュース",
      url: withBase("/pages/updates.html")
    }
  ]
};
