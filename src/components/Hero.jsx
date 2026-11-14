import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="bg-[#F4F3EF] py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* Text column */}
        <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <span className="text-xs uppercase tracking-widest text-slate-500 font-medium block">
            {t('hero.tag', 'HAUTE PARFUMERIE • CAIRO')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#174F43] tracking-tight leading-[1.1] uppercase font-normal">
            {t('common.leaveYourMark', 'Leave your mark.')}
          </h1>
          <p className="text-sm font-light text-slate-600 leading-relaxed max-w-md">
            {t('hero.desc', 'Distinctive Egyptian fragrances formulated with pure essence oils for unmatched longevity and sillage.')}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/men"
              className="bg-[#174F43] text-white px-6 py-3 text-xs tracking-widest font-medium uppercase hover:bg-[#0F3830] transition-colors duration-150 h-10 inline-flex items-center justify-center rounded-sm"
            >
              {t('hero.shopMen', 'Shop For Him')}
            </Link>
            <Link
              to="/women"
              className="border border-[#174F43] text-[#174F43] px-6 py-3 text-xs tracking-widest font-medium uppercase hover:bg-[#174F43] hover:text-white transition-colors duration-150 h-10 inline-flex items-center justify-center rounded-sm"
            >
              {t('hero.shopWomen', 'Shop For Her')}
            </Link>
          </div>
        </div>

        {/* Product photo */}
        <div className="flex justify-center items-center">
          <img
            src="/img/hero.png"
            alt="M20 Fine Fragrances Bottle"
            className="w-full max-w-[480px] h-auto object-contain mix-blend-multiply"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/product.png';
            }}
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;
