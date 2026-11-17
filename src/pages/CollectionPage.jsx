import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { FALLBACK_CATALOG } from '../data/fallbackCatalog';
import { getProductPriceSummary } from '../utils/productPricing';

const FULL_CATALOG = FALLBACK_CATALOG;

const SORTS = [
  { id: 'featured', en: 'Featured', ar: 'المميزة' },
  { id: 'priceAsc', en: 'Price: Low to High', ar: 'السعر: الأقل أولاً' },
  { id: 'priceDesc', en: 'Price: High to Low', ar: 'السعر: الأعلى أولاً' },
  { id: 'name', en: 'Name A–Z', ar: 'الاسم أ–ي' },
];

const TABS = [
  { to: '/shop', cat: 'All', en: 'All', ar: 'الكل' },
  { to: '/men', cat: 'Men', en: 'For Him', ar: 'للرجال' },
  { to: '/women', cat: 'Women', en: 'For Her', ar: 'للنساء' },
];

const HERO_WORD = { Men: 'HIM', Women: 'HER', All: 'M20' };

const CollectionPage = ({ category = 'All', titleKey }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [family, setFamily] = useState('all');
  const [sort, setSort] = useState('featured');
  const { t, lang, isRTL } = useLanguage();
  const isAr = lang === 'ar';

  const resolvedTitle = titleKey
    ? t(titleKey)
    : category === 'Men'
    ? t('nav.men', 'For Him')
    : category === 'Women'
    ? t('nav.women', 'For Her')
    : t('nav.allFragrances', 'All Fragrances');

  useEffect(() => {
    window.scrollTo(0, 0);
    setFamily('all');
    setSort('featured');
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

  const families = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.fragranceFamily && set.add(p.fragranceFamily));
    return Array.from(set);
  }, [products]);

  const visible = useMemo(() => {
    let list = family === 'all' ? products : products.filter((p) => p.fragranceFamily === family);
    const price = (p) => getProductPriceSummary(p).minPrice || 0;
    if (sort === 'priceAsc') list = [...list].sort((a, b) => price(a) - price(b));
    if (sort === 'priceDesc') list = [...list].sort((a, b) => price(b) - price(a));
    if (sort === 'name') list = [...list].sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return list;
  }, [products, family, sort]);

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
        'url': `https://m20fragrance.store/product/${p._id || p.id}`
      }))
    }
  };

  const chip = (active) =>
    `shrink-0 px-4 h-9 inline-flex items-center text-xs tracking-widest uppercase border transition-colors cursor-pointer ${
      active
        ? 'bg-[#174F43] border-[#174F43] text-white'
        : 'bg-transparent border-slate-300 text-slate-600 hover:border-[#174F43] hover:text-[#174F43]'
    }`;

  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const otherTabs = TABS.filter((tb) => tb.cat !== category);

  return (
    <div className="bg-[#F4F3EF] min-h-[60vh]">
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={`عطور ${category === 'Men' ? 'رجالي' : category === 'Women' ? 'حريمي' : 'M20'}, perfumes ${category.toLowerCase()}, luxury fragrances Egypt, M20 collection`}
        schema={collectionSchema}
        schemaId={`collection-schema-${category}`}
      />

      {/* ===== Brand hero band ===== */}
      <section className="relative overflow-hidden bg-[#174F43] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 90% at 80% 20%, rgba(255,157,0,0.22), transparent 60%), radial-gradient(ellipse 50% 80% at 10% 100%, rgba(15,56,48,0.9), transparent 70%)' }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute -bottom-6 md:-bottom-14 inset-x-0 flex justify-center font-serif leading-none text-white/[0.06] text-[9rem] sm:text-[14rem] md:text-[18rem] m20-drift-slow"
        >
          {HERO_WORD[category] || 'M20'}
        </div>

        <div className={`relative max-w-[1200px] mx-auto px-6 py-14 md:py-20 ${isRTL ? 'text-right' : 'text-left'}`}>
          <Reveal direction="up">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs tracking-widest uppercase text-white/60">
              <Link to="/" className="hover:text-white transition-colors">{isAr ? 'الرئيسية' : 'Home'}</Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#FF9D00]">{resolvedTitle}</span>
            </nav>
          </Reveal>

          <Reveal direction="up" delay={80}>
            <div className="flex items-center gap-3 mt-6">
              <span className="h-[1.5px] w-8 bg-[#FF9D00]" />
              <span className="text-xs uppercase tracking-[0.28em] text-[#FF9D00] font-semibold">
                {t('common.brandSubtitle', 'Signature Haute Parfumerie')}
              </span>
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-serif uppercase leading-[1.05] text-white">
              {resolvedTitle}
            </h1>
            <p className="mt-4 text-sm sm:text-base font-light text-white/75 max-w-lg leading-relaxed">
              {category === 'Men'
                ? (isAr ? 'حضور قوي وأثر يدوم. عطور رجالية مركّزة بنوتات الأخشاب والعنبر.' : 'Bold presence, lasting trail. Concentrated woods, amber and spice for him.')
                : category === 'Women'
                ? (isAr ? 'أناقة مضيئة بنوتات زهرية ناعمة تدوم طوال اليوم.' : 'Luminous elegance. Soft florals and warm musks crafted to last all day.')
                : (isAr ? 'المجموعة الكاملة من عطور M20 Extrait de Parfum.' : 'The complete M20 Extrait de Parfum collection.')}
            </p>
          </Reveal>

          {/* Collection switcher */}
          <Reveal direction="up" delay={160}>
            <div className="mt-8 flex flex-wrap gap-2">
              {TABS.map((tb) => (
                <Link
                  key={tb.cat}
                  to={tb.to}
                  className={`px-5 h-10 inline-flex items-center text-xs tracking-widest uppercase border transition-colors ${
                    tb.cat === category
                      ? 'bg-[#FF9D00] border-[#FF9D00] text-[#0F3830] font-semibold'
                      : 'border-white/30 text-white hover:border-white hover:bg-white/10'
                  }`}
                >
                  {isAr ? tb.ar : tb.en}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-14">
        {/* ===== Toolbar: family chips + sort ===== */}
        {!loading && products.length > 0 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2 overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 pb-1 md:pb-0 [scrollbar-width:none]">
              <button type="button" onClick={() => setFamily('all')} className={chip(family === 'all')}>
                {isAr ? 'الكل' : 'All'}
              </button>
              {families.map((f) => (
                <button key={f} type="button" onClick={() => setFamily(f)} className={chip(family === f)}>
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
              <span className="text-xs tracking-widest uppercase text-slate-500">
                {visible.length} {isAr ? 'عطر' : visible.length === 1 ? 'fragrance' : 'fragrances'}
              </span>
              <label className="sr-only" htmlFor="collection-sort">{isAr ? 'ترتيب' : 'Sort'}</label>
              <select
                id="collection-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-9 bg-transparent border border-slate-300 px-3 text-xs tracking-wide text-slate-700 hover:border-[#174F43] focus:border-[#174F43] outline-none cursor-pointer"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{isAr ? s.ar : s.en}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ===== Grid ===== */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-slate-200/70" />
                <div className="h-3 w-2/3 bg-slate-200/70 mt-3" />
                <div className="h-3 w-1/3 bg-slate-200/70 mt-2" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-20 text-center text-sm text-slate-500">
            {t('common.error', 'No products found matching this criteria.')}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 lg:gap-x-8 lg:gap-y-12">
            {visible.map((product, idx) => (
              <Reveal key={product._id || product.id} delay={(idx % 3) * 110} direction="up">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}

        {/* ===== Explore other collections ===== */}
        {!loading && (
          <Reveal direction="up">
            <div className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherTabs.map((tb) => (
                <Link
                  key={tb.cat}
                  to={tb.to}
                  className="group flex items-center justify-between bg-white border border-slate-200 hover:border-[#174F43] px-6 py-6 transition-colors"
                >
                  <div>
                    <span className="text-xs uppercase tracking-[0.25em] text-[#FF9D00] font-semibold block">
                      {isAr ? 'اكتشف' : 'Explore'}
                    </span>
                    <span className="font-serif text-2xl text-[#174F43] uppercase">{isAr ? tb.ar : tb.en}</span>
                  </div>
                  <Arrow size={20} className="text-[#174F43] transition-transform duration-300 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5" />
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
