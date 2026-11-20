import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '../config/site';

export async function GET(context: APIContext) {
  const articles = (await getCollection('insights', (e) => !e.data.draft)).sort((a, b) => +b.data.date - +a.data.date);
  const lessons = await getCollection('learning');
  return rss({
    title: `${SITE.name}: Insights`,
    description: 'Articles and learning notes on software architecture, AI agents, data engineering, fintech and engineering leadership.',
    site: context.site!,
    items: [
      ...articles.map((a) => ({ title: a.data.title, description: a.data.description, pubDate: a.data.date, link: `/insights/${a.id}/`, categories: [a.data.category, ...a.data.tags] })),
      ...lessons.map((l) => ({ title: `Learning log, Day ${l.data.day}: ${l.data.title}`, description: l.data.description, pubDate: l.data.date, link: l.data.href })),
    ].sort((x, y) => +y.pubDate - +x.pubDate),
    customData: '<language>en</language>',
  });
}
