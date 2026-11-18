import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { METRO_STATIONS } from '../data/metroStations';
import { EGYPT_GOVERNORATES, getGovernorateRate } from '../data/egyptGovernorates';
import { getShippingQuote, createOrder, getPublicSettings, uploadPaymentProof, validateCouponCode } from '../services/api';
import { 
  Train, Home, CheckCircle2, ChevronDown, Search, ArrowLeft, 
  Info, AlertCircle, Phone, Smartphone, Upload, X, Copy, Check, ArrowRight, Mail, Banknote, RefreshCw, Tag
} from 'lucide-react';
import SEO from '../components/SEO';
import { trackInitiateCheckout, trackPurchase } from '../utils/tracking';
import { isPreOrder } from '../utils/preorder';
import { getStoredAttribution, getMetaCookies } from '../utils/attribution';

const DEFAULT_PAYMENT_CONFIG = {
  cod: { 
    labelEn: 'Cash on Delivery (COD)', 
    labelAr: 'الدفع عند الاستلام (COD)',
    feePercent: 0, 
    icon: 'banknote', 
    instructionsEn: 'Pay securely in cash upon receiving and inspecting your order at your doorstep.',
    instructionsAr: 'ادفع نقداً بكل أمان عند استلام ومعاينة شحنتك من مندوب التوصيل.' 
  },
  vodafone_cash: { 
    labelEn: 'Vodafone Cash & Wallets', 
    labelAr: 'فودافون كاش والمحافظ الإلكترونية',
    number: '01012345678', 
    feePercent: 0, 
    icon: 'phone', 
    instructionsEn: 'Please transfer the exact order amount to our official Vodafone Cash wallet and upload your transfer screenshot below.',
    instructionsAr: 'يرجى تحويل إجمالي المبلغ على محفظة فودافون كاش الرسمية وإرفاق صورة أو لقطة شاشة الإشعار.' 
  },
  instapay: { 
    labelEn: 'InstaPay (IPN)', 
    labelAr: 'إنستاباي (InstaPay)',
    account: 'm20.perfumes@instapay', 
    feePercent: 0, 
    icon: 'smartphone', 
    instructionsEn: 'Please transfer the exact amount via InstaPay to the address below and upload your transfer confirmation screenshot.',
    instructionsAr: 'يرجى تحويل المبلغ عبر إنستاباي إلى العنوان أدناه وإرفاق لقطة شاشة للتأكيد.' 
  },
};

const CheckoutPage = () => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { t, lang, formatPrice } = useLanguage();
  const navigate = useNavigate();

  const [deliveryMethod, setDeliveryMethod] = useState('home_delivery');

  // Dynamic Store Settings
  const [publicSettings, setPublicSettings] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState(DEFAULT_PAYMENT_CONFIG);

  // Metro Station Pickup
  const [selectedMetroStation, setSelectedMetroStation] = useState(null);
  const [metroSearchQuery, setMetroSearchQuery] = useState('');
  const [isMetroDropdownOpen, setIsMetroDropdownOpen] = useState(false);
  const metroDropdownRef = useRef(null);

  // Home Delivery
  const [governorate, setGovernorate] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [floor, setFloor] = useState('');
  const [apartment, setApartment] = useState('');
  const [landmark, setLandmark] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Customer Info
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerPhone2, setCustomerPhone2] = useState('');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerName, setCustomerName] = useState(user?.name || '');

  useEffect(() => {
    if (user) {
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
      if (!customerEmail && user.email) setCustomerEmail(user.email);
      if (!customerName && user.name) setCustomerName(user.name);
    }
  }, [user]);

  // Load public settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getPublicSettings();
        if (settings) {
          setPublicSettings(settings);
          setPaymentConfig({
            cod: { 
              labelEn: 'Cash on Delivery (COD)', 
              labelAr: 'الدفع عند الاستلام (COD)',
              feePercent: 0, 
              icon: 'banknote', 
              instructionsEn: 'Pay securely in cash upon receiving and inspecting your order at your doorstep.',
              instructionsAr: 'ادفع نقداً بكل أمان عند استلام ومعاينة شحنتك من مندوب التوصيل.' 
            },
            vodafone_cash: {
              labelEn: 'Vodafone Cash',
              labelAr: 'فودافون كاش',
              number: settings.payments?.vodafoneCash?.number || '01012345678',
              feePercent: 0,
              icon: 'phone',
              instructionsEn: settings.payments?.vodafoneCash?.instructions || 'Please transfer the exact order amount to our Vodafone Cash wallet and upload your receipt screenshot.',
              instructionsAr: settings.payments?.vodafoneCash?.instructions || 'يرجى تحويل إجمالي المبلغ على محفظة فودافون كاش الرسمية وإرفاق صورة الإشعار.'
            },
            instapay: {
              labelEn: 'InstaPay (IPN)',
              labelAr: 'إنستاباي (InstaPay)',
              account: settings.payments?.instaPay?.account || 'm20.perfumes@instapay',
              feePercent: 0,
              icon: 'smartphone',
              instructionsEn: settings.payments?.instaPay?.instructions || 'Please transfer the exact amount via InstaPay to the address below and upload your screenshot.',
              instructionsAr: settings.payments?.instaPay?.instructions || 'يرجى تحويل المبلغ عبر إنستاباي وإرفاق لقطة شاشة للتأكيد.'
            }
          });
        }
      } catch (e) {
        console.error('Failed to load store settings:', e);
      }
    };
    fetchSettings();
  }, []);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [sendReceiptViaWhatsapp, setSendReceiptViaWhatsapp] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const currentPaymentConfig = paymentConfig[paymentMethod];

  // Financials & Shipping (Strict Whole Numbers - Origin: Giza)
  const [shippingFee, setShippingFee] = useState(65);
  const [metroPickupFee, setMetroPickupFee] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Submit State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const filteredMetroStations = METRO_STATIONS.filter((st) => {
    const q = metroSearchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      st.nameEn.toLowerCase().includes(q) ||
      st.nameAr.toLowerCase().includes(q) ||
      st.line.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (metroDropdownRef.current && !metroDropdownRef.current.contains(e.target)) {
        setIsMetroDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track InitiateCheckout when visiting checkout
  useEffect(() => {
    if (cart && cart.length > 0) {
      trackInitiateCheckout({
        items: cart.map(i => ({
          productId: i.product?._id || i.product?.id,
          name: i.product?.name,
          price: i.variant?.price || i.price,
          quantity: i.quantity
        })),
        total: cartSubtotal
      });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchQuote = async () => {
      setIsCalculatingShipping(true);
      try {
        const quote = await getShippingQuote({
          deliveryMethod,
          governorate,
          city,
          subtotal: cartSubtotal,
          couponCode: appliedPromo?.coupon?.code || appliedPromo?.code || undefined
        });

        if (isMounted && quote) {
          setShippingFee(Math.round(Number(quote.shippingFee || 0)));
          setMetroPickupFee(Math.round(Number(quote.metroPickupFee || 0)));
        } else if (isMounted) {
          if (deliveryMethod === 'metro_pickup') {
            setShippingFee(0);
            setMetroPickupFee(Math.round(Number(publicSettings?.shipping?.metroPickupCustomerFee || 0)));
          } else {
            const fallbackRate = getGovernorateRate(governorate, publicSettings?.shipping?.governorateRates);
            setShippingFee(fallbackRate);
            setMetroPickupFee(0);
          }
        }
      } catch (err) {
        if (isMounted) {
          if (deliveryMethod === 'metro_pickup') {
            setShippingFee(0);
            setMetroPickupFee(Math.round(Number(publicSettings?.shipping?.metroPickupCustomerFee || 0)));
          } else {
            const fallbackRate = getGovernorateRate(governorate, publicSettings?.shipping?.governorateRates);
            setShippingFee(fallbackRate);
            setMetroPickupFee(0);
          }
        }
      } finally {
        if (isMounted) setIsCalculatingShipping(false);
      }
    };

    fetchQuote();

    return () => {
      isMounted = false;
    };
  }, [deliveryMethod, governorate, city, cartSubtotal, appliedPromo?.coupon?.code]);

  // Direct Shipping Promo & Financial Calculations (Strict Integers)
  const isFreeShippingPromo = Boolean(
    appliedPromo && (appliedPromo.isShippingDiscount || appliedPromo.discountType === 'FREE_SHIPPING')
  );
  // When free shipping promo is applied: deduct 100% of selected governorate's fee directly (net = 0 EGP)
  const shippingDiscount = (deliveryMethod === 'home_delivery' && isFreeShippingPromo) ? shippingFee : 0;
  const effectiveShippingFee = deliveryMethod === 'home_delivery' ? Math.max(0, shippingFee - shippingDiscount) : 0;
  const activeFee = deliveryMethod === 'metro_pickup' ? metroPickupFee : effectiveShippingFee;
  // Product discount: do NOT alter product prices when free shipping promo is applied
  const productDiscount = (appliedPromo && !isFreeShippingPromo) ? Math.round(Number(appliedPromo.discountAmount || 0)) : 0;
  const finalTotal = Math.max(0, cartSubtotal - productDiscount + activeFee);

  const handleApplyPromo = async (e) => {
    if (e) e.preventDefault();
    const cleanCode = (promoCodeInput || '').trim().toUpperCase();
    if (!cleanCode) return;

    setIsApplyingPromo(true);
    setPromoError('');
    setPromoSuccess('');

    try {
      const res = await validateCouponCode(cleanCode, cartSubtotal, shippingFee);
      if (res && res.coupon) {
        setAppliedPromo(res);
        const isShipDisc = res.isShippingDiscount || res.discountType === 'FREE_SHIPPING';
        setPromoSuccess(
          lang === 'ar'
            ? (isShipDisc
                ? `تم تطبيق كود الشحن المجاني بنجاح (${res.coupon.code})`
                : `تم تطبيق كود الخصم بنجاح (${res.coupon.code})`)
            : (isShipDisc
                ? `Free shipping promo code (${res.coupon.code}) applied successfully`
                : `Promo code (${res.coupon.code}) applied successfully`)
        );
      }
    } catch (err) {
      setAppliedPromo(null);
      const msg = err.response?.data?.message || (lang === 'ar' ? 'كود الخصم غير صالح أو منتهي الصلاحية' : 'Invalid or expired promo code');
      setPromoError(msg);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoError('');
    setPromoSuccess('');
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProof(true);
    setErrors((prev) => ({ ...prev, paymentScreenshot: null }));
    try {
      const res = await uploadPaymentProof(file);
      const url = res?.secure_url || res?.url;
      if (!url) {
        throw new Error('Missing receipt URL');
      }
      setPaymentScreenshot(url);
    } catch (err) {
      console.error('Receipt upload failed:', err);
      setErrors((prev) => ({
        ...prev,
        paymentScreenshot:
          err.response?.data?.message ||
          (lang === 'ar'
            ? 'تعذر رفع صورة الإيصال، يرجى التأكد من حجم ونوع الصورة والمحاولة مجدداً.'
            : 'Failed to upload receipt image. Please check image type/size and try again.')
      }));
    } finally {
      setUploadingProof(false);
      e.target.value = '';
    }
  };

  const normalizeDigits = (val) => (val || '').toString().replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

  const validateForm = () => {
    const newErrors = {};

    if (!customerName || !customerName.trim()) {
      newErrors.customerName = t.checkout.errorName;
    }

    const cleanPhone = normalizeDigits(customerPhone).trim().replace(/[\s-]/g, '');
    const phoneRegex = /^(\+?20|0020|0)?1[0125]\d{8}$|^(\+?\d{8,15})$/;
    if (!cleanPhone) {
      newErrors.customerPhone = t.checkout.errorPhone;
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.customerPhone = lang === 'ar' 
        ? 'يرجى إدخال رقم هاتف محمول صحيح (مثال: 01012345678)' 
        : 'Please enter a valid mobile number (e.g. 01012345678)';
    }

    if (deliveryMethod === 'metro_pickup') {
      if (!selectedMetroStation) {
        newErrors.metroStation = t.checkout.errorMetro;
      }
    } else {
      if (!governorate || !governorate.trim()) {
        newErrors.governorate = t.checkout.errorGov;
      }
      if (!city || !city.trim()) {
        newErrors.city = t.checkout.errorCity;
      }
      if (!street || !street.trim()) {
        newErrors.street = t.checkout.errorStreet;
      }
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = t.checkout.errorPayment;
    } else if (paymentMethod !== 'cod' && !paymentScreenshot && !sendReceiptViaWhatsapp) {
      newErrors.paymentScreenshot = t.checkout.errorReceipt;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const summaryMsg = lang === 'ar'
        ? 'يرجى استكمال الحقول المطلوبة المحددة بالأعلى لتأكيد طلبك.'
        : 'Please complete the required fields highlighted above to confirm your order.';
      setErrors((prev) => ({ ...prev, submit: summaryMsg }));
      setTimeout(() => {
        const firstErrorEl = document.querySelector('.border-\\[\\#b91c1c\\], .border-red-500, [aria-invalid="true"]');
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (firstErrorEl.focus) firstErrorEl.focus();
        }
      }, 60);
      return;
    }

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, submit: null }));

    const orderPayload = {
      items: cart.map((item) => ({
        productId: item.product._id || item.product.id,
        variantSKU: item.variant?.SKU || 'SKU-DEFAULT',
        quantity: item.quantity,
        size: item.variant?.size || '50ml',
        price: item.variant?.price || 0
      })),
      deliveryMethod,
      customerPhone: normalizeDigits(customerPhone).trim().replace(/[\s-]/g, ''),
      customerPhone2: customerPhone2.trim() ? normalizeDigits(customerPhone2).trim().replace(/[\s-]/g, '') : null,
      customerEmail: customerEmail.trim() || null,
      customerName: customerName.trim(),
      paymentMethod,
      paymentScreenshot: paymentMethod === 'cod' ? null : paymentScreenshot,
      paymentProofUrl: paymentMethod === 'cod' ? null : paymentScreenshot,
      metroPickup:
        deliveryMethod === 'metro_pickup' && selectedMetroStation
          ? {
              stationId: selectedMetroStation.id,
              stationNameEn: selectedMetroStation.nameEn,
              stationNameAr: selectedMetroStation.nameAr,
              line: selectedMetroStation.line,
              pickupNote: t.checkout.metroPickupNotice,
              fee: metroPickupFee
            }
          : null,
      shippingAddress:
        deliveryMethod === 'home_delivery'
          ? {
              governorate: (governorate || '').trim(),
              city: (city || '').trim(),
              street: (street || '').trim(),
              buildingNumber: (buildingNumber || '-').trim(),
              floor: (floor || '').trim(),
              apartment: (apartment || '').trim(),
              landmark: (landmark || '').trim(),
              deliveryNotes: (deliveryNotes || '').trim()
            }
          : {},
      couponCode: appliedPromo ? (appliedPromo.coupon?.code || appliedPromo.code) : null,
      attribution: getStoredAttribution(),
      fbp: getMetaCookies().fbp,
      fbc: getMetaCookies().fbc
    };

    try {
      const res = await createOrder(orderPayload);
      if (res && (res.orderNumber || res._id)) {
        const orderNum = res.orderNumber || res._id;
        trackPurchase({
          orderNumber: orderNum,
          total: Math.round(Number(res.total || res.totalAmount || finalTotal || 0)),
          items: (res.items || cart).map(i => ({
            productId: i.productId || i.product?._id || i.product?.id,
            name: i.productName || i.name || i.product?.name,
            price: Math.round(Number(i.price || 0)),
            quantity: Number(i.quantity || 1)
          })),
          eventId: `order_${orderNum}`
        });

        setOrderSuccess(res);
        clearCart();
      } else {
        throw new Error('Order creation did not return a valid order');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        (lang === 'ar'
          ? 'تعذر إتمام الطلب، يرجى المحاولة مرة أخرى أو التواصل مع خدمة العملاء.'
          : 'Failed to place order. Please try again or contact support.');
      setErrors((prev) => ({ ...prev, submit: errorMsg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-16 text-center space-y-4">
        <SEO title={`${t.checkout.pageTitle} • M20`} noIndex={true} />
        <h2 className="text-2xl font-serif text-[#174F43]">{t.checkout.emptyBagTitle}</h2>
        <p className="text-slate-600 text-xs">{t.checkout.emptyBagDesc}</p>
        <div>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center bg-[#174F43] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-[#0F3830] transition-colors duration-150 h-10 rounded-sm"
          >
            {t.checkout.exploreCatalog}
          </Link>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center space-y-5">
        <SEO title={`${t.checkout.orderConfirmedBadge} • M20`} noIndex={true} />
        <div className="w-14 h-14 bg-white text-[#15803d] border border-slate-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 size={28} strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold block">{t.checkout.orderConfirmedBadge}</span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#174F43] uppercase">{t.checkout.orderConfirmedTitle}</h2>
        </div>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto font-light">
          {t.checkout.orderRefIs} <strong className="font-semibold text-[#174F43]">{orderSuccess.orderNumber}</strong>. {t.checkout.orderPrepDesc}
        </p>
        {deliveryMethod === 'metro_pickup' && (
          <div className="bg-slate-50/80 p-4 border border-slate-200 rounded-sm text-left rtl:text-right text-xs space-y-1.5 text-[#174F43]">
            <p className="font-semibold uppercase tracking-wider text-[11px]">{t.checkout.metroPickup}</p>
            <p><span className="text-slate-500">{lang === 'ar' ? 'المحطة:' : 'Station:'}</span> {lang === 'ar' ? (selectedMetroStation?.nameAr || selectedMetroStation?.nameEn) : (selectedMetroStation?.nameEn || selectedMetroStation?.nameAr)}</p>
            <p><span className="text-slate-500">{lang === 'ar' ? 'الخط:' : 'Line:'}</span> {selectedMetroStation?.line}</p>
            <p className="text-slate-600 pt-1 border-t border-slate-200">
              {t.checkout.metroPickupNotice}
            </p>
          </div>
        )}
        <div className="pt-3 flex flex-col sm:flex-row justify-center gap-3">
          {orderSuccess.paymentMethod !== 'cod' && (
            <a
              href={`https://wa.me/201132687324?text=${encodeURIComponent(
                lang === 'ar'
                  ? `مرحباً، قمت بتأكيد طلبي في دار M20 برقم (${orderSuccess.orderNumber})، وإجمالي المبلغ ${orderSuccess.total || ''} ج.م ومرفق إشعار التحويل.`
                  : `Hello, I placed order (${orderSuccess.orderNumber}) on M20 for ${orderSuccess.total || ''} EGP, sending payment receipt.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse bg-[#25D366] text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#20ba5a] transition-colors duration-150 rounded-sm shadow-sm"
            >
              <Phone size={14} className="shrink-0" />
              <span>{lang === 'ar' ? 'إرسال إيصال التحويل عبر الواتساب' : 'Send Receipt via WhatsApp'}</span>
            </a>
          )}
          <Link
            to={`/track-order?order=${orderSuccess.orderNumber}`}
            className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse bg-[#174F43] text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#0F3830] transition-colors duration-150 rounded-sm shadow-sm"
          >
            <span>{t.checkout.trackOrderLive}</span>
            <ArrowRight size={14} className="rtl:rotate-180" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-[#174F43] text-[#174F43] px-6 py-3 text-xs uppercase tracking-widest font-medium hover:bg-slate-50 transition-colors duration-150 rounded-sm"
          >
            {t.checkout.returnHome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-14 text-left rtl:text-right">
      <SEO title={`${t.checkout.pageTitle} • M20`} noIndex={true} />
      {/* Header Back Button */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-xs uppercase tracking-widest text-slate-500 hover:text-[#174F43] transition-colors duration-150"
        >
          <ArrowLeft size={14} className="mr-1.5 rtl:ml-1.5 rtl:mr-0 rtl:rotate-180" /> {t.checkout.backToBag}
        </button>

        <Link to="/" className="block">
          <img
            src="/img/m20-logo-emerald.png"
            alt="M20 Fine Fragrances"
            className="h-8 sm:h-9 w-auto object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/m20-logo-emerald.png';
            }}
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: form */}
        <div className="lg:col-span-7 space-y-6">
          
          <div>
            <h1 className="text-2xl font-serif text-[#174F43] uppercase">{t.checkout.pageTitle}</h1>
            <p className="text-xs text-slate-500 mt-1">{t.checkout.step1} & {t.checkout.step2}</p>
          </div>

          {cart.some((i) => isPreOrder(i.product)) && (
            <div className="border border-[#FF9D00] bg-[#FFF7E6] px-4 py-3 text-xs text-[#7A4B00]">
              {lang === 'ar'
                ? 'يحتوي طلبك على منتج متاح بالطلب المسبق، وسيتم شحنه عند توفره حسب الموعد المذكور في صفحة المنتج.'
                : 'Your order includes a pre-order item. It will ship once available, as stated on the product page.'}
            </div>
          )}

          {/* Customer info */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#174F43] border-b border-slate-200 pb-2">
              {t.checkout.customerInfo}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-700 font-medium mb-1">
                  {t.checkout.fullName}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: null }));
                  }}
                  placeholder={t.checkout.fullNamePlaceholder}
                  className={`w-full h-10 px-3 text-xs border rounded-sm focus:outline-none bg-white text-slate-800 ${
                    errors.customerName ? 'border-[#b91c1c]' : 'border-slate-200 focus:border-[#174F43]'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1 rtl:ml-1 rtl:mr-0 inline" /> {errors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-700 font-medium mb-1">
                  {t.checkout.phone}
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (errors.customerPhone) setErrors((prev) => ({ ...prev, customerPhone: null }));
                  }}
                  placeholder={t.checkout.phonePlaceholder}
                  className={`w-full h-10 px-3 text-xs border rounded-sm focus:outline-none bg-white text-slate-800 ${
                    errors.customerPhone ? 'border-[#b91c1c]' : 'border-slate-200 focus:border-[#174F43]'
                  }`}
                />
                {errors.customerPhone && (
                  <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1 rtl:ml-1 rtl:mr-0 inline" /> {errors.customerPhone}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1">
                  {t.checkout.phone2}
                </label>
                <input
                  type="tel"
                  value={customerPhone2}
                  onChange={(e) => setCustomerPhone2(e.target.value)}
                  placeholder={t.checkout.phone2Placeholder}
                  className="w-full h-10 px-3 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#174F43] bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1">
                  {t.checkout.email}
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder={t.checkout.emailPlaceholder}
                  className="w-full h-10 px-3 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#174F43] bg-white text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Delivery Method Toggle */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#174F43] border-b border-slate-200 pb-2">
              {t.checkout.deliveryMethod}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeliveryMethod('home_delivery');
                  setErrors((prev) => ({ ...prev, metroStation: null, governorate: null, city: null, street: null, buildingNumber: null }));
                }}
                className={`flex items-center justify-center space-x-2 rtl:space-x-reverse p-3 border rounded-sm transition-colors duration-150 h-11 ${
                  deliveryMethod === 'home_delivery'
                    ? 'border-[#174F43] bg-[#174F43] text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <Home size={16} strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-wider font-medium">{t.checkout.homeDelivery}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeliveryMethod('metro_pickup');
                  setErrors((prev) => ({ ...prev, metroStation: null, governorate: null, city: null, street: null, buildingNumber: null }));
                }}
                className={`flex items-center justify-center space-x-2 rtl:space-x-reverse p-3 border rounded-sm transition-colors duration-150 h-11 ${
                  deliveryMethod === 'metro_pickup'
                    ? 'border-[#174F43] bg-[#174F43] text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <Train size={16} strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-wider font-medium">{t.checkout.metroPickup}</span>
              </button>
            </div>
          </div>

          {/* Metro fields */}
          {deliveryMethod === 'metro_pickup' && (
            <div className="space-y-3 pt-2">
              <div className="relative" ref={metroDropdownRef}>
                <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1">
                  {t.checkout.selectMetro}
                </label>

                <div
                  onClick={() => setIsMetroDropdownOpen(!isMetroDropdownOpen)}
                  className={`w-full h-10 px-3 text-xs border bg-white rounded-sm cursor-pointer flex items-center justify-between transition-colors duration-150 ${
                    errors.metroStation ? 'border-[#b91c1c]' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {selectedMetroStation ? (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="font-medium text-[#174F43]">
                        {lang === 'ar' 
                          ? `${selectedMetroStation.nameAr} (${selectedMetroStation.nameEn})` 
                          : `${selectedMetroStation.nameEn} / ${selectedMetroStation.nameAr}`}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm border border-slate-200">
                        {selectedMetroStation.line}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400">{t.checkout.selectMetroPlaceholder}</span>
                  )}
                  <ChevronDown size={14} className="text-slate-400" />
                </div>

                {errors.metroStation && (
                  <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1 rtl:ml-1 rtl:mr-0 inline" /> {errors.metroStation}
                  </p>
                )}

                {/* Dropdown Overlay */}
                {isMetroDropdownOpen && (
                  <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-slate-200 max-h-64 flex flex-col overlay-shadow rounded-sm">
                    <div className="p-2 border-b border-slate-200 bg-slate-50 flex items-center space-x-2 rtl:space-x-reverse">
                      <Search size={14} className="text-slate-400" />
                      <input
                        type="text"
                        value={metroSearchQuery}
                        onChange={(e) => setMetroSearchQuery(e.target.value)}
                        placeholder={t.checkout.selectMetroPlaceholder}
                        className="w-full text-xs bg-transparent focus:outline-none"
                        autoFocus
                      />
                    </div>

                    <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
                      {filteredMetroStations.length === 0 ? (
                        <div className="p-3 text-xs text-slate-400 text-center">{t.checkout.noStationsFound}</div>
                      ) : (
                        filteredMetroStations.map((st) => (
                          <div
                            key={st.id}
                            onClick={() => {
                              setSelectedMetroStation(st);
                              setIsMetroDropdownOpen(false);
                              setMetroSearchQuery('');
                              setErrors((prev) => ({ ...prev, metroStation: null }));
                            }}
                            className="p-2.5 text-xs hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors duration-150"
                          >
                            <div>
                              <span className="font-medium text-[#174F43]">
                                {lang === 'ar' ? st.nameAr : st.nameEn}
                              </span>
                              <span className="text-slate-400 mx-1">·</span>
                              <span className="text-slate-600">
                                {lang === 'ar' ? st.nameEn : st.nameAr}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm border border-slate-200">
                              {st.line}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-50/70 border border-slate-200 rounded-sm flex items-start space-x-2 rtl:space-x-reverse text-slate-700">
                <Info size={14} className="text-slate-500 mt-0.5 shrink-0" />
                <p className="text-xs">
                  {t.checkout.metroPickupNotice}
                </p>
              </div>
            </div>
          )}

          {/* Home delivery fields */}
          {deliveryMethod === 'home_delivery' && (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1">
                    {t.checkout.governorate}
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => {
                      setGovernorate(e.target.value);
                      if (errors.governorate) setErrors((prev) => ({ ...prev, governorate: null }));
                    }}
                    className={`w-full h-10 px-3 text-xs border bg-white rounded-sm focus:outline-none ${
                      errors.governorate ? 'border-[#b91c1c]' : 'border-slate-200 focus:border-[#174F43]'
                    }`}
                  >
                    <option value="">{t.checkout.selectGovernorate}</option>
                    {EGYPT_GOVERNORATES.map((gov) => (
                      <option key={gov.id} value={gov.nameEn}>
                        {lang === 'ar' ? gov.nameAr : gov.nameEn}
                      </option>
                    ))}
                  </select>
                  {errors.governorate && (
                    <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1 rtl:ml-1 rtl:mr-0 inline" /> {errors.governorate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1">
                    {t.checkout.city}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) setErrors((prev) => ({ ...prev, city: null }));
                    }}
                    placeholder={t.checkout.cityPlaceholder}
                    className={`w-full h-10 px-3 text-xs border rounded-sm focus:outline-none bg-white ${
                      errors.city ? 'border-[#b91c1c]' : 'border-slate-200 focus:border-[#174F43]'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1 rtl:ml-1 rtl:mr-0 inline" /> {errors.city}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1">
                    {t.checkout.street}
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => {
                      setStreet(e.target.value);
                      if (errors.street) setErrors((prev) => ({ ...prev, street: null }));
                    }}
                    placeholder={t.checkout.streetPlaceholder}
                    className={`w-full h-10 px-3 text-xs border rounded-sm focus:outline-none bg-white ${
                      errors.street ? 'border-[#b91c1c]' : 'border-slate-200 focus:border-[#174F43]'
                    }`}
                  />
                  {errors.street && (
                    <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1 rtl:ml-1 rtl:mr-0 inline" /> {errors.street}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1">
                    {t.checkout.buildingNumber}
                  </label>
                  <input
                    type="text"
                    value={buildingNumber}
                    onChange={(e) => {
                      setBuildingNumber(e.target.value);
                      if (errors.buildingNumber) setErrors((prev) => ({ ...prev, buildingNumber: null }));
                    }}
                    placeholder={t.checkout.buildingNumberPlaceholder}
                    className={`w-full h-10 px-3 text-xs border rounded-sm focus:outline-none bg-white ${
                      errors.buildingNumber ? 'border-[#b91c1c]' : 'border-slate-200 focus:border-[#174F43]'
                    }`}
                  />
                  {errors.buildingNumber && (
                    <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1 rtl:ml-1 rtl:mr-0 inline" /> {errors.buildingNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1">
                    {t.checkout.floor}
                  </label>
                  <input
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    placeholder={t.checkout.floorPlaceholder}
                    className="w-full h-10 px-3 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#174F43] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1">
                    {t.checkout.apartment}
                  </label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder={t.checkout.apartmentPlaceholder}
                    className="w-full h-10 px-3 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#174F43] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1">
                  {t.checkout.deliveryNotes}
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder={t.checkout.deliveryNotesPlaceholder}
                  className="w-full h-10 px-3 text-xs border border-slate-200 rounded-sm focus:outline-none focus:border-[#174F43] bg-white"
                />
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#174F43] border-b border-slate-200 pb-2">
              {t.checkout.paymentMethod}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(paymentConfig).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(key);
                    if (errors.paymentMethod) setErrors((prev) => ({ ...prev, paymentMethod: null }));
                  }}
                  className={`flex items-center justify-center space-x-2 rtl:space-x-reverse p-3 border rounded-sm transition-colors duration-150 h-12 ${
                    paymentMethod === key
                      ? 'border-[#174F43] bg-[#174F43] text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {config.icon === 'banknote' && <Banknote size={14} strokeWidth={1.5} />}
                  {config.icon === 'phone' && <Phone size={14} strokeWidth={1.5} />}
                  {config.icon === 'smartphone' && <Smartphone size={14} strokeWidth={1.5} />}
                  <span className="text-xs uppercase tracking-wider font-medium text-center">
                    {lang === 'ar' ? (config.labelAr || config.label) : (config.labelEn || config.label)}
                  </span>
                </button>
              ))}
            </div>
            {errors.paymentMethod && (
              <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center">
                <AlertCircle size={12} className="mr-1 rtl:ml-1 rtl:mr-0 inline" /> {errors.paymentMethod}
              </p>
            )}

            {/* Cash on Delivery Reassurance */}
            {paymentMethod === 'cod' && (
              <div className="mt-3 p-4 bg-[#FF9D00]/10 border border-[#FF9D00]/30 rounded-sm space-y-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#174F43]">
                  <CheckCircle2 size={16} className="text-[#174F43] shrink-0" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {lang === 'ar' ? 'الدفع نقداً عند استلام ومعاينة الشحنة' : 'Cash upon delivery & inspection'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'ar'
                    ? 'يمكنك فحص طلبك والتأكد من عبوات العطور الفاخرة بالكامل مع مندوب الشحن قبل سداد المبلغ نقداً عند باب منزلك.'
                    : 'You may inspect your luxury fragrance order with the delivery courier before paying in cash at your doorstep.'}
                </p>
              </div>
            )}

            {/* Transfer Details & Receipt (Vodafone Cash / InstaPay) */}
            {paymentMethod && paymentMethod !== 'cod' && currentPaymentConfig && (
              <div className="mt-3 p-4 bg-slate-50/70 border border-slate-200 rounded-sm space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-[#174F43]">{t.checkout.transferInstructions}</p>
                  <p className="text-xs text-slate-600">
                    {lang === 'ar' 
                      ? (currentPaymentConfig.instructionsAr || currentPaymentConfig.instructions) 
                      : (currentPaymentConfig.instructionsEn || currentPaymentConfig.instructions)}
                  </p>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white border border-slate-200 p-2.5 mt-2 rounded-sm">
                    <div className="flex-1 text-xs font-medium text-slate-800">
                      <span className="text-slate-500 mr-2 rtl:ml-2 rtl:mr-0">
                        {paymentMethod === 'vodafone_cash' ? t.checkout.walletNumber : t.checkout.instapayAddress}
                      </span>
                      <strong className="text-[#174F43] tracking-wider font-mono">
                        {paymentMethod === 'vodafone_cash' 
                          ? currentPaymentConfig.number 
                          : currentPaymentConfig.account}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(
                        paymentMethod === 'vodafone_cash' 
                          ? currentPaymentConfig.number 
                          : currentPaymentConfig.account
                      )}
                      className="text-slate-500 hover:text-[#174F43] p-1 transition-colors duration-150 flex items-center space-x-1 rtl:space-x-reverse border border-slate-200 rounded-sm px-2 bg-slate-50"
                    >
                      {copiedText ? (
                        <span className="flex items-center text-[#15803d] text-xs font-medium">
                          <Check size={12} className="mr-1 rtl:ml-1 rtl:mr-0" /> {t.checkout.copied}
                        </span>
                      ) : (
                        <span className="flex items-center text-xs font-medium">
                          <Copy size={12} className="mr-1 rtl:ml-1 rtl:mr-0" /> {t.checkout.copy}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <p className="text-xs font-medium text-[#174F43] mb-2">{t.checkout.uploadReceipt}</p>
                  
                  {!paymentScreenshot ? (
                    <label className={`relative border border-dashed border-slate-300 bg-white p-5 flex flex-col items-center justify-center transition-colors duration-150 rounded-sm ${uploadingProof ? 'opacity-70 cursor-wait' : 'hover:bg-slate-50 cursor-pointer'}`}>
                      <input 
                        type="file" 
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        disabled={uploadingProof}
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {uploadingProof ? (
                        <>
                          <RefreshCw size={20} strokeWidth={1.5} className="text-[#174F43] mb-1 animate-spin" />
                          <p className="text-xs text-[#174F43] font-medium text-center">
                            {lang === 'ar' ? 'جاري رفع الإيصال بأمان...' : 'Uploading receipt securely...'}
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload size={20} strokeWidth={1.5} className="text-slate-400 mb-1" />
                          <p className="text-xs text-slate-500 text-center">{t.checkout.uploadReceiptDesc}</p>
                        </>
                      )}
                    </label>
                  ) : (
                    <div className="relative border border-slate-200 bg-white p-2 rounded-sm">
                      <img src={paymentScreenshot} alt="Receipt preview" className="w-full max-h-48 object-contain" />
                      <button 
                        type="button"
                        onClick={() => setPaymentScreenshot(null)}
                        className="absolute top-2 right-2 rtl:left-2 rtl:right-auto p-1.5 bg-white text-slate-800 rounded-sm hover:text-[#b91c1c] border border-slate-200 shadow-sm"
                        title="Remove image"
                      >
                        <X size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  )}
                  {errors.paymentScreenshot && (
                    <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1 rtl:ml-1 rtl:mr-0 inline" /> {errors.paymentScreenshot}
                    </p>
                  )}

                  <div className="mt-2.5 flex items-start space-x-2 rtl:space-x-reverse bg-white p-2.5 border border-slate-200 rounded-sm">
                    <input
                      type="checkbox"
                      id="sendViaWhatsappCheckbox"
                      checked={sendReceiptViaWhatsapp}
                      onChange={(e) => {
                        setSendReceiptViaWhatsapp(e.target.checked);
                        if (e.target.checked && errors.paymentScreenshot) {
                          setErrors((prev) => ({ ...prev, paymentScreenshot: null }));
                        }
                      }}
                      className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#174F43] focus:ring-[#174F43] cursor-pointer shrink-0"
                    />
                    <label htmlFor="sendViaWhatsappCheckbox" className="text-[11px] text-slate-700 cursor-pointer select-none leading-relaxed">
                      {lang === 'ar' 
                        ? 'سأقوم بإرسال إيصال التحويل عبر الواتساب لخدمة العملاء بعد إتمام الطلب' 
                        : 'I will send the payment receipt via WhatsApp to concierge after completing the order'}
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: order summary */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 p-6 space-y-5 sticky top-24 rounded-sm shadow-xs">
            
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#174F43] border-b border-slate-200 pb-2">
              {t.checkout.orderSummary}
            </h2>

            {/* Quick list */}
            <div className="divide-y divide-slate-200 max-h-48 overflow-y-auto pr-1 rtl:pl-1 rtl:pr-0">
              {cart.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                    <img
                      src={item.product?.images?.[0]?.url || '/img/product.png'}
                      alt={item.product?.name}
                      className="w-9 h-9 object-contain bg-white border border-slate-200 rounded-sm p-0.5"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/img/product.png';
                      }}
                    />
                    <div>
                      <p className="font-medium text-[#174F43] uppercase text-xs">{item.product?.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'ar' ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`} ({item.variant?.size || '50ml'})
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-[#174F43]">
                    {formatPrice((item.variant?.price || 0) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Card */}
            <div className="pt-3 border-t border-slate-200">
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="block text-[11px] uppercase tracking-wider text-slate-600 font-semibold flex items-center gap-1.5">
                  <Tag size={13} className="text-[#174F43]" />
                  <span>{lang === 'ar' ? 'كود الخصم / الشحن المجاني' : 'Promo Code / Free Shipping'}</span>
                </label>
                
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
                      <div>
                        <span className="font-mono font-bold text-xs text-emerald-900 tracking-wider">
                          {appliedPromo.coupon?.code || appliedPromo.code}
                        </span>
                        <span className="text-[11px] text-emerald-700 block">
                          {isFreeShippingPromo
                            ? (lang === 'ar' ? 'شحن مجاني مباشر (100%)' : 'Free Shipping (100% Off Delivery)')
                            : (lang === 'ar' ? `خصم ${formatPrice(productDiscount)}` : `${formatPrice(productDiscount)} discount`)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-xs text-slate-500 hover:text-red-700 underline font-medium px-1"
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Remove'}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => {
                        setPromoCodeInput(e.target.value.toUpperCase());
                        if (promoError) setPromoError('');
                      }}
                      placeholder={lang === 'ar' ? 'أدخل كود الخصم' : 'Enter Promo Code'}
                      className="flex-1 h-9 px-3 text-xs border border-slate-200 rounded-sm bg-white uppercase font-mono tracking-wider focus:outline-none focus:border-[#174F43]"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingPromo || !promoCodeInput.trim()}
                      className="px-4 h-9 bg-[#174F43] text-white text-xs font-semibold rounded-sm hover:bg-[#0F3830] transition-colors disabled:opacity-50 shrink-0"
                    >
                      {isApplyingPromo 
                        ? (lang === 'ar' ? 'جاري التحقق...' : 'Applying...') 
                        : (lang === 'ar' ? 'تطبيق' : 'Apply')}
                    </button>
                  </div>
                )}

                {promoError && (
                  <p className="text-[11px] text-[#b91c1c] flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{promoError}</span>
                  </p>
                )}

                {promoSuccess && !appliedPromo && (
                  <p className="text-[11px] text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={12} className="shrink-0" />
                    <span>{promoSuccess}</span>
                  </p>
                )}
              </form>
            </div>

            {/* Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{t.checkout.subtotal}</span>
                <span className="font-medium text-[#174F43]">{formatPrice(cartSubtotal)}</span>
              </div>

              {productDiscount > 0 && (
                <div className="flex justify-between text-[#15803d]">
                  <span>{t.checkout.discount}</span>
                  <span>-{formatPrice(productDiscount)}</span>
                </div>
              )}

              {deliveryMethod === 'home_delivery' && (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>{t.checkout.shippingFee}</span>
                    <span className="font-medium text-[#174F43]">
                      {isCalculatingShipping ? (
                        t.checkout.calculating
                      ) : isFreeShippingPromo ? (
                        <span>
                          <span className="line-through text-slate-400 mr-1.5 rtl:ml-1.5 rtl:mr-0 font-normal">
                            {formatPrice(shippingFee)}
                          </span>
                          <span className="text-emerald-700 font-bold">{t.checkout.free}</span>
                        </span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>

                  {isFreeShippingPromo && shippingDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>
                        {lang === 'ar' 
                          ? `كود الشحن المجاني (${appliedPromo?.coupon?.code || appliedPromo?.code})` 
                          : `Free Shipping Promo (${appliedPromo?.coupon?.code || appliedPromo?.code})`}
                      </span>
                      <span>-{formatPrice(shippingDiscount)}</span>
                    </div>
                  )}
                </>
              )}

              {deliveryMethod === 'metro_pickup' && (
                <div className="flex justify-between text-slate-600">
                  <span>{t.checkout.metroPickupFee}</span>
                  <span className="font-medium text-[#174F43]">
                    {metroPickupFee === 0 ? t.checkout.free : formatPrice(metroPickupFee)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm font-semibold text-[#174F43] pt-2 border-t border-slate-200">
                <span className="uppercase tracking-wider">{t.checkout.totalAmount}</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Server Error Alert */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 text-[#b91c1c] text-xs rounded-sm flex items-start space-x-2 rtl:space-x-reverse">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{errors.submit}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={isSubmitting || uploadingProof}
              className="w-full bg-[#174F43] text-white py-3 text-xs uppercase tracking-widest font-medium hover:bg-[#0F3830] transition-colors duration-150 disabled:opacity-50 h-10 rounded-sm"
            >
              {uploadingProof
                ? (lang === 'ar' ? 'جاري رفع الإيصال...' : 'Uploading receipt...')
                : isSubmitting
                  ? t.checkout.processingOrder
                  : t.checkout.completeOrder}
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-normal">
              {t.checkout.policyConsent}
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
