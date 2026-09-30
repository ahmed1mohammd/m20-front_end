import React from 'react';
import { ShieldCheck, Leaf, Package, Truck } from 'lucide-react';

const FeaturesBar = () => {
  return (
    <section className="bg-white py-10 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex items-center space-x-4">
            <ShieldCheck size={28} strokeWidth={1.2} className="text-[#03204E] shrink-0" />
            <div className="text-left">
              <h4 className="text-xs font-bold text-[#03204E]">20% Eau de Parfum</h4>
              <p className="text-[11px] text-slate-500 font-light">Long-lasting fragrance.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Leaf size={28} strokeWidth={1.2} className="text-[#03204E] shrink-0" />
            <div className="text-left">
              <h4 className="text-xs font-bold text-[#03204E]">Premium Ingredients</h4>
              <p className="text-[11px] text-slate-500 font-light">Carefully selected.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Package size={28} strokeWidth={1.2} className="text-[#03204E] shrink-0" />
            <div className="text-left">
              <h4 className="text-xs font-bold text-[#03204E]">Secure Packaging</h4>
              <p className="text-[11px] text-slate-500 font-light">Safe and reliable.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Truck size={28} strokeWidth={1.2} className="text-[#03204E] shrink-0" />
            <div className="text-left">
              <h4 className="text-xs font-bold text-[#03204E]">Fast & Reliable Shipping</h4>
              <p className="text-[11px] text-slate-500 font-light">All over Egypt.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
