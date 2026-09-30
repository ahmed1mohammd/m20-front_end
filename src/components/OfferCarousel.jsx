import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const OFFER_SLIDES = [
  { id: 1, image: '/img/offers.png', alt: 'ÉLAN Special Offers', link: '/offers' },
  { id: 2, image: '/img/hero.png', alt: 'ÉLAN New Arrivals', link: '/offers' },
  { id: 3, image: '/img/About.png', alt: 'ÉLAN Collection', link: '/offers' },
];

const OfferCarousel = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const total = OFFER_SLIDES.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const handleSlideClick = (link) => {
    navigate(link);
  };

  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* Slides Container */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[21/8] md:aspect-[21/7] overflow-hidden">
        {OFFER_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            onClick={() => handleSlideClick(slide.link)}
            className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-700 ease-in-out ${
              idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/product.png';
              }}
            />
          </div>
        ))}
      </div>

      {/* Minimal Arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white text-[#03204E] transition-colors"
        aria-label="Previous offer"
      >
        <ChevronLeft size={18} strokeWidth={1.5} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white text-[#03204E] transition-colors"
        aria-label="Next offer"
      >
        <ChevronRight size={18} strokeWidth={1.5} />
      </button>

      {/* Minimal Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
        {OFFER_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
            className={`transition-all duration-300 rounded-full ${
              idx === current
                ? 'w-6 h-1.5 bg-[#03204E]'
                : 'w-1.5 h-1.5 bg-[#03204E]/30 hover:bg-[#03204E]/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default OfferCarousel;
