import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* Left Text Column */}
        <div className="space-y-5 text-left pr-0 md:pr-4">
          <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-medium block">
            Signature Haute Parfumerie
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#03204E] tracking-tight leading-[1.08] uppercase font-normal">
            LEAVE YOUR MARK.
          </h1>
          <p className="text-xs sm:text-sm font-light text-slate-500 leading-relaxed max-w-md">
            Meticulously formulated fragrances created for those who command distinction. Crafted with 20% concentration for long-lasting intensity.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Link
              to="/men"
              className="bg-[#03204E] text-white px-8 py-3.5 text-xs tracking-[0.2em] font-medium uppercase hover:bg-slate-800 transition-colors"
            >
              SHOP MEN
            </Link>
            <Link
              to="/women"
              className="border border-[#03204E] text-[#03204E] px-8 py-3.5 text-xs tracking-[0.2em] font-medium uppercase hover:bg-[#03204E] hover:text-white transition-colors"
            >
              SHOP WOMEN
            </Link>
          </div>
        </div>

        {/* Right Large Product Photo */}
        <div className="flex justify-center items-center">
          <img
            src="/img/hero.png"
            alt="ÉLAN Fine Fragrances"
            className="w-full max-w-[540px] h-auto object-contain"
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
