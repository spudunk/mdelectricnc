import type { RequestHandler } from '@sveltejs/kit';

const site = 'https://mdelectricnc.com';

const pages = [
  {
    url: '',
    lastmod: '2026-10-26',
    changefreq: 'weekly',
    priority: 1.0
  },
  {
    url: '/license',
    lastmod: '2026-10-26',
    changefreq: 'monthly',
    priority: 0.5
  }
  // Add more pages here as you create them, e.g.:
  // { url: '/services', changefreq: 'monthly', priority: 0.8 },
];

export const GET: RequestHandler = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${site}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=3600'
    }
  });
};
