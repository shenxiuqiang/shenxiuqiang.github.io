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
 *
 * 图集（gallery）同理：
 *   src/content/gallery/zh/xxx.md  →  /zh/gallery/xxx/
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

/**
 * 图集（gallery）里的一张图。
 *
 * 图集和文章的区别：文章的主体是 Markdown 正文，图集的主体是
 * 「一组有序的图片 + 每张的图注」，正文只作为可选的前言。
 * 所以图片清单写在 frontmatter 里而不是散在正文的 ![]() 里 ——
 * 这样网格布局、分组筛选、灯箱、og:image 都能拿到结构化数据。
 */
const galleryImageSchema = z.object({
	/** public/ 下的路径，例如 /images/gallery/xxx/01-overview.webp */
	src: z.string(),
	/** alt：读屏软件和搜索引擎看到的那句话 */
	alt: z.string(),
	/** 图注标题 */
	title: z.string(),
	/** 图注正文，一到两句 */
	caption: z.string(),
	/** 所属分组，详情页的筛选按钮按它生成 */
	group: z.string(),
});

const gallerySchema = z.object({
	title: z.string(),
	description: z.string(),
	pubDate: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
	tags: z.array(z.string()).default([]),
	draft: z.boolean().default(false),
	/** 封面图：列表卡片缩略图 + 详情页头图 + og:image */
	cover: z.string().optional(),
	/** 顶部数据条，例如 { value: '20 × 21m', label: '宅基地' } */
	facts: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
	/** 分组顺序。留空则按图片出现的先后顺序自动推导 */
	groups: z.array(z.string()).default([]),
	/** 图片清单，数组顺序即展示顺序 */
	images: z.array(galleryImageSchema).default([]),
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

// 图集：游记、相册、渲染图册这类以图为主的内容，和文章分开存放，
// 但沿用同一套 frontmatter 习惯（标题 / 描述 / 日期 / 标签 / 封面）。
const galleryZh = defineCollection({
	loader: glob({ base: './src/content/gallery/zh', pattern: '**/*.{md,mdx}' }),
	schema: gallerySchema,
});

const galleryEn = defineCollection({
	loader: glob({ base: './src/content/gallery/en', pattern: '**/*.{md,mdx}' }),
	schema: gallerySchema,
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

export const collections = { blogZh, blogEn, galleryZh, galleryEn, pagesZh, pagesEn };
