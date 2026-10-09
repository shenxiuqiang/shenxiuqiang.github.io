/**
 * 构建前从 GA4 Data API 拉取每篇文章的访问量，写入 src/data/page-views.json。
 *
 * 需要的两个环境变量（GitHub Secrets → Actions 环境变量）：
 *   GA_PROPERTY_ID          GA4 媒体资源的数字 ID（Admin → Property Settings，不是 G- 开头的测量 ID）
 *   GA_SERVICE_ACCOUNT_KEY  Service Account 密钥 JSON 的完整内容
 *
 * 没有配置密钥时（例如本地开发）直接跳过，保留已有的 page-views.json，
 * 这样任何人 clone 仓库都能正常构建。
 */
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import fs from 'node:fs';
import path from 'node:path';

const OUT_FILE = path.resolve('src/data/page-views.json');
const propertyId = process.env.GA_PROPERTY_ID;
const keyJson = process.env.GA_SERVICE_ACCOUNT_KEY;

if (!propertyId || !keyJson) {
	console.log('[page-views] 未配置 GA_PROPERTY_ID / GA_SERVICE_ACCOUNT_KEY，跳过拉取，沿用现有数据。');
	process.exit(0);
}

const credentials = JSON.parse(keyJson);
const client = new BetaAnalyticsDataClient({ credentials });

// 拉全部历史数据；只保留文章页（/zh/blog/<slug>/ 和 /en/blog/<slug>/）
const [response] = await client.runReport({
	property: `properties/${propertyId}`,
	dateRanges: [{ startDate: '2020-01-01', endDate: 'today' }],
	dimensions: [{ name: 'pagePath' }],
	metrics: [{ name: 'screenPageViews' }],
	dimensionFilter: {
		filter: {
			fieldName: 'pagePath',
			stringFilter: { matchType: 'CONTAINS', value: '/blog/' },
		},
	},
	limit: 10000,
});

const views = {};
for (const row of response.rows ?? []) {
	// 统一去掉尾部斜杠，把 /zh/blog/foo/ 和 /zh/blog/foo 合并计数
	const pagePath = row.dimensionValues?.[0]?.value?.replace(/\/+$/, '') ?? '';
	const count = Number(row.metricValues?.[0]?.value ?? 0);
	if (!pagePath || !count) continue;
	views[pagePath] = (views[pagePath] ?? 0) + count;
}

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(views, null, 2) + '\n');
console.log(`[page-views] 已写入 ${Object.keys(views).length} 个页面的访问量 → ${OUT_FILE}`);
