import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';

/**
 * High-fashion Maison Manifesto section for M20 with drifting watermark, clean craft rows, and luminous emblem gallery.
 */
const AboutElan = () => {
  const { lang, t, isRTL } = useLanguage();

  const atelierDetails =
    lang === 'ar'
      ? [
          { label: 'المنشأ', value: 'صُمم في القاهرة، مصر' },
          { label: 'الفلسفة', value: 'فخامة هادئة وبصمة عطرية خالدة' },
        ]
      : [
          { label: 'ORIGIN', value: 'Crafted in Cairo, Egypt' },
          { label: 'ETHOS', value: 'Quiet luxury & enduring presence' },
        ];

  return (
    <section className="bg-[#F4F3EF] py-10 md:py-16 border-t border-slate-200/80">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal direction="up">
          <div className="relative overflow-hidden bg-[#174F43] text-white border border-[#0F3830] shadow-xs">
            {/* Subtle Monumental Drifting M20 Watermark */}
            <div
              aria-hidden="true"
              className="pointer-events-none select-none absolute -bottom-10 inset-x-0 flex justify-center overflow-hidden opacity-[0.045]"
            >
              <span className="font-serif text-[9rem] sm:text-[13rem] tracking-[0.25em] leading-none m20-drift-slow whitespace-nowrap">
                M20 MAISON
              </span>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left: Editorial Manifesto */}
              <div
                className={`lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between space-y-8 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="h-[1.5px] w-8 bg-[#FF9D00]" />
                    <span className="text-[11px] uppercase tracking-[0.28em] text-[#FF9D00] font-semibold">
                      {t('aboutSection.tag', 'THE ATELIER')}
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-serif text-white tracking-tight uppercase leading-tight">
                    {t('aboutSection.title', 'ABOUT M20')}
                  </h2>

                  <p className="text-sm sm:text-base text-[#F4F3EF]/85 font-light leading-relaxed max-w-lg">
                    {t('aboutSection.desc', 'Artisanal Cairo-crafted fragrances made to leave a lasting impression.')}
                  </p>
                </div>

                {/* Clean 2-Column Craft Metadata Rows */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-white/15 pt-6">
                  {atelierDetails.map((detail, idx) => (
                    <Reveal key={idx} delay={120 + idx * 100} direction="up" distance={12}>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-[0.26em] text-[#FF9D00] font-semibold block">
                          {detail.label}
                        </span>
                        <p className="text-sm font-light text-white/95">{detail.value}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>

                {/* Minimal Architectural CTA */}
                <div>
                  <Link
                    to="/about"
                    className={`group/btn relative overflow-hidden inline-flex items-center ${
                      isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'
                    } border border-[#FF9D00] text-[#FF9D00] hover:text-[#0F3830] px-8 py-3.5 text-xs tracking-[0.22em] font-semibold uppercase transition-colors duration-300`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 bg-[#FF9D00] transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 ease-out ${
                        isRTL ? 'origin-right' : 'origin-left'
                      }`}
                    />
                    <span className="relative z-10">{t('aboutSection.action', 'OUR STORY')}</span>
                    {isRTL ? (
                      <ArrowLeft size={14} className="relative z-10 transition-transform duration-300 group-hover/btn:-translate-x-1.5" />
                    ) : (
                      <ArrowRight size={14} className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                    )}
                  </Link>
                </div>
              </div>

              {/* Right: Warm Alabaster Recessed Monogram Gallery */}
              <div className="lg:col-span-5 bg-[#0F3830]/40 p-6 sm:p-8 lg:p-10 flex items-center justify-center">
                <Reveal direction="none" delay={140} className="w-full h-full flex items-center justify-center">
                  <div className="group/seal relative w-full h-full min-h-[260px] bg-[#F4F3EF] flex flex-col items-center justify-center p-10 overflow-hidden shadow-inner">
                    {/* Soft Diagonal Light Sheen */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent m20-shimmer-sweep"
                    />
                    {/* Fine Inset Architectural Border */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-4 border border-[#174F43]/15 transition-colors duration-500 group-hover/seal:border-[#FF9D00]/60"
                    />

                    <img
                      src="/img/m20-logo-emerald.png"
                      alt="M20 Fragrance Official Logo"
                      className="relative z-10 h-16 sm:h-20 lg:h-24 w-auto object-contain select-none m20-float-gentle"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/img/m20-logo.png';
                      }}
                    />

                    <span className="relative z-10 mt-6 text-[10px] uppercase tracking-[0.32em] text-[#174F43]/75 font-medium">
                      {lang === 'ar' ? 'دار العطور الراقية' : 'HAUTE PARFUMERIE'}
                    </span>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default AboutElan;
