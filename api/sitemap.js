import { SITE, esc, apiGet } from './_lib.js';

const STATIC_PAGES = [
  ['/', '1.0', 'daily'],
  ['/shop', '0.9', 'daily'],
  ['/men', '0.8', 'weekly'],
  ['/women', '0.8', 'weekly'],
  ['/offers', '0.8', 'weekly'],
  ['/about', '0.6', 'monthly'],
  ['/policies', '0.4', 'monthly']
];

export default async function handler(req, res) {
  const data = await apiGet('/products?active=true&limit=500');
  const products = Array.isArray(data) ? data : data?.products || [];

  const urls = [
    ...STATIC_PAGES.map(([p, pr, cf]) => `  <url>\n    <loc>${SITE}${p}</loc>\n    <changefreq>${cf}</changefreq>\n    <priority>${pr}</priority>\n  </url>`),
    ...products
      .filter((p) => p.slug)
      .map((p) => {
        const img = p.mainImage?.url || p.images?.[0]?.url;
        const last = p.updatedAt ? `\n    <lastmod>${new Date(p.updatedAt).toISOString().slice(0, 10)}</lastmod>` : '';
        const image = img ? `\n    <image:image><image:loc>${esc(/^https?:/.test(img) ? img : SITE + img)}</image:loc></image:image>` : '';
        return `  <url>\n    <loc>${SITE}/product/${esc(p.slug)}</loc>${last}\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>${image}\n  </url>`;
      })
  ];

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.statusCode = 200;
  res.end(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>\n`
  );
}
