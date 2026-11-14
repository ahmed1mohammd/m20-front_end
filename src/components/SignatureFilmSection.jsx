import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';

const FRAGRANCES = [
  {
    id: 'crush',
    name: 'CRUSH',
    image: '/img/m20-crush-bottle.jpg',
    accent: '#FF9D00',
    videoTime: 1.5,
    headlineEn: 'Warm amber, spiced citrus, and magnetic evening calm.',
    headlineAr: 'دفء العنبر والحمضيات المتبّلة بحضور مسائي آسر.',
    descEn:
      'Designed to leave an indelible impression—luminous golden resin wrapped in smooth woody depth.',
    descAr:
      'صُمم ليترك أثراً لا يُنسى؛ خلاصة عنبرية ذهبية ناعمة تمتزج بعمق الأخشاب الهادئة.',
    notesEn: 'Warm Amber • Spiced Citrus • Cedarwood',
    notesAr: 'عنبر دافئ • حمضيات ناعمة • خشب الأرز',
  },
  {
    id: 'crown',
    name: 'CROWN',
    image: '/img/m20-crown-bottle.jpg',
    accent: '#D4A853',
    videoTime: 5.2,
    headlineEn: 'Refined golden radiance crafted with regal restraint.',
    headlineAr: 'إشراقة ذهبية متزنة تعكس الفخامة الملكية الهادئة.',
    descEn:
      'A poised signature composition balancing sunlit bergamot, honeyed woods, and crisp white musk.',
    descAr:
      'توليفة راقية توازن بين انتعاش البرغموت الذهبي ودفء الأخشاب العسلية والمسك الأبيض.',
    notesEn: 'Golden Bergamot • Honeyed Woods • White Musk',
    notesAr: 'برغموت ذهبي • أخشاب دافئة • مسك أبيض',
  },
  {
    id: 'bloom',
    name: 'BLOOM',
    image: '/img/m20-bloom-bottle.jpg',
    accent: '#D68C9B',
    videoTime: 8.2,
    headlineEn: 'Velvet botanical petals suspended in morning stillness.',
    headlineAr: 'بتلات زهرية مخملية في سكون الصباح النقي.',
    descEn:
      'Delicate rose and white jasmine softened by powdery iris for effortless, timeless elegance.',
    descAr:
      'تناغم رقيق بين الورد الدمشقي والياسمين الأبيض مع لمسة ناعمة من زهرة السوسن.',
    notesEn: 'Velvet Rose • White Jasmine • Soft Iris',
    notesAr: 'ورد مخملي • ياسمين أبيض • سوسن ناعم',
  },
  {
    id: 'night',
    name: 'NIGHT',
    image: '/img/m20-night-bottle.jpg',
    accent: '#3A7BD5',
    videoTime: 11.2,
    headlineEn: 'Deep nocturnal clarity etched in cool indigo and oud.',
    headlineAr: 'صفاء ليلي عميق يجمع هدوء الأزرق الداكن وعمق العود.',
    descEn:
      'Crisp lavender and crushed cardamom descending into smoky vetiver and dark balsamic woods.',
    descAr:
      'افتتاحية من الخزامى والهيل المطحون تستقر على قاعدة من نجيل الهند والأخشاب الداكنة.',
    notesEn: 'Nocturnal Lavender • Cardamom • Smoky Vetiver',
    notesAr: 'خزامى ليلي • هيل • نجيل الهند',
  },
  {
    id: 'cloud',
    name: 'CLOUD',
    image: '/img/m20-cloud-bottle.jpg',
    accent: '#C4B59B',
    videoTime: 14.0,
    headlineEn: 'Weightless cashmere warmth with sheer mineral clarity.',
    headlineAr: 'دفء كشميري خفيف بنقاء شفاف يشبه السحاب.',
    descEn:
      'Airy sandalwood and whipped vanilla cocooned in clean skin-musk for quiet everyday poise.',
    descAr:
      'خشب الصندل الهوائي ولمسات الفانيليا الناعمة مع مسك هادئ يناسب كل لحظة.',
    notesEn: 'Whipped Vanilla • Sandalwood • Sheer Musk',
    notesAr: 'فانيليا ناعمة • خشب الصندل • مسك شفاف',
  },
  {
    id: 'cherry',
    name: 'CHERRY',
    image: '/img/m20-cherry-bottle.jpg',
    accent: '#9B2C3E',
    videoTime: 16.5,
    headlineEn: 'Rich dark fruit tempered by toasted tonka and almond.',
    headlineAr: 'عمق الكرز الداكن الممزوج بدفء التونكا واللوز المحمّص.',
    descEn:
      'Lush ruby cherry meets roasted almond and warm Peru balsam for a captivating velvet trail.',
    descAr:
      'فاكهة الكرز الياقوتية تلتقي باللوز المحمّص وبلسم البيرو لإطلالة مخملية جذابة.',
    notesEn: 'Ruby Cherry • Toasted Almond • Tonka Bean',
    notesAr: 'كرز ياقوتي • لوز محمّص • حبوب التونكا',
  },
];

/**
 * Editorial Signature Film Section showcasing the custom 3D cinematic film
 * where all 6 M20 perfumes transform sequentially in a luxury studio setting.
 */
const SignatureFilmSection = () => {
  const { lang, isRTL } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef(null);

  const total = FRAGRANCES.length;
  const activeItem = FRAGRANCES[activeIndex];

  // Track video playback time to sync active perfume copy and thumbnail indicators
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const t = video.currentTime;

    let idx = 0;
    if (t < 3.8) idx = 0;       // CRUSH
    else if (t < 6.8) idx = 1;  // CROWN
    else if (t < 9.8) idx = 2;  // BLOOM
    else if (t < 12.8) idx = 3; // NIGHT
    else if (t < 15.2) idx = 4; // CLOUD
    else idx = 5;               // CHERRY

    if (idx !== activeIndex) {
      setActiveIndex(idx);
    }
  };

  const jumpToFragrance = (idx) => {
    setActiveIndex(idx);
    if (videoRef.current) {
      videoRef.current.currentTime = FRAGRANCES[idx].videoTime;
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <section className="bg-[#FFFFFF] border-y border-slate-200/80 py-14 md:py-20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Narrative Column */}
          <Reveal
            direction={isRTL ? 'left' : 'right'}
            className={`lg:col-span-5 space-y-5 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="h-[2px] w-7 transition-colors duration-500"
                  style={{ backgroundColor: activeItem.accent }}
                />
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#FF9D00] font-semibold">
                  {lang === 'ar'
                    ? `فيلم الدار الحصري • ${activeItem.name}`
                    : `SIGNATURE FILM • ${activeItem.name}`}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 tracking-widest">
                {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            </div>

            {/* Dynamic Headline & Description */}
            <div key={activeItem.id} className="space-y-3 min-h-[125px] transition-opacity duration-500">
              <h2 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-serif text-[#174F43] leading-snug tracking-tight">
                {lang === 'ar' ? activeItem.headlineAr : activeItem.headlineEn}
              </h2>

              <p className="text-sm text-slate-600 font-light leading-relaxed">
                {lang === 'ar' ? activeItem.descAr : activeItem.descEn}
              </p>

              <p className="text-[11px] uppercase tracking-[0.2em] text-[#174F43]/75 font-medium pt-0.5">
                {lang === 'ar' ? activeItem.notesAr : activeItem.notesEn}
              </p>
            </div>

            {/* 6 Fragrance Stepper Tabs (Clicking any tab jumps the 3D film to that perfume) */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
              {FRAGRANCES.map((frag, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <button
                    key={frag.id}
                    type="button"
                    onClick={() => jumpToFragrance(idx)}
                    className={`group/tab relative text-center py-2 px-1 border transition-all duration-300 cursor-pointer overflow-hidden ${
                      isCurrent
                        ? 'border-[#174F43] bg-[#F4F3EF] text-[#174F43]'
                        : 'border-slate-200/90 bg-white text-slate-500 hover:border-slate-300 hover:text-[#174F43]'
                    }`}
                  >
                    <span className="block text-[9px] font-mono text-slate-400 leading-none mb-1">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="block text-[10px] font-semibold tracking-[0.14em] uppercase">
                      {frag.name}
                    </span>
                    {isCurrent && (
                      <span
                        className="absolute bottom-0 inset-x-0 h-[2px] transition-colors duration-300"
                        style={{ backgroundColor: frag.accent }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link
                to={`/shop?search=${encodeURIComponent(activeItem.name.toLowerCase())}`}
                className="inline-flex items-center gap-2.5 bg-[#174F43] hover:bg-[#0F3830] text-white text-xs font-medium uppercase tracking-[0.2em] px-7 py-3.5 transition-all duration-300 group"
              >
                <span>
                  {lang === 'ar' ? `اكتشف ${activeItem.name}` : `DISCOVER ${activeItem.name}`}
                </span>
                {isRTL ? (
                  <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </Link>
            </div>
          </Reveal>

          {/* 3D Commercial Video Visual Stage */}
          <Reveal
            direction={isRTL ? 'right' : 'left'}
            delay={120}
            className="lg:col-span-7"
          >
            <div className="space-y-3">
              <div className="relative rounded-sm overflow-hidden bg-[#F4F3EF] border border-slate-200/90 shadow-sm aspect-video group">
                <video
                  ref={videoRef}
                  src="/videos/m20-collection-showcase.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full h-full object-cover block"
                />

                {/* Subtle active fragrance floating tag */}
                <div className="pointer-events-none absolute top-4 start-4 z-10 flex items-center gap-2 bg-white/85 backdrop-blur-xs border border-slate-200/80 px-3 py-1.5 rounded-xs">
                  <span
                    className="w-2 h-2 rounded-full transition-colors duration-500"
                    style={{ backgroundColor: activeItem.accent }}
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#174F43]">
                    M20 • {activeItem.name}
                  </span>
                </div>

                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
              </div>

              {/* 6 Fragrance Synchronized Thumbnails */}
              <div className="grid grid-cols-6 gap-2">
                {FRAGRANCES.map((frag, idx) => {
                  const isCurrent = idx === activeIndex;
                  return (
                    <button
                      key={frag.id}
                      type="button"
                      onClick={() => jumpToFragrance(idx)}
                      aria-label={`Jump to ${frag.name}`}
                      className={`group/thumb relative aspect-square overflow-hidden border transition-all duration-300 cursor-pointer bg-[#EFEFEE] ${
                        isCurrent
                          ? 'border-[#FF9D00] ring-1 ring-[#FF9D00] -translate-y-0.5 shadow-xs'
                          : 'border-slate-200/80 opacity-65 hover:opacity-100 hover:border-[#174F43]'
                      }`}
                    >
                      <img
                        src={frag.image}
                        alt={frag.name}
                        className="w-full h-full object-cover block transition-transform duration-500 group-hover/thumb:scale-105"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default SignatureFilmSection;
