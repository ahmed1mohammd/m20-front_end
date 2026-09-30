import React, { useState } from 'react';

const PoliciesSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const policies = [
    {
      title: 'Shipping & Delivery',
      content: 'Complimentary express shipping across Egypt on orders over 1000 EGP. Standard delivery takes 2–4 business days.'
    },
    {
      title: 'Payment Methods',
      content: 'We accept Credit/Debit Cards, Cash on Delivery, and Fawaterk online payments securely.'
    },
    {
      title: 'Returns & Exchange',
      content: 'Unopened fragrance bottles in original packaging may be returned within 14 days of receipt.'
    },
    {
      title: 'Order Policy',
      content: 'Orders are processed immediately. Changes or cancellations can be made within 2 hours of placement.'
    }
  ];

  return (
    <section className="bg-white py-14 border-t border-slate-100">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-medium block">
            Customer Privileges
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#03204E] tracking-tight uppercase">
            PURCHASE & SHIPPING POLICIES
          </h2>
        </div>

        <div className="max-w-2xl mx-auto divide-y divide-slate-100 border-t border-b border-slate-100">
          {policies.map((policy, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4 text-left">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-medium text-[#03204E] hover:opacity-75 transition-opacity"
                >
                  <span>{policy.title}</span>
                  <span className="text-base font-light">{isOpen ? '-' : '+'}</span>
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs text-slate-500 font-light leading-relaxed">
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
