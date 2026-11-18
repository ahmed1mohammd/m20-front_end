import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getProductPriceSummary } from '../utils/productPricing';

const DURATION = 900; // ms, keep in sync with CSS below

const css = `
.ps3d-stage { perspective: 1400px; }
.ps3d-tilt { transform-style: preserve-3d; transition: transform .25s ease-out; }
.ps3d-layer { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; transform-style: preserve-3d; will-change: transform, opacity; }
.ps3d-enter { animation: ps3d-in ${DURATION}ms cubic-bezier(.22,1,.36,1) both; }
.ps3d-exit  { animation: ps3d-out ${DURATION}ms cubic-bezier(.55,0,.8,.4) both; }
.ps3d-enter.rev { animation-name: ps3d-in-rev; }
.ps3d-exit.rev  { animation-name: ps3d-out-rev; }
@keyframes ps3d-in {
  0%   { transform: translateY(-70%) translateZ(-300px) rotateY(-200deg) rotateX(14deg) scale(.7); opacity:0; }
  60%  { opacity:1; }
  100% { transform: translateY(0) translateZ(0) rotateY(0) rotateX(0) scale(1); opacity:1; }
}
@keyframes ps3d-out {
  0%   { transform: translateY(0) translateZ(0) rotateY(0) scale(1); opacity:1; }
  100% { transform: translateY(75%) translateZ(-300px) rotateY(200deg) rotateX(-14deg) scale(.7); opacity:0; }
}
@keyframes ps3d-in-rev {
  0%   { transform: translateY(-70%) translateZ(-300px) rotateY(200deg) rotateX(14deg) scale(.7); opacity:0; }
  60%  { opacity:1; }
  100% { transform: translateY(0) translateZ(0) rotateY(0) rotateX(0) scale(1); opacity:1; }
}
@keyframes ps3d-out-rev {
  0%   { transform: translateY(0) translateZ(0) rotateY(0) scale(1); opacity:1; }
  100% { transform: translateY(75%) translateZ(-300px) rotateY(-200deg) rotateX(-14deg) scale(.7); opacity:0; }
}
.ps3d-info { animation: ps3d-info ${DURATION}ms cubic-bezier(.22,1,.36,1) both; }
@keyframes ps3d-info {
  0%   { opacity:0; transform: translate3d(var(--ps3d-x,40px), 24px, -80px) rotateY(var(--ps3d-r,-18deg)); }
  100% { opacity:1; transform: translate3d(0,0,0) rotateY(0); }
}
.ps3d-shadow { animation: ps3d-shadow ${DURATION}ms ease-out both; }
@keyframes ps3d-shadow { 0% { transform: scale(.4); opacity:.1; } 100% { transform: scale(1); opacity:.35; } }
.ps3d-ring { animation: ps3d-ring 4.5s ease-in-out infinite; }
@keyframes ps3d-ring { 0%,100% { transform: scale(1); opacity:.9; } 50% { transform: scale(1.06); opacity:.35; } }
.ps3d-dust { animation: ps3d-dust 6s ease-in-out infinite; }
@keyframes ps3d-dust { 0%,100% { margin-top: 0; } 50% { margin-top: -18px; } }
/* Photo backgrounds dissolve into the page so the bottle floats instead of sitting in a visible box */
.ps3d-feather {
  -webkit-mask-image: radial-gradient(ellipse 50% 52% at 50% 50%, #000 62%, transparent 100%);
  mask-image: radial-gradient(ellipse 50% 52% at 50% 50%, #000 62%, transparent 100%);
}
.ps3d-float { animation: ps3d-float 5s ease-in-out infinite; }
@keyframes ps3d-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@media (prefers-reduced-motion: reduce) {
  .ps3d-enter,.ps3d-exit,.ps3d-info,.ps3d-shadow,.ps3d-float,.ps3d-ring,.ps3d-dust { animation-duration: 1ms !important; animation-iteration-count: 1 !important; }
}
`;

// Deterministic particle field (no Math.random during render)
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 37 + 11) % 92 + 4,
  y: (i * 53 + 7) % 80 + 6,
  s: 3 + (i % 3) * 2,
  z: -120 + ((i * 41) % 260),
  o: 0.25 + (i % 4) * 0.15,
  d: (i % 7) * 0.6,
  t: 5 + (i % 5),
}));

const mainImage = (p) =>
  p.mainImage?.url ||
  p.images?.find((i) => i.role === 'main')?.url ||
  p.images?.[0]?.url ||
  p.imageUrl ||
  '/img/product.png';

const ProductShowcase3D = ({ products }) => {
  const { t, formatPrice, translateProduct, isRTL } = useLanguage();
  const { addToCart } = useCart();

  const list = (products || []).slice(0, 6).map((p) => translateProduct(p));
  const count = list.length;

  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(null); // { index } leaving product
  const [rev, setRev] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const lock = useRef(false);
  const timer = useRef(null);
  const tiltRef = useRef(null);

  const go = useCallback(
    (dir) => {
      if (lock.current || count < 2) return;
      lock.current = true;
      setPrev(index);
      setRev(dir < 0);
      setIndex((index + dir + count) % count);
      setAnimKey((k) => k + 1);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setPrev(null);
        lock.current = false;
      }, DURATION);
    },
    [index, count]
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(isRTL ? -1 : 1);
      if (e.key === 'ArrowLeft') go(isRTL ? 1 : -1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, isRTL]);

  // Mouse tilt
  const onMove = (e) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 14}deg)`;
  };
  const onLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = 'rotateY(0) rotateX(0)';
  };

  // Swipe
  const touchX = useRef(null);
  const onTouchStart = (e) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const product = list[index];
  if (!product) return null;

  const productId = product._id || product.id || product.slug;
  const { defaultVariant, minPrice, maxPrice, isRange } = getProductPriceSummary(product);
  const notes = product.fragranceNotes || product.notes || {};
  const noteRows = [
    ['top', t('product.topNotes', 'Top'), notes.top],
    ['heart', t('product.heartNotes', 'Heart'), notes.heart],
    ['base', t('product.baseNotes', 'Base'), notes.base],
  ].filter(([, , v]) => Array.isArray(v) && v.length);

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const arrowCls =
    'w-11 h-11 rounded-full border border-[#174F43] text-[#174F43] inline-flex items-center justify-center hover:bg-[#174F43] hover:text-white transition-colors cursor-pointer disabled:opacity-40';

  if (count === 0) return null;

  return (
    <section className="bg-[#F4F3EF] py-12 md:py-16 overflow-hidden" aria-roledescription="carousel">
      <style>{css}</style>
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Details */}
        <div
          key={`info-${animKey}`}
          className={`ps3d-info space-y-4 order-2 md:order-1 ${isRTL ? 'text-right' : 'text-left'}`}
          style={{ '--ps3d-x': isRTL ? '-40px' : '40px', '--ps3d-r': rev ? '18deg' : '-18deg', perspective: 900 }}
        >
          <span className="text-xs uppercase tracking-widest text-slate-500 font-medium block">
            {[product.fragranceFamily, product.gender].filter(Boolean).join(' • ') || 'M20'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#174F43] tracking-tight leading-[1.1] uppercase font-normal">
            {product.name}
          </h2>
          <p className="text-sm font-light text-slate-600 leading-relaxed max-w-md">
            {product.shortDescription || product.description}
          </p>

          {noteRows.length > 0 && (
            <dl className="space-y-1.5 text-sm max-w-md">
              {noteRows.map(([k, label, v]) => (
                <div key={k} className="flex gap-3">
                  <dt className="w-14 shrink-0 text-xs uppercase tracking-widest text-slate-400 pt-0.5">{label}</dt>
                  <dd className="text-[#174F43]">{v.join(' · ')}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="text-lg font-semibold text-[#174F43]">
            {isRange ? (
              <span>
                {minPrice.toLocaleString()} – {maxPrice.toLocaleString()} {t('common.currency', 'EGP')}
              </span>
            ) : (
              formatPrice(minPrice)
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              to={`/product/${productId}`}
              className="bg-[#174F43] text-white px-6 py-3 text-xs tracking-widest font-medium uppercase hover:bg-[#0F3830] transition-colors h-10 inline-flex items-center justify-center rounded-sm"
            >
              {t('showcase.discover', 'Discover')}
            </Link>
            <button
              onClick={() => addToCart(product, defaultVariant, 1)}
              className="border border-[#174F43] text-[#174F43] px-6 h-10 text-xs tracking-widest font-medium uppercase hover:bg-[#174F43] hover:text-white transition-colors inline-flex items-center gap-2 rounded-sm cursor-pointer"
            >
              <ShoppingBag size={14} strokeWidth={1.8} />
              {t('productCard.addToCart', 'Add to Bag')}
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 pt-4" dir="ltr">
            <button className={arrowCls} onClick={() => go(isRTL ? 1 : -1)} aria-label="Previous product" disabled={count < 2}>
              <PrevIcon size={18} />
            </button>
            <button className={arrowCls} onClick={() => go(isRTL ? -1 : 1)} aria-label="Next product" disabled={count < 2}>
              <NextIcon size={18} />
            </button>
            <div className="flex items-center gap-2 ms-2">
              {list.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-[#174F43]' : 'w-1.5 bg-slate-300'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 3D stage */}
        <div
          className="ps3d-stage relative order-1 md:order-2 aspect-square w-full max-w-[520px] mx-auto select-none"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Big ghost name */}
          <div
            key={`ghost-${animKey}`}
            className="ps3d-info absolute inset-0 flex items-center justify-center font-serif uppercase text-[#174F43]/[0.09] text-[17vw] md:text-[6.5rem] leading-none pointer-events-none whitespace-nowrap"
            aria-hidden="true"
          >
            {product.name.split(' ').slice(-1)[0]}
          </div>

          {/* Spotlight behind the bottle */}
          <div
            aria-hidden="true"
            className="absolute inset-[8%] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,157,0,0.16) 0%, rgba(23,79,67,0.10) 45%, transparent 70%)' }}
          />

          <div ref={tiltRef} className="ps3d-tilt absolute inset-0">
            {/* Pedestal rings (lie flat on the floor in 3D) */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 bottom-[4%] w-[80%] aspect-square pointer-events-none"
              style={{ transform: 'translateX(-50%) rotateX(76deg)', transformStyle: 'preserve-3d' }}
            >
              <span className="ps3d-ring absolute inset-0 rounded-full border border-[#174F43]/35" />
              <span className="ps3d-ring absolute inset-[12%] rounded-full border border-[#FF9D00]/70" style={{ animationDelay: '.4s' }} />
              <span className="absolute inset-[26%] rounded-full bg-gradient-to-b from-[#174F43]/20 to-transparent border border-[#174F43]/25" />
            </div>

            {/* Gold dust at different depths */}
            {PARTICLES.map((p, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="ps3d-dust absolute rounded-full bg-[#FF9D00] pointer-events-none"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.s,
                  height: p.s,
                  opacity: p.o,
                  transform: `translateZ(${p.z}px)`,
                  animationDelay: `${p.d}s`,
                  animationDuration: `${p.t}s`,
                }}
              />
            ))}

            {/* Ground shadow */}
            <div
              key={`sh-${animKey}`}
              className="ps3d-shadow absolute left-1/2 bottom-[6%] w-[46%] h-5 -translate-x-1/2 rounded-[50%] bg-black blur-xl"
              aria-hidden="true"
            />

            {prev !== null && list[prev] && (
              <div key={`out-${animKey}`} className={`ps3d-layer ps3d-exit ${rev ? 'rev' : ''}`} aria-hidden="true">
                <img
                  src={mainImage(list[prev])}
                  alt=""
                  draggable="false"
                  className="w-[92%] h-[92%] object-contain mix-blend-multiply ps3d-feather"
                />
              </div>
            )}

            <div key={`in-${animKey}`} className={`ps3d-layer ${animKey ? `ps3d-enter ${rev ? 'rev' : ''}` : ''}`}>
              <div className="ps3d-float w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                <img
                  src={mainImage(product)}
                  alt={product.name}
                  draggable="false"
                  className="w-[92%] h-[92%] object-contain mix-blend-multiply ps3d-feather"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/img/product.png';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase3D;
