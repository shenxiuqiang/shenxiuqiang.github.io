import { getCollection, type CollectionEntry } from 'astro:content';
import { BLOG_COLLECTION, type Lang } from '../i18n/ui';

/** 中英文文章的公共类型，两个集合的 frontmatter 结构完全一致 */
export type BlogPost = CollectionEntry<'blogZh'> | CollectionEntry<'blogEn'>;

/** 开发时能看见草稿，构建上线时自动过滤掉 draft: true 的文章 */
const includeDrafts = !import.meta.env.PROD;

/** 列表每页文章数（文章列表 / 标签页 / 首页共用） */
export const PAGE_SIZE = 10;

/**
 * 取某个语言的已发布文章，按发布日期倒序排列。
 */
export async function getPosts(lang: Lang): Promise<BlogPost[]> {
	const posts = await getCollection(BLOG_COLLECTION[lang], ({ data }) =>
		includeDrafts ? true : data.draft !== true,
	);

	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export interface TagInfo {
	tag: string;
	count: number;
}

/** 某个语言下所有标签及文章数，按数量倒序 */
export async function getAllTags(lang: Lang): Promise<TagInfo[]> {
	const posts = await getPosts(lang);
	const counts = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.data.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}
	return [...counts.entries()]
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** 某个语言下带指定标签的文章 */
export async function getPostsByTag(lang: Lang, tag: string): Promise<BlogPost[]> {
	const posts = await getPosts(lang);
	return posts.filter((post) => post.data.tags.includes(tag));
}

/**
 * 标签 → URL 路径段。标签里可能有空格（GitHub Pages）或斜杠（CI/CD），
 * 斜杠会被路由当成路径分隔符、空格会变成 %20，统一换成连字符。
 * 显示时仍用原始标签。
 */
export function tagSlug(tag: string): string {
	return tag.replace(/[\s/]+/g, '-');
}

/** 取某个语言所有文章的 slug（用于配对翻译） */
export async function getPostSlugs(lang: Lang): Promise<Set<string>> {
	const posts = await getCollection(BLOG_COLLECTION[lang], ({ data }) =>
		includeDrafts ? true : data.draft !== true,
	);

	return new Set(posts.map((post) => post.id));
}

let alreadyWarned = false;

/**
 * 检查哪些中文文章还没有英文版，并在构建日志里列出来。
 * 只警告、不中断构建 —— 漏翻不应该阻止中文站发布。
 */
export async function warnMissingTranslations(): Promise<string[]> {
	const [zhSlugs, enSlugs] = await Promise.all([getPostSlugs('zh'), getPostSlugs('en')]);
	const missing = [...zhSlugs].filter((slug) => !enSlugs.has(slug)).sort();

	if (!alreadyWarned) {
		alreadyWarned = true;

		if (missing.length > 0) {
			console.warn(
				`\n\x1b[33m[翻译缺失]\x1b[0m ${missing.length} 篇中文文章还没有英文版，英文站会跳过它们：\n` +
					missing.map((slug) => `  · src/content/blog/en/${slug}.md`).join('\n') +
					`\n  补齐方式：直接让 AI 翻译，或自己新建同名文件。\n`,
			);
		}
	}

	return missing;
}

/**
 * 估算阅读时间（分钟）。
 * 中文按 400 字/分钟，英文按 200 词/分钟，中英混排分别计数后相加。
 */
export function getReadingTime(body = '', lang: Lang = 'zh'): number {
	const cjk = (body.match(/[\u4e00-\u9fa5]/g) ?? []).length;
	const words = (body.match(/[a-zA-Z0-9]+/g) ?? []).length;

	const minutes = lang === 'en' ? words / 200 + cjk / 400 : (cjk + words) / 400;

	return Math.max(1, Math.round(minutes));
}
