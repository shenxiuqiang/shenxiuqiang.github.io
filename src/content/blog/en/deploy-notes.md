---
title: 'Deploying to GitHub Pages: A Few Easy Pitfalls'
description: 'The base path, the Pages Source setting, build caching — the spots where a from-scratch deploy most often gets stuck.'
pubDate: '2026-09-15'
tags: ['GitHub Pages', 'CI/CD', 'Astro']
---

Deploying Astro to GitHub Pages isn't hard in itself, but a few things get you stuck surprisingly easily. Writing them down here.

## Pitfall 1: the repo name decides whether you need `base`

GitHub Pages has two kinds of repositories:

| Repository type | Example | Live URL | Need `base`? |
| --- | --- | --- | --- |
| User site | `<username>.github.io` | `https://<username>.github.io/` | **No** |
| Project site | Any other name | `https://<username>.github.io/<repo-name>/` | Yes, `base: '/<repo-name>'` |

This site's repo is named `shenxiuqiang.github.io`, which is the first kind — the site lives at the root path `/` — so the config only sets `site`:

```javascript
export default defineConfig({
  site: 'https://shenxiuqiang.github.io',
});
```

With the second kind of repo you'd also need a `base: '/repo-name'` line, **and** every internal link on your pages would have to carry that prefix by hand, or it 404s. That's the easiest thing to miss.

## Pitfall 2: Pages Source has to be set to "GitHub Actions"

Under **Settings → Pages → Source** there are two options:

- `Deploy from a branch` — the traditional route, publishing a directory from a branch
- `GitHub Actions` — publishing the build artifact uploaded by a workflow

With Astro you have to pick the latter. If you're still on the former, the Action runs successfully but the live site keeps serving stale content — because Pages was never looking at the build artifact at all.

Confirm the current setting from the command line:

```bash
gh api repos/<username>/<repo-name>/pages --jq '.build_type'
```

A return value of `workflow` means it's configured correctly.

## Pitfall 3: the lockfile has to be committed

The official `withastro/action` **uses the lockfile to tell which package manager you're on**:

- `package-lock.json` → npm
- `pnpm-lock.yaml` → pnpm
- `yarn.lock` → yarn
- `bun.lockb` → bun

If the lockfile ended up in `.gitignore` and never got committed, CI degrades to npm and installs unpredictable dependency versions, so the build no longer matches what you get locally.

`.gitignore` should ignore `node_modules/` and nothing else — **not** the lockfile.

## Pitfall 4: forgetting to change the default `site`

In the Astro template, `site` defaults to `https://example.com`. That value feeds into:

- Post links in the RSS feed
- URLs in `sitemap-index.xml`
- Each page's canonical tag

If you forget to change it, search engines get a pile of addresses pointing at `example.com`. Remember to set your own domain.

## The complete workflow

In `.github/workflows/deploy.yml`:

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

`withastro/action` wraps all three steps — install dependencies → build → upload the artifact — which is why the build job is only two lines.

## How to troubleshoot

When a build fails, look at things in this order:

1. The `build` job log on the Actions page — usually a dependency problem or a malformed Markdown frontmatter block
2. The `deploy` job log — usually a permissions or Pages configuration problem
3. Both succeeded but the live site hasn't changed — most likely caching, or the Pages Source is set wrong

This is where Content Collections earn their keep: a wrong frontmatter field fails the build **at build time**, instead of quietly generating a blank page.
