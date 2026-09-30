import React from 'react';
import { WhatsAppIcon } from './SocialIcons';

const FloatingWhatsApp = () => {
  const phoneNumber = '201132687324';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent('Hello ÉLAN, I would like to inquire about your fragrances.')}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      aria-label="Contact us on WhatsApp"
    >
      {/* Tooltip on hover */}
      <span className="absolute right-full mr-3 bg-[#03204E] text-white text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
        Chat with ÉLAN
      </span>

      {/* WhatsApp Icon */}
      <WhatsAppIcon className="w-7 h-7 fill-white" />
    </a>
  );
};

export default FloatingWhatsApp;
