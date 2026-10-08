// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// 站点最终部署地址。
	// 仓库名是 shenxiuqiang.github.io，属于「用户主页仓库」，
	// 站点根路径就是 /，所以不需要再配置 base。
	site: 'https://shenxiuqiang.github.io',

	integrations: [
		mdx(),
		sitemap({
			// 排除旧地址的跳转占位页（/ 、/about/ 、/blog/ 、/blog/<slug>/）。
			// 它们带 noindex，本来就不该出现在 sitemap 里；
			// 而且 @astrojs/sitemap 的 i18n 选项假设「默认语言不带前缀」，
			// 我们的 /zh/ + /en/ 结构会让它生成重复且指向跳转页的 hreflang。
			// 语言互指一律以页面里的 <link rel="alternate" hreflang> 为准。
			filter(page) {
				const path = new URL(page).pathname;
				if (path === '/') return false;
				if (/^\/(about|blog)\/$/.test(path)) return false;
				if (/^\/blog\/[^/]+\/$/.test(path)) return false;
				// 分享中转页只是跳转工具，不应被搜索引擎收录
				if (path.startsWith('/share/')) return false;
				return true;
			},
		}),
	],

	markdown: {
		// 代码块语法高亮。Astro 内置 Shiki，不需要额外装包，
		// 构建时就生成好高亮 HTML，前端零 JS 开销。
		shikiConfig: {
			// 双主题：浅色页用 github-light，深色页用 github-dark。
			// Shiki 会为每个 token 同时输出默认色（light）和
			// --shiki-dark 系列 CSS 变量，由 global.css 按
			// data-theme 切换，跟随站点主题而不是固定深色。
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			wrap: true,
		},
	},
});
