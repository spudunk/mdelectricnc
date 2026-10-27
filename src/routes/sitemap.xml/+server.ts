import type { RequestHandler } from '@sveltejs/kit';

const site = 'https://mdelectricnc.com';
const lastmod = '2026-10-26';

const pages = [
	{ url: '/', changefreq: 'weekly', priority: '1.0' },
	{ url: '/license', changefreq: 'monthly', priority: '0.5' }
];

export const prerender = true;

export const GET: RequestHandler = () => {
	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...pages.map(
			(page) => `	<url>
		<loc>${site}${page.url}</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>${page.changefreq}</changefreq>
		<priority>${page.priority}</priority>
	</url>`
		),
		'</urlset>',
		''
	].join('\n');

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
