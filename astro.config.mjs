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

	integrations: [mdx(), sitemap()],

	markdown: {
		// 代码块语法高亮。Astro 内置 Shiki，不需要额外装包，
		// 构建时就生成好高亮 HTML，前端零 JS 开销。
		shikiConfig: {
			theme: 'github-dark',
			wrap: true,
		},
	},
});
