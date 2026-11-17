import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft, Check, Tag, Package, Clock, ShieldCheck, Gift } from 'lucide-react';
import SEO from '../components/SEO';
import Reveal from '../components/Reveal';
import { getActiveOffers } from '../services/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const MIXED_FONT = { fontFamily: "'Montserrat', 'Cairo', system-ui, sans-serif" };

const getImageUrl = (img, fallback = '/img/product.png') => {
  if (!img) return fallback;
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && img.url) return img.url;
  return fallback;
};

const bundleStats = (bundle) => {
  const items = (bundle.bundleItems || []).filter((item) => Boolean(item && item.product));
  const original = items.reduce((sum, item) => {
    const v = item.product?.variants?.find((x) => x.size === item.size) || item.product?.variants?.[0];
    return sum + (v?.price || 350) * (item.quantity || 1);
  }, 0);
  const price = Number(bundle.bundlePrice) || 0;
  const savings = price > 0 && original > price ? original - price : 0;
  return { items, original, price, savings, percent: savings > 0 ? Math.round((savings / original) * 100) : 0 };
};

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedItemKey, setAddedItemKey] = useState(null);
  const { addToCart, setIsCartOpen } = useCart();
  const { lang, isRTL, formatPrice, translateProduct } = useLanguage();
  const isAr = lang === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

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

  const handleAddBundleToCart = (offer) => {
    const { items: rawItems, price: bundleTotal } = bundleStats(offer);
    if (rawItems.length === 0) return;

    const itemCount = rawItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const pricePerUnit = itemCount > 0 && bundleTotal > 0 ? Math.round(bundleTotal / itemCount) : 0;

    rawItems.forEach((item) => {
      const prod = item.product;
      const variant = (prod.variants || []).find((v) => v.size === item.size) || prod.variants?.[0] || {
        size: item.size || '50ml',
        price: pricePerUnit || 350,
        SKU: `${prod.slug || 'M20'}-${item.size || '50ml'}`,
      };
      addToCart(prod, { ...variant, price: pricePerUnit > 0 ? pricePerUnit : variant.price, compareAtPrice: variant.price }, item.quantity || 1);
    });

    setAddedItemKey(offer._id);
    setTimeout(() => setAddedItemKey(null), 2000);
    setIsCartOpen(true);
  };

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

    addToCart(product, { ...variant, price: discountedPrice, compareAtPrice: variant.price }, 1);
    setAddedItemKey(`${offer._id}-${product._id}`);
    setTimeout(() => setAddedItemKey(null), 2000);
    setIsCartOpen(true);
  };

  const bundles = offers.filter((o) => o.offerType === 'bundle');
  const productOffers = offers.filter((o) => o.offerType === 'product_specific');
  const generalOffers = offers.filter((o) => o.offerType === 'general');
  const ordered = [...bundles, ...productOffers, ...generalOffers];

  const maxPct = Math.max(
    0,
    ...[...productOffers, ...generalOffers]
      .filter((o) => o.discountType === 'percentage')
      .map((o) => Number(o.discountValue) || 0),
    ...bundles.map((b) => bundleStats(b).percent)
  );

  const TYPE_LABEL = {
    bundle: isAr ? 'باقة' : 'BUNDLE',
    product_specific: isAr ? 'عرض خاص' : 'PRIVATE OFFER',
    general: isAr ? 'ميزة الدار' : 'PRIVILEGE',
  };

  const renderOffer = (offer, index) => {
    const isBundle = offer.offerType === 'bundle';
    const isProduct = offer.offerType === 'product_specific';
    const stats = isBundle ? bundleStats(offer) : null;

    // The "strength" of the offer: one big number
    let big = null;
    let bigLabel = '';
    if (isBundle) {
      if (stats.percent > 0) {
        big = `${stats.percent}%`;
        bigLabel = isAr ? 'خصم على الباقة' : 'OFF THE BUNDLE';
      } else if (stats.price > 0) {
        big = formatPrice(stats.price);
        bigLabel = isAr ? 'سعر الباقة' : 'BUNDLE PRICE';
      }
    } else if (offer.discountValue > 0) {
      big = offer.discountType === 'percentage' ? `${offer.discountValue}%` : formatPrice(offer.discountValue);
      bigLabel = isAr ? 'خصم' : 'OFF';
    }

    const sizes = offer.applicableSizes && offer.applicableSizes.length > 0 ? offer.applicableSizes : ['50ml', '100ml'];
    const productsList = (offer.applicableProducts || []).filter((p) => Boolean(p && (p._id || p.name)));
    const bannerImg = getImageUrl(offer.bannerImage, '/img/offers.png');

    return (
      <Reveal key={offer._id || index} direction="up" delay={index * 90}>
        <article dir="ltr" className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-200 overflow-hidden hover:shadow-[0_18px_50px_rgba(15,56,48,0.10)] transition-shadow duration-300">
          {/* Banners are designed with the subject on the right and empty space on the left:
              keep the subject right and let the text use the empty side. */}
          <div className="relative lg:col-span-6 order-1 lg:order-2 aspect-[16/10] lg:aspect-auto lg:min-h-[460px] bg-white overflow-hidden">
            <img
              src={bannerImg}
              alt={offer.title}
              className="absolute inset-0 w-full h-full object-cover object-right m20-kenburns-slow"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/offers.png';
              }}
            />
            {/* Melt the image's white edge into the card */}
            <div aria-hidden="true" className="hidden lg:block pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white to-transparent" />
            <div aria-hidden="true" className="lg:hidden pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white to-transparent" />
            <span className="absolute top-4 right-4 bg-[#174F43] text-white text-xs font-semibold tracking-[0.2em] uppercase px-3 py-1.5">
              {offer.badge || TYPE_LABEL[offer.offerType]}
            </span>
          </div>

          <div dir={isRTL ? 'rtl' : 'ltr'} className={`lg:col-span-6 order-2 lg:order-1 p-7 sm:p-10 lg:p-12 flex flex-col justify-center gap-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center gap-3">
              <span className="h-[1.5px] w-8 bg-[#FF9D00]" />
              <span className="text-xs uppercase tracking-[0.28em] text-[#FF9D00] font-semibold">{TYPE_LABEL[offer.offerType]}</span>
            </div>

            <div className="space-y-2.5">
              <h3 dir="auto" style={MIXED_FONT} className="text-2xl sm:text-3xl font-semibold text-[#174F43] leading-snug">
                {offer.title}
              </h3>
              {offer.subtitle && (
                <p dir="auto" style={MIXED_FONT} className="text-base text-slate-700 font-medium">{offer.subtitle}</p>
              )}
              {offer.description && (
                <p dir="auto" style={MIXED_FONT} className="text-sm text-slate-500 font-light leading-relaxed max-w-xl">{offer.description}</p>
              )}
            </div>

            {/* The strength of the offer */}
            {big && (
              <div className="flex items-end gap-4 border-y border-slate-200 py-5">
                <span className="font-serif text-5xl sm:text-6xl leading-none text-[#FF9D00]" dir="ltr">{big}</span>
                <span className="pb-1.5 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#174F43]">{bigLabel}</span>
                {isBundle && stats.savings > 0 && (
                  <span className="ms-auto text-sm text-slate-500 text-end">
                    <span className="block text-xs uppercase tracking-widest text-emerald-700 font-semibold">
                      {isAr ? `وفّرت ${formatPrice(stats.savings)}` : `You save ${formatPrice(stats.savings)}`}
                    </span>
                    <span className="line-through">{formatPrice(stats.original)}</span>
                    <span className="mx-1.5 font-semibold text-[#174F43] no-underline">{formatPrice(stats.price)}</span>
                  </span>
                )}
              </div>
            )}

            {/* Bundle contents */}
            {isBundle && stats.items.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {stats.items.map((item, idx) => {
                  const prod = translateProduct ? translateProduct(item.product) : item.product;
                  return (
                    <span key={idx} className="inline-flex items-center gap-2 bg-[#F4F3EF] border border-slate-200 pe-3 text-xs text-[#174F43] uppercase">
                      <img
                        src={getImageUrl(prod?.images?.[0])}
                        alt=""
                        className="w-9 h-9 object-contain bg-white"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/img/product.png'; }}
                      />
                      {prod?.name} · {item.size} · {item.quantity}x
                    </span>
                  );
                })}
              </div>
            )}

            {isProduct && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="uppercase tracking-widest">{isAr ? 'متاح للأحجام' : 'Valid for'}</span>
                {sizes.map((s) => (
                  <span key={s} className="font-mono bg-slate-100 text-slate-700 px-2 py-1">{s}</span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {isBundle && stats.items.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleAddBundleToCart(offer)}
                  className="inline-flex items-center gap-2 bg-[#174F43] hover:bg-[#0F3830] text-white px-7 h-12 text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
                >
                  {addedItemKey === offer._id ? <Check size={15} className="text-emerald-300" /> : <ShoppingBag size={15} />}
                  {addedItemKey === offer._id ? (isAr ? 'تمت الإضافة' : 'Added to bag') : (isAr ? 'أضف الباقة' : 'Add bundle')}
                </button>
              )}

              {isProduct && productsList.slice(0, 2).map((rawProduct) => {
                const product = translateProduct ? translateProduct(rawProduct) : rawProduct;
                const key = `${offer._id}-${product._id}`;
                const defaultSize = sizes[0] || '50ml';
                const v = product.variants?.find((x) => x.size === defaultSize) || product.variants?.[0];
                const original = v?.price || 350;
                const promo = offer.discountType === 'percentage'
                  ? Math.round(original * (1 - offer.discountValue / 100))
                  : Math.max(0, original - offer.discountValue);
                return (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => handleAddPromoProduct(product, offer, defaultSize)}
                    className="inline-flex items-center gap-3 bg-[#174F43] hover:bg-[#0F3830] text-white ps-5 pe-5 h-12 text-xs uppercase tracking-[0.15em] font-medium transition-colors cursor-pointer"
                  >
                    {addedItemKey === key ? <Check size={15} className="text-emerald-300" /> : <ShoppingBag size={15} />}
                    <span>{addedItemKey === key ? (isAr ? 'تمت الإضافة' : 'Added') : product.name}</span>
                    <span className="font-semibold text-[#FF9D00] normal-case">{formatPrice(promo)}</span>
                    <span className="line-through text-white/50 normal-case">{formatPrice(original)}</span>
                  </button>
                );
              })}

              {(!isBundle || stats.items.length === 0) && (isProduct ? productsList.length === 0 : true) && (
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-3 bg-[#174F43] hover:bg-[#0F3830] text-white px-7 h-12 text-xs uppercase tracking-[0.2em] font-medium transition-colors"
                >
                  {offer.offerType === 'general' ? (isAr ? 'تطبيق عند الدفع' : 'Apply at checkout') : (isAr ? 'تسوق عطور العرض' : 'Shop qualifying perfumes')}
                  <Arrow size={15} />
                </Link>
              )}
            </div>
          </div>
        </article>
      </Reveal>
    );
  };

  return (
    <div className="bg-[#F4F3EF] min-h-screen text-[#0B0B0B]">
      <SEO
        title={isAr ? 'العروض الخاصة وباقات الدار • دار M20 للعطور' : 'Exclusive Offers & Bespoke Privileges • M20 Fine Fragrances'}
        description={isAr ? 'استكشف باقات عطور نيش حصرية وخصومات خاصة وإصدارات محدودة من دار M20 بالقاهرة.' : 'Explore exclusive haute parfumerie bundles, promotional discounts, and limited-edition privilege offerings from M20 Cairo.'}
        keywords="عروض عطور M20, تخفيضات برفانات نيش مصر, M20 perfume bundle discount, luxury perfume offers Cairo"
      />

      {/* Hero */}
      <section className="relative bg-[#174F43] text-white py-14 sm:py-16 md:py-20 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 55% 90% at 50% 0%, rgba(255,157,0,0.20), transparent 65%)' }}
        />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.28em] font-semibold uppercase text-[#FF9D00]">
            <Tag size={14} />
            <span>{isAr ? 'مزايا الدار الحصرية' : 'ATELIER PRIVILEGES'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif uppercase text-white leading-tight">
            {isAr ? 'العروض الحصرية والباقات' : 'EXCLUSIVE OFFERS & BUNDLES'}
          </h1>
          {!loading && maxPct > 0 && (
            <p className="text-white/85 text-lg sm:text-xl font-light">
              {isAr ? 'خصم يصل إلى ' : 'Up to '}
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#FF9D00] align-middle" dir="ltr">{maxPct}%</span>
              {isAr ? ' على عطور مختارة' : ' off selected fragrances'}
              <span className="mx-3 text-white/30">|</span>
              <span className="text-sm tracking-widest uppercase text-white/70">
                {offers.length} {isAr ? 'عرض متاح' : offers.length === 1 ? 'live offer' : 'live offers'}
              </span>
            </p>
          )}
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#174F43] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs tracking-widest text-slate-500 uppercase">{isAr ? 'جاري تحميل العروض...' : 'Loading privileges...'}</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-white border border-slate-200 p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4">
            <Gift size={32} className="text-[#174F43] mx-auto stroke-1" />
            <h2 className="text-xl font-serif text-[#174F43] uppercase">{isAr ? 'لا توجد عروض نشطة حالياً' : 'All current offers concluded'}</h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-light">
              {isAr
                ? 'باقاتنا الحصرية تُصاغ يدوياً بكميات محدودة في ورشتنا بالقاهرة. استكشف مجموعتنا العطرية الدائمة أو تابعنا للعروض القادمة.'
                : 'Our bespoke promotional sets are handcrafted in limited quantities. Explore our permanent collection or check back soon for the next private drop.'}
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#174F43] text-white px-7 h-12 text-xs uppercase tracking-widest font-medium hover:bg-[#0F3830] transition-colors"
            >
              <span>{isAr ? 'استكشف كافة العطور' : 'EXPLORE ALL FRAGRANCES'}</span>
              <Arrow size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">{ordered.map(renderOffer)}</div>
        )}

        {/* Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-slate-200 text-center">
          {[
            { Icon: ShieldCheck, t: isAr ? 'عطور نيش أصلية 100%' : '100% Authentic Haute Parfumerie', d: isAr ? 'مصاغة في القاهرة من أنقى الخلاصات العطرية الفرنسية.' : 'Crafted in Cairo with genuine French perfume essences.' },
            { Icon: Package, t: isAr ? 'تغليف هدايا فاخر' : 'Luxury Gift Presentation', d: isAr ? 'يصلك كل طلب وكل باقة بتغليف دار M20 الفاخر المخصص للإهداء.' : 'Every order and bundle arrives in bespoke M20 packaging.' },
            { Icon: Clock, t: isAr ? 'شحن سريع للباب واستلام مترو' : 'Express Doorstep Delivery', d: isAr ? 'شحن سريع لكافة محافظات مصر مع خيار استلام المترو الاقتصادي بالقاهرة والجيزة.' : 'Fast Cairo & nationwide shipping with metro station pickup options.' },
          ].map(({ Icon, t: title, d }) => (
            <div key={title} className="p-4 space-y-2">
              <Icon size={22} className="mx-auto text-[#174F43]" />
              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#174F43]">{title}</h4>
              <p className="text-[13px] text-slate-500 font-light leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
