import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Compass, Droplets, ShieldCheck, Clock, Wind, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import Reveal from '../components/Reveal';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** true once the element has entered the viewport (stays true) */
const useSeen = (threshold = 0.3) => {
  const ref = useRef(null);
  const [seen, setSeen] = useState(() => prefersReducedMotion() || typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    if (seen) return;
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [seen, threshold]);
  return [ref, seen];
};

/** 0..1 progress of the journey container passing through the middle of the viewport */
const useJourneyProgress = (ref) => {
  const [p, setP] = useState(() => (prefersReducedMotion() ? 1 : 0));
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const passed = window.innerHeight * 0.55 - r.top;
      setP(Math.min(1, Math.max(0, passed / r.height)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
  return p;
};

const Chapter = ({ idx, number, eyebrow, title, body, image, place }) => {
  const [ref, seen] = useSeen(0.35);
  const reversed = idx % 2 === 1;

  return (
    <section ref={ref} className="relative py-14 md:py-24 ps-14 md:ps-0">
      {/* Spine node */}
      <div
        className={`absolute start-4 md:start-1/2 top-24 md:top-1/2 -translate-x-1/2 rtl:translate-x-1/2 md:-translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold tracking-wider border-2 transition-all duration-700 ${
          seen
            ? 'bg-[#FF9D00] border-[#FF9D00] text-[#0F3830] scale-100 shadow-[0_0_0_8px_rgba(255,157,0,0.18)]'
            : 'bg-[#F4F3EF] border-slate-300 text-slate-400 scale-90'
        }`}
      >
        {number}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-28 items-center">
        {/* Text */}
        <div
          className={`relative text-start transition-all duration-1000 ease-out ${reversed ? 'md:order-2' : ''} ${
            seen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="space-y-4">
            <span
              aria-hidden="true"
              className="block select-none font-serif leading-none text-5xl sm:text-6xl md:text-8xl text-[#174F43]/15"
            >
              {number}
            </span>
            <div className="flex items-center gap-3">
              <span className="h-[1.5px] w-8 bg-[#FF9D00]" />
              <span className="text-xs uppercase tracking-[0.28em] text-[#FF9D00] font-semibold">{eyebrow}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif uppercase text-[#174F43] leading-tight">{title}</h2>
            <p className="text-base text-slate-600 leading-relaxed max-w-lg">{body}</p>
          </div>
        </div>

        {/* 3D image card */}
        <div
          className={`transition-all duration-1000 delay-150 ease-out ${reversed ? 'md:order-1' : ''} ${
            seen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-14'
          }`}
        >
          <div>
            <div className="relative aspect-[4/5] sm:aspect-square bg-white border border-slate-200 overflow-hidden">
              <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/product.png';
                }}
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0F3830]/40 via-transparent to-transparent" />
              <span className="absolute bottom-4 start-4 bg-[#0F3830]/85 text-white text-xs tracking-[0.25em] uppercase px-3 py-1.5">
                {place}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Meter = ({ percent }) => {
  const [ref, seen] = useSeen(0.6);
  return (
    <div ref={ref} className="w-full h-1.5 bg-[#F4F3EF] overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[#174F43] to-[#FF9D00] transition-[width] duration-[1600ms] ease-out"
        style={{ width: seen ? `${percent}%` : '0%' }}
      />
    </div>
  );
};

const AboutPage = () => {
  const { t, lang, isRTL } = useLanguage();
  const journeyRef = useRef(null);
  const progress = useJourneyProgress(journeyRef);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const DirectionArrow = isRTL ? ArrowLeft : ArrowRight;
  const strip = (s) => String(s).replace(/^\s*\d+\.\s*/, '');

  const stats = [
    { value: t('about.stat1Val', 'Extrait'), label: t('about.stat1Label', 'Haute Parfumerie') },
    { value: t('about.stat2Val', '10–14h'), label: t('about.stat2Label', 'Skin Longevity') },
    { value: t('about.stat3Val', 'Cairo'), label: t('about.stat3Label', 'Egyptian Atelier') },
  ];

  const chapters = [
    {
      title: t('about.chapter1Title', '01. Presence and Character'),
      body: t('about.p1', 'We founded M20 in Cairo as a modern Egyptian haute fragrance house for those who consider perfume an essential pillar of their personal aura.'),
      image: '/img/m20-crown-bottle.jpg',
      place: lang === 'ar' ? 'القاهرة' : 'CAIRO',
    },
    {
      title: t('about.chapter2Title', '02. Distinct Compositions'),
      body: t('about.p2', 'Every M20 fragrance possesses an uncompromising olfactive identity. Ranging from smoldering woods and dark ambers to crisp bergamot and velvety florals, each extrait is formulated with pure purpose.'),
      image: '/img/m20-night-bottle.jpg',
      place: lang === 'ar' ? 'التركيبات' : 'COMPOSITIONS',
    },
    {
      title: t('about.chapter3Title', '03. Haute Extrait de Parfum'),
      body: t('about.p3', 'Crafted with pure aromatic oils, our perfumes are formulated to radiate with confidence and endure through Egyptian warmth and evening soirees alike.'),
      image: '/img/m20-crush-bottle.jpg',
      place: 'EXTRAIT DE PARFUM',
    },
    {
      title: t('about.chapter4Title', '04. Direct Atelier Craft'),
      body: t('about.pillar3Desc', 'Luxury niche perfumery accessible directly from our craft laboratory to your vanity.'),
      image: '/img/m20-cloud-bottle.jpg',
      place: lang === 'ar' ? 'من الورشة إليك' : 'ATELIER TO YOU',
    },
  ];

  const pillars = [
    { icon: Compass, title: t('about.pillar1Title', 'Egyptian Heritage'), desc: t('about.pillar1Desc', 'Honoring thousands of years of Nile perfumery heritage with modern formulation refinement.') },
    { icon: Droplets, title: t('about.pillar2Title', 'Pure Extrait Craft'), desc: t('about.pillar2Desc', 'Dedicated to pure aromatic essences ensuring all-day sillage and rich projection.') },
    { icon: ShieldCheck, title: t('about.pillar3Title', 'Direct Atelier Value'), desc: t('about.pillar3Desc', 'Luxury niche perfumery accessible directly from our craft laboratory to your vanity.') },
  ];

  const craftSpecs = [
    { icon: Layers, metric: t('about.craft1Num', 'Pure'), title: t('about.craft1Title', 'Artisanal Formulation'), desc: t('about.craft1Desc', 'True Extrait de Parfum formulation using high-purity aromatic oils for depth without harshness.'), percent: 80 },
    { icon: Wind, metric: t('about.craft2Num', '4–6h'), title: t('about.craft2Title', 'Balanced Projection'), desc: t('about.craft2Desc', 'Calibrated sillage designed to announce your presence smoothly without overwhelming a room.'), percent: 60 },
    { icon: Clock, metric: t('about.craft3Num', '10–14h'), title: t('about.craft3Title', 'Skin & Fabric Wear'), desc: t('about.craft3Desc', 'Slow-maturing base accords of amber, woods, and musk built to hold across warm days and late nights.'), percent: 100 },
  ];

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: lang === 'ar' ? 'قصتنا وتراثنا • دار M20 للعطور الفاخرة' : 'Our Story • M20 Fine Fragrances',
    description: t('about.metaDesc', 'The story of M20, modern Egyptian Haute Parfumerie crafting artisanal luxury perfumes formulated for endurance and presence.'),
    url: 'https://m20fragrance.com/about',
  };

  const chapterWord = lang === 'ar' ? 'الفصل' : 'CHAPTER';

  return (
    <div className="bg-[#F4F3EF] text-[#0B0B0B]">
      <SEO
        title={t('about.metaTitle', 'Our Story & Atelier • M20 Fine Fragrances')}
        description={t('about.metaDesc', 'Discover the story of M20, a modern Egyptian haute fragrance house crafting artisanal perfumes for lasting presence and projection.')}
        keywords="عن M20, قصة دار M20, M20 perfumes story, luxury Egyptian perfume brand, artisanal fragrances Cairo"
        image="/img/m20-logo-emerald.png"
        schema={aboutSchema}
        schemaId="about-page-schema"
      />

      {/* ===== Prologue ===== */}
      <section className="relative overflow-hidden bg-[#174F43] text-white min-h-[85vh] flex items-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 75% 25%, rgba(255,157,0,0.22), transparent 62%), radial-gradient(ellipse 50% 70% at 10% 100%, rgba(15,56,48,0.95), transparent 70%)' }}
        />
        <div aria-hidden="true" className="pointer-events-none select-none absolute inset-x-0 bottom-0 flex justify-center font-serif leading-none text-white/[0.06] text-[16rem] sm:text-[24rem] lg:text-[30rem] translate-y-[22%] m20-drift-slow">
          M20
        </div>

        <div className="relative w-full max-w-[1200px] mx-auto px-6 py-20 text-start">
          <Reveal direction="up">
            <div className="flex items-center gap-3">
              <span className="h-[1.5px] w-10 bg-[#FF9D00]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#FF9D00] font-semibold">{t('about.tag', 'OUR PHILOSOPHY')}</span>
            </div>
          </Reveal>
          <Reveal direction="up" delay={120}>
            <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-serif uppercase leading-[1.03] max-w-3xl">
              {t('about.title', 'THE STORY OF M20')}
            </h1>
          </Reveal>
          <Reveal direction="up" delay={240}>
            <p className="mt-6 text-base sm:text-lg text-white/75 font-light max-w-xl leading-relaxed">
              {t('about.subtitle', 'Crafted in Cairo for lasting presence and quiet distinction.')}
            </p>
          </Reveal>
          <Reveal direction="up" delay={360}>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
              {stats.map((s, i) => (
                <div key={i}>
                  <span className="block font-serif text-2xl sm:text-3xl text-[#FF9D00]">{s.value}</span>
                  <span className="block text-xs uppercase tracking-[0.2em] text-white/70 mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-2 text-white/70">
          <span className="text-[11px] uppercase tracking-[0.35em]">{lang === 'ar' ? 'ابدأ الرحلة' : 'Begin the journey'}</span>
          <span className="relative block w-px h-12 bg-white/25 overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-5 bg-[#FF9D00] animate-[m20-cue_1.8s_ease-in-out_infinite]" />
          </span>
        </div>
        <style>{`@keyframes m20-cue { 0% { transform: translateY(-120%); } 100% { transform: translateY(260%); } }`}</style>
      </section>

      {/* ===== Journey: chapters along a growing spine ===== */}
      <div className="max-w-[1200px] mx-auto px-6">
        <div ref={journeyRef} className="relative">
          {/* Spine track + fill */}
          <div aria-hidden="true" className="absolute top-0 bottom-0 start-4 md:start-1/2 w-px bg-slate-300/80 -translate-x-1/2 rtl:translate-x-1/2" />
          <div
            aria-hidden="true"
            className="absolute top-0 start-4 md:start-1/2 w-[2px] bg-[#FF9D00] -translate-x-1/2 rtl:translate-x-1/2"
            style={{ height: `${progress * 100}%` }}
          >
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FF9D00] shadow-[0_0_18px_6px_rgba(255,157,0,0.55)]" />
          </div>

          {chapters.slice(0, 2).map((c, i) => (
            <Chapter
              key={i}
              idx={i}
              number={String(i + 1).padStart(2, '0')}
              eyebrow={`${chapterWord} ${String(i + 1).padStart(2, '0')}`}
              title={strip(c.title)}
              body={c.body}
              image={c.image}
              place={c.place}
            />
          ))}
        </div>
      </div>

      {/* ===== Interlude quote ===== */}
      <section className="relative overflow-hidden bg-[#0F3830] text-white py-20 md:py-28 my-4">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 100% at 50% 0%, rgba(255,157,0,0.16), transparent 70%)' }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Reveal direction="up">
            <span aria-hidden="true" className="block font-serif text-7xl leading-none text-[#FF9D00]/70">“</span>
            <blockquote className="font-serif text-2xl sm:text-4xl leading-snug">
              {String(t('about.quote', '“A fragrance should do more than smell pleasant. It should leave an indelible mark on memory.”')).replace(/^[“"]|[”"]$/g, '')}
            </blockquote>
            <span className="mt-6 inline-block text-xs uppercase tracking-[0.35em] text-[#FF9D00]">{t('about.originLabel', 'EST. CAIRO, EGYPT')}</span>
          </Reveal>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="relative">
          <div aria-hidden="true" className="absolute top-0 bottom-0 start-4 md:start-1/2 w-px bg-slate-300/80 -translate-x-1/2 rtl:translate-x-1/2" />
          {chapters.slice(2).map((c, i) => (
            <Chapter
              key={i}
              idx={i + 2}
              number={String(i + 3).padStart(2, '0')}
              eyebrow={`${chapterWord} ${String(i + 3).padStart(2, '0')}`}
              title={strip(c.title)}
              body={c.body}
              image={c.image}
              place={c.place}
            />
          ))}
        </div>
      </div>

      {/* ===== Endurance (meters animate in) ===== */}
      <section className="bg-white border-y border-[#e5e3dc] py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 space-y-12">
          <Reveal direction="up">
            <div className="text-start max-w-xl space-y-2">
              <span className="text-xs uppercase tracking-[0.28em] text-[#FF9D00] font-semibold block">{t('about.craftTag', 'OLFACTORY ARCHITECTURE')}</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#174F43] uppercase">{t('about.craftTitle', 'Engineered for Endurance')}</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {craftSpecs.map((spec, idx) => {
              const Icon = spec.icon;
              return (
                <Reveal key={idx} direction="up" delay={idx * 120}>
                  <div className="h-full bg-[#F4F3EF] border border-[#e5e3dc] p-7 text-start space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-4xl font-serif text-[#174F43]">{spec.metric}</span>
                        <Icon size={20} strokeWidth={1.5} className="text-[#174F43]" />
                      </div>
                      <h3 className="text-sm uppercase tracking-wider font-semibold">{spec.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{spec.desc}</p>
                    </div>
                    <Meter percent={spec.percent} />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Foundations ===== */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 space-y-10">
          <Reveal direction="up">
            <div className="text-start max-w-xl space-y-2">
              <span className="text-xs uppercase tracking-[0.28em] text-[#FF9D00] font-semibold block">{t('about.pillarsTag', 'THE M20 STANDARD')}</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#174F43] uppercase">{t('about.pillarsTitle', 'Our Foundations')}</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={i} direction="up" delay={i * 120}>
                  <div className="h-full bg-white border border-[#e5e3dc] hover:border-[#174F43] transition-colors p-7 text-start space-y-4">
                    <div className="flex items-center justify-between text-[#174F43]">
                      <Icon size={22} strokeWidth={1.5} />
                      <span className="text-xs font-semibold tracking-widest text-slate-400">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="text-lg font-serif text-[#174F43] uppercase">{p.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Epilogue ===== */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal direction="up">
            <div className="relative overflow-hidden bg-[#174F43] text-white p-8 sm:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 100% at 90% 0%, rgba(255,157,0,0.2), transparent 70%)' }} />
              <div className="relative text-start space-y-2 max-w-lg">
                <span className="text-xs uppercase tracking-[0.28em] text-[#FF9D00] font-semibold block">{t('about.ctaTag', 'M20 HAUTE PARFUMERIE')}</span>
                <h2 className="text-3xl sm:text-4xl font-serif uppercase">{t('about.ctaTitle', 'Find Your Signature Scent')}</h2>
                <p className="text-base text-white/80">{t('common.leaveYourMark', 'Leave your mark.')}</p>
              </div>
              <div className="relative flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-[#FF9D00] text-[#0B0B0B] px-7 h-12 text-xs tracking-[0.18em] font-semibold uppercase hover:bg-[#E68D00] transition-colors"
                >
                  <span>{t('common.exploreCollection', 'Explore Collection')}</span>
                  <DirectionArrow size={15} strokeWidth={1.5} />
                </Link>
                <Link
                  to="/offers"
                  className="inline-flex items-center justify-center border border-white/40 text-white px-6 h-12 text-xs tracking-[0.16em] font-medium uppercase hover:bg-white hover:text-[#174F43] transition-colors"
                >
                  {t('nav.offers', 'Special Offers')}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
