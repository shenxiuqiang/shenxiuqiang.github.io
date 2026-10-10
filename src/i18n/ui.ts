/**
 * 全站文案字典。
 *
 * 所有面向用户的文字都集中在这里，中英并排放在一起，
 * 方便对照着维护，也避免把翻译散落在各个组件里。
 *
 * 加新语言：在 LOCALES 里加代码，再补一份和 `zh` 结构完全相同的字典，
 * TypeScript 会在编译期检查有没有漏字段。
 */

export const LOCALES = ['zh', 'en'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = 'zh';

/** 语言切换器上显示的名字 */
export const LANG_LABEL: Record<Lang, string> = {
	zh: '中文',
	en: 'English',
};

/** <html lang> 和 hreflang 用的 BCP-47 标签（给浏览器和搜索引擎看） */
export const HTML_LANG: Record<Lang, string> = {
	zh: 'zh-CN',
	en: 'en',
};

/** 日期本地化用的 locale */
export const DATE_LOCALE: Record<Lang, string> = {
	zh: 'zh-CN',
	en: 'en-US',
};

/** 语言 → 内容集合名，避免在页面里写一堆三元表达式 */
export const BLOG_COLLECTION = { zh: 'blogZh', en: 'blogEn' } as const;
export const PAGES_COLLECTION = { zh: 'pagesZh', en: 'pagesEn' } as const;

const zh = {
	siteDescription: '个人博客 —— 记录技术、阅读与生活。',

	nav: {
		home: '首页',
		blog: '文章',
		videos: '视频',
		about: '关于',
	},

	/** 语言切换器上指向另一种语言的名字 */
	langSwitch: 'English',

	theme: {
		toggle: '切换明暗主题',
	},

	tags: {
		filter: '按标签筛选',
		all: '全部',
		taggedWith: (tag: string) => `#${tag}`,
		taggedCount: (tag: string, n: number) => `标签 #${tag} · 共 ${n} 篇`,
	},

	videos: {
		title: '视频',
		description: '我在 YouTube 频道发布的视频，点击跳转到 YouTube 观看。',
		subscribe: '在 YouTube 订阅',
		count: (n: number) => `最近 ${n} 个视频`,
		views: (n: number) => `${n} 次观看`,
		empty: '暂时拉取不到视频列表，请直接访问 YouTube 频道。',
	},

	home: {
		heroTitle: '知识星图：标签为星，共现为线',
	},

	blog: {
		title: '文章',
		description: '全部文章，按发布时间倒序排列。',
		recent: '最近文章',
		all: '全部',
		count: (n: number) => `共 ${n} 篇`,
		empty: '还没有文章。',
		backToList: '← 返回文章列表',
		minutes: (n: number) => `约 ${n} 分钟`,
		updatedOn: '更新于',
	},

	pagination: {
		prev: '← 上一页',
		next: '下一页 →',
		page: (cur: number, total: number) => `第 ${cur} / ${total} 页`,
	},

	post: {
		toc: '本文目录',
		characters: '字符数',
		readingTime: '预估耗时',
		minutes: (n: number) => `约 ${n} 分钟`,
		words: (n: number) => `${n} 字`,
		views: (n: number) => `${n} 次阅读`,
		prevPost: '上一篇',
		nextPost: '下一篇',
		backToTop: '返回顶部',
		share: '分享',
		shareNative: '系统分享…',
		copyLink: '复制链接',
		copy: '复制',
		copied: '已复制 ✓',
		authorRole: '作者',
		authorBio: '聚焦 AI Agent、分布式系统与前端架构实践。',
		publishedOn: '发布于',
	},

	footer: {
		builtWith: () =>
			`由 <a href="https://astro.build" target="_blank" rel="noopener noreferrer">Astro</a> 构建，托管于 <a href="https://pages.github.com" target="_blank" rel="noopener noreferrer">GitHub Pages</a>`,
	},

	notFound: {
		title: '页面不存在',
		body: '你要找的页面可能已经被移动或删除了。',
		back: '返回首页',
	},
};

// `typeof zh` 让 TypeScript 检查英文版有没有漏字段或写错键名
const en: typeof zh = {
	siteDescription: 'A personal blog about engineering, reading and tinkering.',

	nav: {
		home: 'Home',
		blog: 'Writing',
		videos: 'Videos',
		about: 'About',
	},

	langSwitch: '中文',

	theme: {
		toggle: 'Toggle dark mode',
	},

	tags: {
		filter: 'Filter by tag',
		all: 'All',
		taggedWith: (tag: string) => `#${tag}`,
		taggedCount: (tag: string, n: number) => `#${tag} · ${n} ${n === 1 ? 'post' : 'posts'}`,
	},

	videos: {
		title: 'Videos',
		description: 'Videos from my YouTube channel. Click to watch on YouTube.',
		subscribe: 'Subscribe on YouTube',
		count: (n: number) => `Latest ${n} ${n === 1 ? 'video' : 'videos'}`,
		views: (n: number) => `${n} views`,
		empty: 'Could not load the video list. Please visit the YouTube channel directly.',
	},

	home: {
		heroTitle: 'Knowledge constellation: tags as stars, co-occurrence as links',
	},

	blog: {
		title: 'Writing',
		description: 'Every post, newest first.',
		recent: 'Recent posts',
		all: 'All',
		count: (n: number) => `${n} ${n === 1 ? 'post' : 'posts'}`,
		empty: 'No posts yet.',
		backToList: '← Back to all posts',
		minutes: (n: number) => `${n} min read`,
		updatedOn: 'Updated',
	},

	pagination: {
		prev: '← Previous',
		next: 'Next →',
		page: (cur: number, total: number) => `Page ${cur} of ${total}`,
	},

	post: {
		toc: 'On this page',
		characters: 'Characters',
		readingTime: 'Reading time',
		minutes: (n: number) => `${n} min read`,
		words: (n: number) => `${n} chars`,
		views: (n: number) => `${n.toLocaleString('en-US')} views`,
		prevPost: 'Previous',
		nextPost: 'Next',
		backToTop: 'Back to top',
		share: 'Share',
		shareNative: 'Share via…',
		copyLink: 'Copy link',
		copy: 'Copy',
		copied: 'Copied ✓',
		authorRole: 'Author',
		authorBio: 'Working on AI agents, distributed systems, and frontend architecture.',
		publishedOn: 'Published',
	},

	footer: {
		builtWith: () =>
			`Built with <a href="https://astro.build" target="_blank" rel="noopener noreferrer">Astro</a>, hosted on <a href="https://pages.github.com" target="_blank" rel="noopener noreferrer">GitHub Pages</a>`,
	},

	notFound: {
		title: 'Page not found',
		body: 'The page you were looking for may have been moved or deleted.',
		back: 'Back to home',
	},
};

export const ui: Record<Lang, typeof zh> = { zh, en };

export type UI = typeof zh;
