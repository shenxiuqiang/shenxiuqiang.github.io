// 为每篇文章生成社交分享图（OG image）：/og/<lang>--<slug>.png
// 无封面文章的 og:image 会指向这里（见 BlogPost.astro）。
// 构图：顶部 accent 条 + 左上站点名（mono 小字）+ 文章标题大字 + accent 下划线 + 底部 URL。
// satori 负责把 DOM 风格标记排版成 SVG（自动处理中文换行），sharp 再栅格化成 PNG。
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import { SITE_TITLE } from '../../consts';
import { LOCALES } from '../../i18n/ui';
import { getPosts } from '../../utils/posts';

// 字体文件只读一次，所有文章共用（OFL 许可：Noto Sans CJK SC / JetBrains Mono）。
// 注意不能用 import.meta.url 定位：端点会被打包进 dist/.prerender，路径会失真，
// 构建时 process.cwd() 就是项目根目录。
const fontDir = path.join(process.cwd(), 'src/assets/fonts');
const notoBold = await readFile(path.join(fontDir, 'NotoSansCJKsc-Bold.otf'));
const jbMono = await readFile(path.join(fontDir, 'JetBrainsMono-Medium.ttf'));

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = [];
	for (const lang of LOCALES) {
		const posts = await getPosts(lang);
		for (const post of posts) {
			paths.push({
				params: { slug: `${lang}--${post.id}` },
				props: { title: post.data.title },
			});
		}
	}
	return paths;
};

export const GET: APIRoute = async ({ props }) => {
	const title = props.title as string;

	// 超长标题截断；按长度选字号，保证 2~3 行内排得下
	const display = title.length > 70 ? title.slice(0, 68) + '…' : title;
	const fontSize = display.length <= 22 ? 80 : display.length <= 44 ? 64 : 54;

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					width: '1200px',
					height: '630px',
					display: 'flex',
					flexDirection: 'column',
					backgroundColor: '#0d1117',
					padding: '60px 80px 52px',
					borderTop: '6px solid #58a6ff',
					fontFamily: 'Noto Sans CJK SC',
				},
				children: [
					// 左上角：站点名（mono 小字，替代原 ~/blog 的位置）
					{
						type: 'div',
						props: {
							style: { fontFamily: 'JetBrains Mono', fontSize: 32, color: '#8b949e' },
							children: SITE_TITLE,
						},
					},
					// 中间：文章标题（垂直居中，自动换行）
					{
						type: 'div',
						props: {
							style: { display: 'flex', flex: 1, alignItems: 'center', padding: '24px 0' },
							children: [
								{
									type: 'div',
									props: {
										style: {
											fontSize,
											fontWeight: 700,
											color: '#f0f6fc',
											lineHeight: 1.35,
										},
										children: display,
									},
								},
							],
						},
					},
					// accent 下划线 + 底部 URL
					{
						type: 'div',
						props: {
							style: {
								width: '220px',
								height: '8px',
								backgroundColor: '#58a6ff',
								marginBottom: '26px',
							},
						},
					},
					{
						type: 'div',
						props: {
							style: { fontFamily: 'JetBrains Mono', fontSize: 26, color: '#6e7781' },
							children: 'shenxiuqiang.github.io',
						},
					},
				],
			},
		} as any,
		{
			width: 1200,
			height: 630,
			fonts: [
				{ name: 'Noto Sans CJK SC', data: notoBold, weight: 700, style: 'normal' },
				{ name: 'JetBrains Mono', data: jbMono, weight: 500, style: 'normal' },
			],
		}
	);

	const png = await sharp(Buffer.from(svg)).png().toBuffer();
	return new Response(new Uint8Array(png), {
		headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
	});
};
