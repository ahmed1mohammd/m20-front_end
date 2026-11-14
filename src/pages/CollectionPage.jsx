import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { FALLBACK_CATALOG } from '../data/fallbackCatalog';

const FULL_CATALOG = FALLBACK_CATALOG;

const CollectionPage = ({ category = 'All', titleKey }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useLanguage();

  const resolvedTitle = titleKey 
    ? t(titleKey) 
    : category === 'Men' 
    ? t('nav.men', 'For Him') 
    : category === 'Women' 
    ? t('nav.women', 'For Her') 
    : t('nav.allFragrances', 'All Fragrances');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCatalog = async () => {
      setLoading(true);
      let fetched = await getProducts();
      let baseList = (fetched && fetched.length > 0) ? fetched : FULL_CATALOG;

      const catUpper = (category || 'All').toUpperCase();

      if (catUpper === 'MEN') {
        const filtered = baseList.filter(p => {
          const g = (p.gender || p.category || '').toUpperCase();
          return g === 'MEN' || 
            p.name.toLowerCase().includes('noir') || 
            p.name.toLowerCase().includes('vetiver') || 
            p.name.toLowerCase().includes('oud') || 
            p.name.toLowerCase().includes('him');
        });
        setProducts(filtered.length > 0 ? filtered : FULL_CATALOG.filter(p => (p.gender || '').toUpperCase() === 'MEN'));
      } else if (catUpper === 'WOMEN') {
        const filtered = baseList.filter(p => {
          const g = (p.gender || p.category || '').toUpperCase();
          return g === 'WOMEN' || 
            p.name.toLowerCase().includes('soleil') || 
            p.name.toLowerCase().includes('iris') || 
            p.name.toLowerCase().includes('rose') || 
            p.name.toLowerCase().includes('her');
        });
        setProducts(filtered.length > 0 ? filtered : FULL_CATALOG.filter(p => (p.gender || '').toUpperCase() === 'WOMEN'));
      } else {
        setProducts(baseList);
      }

      setLoading(false);
    };

    fetchCatalog();
  }, [category]);

  const seoTitle = category === 'Men' 
    ? (lang === 'ar' ? 'عطور رجالية فاخرة | M20 Men' : "Men's Luxury Fragrances | M20")
    : category === 'Women' 
    ? (lang === 'ar' ? 'عطور نسائية راقية | M20 Women' : "Women's Haute Fragrances | M20")
    : (lang === 'ar' ? 'كافة العطور الفاخرة | M20 All Fragrances' : "All Luxury Fragrances | M20");

  const seoDesc = category === 'Men'
    ? "Explore M20 collection of intense masculine fragrances including M20 NOIR, Royal Vetiver & Imperial Oud crafted for lasting presence."
    : category === 'Women'
    ? "Explore M20 feminine fragrance collection including Soleil Blanc, Velvet Iris & Rose Majesté crafted with rare natural floral essences."
    : "Shop the complete catalog of artisanal Extrait de Parfum fragrances by M20 Maison for lasting sillage.";

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': seoTitle,
    'description': seoDesc,
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': products.map((p, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': p.name,
        'url': `https://m20fragrance.com/product/${p._id || p.id}`
      }))
    }
  };

  return (
    <div className="bg-[#F4F3EF] py-12 md:py-16 border-b border-slate-200/80 min-h-[60vh]">
      <SEO 
        title={seoTitle}
        description={seoDesc}
        keywords={`عطور ${category === 'Men' ? 'رجالي' : category === 'Women' ? 'حريمي' : 'M20'}, perfumes ${category.toLowerCase()}, luxury fragrances Egypt, M20 collection`}
        schema={collectionSchema}
        schemaId={`collection-schema-${category}`}
      />

      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Collection Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-medium block">
            {t('common.brandSubtitle', 'Signature Haute Parfumerie')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#174F43] tracking-tight uppercase">
            {resolvedTitle}
          </h1>
          <p className="text-xs sm:text-sm font-light text-slate-600 max-w-md mx-auto leading-relaxed">
            {t('features.f1Desc', 'Formulated as genuine Extrait de Parfum for all-day endurance.')}
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs tracking-widest text-slate-500 uppercase">
            {t('common.loading', 'Loading fragrance catalog...')}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-500">
            {t('common.error', 'No products found matching this criteria.')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CollectionPage;
