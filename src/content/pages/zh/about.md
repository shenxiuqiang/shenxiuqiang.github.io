---
title: '关于我'
description: '关于这个站点，以及它是怎么搭起来的。'
---

你好，我是 shenxiuqiang。这里是我的个人站点，主要用来写一些技术笔记、读书笔记和日常折腾的记录。

## 这个站点是怎么搭的

- **写作**：本地写 Markdown 文件，放在 `src/content/blog/zh/`
- **生成**：Astro 在构建时把 Markdown 编译成静态 HTML
- **构建**：推送到 `main` 分支后，GitHub Actions 自动跑 `npm run build`
- **发布**：构建产物自动部署到 GitHub Pages

整套流程不需要服务器，也没有数据库，全站就是一堆静态文件。

## 中英文双语

中文写在 `src/content/blog/zh/`，英文写在 `src/content/blog/en/`，**文件名相同**即视为同一篇文章的两个版本。

英文版由 AI 翻译：写完中文之后让 AI 翻一份同名文件，两边就会同时发布；页面之间会自动加上 `hreflang` 关联和语言切换入口。

还没有英文版的文章，英文站会跳过它（构建日志里会列出来），但不会阻断发布。

## 关于评论

目前还没有加评论系统。如果之后需要，可以接入 [giscus](https://giscus.app)（基于 GitHub Discussions，免费且无需后端）。

## 联系我

可以在 [GitHub](https://github.com/shenxiuqiang) 上找到我。
