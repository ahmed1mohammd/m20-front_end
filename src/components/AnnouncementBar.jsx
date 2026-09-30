import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AnnouncementBar = () => {
  return (
    <div className="bg-[#03204E] text-white py-3.5 px-4 w-full relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button className="text-white/70 hover:text-white transition-colors focus:outline-none p-1 hidden sm:block">
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        
        <div className="flex-1 flex justify-center text-center items-center text-xs sm:text-sm font-light tracking-wide uppercase">
          <span className="hidden sm:inline">Free Shipping On Orders Over 2000 EGP</span>
          <span className="hidden sm:inline mx-3 text-white/50">|</span>
          <span>Complimentary Samples With Every Order</span>
        </div>
        
        <button className="text-white/70 hover:text-white transition-colors focus:outline-none p-1 hidden sm:block">
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
