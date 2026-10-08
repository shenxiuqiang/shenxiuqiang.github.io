---
title: '用 Markdown + Astro + GitHub Actions 搭一个自动发布的博客'
description: '把「写文章」和「发布网站」彻底分开：本地只写 Markdown，剩下的事交给 Astro 和 GitHub Actions。'
pubDate: '2025-04-01'
tags: ['Astro', 'GitHub Pages', '自动化']
---

这套流程解决的核心问题只有一个：**写文章的时候不要管网站。**

以前维护一个博客，得同时操心内容、模板、构建、上传。现在整条链路是这样的：

```text
本地写 Markdown
      ↓  git push
GitHub Actions 自动构建
      ↓
Astro 生成静态 HTML
      ↓
GitHub Pages 上线
```

我只需要做第一步，剩下的全是自动的。

## 每一环分别在干什么

**Markdown —— 只负责内容**
文章就是 `src/content/blog/` 下的一个 `.md` 文件，开头写一段 frontmatter 描述元信息：

```yaml
---
title: '文章标题'
description: '一句话摘要'
pubDate: '2026-10-07'
tags: ['Astro']
---
```

**Astro —— 把 Markdown 变成网页**
Astro 是静态站点生成器（SSG）。它在我按下构建的那一刻，把所有 Markdown 编译成纯 HTML 文件。所以访客打开页面时，收到的是已经渲染好的 HTML，**不需要等 JavaScript 去拼页面**，首屏很快，SEO 也友好。

**GitHub Actions —— 自动化的那一环**
每次 `git push` 到 `main`，GitHub 会自动开一台机器，装上依赖、跑 `npm run build`、把产物上传。全程我不需要本地装好环境，甚至可以用手机改一篇文章。

**GitHub Pages —— 免费托管**
构建产物被发布到 GitHub Pages 上，自带 HTTPS 和 CDN，不用买服务器，也不用配域名。

## 为什么选 Astro

我对比过几个方案，最后选 Astro 的原因是：

- **默认零 JavaScript**。博客是内容站，不需要 SPA 那套东西。
- **内容优先**。Markdown 是一等公民，不是"插件支持"。
- **构建时高亮代码**。文章里的代码块在构建阶段就上好色，前端不加载任何高亮库。
- **想加交互随时能加**。真需要交互组件时，可以只在那一个组件里引入 React/Vue/Svelte，其余部分依然是静态 HTML。

## 日常写作流

写完一篇文章，推上去就完事了：

```bash
git add .
git commit -m "post: 新文章"
git push
```

一两分钟后，线上就是最新的。想本地预览效果就跑 `npm run dev`，改 Markdown 时浏览器会热更新。

## 下一步可以做什么

- 接入 [giscus](https://giscus.app) 加评论区（基于 GitHub Discussions，免费）
- 加 `@astrojs/sitemap`（已经配好了）提交到搜索引擎
- 用 `draft: true` 把没写完的文章藏起来，只在本地可见
