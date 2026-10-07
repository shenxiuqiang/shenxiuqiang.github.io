import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 内容集合（Content Collection）= Astro 对 Markdown 文件的结构化封装。
// 这里的 schema 会给每篇文章的 frontmatter 做类型校验：
// 写错字段或漏写必填项，构建时会直接报错，而不是悄悄生成一个坏页面。
const blog = defineCollection({
	// 从 src/content/blog/ 读取所有 .md / .mdx 文件
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// 字符串会被自动转成 Date 对象，所以可以写 '2026-01-01'
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).default([]),
			// draft: true 的文章只在本地 dev 时可见，不会发布到线上
			draft: z.boolean().default(false),
			heroImage: z.optional(image()),
		}),
});

export const collections = { blog };
