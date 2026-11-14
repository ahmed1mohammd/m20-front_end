import React, { useState, useEffect } from 'react';
import { WhatsAppIcon } from './SocialIcons';
import { getPublicSettings } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const FloatingWhatsApp = () => {
  const [phoneNumber, setPhoneNumber] = useState('201132687324');
  const { lang, isRTL } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    getPublicSettings()
      .then((settings) => {
        if (!isMounted) return;
        const number = settings?.whatsappNumber || settings?.socialMedia?.whatsapp;
        if (number) {
          setPhoneNumber(number.replace(/[^0-9]/g, ''));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const messageText = lang === 'ar'
    ? 'مرحباً دار M20، أود الاستفسار عن عطوركم الفاخرة.'
    : 'Hello M20, I would like to inquire about your fragrances.';

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageText)}`;

  return (
    <aside aria-label="Customer contact" className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-40`}>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#174F43] hover:bg-[#0F3830] text-white p-3 rounded-full border border-emerald-800 transition-colors duration-150 flex items-center justify-center shadow-lg active:scale-95 cursor-pointer"
        aria-label="Direct inquiry on WhatsApp"
      >
        <WhatsAppIcon className="w-5 h-5 fill-white" />
      </a>
    </aside>
  );
};

export default FloatingWhatsApp;
