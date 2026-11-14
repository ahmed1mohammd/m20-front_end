import React from 'react';
import ProductCard from './ProductCard';
import Reveal from './Reveal';
import { useLanguage } from '../context/LanguageContext';
import { FALLBACK_CATALOG } from '../data/fallbackCatalog';

const MostWanted = ({ products = [] }) => {
  const { t, translateProduct } = useLanguage();

  const sourceProducts = (products && products.length > 0) ? products.slice(0, 3) : FALLBACK_CATALOG.slice(0, 3);
  const displayProducts = sourceProducts.map((p) => translateProduct(p));

  return (
    <section className="bg-[#F4F3EF] py-12 md:py-16 border-t border-slate-200/80">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Header */}
        <Reveal direction="up">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-medium block">
              {t('mostWanted.tag', 'Curated selection')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#174F43] tracking-tight uppercase">
              {t('mostWanted.title', 'Most wanted')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
              {t('mostWanted.desc', 'Discover our most celebrated signature fragrances crafted for indelible presence.')}
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
