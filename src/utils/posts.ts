import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * 取出所有「已发布」的文章，并按发布日期倒序排列。
 * draft: true 的文章只在本地 `npm run dev` 时出现，构建上线时会被过滤掉。
 */
export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
	const posts = await getCollection('blog', ({ data }) =>
		import.meta.env.PROD ? data.draft !== true : true,
	);

	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * 粗略估算阅读时间（分钟）。中英文混排都能用：
 * 中文按字数、英文按词数，再按每分钟 400 字折算。
 */
export function getReadingTime(body = ''): number {
	const cjk = (body.match(/[\u4e00-\u9fa5]/g) ?? []).length;
	const words = (body.match(/[a-zA-Z0-9]+/g) ?? []).length;

	return Math.max(1, Math.round((cjk + words) / 400));
}
