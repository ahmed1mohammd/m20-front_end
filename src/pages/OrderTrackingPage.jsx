import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { trackOrder, getMyOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Phone
} from 'lucide-react';
import { WhatsAppIcon } from '../components/SocialIcons';
import SEO from '../components/SEO';

const getStatusSteps = (lang) => [
  { key: 'pending', label: lang === 'ar' ? 'تم استلام الطلب' : 'Order Placed', desc: lang === 'ar' ? 'تم تسجيل الطلب وبانتظار المراجعة' : 'Received & awaiting review' },
  { key: 'confirmed', label: lang === 'ar' ? 'تم التأكيد' : 'Confirmed', desc: lang === 'ar' ? 'تم تأكيد واعتماد الطلب من الدار' : 'Order approved by Atelier' },
  { key: 'processing', label: lang === 'ar' ? 'التجهيز والتغليف' : 'Formulating & Packing', desc: lang === 'ar' ? 'تجهيز الزجاجات والتغليف الفاخر' : 'Artisanal bottling & sealed box' },
  { key: 'shipped', label: lang === 'ar' ? 'خرج للتوصيل' : 'Out for Delivery', desc: lang === 'ar' ? 'الشحنة مع مندوب التوصيل' : 'With courier on the way' },
  { key: 'delivered', label: lang === 'ar' ? 'تم التسليم' : 'Delivered', desc: lang === 'ar' ? 'تم استلام العطر بنجاح' : 'Successfully handed over' }
];

const getStepIndex = (status) => {
  switch (status) {
    case 'pending': return 0;
    case 'confirmed': return 1;
    case 'processing': return 2;
    case 'shipped': return 3;
    case 'delivered': return 4;
    case 'cancelled':
    case 'returned':
    case 'returned_from_shipping':
    case 'returned_shipping':
      return -1;
    default: return 0;
  }
};

const OrderTrackingPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('order') || searchParams.get('q') || '';
  
  const { user } = useAuth();
  const { t, lang, formatPrice } = useLanguage();
  const [query, setQuery] = useState(initialQuery);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userOrders, setUserOrders] = useState([]);

  const statusSteps = getStatusSteps(lang);

  const performSearch = async (searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const results = await trackOrder(searchTerm);
      if (Array.isArray(results) && results.length > 0) {
        setOrders(results);
        setSelectedOrder(results[0]);
      } else if (results && results.orderNumber) {
        setOrders([results]);
        setSelectedOrder(results);
      } else {
        setErrorMsg(lang === 'ar' ? 'لم يتم العثور على طلبات مطابقة لهذا المرجع.' : 'No orders found matching this reference.');
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 
        (lang === 'ar' ? 'لم نتمكن من العثور على طلبات مطابقة لرقم الطلب أو الهاتف المدخل.' : 'No orders found matching the provided order number or phone.')
      );
      setOrders([]);
      setSelectedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (user) {
      const fetchMyOrders = async () => {
        try {
          const res = await getMyOrders();
          if (res && res.orders) {
            setUserOrders(res.orders);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchMyOrders();
    }
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(query);
  };

  const currentStep = selectedOrder ? getStepIndex(selectedOrder.orderStatus) : 0;
  const isCancelled = selectedOrder?.orderStatus === 'cancelled';
  const isReturned = selectedOrder?.orderStatus === 'returned_from_shipping' || selectedOrder?.orderStatus === 'returned' || selectedOrder?.orderStatus === 'returned_shipping';

  return (
    <div className="bg-[#F4F3EF] min-h-[70vh] py-12 md:py-16 selection:bg-[#174F43] selection:text-white">
      <SEO 
        title={lang === 'ar' ? 'تتبع حالة طلبك • دار M20 للعطور' : 'Track Your Order • M20 Fine Fragrances'}
        description={lang === 'ar' ? 'تابع مسار تجهيز وتغليف وشحن طلب عطور M20 الفاخرة لحظة بلحظة.' : 'Track the formulation, packing, and courier delivery status of your M20 luxury perfume order in real-time.'}
        keywords="تتبع طلب M20, تتبع شحنة عطور, track M20 perfume order, order status Cairo"
      />
      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-medium block">
            {lang === 'ar' ? 'خدمة عملاء M20' : 'M20 CLIENT SERVICES'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif uppercase text-[#174F43] tracking-tight">
            {t.tracking.title}
          </h1>
          <p className="text-xs sm:text-sm font-light text-slate-600 max-w-md mx-auto leading-relaxed">
            {t.tracking.subtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-3.5 text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'أدخل رقم الطلب (مثال: M20-...) أو رقم الهاتف' : 'Enter Order # (e.g. M20-...) or Phone number'}
                className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-3 text-xs border border-slate-300 rounded-sm focus:border-[#174F43] outline-none transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#174F43] text-white px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-[#0F3830] disabled:bg-slate-400 transition-colors rounded-sm flex items-center space-x-2 rtl:space-x-reverse flex-shrink-0"
            >
              <span>{loading ? (lang === 'ar' ? 'جاري البحث...' : 'TRACKING...') : (lang === 'ar' ? 'تتبع' : 'TRACK')}</span>
              <ArrowRight size={14} className="rtl:rotate-180" />
            </button>
          </form>

          {errorMsg && (
            <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-sm text-left rtl:text-right">
              {errorMsg}
            </div>
          )}
        </div>

        {/* If Multiple Orders Found */}
        {orders.length > 1 && (
          <div className="mb-8 text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-2">
              Found {orders.length} Orders for this reference:
            </span>
            <div className="flex flex-wrap gap-2">
              {orders.map((ord) => (
                <button
                  key={ord._id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`px-3 py-2 text-xs rounded-sm border transition-colors ${
                    selectedOrder?._id === ord._id
                      ? 'bg-[#174F43] text-white border-[#174F43]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span className="font-semibold">{ord.orderNumber}</span> • EGP {ord.total} ({new Date(ord.createdAt).toLocaleDateString()})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Order Showcase */}
        {selectedOrder && (
          <div className="border border-slate-200 rounded-sm bg-[#FAFAFA] p-6 sm:p-10 text-left space-y-10 shadow-sm animate-fade-in">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-6">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-medium block">
                  ORDER REFERENCE
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-[#174F43] font-semibold tracking-tight">
                  {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-500 font-light">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-sm ${
                  isCancelled 
                    ? 'bg-rose-100 text-rose-800'
                    : isReturned
                    ? 'bg-amber-100 text-amber-800'
                    : selectedOrder.orderStatus === 'delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-[#174F43] text-white'
                }`}>
                  {lang === 'ar'
                    ? (isCancelled ? 'تم الإلغاء' : isReturned ? 'مرتجع من الشحن' : selectedOrder.orderStatus === 'delivered' ? 'تم التسليم' : 'قيد المعالجة')
                    : `Status: ${(selectedOrder.orderStatus || '').replace('_', ' ').toUpperCase()}`}
                </span>
                <span className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider bg-white border border-slate-200 text-slate-700 rounded-sm">
                  Payment: {selectedOrder.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Visual Timeline or Cancelled / Returned Notices */}
            {isReturned ? (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-sm">
                {lang === 'ar' 
                  ? 'تم استرجاع الشحنة من قِبل شركة الشحن. يرجى التواصل مع خدمة العملاء لمزيد من التفاصيل أو إعادة الشحن.' 
                  : 'This order was returned by the courier. Please contact our client concierge for further assistance.'}
              </div>
            ) : isCancelled ? (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-sm">
                {lang === 'ar' ? 'تم إلغاء هذا الطلب. إذا كان لديك استفسار يرجى التواصل مع خدمة العملاء.' : 'This order was cancelled. If you believe this is in error, please reach out to our concierge.'}
              </div>
            ) : (
              <div className="py-2">
                <div className="relative">
                  {/* Progress Bar Line */}
                  <div className="hidden md:block absolute top-5 left-8 right-8 rtl:left-8 rtl:right-8 h-0.5 bg-slate-200 -z-0">
                    <div 
                      className="h-full bg-[#174F43] transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, (currentStep / (statusSteps.length - 1)) * 100))}%` }}
                    ></div>
                  </div>

                  {/* Milestones */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2 relative z-10">
                    {statusSteps.map((step, idx) => {
                      const isPast = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div key={step.key} className="flex md:flex-col items-center md:text-center space-x-3 md:space-x-0 rtl:space-x-reverse">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 flex-shrink-0 ${
                            isCurrent
                              ? 'bg-[#174F43] text-white border-[#174F43] ring-4 ring-slate-200'
                              : isPast
                              ? 'bg-[#174F43] text-white border-[#174F43]'
                              : 'bg-white text-slate-300 border-slate-300'
                          }`}>
                            {isPast ? <CheckCircle2 size={18} /> : <Clock size={16} />}
                          </div>

                          <div className="md:mt-3 text-left md:text-center rtl:text-right md:rtl:text-center">
                            <h4 className={`text-xs font-semibold uppercase tracking-wider ${
                              isPast ? 'text-[#174F43]' : 'text-slate-400'
                            }`}>
                              {step.label}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-light mt-0.5">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 pt-8">
              
              {/* Order Items */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#174F43] flex items-center space-x-2 rtl:space-x-reverse">
                  <ShoppingBag size={15} />
                  <span>{t.tracking.items}</span>
                </h4>

                <div className="space-y-3 divide-y divide-slate-200 bg-white p-4 rounded-sm border border-slate-200">
                  {selectedOrder.items?.map((item, idx) => {
                    const itemImg = item.product?.mainImage?.url || item.product?.images?.[0]?.url || '/img/product.png';
                    return (
                      <div key={idx} className={`flex items-center justify-between gap-3 ${idx > 0 ? 'pt-3' : ''}`}>
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <img
                            src={itemImg}
                            alt={item.productName || 'Fragrance'}
                            className="w-12 h-12 object-contain rounded-sm border border-slate-200 bg-white p-1 shrink-0"
                            onError={(e) => { e.target.onerror = null; e.target.src = '/img/product.png'; }}
                          />
                          <div className="space-y-0.5">
                            <p className="font-serif font-semibold text-xs text-[#174F43] uppercase">
                              {item.productName || item.product?.name || 'M20 Fragrance'}
                            </p>
                            <p className="text-[11px] text-slate-500 font-light">
                              {lang === 'ar' ? `الحجم: ${item.size} • الكمية: ${item.quantity}` : `Size: ${item.size} • Qty: ${item.quantity}`}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-900 shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}

                  <div className="pt-3 space-y-1.5 text-xs text-slate-600 font-light border-t border-slate-200">
                    <div className="flex justify-between">
                      <span>{t.checkout.subtotal}:</span>
                      <span>{formatPrice(selectedOrder.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.checkout.shippingFee} ({selectedOrder.deliveryMethod === 'metro_pickup' ? t.checkout.metroPickup : t.checkout.homeDelivery}):</span>
                      <span>{formatPrice((selectedOrder.deliveryMethod === 'metro_pickup' ? selectedOrder.metroPickupFee : selectedOrder.shipping) || 0)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>{t.checkout.discount}:</span>
                        <span>-{formatPrice(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-serif font-semibold text-[#174F43] pt-2 border-t border-slate-200">
                      <span>{t.checkout.totalAmount}:</span>
                      <span>{formatPrice(selectedOrder.total || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery & Concierge Info */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#174F43] flex items-center space-x-2 rtl:space-x-reverse">
                  <Truck size={15} />
                  <span>{t.checkout.deliveryMethod}</span>
                </h4>

                <div className="bg-white p-4 rounded-sm border border-slate-200 space-y-3 text-xs text-slate-600">
                  {selectedOrder.deliveryMethod === 'metro_pickup' ? (
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                        {t.checkout.metroPickup}
                      </span>
                      <p className="font-semibold text-slate-900">
                        {lang === 'ar'
                          ? `${selectedOrder.metroPickup?.stationNameAr || ''} (${selectedOrder.metroPickup?.stationNameEn || ''})`
                          : `${selectedOrder.metroPickup?.stationNameEn || ''} (${selectedOrder.metroPickup?.stationNameAr || ''})`}
                      </p>
                      <p className="text-slate-500 mt-1">
                        {lang === 'ar' ? 'الخط:' : 'Line:'} {selectedOrder.metroPickup?.line || 'Standard'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                        {t.checkout.homeDelivery}
                      </span>
                      <p className="font-semibold text-slate-900">
                        {selectedOrder.shippingAddress?.governorate}, {selectedOrder.shippingAddress?.city}
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        {selectedOrder.shippingAddress?.street}, {t.checkout.buildingNumber} {selectedOrder.shippingAddress?.buildingNumber}
                        {selectedOrder.shippingAddress?.apartment && `, ${t.checkout.apartment} ${selectedOrder.shippingAddress?.apartment}`}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center space-x-2 rtl:space-x-reverse text-slate-500">
                    <Phone size={14} className="text-slate-400" />
                    <span>{lang === 'ar' ? 'هاتف المستلم:' : 'Recipient Contact:'} {selectedOrder.customerPhone || 'On File'}</span>
                  </div>
                </div>

                {/* WhatsApp Support Box */}
                <div className="bg-[#174F43] text-white p-4 rounded-sm space-y-2">
                  <div className="font-serif text-xs uppercase font-medium">
                    <span>{lang === 'ar' ? 'هل تحتاج مساعدة سريعة بخصوص هذا الطلب؟' : 'Need Fast Assistance with this Order?'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                    {lang === 'ar' ? 'فريق خدمة عملاء دار M20 متاح عبر واتساب يومياً للإجابة على استفساراتك أو تعديل بيانات الشحن.' : 'Our atelier team is available on WhatsApp daily to answer questions or update shipping instructions.'}
                  </p>
                  <a
                    href={`https://wa.me/201132687324?text=${encodeURIComponent(lang === 'ar' ? `مرحباً دار M20، أود الاستفسار عن طلبي رقم ${selectedOrder.orderNumber}` : `Hello M20, I would like to inquire about my order ${selectedOrder.orderNumber}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white text-[#174F43] px-4 py-2 text-xs uppercase font-semibold tracking-wider hover:bg-slate-200 transition-colors rounded-sm mt-1"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                    <span>{lang === 'ar' ? 'تواصل مع خدمة العملاء' : 'Contact Concierge'}</span>
                  </a>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* If user logged in and has past orders */}
        {user && userOrders.length > 0 && !selectedOrder && (
          <div className="mt-12 text-left border-t border-slate-200 pt-10">
            <h3 className="text-sm font-serif uppercase tracking-wider text-[#174F43] mb-4">
              Your Recent Orders
            </h3>
            <div className="space-y-3">
              {userOrders.map((ord) => (
                <div 
                  key={ord._id}
                  className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border border-slate-200 rounded-sm bg-white hover:border-slate-400 transition-colors gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-[#174F43]">{ord.orderNumber}</span>
                    <p className="text-xs text-slate-500">
                      {new Date(ord.createdAt).toLocaleDateString()} • {ord.items?.length || 1} item(s) • EGP {ord.total}
                    </p>
                  </div>
                  <button
                    onClick={() => { setSelectedOrder(ord); setQuery(ord.orderNumber); }}
                    className="inline-flex items-center space-x-1.5 text-xs text-[#174F43] font-semibold uppercase tracking-wider hover:underline"
                  >
                    <span>View Status</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderTrackingPage;
