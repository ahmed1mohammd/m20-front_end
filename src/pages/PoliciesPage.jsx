import React, { useState, useEffect } from 'react';
import { Truck, RotateCcw, CreditCard, ShieldCheck, FileText, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

const PoliciesPage = () => {
  const [activeTab, setActiveTab] = useState('shipping');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const { t, lang } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': lang === 'ar' ? 'كيف يمكنني الطلب من دار M20؟' : 'How can I place an order on M20?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': lang === 'ar' ? 'اختر عطرك المفضل والحجم المناسب، ثم أضفه إلى حقيبة التسوق وأدخل تفاصيل التوصيل وطريقة الدفع المفضلة.' : 'Choose your fragrance and available size, add it to your cart, fill in delivery details, select payment method (Vodafone Cash or InstaPay), and submit your order.'
        }
      },
      {
        '@type': 'Question',
        'name': lang === 'ar' ? 'ما هي وسائل الدفع المتاحة لدى M20؟' : 'What payment methods does M20 accept?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': lang === 'ar' ? 'نقبل الدفع عبر محفظة فودافون كاش، وعبر شبكة إنستاباي (InstaPay IPN) اللحظية، بالإضافة للدفع عند الاستلام.' : 'We accept direct transfers via Vodafone Cash, InstaPay IPN in Egypt, and cash on delivery.'
        }
      },
      {
        '@type': 'Question',
        'name': lang === 'ar' ? 'هل يمكنني استلام الطلب من محطة مترو بالقاهرة؟' : 'Can I pick up my order from a Cairo Metro station?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': lang === 'ar' ? 'نعم، نوفر خيار الاستلام من أي محطة مترو بالقاهرة والجيزة كخيار اقتصادي ومريح دون أي تكاليف شحن إضافية.' : 'Yes. Choose Metro Station Pickup at checkout to pick up your order without extra shipping fees.'
        }
      }
    ]
  };

  const tabs = [
    { id: 'shipping', label: lang === 'ar' ? 'سياسة الشحن والتوصيل' : 'Shipping policy', icon: Truck },
    { id: 'returns', label: lang === 'ar' ? 'الاسترجاع والاستبدال' : 'Returns and refunds', icon: RotateCcw },
    { id: 'payment', label: lang === 'ar' ? 'طرق وسياسة الدفع' : 'Payment policy', icon: CreditCard },
    { id: 'privacy', label: lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy policy', icon: ShieldCheck },
    { id: 'terms', label: lang === 'ar' ? 'الشروط والأحكام' : 'Terms and conditions', icon: FileText },
    { id: 'faq', label: lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ', icon: HelpCircle },
  ];

  const faqs = [
    {
      q: lang === 'ar' ? 'كيف يمكنني إتمام الطلب؟' : 'How can I place an order?',
      a: lang === 'ar' ? 'اختر العطر والحجم المطلوب، أضفه للحقيبة، توجه لصفحة إتمام الطلب وأدخل عنوانك ورقم هاتفك، ثم اختر وسيلة الدفع وأكد طلبك.' : 'Choose your fragrance and available size, add it to your cart, fill in your delivery details, select your payment method (Vodafone Cash or InstaPay), transfer the exact order amount, and submit your order.'
    },
    {
      q: lang === 'ar' ? 'ما هي طرق الدفع المتوفرة؟' : 'What payment methods do you accept?',
      a: lang === 'ar' ? 'نوفر التحويل عبر فودافون كاش، وإنستاباي (InstaPay IPN)، والدفع عند الاستلام للطلبات المؤهلة.' : 'Currently, we accept direct transfers via Vodafone Cash and InstaPay, as well as Cash on Delivery for eligible orders.'
    },
    {
      q: lang === 'ar' ? 'كيف أتأكد من استلام وتأكيد طلبي؟' : 'How do I know my payment was confirmed?',
      a: lang === 'ar' ? 'بمجرد إرسال طلبك ومراجعة إيصال التحويل من فريق خدمة العملاء، ستتغير حالة الطلب إلى (تم التأكيد) ثم (جاري التجهيز والتغليف) ويمكنك تتبعه لحظياً.' : 'Your order will initially show "Payment verification pending". Once our operations team verifies the receipt, the status updates to processing.'
    },
    {
      q: lang === 'ar' ? 'هل يمكن الاستلام من محطة مترو؟' : 'Can I pick up my order from a Metro station?',
      a: lang === 'ar' ? 'نعم! اختر "استلام من المترو" وحدد محطتك المناسبة وسيتواصل معك مندوبنا لتنسيق موعد ومكان اللقاء داخل المحطة بدقة.' : 'Yes. Choose Metro Station Pickup at checkout and select your station. We will contact you to coordinate the exact date and handover.'
    },
    {
      q: lang === 'ar' ? 'هل يتوفر شحن منزلي لباب البيت؟' : 'Do you offer home delivery?',
      a: lang === 'ar' ? 'نعم، نقوم بالشحن إلى باب البيت في جميع محافظات مصر خلال 2 إلى 4 أيام عمل.' : 'Yes. Select Home Delivery at checkout and enter your complete address. Any applicable delivery fee is calculated before checkout.'
    },
    {
      q: lang === 'ar' ? 'هل يمكن تعديل الطلب بعد إرساله؟' : 'Can I change my order after placing it?',
      a: lang === 'ar' ? 'تواصل مع خدمة عملاء دار M20 فوراً عبر واتساب مع ذكر رقم الطلب، ويمكن إجراء أي تعديل طالما لم تدخل الشحنة مرحلة الشحن.' : 'Contact M20 immediately with your order number. Orders that have not yet entered packaging can be adjusted.'
    },
    {
      q: lang === 'ar' ? 'ماذا أفعل في حال وصول منتج به عيب أو تلف؟' : 'What if I receive a damaged or incorrect product?',
      a: lang === 'ar' ? 'رضاك أولويتنا التامة. تواصل معنا مصحوباً بصورة للشحنة وسنقوم باستبدال المنتج فوراً مجاناً دون أي تكاليف إضافية.' : 'Contact our support team with your order number and photos of the package so we can arrange an immediate replacement.'
    }
  ];

  return (
    <div className="bg-[#F4F3EF] text-[#0B0B0B]">
      <SEO 
        title={t.policies.metaTitle}
        description={lang === 'ar' ? 'تعرف على سياسات شحن دار M20 لكافة محافظات مصر، استلام المترو، الاسترجاع والاستبدال خلال 14 يوماً وطرق الدفع عبر إنستاباي وفودافون كاش.' : 'Learn about M20 shipping across Egypt, Cairo Metro pickup, returns policy within 14 days, InstaPay / Vodafone Cash payments and customer support.'}
        keywords="سياسة الشحن M20, استرجاع عطور M20, دفع انستاباي عطور, M20 perfume shipping Egypt, delivery Cairo"
        schema={faqSchema}
        schemaId="faq-policies-schema"
      />
      
      {/* Header Banner */}
      <section className="bg-slate-50/70 py-12 md:py-16 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-medium block">
            {lang === 'ar' ? 'دليل العميل' : 'Customer guide'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#174F43] tracking-tight uppercase">
            {t.policies.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-light max-w-md mx-auto leading-relaxed">
            {t.policies.subtitle}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-slate-50/70 border border-slate-200 rounded-sm p-3 space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold px-3 py-2 block text-left rtl:text-right">
                {lang === 'ar' ? 'الأقسام' : 'Sections'}
              </span>
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 text-xs uppercase tracking-wider font-medium rounded-sm transition-colors duration-150 text-left rtl:text-right ${
                      isActive
                        ? 'bg-[#174F43] text-white'
                        : 'text-slate-600 hover:bg-white hover:text-[#174F43]'
                    }`}
                  >
                    <IconComponent size={16} strokeWidth={1.5} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-8 text-left rtl:text-right space-y-8">
            
            {/* 1. SHIPPING POLICY */}
            {activeTab === 'shipping' && (
              <div className="border border-slate-200 bg-white rounded-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center space-x-3 rtl:space-x-reverse border-b border-slate-200 pb-3">
                  <Truck className="text-[#174F43]" size={20} strokeWidth={1.5} />
                  <h2 className="text-xl font-serif uppercase text-[#174F43]">
                    {lang === 'ar' ? 'سياسة الشحن والتوصيل' : 'Shipping policy'}
                  </h2>
                </div>

                <div className="space-y-3 bg-slate-50/70 p-4 rounded-sm border border-slate-200">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[#174F43] flex items-center space-x-2 rtl:space-x-reverse">
                    <CheckCircle2 size={14} className="text-[#174F43]" />
                    <span>{lang === 'ar' ? 'التوصيل المنزلي السريع' : 'Home delivery'}</span>
                  </h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    {lang === 'ar' 
                      ? 'توفر دار M20 خدمة الشحن إلى باب المنزل لكافة محافظات جمهورية مصر العربية. تظهر تكاليف التوصيل بوضوح عند إتمام الطلب، وتصل الشحنة خلال 2 إلى 4 أيام عمل.' 
                      : 'M20 offers home delivery across Egypt. Delivery fees are determined by your location and displayed at checkout. Standard delivery arrives within 2 to 4 business days.'}
                  </p>
                </div>

                <div className="space-y-3 bg-slate-50/70 p-4 rounded-sm border border-slate-200">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[#174F43] flex items-center space-x-2 rtl:space-x-reverse">
                    <CheckCircle2 size={14} className="text-[#174F43]" />
                    <span>{lang === 'ar' ? 'الاستلام من محطات المترو' : 'Metro station pickup'}</span>
                  </h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    {lang === 'ar'
                      ? 'يتيح لك خيار استلام المترو استلام طلبك من أي محطة لمترو القاهرة الكبرى دون أي مصاريف شحن إضافية. يتواصل معك فريقنا بمجرد تجهيز العطر للتنسيق.'
                      : 'Metro pickup allows you to receive your order at any Cairo Metro station without additional shipping costs. Our team contacts you once the order is ready to confirm arrival timing.'}
                  </p>
                </div>
              </div>
            )}

            {/* 2. RETURNS & REFUNDS */}
            {activeTab === 'returns' && (
              <div className="border border-slate-200 bg-white rounded-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center space-x-3 rtl:space-x-reverse border-b border-slate-200 pb-3">
                  <RotateCcw className="text-[#174F43]" size={20} strokeWidth={1.5} />
                  <h2 className="text-xl font-serif uppercase text-[#174F43]">
                    {lang === 'ar' ? 'سياسة الاسترجاع والاستبدال' : 'Returns and refunds'}
                  </h2>
                </div>

                <div className="space-y-3 text-xs text-slate-600 font-light leading-relaxed">
                  <p>
                    {lang === 'ar'
                      ? 'يمكن استرجاع أو استبدال الزجاجات غير المفتوحة والتي ما زالت في تغليفها الأصلي المغلق خلال 14 يوماً من تاريخ الاستلام.'
                      : 'Unopened bottles in original sealed packaging may be returned within 14 calendar days of delivery.'}
                  </p>
                  <p>
                    {lang === 'ar'
                      ? 'في حال وصول زجاجة متضررة أو بها خطأ، نرسل بديلاً فورياً دون أي تكلفة إضافية بمجرد إرفاق صورة الشحنة.'
                      : 'If a bottle arrives broken or defective, we will send an immediate replacement at no extra charge upon receiving photographic verification.'}
                  </p>
                </div>
              </div>
            )}

            {/* 3. PAYMENT POLICY */}
            {activeTab === 'payment' && (
              <div className="border border-slate-200 bg-white rounded-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center space-x-3 rtl:space-x-reverse border-b border-slate-200 pb-3">
                  <CreditCard className="text-[#174F43]" size={20} strokeWidth={1.5} />
                  <h2 className="text-xl font-serif uppercase text-[#174F43]">
                    {lang === 'ar' ? 'طرق الدفع المعتمدة' : 'Payment policy'}
                  </h2>
                </div>

                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {lang === 'ar'
                    ? 'نقبل التحويل المباشر عبر فودافون كاش، وإنستاباي (InstaPay IPN)، والدفع عند الاستلام.'
                    : 'We accept direct transfers using Vodafone Cash and InstaPay, as well as Cash on Delivery for select areas.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-sm space-y-1">
                    <span className="text-xs font-semibold text-[#174F43] uppercase tracking-wider block">Vodafone Cash</span>
                    <span className="text-xs text-slate-500">
                      {lang === 'ar' ? 'تحويل من محفظة إلى محفظة فودافون كاش' : 'Wallet to wallet mobile transfer'}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-sm space-y-1">
                    <span className="text-xs font-semibold text-[#174F43] uppercase tracking-wider block">InstaPay (IPN)</span>
                    <span className="text-xs text-slate-500">
                      {lang === 'ar' ? 'تحويل بنكي لحظي عبر عنوان إنستاباي' : 'Instant transfer via IPN account'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PRIVACY POLICY */}
            {activeTab === 'privacy' && (
              <div className="border border-slate-200 bg-white rounded-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center space-x-3 rtl:space-x-reverse border-b border-slate-200 pb-3">
                  <ShieldCheck className="text-[#174F43]" size={20} strokeWidth={1.5} />
                  <h2 className="text-xl font-serif uppercase text-[#174F43]">
                    {lang === 'ar' ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy policy'}
                  </h2>
                </div>

                <div className="space-y-3 text-xs text-slate-600 font-light leading-relaxed">
                  <p>
                    {lang === 'ar'
                      ? 'نجمع فقط المعلومات الضرورية لمعالجة وشحن وتوصيل طلباتك: الاسم، ورقم الهاتف، وعنوان الشحن.'
                      : 'We collect only the information required to process and deliver your orders: your name, contact phone number, and delivery address.'}
                  </p>
                  <p>
                    {lang === 'ar'
                      ? 'لا نطلب أو نخزن أبداً أرقام بطاقاتك السرية أو كلمات مرور الحسابات البنكية أو رموز التحقق (OTP).'
                      : 'We never request or store your private PINs, bank passwords, or OTP codes.'}
                  </p>
                </div>
              </div>
            )}

            {/* 5. TERMS */}
            {activeTab === 'terms' && (
              <div className="border border-slate-200 bg-white rounded-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center space-x-3 rtl:space-x-reverse border-b border-slate-200 pb-3">
                  <FileText className="text-[#174F43]" size={20} strokeWidth={1.5} />
                  <h2 className="text-xl font-serif uppercase text-[#174F43]">
                    {lang === 'ar' ? 'الشروط والأحكام العامة' : 'Terms and conditions'}
                  </h2>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 font-light list-disc pl-5 rtl:pr-5 rtl:pl-0 leading-relaxed">
                  <li>{lang === 'ar' ? 'يتم تأكيد الطلب رسمياً بعد التحقق من إشعار الدفع أو تأكيد هاتف العميل.' : 'Orders are confirmed following payment verification.'}</li>
                  <li>{lang === 'ar' ? 'جميع الأسعار المعروضة بالجنيه المصري (EGP) وشاملة للضرائب المقررة.' : 'All prices are in Egyptian Pounds (EGP).'}</li>
                  <li>{lang === 'ar' ? 'لا يمكن الجمع بين كودين خصم في نفس الطلب ما لم يتم النص صراحة على ذلك.' : 'Promotional discount codes cannot be combined unless explicitly stated.'}</li>
                </ul>
              </div>
            )}

            {/* 6. FAQ */}
            {activeTab === 'faq' && (
              <div className="border border-slate-200 bg-white rounded-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center space-x-3 rtl:space-x-reverse border-b border-slate-200 pb-3">
                  <HelpCircle className="text-[#174F43]" size={20} strokeWidth={1.5} />
                  <h2 className="text-xl font-serif uppercase text-[#174F43]">
                    {lang === 'ar' ? 'الأسئلة الأكثر شيوعاً' : 'Frequently asked questions'}
                  </h2>
                </div>

                <div className="divide-y divide-slate-200">
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="py-3.5">
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between text-left rtl:text-right text-xs uppercase tracking-wider font-semibold text-[#174F43] hover:text-slate-600 transition-colors duration-150"
                        >
                          <span className="pr-4 rtl:pl-4 rtl:pr-0">{faq.q}</span>
                          <ChevronDown size={14} className={`transition-transform duration-150 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <p className="mt-2 text-xs text-slate-600 font-light leading-relaxed bg-slate-50/70 p-3 rounded-sm border border-slate-200">
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
