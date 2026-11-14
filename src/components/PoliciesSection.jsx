import React, { useState } from 'react';

const PoliciesSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const policies = [
    {
      title: 'Shipping and delivery',
      content: 'Complimentary shipping across Egypt on qualifying orders. Standard delivery arrives within 2 to 4 business days.'
    },
    {
      title: 'Payment methods',
      content: 'We accept Vodafone Cash and InstaPay direct mobile transfers with instant confirmation.'
    },
    {
      title: 'Returns and exchanges',
      content: 'Unopened fragrance bottles in original sealed packaging may be returned within 14 days of receipt.'
    },
    {
      title: 'Order modification',
      content: 'Orders are processed quickly. Changes or cancellations can be requested within 2 hours of placement.'
    }
  ];

  return (
    <section className="bg-[#F4F3EF] py-12 md:py-16 border-t border-slate-200/80">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-medium block">
            Customer guide
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#174F43] tracking-tight uppercase">
            Purchase and delivery policies
          </h2>
        </div>

        <div className="max-w-2xl mx-auto divide-y divide-slate-200 border-t border-b border-slate-200">
          {policies.map((policy, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4 text-left">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-medium text-[#174F43] hover:text-slate-600 transition-colors duration-150 py-1"
                >
                  <span>{policy.title}</span>
                  <span className="text-base font-light text-slate-500">{isOpen ? '-' : '+'}</span>
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-slate-600 font-light leading-relaxed">
                    {policy.content}
                  </p>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PoliciesSection;
