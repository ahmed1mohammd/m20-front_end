import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Compass,
  Droplets,
  ShieldCheck,
  Clock,
  Wind,
  Layers,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

const AboutPage = () => {
  const { t, lang, isRTL } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const DirectionArrow = isRTL ? ArrowLeft : ArrowRight;

  const stats = [
    {
      value: t('about.stat1Val', 'Extrait'),
      label: t('about.stat1Label', 'Haute Parfumerie'),
    },
    {
      value: t('about.stat2Val', '10–14h'),
      label: t('about.stat2Label', 'Skin Longevity'),
    },
    {
      value: t('about.stat3Val', 'Cairo'),
      label: t('about.stat3Label', 'Egyptian Atelier'),
    },
  ];

  const chapters = [
    {
      title: t('about.chapter1Title', '01. Presence and Character'),
      body: t(
        'about.p1',
        'We founded M20 in Cairo as a modern Egyptian haute fragrance house for those who consider perfume an essential pillar of their personal aura.'
      ),
    },
    {
      title: t('about.chapter2Title', '02. Distinct Compositions'),
      body: t(
        'about.p2',
        'Every M20 fragrance possesses an uncompromising olfactive identity. Ranging from smoldering woods and dark ambers to crisp bergamot and velvety florals, each extrait is formulated with pure purpose.'
      ),
    },
    {
      title: t('about.chapter3Title', '03. Haute Extrait de Parfum'),
      body: t(
        'about.p3',
        'Crafted with pure aromatic oils, our perfumes are formulated to radiate with confidence and endure through Egyptian warmth and evening soirees alike.'
      ),
    },
    {
      title: t('about.chapter4Title', '04. Direct Atelier Craft'),
      body: t(
        'about.pillar3Desc',
        'Luxury niche perfumery accessible directly from our craft laboratory to your vanity.'
      ),
    },
  ];

  const pillars = [
    {
      icon: Compass,
      number: '01',
      title: t('about.pillar1Title', 'Egyptian Heritage'),
      desc: t(
        'about.pillar1Desc',
        'Honoring thousands of years of Nile perfumery heritage with modern formulation refinement.'
      ),
    },
    {
      icon: Droplets,
      number: '02',
      title: t('about.pillar2Title', 'Pure Extrait Craft'),
      desc: t(
        'about.pillar2Desc',
        'Dedicated to pure aromatic essences ensuring all-day sillage and rich projection.'
      ),
    },
    {
      icon: ShieldCheck,
      number: '03',
      title: t('about.pillar3Title', 'Direct Atelier Value'),
      desc: t(
        'about.pillar3Desc',
        'Luxury niche perfumery accessible directly from our craft laboratory to your vanity.'
      ),
    },
  ];

  const craftSpecs = [
    {
      icon: Layers,
      metric: t('about.craft1Num', 'Pure'),
      title: t('about.craft1Title', 'Artisanal Formulation'),
      desc: t(
        'about.craft1Desc',
        'True Extrait de Parfum formulation using high-purity aromatic oils for depth without harshness.'
      ),
      barWidth: 'w-4/5',
    },
    {
      icon: Wind,
      metric: t('about.craft2Num', '4–6h'),
      title: t('about.craft2Title', 'Balanced Projection'),
      desc: t(
        'about.craft2Desc',
        'Calibrated sillage designed to announce your presence smoothly without overwhelming a room.'
      ),
      barWidth: 'w-3/5',
    },
    {
      icon: Clock,
      metric: t('about.craft3Num', '10–14h'),
      title: t('about.craft3Title', 'Skin & Fabric Wear'),
      desc: t(
        'about.craft3Desc',
        'Slow-maturing base accords of amber, woods, and musk built to hold across warm days and late nights.'
      ),
      barWidth: 'w-full',
    },
  ];

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name:
      lang === 'ar'
        ? 'قصتنا وتراثنا • دار M20 للعطور الفاخرة'
        : 'Our Story • M20 Fine Fragrances',
    description: t(
      'about.metaDesc',
      'The story of M20, modern Egyptian Haute Parfumerie crafting artisanal luxury perfumes formulated for endurance and presence.'
    ),
    url: 'https://m20fragrance.com/about',
  };

  return (
    <div className="bg-[#F4F3EF] text-[#0B0B0B]">
      <SEO
        title={t('about.metaTitle', 'Our Story & Atelier • M20 Fine Fragrances')}
        description={t(
          'about.metaDesc',
          'Discover the story of M20, a modern Egyptian haute fragrance house crafting artisanal perfumes for lasting presence and projection.'
        )}
        keywords="عن M20, قصة دار M20, M20 perfumes story, luxury Egyptian perfume brand, artisanal fragrances Cairo"
        image="/img/m20-logo-emerald.png"
        schema={aboutSchema}
        schemaId="about-page-schema"
      />

      {/* 1. Editorial Hero Split */}
      <section className="bg-white border-b border-[#e5e3dc]">
        <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Editorial Title & Actions */}
            <div className="lg:col-span-7 text-start space-y-5">
              <span className="text-xs uppercase tracking-[0.22em] text-[#FF9D00] font-semibold block">
                {t('about.tag', 'OUR PHILOSOPHY')}
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight uppercase text-[#174F43] leading-[1.12]">
                {t('about.title', 'THE STORY OF M20')}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
                {t(
                  'about.subtitle',
                  'Crafted in Cairo for lasting presence and quiet distinction.'
                )}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-[#174F43] text-white px-6 h-11 text-xs tracking-[0.16em] font-medium uppercase hover:bg-[#0F3830] transition-colors duration-150 rounded-sm"
                >
                  <span>{t('common.exploreCollection', 'Explore Collection')}</span>
                  <DirectionArrow size={15} strokeWidth={1.5} />
                </Link>

                <Link
                  to="/offers"
                  className="inline-flex items-center justify-center bg-white border border-[#174F43] text-[#174F43] px-6 h-11 text-xs tracking-[0.16em] font-medium uppercase hover:bg-[#174F43] hover:text-white transition-colors duration-150 rounded-sm"
                >
                  {t('nav.offers', 'Special Offers')}
                </Link>
              </div>
            </div>

            {/* Brand Architectural Emblem Frame */}
            <div className="lg:col-span-5">
              <div className="bg-[#F4F3EF] border border-[#e5e3dc] rounded-sm p-8 sm:p-10 space-y-8">
                <div className="flex items-center justify-center py-4 sm:py-6">
                  <img
                    src="/img/m20-logo-emerald.png"
                    alt="M20 Fine Fragrances Official Emblem"
                    className="h-20 sm:h-24 w-auto object-contain select-none"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/img/m20-logo.png';
                    }}
                  />
                </div>

                <div className="border-t border-[#e5e3dc] pt-6 grid grid-cols-3 gap-4 text-center">
                  {stats.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-base sm:text-lg font-serif text-[#174F43] font-semibold block">
                        {item.value}
                      </span>
                      <span className="text-[11px] sm:text-xs text-slate-600 block leading-snug">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quote & Atelier Chapters */}
      <section className="py-14 md:py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Sticky Editorial Quote */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 text-start space-y-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold block">
                {t('about.originLabel', 'EST. CAIRO, EGYPT')}
              </span>

              <blockquote className="border-s-2 border-[#FF9D00] ps-5 py-1 text-xl sm:text-2xl font-serif text-[#174F43] leading-relaxed">
                {t(
                  'about.quote',
                  '“A fragrance should do more than smell pleasant. It should leave an indelible mark on memory.”'
                )}
              </blockquote>
            </div>

            {/* Numbered Story Chapters */}
            <div className="lg:col-span-7 bg-white border border-[#e5e3dc] rounded-sm divide-y divide-[#e5e3dc]">
              {chapters.map((chapter, idx) => (
                <article key={idx} className="p-6 sm:p-8 text-start space-y-2.5">
                  <h2 className="text-xs sm:text-sm uppercase tracking-[0.14em] text-[#174F43] font-semibold">
                    {chapter.title}
                  </h2>
                  <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                    {chapter.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three Brand Foundations */}
      <section className="bg-white border-y border-[#e5e3dc] py-14 md:py-20">
        <div className="max-w-[1200px] mx-auto px-6 space-y-10">
          <div className="text-start max-w-xl space-y-2">
            <span className="text-xs uppercase tracking-[0.22em] text-[#FF9D00] font-semibold block">
              {t('about.pillarsTag', 'THE M20 STANDARD')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#174F43] uppercase tracking-tight">
              {t('about.pillarsTitle', 'Our Foundations')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-[#e5e3dc] divide-y md:divide-y-0 md:divide-x rtl:md:divide-x-reverse divide-[#e5e3dc] rounded-sm">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.number}
                  className="p-6 sm:p-8 text-start space-y-4 bg-white"
                >
                  <div className="flex items-center justify-between text-[#174F43]">
                    <Icon size={20} strokeWidth={1.5} />
                    <span className="text-xs font-semibold tracking-widest text-slate-400">
                      {pillar.number}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-serif text-[#174F43] uppercase tracking-tight">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Olfactory Performance Architecture */}
      <section className="py-14 md:py-20">
        <div className="max-w-[1200px] mx-auto px-6 space-y-10">
          <div className="text-start max-w-xl space-y-2">
            <span className="text-xs uppercase tracking-[0.22em] text-[#FF9D00] font-semibold block">
              {t('about.craftTag', 'OLFACTORY ARCHITECTURE')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#174F43] uppercase tracking-tight">
              {t('about.craftTitle', 'Engineered for Endurance')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {craftSpecs.map((spec, idx) => {
              const Icon = spec.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#e5e3dc] rounded-sm p-6 sm:p-7 text-start space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl sm:text-3xl font-serif text-[#174F43]">
                        {spec.metric}
                      </span>
                      <Icon
                        size={18}
                        strokeWidth={1.5}
                        className="text-[#174F43]"
                      />
                    </div>

                    <h3 className="text-xs sm:text-sm uppercase tracking-wider font-semibold text-[#0B0B0B]">
                      {spec.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {spec.desc}
                    </p>
                  </div>

                  <div className="w-full h-1 bg-[#F4F3EF] overflow-hidden">
                    <div className={`h-full bg-[#174F43] ${spec.barWidth}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Closing Atelier Callout */}
      <section className="pb-14 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-[#174F43] text-white rounded-sm p-8 sm:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="text-start space-y-2 max-w-lg">
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#FF9D00] font-semibold block">
                {t('about.ctaTag', 'M20 HAUTE PARFUMERIE')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-tight text-white">
                {t('about.ctaTitle', 'Find Your Signature Scent')}
              </h2>
              <p className="text-sm text-white/80">
                {t('common.leaveYourMark', 'Leave your mark.')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-[#FF9D00] text-[#0B0B0B] px-6 h-11 text-xs tracking-[0.16em] font-semibold uppercase hover:bg-[#E68D00] transition-colors duration-150 rounded-sm"
              >
                <span>{t('common.exploreCollection', 'Explore Collection')}</span>
                <DirectionArrow size={15} strokeWidth={1.5} />
              </Link>

              <Link
                to="/policies"
                className="inline-flex items-center justify-center border border-white/40 text-white px-5 h-11 text-xs tracking-[0.14em] font-medium uppercase hover:bg-white hover:text-[#174F43] transition-colors duration-150 rounded-sm"
              >
                {t('nav.policies', 'Client Services')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
