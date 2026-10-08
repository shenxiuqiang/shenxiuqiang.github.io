// YouTube 频道视频列表。
// 构建时通过 YouTube 官方 RSS feed 拉取，不需要 API key：
//   https://www.youtube.com/feeds/videos.xml?channel_id=<CHANNEL_ID>
// 注意：feed 只返回最近 15 个视频，页面上的「订阅频道」入口指向完整列表。

export interface Video {
	id: string;
	title: string;
	url: string;
	published: Date;
	/** 观看次数（feed 里没有时为空） */
	views?: number;
	thumbnail: string;
	description: string;
}

// 频道 https://www.youtube.com/@AHiker 对应的 channel ID
const CHANNEL_ID = 'UCskCEb96x2svja2oMAaOPYQ';

export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@AHiker';

/** 解码 XML 文本里的常见实体（标题、描述里会出现 &amp; 等） */
function decodeEntities(s: string): string {
	return s
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");
}

function pick(xml: string, tag: string): string {
	const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
	return m ? decodeEntities(m[1].trim()) : '';
}

function pickAttr(xml: string, tag: string, attr: string): string {
	const m = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`));
	return m ? decodeEntities(m[1]) : '';
}

/**
 * 拉取频道最近视频。构建机器网络异常时返回空数组，
 * 页面会降级为「前往 YouTube 频道」的入口，不让构建失败。
 */
export async function getChannelVideos(): Promise<Video[]> {
	try {
		const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
		if (!res.ok) return [];
		const xml = await res.text();

		const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
		return entries.map((entry) => {
			const id = pick(entry, 'yt:videoId');
			const views = Number(pickAttr(entry, 'media:statistics', 'views'));
			return {
				id,
				title: pick(entry, 'media:title') || pick(entry, 'title'),
				url: `https://www.youtube.com/watch?v=${id}`,
				published: new Date(pick(entry, 'published')),
				views: Number.isFinite(views) ? views : undefined,
				// feed 给的是 4:3 的 hqdefault；16:9 裁切显示时用 i.ytimg 的同尺寸图
				thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
				description: pick(entry, 'media:description'),
			};
		});
	} catch {
		return [];
	}
}
