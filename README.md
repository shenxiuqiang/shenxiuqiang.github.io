# shenxiuqiang.github.io

中英双语个人博客。用 Markdown 写文章，Astro 生成静态页面，GitHub Actions 自动构建并发布到 GitHub Pages。

- 中文站：<https://shenxiuqiang.github.io/zh/>
- 英文站：<https://shenxiuqiang.github.io/en/>

## 工作流

```
写中文 Markdown  →  AI 翻译成英文  →  git push  →  GitHub Actions 构建  →  GitHub Pages 发布
```

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会自动构建和部署，通常 1～2 分钟上线。

## 本地开发

```bash
npm install     # 安装依赖
npm run dev     # 开发服务器 → http://localhost:4321
npm run build   # 构建到 dist/
npm run preview # 预览构建产物
```

## 写一篇新文章

中文和英文各放一个文件，**文件名必须相同** —— 站点靠文件名把两个语言版本配对：

```
src/content/blog/zh/my-post.md   →  /zh/blog/my-post/
src/content/blog/en/my-post.md   →  /en/blog/my-post/
```

两边的 frontmatter 都需要（结构完全一致）：

```yaml
---
title: '文章标题'          # 必填
description: '一句话摘要'   # 必填，用于列表页和 SEO
pubDate: '2026-10-07'      # 必填，中英两个文件必须一致
updatedDate: '2026-10-10'  # 选填
tags: ['Astro', '笔记']     # 选填，默认 []
draft: false               # 选填，true = 只在本地 dev 可见
---
```

### 日常流程

1. 在 `src/content/blog/zh/` 写一篇中文文章
2. 让 AI 翻译成英文，输出到 `src/content/blog/en/`（同名文件）
3. `git push`，中英文同时上线

### 缺少英文版时会怎样

**只警告，不阻断发布。** 构建日志里会列出缺哪些文件，英文站暂时跳过该篇，中文站照常上线：

```
[翻译缺失] 1 篇中文文章还没有英文版，英文站会跳过它们：
  · src/content/blog/en/my-post.md
  补齐方式：直接让 AI 翻译，或自己新建同名文件。
```

这时候英文页面的语言切换器会退到英文文章列表，而不是指向一个 404。

## 目录结构

```
├── .github/workflows/deploy.yml   # CI：构建 + 部署
├── public/                        # 静态资源，原样复制到站点根目录
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── BaseHead.astro         # <head>：canonical、hreflang、OG 标签
│   │   ├── Header.astro           # 顶部导航（含语言切换器）
│   │   ├── Footer.astro
│   │   ├── PostList.astro         # 文章卡片列表
│   │   ├── FormattedDate.astro    # 按语言格式化日期
│   │   ├── HeaderLink.astro       # 导航项，自动高亮当前页
│   │   ├── LangSwitch.astro       # 中/英切换按钮
│   │   └── Redirect.astro         # 旧地址跳转页
│   ├── content/
│   │   ├── blog/zh/               # ← 中文文章
│   │   ├── blog/en/               # ← 英文文章
│   │   ├── pages/zh/              # 独立页面（关于页）
│   │   └── pages/en/
│   ├── i18n/
│   │   ├── ui.ts                  # 全站文案字典（中英并排）
│   │   └── utils.ts               # 语言路径助手
│   ├── layouts/
│   │   ├── BaseLayout.astro       # 全站 HTML 外壳
│   │   └── BlogPost.astro         # 文章页排版
│   ├── pages/
│   │   ├── [lang]/                # 一个文件生成中英两份页面
│   │   │   ├── index.astro        #   /zh/  /en/
│   │   │   ├── about.astro        #   /zh/about/  /en/about/
│   │   │   ├── rss.xml.js         #   /zh/rss.xml  /en/rss.xml
│   │   │   └── blog/
│   │   │       ├── index.astro    #   /zh/blog/  /en/blog/
│   │   │       └── [...slug].astro#   /zh/blog/<文件名>/
│   │   ├── index.astro            # 旧地址跳转：/ → /zh/
│   │   ├── about.astro            # 旧地址跳转
│   │   ├── blog/                  # 旧地址跳转
│   │   ├── rss.xml.js             # 老订阅者的中文订阅源
│   │   └── 404.astro              # 中英双语 404
│   ├── styles/global.css          # 全局样式与配色变量
│   ├── utils/
│   │   ├── posts.ts               # 取文章、阅读时长、缺译文告警
│   │   └── rss.ts                 # RSS 生成
│   └── content.config.ts          # 内容集合 schema 校验
└── astro.config.mjs
```

## 常改的地方

| 想改什么 | 改哪里 |
| --- | --- |
| 站点名 | `src/consts.ts` |
| 导航文字、页脚、首页文案、404 文案 | `src/i18n/ui.ts`（中英并排） |
| 配色、字体、间距 | `src/styles/global.css` 顶部的 CSS 变量 |
| 「关于」页内容 | `src/content/pages/{zh,en}/about.md` |
| 文章页排版 | `src/layouts/BlogPost.astro` |
| 代码块高亮主题 | `astro.config.mjs` 里的 `shikiConfig.theme` |
| 加一种语言 | `src/i18n/ui.ts` 的 `LOCALES` + 补一份字典，TypeScript 会检查漏字段 |

## 双语实现要点

- **URL 结构**：中文 `/zh/...`，英文 `/en/...`，两边完全对称。
- **译文配对**：靠文件名。`blog/zh/foo.md` ↔ `blog/en/foo.md`。
- **语言标注**：`<html lang>`、每页的 `<link rel="alternate" hreflang>`（含 `x-default`）都按语言输出，告诉搜索引擎这是同一内容的不同语言版本，不是重复内容。
- **旧链接**：站点原先中文在根路径（`/blog/hello-astro/`），改成 `/zh/` 后这些地址会失效。`src/pages/{index,about,blog}` 下生成了带 `meta refresh` 和 `canonical` 的跳转页，老链接照样能打开。这些跳转页带 `noindex`，并且已从 sitemap 中排除。
- **阅读时长**：中文按 400 字/分钟，英文按 200 词/分钟，分别计算。
- **日期**：中文 `2026年10月7日`，英文 `October 7, 2026`。

> 为什么 sitemap 不用 `@astrojs/sitemap` 的 `i18n` 选项？它假设「默认语言不带前缀」（Astro 的 `prefixDefaultLocale: false` 行为）。我们两种语言都带前缀，套用后会生成重复的 `hreflang="zh-CN"`，并把跳转页当成中文版正主。语言互指统一以页面里的 `<link rel="alternate" hreflang>` 为准。

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
