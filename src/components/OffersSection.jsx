import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const OffersSection = ({ offers = [] }) => {
  return (
    <section className="bg-white py-8 border-t border-slate-100">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Banner Container - Clean natural layout, no heavy box borders */}
        <div className="relative w-full overflow-hidden min-h-[300px] sm:min-h-[360px] md:min-h-[420px] flex items-center bg-[#F5F5F3]">
          
          {/* Background Image positioned on the right */}
          <img
            src="/img/offers.png"
            alt="Special Offers"
            className="absolute inset-0 w-full h-full object-cover object-right"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/product.png';
            }}
          />

          {/* Left Gradient Overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F5F3] via-[#F5F5F3]/90 sm:via-[#F5F5F3]/75 to-transparent w-full sm:w-2/3 md:w-1/2"></div>

          {/* Left Content */}
          <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-xl text-left space-y-3 sm:space-y-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-medium block">
              SPECIAL OFFERS
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#03204E] tracking-tight uppercase leading-tight">
              UP TO 20% OFF
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed max-w-md">
              On selected fragrances for a limited time.
            </p>

            {offers && offers.length > 0 && (
              <div className="space-y-1 pt-1">
                {offers.map((offer, idx) => (
                  <div key={idx} className="text-xs text-[#03204E] font-medium">
                    <span className="uppercase tracking-wider font-semibold">{offer.code}:</span> {offer.description || `${offer.discountPercent}% Off`}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/offers"
                className="inline-flex items-center space-x-2 bg-[#03204E] text-white px-7 py-3.5 text-xs tracking-[0.2em] font-medium uppercase hover:bg-slate-800 transition-colors group rounded-sm shadow-sm"
              >
                <span>EXPLORE OFFERS</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default OffersSection;
