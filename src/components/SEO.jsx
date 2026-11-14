import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_TITLE = 'M20 | Signature Haute Parfumerie • عطور M20 الفاخرة';
const DEFAULT_DESCRIPTION = 'M20 Haute Parfumerie creates artisanal luxury fragrances in Egypt. Discover M20 NOIR, Imperial Oud, Velvet Iris & Soleil Blanc with express delivery across Egypt.';
const DEFAULT_KEYWORDS = 'عطور M20, برفيوم مصري فاخر, M20 perfumes, luxury fragrances Egypt, eau de parfum Cairo, M20 Noir, عطور نيش مصر, best perfume brand Egypt, buy perfume online Egypt';
const DEFAULT_IMAGE = '/img/hero.png';
const SITE_NAME = 'M20 Haute Parfumerie';

const setMetaTag = (attrName, attrValue, content) => {
  if (!content) return;
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const setCanonical = (url) => {
  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
};

const setJsonLd = (id, data) => {
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }
  if (!data) return;

  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.innerHTML = JSON.stringify(data);
  document.head.appendChild(script);
};

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
  schema = null,
  schemaId = 'page-schema'
}) => {
  const location = useLocation();
  const { lang } = useLanguage();

  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${location.pathname}`
    : `https://m20fragrance.com${location.pathname}`;
  
  const fullTitle = title 
    ? `${title} | M20 Haute Parfumerie`
    : DEFAULT_TITLE;

  const fullImageUrl = image.startsWith('http') 
    ? image 
    : (typeof window !== 'undefined' ? `${window.location.origin}${image}` : `https://m20fragrance.com${image}`);

  useEffect(() => {
    // 1. Title
    document.title = fullTitle;

    // 2. Standard Meta
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'author', 'M20 Atelier');

    // 3. Canonical
    setCanonical(currentUrl);

    // 4. OpenGraph
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:image', fullImageUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:locale', lang === 'ar' ? 'ar_EG' : 'en_US');
    setMetaTag('property', 'og:locale:alternate', lang === 'ar' ? 'en_US' : 'ar_EG');

    // 5. Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', fullImageUrl);

    // 6. Custom JSON-LD Schema
    if (schema) {
      setJsonLd(schemaId, schema);
    }

    return () => {
      if (schema) {
        const el = document.getElementById(schemaId);
        if (el) el.remove();
      }
    };
  }, [fullTitle, description, keywords, fullImageUrl, currentUrl, type, noIndex, schema, schemaId, lang]);

  return null;
};

export default SEO;
