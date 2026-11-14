import React, { useState, useEffect } from 'react';
import { getPublicSettings } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const AnnouncementBar = () => {
  const { lang, t } = useLanguage();
  const [announcement, setAnnouncement] = useState({
    active: true,
    text: ''
  });

  useEffect(() => {
    let isMounted = true;
    getPublicSettings()
      .then((settings) => {
        if (!isMounted) return;
        if (settings?.announcement) {
          setAnnouncement({
            active: settings.announcement.active !== false,
            text: settings.announcement.text || ''
          });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  if (!announcement.active) {
    return null;
  }

  // Display language-appropriate text:
  // If the admin saved custom text, use it if it matches the current language, or display translated default
  const defaultText = t('announcement.defaultText', 'Free shipping on eligible orders | Complimentary discovery sample with every purchase');
  const displayText = (lang === 'ar' && announcement.text && /[\u0600-\u06FF]/.test(announcement.text))
    ? announcement.text
    : (lang === 'en' && announcement.text && !/[\u0600-\u06FF]/.test(announcement.text))
      ? announcement.text
      : defaultText;

  return (
    <div className="bg-[#174F43] text-white py-2 px-4 w-full relative z-40 transition-all duration-300">
      <div className="max-w-[1200px] mx-auto flex items-center justify-center text-center text-xs tracking-wider">
        <span>{displayText}</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
