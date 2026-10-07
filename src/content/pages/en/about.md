---
title: 'About'
description: 'About this site and how it is put together.'
---

Hi, I'm shenxiuqiang. This is my personal site — mostly technical notes, reading notes, and records of things I break and fix.

## How this site is built

- **Writing**: Markdown files on my machine, under `src/content/blog/en/`
- **Generation**: Astro compiles the Markdown into static HTML at build time
- **Building**: pushing to `main` triggers GitHub Actions to run `npm run build`
- **Publishing**: the build output is deployed to GitHub Pages

No server, no database — the whole site is just a folder of static files.

## Bilingual, in Chinese and English

Chinese posts live in `src/content/blog/zh/` and English ones in `src/content/blog/en/`. Two files with the **same filename** are treated as two language versions of the same article.

The English versions are AI-translated: after writing a Chinese post, I have an AI produce an English file with the same name. Both go live together, and the pages are linked to each other with `hreflang` plus a language switcher.

If a post has no English version yet, the English site simply skips it (the build log lists what's missing) rather than blocking the deploy.

## Comments

There's no comment system yet. If I add one, it will probably be [giscus](https://giscus.app) — it runs on GitHub Discussions, costs nothing, and needs no backend.

## Get in touch

You can find me on [GitHub](https://github.com/shenxiuqiang).
