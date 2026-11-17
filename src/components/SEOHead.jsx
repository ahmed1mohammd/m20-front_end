import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * M20 Parfums - Bilingual Egypt Dynamic SEO & Structured Data (JSON-LD)
 * Optimizes title, meta descriptions, OpenGraph, hreflang tags, and schemas
 * tailored for Egyptian locals and expats in Egypt.
 */
export default function SEOHead({
  title,
  titleAr,
  description,
  descriptionAr,
  canonicalUrl,
  image = '/img/hero.png',
  type = 'website',
  product = null
}) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Dynamic Title
    const defaultTitleAr = 'دار M20 للعطور الفاخرة مصر • ثبات عالي وتوصيل لجميع المحافظات';
    const defaultTitleEn = 'M20 Parfums Egypt | Luxury Extrait de Parfum in Cairo & Giza';

    const pageTitle = isAr
      ? (titleAr ? `${titleAr} | دار M20 للعطور الفاخرة مصر` : defaultTitleAr)
      : (title ? `${title} | M20 Haute Parfumerie Egypt` : defaultTitleEn);

    document.title = pageTitle;

    // 2. Dynamic Description
    const defaultDescAr = 'عطور M20 الفاخرة بتركيز Extrait de Parfum وثبات يدوم لأكثر من 24 ساعة في مصر. اكتشف كولكشن CRUSH, CROWN, NIGHT, BLOOM, CHERRY, CLOUD. شحن سريع لجميع المحافظات ودفع عند الاستلام.';
    const defaultDescEn = 'Artisanal Egyptian fragrance house in Cairo crafting distinctive, long-lasting Extrait de Parfum (CRUSH, CROWN, NIGHT, BLOOM, CHERRY, CLOUD). Fast nationwide delivery across Egypt.';

    const pageDesc = isAr
      ? (descriptionAr || defaultDescAr)
      : (description || defaultDescEn);

    const updateMeta = (name, content, attribute = 'name') => {
      let el = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('description', pageDesc);
    updateMeta('keywords', isAr
      ? 'برفان ثبات عالي مصر, عطور M20, برفانات رجالي وحريمي مصر, افضل عطور في مصر, عطور نيش القاهرة والجيزة, شراء عطر اونلاين مصر'
      : 'luxury perfume egypt, extrait de parfum cairo, long lasting fragrances egypt, niche perfumes giza, best perfume brand egypt'
    );

    // 3. OpenGraph Tags
    updateMeta('og:title', pageTitle, 'property');
    updateMeta('og:description', pageDesc, 'property');
    updateMeta('og:type', type, 'property');
    const ogImg = (typeof image === 'string' ? image : image?.url) || '/img/hero.png';
    updateMeta('og:image', ogImg.startsWith('http') ? ogImg : `https://m20fragrance.com${ogImg}`, 'property');
    updateMeta('og:locale', isAr ? 'ar_EG' : 'en_EG', 'property');
    updateMeta('og:locale:alternate', isAr ? 'en_EG' : 'ar_EG', 'property');
    updateMeta('og:site_name', isAr ? 'دار M20 للعطور الفاخرة' : 'M20 Haute Parfumerie', 'property');

    // 4. Canonical & Hreflang
    const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href.split('?')[0] : 'https://m20fragrance.com');
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // 5. JSON-LD Structured Data
    const scriptId = 'm20-json-ld';
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    let schemaData = null;

    if (product) {
      // Product Schema
      const activeVariant = product.variants?.[0] || {};
      const productPrice = Math.round(Number(activeVariant.price || product.price || 750));
      const toUrl = (v) => (typeof v === 'string' ? v : v?.url || '');
      const productImg =
        toUrl(product.mainImage) || toUrl(product.images?.[0]) || toUrl(image) || '/img/product.png';
      const fullImgUrl = productImg.startsWith('http') ? productImg : `https://m20fragrance.com${productImg}`;

      schemaData = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        'name': isAr ? (product.nameAr || product.name) : product.name,
        'image': [fullImgUrl],
        'description': isAr ? (product.descriptionAr || pageDesc) : (product.description || pageDesc),
        'sku': activeVariant.SKU || `M20-${product.slug?.toUpperCase()}`,
        'brand': {
          '@type': 'Brand',
          'name': 'M20 Parfums'
        },
        'offers': {
          '@type': 'Offer',
          'url': currentUrl,
          'priceCurrency': 'EGP',
          'price': productPrice,
          'availability': 'https://schema.org/InStock',
          'seller': {
            '@type': 'Organization',
            'name': 'M20 Parfums Egypt'
          }
        }
      };
    } else {
      // Organization & WebSite Schema
      schemaData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://m20fragrance.com/#organization',
            'name': 'M20 Parfums',
            'alternateName': 'دار M20 للعطور الفاخرة',
            'url': 'https://m20fragrance.com',
            'logo': 'https://m20fragrance.com/img/hero.png',
            'contactPoint': {
              '@type': 'ContactPoint',
              'telephone': '+201132687324',
              'contactType': 'customer service',
              'areaServed': 'EG',
              'availableLanguage': ['Arabic', 'English']
            },
            'sameAs': [
              'https://instagram.com/elan.perfumes',
              'https://tiktok.com/@elan.perfumes',
              'https://facebook.com/elan.perfumes.eg'
            ]
          },
          {
            '@type': 'WebSite',
            '@id': 'https://m20fragrance.com/#website',
            'url': 'https://m20fragrance.com',
            'name': isAr ? 'M20 دار العطور الفاخرة' : 'M20 Haute Parfumerie Egypt',
            'inLanguage': isAr ? 'ar-EG' : 'en-EG'
          }
        ]
      };
    }

    scriptTag.textContent = JSON.stringify(schemaData);

    return () => {
      // Cleanup json-ld on unmount if needed
    };
  }, [isAr, title, titleAr, description, descriptionAr, canonicalUrl, image, type, product]);

  return null;
}
