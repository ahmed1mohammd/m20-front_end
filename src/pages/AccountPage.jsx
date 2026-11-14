import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getMyOrders } from '../services/api';
import { User, Phone, Mail, Package, LogOut, ArrowRight, Clock, Award } from 'lucide-react';
import SEO from '../components/SEO';

const AccountPage = () => {
  const { user, logout, openAuthModal, isAuthenticated } = useAuth();
  const { t, lang, formatPrice } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getMyOrders();
        setOrders(res.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="bg-[#F4F3EF] min-h-[60vh] flex flex-col items-center justify-center py-16 px-6 text-center">
        <SEO title={lang === 'ar' ? 'حساب العميل • دار M20' : 'Customer Account • M20'} noIndex={true} />
        <div className="max-w-md space-y-4">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-[#174F43]">
            <User size={24} />
          </div>
          <h2 className="text-2xl font-serif uppercase text-[#174F43]">{lang === 'ar' ? 'حساب دار M20' : 'M20 Maison Account'}</h2>
          <p className="text-xs text-slate-500 font-light leading-relaxed">
            {lang === 'ar' ? 'تسجيل الدخول اختياري. يمكنك إنشاء حساب لمتابعة طلباتك السابقة وعناوين الشحن ومزايا الأعضاء.' : 'Signing in is optional. Create an account or sign in to view your bespoke orders, addresses, and member privileges.'}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => openAuthModal('login')}
              className="bg-[#174F43] text-white px-6 py-3 text-xs uppercase font-medium tracking-widest hover:bg-[#0F3830] transition-colors rounded-sm"
            >
              {t.nav.signIn}
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="border border-[#174F43] text-[#174F43] px-6 py-3 text-xs uppercase font-medium tracking-widest hover:bg-slate-50 transition-colors rounded-sm"
            >
              {lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F3EF] min-h-[70vh] py-12 md:py-16 selection:bg-[#174F43] selection:text-white">
      <SEO title={lang === 'ar' ? 'حسابي وطلباتي • دار M20' : 'My Account & Orders • M20'} noIndex={true} />
      <div className="max-w-[1100px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-6 mb-10 text-left rtl:text-right">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-medium block">
              {t.nav.myAccount}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif uppercase text-[#174F43] tracking-tight">
              {lang === 'ar' ? `أهلاً بك، ${user.name}` : `Welcome, ${user.name}`}
            </h1>
          </div>

          <button
            onClick={() => { logout(); navigate('/'); }}
            className="inline-flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-500 hover:text-rose-700 uppercase tracking-wider font-medium transition-colors"
          >
            <LogOut size={15} />
            <span>{t.nav.logout}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left rtl:text-right">
          
          {/* Profile Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-slate-200 bg-[#FAFAFA] p-6 rounded-sm space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#174F43] border-b border-slate-200 pb-3">
                {lang === 'ar' ? 'ملف العضوية' : 'Member Profile'}
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center space-x-3 rtl:space-x-reverse text-slate-700">
                  <User size={15} className="text-slate-400 flex-shrink-0" />
                  <span className="font-medium">{user.name}</span>
                </div>

                {user.phone && (
                  <div className="flex items-center space-x-3 rtl:space-x-reverse text-slate-700">
                    <Phone size={15} className="text-slate-400 flex-shrink-0" />
                    <span dir="ltr">{user.phone}</span>
                  </div>
                )}

                {user.email && (
                  <div className="flex items-center justify-between gap-2 text-slate-700">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-0">
                      <Mail size={15} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate" dir="ltr">{user.email}</span>
                    </div>
                    {user.isEmailVerified && (
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {lang === 'ar' ? 'موثّق' : 'Verified'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {user.isFirst100 && (
                <div className="pt-3 border-t border-slate-200 flex items-center space-x-2 rtl:space-x-reverse text-xs text-amber-800 bg-amber-50 p-2.5 rounded-sm">
                  <Award size={16} className="text-amber-600 flex-shrink-0" />
                  <span className="font-semibold uppercase tracking-wider text-[10px]">
                    {lang === 'ar' ? `عضو مؤسس (رتبة #${user.foundingRank || 'VIP'})` : `Founding Patron (Rank #${user.foundingRank || 'VIP'})`}
                  </span>
                </div>
              )}
            </div>

            <div className="border border-slate-200 p-6 rounded-sm space-y-3 bg-white">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#174F43]">
                {lang === 'ar' ? 'هل تحتاج إلى مساعدة؟' : 'Need Help?'}
              </h4>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                {lang === 'ar' ? 'يمكنك تتبع أي طلب باستخدام رقم مرجع الطلب أو التواصل المباشر مع خدمة العملاء.' : 'Track any order with your order reference number or contact our WhatsApp concierge.'}
              </p>
              <Link
                to="/track-order"
                className="inline-flex items-center space-x-2 rtl:space-x-reverse text-xs font-semibold text-[#174F43] uppercase tracking-wider hover:underline"
              >
                <span>{t.nav.trackOrder}</span>
                <ArrowRight size={13} className="rtl:rotate-180" />
              </Link>
            </div>
          </div>

          {/* Orders History (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#174F43] flex items-center space-x-2 rtl:space-x-reverse">
              <Package size={16} />
              <span>{lang === 'ar' ? `طلباتك السابقة (${orders.length})` : `Your Orders (${orders.length})`}</span>
            </h3>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400 uppercase tracking-widest">
                {lang === 'ar' ? 'جاري تحميل الطلبات...' : 'Loading orders...'}
              </div>
            ) : orders.length === 0 ? (
              <div className="border border-slate-200 p-8 rounded-sm text-center space-y-3 bg-[#FAFAFA]">
                <p className="text-xs text-slate-500 font-light">
                  {lang === 'ar' ? 'لم تقم بتسجيل أي طلبات عبر هذا الحساب حتى الآن.' : 'You have not placed any orders with this account yet.'}
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#174F43] text-white px-5 py-2.5 text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-[#0F3830] transition-colors"
                >
                  <span>{t.common.exploreCollection}</span>
                  <ArrowRight size={13} className="rtl:rotate-180" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div 
                    key={ord._id}
                    className="border border-slate-200 bg-white p-5 rounded-sm space-y-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3 text-xs">
                      <div>
                        <span className="font-serif font-bold text-sm text-[#174F43] block">
                          {ord.orderNumber}
                        </span>
                        <span className="text-slate-400 font-light text-[11px]">
                          {new Date(ord.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-800 rounded-sm">
                          {ord.orderStatus}
                        </span>
                        <Link
                          to={`/track-order?order=${ord.orderNumber}`}
                          className="inline-flex items-center space-x-1 rtl:space-x-reverse bg-[#174F43] text-white px-3 py-1 text-[11px] font-medium uppercase tracking-wider rounded-sm hover:bg-[#0F3830] transition-colors"
                        >
                          <span>{lang === 'ar' ? 'تتبع' : 'Track'}</span>
                          <ArrowRight size={12} className="rtl:rotate-180" />
                        </Link>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2 text-xs">
                      {ord.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-slate-600 font-light">
                          <span>{item.productName || item.product?.name || 'M20 Fragrance'} ({item.size}) x {item.quantity}</span>
                          <span className="font-medium text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 font-light">{lang === 'ar' ? 'الإجمالي (شاملاً الشحن):' : 'Total (incl. shipping):'}</span>
                      <span className="font-serif font-semibold text-sm text-[#174F43]">
                        {formatPrice(ord.total || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AccountPage;
