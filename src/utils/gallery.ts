import { getCollection, type CollectionEntry } from 'astro:content';
import { GALLERY_COLLECTION, type Lang } from '../i18n/ui';

/**
 * 图集工具函数 —— 结构上刻意和 src/utils/posts.ts 保持一致，
 * 这样页面里的写法（getStaticPaths / 分页 / 翻译配对）不用换脑子。
 *
 * 图集和文章最大的不同：一辑图集的主体是 `data.images` 这个数组，
 * 而不是 Markdown 正文。所以这里多出几个处理分组的小函数。
 */

/** 中英文图集的公共类型，两个集合的 frontmatter 结构完全一致 */
export type GalleryEntry = CollectionEntry<'galleryZh'> | CollectionEntry<'galleryEn'>;

/** 图集里的一张图（从 schema 推导，避免手写重复接口） */
export type GalleryImage = GalleryEntry['data']['images'][number];

/** 开发时能看见草稿，构建上线时自动过滤掉 draft: true */
const includeDrafts = !import.meta.env.PROD;

/** 图集列表每页几辑 */
export const GALLERY_PAGE_SIZE = 12;

/** 取某个语言的已发布图集，按日期倒序 */
export async function getGalleryEntries(lang: Lang): Promise<GalleryEntry[]> {
	const entries = await getCollection(GALLERY_COLLECTION[lang], ({ data }) =>
		includeDrafts ? true : data.draft !== true,
	);

	return entries.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** 取某个语言所有图集的 slug（用于配对翻译） */
export async function getGallerySlugs(lang: Lang): Promise<Set<string>> {
	const entries = await getCollection(GALLERY_COLLECTION[lang], ({ data }) =>
		includeDrafts ? true : data.draft !== true,
	);

	return new Set(entries.map((entry) => entry.id));
}

/**
 * 一辑图集的分组顺序：
 * frontmatter 里显式写了 `groups` 就用它（并补上漏写的分组），
 * 没写就按图片出现的先后顺序推导。筛选按钮按这个顺序排列。
 */
export function getGroups(entry: GalleryEntry): string[] {
	const declared = entry.data.groups.filter((group) =>
		entry.data.images.some((image) => image.group === group)
	);
	const inferred = entry.data.images
		.map((image) => image.group)
		.filter((group) => !declared.includes(group));

	return [...declared, ...new Set(inferred)];
}
