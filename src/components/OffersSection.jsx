import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { getActiveOffers } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';

const LEGACY_OFFER_PATHS = ['/img/offers.png', '/img/hero.png', '/img/About.png', '/img/Story.png'];

/**
 * High-fashion editorial Offers showcase: clean asymmetric split gallery with slow Ken Burns photography and interactive numbered list.
 */
const OffersSection = ({ offers: propOffers }) => {
  const { lang, t, isRTL } = useLanguage();
  const [offersList, setOffersList] = useState(propOffers || []);
  const [hoveredIdx, setHoveredIdx] = useState(0);

  useEffect(() => {
    if (propOffers && propOffers.length > 0) {
      setOffersList(propOffers);
      return;
    }
    const fetchOffers = async () => {
      try {
        const data = await getActiveOffers();
        if (Array.isArray(data) && data.length > 0) {
          setOffersList(data);
        }
      } catch (err) {
        console.error('Failed to load offers for OffersSection:', err);
      }
    };
    fetchOffers();
  }, [propOffers]);

  const featuredOffers = offersList.slice(0, 3);
  const activeOffer = featuredOffers[hoveredIdx] || featuredOffers[0] || null;
  const visualUrl =
    activeOffer?.bannerImage?.url && !LEGACY_OFFER_PATHS.includes(activeOffer.bannerImage.url)
      ? activeOffer.bannerImage.url
      : '/img/m20-crush-bottle.jpg';

  return (
    <section className="bg-[#F4F3EF] py-12 md:py-16 border-t border-slate-200/80">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal direction="up">
          <div className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-200/80 overflow-hidden shadow-xs min-h-[440px]">
            {/* Visual Gallery Column (Slow Ken Burns Edge-to-Edge Photography) */}
            <div className="lg:col-span-6 relative overflow-hidden bg-[#ECE9E2] min-h-[320px] lg:min-h-[460px] group/img">
              <img
                src={visualUrl}
                alt={activeOffer?.title || 'M20 Signature Privileges'}
                className="absolute inset-0 w-full h-full object-cover object-center m20-kenburns-slow transition-opacity duration-700"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/m20-crush-bottle.jpg';
                }}
              />
              {/* Soft editorial vignette */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F3830]/55 via-transparent to-black/10" />

              {/* Subtle floating corner caption */}
              <div className="absolute bottom-5 inset-x-5 flex items-center justify-between text-white">
                <span className="text-[10px] uppercase tracking-[0.28em] font-medium bg-[#0F3830]/80 backdrop-blur-xs px-3.5 py-1.5 border border-white/15">
                  {lang === 'ar' ? 'اختيارات الدار' : 'SEASONAL ARCHIVE'}
                </span>
                <span className="h-[1px] flex-1 mx-4 bg-white/30" />
                <span className="text-[11px] font-medium tracking-[0.2em] text-[#FF9D00]">
                  M20
                </span>
              </div>
            </div>

            {/* Editorial Typography & Interactive Offer Index Column */}
            <div
              className={`lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-white ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              <div className="space-y-6">
                {/* Eyebrow with expanding hairline */}
                <div className="flex items-center gap-3">
                  <span className="h-[1.5px] w-8 bg-[#FF9D00]" />
                  <span className="text-[11px] uppercase tracking-[0.28em] text-[#FF9D00] font-semibold">
                    {lang === 'ar' ? 'العروض الخاصة والباقات' : 'PRIVATE PRIVILEGES'}
                  </span>
                </div>

                {/* Main Heading */}
                <div className="space-y-2.5">
                  <h2 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-serif text-[#174F43] tracking-tight leading-snug">
                    {lang === 'ar'
                      ? 'باقات الدار الحصرية وعروض الموسم.'
                      : 'Curated Pairings & Seasonal Editions.'}
                  </h2>
                  {/* Animated Wavy Lines (Intro Paragraph Removed) */}
                  <div className="py-1.5 overflow-hidden m20-marquee-wrapper relative w-full max-w-md" aria-hidden="true">
                    <svg className="w-[200%] h-3.5 m20-wave-slow text-[#FF9D00]/70" viewBox="0 0 1200 24" fill="none">
                      <path d="M0 12 Q 75 0, 150 12 T 300 12 T 450 12 T 600 12 T 750 12 T 900 12 T 1050 12 T 1200 12" stroke="currentColor" strokeWidth="1.75" fill="none" />
                      <path d="M1200 12 Q 1275 0, 1350 12 T 1500 12 T 1650 12 T 1800 12 T 1950 12 T 2100 12 T 2250 12 T 2400 12" stroke="currentColor" strokeWidth="1.75" fill="none" />
                    </svg>
                  </div>
                </div>

                {/* Minimal Numbered Editorial Offer Index */}
                {featuredOffers.length > 0 && (
                  <div className="divide-y divide-slate-200/80 border-y border-slate-200/80 my-2">
                    {featuredOffers.map((offer, idx) => {
                      const isHighlighted = hoveredIdx === idx;
                      return (
                        <Reveal key={offer._id || idx} delay={100 + idx * 90} direction="up" distance={10}>
                          <Link
                            to="/offers"
                            onMouseEnter={() => setHoveredIdx(idx)}
                            onFocus={() => setHoveredIdx(idx)}
                            className="group/row flex items-center justify-between gap-4 py-3.5 transition-colors"
                          >
                            <div className="flex items-baseline gap-4 min-w-0">
                              <span
                                className={`text-[11px] font-mono tracking-widest transition-colors duration-300 ${
                                  isHighlighted ? 'text-[#FF9D00] font-semibold' : 'text-slate-400'
                                }`}
                              >
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <div className="min-w-0">
                                <h3
                                  className={`text-sm font-medium truncate transition-transform duration-300 ${
                                    isHighlighted
                                      ? isRTL
                                        ? 'text-[#174F43] -translate-x-1'
                                        : 'text-[#174F43] translate-x-1'
                                      : 'text-slate-700'
                                  }`}
                                >
                                  {offer.title}
                                </h3>
                                {offer.subtitle && (
                                  <p className="text-[11px] text-slate-400 font-light truncate mt-0.5">
                                    {offer.subtitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {offer.bundlePrice ? (
                                <span className="text-xs font-semibold text-[#174F43]">
                                  {offer.bundlePrice} EGP
                                </span>
                              ) : offer.badge ? (
                                <span className="text-[10px] uppercase tracking-[0.18em] text-[#FF9D00] font-semibold">
                                  {offer.badge}
                                </span>
                              ) : null}
                              {isRTL ? (
                                <ArrowLeft
                                  size={14}
                                  className={`transition-all duration-300 ${
                                    isHighlighted ? 'text-[#174F43] -translate-x-1' : 'text-slate-300'
                                  }`}
                                />
                              ) : (
                                <ArrowRight
                                  size={14}
                                  className={`transition-all duration-300 ${
                                    isHighlighted ? 'text-[#174F43] translate-x-1' : 'text-slate-300'
                                  }`}
                                />
                              )}
                            </div>
                          </Link>
                        </Reveal>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Clean Architectural CTA */}
              <div className="pt-6">
                <Link
                  to="/offers"
                  className="group/cta relative inline-flex items-center gap-3 bg-[#174F43] hover:bg-[#0F3830] text-white px-8 py-4 text-xs tracking-[0.22em] font-medium uppercase transition-all duration-300"
                >
                  <span>{t('offersSection.viewAllOffers', 'Explore All Offers')}</span>
                  {isRTL ? (
                    <ArrowLeft size={14} className="transition-transform duration-300 group-hover/cta:-translate-x-1.5" />
                  ) : (
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover/cta:translate-x-1.5" />
                  )}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default OffersSection;
