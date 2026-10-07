import { LOCALES } from '../../i18n/ui';
import { buildFeed } from '../../utils/rss';

export function getStaticPaths() {
	return LOCALES.map((lang) => ({ params: { lang } }));
}

// 访问 /zh/rss.xml 或 /en/rss.xml 时，由构建过程生成静态 XML
export async function GET(context) {
	return buildFeed(context.site, context.params.lang);
}
