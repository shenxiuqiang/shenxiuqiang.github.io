---
title: 'Markdown 写作速查'
description: '标题、列表、代码块、表格、引用……写文章时常用的 Markdown 语法，顺便当作排版样张。'
pubDate: '2026-09-28'
tags: ['Markdown', '写作']
---

这篇文章既是语法速查，也是排版样张 —— 看看各种元素在这个主题下的实际效果。

## 标题

用 `#` 到 `######` 表示一到六级标题。一篇文章里通常只用 `##` 和 `###`，因为 `#` 已经留给文章标题了。

## 强调

- `**粗体**` → **粗体**
- `*斜体*` → *斜体*
- `` `行内代码` `` → `行内代码`
- `~~删除线~~` → ~~删除线~~

## 列表

无序列表用 `-`：

- 第一项
- 第二项
  - 嵌套的子项
  - 再来一个

有序列表用 `1.`：

1. 第一步
2. 第二步
3. 第三步

## 链接和图片

```markdown
[链接文字](https://astro.build)
![图片描述](/images/photo.png)
```

图片放在 `public/` 目录下，用 `/images/photo.png` 这样的绝对路径引用即可。

## 代码块

用三个反引号包裹，并标注语言，Astro 会在构建时自动加上语法高亮：

````markdown
```javascript
const posts = await getCollection('blog');
export default posts.sort((a, b) => b.data.pubDate - a.data.pubDate);
```
````

效果：

```javascript
const posts = await getCollection('blog');
export default posts.sort((a, b) => b.data.pubDate - a.data.pubDate);
```

行内代码用单个反引号，比如 `npm run build`。

## 引用

> 好的工具应该让你忘记工具本身的存在。
>
> 写博客也一样 —— 打开编辑器就该开始写，而不是先折腾环境。

## 表格

| 语法 | 作用 | 备注 |
| --- | --- | --- |
| `#` | 一级标题 | 一般留给文章标题 |
| `-` | 无序列表 | 可嵌套 |
| `>` | 引用块 | 支持多段 |
| `\|` | 表格分隔 | 表格必需 |

## 分隔线

三个短横线就是一条分隔线：

---

大概就是这些。日常写作 90% 的场景，用到的语法不超过十种，记不住也没关系 —— 需要的时候回来翻一眼就行。
