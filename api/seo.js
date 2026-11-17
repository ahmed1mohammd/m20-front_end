import { SITE, esc, absUrl, apiGet } from './_lib.js';

// Serves /product/:id to crawlers (WhatsApp, Facebook, Google, ...) with
// product-specific title / description / image / JSON-LD injected into the SPA shell.

const setMeta = (html, attr, name, content) => {
  const tag = `<meta ${attr}="${name}" content="${esc(content)}" />`;
  const re = new RegExp(String.raw`<meta\s+${attr}="${name}"\s+content="[^"]*"\s*/?>`, 'i');
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
};

export default async function handler(req, res) {
  const id = String(req.query.id || '').trim();
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'm20fragrance.store';
  const proto = req.headers['x-forwarded-proto'] || 'https';

  let html;
  try {
    const shell = await fetch(`${proto}://${host}/index.html`);
    html = await shell.text();
  } catch {
    res.statusCode = 502;
    return res.end('Upstream error');
  }

  let product = null;
  if (id) {
    product = (await apiGet(`/products/slug/${encodeURIComponent(id)}`)) || (await apiGet(`/products/${encodeURIComponent(id)}`));
  }

  if (product && product.name) {
    const url = `${SITE}/product/${product.slug || id}`;
    const title = `${product.name} • Extrait de Parfum | M20 Haute Parfumerie`;
    const desc = (product.shortDescription || product.description || `Buy ${product.name} online from M20 Fine Fragrances. Fast delivery across Egypt.`)
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 300);
    const img = absUrl(product.mainImage?.url || product.images?.[0]?.url || '/img/hero.png');
    const price = Math.round(Number(product.variants?.[0]?.price || product.price || 0));

    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
    html = setMeta(html, 'name', 'description', desc);
    html = setMeta(html, 'property', 'og:title', title);
    html = setMeta(html, 'property', 'og:description', desc);
    html = setMeta(html, 'property', 'og:image', img);
    html = setMeta(html, 'property', 'og:url', url);
    html = setMeta(html, 'property', 'og:type', 'product');
    html = setMeta(html, 'name', 'twitter:title', title);
    html = setMeta(html, 'name', 'twitter:description', desc);
    html = setMeta(html, 'name', 'twitter:image', img);
    html = html.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${esc(url)}" />`);

    const ld = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      url,
      image: [img],
      description: desc,
      sku: product.variants?.[0]?.SKU || product.slug,
      brand: { '@type': 'Brand', name: 'M20' },
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'EGP',
        price,
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition'
      }
    };
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>\n  </head>`
    );
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.statusCode = 200;
  res.end(html);
}
