import React from 'react';
import { Link } from 'react-router-dom';

const MenWomenCategories = () => {
  return (
    <section className="bg-[#F4F3EF] py-12 md:py-16 border-t border-slate-200/80">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* For Him */}
          <div className="border border-slate-200 bg-slate-50/70 p-8 flex flex-col justify-between rounded-sm min-h-[320px]">
            <div className="space-y-2 text-left">
              <span className="text-xs uppercase tracking-widest text-[#FF9D00] font-semibold block">
                The masculine signature
              </span>
              <h2 className="text-2xl font-serif text-[#174F43] uppercase">For him</h2>
              <p className="text-xs text-slate-600 font-light max-w-sm">
                Deep woods, crisp spices, and warm amber notes formulated for bold endurance.
              </p>
            </div>
            
            <div className="pt-6 text-left">
              <Link
                to="/men"
                className="inline-flex items-center justify-center border border-[#174F43] text-[#174F43] px-5 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-[#174F43] hover:text-white transition-colors duration-150 h-10"
              >
                Shop collection
              </Link>
            </div>
          </div>

          {/* For Her */}
          <div className="border border-slate-200 bg-slate-50/70 p-8 flex flex-col justify-between rounded-sm min-h-[320px]">
            <div className="space-y-2 text-left">
              <span className="text-xs uppercase tracking-widest text-[#FF9D00] font-semibold block">
                The feminine aura
              </span>
              <h2 className="text-2xl font-serif text-[#174F43] uppercase">For her</h2>
              <p className="text-xs text-slate-600 font-light max-w-sm">
                Velvet floras, delicate vanillas, and radiant citrus accords crafted for quiet elegance.
              </p>
            </div>
            
            <div className="pt-6 text-left">
              <Link
                to="/women"
                className="inline-flex items-center justify-center border border-[#174F43] text-[#174F43] px-5 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-[#174F43] hover:text-white transition-colors duration-150 h-10"
              >
                Shop collection
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default MenWomenCategories;
