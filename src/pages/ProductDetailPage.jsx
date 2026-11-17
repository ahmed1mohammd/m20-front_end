import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, getProducts } from '../services/api';
import { getFallbackProductById } from '../data/fallbackCatalog';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { sortVariantsBySize, getProductPriceSummary } from '../utils/productPricing';
import SEO from '../components/SEO';
import SEOHead from '../components/SEOHead';
import { trackViewContent, trackAddToCart } from '../utils/tracking';
import {
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  RotateCcw,
  Droplets,
  Layers,
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Clock,
  Wind,
  Sun,
  SunMedium,
  Moon,
  Briefcase,
  Coffee,
  PartyPopper,
  Gem,
  Heart,
  Award,
  Compass,
  CheckCircle2,
} from 'lucide-react';

const OCCASION_META = {
  morning: { en: 'Morning', ar: 'صباحي', icon: Sun },
  daytime: { en: 'Daytime', ar: 'نهاري', icon: SunMedium },
  night: { en: 'Night', ar: 'مسائي / سهرات', icon: Moon },
  'morning / daytime / night': { en: 'Morning / Daytime / Night', ar: 'صباحي / نهاري / مسائي', icon: SunMedium },
  'work/office': { en: 'Work & Office', ar: 'العمل والمكتب', icon: Briefcase },
  work: { en: 'Work & Office', ar: 'العمل والمكتب', icon: Briefcase },
  office: { en: 'Work & Office', ar: 'العمل والمكتب', icon: Briefcase },
  'work / office': { en: 'Work & Office', ar: 'العمل والمكتب', icon: Briefcase },
  'daily use': { en: 'Daily Use', ar: 'استخدام يومي', icon: Compass },
  daily: { en: 'Daily Use', ar: 'استخدام يومي', icon: Compass },
  casual: { en: 'Casual', ar: 'كاجوال ويومي', icon: Coffee },
  'daily use / casual': { en: 'Daily Use / Casual', ar: 'استخدام يومي / كاجوال', icon: Compass },
  parties: { en: 'Parties', ar: 'حفلات واحتفالات', icon: PartyPopper },
  party: { en: 'Parties', ar: 'حفلات واحتفالات', icon: PartyPopper },
  'romantic dates': { en: 'Romantic Dates', ar: 'لقاءات رومانسية', icon: Heart },
  romantic: { en: 'Romantic Dates', ar: 'لقاءات رومانسية', icon: Heart },
  'parties / romantic dates': { en: 'Parties / Romantic Dates', ar: 'حفلات / لقاءات خاصة', icon: Heart },
  'special occasions': { en: 'Special Occasions', ar: 'مناسبات خاصة', icon: Gem },
  'special occasion': { en: 'Special Occasions', ar: 'مناسبات خاصة', icon: Gem },
  'formal events': { en: 'Formal Events', ar: 'مناسبات رسمية', icon: Award },
  formal: { en: 'Formal Events', ar: 'مناسبات رسمية', icon: Award },
  'special occasions / formal events': { en: 'Special Occasions / Formal', ar: 'مناسبات خاصة ورسمية', icon: Gem },
};

const getOccasionMeta = (key, lang) => {
  if (!key) return { label: lang === 'ar' ? 'إصدار مميز' : 'Signature Wear', icon: Award };
  const clean = key.toString().toLowerCase().trim();
  const entry = OCCASION_META[clean];
  if (entry) {
    return { label: lang === 'ar' ? entry.ar : entry.en, icon: entry.icon };
  }
  const titleCased = key.toString().replace(/\b\w/g, (l) => l.toUpperCase());
  return { label: titleCased, icon: Award };
};

const AccordionItem = ({ title, icon: Icon, children, defaultOpen = false, isRTL }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-200/90 transition-colors">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={`w-full py-4 flex justify-between items-center ${isRTL ? 'text-right' : 'text-left'} focus-visible:outline-2 focus-visible:outline-[#174F43] cursor-pointer`}
      >
        <span className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2.5' : 'space-x-2.5'} font-serif uppercase tracking-wider text-xs text-[#174F43] font-medium`}>
          {Icon && <Icon size={15} className="text-[#174F43]/70 flex-shrink-0" />}
          <span>{title}</span>
        </span>
        <span className="text-slate-500 p-1">
          <ChevronDown
            size={16}
            strokeWidth={1.6}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#174F43]' : ''}`}
          />
        </span>
      </button>
      {isOpen && (
        <div className={`pb-5 text-slate-600 text-xs sm:text-[13px] leading-relaxed font-light ${isRTL ? 'pr-6 text-right' : 'pl-6 text-left'}`}>
          {children}
        </div>
      )}
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, formatPrice, translateProduct, isRTL, lang } = useLanguage();

  const [rawProduct, setRawProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImageUrl(null);
    setQuantity(1);
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        let data = await getProductById(id);
        if (!data) {
          data = getFallbackProductById(id);
        }
        if (data) {
          setRawProduct(data);
          const sortedVars = sortVariantsBySize(data.variants || []);
          const defaultVar = sortedVars.length > 0
            ? (sortedVars.find((v) => String(v.size).toLowerCase() === '50ml') || sortedVars[0])
            : { size: '50ml', price: data.price || 0, stock: data.stock || 0 };
          setSelectedVariant(defaultVar);
        } else {
          setError('Product not found');
        }

        const catalog = await getProducts();
        if (Array.isArray(catalog)) {
          const currentId = data?._id || data?.id || id;
          const currentSlug = data?.slug || id;
          setRelatedProducts(
            catalog
              .filter((p) => (p._id || p.id) !== currentId && p.slug !== currentSlug)
              .slice(0, 3)
          );
        }
      } catch (err) {
        console.error('Error loading product details:', err);
        const fallback = getFallbackProductById(id);
        if (fallback) {
          setRawProduct(fallback);
          const sortedVars = sortVariantsBySize(fallback.variants || []);
          const defaultVar = sortedVars.length > 0
            ? (sortedVars.find((v) => String(v.size).toLowerCase() === '50ml') || sortedVars[0])
            : { size: '50ml', price: fallback.price || 0, stock: fallback.stock || 0 };
          setSelectedVariant(defaultVar);
        } else {
          setError('Failed to load product details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const product = useMemo(() => (rawProduct ? translateProduct(rawProduct) : null), [rawProduct, translateProduct]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const roleImages = [];
    const roleLabels = {
      bottle: lang === 'ar' ? 'الزجاجة' : 'Bottle',
      composition: lang === 'ar' ? 'المكونات' : 'Composition',
      pyramid: lang === 'ar' ? 'الهرم العطري' : 'Pyramid',
      packaging: lang === 'ar' ? 'التغليف' : 'Packaging',
    };

    const addImg = (imgObj, defaultRole, defaultLabel) => {
      if (!imgObj || !imgObj.url) return;
      if (!roleImages.some((existing) => existing.url === imgObj.url)) {
        roleImages.push({
          url: imgObj.url,
          role: imgObj.role || defaultRole,
          label: defaultLabel,
          alt: imgObj.alt || `${product.name} ${defaultLabel}`,
        });
      }
    };

    if (product.mainImage?.url) {
      addImg(product.mainImage, 'main', roleLabels.bottle);
    } else {
      const fMain = (product.images || []).find((i) => i.role === 'main') || product.images?.[0];
      if (fMain) addImg(fMain, 'main', roleLabels.bottle);
    }

    if (product.hoverImage?.url) {
      addImg(product.hoverImage, 'hover', roleLabels.composition);
    } else if (typeof product.hoverImage === 'string' && product.hoverImage) {
      addImg({ url: product.hoverImage }, 'hover', roleLabels.composition);
    } else {
      const fHover = (product.images || []).find((i) => i.role === 'hover') || product.images?.[1];
      if (fHover) addImg(fHover, 'hover', roleLabels.composition);
    }

    if (product.pyramidImage?.url) {
      addImg(product.pyramidImage, 'pyramid', roleLabels.pyramid);
    } else if (product.notesImage?.url) {
      addImg(product.notesImage, 'pyramid', roleLabels.pyramid);
    } else {
      const fPyramid = (product.images || []).find((i) => i.role === 'pyramid' || i.role === 'notes');
      if (fPyramid) addImg(fPyramid, 'pyramid', roleLabels.pyramid);
    }

    if (product.packagingImage?.url) {
      addImg(product.packagingImage, 'packaging', roleLabels.packaging);
    } else {
      const fPack = (product.images || []).find((i) => i.role === 'packaging');
      if (fPack) addImg(fPack, 'packaging', roleLabels.packaging);
    }

    (product.images || []).forEach((img, idx) => {
      addImg(img, img.role || 'extra', `${lang === 'ar' ? 'صورة' : 'View'} ${idx + 1}`);
    });

    if (roleImages.length === 0 && product.imageUrl) {
      roleImages.push({ url: product.imageUrl, role: 'main', label: roleLabels.bottle, alt: product.name });
    }

    return roleImages;
  }, [product, lang]);

  const mainImage = gallery.find((img) => img.url === selectedImageUrl) || gallery[0] || null;

  // Track ViewContent on Product Details Load (must stay above the early returns below: Rules of Hooks)
  useEffect(() => {
    if (rawProduct) {
      trackViewContent({
        id: rawProduct._id || rawProduct.id || id,
        name: rawProduct.name,
        price: selectedVariant?.price || rawProduct.price || 0,
        size: selectedVariant?.size || '50ml',
        category: rawProduct.category || 'Fragrance'
      });
    }
  }, [rawProduct?._id, rawProduct?.id]);

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center space-y-3 bg-[#F4F3EF]">
        <div className="w-8 h-8 border-2 border-[#174F43] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-slate-500 uppercase tracking-[0.25em]">{t('common.loading', 'Loading Atelier Fragrance...')}</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center p-6 space-y-4 text-center bg-[#F4F3EF]">
        <h2 className="text-2xl font-serif uppercase text-[#174F43]">{error || 'Product not found'}</h2>
        <p className="text-xs text-slate-500 font-light max-w-sm">
          {lang === 'ar'
            ? 'العطر الذي تبحث عنه غير متوفر حالياً أو تم نقله.'
            : 'The fragrance creation you are looking for might be temporarily unavailable or retired.'}
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 bg-[#174F43] text-white px-6 py-3 text-xs tracking-widest uppercase font-medium rounded-sm hover:bg-[#0F3830] transition-colors"
        >
          <span>{t('nav.allFragrances', 'Explore All Fragrances')}</span>
          {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
        </Link>
      </div>
    );
  }

  const sortedVariants = sortVariantsBySize(product.variants || []);
  const price = selectedVariant?.price || product.price || 0;
  const oldPrice = selectedVariant?.compareAtPrice || selectedVariant?.oldPrice;
  const hasDiscount = oldPrice && Number(oldPrice) > Number(price);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    trackAddToCart({
      id: rawProduct?._id || rawProduct?.id || product?._id || id,
      name: rawProduct?.name || product?.name,
      price: selectedVariant?.price || rawProduct?.price || 0,
      quantity,
      size: selectedVariant?.size || '50ml',
      category: rawProduct?.category || 'Fragrance'
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    trackAddToCart({
      id: rawProduct?._id || rawProduct?.id || product?._id || id,
      name: rawProduct?.name || product?.name,
      price: selectedVariant?.price || rawProduct?.price || 0,
      quantity,
      size: selectedVariant?.size || '50ml',
      category: rawProduct?.category || 'Fragrance'
    });
    navigate('/checkout');
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      return next;
    });
  };

  const rawGenderUpper = (product.gender || 'MEN').toString().toUpperCase();
  const genderDisplay = product.genderLabel || rawGenderUpper;

  const rawLongevity = product.longevityHours ?? product.longevity ?? product.performance?.longevity;
  const rawProjection = product.sillageHours ?? product.projection ?? product.performance?.projection;
  const longevityVal = (rawLongevity !== null && rawLongevity !== undefined && String(rawLongevity).trim() !== '') ? rawLongevity : '10 - 12';
  const projectionVal = (rawProjection !== null && rawProjection !== undefined && String(rawProjection).trim() !== '') ? rawProjection : '4 - 6';

  const occasionsList = Array.isArray(product.occasions) && product.occasions.length > 0
    ? product.occasions
    : (product.bestFor || product.performance?.bestFor
      ? String(product.bestFor || product.performance?.bestFor).split(',').map((s) => s.trim()).filter(Boolean)
      : []);

  const shortDesc = (product.shortDescription || '').trim();
  const fullDesc = (product.description || '').trim();
  const showBothDescriptions = Boolean(shortDesc && fullDesc && shortDesc !== fullDesc);

  const productImg = mainImage?.url || product.mainImage?.url || product.images?.[0]?.url || '/img/product.png';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'image': productImg.startsWith('http') ? productImg : `https://m20fragrance.com${productImg}`,
    'description': fullDesc || shortDesc || `M20 Haute Parfumerie: ${product.name}`,
    'brand': {
      '@type': 'Brand',
      'name': 'M20',
    },
    'offers': {
      '@type': 'Offer',
      'url': `https://m20fragrance.com/product/${product._id || product.id}`,
      'priceCurrency': 'EGP',
      'price': price,
      'priceValidUntil': '2027-12-31',
      'itemCondition': 'https://schema.org/NewCondition',
      'availability': 'https://schema.org/InStock',
      'seller': {
        '@type': 'Organization',
        'name': 'M20 Haute Parfumerie',
      },
    },
  };

  const discountPct = hasDiscount ? Math.round((1 - Number(price) / Number(oldPrice)) * 100) : 0;
  const total = Number(price) * quantity;

  const meter = (val, max) => {
    const n = parseFloat(String(val).replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? Math.min(100, Math.round((n / max) * 100)) : 60;
  };

  const notesSrc = product.fragranceNotes || product.notes || {};
  const noteRows = [
    { key: 'top', label: lang === 'ar' ? 'النوتات العليا' : 'TOP', items: notesSrc.top },
    { key: 'heart', label: lang === 'ar' ? 'القلب' : 'HEART', items: notesSrc.heart },
    { key: 'base', label: lang === 'ar' ? 'القاعدة' : 'BASE', items: notesSrc.base },
  ].filter((r) => Array.isArray(r.items) && r.items.length > 0);

  const Crumb = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="bg-[#F4F3EF] selection:bg-[#174F43] selection:text-white">
      <SEOHead
        product={rawProduct || product}
        title={`${product.name} • ${t('productDetail.concentration', 'Extrait de Parfum')}`}
        titleAr={`${product.name} • عطور M20 الفاخرة مصر`}
        description={fullDesc || shortDesc || `Buy ${product.name} online from M20 Fine Fragrances.`}
        image={productImg}
        type="product"
        canonicalUrl={typeof window !== 'undefined' ? window.location.href.split('?')[0] : undefined}
      />

      {/* Breadcrumbs */}
      <div className="border-b border-slate-200/70">
        <div className="max-w-[1280px] mx-auto px-6 py-3.5">
          <nav className="text-xs tracking-[0.15em] uppercase text-slate-500 flex items-center flex-wrap gap-1.5 font-light">
            <Link to="/" className="hover:text-[#174F43] transition-colors">{t('productDetail.breadcrumbHome', 'Home')}</Link>
            <Crumb size={12} className="text-slate-400" />
            <Link to="/shop" className="hover:text-[#174F43] transition-colors">{t('productDetail.breadcrumbShop', 'Catalog')}</Link>
            <Crumb size={12} className="text-slate-400" />
            <Link to={rawGenderUpper === 'WOMEN' ? '/women' : '/men'} className="hover:text-[#174F43] transition-colors">{genderDisplay}</Link>
            <Crumb size={12} className="text-slate-400" />
            <span className="text-[#174F43] font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* ===== Gallery (sticky on desktop) ===== */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square bg-[#E9E8E6] overflow-hidden">
              <span className="absolute top-4 start-4 z-10 bg-[#174F43] text-white text-xs font-semibold tracking-[0.2em] uppercase px-3 py-1.5">
                {mainImage?.label || product.fragranceFamily || t('productDetail.concentration', 'Extrait de Parfum')}
              </span>
              {discountPct > 0 && (
                <span className="absolute top-4 end-4 z-10 bg-[#FF9D00] text-[#0F3830] text-sm font-bold px-3 py-1.5" dir="ltr">
                  -{discountPct}%
                </span>
              )}
              <img
                src={mainImage?.url || productImg}
                alt={mainImage?.alt || product.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/product.png';
                }}
              />
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {gallery.slice(0, 8).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageUrl(img.url)}
                    className={`relative aspect-square bg-[#E9E8E6] border-2 transition-colors cursor-pointer overflow-hidden ${
                      mainImage?.url === img.url ? 'border-[#174F43]' : 'border-transparent hover:border-slate-400'
                    }`}
                    aria-label={`Select ${img.label || 'product image'}`}
                  >
                    <img src={img.url} alt={img.alt || `${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-white/90 text-[10px] uppercase tracking-wider text-slate-600 py-0.5 text-center truncate">
                      {img.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Details accordions */}
            <div className="border-t border-slate-200">
              <AccordionItem title={t('productDetail.craftsmanshipTitle', 'Maison Specifications & Details')} icon={Layers} defaultOpen={Boolean(fullDesc && showBothDescriptions)} isRTL={isRTL}>
                <div className="space-y-2">
                  <p>
                    {fullDesc || (lang === 'ar'
                      ? 'كل إبداع من دار M20 مصاغ بدقة في مختبرنا بالقاهرة، ومُعتق حتى النضج العطري التام ومُعبأ تحت معايير صارمة لضمان تجربة عطرية لا تُنسى.'
                      : 'Each M20 creation is formulated in our Cairo laboratory, matured to perfection, and bottled under strict atmospheric controls to ensure an unforgettable olfactory journey.')}
                  </p>
                  <ul className="space-y-1 text-slate-600 pt-1">
                    <li>• {t('productDetail.specConcentration', 'Classification')}: {t('productDetail.concentration', 'Extrait de Parfum')}</li>
                    <li>• {t('productDetail.specOrigin', 'Formulated in Cairo, Egypt')}</li>
                  </ul>
                </div>
              </AccordionItem>
              <AccordionItem title={t('productDetail.applicationTitle', 'Application & Sillage Ritual')} icon={Droplets} isRTL={isRTL}>
                <p>{t('productDetail.applicationText', 'Spray at pulse points, wrists, neck, and behind the ears, for rich, enduring sillage throughout the day.')}</p>
              </AccordionItem>
              <AccordionItem title={t('productDetail.shippingReturnsTitle', 'Shipping & Authentic Guarantee')} icon={Truck} isRTL={isRTL}>
                <p>{t('productDetail.shippingText', 'Delivered in 2-4 business days across Egypt. Metro pickup available for Cairo & Giza. 14-day return privilege on sealed items.')}</p>
              </AccordionItem>
            </div>
          </div>

          {/* ===== Purchase panel ===== */}
          <div className="lg:col-span-5 flex flex-col gap-7 text-start">

            {/* Title block */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs uppercase tracking-[0.22em] text-[#FF9D00] font-bold">
                  {lang === 'ar'
                    ? `دار M20 • ${genderDisplay}`
                    : `M20 ATELIER • ${genderDisplay} ${t('productDetail.collectionSuffix', 'COLLECTION')}`}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 size={13} />
                  {t('productDetail.inStock', 'IN STOCK')}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-serif uppercase text-[#174F43] leading-[1.05]">{product.name}</h1>

              {(shortDesc || fullDesc) && (
                <p className="text-base text-slate-600 font-light leading-relaxed">{shortDesc || fullDesc}</p>
              )}

              <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1 pt-1">
                <span className="text-4xl font-serif font-semibold text-[#174F43]">{formatPrice(price)}</span>
                {hasDiscount && <span className="text-xl font-serif text-slate-400 line-through font-light">{formatPrice(oldPrice)}</span>}
                {discountPct > 0 && (
                  <span className="text-xs font-bold bg-[#FF9D00]/15 text-[#9a5b00] border border-[#FF9D00]/40 px-2 py-1" dir="ltr">
                    {lang === 'ar' ? `وفّر ${discountPct}%` : `SAVE ${discountPct}%`}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-light">{t('productDetail.taxesIncluded', 'Taxes & luxury packaging included')}</p>
            </div>

            {/* Size */}
            {sortedVariants.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.18em] text-slate-700 font-semibold">{t('productDetail.size', 'Select Size')}</span>
                  <span className="text-sm text-[#174F43] font-semibold">{selectedVariant?.size}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {sortedVariants.map((variant) => {
                    const isSelected = selectedVariant?._id === variant._id || selectedVariant?.size === variant.size;
                    const vOldPrice = variant.compareAtPrice || variant.oldPrice;
                    const vHasDiscount = vOldPrice && Number(vOldPrice) > Number(variant.price);
                    return (
                      <button
                        key={variant._id || variant.size}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        aria-pressed={isSelected}
                        className={`relative px-2 py-3.5 text-center border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#174F43] text-white border-[#174F43]'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-[#174F43]'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-1.5 end-1.5 w-4 h-4 rounded-full bg-[#FF9D00] text-[#0F3830] flex items-center justify-center">
                            <Check size={10} strokeWidth={3} />
                          </span>
                        )}
                        <span className="block font-bold text-base">{variant.size}</span>
                        {vHasDiscount && (
                          <span className={`block text-xs line-through ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>{formatPrice(vOldPrice)}</span>
                        )}
                        <span className={`block text-sm font-semibold mt-0.5 ${isSelected ? 'text-[#FF9D00]' : 'text-[#174F43]'}`}>{formatPrice(variant.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity + total + CTAs */}
            <div className="bg-white border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center border border-slate-300 h-12 w-36 shrink-0 bg-white">
                  <button type="button" onClick={() => handleQuantityChange(-1)} className="w-11 h-full flex items-center justify-center text-slate-500 hover:text-[#174F43] cursor-pointer" aria-label="Decrease quantity">
                    <Minus size={15} strokeWidth={1.6} />
                  </button>
                  <div className="flex-1 text-center text-base font-semibold text-[#174F43]">{quantity}</div>
                  <button type="button" onClick={() => handleQuantityChange(1)} className="w-11 h-full flex items-center justify-center text-slate-500 hover:text-[#174F43] cursor-pointer" aria-label="Increase quantity">
                    <Plus size={15} strokeWidth={1.6} />
                  </button>
                </div>
                <div className="text-end">
                  <span className="block text-xs uppercase tracking-widest text-slate-500">{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                  <span className="block text-2xl font-serif font-semibold text-[#174F43]">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-14 bg-[#FF9D00] hover:bg-[#E68D00] text-[#0F3830] text-sm font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer"
              >
                {lang === 'ar' ? 'اطلب الآن' : 'BUY NOW'}
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full h-12 text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  addedAnimation ? 'bg-emerald-700 text-white' : 'bg-[#174F43] text-white hover:bg-[#0F3830]'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check size={16} />
                    <span>{t('productDetail.addedToCart', 'ADDED TO BAG')}</span>
                  </>
                ) : (
                  <span>{t('productDetail.addToCart', 'ADD TO SHOPPING BAG')}</span>
                )}
              </button>

              <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs text-slate-600">
                <div className="flex flex-col items-center gap-1.5">
                  <Truck size={18} className="text-[#174F43]" />
                  <span>{lang === 'ar' ? 'توصيل 2-4 أيام' : 'Delivery 2–4 days'}</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <ShieldCheck size={18} className="text-[#174F43]" />
                  <span>{lang === 'ar' ? 'أصلي 100%' : '100% Authentic'}</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <RotateCcw size={18} className="text-[#174F43]" />
                  <span>{lang === 'ar' ? 'معاينة عند الاستلام' : 'Inspect on delivery'}</span>
                </div>
              </div>
            </div>

            {/* Notes pyramid */}
            {noteRows.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.18em] text-slate-700 font-semibold block">
                  {lang === 'ar' ? 'الهرم العطري' : 'Fragrance Notes'}
                </span>
                <dl className="border border-slate-200 bg-white divide-y divide-slate-200">
                  {noteRows.map((r) => (
                    <div key={r.key} className="flex items-baseline gap-4 px-4 py-3">
                      <dt className="w-20 shrink-0 text-xs uppercase tracking-widest text-[#FF9D00] font-bold">{r.label}</dt>
                      <dd className="text-sm text-[#174F43]">{r.items.join(' · ')}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Performance */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Clock, label: t('productDetail.longevity', 'Longevity'), val: longevityVal, pct: meter(longevityVal, 14) },
                { icon: Wind, label: t('productDetail.sillage', 'Sillage'), val: projectionVal, pct: meter(projectionVal, 8) },
              ].map(({ icon: Icon, label, val, pct }) => (
                <div key={label} className="bg-white border border-slate-200 p-4 space-y-2">
                  <div className="flex items-center justify-between text-[#174F43]">
                    <span className="text-xs uppercase tracking-[0.15em] font-semibold text-slate-500">{label}</span>
                    <Icon size={17} strokeWidth={1.6} />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-serif font-bold text-[#174F43]">{val}</span>
                    <span className="text-xs text-slate-500">{String(val).toLowerCase().includes('hour') ? '' : t('productDetail.hours', 'Hours')}</span>
                  </div>
                  <div className="h-1 bg-[#F4F3EF] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#174F43] to-[#FF9D00]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Best for */}
            {occasionsList.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-xs uppercase tracking-[0.18em] text-slate-700 font-semibold block">{t('productDetail.bestFor', 'Best For')}</span>
                <div className="flex flex-wrap gap-2">
                  {occasionsList.map((occ) => {
                    const meta = getOccasionMeta(occ, lang);
                    const OccIcon = meta.icon;
                    return (
                      <span key={occ} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-sm text-[#174F43] font-medium">
                        <OccIcon size={14} strokeWidth={1.6} />
                        <span>{meta.label}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-200 text-start">
            <span className="text-xs uppercase tracking-[0.25em] text-[#FF9D00] font-semibold block mb-1">
              {lang === 'ar' ? 'قد يعجبك أيضاً' : 'You May Also Like'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif uppercase text-[#174F43] mb-6">
              {lang === 'ar' ? 'إبداعات عطرية متكاملة' : 'Complementary Creations'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedProducts.map((rel) => {
                const rp = translateProduct ? translateProduct(rel) : rel;
                const rid = rp._id || rp.id || rp.slug;
                const rimg = rp.mainImage?.url || rp.images?.find((i) => i.role === 'main')?.url || rp.images?.[0]?.url || '/img/product.png';
                const { minPrice, maxPrice, isRange } = getProductPriceSummary(rp);
                return (
                  <Link
                    key={rid}
                    to={`/product/${rid}`}
                    className="group flex items-stretch bg-white border border-slate-200 hover:border-[#174F43] transition-colors overflow-hidden"
                  >
                    <div className="w-28 sm:w-32 shrink-0 bg-[#E9E8E6]">
                      <img
                        src={rimg}
                        alt={rp.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/img/product.png'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 p-4 flex flex-col justify-center gap-1">
                      {rp.fragranceFamily && (
                        <span className="text-xs uppercase tracking-widest text-slate-500 truncate">{rp.fragranceFamily}</span>
                      )}
                      <span className="font-serif text-xl uppercase text-[#174F43] truncate">{rp.name}</span>
                      <span className="text-sm font-semibold text-[#174F43]">
                        {isRange ? `${minPrice.toLocaleString()} – ${maxPrice.toLocaleString()}` : minPrice.toLocaleString()}{' '}
                        <span className="text-xs font-medium">{t('common.currency', 'EGP')}</span>
                      </span>
                    </div>
                    <span className="self-center pe-4 text-[#174F43] transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                      {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
