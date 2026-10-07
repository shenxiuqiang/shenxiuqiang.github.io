---
title: 'Markdown Writing Cheat Sheet'
description: 'Headings, lists, code blocks, tables, blockquotes — the Markdown syntax I reach for most, doubling as a typography sample.'
pubDate: '2026-09-28'
tags: ['Markdown', 'Writing']
---

This post is both a syntax cheat sheet and a typography sample — a look at how each element actually renders in this theme.

## Headings

Use `#` through `######` for levels one to six. In a post I normally only reach for `##` and `###`, since `#` is already reserved for the post title.

## Emphasis

- `**bold**` → **bold**
- `*italic*` → *italic*
- `` `inline code` `` → `inline code`
- `~~strikethrough~~` → ~~strikethrough~~

## Lists

Unordered lists use `-`:

- First item
- Second item
  - A nested child item
  - And another one

Ordered lists use `1.`:

1. Step one
2. Step two
3. Step three

## Links and images

```markdown
[Link text](https://astro.build)
![Image description](/images/photo.png)
```

Put images in `public/` and reference them with an absolute path like `/images/photo.png`.

## Code blocks

Wrap them in three backticks and annotate the language; Astro adds syntax highlighting at build time:

````markdown
```javascript
const posts = await getCollection('blog');
export default posts.sort((a, b) => b.data.pubDate - a.data.pubDate);
```
````

Rendered:

```javascript
const posts = await getCollection('blog');
export default posts.sort((a, b) => b.data.pubDate - a.data.pubDate);
```

For inline code use a single backtick, like `npm run build`.

## Blockquotes

> Good tools should make you forget the tool itself exists.
>
> Blogging works the same way — open the editor and start writing, instead of fiddling with your environment first.

## Tables

| Syntax | Purpose | Notes |
| --- | --- | --- |
| `#` | Level-one heading | Usually reserved for the post title |
| `-` | Unordered list | Can be nested |
| `>` | Blockquote | Supports multiple paragraphs |
| `\|` | Table column separator | Required in a table |

## Horizontal rules

Three hyphens make a horizontal rule:

---

That's about it. Ninety percent of everyday writing uses fewer than ten syntaxes, and it's fine if you can't remember them — come back and skim this when you need to.
