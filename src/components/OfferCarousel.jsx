import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getActiveOffers, getPublicSettings } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_SLIDES = [
  { id: 'def-1', image: '/img/offers.png', alt: 'M20 Special Offers', link: '/offers' },
  { id: 'def-2', image: '/img/hero.png', alt: 'M20 New Arrivals', link: '/shop' },
];

const OfferCarousel = () => {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  useEffect(() => {
    let isMounted = true;

    const fetchSlides = async () => {
      try {
        const settings = await getPublicSettings();
        if (!isMounted) return;

        const cmsSlides = Array.isArray(settings?.heroSlides)
          ? settings.heroSlides
              .filter((s) => s && s.active !== false && s.image && !String(s.image).startsWith('blob:'))
              .map((s, idx) => ({
                id: s._id || s.id || `cms-${idx}`,
                image: s.image,
                alt: s.alt || 'M20 Collection',
                link: s.link || '/shop',
              }))
          : [];

        if (cmsSlides.length > 0) {
          setSlides(cmsSlides);
          setCurrent(0);
          return;
        }

        const offers = await getActiveOffers();
        if (!isMounted) return;

        const seenUrls = new Set();
        const offerSlides = Array.isArray(offers)
          ? offers
              .filter((o) => {
                const url = o?.bannerImage?.url;
                if (!url || seenUrls.has(url)) return false;
                seenUrls.add(url);
                return true;
              })
              .map((o) => ({
                id: o._id,
                image: o.bannerImage.url,
                alt: o.title || 'M20 Offer',
                link: '/offers',
              }))
          : [];

        if (offerSlides.length > 0) {
          setSlides(offerSlides);
          setCurrent(0);
        }
      } catch (err) {
        console.error('Failed to load slides for carousel:', err);
      }
    };

    fetchSlides();
    return () => {
      isMounted = false;
    };
  }, []);

  const total = slides.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1) return undefined;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, total]);

  const handleSlideClick = (link) => {
    navigate(link || '/shop');
  };

  return (
    <section className="relative w-full bg-white overflow-hidden border-b border-slate-200/80">
      <div className="relative w-full overflow-hidden">
        {slides.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={slide.id || idx}
              onClick={() => handleSlideClick(slide.link)}
              className={`w-full cursor-pointer transition-opacity duration-200 ease-out ${
                isActive
                  ? 'relative opacity-100 z-10'
                  : 'absolute inset-0 h-full opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className={isActive ? 'w-full h-auto block m20-slide-settle' : 'w-full h-full object-contain object-center block'}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/offers.png';
                }}
              />
            </div>
          );
        })}

        {/* Carousel Controls */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); isRTL ? next() : prev(); }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-[#174F43] hover:bg-slate-100 transition-colors duration-150 rounded-sm cursor-pointer shadow-xs"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); isRTL ? prev() : next(); }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-[#174F43] hover:bg-slate-100 transition-colors duration-150 rounded-sm cursor-pointer shadow-xs"
              aria-label="Next slide"
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
                  className={`transition-colors duration-150 rounded-sm h-1.5 cursor-pointer ${
                    idx === current
                      ? 'w-5 bg-[#174F43]'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default OfferCarousel;
