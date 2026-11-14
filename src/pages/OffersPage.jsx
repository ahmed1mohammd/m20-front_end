import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  Check, 
  Tag, 
  Package, 
  Clock, 
  ShieldCheck,
  Gift
} from 'lucide-react';
import SEO from '../components/SEO';
import { getActiveOffers } from '../services/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedItemKey, setAddedItemKey] = useState(null);
  const { addToCart, setIsCartOpen } = useCart();
  const { t, lang, isRTL, formatPrice, translateProduct } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const data = await getActiveOffers();
        setOffers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load active offers:', err);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Safe image helper
  const getImageUrl = (img, fallback = '/img/product.png') => {
    if (!img) return fallback;
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return fallback;
  };

  // Add a bundle to cart
  const handleAddBundleToCart = (offer) => {
    const rawItems = (offer.bundleItems || []).filter((item) => Boolean(item && item.product));
    if (rawItems.length === 0) return;

    const itemCount = rawItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const bundleTotal = Number(offer.bundlePrice) || 0;
    const pricePerUnit = itemCount > 0 && bundleTotal > 0 ? Math.round(bundleTotal / itemCount) : 0;

    rawItems.forEach((item) => {
      const prod = item.product;
      if (!prod) return;

      const variant = (prod.variants || []).find((v) => v.size === item.size) || prod.variants?.[0] || {
        size: item.size || '50ml',
        price: pricePerUnit || 350,
        SKU: `${prod.slug || 'M20'}-${item.size || '50ml'}`
      };

      const promoVariant = {
        ...variant,
        price: pricePerUnit > 0 ? pricePerUnit : variant.price,
        compareAtPrice: variant.price
      };

      addToCart(prod, promoVariant, item.quantity || 1);
    });

    setAddedItemKey(offer._id);
    setTimeout(() => setAddedItemKey(null), 2000);
    setIsCartOpen(true);
  };

  // Add single promotional product to cart
  const handleAddPromoProduct = (product, offer, selectedSize = '50ml') => {
    if (!product) return;
    const variant = (product.variants || []).find((v) => v.size === selectedSize) || 
      product.variants?.[0] || { size: selectedSize, price: 350, SKU: `${product.slug || 'M20'}-${selectedSize}` };

    let discountedPrice = variant.price;
    if (offer.discountType === 'percentage' && offer.discountValue > 0) {
      discountedPrice = Math.max(0, Math.round(variant.price * (1 - offer.discountValue / 100)));
    } else if (offer.discountType === 'fixed' && offer.discountValue > 0) {
      discountedPrice = Math.max(0, variant.price - offer.discountValue);
    }

    const promoVariant = {
      ...variant,
      price: discountedPrice,
      compareAtPrice: variant.price
    };

    addToCart(product, promoVariant, 1);
    setAddedItemKey(`${offer._id}-${product._id}`);
    setTimeout(() => setAddedItemKey(null), 2000);
    setIsCartOpen(true);
  };

  const bundles = offers.filter((o) => o.offerType === 'bundle');
  const productOffers = offers.filter((o) => o.offerType === 'product_specific');
  const generalOffers = offers.filter((o) => o.offerType === 'general');

  return (
    <div className="bg-[#F4F3EF] min-h-screen text-[#0B0B0B]">
      <SEO
        title={lang === 'ar' ? 'العروض الخاصة وباقات الدار • دار M20 للعطور' : 'Exclusive Offers & Bespoke Privileges • M20 Fine Fragrances'}
        description={lang === 'ar' ? 'استكشف باقات عطور نيش حصرية وخصومات خاصة وإصدارات محدودة من دار M20 بالقاهرة.' : 'Explore exclusive haute parfumerie bundles, promotional discounts, and limited-edition privilege offerings from M20 Cairo.'}
        keywords="عروض عطور M20, تخفيضات برفانات نيش مصر, M20 perfume bundle discount, luxury perfume offers Cairo"
      />

      {/* Hero Header */}
      <section className="relative bg-[#174F43] text-white py-14 sm:py-16 md:py-20 overflow-hidden">
        {/* Animated Flowing Wavy Lines */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <svg
            className="m20-wave-slow absolute bottom-0 left-0 h-full w-[200%] max-w-none"
            viewBox="0 0 2880 220"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0 112 c 120 -38, 240 -38, 360 0 s 240 38, 360 0 c 120 -38, 240 -38, 360 0 s 240 38, 360 0 c 120 -38, 240 -38, 360 0 s 240 38, 360 0 c 120 -38, 240 -38, 360 0 s 240 38, 360 0"
              stroke="rgba(255, 255, 255, 0.16)"
              strokeWidth="1.5"
            />
            <path
              d="M0 156 c 120 -26, 240 -26, 360 0 s 240 26, 360 0 c 120 -26, 240 -26, 360 0 s 240 26, 360 0 c 120 -26, 240 -26, 360 0 s 240 26, 360 0 c 120 -26, 240 -26, 360 0 s 240 26, 360 0"
              stroke="rgba(255, 157, 0, 0.24)"
              strokeWidth="1.25"
            />
          </svg>
          <svg
            className="m20-wave-reverse absolute top-0 left-0 h-full w-[200%] max-w-none"
            viewBox="0 0 2880 220"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0 68 c 120 -30, 240 -30, 360 0 s 240 30, 360 0 c 120 -30, 240 -30, 360 0 s 240 30, 360 0 c 120 -30, 240 -30, 360 0 s 240 30, 360 0 c 120 -30, 240 -30, 360 0 s 240 30, 360 0"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1.25"
            />
            <path
              d="M0 132 c 120 -20, 240 -20, 360 0 s 240 20, 360 0 c 120 -20, 240 -20, 360 0 s 240 20, 360 0 c 120 -20, 240 -20, 360 0 s 240 20, 360 0 c 120 -20, 240 -20, 360 0 s 240 20, 360 0"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center space-y-3.5">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white/10 border border-white/20 px-3.5 py-1 rounded-sm text-xs tracking-[0.2em] font-medium uppercase text-white">
            <Tag size={13} className="text-[#FF9D00]" />
            <span>{lang === 'ar' ? 'مزايا الدار الحصرية' : 'ATELIER PRIVILEGES'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif uppercase tracking-tight text-white leading-tight">
            {lang === 'ar' ? 'العروض الحصرية والباقات' : 'EXCLUSIVE OFFERS & BUNDLES'}
          </h1>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-14">
        
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#174F43] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs tracking-widest text-slate-500 uppercase">
              {lang === 'ar' ? 'جاري تحميل العروض...' : 'Loading privileges...'}
            </p>
          </div>
        ) : offers.length === 0 ? (
          /* Empty State */
          <div className="bg-slate-50/70 border border-slate-200 p-10 sm:p-14 text-center rounded-sm max-w-xl mx-auto space-y-4">
            <Gift size={32} className="text-[#174F43] mx-auto stroke-1" />
            <h2 className="text-xl font-serif text-[#174F43] uppercase">
              {lang === 'ar' ? 'لا توجد عروض نشطة حالياً' : 'All current offers concluded'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto font-light">
              {lang === 'ar'
                ? 'باقاتنا الحصرية تُصاغ يدوياً بكميات محدودة في ورشتنا بالقاهرة. استكشف مجموعتنا العطرية الدائمة أو تابعنا للعروض القادمة.'
                : 'Our bespoke promotional sets are handcrafted in limited quantities. Explore our permanent collection or check back soon for the next private drop.'}
            </p>
            <div className="pt-3">
              <Link
                to="/shop"
                className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#174F43] text-white px-7 py-3 text-xs uppercase tracking-widest font-medium hover:bg-[#0F3830] transition-colors rounded-sm"
              >
                <span>{lang === 'ar' ? 'استكشف كافة العطور' : 'EXPLORE ALL FRAGRANCES'}</span>
                {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* 1. Bundles Section */}
            {bundles.length > 0 && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold block">
                      {lang === 'ar' ? 'باقات مختارة' : 'CURATED SETS'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif text-[#174F43] uppercase tracking-wide">
                      {lang === 'ar' ? 'باقات الهدايا والمجموعات العطرية' : 'Fragrance Bundles & Gift Sets'}
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {bundles.length} {lang === 'ar' ? 'باقة متاحة' : `bundle${bundles.length > 1 ? 's' : ''}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {bundles.map((bundle) => {
                    const isAdded = addedItemKey === bundle._id;
                    const items = (bundle.bundleItems || []).filter((item) => Boolean(item && item.product));
                    
                    const calculatedOriginalTotal = items.reduce((sum, item) => {
                      const prod = item.product;
                      const v = prod?.variants?.find((varItem) => varItem.size === item.size) || prod?.variants?.[0];
                      return sum + (v?.price || 350) * (item.quantity || 1);
                    }, 0);

                    const savings = (bundle.bundlePrice && calculatedOriginalTotal > bundle.bundlePrice)
                      ? calculatedOriginalTotal - bundle.bundlePrice
                      : null;

                    const bannerImg = getImageUrl(bundle.bannerImage, '/img/offers.png');

                    return (
                      <div
                        key={bundle._id}
                        className="bg-white border border-slate-200 rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
                      >
                        {/* Bundle Banner Image */}
                        <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-slate-100 overflow-hidden">
                          <img
                            src={bannerImg}
                            alt={bundle.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/img/offers.png';
                            }}
                          />
                          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-wrap gap-1.5">
                            {bundle.badge && (
                              <span className="bg-[#174F43] text-white text-[10px] uppercase font-semibold px-2.5 py-1 rounded-sm tracking-wider shadow-sm">
                                {bundle.badge}
                              </span>
                            )}
                            {savings && savings > 0 && (
                              <span className="bg-emerald-700 text-white text-[10px] uppercase font-semibold px-2.5 py-1 rounded-sm tracking-wider shadow-sm">
                                {lang === 'ar' ? `وفر ${formatPrice(savings)}` : `SAVE ${formatPrice(savings)}`}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bundle Content */}
                        <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <h3 className="text-lg font-serif uppercase tracking-tight text-[#174F43] leading-snug">
                              {bundle.title}
                            </h3>
                            {bundle.subtitle && (
                              <p className="text-xs text-slate-500 font-medium">{bundle.subtitle}</p>
                            )}
                            {bundle.description && (
                              <p className="text-xs text-slate-600 leading-relaxed font-light">{bundle.description}</p>
                            )}
                          </div>

                          {/* Bundle Items Showcase */}
                          {items.length > 0 && (
                            <div className="bg-slate-50/70 border border-slate-200/80 p-3.5 rounded-sm space-y-2">
                              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                                {lang === 'ar' ? 'المحتويات في هذه الباقة:' : 'Included in this package:'}
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {items.map((item, idx) => {
                                  const prod = translateProduct ? translateProduct(item.product) : item.product;
                                  const itemImg = getImageUrl(prod?.images?.[0], '/img/product.png');

                                  return (
                                    <div key={idx} className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-700 bg-white p-2 border border-slate-200 rounded-sm">
                                      <img
                                        src={itemImg}
                                        alt={prod?.name}
                                        className="w-9 h-9 object-contain bg-slate-50 p-0.5 rounded-sm shrink-0"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = '/img/product.png';
                                        }}
                                      />
                                      <div className="min-w-0 flex-1">
                                        <p className="font-medium text-[#174F43] truncate uppercase text-[11px]">
                                          {prod?.name || 'M20 Fragrance'}
                                        </p>
                                        <span className="text-[10px] text-slate-500 font-mono">
                                          {item.size} • {item.quantity}x
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Price & Action */}
                          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                            <div>
                              <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
                                <span className="text-lg sm:text-xl font-serif font-bold text-[#174F43]">
                                  {formatPrice(bundle.bundlePrice || 0)}
                                </span>
                                {savings && calculatedOriginalTotal > (bundle.bundlePrice || 0) && (
                                  <span className="text-xs text-slate-400 line-through">
                                    {formatPrice(calculatedOriginalTotal)}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-emerald-700 font-medium">
                                {lang === 'ar' ? 'كمية محدودة مصاغة يدوياً' : 'Limited batch availability'}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddBundleToCart(bundle)}
                              className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#174F43] hover:bg-[#0F3830] text-white px-5 py-2.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-colors"
                            >
                              {isAdded ? (
                                <>
                                  <Check size={14} className="text-emerald-400" />
                                  <span>{lang === 'ar' ? 'تمت الإضافة' : 'ADDED TO BAG'}</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag size={14} />
                                  <span>{lang === 'ar' ? 'أضف الباقة' : 'ADD BUNDLE'}</span>
                                </>
                              )}
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Product-Specific Offers Section */}
            {productOffers.length > 0 && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold block">
                      {lang === 'ar' ? 'خصومات مختارة' : 'FEATURED PROMOTIONS'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif text-[#174F43] uppercase tracking-wide">
                      {lang === 'ar' ? 'العروض والخصومات الخاصة' : 'Fragrance Privileges & Discounts'}
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {productOffers.length} {lang === 'ar' ? 'عرض خاص' : `promotion${productOffers.length > 1 ? 's' : ''}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productOffers.map((offer) => {
                    const productsList = (offer.applicableProducts || []).filter((p) => Boolean(p && (p._id || p.name)));
                    const sizes = offer.applicableSizes && offer.applicableSizes.length > 0 
                      ? offer.applicableSizes 
                      : ['50ml', '100ml'];

                    const bannerImg = getImageUrl(offer.bannerImage, '/img/offers.png');

                    return (
                      <div
                        key={offer._id}
                        className="bg-white border border-slate-200 rounded-sm overflow-hidden flex flex-col justify-between hover:border-[#174F43] transition-colors duration-150"
                      >
                        {/* Top Banner */}
                        <div className="relative h-44 bg-slate-100 overflow-hidden">
                          <img
                            src={bannerImg}
                            alt={offer.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/img/offers.png';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          
                          <div className="absolute top-2.5 left-2.5 rtl:left-auto rtl:right-2.5 flex gap-1">
                            {offer.badge && (
                              <span className="bg-[#174F43] text-white text-[10px] uppercase font-semibold px-2 py-0.5 rounded-sm tracking-wider shadow-sm">
                                {offer.badge}
                              </span>
                            )}
                            <span className="bg-white text-[#174F43] text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm shadow-sm">
                              {offer.discountType === 'percentage' 
                                ? `${offer.discountValue}% ${lang === 'ar' ? 'خصم' : 'OFF'}` 
                                : `${formatPrice(offer.discountValue)} ${lang === 'ar' ? 'خصم' : 'OFF'}`}
                            </span>
                          </div>

                          <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                            <h3 className="text-sm font-serif uppercase tracking-wider font-bold drop-shadow-sm">
                              {offer.title}
                            </h3>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div>
                            {offer.subtitle && (
                              <p className="text-xs text-slate-600 font-medium">{offer.subtitle}</p>
                            )}
                            {offer.description && (
                              <p className="text-xs text-slate-500 font-light mt-1 line-clamp-2 leading-relaxed">{offer.description}</p>
                            )}
                            
                            {/* Eligible sizes badge list */}
                            <div className="flex items-center space-x-1.5 rtl:space-x-reverse mt-3 pt-2 border-t border-slate-100">
                              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                                {lang === 'ar' ? 'متاح للأحجام:' : 'Valid for:'}
                              </span>
                              <div className="flex space-x-1 rtl:space-x-reverse">
                                {sizes.map((s) => (
                                  <span key={s} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-sm">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Action products */}
                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            {productsList.length > 0 ? (
                              <div className="space-y-1.5">
                                {productsList.slice(0, 2).map((rawProduct) => {
                                  const product = translateProduct ? translateProduct(rawProduct) : rawProduct;
                                  const key = `${offer._id}-${product._id}`;
                                  const isAdded = addedItemKey === key;
                                  const defaultSize = sizes[0] || '50ml';
                                  const defaultVariant = product.variants?.find((v) => v.size === defaultSize) || product.variants?.[0];
                                  const originalPrice = defaultVariant?.price || 350;
                                  const promoPrice = offer.discountType === 'percentage'
                                    ? Math.round(originalPrice * (1 - offer.discountValue / 100))
                                    : Math.max(0, originalPrice - offer.discountValue);

                                  const prodImg = getImageUrl(product.images?.[0], '/img/product.png');

                                  return (
                                    <div key={product._id} className="flex items-center justify-between text-xs p-1.5 bg-slate-50/70 border border-slate-200/70 rounded-sm">
                                      <div className="flex items-center space-x-2 rtl:space-x-reverse truncate">
                                        <img
                                          src={prodImg}
                                          alt={product.name}
                                          className="w-7 h-7 object-contain bg-white rounded-sm p-0.5 shrink-0"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/img/product.png';
                                          }}
                                        />
                                        <div className="truncate">
                                          <p className="font-medium text-[#174F43] uppercase text-[11px] truncate">{product.name}</p>
                                          <p className="text-[10px] text-slate-500">
                                            <span className="font-semibold text-[#174F43]">{formatPrice(promoPrice)}</span>
                                            <span className="line-through text-slate-400 mx-1.5 font-light">{formatPrice(originalPrice)}</span>
                                          </p>
                                        </div>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => handleAddPromoProduct(product, offer, defaultSize)}
                                        className="shrink-0 bg-[#174F43] text-white px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-sm hover:bg-[#0F3830] transition-colors"
                                      >
                                        {isAdded ? (lang === 'ar' ? 'تمت الإضافة' : 'Added') : (lang === 'ar' ? 'أضف للسلة' : 'Add to Bag')}
                                      </button>
                                    </div>
                                  );
                                })}

                                {productsList.length > 2 && (
                                  <Link
                                    to="/shop"
                                    className="text-[11px] text-[#174F43] hover:underline font-medium block text-center pt-1"
                                  >
                                    {lang === 'ar'
                                      ? `+ استعرض كافة العطور (${productsList.length}) المشمولة بالعرض`
                                      : `+ View all ${productsList.length} fragrances in this offer`}
                                  </Link>
                                )}
                              </div>
                            ) : (
                              <Link
                                to="/shop"
                                className="w-full inline-flex items-center justify-center space-x-1.5 rtl:space-x-reverse bg-[#174F43] text-white py-2 text-xs uppercase tracking-widest font-medium rounded-sm hover:bg-[#0F3830] transition-colors"
                              >
                                <span>{lang === 'ar' ? 'تسوق عطور العرض' : 'SHOP QUALIFYING PERFUMES'}</span>
                                {isRTL ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                              </Link>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. General Privilege Codes */}
            {generalOffers.length > 0 && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold block">
                    {lang === 'ar' ? 'أكواد ومزايا الدار' : 'ATELIER PRIVILEGE CODES'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif text-[#174F43] uppercase tracking-wide">
                    {lang === 'ar' ? 'أكواد الخصم والمكافآت' : 'Exclusive Codes & Rewards'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generalOffers.map((gen) => (
                    <div key={gen._id} className="p-6 bg-slate-50/70 border border-slate-200 rounded-sm flex flex-col justify-between space-y-4">
                      <div>
                        {gen.badge && (
                          <span className="text-[10px] uppercase font-bold tracking-widest bg-[#174F43] text-white px-2 py-0.5 rounded-sm inline-block mb-2">
                            {gen.badge}
                          </span>
                        )}
                        <h3 className="text-base font-serif uppercase tracking-tight text-[#174F43]">{gen.title}</h3>
                        {gen.subtitle && <p className="text-xs text-slate-600 mt-1">{gen.subtitle}</p>}
                        {gen.description && <p className="text-xs text-slate-500 font-light mt-2 leading-relaxed">{gen.description}</p>}
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                        <span className="text-xs font-semibold text-[#174F43]">
                          {gen.discountType === 'percentage' 
                            ? `${gen.discountValue}% ${lang === 'ar' ? 'خصم' : 'Off'}` 
                            : `${formatPrice(gen.discountValue)} ${lang === 'ar' ? 'خصم' : 'Off'}`}
                        </span>
                        <Link
                          to="/shop"
                          className="inline-flex items-center space-x-1 rtl:space-x-reverse text-xs uppercase tracking-wider font-semibold text-[#174F43] hover:underline"
                        >
                          <span>{lang === 'ar' ? 'تطبيق عند الدفع' : 'Apply at checkout'}</span>
                          {isRTL ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Guarantees Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-slate-200 text-center">
          <div className="p-4 space-y-1.5">
            <ShieldCheck size={20} className="mx-auto text-[#174F43]" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#174F43]">
              {lang === 'ar' ? 'عطور نيش أصلية 100%' : '100% Authentic Haute Parfumerie'}
            </h4>
            <p className="text-[11px] text-slate-500 font-light">
              {lang === 'ar' ? 'مصاغة في القاهرة من أنقى الخلاصات العطرية الفرنسية.' : 'Crafted in Cairo with genuine French perfume essences.'}
            </p>
          </div>
          <div className="p-4 space-y-1.5">
            <Package size={20} className="mx-auto text-[#174F43]" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#174F43]">
              {lang === 'ar' ? 'تغليف هدايا فاخر' : 'Luxury Gift Presentation'}
            </h4>
            <p className="text-[11px] text-slate-500 font-light">
              {lang === 'ar' ? 'يصلك كل طلب وكل باقة بتغليف دار M20 الفاخر المخصص للإهداء.' : 'Every order and bundle arrives in bespoke M20 packaging.'}
            </p>
          </div>
          <div className="p-4 space-y-1.5">
            <Clock size={20} className="mx-auto text-[#174F43]" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#174F43]">
              {lang === 'ar' ? 'شحن سريع للباب واستلام مترو' : 'Express Doorstep Delivery'}
            </h4>
            <p className="text-[11px] text-slate-500 font-light">
              {lang === 'ar' ? 'شحن سريع لكافة محافظات مصر مع خيار استلام المترو الاقتصادي بالقاهرة والجيزة.' : 'Fast Cairo & nationwide shipping with metro station pickup options.'}
            </p>
          </div>
        </div>

      </section>
    </div>
  );
}
