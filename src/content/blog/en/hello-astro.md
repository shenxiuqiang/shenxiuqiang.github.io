---
title: 'Build an Auto-Publishing Blog with Markdown + Astro + GitHub Actions'
description: 'Separate writing from publishing: you write Markdown locally, and Astro plus GitHub Actions take care of the rest.'
pubDate: '2026-10-07'
tags: ['Astro', 'GitHub Pages', 'Automation']
---

This setup really only solves one problem: **while you're writing, you shouldn't have to think about the website.**

Running a blog used to mean juggling content, templates, builds, and uploads all at once. Now the whole pipeline looks like this:

```text
Write Markdown locally
      ↓  git push
GitHub Actions builds automatically
      ↓
Astro generates static HTML
      ↓
GitHub Pages serves the site
```

I only do the first step. Everything after that happens on its own.

## What each piece does

**Markdown — content only**
A post is just a `.md` file under `src/content/blog/`, starting with a frontmatter block that carries the metadata:

```yaml
---
title: 'Post title'
description: 'One-sentence summary'
pubDate: '2026-10-07'
tags: ['Astro']
---
```

**Astro — turns Markdown into web pages**
Astro is a static site generator (SSG). The moment I hit build, it compiles every Markdown file into plain HTML. So when a visitor opens a page, they get HTML that's already rendered — **no waiting for JavaScript to assemble the page**, which keeps the first paint fast and SEO friendly.

**GitHub Actions — the automation piece**
Every time I `git push` to `main`, GitHub spins up a machine, installs dependencies, runs `npm run build`, and uploads the output. I don't need a local environment set up at all — I can even fix a post from my phone.

**GitHub Pages — free hosting**
The build output is published to GitHub Pages, which comes with HTTPS and a CDN. No server to buy, no domain to configure.

## Why Astro

I compared a few options, and here's why Astro won:

- **Zero JavaScript by default.** A blog is a content site; it doesn't need the SPA machinery.
- **Content first.** Markdown is a first-class citizen, not something bolted on by a plugin.
- **Code highlighting at build time.** Code blocks in posts are highlighted during the build, so the front end ships no highlighting library at all.
- **Interactive when you want it.** When you genuinely need an interactive component, you can pull React/Vue/Svelte into that one component and leave everything else as static HTML.

## The day-to-day writing flow

Write a post, push it, done:

```bash
git add .
git commit -m "post: new article"
git push
```

A minute or two later, the live site is up to date. To preview locally, run `npm run dev` — the browser hot-reloads as you edit Markdown.

## What to do next

- Hook up [giscus](https://giscus.app) for comments (it runs on GitHub Discussions, and it's free)
- Add `@astrojs/sitemap` (already configured) and submit the site to search engines
- Hide unfinished posts with `draft: true`, so they're only visible to you locally
