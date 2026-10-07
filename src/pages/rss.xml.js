import { buildFeed } from '../utils/rss';

// 老订阅者的地址：/rss.xml 继续提供中文订阅源，
// 不去动它，避免已经订阅的人收不到更新。
export async function GET(context) {
	return buildFeed(context.site, 'zh');
}
