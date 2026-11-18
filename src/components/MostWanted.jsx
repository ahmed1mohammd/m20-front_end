import React from 'react';
import ProductCard from './ProductCard';
import Reveal from './Reveal';
import { useLanguage } from '../context/LanguageContext';

const MostWanted = ({ products = [] }) => {
  const { t, translateProduct } = useLanguage();

  const displayProducts = (products || []).slice(0, 3).map((p) => translateProduct(p));
  if (displayProducts.length === 0) return null;

  return (
    <section className="bg-[#F4F3EF] py-12 md:py-16 border-t border-slate-200/80">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Header */}
        <Reveal direction="up">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-medium block">
              {t('mostWanted.tag', 'Trending now')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#174F43] tracking-tight uppercase">
              {t('mostWanted.title', 'The viral picks')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
              {t('mostWanted.desc', 'The fragrances everyone is talking about: loved, shared and restocked again and again.')}
            </p>
          </div>
        </Reveal>

        {/* 3-Column Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {displayProducts.map((product, idx) => (
            <Reveal key={product._id || product.id || idx} delay={idx * 120} direction="up">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
};

export default MostWanted;
