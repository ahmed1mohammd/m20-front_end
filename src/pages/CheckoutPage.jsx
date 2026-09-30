import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { METRO_STATIONS } from '../data/metroStations';
import { EGYPT_GOVERNORATES } from '../data/egyptGovernorates';
import { getShippingQuote, createOrder } from '../services/api';
import { 
  Train, Home, CheckCircle2, ChevronDown, Search, ArrowLeft, 
  Info, AlertCircle, Phone, Smartphone, Upload, X, Copy, Check, Image 
} from 'lucide-react';

const PAYMENT_CONFIG = {
  vodafoneCash: { label: 'Vodafone Cash', number: '01012345678', icon: 'phone' },
  instaPay: { label: 'InstaPay', account: 'ELAN@instapay', icon: 'smartphone' },
};

const CheckoutPage = () => {
  const { cart, cartSubtotal } = useCart();
  const navigate = useNavigate();

  // Delivery Method: 'metro_pickup' | 'home_delivery'
  const [deliveryMethod, setDeliveryMethod] = useState('home_delivery');

  // Metro Station Pickup State
  const [selectedMetroStation, setSelectedMetroStation] = useState(null);
  const [metroSearchQuery, setMetroSearchQuery] = useState('');
  const [isMetroDropdownOpen, setIsMetroDropdownOpen] = useState(false);
  const metroDropdownRef = useRef(null);

  // Home Delivery State
  const [governorate, setGovernorate] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [floor, setFloor] = useState('');
  const [apartment, setApartment] = useState('');
  const [landmark, setLandmark] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Customer Info
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');

  // Discount & Payment
  const [discountCode, setDiscountCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [copiedText, setCopiedText] = useState('');

  // Financials & Pricing
  const [discount, setDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(50);
  const [metroPickupFee, setMetroPickupFee] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  // Form Validation & Submit State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Filter metro stations by English or Arabic query
  const filteredMetroStations = METRO_STATIONS.filter((st) => {
    const q = metroSearchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      st.nameEn.toLowerCase().includes(q) ||
      st.nameAr.toLowerCase().includes(q) ||
      st.line.toLowerCase().includes(q)
    );
  });

  // Close metro dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (metroDropdownRef.current && !metroDropdownRef.current.contains(e.target)) {
        setIsMetroDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Shipping Fee dynamically from backend on changes
  useEffect(() => {
    let isMounted = true;

    const fetchQuote = async () => {
      setIsCalculatingShipping(true);
      try {
        const quote = await getShippingQuote({
          deliveryMethod,
          governorate,
          city,
          subtotal: cartSubtotal
        });

        if (isMounted && quote) {
          setShippingFee(quote.shippingFee);
          setMetroPickupFee(quote.metroPickupFee);
        } else if (isMounted) {
          // Fallback if backend quote returns null: calculate based on existing backend logic
          if (deliveryMethod === 'metro_pickup') {
            setShippingFee(0);
            setMetroPickupFee(0);
          } else {
            // Existing backend logic: calculatedSubtotal > 1500 ? 0 : 50
            setShippingFee(cartSubtotal > 1500 ? 0 : 50);
            setMetroPickupFee(0);
          }
        }
      } catch (err) {
        if (isMounted) {
          if (deliveryMethod === 'metro_pickup') {
            setShippingFee(0);
            setMetroPickupFee(0);
          } else {
            setShippingFee(cartSubtotal > 1500 ? 0 : 50);
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
  }, [deliveryMethod, governorate, city, cartSubtotal]);

  // Compute final total automatically
  const activeFee = deliveryMethod === 'metro_pickup' ? metroPickupFee : shippingFee;
  const finalTotal = Math.max(0, cartSubtotal - discount + activeFee);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshot(reader.result);
        if (errors.paymentScreenshot) setErrors((prev) => ({ ...prev, paymentScreenshot: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form fields according to rules
  const validateForm = () => {
    const newErrors = {};

    if (!customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required.';
    }

    if (deliveryMethod === 'metro_pickup') {
      if (!selectedMetroStation) {
        newErrors.metroStation = 'Metro station selection is required.';
      }
    } else {
      // Home Delivery validation: governorate, area/city and address are required
      if (!governorate.trim()) {
        newErrors.governorate = 'Governorate is required.';
      }
      if (!city.trim()) {
        newErrors.city = 'City / Area is required.';
      }
      if (!street.trim()) {
        newErrors.street = 'Street address is required.';
      }
      if (!buildingNumber.trim()) {
        newErrors.buildingNumber = 'Building number is required.';
      }
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required.';
    }

    if (paymentMethod && !paymentScreenshot) {
      newErrors.paymentScreenshot = 'Transfer screenshot is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const orderPayload = {
      items: cart.map((item) => ({
        productId: item.product._id || item.product.id,
        variantSKU: item.variant?.SKU || 'SKU-DEFAULT',
        quantity: item.quantity
      })),
      deliveryMethod,
      customerPhone,
      customerName,
      paymentMethod,
      paymentScreenshot,
      metroPickup:
        deliveryMethod === 'metro_pickup' && selectedMetroStation
          ? {
              stationId: selectedMetroStation.id,
              stationNameEn: selectedMetroStation.nameEn,
              stationNameAr: selectedMetroStation.nameAr,
              line: selectedMetroStation.line,
              pickupNote: 'Pickup date and time will be confirmed after your order is reviewed.',
              fee: metroPickupFee
            }
          : null,
      shippingAddress:
        deliveryMethod === 'home_delivery'
          ? {
              governorate,
              city,
              street,
              buildingNumber,
              floor,
              apartment,
              landmark,
              deliveryNotes
            }
          : {}
    };

    try {
      // Attempt backend order placement or mock confirmation
      const res = await createOrder(orderPayload);
      setOrderSuccess(res || { orderNumber: `ELAN-${Math.floor(100000 + Math.random() * 900000)}` });
    } catch (err) {
      // Fallback for UI demonstration if offline
      setOrderSuccess({ orderNumber: `ELAN-${Math.floor(100000 + Math.random() * 900000)}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif text-[#03204E] mb-4">Your Shopping Bag is Empty</h2>
        <p className="text-slate-500 text-sm mb-6">Please add items to your cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-block bg-[#03204E] text-white px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-slate-800 transition-colors"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="text-3xl font-serif text-[#03204E]">Payment Verification Pending</h2>
        <p className="text-slate-600 text-sm">
          Thank you for choosing Élan. Your order <span className="font-semibold text-[#03204E]">{orderSuccess.orderNumber}</span> has been received and is pending payment verification.
        </p>
        {deliveryMethod === 'metro_pickup' && (
          <div className="bg-slate-50 p-4 border border-slate-200 rounded text-left text-xs space-y-2 text-[#03204E]">
            <p className="font-semibold uppercase tracking-wider text-[11px]">Metro Station Pickup</p>
            <p><span className="text-slate-500">Station:</span> {selectedMetroStation?.nameEn} / {selectedMetroStation?.nameAr}</p>
            <p><span className="text-slate-500">Line:</span> {selectedMetroStation?.line}</p>
            <p className="text-emerald-700 italic pt-1 border-t border-slate-200 mt-2">
              "Pickup date and time will be confirmed after your order is reviewed."
            </p>
          </div>
        )}
        <div className="pt-4">
          <Link
            to="/"
            className="inline-block bg-[#03204E] text-white px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-slate-800 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
      {/* Header Back Button & Brand Logo */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-xs uppercase tracking-widest text-slate-500 hover:text-[#03204E] transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Bag
        </button>

        <Link to="/" className="block">
          <img
            src="/img/web logo -light.png"
            alt="ÉLAN Logo"
            className="h-8 sm:h-10 w-auto object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/logo-light.png';
            }}
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Clean Minimal Delivery Form */}
        <div className="lg:col-span-7 space-y-8">
          
          <div>
            <h1 className="text-2xl font-serif text-[#03204E] uppercase tracking-wide">Checkout</h1>
            <p className="text-xs text-slate-500 mt-1">Please fill in your details below.</p>
          </div>

          {/* Customer Information */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#03204E] border-b border-slate-100 pb-2">
              Customer Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-[#03204E] bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (errors.customerPhone) setErrors((prev) => ({ ...prev, customerPhone: null }));
                  }}
                  placeholder="e.g. 01012345678"
                  className={`w-full px-3.5 py-2.5 text-xs border rounded-none focus:outline-none bg-white ${
                    errors.customerPhone ? 'border-red-500' : 'border-slate-200 focus:border-[#03204E]'
                  }`}
                />
                {errors.customerPhone && (
                  <p className="text-[10px] text-red-500 mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1 inline" /> {errors.customerPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Method Selection Toggle */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#03204E] border-b border-slate-100 pb-2">
              Delivery Method *
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeliveryMethod('metro_pickup');
                  setErrors((prev) => ({ ...prev, metroStation: null, governorate: null, city: null, street: null, buildingNumber: null }));
                }}
                className={`flex items-center justify-center space-x-2.5 p-4 border transition-all ${
                  deliveryMethod === 'metro_pickup'
                    ? 'border-[#03204E] bg-[#03204E] text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <Train size={18} />
                <span className="text-xs uppercase tracking-wider font-medium">Metro Station Pickup</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeliveryMethod('home_delivery');
                  setErrors((prev) => ({ ...prev, metroStation: null, governorate: null, city: null, street: null, buildingNumber: null }));
                }}
                className={`flex items-center justify-center space-x-2.5 p-4 border transition-all ${
                  deliveryMethod === 'home_delivery'
                    ? 'border-[#03204E] bg-[#03204E] text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <Home size={18} />
                <span className="text-xs uppercase tracking-wider font-medium">Home Delivery</span>
              </button>
            </div>
          </div>

          {/* CONDITIONAL FIELD SET: METRO STATION PICKUP */}
          {deliveryMethod === 'metro_pickup' && (
            <div className="space-y-4 pt-2 transition-all">
              <div className="relative" ref={metroDropdownRef}>
                <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1.5">
                  Select Station *
                </label>

                <div
                  onClick={() => setIsMetroDropdownOpen(!isMetroDropdownOpen)}
                  className={`w-full px-3.5 py-3 text-xs border bg-white cursor-pointer flex items-center justify-between transition-colors ${
                    errors.metroStation ? 'border-red-500' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {selectedMetroStation ? (
                    <div>
                      <span className="font-semibold text-[#03204E]">
                        {selectedMetroStation.nameEn} / {selectedMetroStation.nameAr}
                      </span>
                      <span className="ml-2.5 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {selectedMetroStation.line}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400">Search or choose a Metro station...</span>
                  )}
                  <ChevronDown size={16} className="text-slate-400" />
                </div>

                {errors.metroStation && (
                  <p className="text-[10px] text-red-500 mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1 inline" /> {errors.metroStation}
                  </p>
                )}

                {/* Dropdown Menu */}
                {isMetroDropdownOpen && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl max-h-72 flex flex-col">
                    {/* Search Input inside Dropdown */}
                    <div className="p-2.5 border-b border-slate-100 bg-slate-50 flex items-center space-x-2">
                      <Search size={14} className="text-slate-400" />
                      <input
                        type="text"
                        value={metroSearchQuery}
                        onChange={(e) => setMetroSearchQuery(e.target.value)}
                        placeholder="Search by English or Arabic name (e.g. Sadat / السادات)..."
                        className="w-full text-xs bg-transparent focus:outline-none"
                        autoFocus
                      />
                    </div>

                    {/* Station List */}
                    <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
                      {filteredMetroStations.length === 0 ? (
                        <div className="p-4 text-xs text-slate-400 text-center">No matching stations found</div>
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
                            className="p-3 text-xs hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                          >
                            <div>
                              <span className="font-medium text-[#03204E]">{st.nameEn}</span>
                              <span className="text-slate-400 mx-1.5">•</span>
                              <span className="text-slate-600 font-arabic">{st.nameAr}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {st.line}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Metro Message Banner */}
              <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-none flex items-start space-x-3 text-amber-900 mt-3">
                <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs leading-relaxed">
                  Pickup date and time will be confirmed after your order is reviewed.
                </p>
              </div>
            </div>
          )}

          {/* CONDITIONAL FIELD SET: HOME DELIVERY */}
          {deliveryMethod === 'home_delivery' && (
            <div className="space-y-4 pt-2 transition-all">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Governorate * */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1.5">
                    Governorate *
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => {
                      setGovernorate(e.target.value);
                      if (errors.governorate) setErrors((prev) => ({ ...prev, governorate: null }));
                    }}
                    className={`w-full px-3.5 py-2.5 text-xs border bg-white rounded-none focus:outline-none ${
                      errors.governorate ? 'border-red-500' : 'border-slate-200 focus:border-[#03204E]'
                    }`}
                  >
                    <option value="">Select Governorate</option>
                    {EGYPT_GOVERNORATES.map((gov) => (
                      <option key={gov.id} value={gov.nameEn}>
                        {gov.nameEn} ({gov.nameAr})
                      </option>
                    ))}
                  </select>
                  {errors.governorate && (
                    <p className="text-[10px] text-red-500 mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1 inline" /> {errors.governorate}
                    </p>
                  )}
                </div>

                {/* City / Area * */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1.5">
                    City / Area *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) setErrors((prev) => ({ ...prev, city: null }));
                    }}
                    placeholder="e.g. New Cairo / Nasr City / Maadi"
                    className={`w-full px-3.5 py-2.5 text-xs border rounded-none focus:outline-none bg-white ${
                      errors.city ? 'border-red-500' : 'border-slate-200 focus:border-[#03204E]'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-[10px] text-red-500 mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1 inline" /> {errors.city}
                    </p>
                  )}
                </div>
              </div>

              {/* Street Address * & Building Number * */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1.5">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => {
                      setStreet(e.target.value);
                      if (errors.street) setErrors((prev) => ({ ...prev, street: null }));
                    }}
                    placeholder="Street name & area details"
                    className={`w-full px-3.5 py-2.5 text-xs border rounded-none focus:outline-none bg-white ${
                      errors.street ? 'border-red-500' : 'border-slate-200 focus:border-[#03204E]'
                    }`}
                  />
                  {errors.street && (
                    <p className="text-[10px] text-red-500 mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1 inline" /> {errors.street}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1.5">
                    Building Number *
                  </label>
                  <input
                    type="text"
                    value={buildingNumber}
                    onChange={(e) => {
                      setBuildingNumber(e.target.value);
                      if (errors.buildingNumber) setErrors((prev) => ({ ...prev, buildingNumber: null }));
                    }}
                    placeholder="Bldg / Villa #"
                    className={`w-full px-3.5 py-2.5 text-xs border rounded-none focus:outline-none bg-white ${
                      errors.buildingNumber ? 'border-red-500' : 'border-slate-200 focus:border-[#03204E]'
                    }`}
                  />
                  {errors.buildingNumber && (
                    <p className="text-[10px] text-red-500 mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1 inline" /> {errors.buildingNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Floor & Apartment */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1.5">
                    Floor (Optional)
                  </label>
                  <input
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    placeholder="e.g. 3rd Floor"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-[#03204E] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1.5">
                    Apartment (Optional)
                  </label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Apt / Suite #"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-[#03204E] bg-white"
                  />
                </div>
              </div>

              {/* Nearby Landmark */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1.5">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near hospital, school, mall, or square"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-[#03204E] bg-white"
                />
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-600 mb-1.5">
                  Delivery Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Any special instructions for courier delivery..."
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-[#03204E] bg-white"
                />
              </div>
            </div>
          )}

          {/* Discount Code Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#03204E] border-b border-slate-100 pb-2">
              Discount Code
            </h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Enter discount code"
                className="flex-1 px-3.5 py-2.5 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-[#03204E] bg-white"
              />
              <button
                type="button"
                className="px-6 py-2.5 bg-slate-900 text-white text-[11px] uppercase tracking-wider hover:bg-[#03204E] transition-colors"
                onClick={() => {
                  // Currently just UI for future use
                }}
              >
                Apply
              </button>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#03204E] border-b border-slate-100 pb-2">
              Payment Method *
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(PAYMENT_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(key);
                    if (errors.paymentMethod) setErrors((prev) => ({ ...prev, paymentMethod: null }));
                  }}
                  className={`flex items-center justify-center space-x-2.5 p-4 border transition-all ${
                    paymentMethod === key
                      ? 'border-[#03204E] bg-[#03204E] text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {config.icon === 'phone' && <Phone size={18} />}
                  {config.icon === 'smartphone' && <Smartphone size={18} />}
                  <span className="text-xs uppercase tracking-wider font-medium">{config.label}</span>
                </button>
              ))}
            </div>
            {errors.paymentMethod && (
              <p className="text-[10px] text-red-500 mt-1 flex items-center">
                <AlertCircle size={12} className="mr-1 inline" /> {errors.paymentMethod}
              </p>
            )}

            {/* Transfer Details & Upload Receipt */}
            {paymentMethod && (
              <div className="mt-4 p-5 bg-slate-50 border border-slate-200 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#03204E]">Transfer Details</p>
                  <p className="text-xs text-slate-600">Please transfer the exact total amount shown above.</p>
                  
                  <div className="flex items-center space-x-2 bg-white border border-slate-200 p-3 mt-2">
                    <div className="flex-1 text-sm font-medium text-slate-800">
                      <span className="text-xs text-slate-500 mr-2">
                        {paymentMethod === 'vodafoneCash' ? 'Send to:' : 'Transfer to:'}
                      </span>
                      {paymentMethod === 'vodafoneCash' 
                        ? PAYMENT_CONFIG.vodafoneCash.number 
                        : PAYMENT_CONFIG.instaPay.account}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(
                        paymentMethod === 'vodafoneCash' 
                          ? PAYMENT_CONFIG.vodafoneCash.number 
                          : PAYMENT_CONFIG.instaPay.account
                      )}
                      className="text-slate-400 hover:text-[#03204E] p-1.5 transition-colors flex items-center space-x-1"
                    >
                      {copiedText ? (
                        <span className="flex items-center text-emerald-600 text-[10px] uppercase font-bold tracking-wider">
                          <Check size={14} className="mr-1" /> Copied
                        </span>
                      ) : (
                        <span className="flex items-center text-[10px] uppercase font-bold tracking-wider">
                          <Copy size={14} className="mr-1" /> Copy
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#03204E] mb-3">Upload Receipt *</p>
                  
                  {!paymentScreenshot ? (
                    <div className="relative border-2 border-dashed border-slate-200 bg-white p-6 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload size={24} className="text-slate-400 mb-2" />
                      <p className="text-xs text-slate-500 text-center">Click or drag image to upload transfer screenshot</p>
                    </div>
                  ) : (
                    <div className="relative border border-slate-200 bg-white p-2">
                      <img src={paymentScreenshot} alt="Receipt preview" className="w-full max-h-48 object-contain" />
                      <button 
                        type="button"
                        onClick={() => setPaymentScreenshot(null)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 text-slate-800 rounded hover:bg-red-50 hover:text-red-600 transition-colors border border-slate-200 shadow-sm"
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {errors.paymentScreenshot && (
                    <p className="text-[10px] text-red-500 mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1 inline" /> {errors.paymentScreenshot}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="lg:col-span-5">
          <div className="bg-slate-50 border border-slate-200/80 p-6 space-y-6 sticky top-24">
            
            <h2 className="text-sm font-serif uppercase tracking-widest text-[#03204E] border-b border-slate-200 pb-3">
              Order Summary
            </h2>

            {/* Cart Items Quick List */}
            <div className="divide-y divide-slate-200 max-h-48 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product?.images?.[0]?.url || '/img/product.png'}
                      alt={item.product?.name}
                      className="w-10 h-10 object-cover bg-white border border-slate-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/img/product.png';
                      }}
                    />
                    <div>
                      <p className="font-semibold text-[#03204E] uppercase text-[11px]">{item.product?.name}</p>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity} ({item.variant?.size || '100ml'})</p>
                    </div>
                  </div>
                  <span className="font-medium text-[#03204E]">
                    EGP {(item.variant?.price || 0) * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown List */}
            <div className="space-y-3 pt-4 border-t border-slate-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-[#03204E]">EGP {cartSubtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-EGP {discount}</span>
                </div>
              )}

              {/* Shipping Fee (Home Delivery only) */}
              {deliveryMethod === 'home_delivery' && (
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee (Home Delivery)</span>
                  <span className="font-medium text-[#03204E]">
                    {isCalculatingShipping ? 'Calculating...' : shippingFee === 0 ? 'Free' : `EGP ${shippingFee}`}
                  </span>
                </div>
              )}

              {/* Metro Pickup Fee (if configured / selected) */}
              {deliveryMethod === 'metro_pickup' && (
                <div className="flex justify-between text-slate-600">
                  <span>Metro Pickup Fee</span>
                  <span className="font-medium text-[#03204E]">
                    {metroPickupFee === 0 ? 'Free' : `EGP ${metroPickupFee}`}
                  </span>
                </div>
              )}

              {/* Total automatically updated BEFORE money transfer */}
              <div className="flex justify-between text-sm font-semibold text-[#03204E] pt-3 border-t border-slate-200">
                <span className="uppercase tracking-wider">Total</span>
                <span className="text-base">EGP {finalTotal}</span>
              </div>
            </div>

            {/* Complete Order Button */}
            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full bg-[#03204E] text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Processing Order...' : 'Complete Order'}
            </button>

            <p className="text-[10px] text-slate-400 text-center leading-normal">
              By placing your order, you agree to Élan's Terms of Service & Privacy Policy.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
