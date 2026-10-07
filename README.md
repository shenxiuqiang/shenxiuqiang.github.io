# shenxiuqiang.github.io

个人博客。用 Markdown 写文章，Astro 生成静态页面，GitHub Actions 自动构建并发布到 GitHub Pages。

线上地址：<https://shenxiuqiang.github.io/>

## 工作流

```
写 Markdown  →  git push  →  GitHub Actions 构建  →  GitHub Pages 发布
```

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会自动完成构建和部署，通常 1～2 分钟上线。

## 本地开发

```bash
npm install     # 安装依赖
npm run dev     # 启动开发服务器 → http://localhost:4321
npm run build   # 构建到 dist/
npm run preview # 本地预览构建产物
```

## 写一篇新文章

在 `src/content/blog/` 下新建一个 `.md` 文件，文件名就是 URL：

```
src/content/blog/my-post.md  →  /blog/my-post/
```

开头必须写 frontmatter：

```yaml
---
title: '文章标题'          # 必填
description: '一句话摘要'   # 必填，用于列表页和 SEO
pubDate: '2026-10-07'      # 必填
updatedDate: '2026-10-10'  # 选填
tags: ['Astro', '笔记']     # 选填，默认 []
draft: false               # 选填，true = 只在本地 dev 可见
---
```

写完直接 `git push`，线上会自动更新。

## 目录结构

```
├── .github/workflows/deploy.yml   # CI：构建 + 部署
├── public/                        # 静态资源，原样复制到站点根目录
│   └── favicon.svg
├── src/
│   ├── components/                # 可复用组件
│   │   ├── BaseHead.astro         # <head> 里的元信息
│   │   ├── Header.astro           # 顶部导航
│   │   ├── Footer.astro           # 页脚
│   │   ├── PostList.astro         # 文章卡片列表
│   │   ├── FormattedDate.astro    # 中文日期格式化
│   │   └── HeaderLink.astro       # 导航项（自动高亮当前页）
│   ├── content/blog/              # ← 文章都放这里
│   ├── layouts/
│   │   ├── BaseLayout.astro       # 全站 HTML 外壳
│   │   └── BlogPost.astro         # 文章页排版
│   ├── pages/                     # 文件路径 = URL
│   │   ├── index.astro            # /
│   │   ├── about.astro            # /about
│   │   ├── rss.xml.js             # /rss.xml
│   │   └── blog/
│   │       ├── index.astro        # /blog
│   │       └── [...slug].astro    # /blog/<文件名>
│   ├── styles/global.css          # 全局样式与配色变量
│   ├── utils/posts.ts             # 取文章、估算阅读时间
│   ├── content.config.ts          # 内容集合的 schema 校验
│   └── consts.ts                  # 站点标题、描述、导航
└── astro.config.mjs               # Astro 配置
```

## 常改的地方

| 想改什么 | 改哪里 |
| --- | --- |
| 站点标题 / 描述 / 导航 | `src/consts.ts` |
| 配色、字体、间距 | `src/styles/global.css` 顶部的 CSS 变量 |
| 首页文案 | `src/pages/index.astro` |
| 关于页 | `src/pages/about.astro` |
| 文章页排版 | `src/layouts/BlogPost.astro` |
| 代码块高亮主题 | `astro.config.mjs` 里的 `shikiConfig.theme` |

## 技术栈

- [Astro](https://astro.build) 7 —— 静态站点生成器，默认零 JavaScript
- [@astrojs/mdx](https://docs.astro.build/en/guides/integrations-guide/mdx/) —— 支持在 Markdown 里写组件
- [@astrojs/rss](https://docs.astro.build/en/guides/integrations-guide/rss/) —— 生成 RSS
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) —— 生成 sitemap
- Shiki —— 构建时代码高亮（Astro 内置）

## 部署说明

Pages 的 **Source 必须设为 `GitHub Actions`**（Settings → Pages）。可以用命令确认：

```bash
gh api repos/shenxiuqiang/shenxiuqiang.github.io/pages --jq '.build_type'
# 期望输出：workflow
```

因为仓库名是 `shenxiuqiang.github.io`（用户主页仓库），站点根路径就是 `/`，所以 `astro.config.mjs` 里**不需要**配置 `base`。
