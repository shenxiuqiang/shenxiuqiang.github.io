import type { Lang } from '../i18n/ui';
import pageViews from '../data/page-views.json';

/**
 * 每篇文章的访问量（构建时从 GA4 拉取，见 scripts/fetch-page-views.mjs）。
 * key 是不带尾斜杠的页面路径，如 "/zh/blog/agent-native-internet"。
 */
const views: Record<string, number> = pageViews;

/** 取某篇文章的累计访问量；没有数据（新文章或未配置 GA）时返回 undefined */
export function getPageViews(lang: Lang, slug: string): number | undefined {
	return views[`/${lang}/blog/${slug}`];
}
