import React, { useState, useEffect } from 'react';
import { Truck, RotateCcw, CreditCard, ShieldCheck, FileText, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

const PoliciesPage = () => {
  const [activeTab, setActiveTab] = useState('shipping');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tabs = [
    { id: 'shipping', label: 'Shipping Policy', icon: Truck },
    { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
    { id: 'payment', label: 'Payment Policy', icon: CreditCard },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  const faqs = [
    {
      q: 'How can I place an order?',
      a: 'Choose your fragrance and available size, add it to your cart, complete your customer and delivery information, select your payment method, transfer the final amount, upload your payment receipt, and submit your order.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'Currently, we accept Vodafone Cash and InstaPay.'
    },
    {
      q: 'How do I know my payment was confirmed?',
      a: 'Your order will initially show “Payment Verification Pending.” Once your payment has been reviewed, the order status will be updated.'
    },
    {
      q: 'Can I pick up my order from a Metro station?',
      a: 'Yes. Select Metro Station Pickup during checkout and choose your preferred station. We will contact you to arrange the pickup date and time.'
    },
    {
      q: 'Do you offer home delivery?',
      a: 'Yes. Choose Home Delivery at checkout and enter your complete address. Any applicable shipping fee will be shown before payment.'
    },
    {
      q: 'Can I change my order after placing it?',
      a: 'Contact ÉLAN as soon as possible with your order number. Changes depend on the current status of your order.'
    },
    {
      q: 'What if I receive a damaged or incorrect product?',
      a: 'Contact us with your order number and clear photos of the product and packaging so our team can review the issue.'
    },
    {
      q: 'Where can I contact ÉLAN?',
      a: 'You can reach us through the contact details and official social media accounts listed on our website.'
    }
  ];

  return (
    <div className="bg-white text-[#03204E]">
      
      {/* Header Banner */}
      <section className="bg-[#FAF8F5] py-16 md:py-20 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-medium block">
            Customer Information & Policies
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#03204E] tracking-tight uppercase">
            POLICIES & FAQ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-light max-w-md mx-auto leading-relaxed">
            Everything you need to know about shipping, payments, returns, privacy, and ordering with ÉLAN.
          </p>
          <div className="w-12 h-[1px] bg-[#03204E] mx-auto pt-2 opacity-40"></div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-[#FAFAFA] border border-slate-200/80 rounded-xl p-4 space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold px-3 py-2 block">
                Policy Navigation
              </span>
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-wider font-medium rounded-lg transition-all text-left ${
                      isActive
                        ? 'bg-[#03204E] text-white shadow-sm'
                        : 'text-slate-600 hover:bg-white hover:text-[#03204E]'
                    }`}
                  >
                    <IconComponent size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Policy Detail Content */}
          <div className="lg:col-span-8 text-left space-y-12">
            
            {/* 1. SHIPPING POLICY */}
            {(activeTab === 'shipping' || activeTab === 'all') && (
              <div id="shipping" className="bg-white border border-slate-200/70 rounded-xl p-6 sm:p-10 space-y-6 shadow-sm">
                <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                  <Truck className="text-[#03204E]" size={24} />
                  <h2 className="text-2xl font-serif uppercase tracking-wide text-[#03204E]">Shipping Policy</h2>
                </div>

                {/* Home Delivery */}
                <div className="space-y-3 bg-[#FAFAFA] p-5 rounded-lg border border-slate-100">
                  <h3 className="text-sm uppercase tracking-wider font-semibold text-[#03204E] flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-[#03204E]" />
                    <span>Home Delivery</span>
                  </h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    ÉLAN offers home delivery to available locations across Egypt. Shipping fees are calculated based on your delivery location and will be shown before you complete your order.
                  </p>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    Please make sure your phone number and delivery address are correct. Our team may contact you to confirm your order or delivery details.
                  </p>
                </div>

                {/* Metro Station Pickup */}
                <div className="space-y-3 bg-[#FAFAFA] p-5 rounded-lg border border-slate-100">
                  <h3 className="text-sm uppercase tracking-wider font-semibold text-[#03204E] flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-[#03204E]" />
                    <span>Metro Station Pickup</span>
                  </h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    You can also choose Metro Station Pickup during checkout. Select your preferred station when placing your order, and our team will contact you to confirm the pickup date and time.
                  </p>
                  <p className="text-xs text-amber-800 font-medium bg-amber-50 p-3 rounded border border-amber-200/60 leading-relaxed">
                    Please do not head to the selected station until your pickup has been confirmed by ÉLAN.
                  </p>
                </div>
              </div>
            )}

            {/* 2. RETURNS & REFUNDS */}
            {(activeTab === 'returns' || activeTab === 'all') && (
              <div id="returns" className="bg-white border border-slate-200/70 rounded-xl p-6 sm:p-10 space-y-6 shadow-sm">
                <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                  <RotateCcw className="text-[#03204E]" size={24} />
                  <h2 className="text-2xl font-serif uppercase tracking-wide text-[#03204E]">Returns & Refunds</h2>
                </div>

                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  We want you to be satisfied with your ÉLAN order.
                </p>

                <div className="space-y-4 text-xs text-slate-600 font-light leading-relaxed">
                  <div className="p-4 bg-slate-50 border-l-2 border-[#03204E] space-y-1">
                    <h4 className="font-semibold text-[#03204E]">Damaged or Incorrect Items</h4>
                    <p>
                      If your order arrives damaged, defective, incorrect, or with an issue, please contact us as soon as possible and provide your order number along with clear photos of the product and packaging.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border-l-2 border-[#03204E] space-y-1">
                    <h4 className="font-semibold text-[#03204E]">Hygiene & Product Safety</h4>
                    <p>
                      For hygiene and product-quality reasons, opened or used fragrances may not be eligible for return or exchange except where the product is defective or an applicable consumer right requires otherwise.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border-l-2 border-[#03204E] space-y-1">
                    <h4 className="font-semibold text-[#03204E]">Refund Processing</h4>
                    <p>
                      Approved refunds or exchanges will be processed after the product and order details have been reviewed by our team.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. PAYMENT POLICY */}
            {(activeTab === 'payment' || activeTab === 'all') && (
              <div id="payment" className="bg-white border border-slate-200/70 rounded-xl p-6 sm:p-10 space-y-6 shadow-sm">
                <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                  <CreditCard className="text-[#03204E]" size={24} />
                  <h2 className="text-2xl font-serif uppercase tracking-wide text-[#03204E]">Payment Policy</h2>
                </div>

                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Currently, ÉLAN accepts manual payments through:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#FAFAFA] border border-slate-200 rounded-lg text-center space-y-1">
                    <span className="text-xs font-semibold text-[#03204E] uppercase tracking-wider block">Vodafone Cash</span>
                    <span className="text-[11px] text-slate-500 font-light">Manual Transfer via Mobile Wallet</span>
                  </div>
                  <div className="p-4 bg-[#FAFAFA] border border-slate-200 rounded-lg text-center space-y-1">
                    <span className="text-xs font-semibold text-[#03204E] uppercase tracking-wider block">InstaPay</span>
                    <span className="text-[11px] text-slate-500 font-light">Direct Transfer via InstaPay IPN</span>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-slate-600 font-light list-disc pl-5 leading-relaxed">
                  <li>After choosing your payment method at checkout, you will see the account details and the exact amount to transfer.</li>
                  <li>After completing the transfer, upload a clear screenshot of your payment receipt.</li>
                  <li>Your order will initially be marked as: <strong className="text-[#03204E] font-semibold">Payment Verification Pending</strong></li>
                  <li>Your order will only move to processing after the payment has been reviewed and confirmed by ÉLAN.</li>
                  <li>Please always check the final order total before making your transfer.</li>
                </ul>
              </div>
            )}

            {/* 4. PRIVACY POLICY */}
            {(activeTab === 'privacy' || activeTab === 'all') && (
              <div id="privacy" className="bg-white border border-slate-200/70 rounded-xl p-6 sm:p-10 space-y-6 shadow-sm">
                <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                  <ShieldCheck className="text-[#03204E]" size={24} />
                  <h2 className="text-2xl font-serif uppercase tracking-wide text-[#03204E]">Privacy Policy</h2>
                </div>

                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  ÉLAN respects your privacy.
                </p>

                <div className="space-y-4 text-xs text-slate-600 font-light leading-relaxed">
                  <p>
                    We only collect the information needed to process and deliver your orders, communicate with you, provide customer support, and improve your shopping experience.
                  </p>
                  <p>
                    This may include your name, phone number, delivery address, order information, and payment confirmation details.
                  </p>
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg">
                    <p className="font-semibold text-xs mb-1">Security Notice:</p>
                    <p>
                      We do not ask you to provide your Vodafone Cash or InstaPay password, PIN, OTP, or other private account credentials.
                    </p>
                  </div>
                  <p>
                    By using our website, you agree to the collection and use of information necessary to provide our services.
                  </p>
                </div>
              </div>
            )}

            {/* 5. TERMS & CONDITIONS */}
            {(activeTab === 'terms' || activeTab === 'all') && (
              <div id="terms" className="bg-white border border-slate-200/70 rounded-xl p-6 sm:p-10 space-y-6 shadow-sm">
                <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                  <FileText className="text-[#03204E]" size={24} />
                  <h2 className="text-2xl font-serif uppercase tracking-wide text-[#03204E]">Terms & Conditions</h2>
                </div>

                <ul className="space-y-4 text-xs text-slate-600 font-light list-disc pl-5 leading-relaxed">
                  <li>By placing an order through the ÉLAN website, you confirm that the information you provide is accurate and complete.</li>
                  <li>Product availability, sizes, prices, offers, and shipping options displayed at checkout are subject to availability.</li>
                  <li>An order is not considered payment-confirmed until the submitted payment has been reviewed by ÉLAN.</li>
                  <li>ÉLAN may contact you if additional information is required to process your order.</li>
                  <li>Discount codes and promotional offers are subject to their displayed conditions and validity periods.</li>
                </ul>
              </div>
            )}

            {/* 6. FAQ */}
            {(activeTab === 'faq' || activeTab === 'all') && (
              <div id="faq" className="bg-white border border-slate-200/70 rounded-xl p-6 sm:p-10 space-y-6 shadow-sm">
                <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                  <HelpCircle className="text-[#03204E]" size={24} />
                  <h2 className="text-2xl font-serif uppercase tracking-wide text-[#03204E]">Frequently Asked Questions</h2>
                </div>

                <div className="divide-y divide-slate-100">
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="py-4">
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#03204E] hover:opacity-75 transition-opacity"
                        >
                          <span className="pr-4">{faq.q}</span>
                          <ChevronDown size={16} className={`transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <p className="mt-3 text-xs text-slate-600 font-light leading-relaxed bg-[#FAFAFA] p-4 rounded-lg border border-slate-100">
                            {faq.a}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

    </div>
  );
};

export default PoliciesPage;
