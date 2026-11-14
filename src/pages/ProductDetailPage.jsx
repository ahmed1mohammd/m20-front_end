import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, getProducts } from '../services/api';
import { getFallbackProductById } from '../data/fallbackCatalog';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { sortVariantsBySize } from '../utils/productPricing';
import ProductCard from '../components/ProductCard';
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

  // Track ViewContent on Product Details Load
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

      {/* Top Breadcrumbs */}
      <div className="border-b border-slate-200/70 bg-[#ECEAE3]/60">
        <div className="max-w-[1200px] mx-auto px-6 py-3.5">
          <nav className={`text-[11px] tracking-[0.15em] uppercase text-slate-500 flex items-center flex-wrap gap-1.5 ${isRTL ? 'text-right' : 'text-left'} font-light`}>
            <Link to="/" className="hover:text-[#174F43] transition-colors">{t('productDetail.breadcrumbHome', 'Home')}</Link>
            {isRTL ? <ChevronLeft size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />}
            <Link to="/shop" className="hover:text-[#174F43] transition-colors">{t('productDetail.breadcrumbShop', 'Catalog')}</Link>
            {isRTL ? <ChevronLeft size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />}
            <Link to={rawGenderUpper === 'WOMEN' ? '/women' : '/men'} className="hover:text-[#174F43] transition-colors">
              {genderDisplay}
            </Link>
            {isRTL ? <ChevronLeft size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />}
            <span className="text-[#174F43] font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Presentation */}
      <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* LEFT: Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">

            {/* Thumbnails Sidebar */}
            {gallery.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[520px] pb-2 sm:pb-0 scrollbar-thin">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageUrl(img.url)}
                    className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 border bg-[#FAF9F6] transition-all duration-150 rounded-sm p-1.5 flex flex-col items-center justify-between cursor-pointer ${
                      mainImage?.url === img.url
                        ? 'border-[#174F43] ring-1 ring-[#174F43]'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                    aria-label={`Select ${img.label || 'product image'}`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || `${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-11 sm:h-13 object-contain mix-blend-multiply"
                    />
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-medium truncate block max-w-full">
                      {img.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Primary Image Viewer */}
            <div className="relative flex-1 aspect-square bg-[#ECEAE3]/55 border border-slate-200/80 rounded-sm flex items-center justify-center p-8 sm:p-12 overflow-hidden">
              <span className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} text-[10px] uppercase tracking-[0.2em] font-medium text-slate-500 bg-[#F4F3EF]/90 px-2.5 py-1 rounded-sm border border-slate-200/80`}>
                {mainImage?.label || product.fragranceFamily || t('productDetail.concentration', 'Extrait de Parfum')}
              </span>

              <img
                src={mainImage?.url || productImg}
                alt={mainImage?.alt || product.name}
                className="w-full h-full object-contain mix-blend-multiply"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/product.png';
                }}
              />
            </div>
          </div>

          {/* RIGHT: Product Information & Purchase Area (5 Cols) */}
          <div className={`lg:col-span-5 flex flex-col ${isRTL ? 'text-right' : 'text-left'} space-y-6`}>

            {/* Header: Subtitle, Title, Price */}
            <div className="space-y-2 border-b border-slate-200/80 pb-5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#174F43] font-bold block">
                  {lang === 'ar'
                    ? `دار M20 • ${genderDisplay}`
                    : `M20 ATELIER • ${genderDisplay} ${t('productDetail.collectionSuffix', 'COLLECTION')}`}
                </span>
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
                  <CheckCircle2 size={11} className={isRTL ? 'ml-1' : 'mr-1'} />
                  <span>{t('productDetail.inStock', 'IN STOCK')}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif uppercase text-[#174F43] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Price & Currency */}
              <div className={`pt-2 flex items-baseline flex-wrap gap-x-3 gap-y-1`}>
                {hasDiscount && (
                  <span className="text-lg sm:text-xl font-serif text-slate-400 line-through font-light">
                    {formatPrice(oldPrice)}
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-serif font-semibold text-[#174F43]">
                  {formatPrice(price)}
                </span>
                <span className="text-xs text-slate-500 font-light">
                  {t('productDetail.taxesIncluded', 'Taxes & luxury packaging included')}
                </span>
              </div>
            </div>

            {/* Product Description */}
            {(fullDesc || shortDesc) && (
              <div className="space-y-2">
                {showBothDescriptions ? (
                  <>
                    <p className="text-xs sm:text-sm text-[#174F43]/90 font-medium leading-relaxed">
                      {shortDesc}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                      {fullDesc}
                    </p>
                  </>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                    {fullDesc || shortDesc}
                  </p>
                )}
              </div>
            )}

            {/* Longevity & Sillage (الثبات والفوحان) */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`bg-[#FAF9F6] border border-slate-200/90 p-3.5 rounded-sm flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <div className="w-10 h-10 rounded-full bg-[#F4F3EF] border border-slate-200 flex items-center justify-center shrink-0 text-[#174F43]">
                  <Clock size={18} strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-slate-500 block leading-none">
                    {t('productDetail.longevity', 'Longevity')}
                  </span>
                  <div className={`mt-1.5 flex items-baseline gap-1`}>
                    <span className="text-lg font-serif font-bold text-[#174F43] leading-tight">
                      {longevityVal}
                    </span>
                    <span className="text-xs text-slate-500 font-light">
                      {String(longevityVal).toLowerCase().includes('hour') ? '' : t('productDetail.hours', 'Hours')}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`bg-[#FAF9F6] border border-slate-200/90 p-3.5 rounded-sm flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <div className="w-10 h-10 rounded-full bg-[#F4F3EF] border border-slate-200 flex items-center justify-center shrink-0 text-[#174F43]">
                  <Wind size={18} strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-slate-500 block leading-none">
                    {t('productDetail.sillage', 'Sillage')}
                  </span>
                  <div className={`mt-1.5 flex items-baseline gap-1`}>
                    <span className="text-lg font-serif font-bold text-[#174F43] leading-tight">
                      {projectionVal}
                    </span>
                    <span className="text-xs text-slate-500 font-light">
                      {String(projectionVal).toLowerCase().includes('hour') ? '' : t('productDetail.hours', 'Hours')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Best For / Occasions */}
            {occasionsList.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold block">
                  {t('productDetail.bestFor', 'Best For')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {occasionsList.map((occ) => {
                    const meta = getOccasionMeta(occ, lang);
                    const OccIcon = meta.icon;
                    return (
                      <span
                        key={occ}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF9F6] border border-slate-200/90 rounded-sm text-xs text-[#174F43] font-medium"
                      >
                        <OccIcon size={13} strokeWidth={1.6} className="text-[#174F43]/80" />
                        <span>{meta.label}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Flacon Size Selection */}
            {sortedVariants.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-widest text-slate-600 font-semibold">{t('productDetail.size', 'Select Size')}</span>
                  <span className="text-slate-500 font-light text-[11px]">{selectedVariant?.size}</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {sortedVariants.map((variant) => {
                    const isSelected = selectedVariant?._id === variant._id || selectedVariant?.size === variant.size;
                    const vPrice = variant.price;
                    const vOldPrice = variant.compareAtPrice || variant.oldPrice;
                    const vHasDiscount = vOldPrice && Number(vOldPrice) > Number(vPrice);

                    return (
                      <button
                        key={variant._id || variant.size}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-3 text-xs tracking-wider uppercase transition-all duration-150 rounded-sm text-center border flex flex-col items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-[#174F43] text-white border-[#174F43]'
                            : 'bg-[#FAF9F6] text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <span className="font-bold text-xs">{variant.size}</span>
                        <div className="mt-1 flex flex-col items-center">
                          {vHasDiscount && (
                            <span className={`text-[10px] line-through font-light ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                              {formatPrice(vOldPrice)}
                            </span>
                          )}
                          <span className={`text-[11px] font-semibold ${isSelected ? 'text-white' : 'text-[#174F43]'}`}>
                            {formatPrice(vPrice)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Box */}
                <div className="flex items-center border border-slate-300 h-12 w-32 shrink-0 rounded-sm bg-[#FAF9F6]">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-[#174F43] transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} strokeWidth={1.5} />
                  </button>
                  <div className="flex-1 text-center text-xs font-semibold text-[#174F43]">
                    {quantity}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-[#174F43] transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 h-12 px-6 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-150 rounded-sm flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} cursor-pointer ${
                    addedAnimation
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#174F43] text-white hover:bg-[#0F3830]'
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
              </div>

              {/* Express Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-11 border border-[#174F43] text-[#174F43] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#174F43]/5 transition-colors duration-150 rounded-sm cursor-pointer"
              >
                {lang === 'ar' ? 'شراء فوري بضغطة واحدة' : 'BUY NOW WITH 1-CLICK'}
              </button>
            </div>

            {/* Maison Guarantees Strip */}
            <div className="pt-4 border-t border-slate-200/80 space-y-2.5 text-xs text-slate-600 font-light">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2.5' : 'space-x-2.5'}`}>
                <Truck size={15} className="text-[#174F43] flex-shrink-0" />
                <span>{t('features.f4Desc', 'Express delivery across Egypt (2 to 4 business days)')}</span>
              </div>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2.5' : 'space-x-2.5'}`}>
                <ShieldCheck size={15} className="text-[#174F43] flex-shrink-0" />
                <span>{t('productDetail.authenticGuarantee', '100% Authentic Maison Formulation • Extrait de Parfum')}</span>
              </div>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2.5' : 'space-x-2.5'}`}>
                <RotateCcw size={15} className="text-[#174F43] flex-shrink-0" />
                <span>{t('productDetail.parcelInspection', 'Guaranteed parcel inspection upon delivery')}</span>
              </div>
            </div>

            {/* Collapsible Dropdown Accordions */}
            <div className="pt-2 border-t border-slate-200/80">
              <AccordionItem title={t('productDetail.craftsmanshipTitle', 'Maison Specifications & Details')} icon={Layers} defaultOpen={true} isRTL={isRTL}>
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
                <p>
                  {t('productDetail.applicationText', 'Spray at pulse points, wrists, neck, and behind the ears, for rich, enduring sillage throughout the day.')}
                </p>
              </AccordionItem>

              <AccordionItem title={t('productDetail.shippingReturnsTitle', 'Shipping & Authentic Guarantee')} icon={Truck} isRTL={isRTL}>
                <p>
                  {t('productDetail.shippingText', 'Delivered in 2-4 business days across Egypt. Metro pickup available for Cairo & Giza. 14-day return privilege on sealed items.')}
                </p>
              </AccordionItem>
            </div>

          </div>
        </div>

        {/* Related Fragrances Section */}
        {relatedProducts.length > 0 && (
          <div className={`mt-20 pt-12 border-t border-slate-200/80 ${isRTL ? 'text-right' : 'text-left'}`}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 block mb-1">
              {lang === 'ar' ? 'قد يعجبك أيضاً' : 'You May Also Like'}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif uppercase text-[#174F43] mb-6">
              {lang === 'ar' ? 'إبداعات عطرية متكاملة' : 'Complementary Creations'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id || rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetailPage;
