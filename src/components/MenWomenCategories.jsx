import React from 'react';
import { Link } from 'react-router-dom';

const MenWomenCategories = () => {
  return (
    <section className="bg-white py-14 border-t border-slate-100">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* FOR HIM */}
          <div className="group relative bg-[#FAFAFA] overflow-hidden aspect-[4/3] flex flex-col justify-end p-8 text-left">
            <img
              src="/img/hero.png"
              alt="For Him Collection"
              className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/product.png';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent"></div>
            
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-medium block">
                The Masculine Signature
              </span>
              <h2 className="text-2xl font-serif text-[#03204E] uppercase">FOR HIM</h2>
              <Link
                to="/men"
                className="inline-block border-b border-[#03204E] text-[#03204E] text-xs uppercase tracking-widest font-semibold pb-0.5 hover:opacity-60 transition-opacity"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* FOR HER */}
          <div className="group relative bg-[#FAFAFA] overflow-hidden aspect-[4/3] flex flex-col justify-end p-8 text-left">
            <img
              src="/img/About.png"
              alt="For Her Collection"
              className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/product.png';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent"></div>
            
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-medium block">
                The Feminine Aura
              </span>
              <h2 className="text-2xl font-serif text-[#03204E] uppercase">FOR HER</h2>
              <Link
                to="/women"
                className="inline-block border-b border-[#03204E] text-[#03204E] text-xs uppercase tracking-widest font-semibold pb-0.5 hover:opacity-60 transition-opacity"
              >
                Shop Now
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default MenWomenCategories;
