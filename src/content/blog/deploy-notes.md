---
title: 'GitHub Pages 部署：几个容易踩的坑'
description: 'base 路径、Pages 的 Source 设置、构建缓存 —— 从零部署时最容易卡住的几个地方。'
pubDate: '2026-09-15'
tags: ['GitHub Pages', 'CI/CD', 'Astro']
---

把 Astro 部署到 GitHub Pages 本身不难，但有几个地方特别容易卡住。记录一下。

## 坑一：仓库名决定要不要配 base

GitHub Pages 有两种仓库：

| 仓库类型 | 例子 | 线上地址 | 要不要配 `base` |
| --- | --- | --- | --- |
| 用户主页 | `<用户名>.github.io` | `https://<用户名>.github.io/` | **不需要** |
| 项目页 | 其他任意名字 | `https://<用户名>.github.io/<仓库名>/` | 需要，`base: '/<仓库名>'` |

本站仓库名就是 `shenxiuqiang.github.io`，属于第一种，站点根路径就是 `/`，所以配置里只写了 `site`：

```javascript
export default defineConfig({
  site: 'https://shenxiuqiang.github.io',
});
```

如果是第二种仓库，还得多写一行 `base: '/仓库名'`，**并且**页面里所有内部链接都要手动带上这个前缀，否则会 404。这是最容易漏的地方。

## 坑二：Pages 的 Source 必须选 "GitHub Actions"

仓库 **Settings → Pages → Source** 有两个选项：

- `Deploy from a branch` —— 传统方式，直接发布某个分支的目录
- `GitHub Actions` —— 发布 workflow 上传的构建产物

用 Astro 必须选后者。如果还停留在前者，那么 Actions 跑成功了，线上却还是老内容 —— 因为 Pages 根本没在看构建产物。

用命令行确认当前设置：

```bash
gh api repos/<用户名>/<仓库名>/pages --jq '.build_type'
```

返回 `workflow` 说明配置正确。

## 坑三：lockfile 必须提交

官方的 `withastro/action` 靠 **lockfile 判断你用哪个包管理器**：

- `package-lock.json` → npm
- `pnpm-lock.yaml` → pnpm
- `yarn.lock` → yarn
- `bun.lockb` → bun

如果 lockfile 被写进了 `.gitignore` 没提交，CI 里会退化成 npm 但装出不确定的依赖版本，构建结果和本地不一致。

`.gitignore` 里应该只忽略 `node_modules/`，**不要**忽略 lockfile。

## 坑四：`site` 忘了改默认值

Astro 模板里 `site` 默认是 `https://example.com`。这个值影响：

- RSS 里的文章链接
- `sitemap-index.xml` 里的 URL
- 页面的 canonical 标签

忘了改的话，搜索引擎会收到一堆指向 `example.com` 的地址。记得换成自己的域名。

## 完整的 workflow

放在 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: withastro/action@v6

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

`withastro/action` 把「装依赖 → 构建 → 上传产物」三步都包好了，所以 build job 只有两行。

## 排查思路

构建失败时按这个顺序看：

1. Actions 页面里 `build` job 的日志 —— 通常是依赖问题或 Markdown frontmatter 格式错误
2. `deploy` job 的日志 —— 通常是权限或 Pages 设置问题
3. 都成功但线上没变化 —— 多半是缓存或者 Pages 的 Source 选错了

内容集合（Content Collections）的好处在这里体现得很明显：frontmatter 字段写错会在**构建阶段**直接报错，而不是悄悄生成一个空白页面。
