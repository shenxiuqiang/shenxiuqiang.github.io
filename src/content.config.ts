import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 内容集合（Content Collections）= Astro 对 Markdown 的结构化封装。
 *
 * 这里定义的 schema 会给每篇文章的 frontmatter 做校验：
 * 字段写错、漏写必填项，构建时会直接报错，而不是悄悄生成一个坏页面。
 *
 * 中英文各用一个集合，目录结构一一对应：
 *   src/content/blog/zh/hello-astro.md  →  /zh/blog/hello-astro/
 *   src/content/blog/en/hello-astro.md  →  /en/blog/hello-astro/
 * 文件名相同的两篇被视为同一篇文章的两个语言版本。
 */

const blogSchema = z.object({
	title: z.string(),
	description: z.string(),
	// 字符串会被自动转成 Date 对象，所以可以写 '2026-10-07'
	pubDate: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
	tags: z.array(z.string()).default([]),
	// draft: true 的文章只在本地 dev 时可见，不会发布到线上
	draft: z.boolean().default(false),
	// 封面图：public/ 下的路径，例如 /images/posts/xxx.webp
	cover: z.string().optional(),
});

const pagesSchema = z.object({
	title: z.string(),
	description: z.string(),
});

const blogZh = defineCollection({
	loader: glob({ base: './src/content/blog/zh', pattern: '**/*.{md,mdx}' }),
	schema: blogSchema,
});

const blogEn = defineCollection({
	loader: glob({ base: './src/content/blog/en', pattern: '**/*.{md,mdx}' }),
	schema: blogSchema,
});

// 独立页面（关于页等）也用 Markdown 写，和文章保持同一套写作体验
const pagesZh = defineCollection({
	loader: glob({ base: './src/content/pages/zh', pattern: '**/*.{md,mdx}' }),
	schema: pagesSchema,
});

const pagesEn = defineCollection({
	loader: glob({ base: './src/content/pages/en', pattern: '**/*.{md,mdx}' }),
	schema: pagesSchema,
});

export const collections = { blogZh, blogEn, pagesZh, pagesEn };
