import { ui, type Lang, type UI } from './ui';

/** 取某个语言的文案字典 */
export function useTranslations(lang: Lang): UI {
	return ui[lang];
}

/**
 * 给站内路径加上语言前缀，并统一成带结尾斜杠的规范形式 ——
 * 必须和 Astro 实际生成的地址（以及 canonical）完全一致，
 * 否则 hreflang 会指向一个需要 301 跳转的地址。
 *
 *   localizePath('zh', '/blog')             → '/zh/blog/'
 *   localizePath('en', '/blog/hello-astro') → '/en/blog/hello-astro/'
 *   localizePath('zh', '/rss.xml')          → '/zh/rss.xml'   （文件不加斜杠）
 */
export function localizePath(lang: Lang, path = '/'): string {
	const clean = '/' + path.replace(/^\/+/, '').replace(/\/+$/, '');

	if (clean === '/') return `/${lang}/`;

	// 最后一段带扩展名的按文件处理，例如 /rss.xml
	const isFile = /\.[a-z0-9]+$/i.test(clean);

	return `/${lang}${clean}${isFile ? '' : '/'}`;
}
