import React from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Quiet editorial ribbon below the hero carousel showcasing M20 brand ethos.
 */
const BrandMarquee = () => {
  const { lang } = useLanguage();

  const items =
    lang === 'ar'
      ? [
          'صُمم ليترك أثراً لا يُنسى',
          'إكستريت دي بارفان',
          'دار M20 للعطور الفاخرة',
          'حضور هادئ وبصمة خالدة',
          'توازن دقيق بين النقاء والعمق',
        ]
      : [
          'DESIGNED TO LEAVE AN IMPRESSION',
          'EXTRAIT DE PARFUM',
          'M20 SIGNATURE ATELIER',
          'CRAFTED FOR INDELIBLE PRESENCE',
          'BOTANICAL CLARITY & DEPTH',
        ];

  return (
    <section
      aria-label={lang === 'ar' ? 'شريط هوية M20' : 'M20 brand manifesto'}
      className="bg-[#174F43] text-[#F4F3EF] border-y border-[#0F3830] overflow-hidden py-3 m20-marquee-wrapper select-none"
      dir="ltr"
    >
      <div className="inline-flex w-max whitespace-nowrap m20-wave-slow items-center">
        {[0, 1].map((loopIdx) => (
          <div key={loopIdx} className="inline-flex items-center" aria-hidden={loopIdx === 1}>
            {items.map((label, idx) => (
              <span key={`${loopIdx}-${idx}`} className="inline-flex items-center">
                <span className="text-[11px] sm:text-xs font-medium tracking-[0.22em] uppercase px-6 sm:px-8 text-[#F4F3EF]/95">
                  {label}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9D00] shrink-0" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandMarquee;
