import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const AboutElan = () => {
  return (
    <section className="bg-white py-8 border-t border-slate-100">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Banner Container - Clean natural layout, no heavy box borders */}
        <div className="relative w-full overflow-hidden min-h-[300px] sm:min-h-[360px] md:min-h-[420px] flex items-center bg-[#F7F4EF]">
          
          {/* Background Image positioned on the right */}
          <img
            src="/img/About.png"
            alt="About ÉLAN"
            className="absolute inset-0 w-full h-full object-cover object-right"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/About.png';
            }}
          />

          {/* Left Gradient Overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7F4EF] via-[#F7F4EF]/90 sm:via-[#F7F4EF]/75 to-transparent w-full sm:w-2/3 md:w-1/2"></div>

          {/* Left Content */}
          <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-xl text-left space-y-4">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-[#03204E] tracking-tight uppercase">
              ABOUT ÉLAN
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed max-w-md">
              A modern Egyptian perfume brand created for those who believe that a fragrance is more than just a scent — it's a mark.
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 bg-white/90 border border-[#03204E] text-[#03204E] px-6 py-3 text-xs tracking-[0.2em] font-medium uppercase hover:bg-[#03204E] hover:text-white transition-colors group rounded-sm shadow-sm"
              >
                <span>OUR STORY</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutElan;
