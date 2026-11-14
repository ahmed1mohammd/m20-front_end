import React from 'react';
import { ShieldCheck, Leaf, Package, Truck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';

const FeaturesBar = () => {
  const { t, isRTL } = useLanguage();

  const features = [
    {
      icon: ShieldCheck,
      title: t('features.f1Title', 'GENUINE EXTRAIT DE PARFUM'),
      description: t('features.f1Desc', 'Crafted for rich presence and all-day endurance.'),
    },
    {
      icon: Leaf,
      title: t('features.f2Title', 'RARE ARTISANAL ESSENCES'),
      description: t('features.f2Desc', 'Distilled natural ingredients sourced from master perfumers.'),
    },
    {
      icon: Package,
      title: t('features.f3Title', 'ELEGANT LUXURY PACKAGING'),
      description: t('features.f3Desc', 'Hand-finished packaging designed for gifting and collection.'),
    },
    {
      icon: Truck,
      title: t('features.f4Title', 'EXPRESS NATIONWIDE DELIVERY'),
      description: t('features.f4Desc', 'Direct to your door in 2-4 days with Metro station pickup in Cairo.'),
    },
  ];

  return (
    <section className="bg-[#F4F3EF] py-8 border-b border-slate-200/80">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Reveal key={idx} delay={idx * 90} direction="up" distance={16}>
                <div className={`group flex items-center ${isRTL ? 'space-x-reverse space-x-3 text-right' : 'space-x-3 text-left'}`}>
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className="text-[#174F43] group-hover:text-[#FF9D00] group-hover:scale-110 transition-all duration-300 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-[#174F43] tracking-wide">{feature.title}</h4>
                    <p className="text-xs text-slate-500 font-light mt-0.5">{feature.description}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
