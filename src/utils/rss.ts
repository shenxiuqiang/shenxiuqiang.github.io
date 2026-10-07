import rss from '@astrojs/rss';
import { SITE_TITLE } from '../consts';
import { HTML_LANG, type Lang } from '../i18n/ui';
import { useTranslations } from '../i18n/utils';
import { getPosts } from './posts';

/**
 * 生成某个语言的 RSS。
 * 中文站和英文站各有一份，另外 /rss.xml 保留给中文站的老订阅者。
 */
export async function buildFeed(site: URL | undefined, lang: Lang) {
	const t = useTranslations(lang);
	const posts = await getPosts(lang);

	return rss({
		title: SITE_TITLE,
		description: t.siteDescription,
		site: site ?? 'https://shenxiuqiang.github.io',
		customData: `<language>${HTML_LANG[lang]}</language>`,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/${lang}/blog/${post.id}/`,
		})),
	});
}
