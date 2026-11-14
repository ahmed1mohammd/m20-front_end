import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    common: {
      brandName: 'M20',
      brandSubtitle: 'Haute Parfumerie',
      brandFull: 'M20 Fine Fragrances',
      currency: 'EGP',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      viewAll: 'View All',
      shopNow: 'Shop Now',
      exploreCollection: 'Explore Collection',
      discoverMore: 'Discover More',
      leaveYourMark: 'Leave your mark.',
      rightsReserved: 'All rights reserved.',
      switchLang: 'العربية',
      switchLangShort: 'AR',
      currentLangLabel: 'English',
      sale: 'SALE',
      offer: 'OFFER',
      new: 'NEW',
      free: 'FREE',
      error: 'An error occurred. Please try again.',
    },
    nav: {
      home: 'Home',
      men: 'For Him',
      women: 'For Her',
      allFragrances: 'All Fragrances',
      offers: 'Special Offers',
      trackOrder: 'Track Order',
      about: 'About M20',
      policies: 'Client Services',
      searchPlaceholder: 'Search by fragrance name, note, or collection...',
      searchAction: 'Search',
      myAccount: 'My Account',
      signIn: 'Sign In',
      logout: 'Logout',
      cartTitle: 'Shopping Bag',
      emptyBag: 'Your bag is empty',
      menu: 'Menu',
      close: 'Close',
    },
    announcement: {
      defaultText: 'Free shipping on eligible orders | Complimentary discovery sample with every purchase',
    },
    hero: {
      tag: 'HAUTE PARFUMERIE • CAIRO',
      title: 'ARTISANAL LUXURY FRAGRANCES',
      desc: 'Distinctive Egyptian fragrances formulated with pure essence oils for unmatched longevity and sillage.',
      shopMen: 'Shop For Him',
      shopWomen: 'Shop For Her',
    },
    features: {
      f1Title: 'GENUINE EXTRAIT DE PARFUM',
      f1Desc: 'Crafted for rich presence and all-day endurance.',
      f2Title: 'RARE ARTISANAL ESSENCES',
      f2Desc: 'Distilled natural ingredients sourced from master perfumers.',
      f3Title: 'ELEGANT LUXURY PACKAGING',
      f3Desc: 'Hand-finished packaging designed for gifting and collection.',
      f4Title: 'EXPRESS NATIONWIDE DELIVERY',
      f4Desc: 'Direct to your door in 2-4 days with Metro station pickup in Cairo.',
    },
    mostWanted: {
      tag: 'CURATED SELECTION',
      title: 'MOST WANTED FRAGRANCES',
      desc: 'Discover our most celebrated signature fragrances crafted for indelible presence.',
      viewAll: 'View Full Collection',
    },
    aboutSection: {
      tag: 'THE ATELIER',
      title: 'ABOUT M20',
      desc: 'Artisanal Cairo-crafted fragrances made to leave a lasting impression.',
      action: 'Discover Our Story',
    },
    offersSection: {
      tag: 'LIMITED PRIVILEGES',
      title: 'EXCLUSIVE MAISON OFFERS',
      desc: 'Curated discovery sets and limited seasonal bundles created for discerning fragrance lovers.',
      claimOffer: 'Claim Offer',
      viewAllOffers: 'Explore All Offers',
      noOffers: 'No active offers available at this moment.',
      limitedTime: 'Limited Time',
    },
    productCard: {
      addToCart: 'Add to Bag',
      quickAdd: 'Quick Add',
      soldOut: 'Sold Out',
      extrait: 'Extrait de Parfum',
      viewProduct: 'View Details',
    },
    productDetail: {
      breadcrumbHome: 'Home',
      breadcrumbShop: 'Fragrances',
      concentration: 'Extrait de Parfum',
      size: 'Select Size',
      quantity: 'Quantity',
      inStock: 'In Stock & Ready to Ship',
      outOfStock: 'Sold Out',
      addToCart: 'Add to Shopping Bag',
      addingToCart: 'Adding to Bag...',
      addedToCart: 'Added to Bag',
      viewCart: 'View Bag',
      pyramidTitle: 'Olfactive Architecture',
      topNotes: 'Top Notes',
      heartNotes: 'Heart Notes',
      baseNotes: 'Base Notes',
      descriptionTitle: 'The Creation',
      craftsmanshipTitle: 'Maison Specifications',
      specConcentration: 'Classification',
      specLongevity: 'Longevity: 10-14 hours on skin & textile',
      specOrigin: 'Origin: Formulated in Cairo, Egypt',
      specVolume: 'Available in 50ml & 100ml spray flacons',
      shippingReturnsTitle: 'Shipping & Authentic Guarantee',
      shippingText: 'Delivered in 2-4 business days across Egypt. Metro pickup available for Cairo & Giza. 14-day return privilege on sealed items.',
      authenticBadge: '100% Authentic Extrait Formula',
      longevity: 'Longevity',
      sillage: 'Sillage',
      hours: 'Hours',
      bestFor: 'Best For',
      taxesIncluded: 'Taxes & luxury packaging included',
      collectionSuffix: 'COLLECTION',
      applicationTitle: 'Application & Sillage Ritual',
      applicationText: 'Spray at pulse points, wrists, neck, and behind the ears, for rich, enduring sillage throughout the day.',
      authenticGuarantee: '100% Authentic Maison Formulation • Extrait de Parfum',
      parcelInspection: 'Guaranteed parcel inspection upon delivery',
    },
    cart: {
      title: 'Your Shopping Bag',
      empty: 'Your bag is currently empty',
      emptySub: 'Explore our catalog and find your signature fragrance.',
      continueShopping: 'Explore Fragrances',
      subtotal: 'Subtotal',
      shippingNotice: 'Shipping & taxes calculated at checkout',
      checkoutBtn: 'Proceed to Checkout',
      remove: 'Remove',
      qty: 'Qty',
      promoCodePlaceholder: 'Enter Promo Code',
      applyCoupon: 'Apply',
      couponApplied: 'Coupon Applied',
      discount: 'Discount',
      freeShippingProgress: 'Add {amount} EGP more for FREE delivery!',
      freeShippingUnlocked: 'You unlocked FREE delivery nationwide!',
    },
    checkout: {
      pageTitle: 'Checkout & Secure Payment',
      step1: '1. Contact Details',
      customerInfo: 'Customer Information',
      fullName: 'Full Name *',
      fullNamePlaceholder: 'e.g. Omar Farouk',
      phone: 'Phone Number (WhatsApp preferred) *',
      phonePlaceholder: '01012345678',
      phone2: 'Secondary Phone (Optional)',
      phone2Placeholder: '01xxxxxxxxx',
      email: 'Email Address (Optional, for tracking)',
      emailPlaceholder: 'name@example.com',
      step2: '2. Delivery Destination',
      deliveryMethod: 'Delivery Method *',
      homeDelivery: 'Home Delivery (Door to Door)',
      metroPickup: 'Cairo Metro Station Pickup (Economical)',
      governorate: 'Governorate *',
      selectGovernorate: 'Select Governorate',
      city: 'City or Area *',
      cityPlaceholder: 'e.g. New Cairo / Nasr City / Maadi',
      street: 'Street Address *',
      streetPlaceholder: 'Street name and district',
      buildingNumber: 'Building / Villa (Optional)',
      buildingNumberPlaceholder: 'Building / Villa',
      floor: 'Floor (Optional)',
      floorPlaceholder: 'e.g. 3rd floor',
      apartment: 'Apartment (Optional)',
      apartmentPlaceholder: 'Apartment number',
      deliveryNotes: 'Delivery Notes / Landmarks (Optional)',
      deliveryNotesPlaceholder: 'e.g. Near Bank Misr, leave with security if unavailable',
      selectMetro: 'Select Metro Station *',
      selectMetroPlaceholder: 'Search or select a station...',
      metroPickupNotice: 'Pickup date and time will be confirmed after your order is reviewed.',
      noStationsFound: 'No stations found',
      step3: '3. Payment Method *',
      paymentMethod: 'Payment Method *',
      cod: 'Cash on Delivery (COD)',
      codDesc: 'Pay securely in cash upon receiving your order.',
      instaPay: 'InstaPay Instant Transfer',
      instaPayDesc: 'Instant bank or wallet transfer via InstaPay address.',
      vodafoneCash: 'Vodafone Cash & Mobile Wallets',
      vodafoneCashDesc: 'Direct transfer to our official Vodafone Cash wallet.',
      card: 'Credit / Debit Card (Fawaterk)',
      cardDesc: 'Visa, MasterCard, and Meeza cards supported.',
      orderSummary: 'Order Summary',
      itemsCount: 'Items',
      subtotal: 'Subtotal',
      discount: 'Discount',
      shippingFee: 'Shipping Fee',
      metroPickupFee: 'Metro Pickup Fee',
      totalAmount: 'Total Due',
      free: 'Free',
      calculating: 'Calculating...',
      placeOrder: 'Confirm Order',
      processing: 'Securing Your Order...',
      completeOrder: 'Complete Order',
      processingOrder: 'Processing order...',
      uploadReceipt: 'Upload payment screenshot / receipt *',
      uploadReceiptDesc: 'Click or drag image to upload transfer receipt',
      transferInstructions: 'Payment Instructions & Details',
      walletNumber: 'Wallet Number:',
      instapayAddress: 'InstaPay Address:',
      copied: 'Copied',
      copy: 'Copy',
      policyConsent: 'By placing your order, you agree to our policies.',
      backToBag: 'Back to bag',
      emptyBagTitle: 'Your shopping bag is empty',
      emptyBagDesc: 'Please add items to your cart before proceeding to checkout.',
      exploreCatalog: 'Explore collections',
      orderConfirmedBadge: 'Order Confirmed',
      orderConfirmedTitle: 'Thank you for your order',
      orderRefIs: 'Your order reference is',
      orderPrepDesc: 'We are preparing your artisanal fragrance with meticulous care.',
      trackOrderLive: 'Track Order Live',
      returnHome: 'Return to Home',
      errorName: 'Full name is required',
      errorPhone: 'Phone number is required',
      errorMetro: 'Please select a metro station for pickup',
      errorGov: 'Governorate is required',
      errorCity: 'City / Area is required',
      errorStreet: 'Street address is required',
      errorBuilding: 'Building number is required',
      errorPayment: 'Please select a payment method',
      errorReceipt: 'Transfer screenshot / receipt is required',
      errorFillFields: 'Please fill in all required contact and delivery fields.',
      successTitle: 'Order Placed Successfully!',
      successDesc: 'Thank you for your order. Our atelier concierge will review and contact you shortly.',
      orderRef: 'Order Reference',
      trackOrderBtn: 'Track Your Order',
    },
    tracking: {
      title: 'Track Your Order',
      subtitle: 'Enter your order reference number or contact phone to check live fulfillment status.',
      placeholder: 'Order ID (e.g. ELN-...) or Phone Number',
      trackBtn: 'Track Order',
      searching: 'Searching...',
      notFound: 'No active orders found matching this inquiry. Please check the reference number.',
      orderInfo: 'Order Details',
      status: 'Status',
      statusPlaced: 'Order Received',
      statusVerified: 'Confirmed by Atelier',
      statusPackaging: 'Being Handcrafted & Packaged',
      statusShipped: 'With Express Courier',
      statusDelivered: 'Delivered',
      items: 'Ordered Items',
      total: 'Total Amount',
      date: 'Placed On',
    },
    about: {
      metaTitle: 'Our Story & Atelier • M20 Fine Fragrances',
      metaDesc: 'Discover the story of M20, a modern Egyptian haute fragrance house crafting artisanal perfumes for lasting presence and projection.',
      tag: 'OUR PHILOSOPHY',
      title: 'THE STORY OF M20',
      subtitle: 'Crafted in Cairo for lasting presence and quiet distinction.',
      originLabel: 'EST. CAIRO, EGYPT',
      quote: '“A fragrance should do more than smell pleasant. It should leave an indelible mark on memory.”',
      stat1Val: 'Extrait',
      stat1Label: 'Haute Parfumerie',
      stat2Val: '10–14h',
      stat2Label: 'Skin Longevity',
      stat3Val: 'Cairo',
      stat3Label: 'Egyptian Atelier',
      chapter1Title: '01. Presence and Character',
      p1: 'We founded M20 in Cairo as a modern Egyptian haute fragrance house for those who consider perfume an essential pillar of their personal aura.',
      chapter2Title: '02. Distinct Compositions',
      p2: 'Every M20 fragrance possesses an uncompromising olfactive identity. Ranging from smoldering woods and dark ambers to crisp bergamot and velvety florals, each extrait is formulated with pure purpose.',
      chapter3Title: '03. Haute Extrait de Parfum',
      p3: 'Crafted with pure aromatic oils, our perfumes are formulated to radiate with confidence and endure through Egyptian warmth and evening soirees alike.',
      chapter4Title: '04. Direct Atelier Craft',
      pillarsTag: 'THE M20 STANDARD',
      pillarsTitle: 'Our Foundations',
      pillar1Title: 'Egyptian Heritage',
      pillar1Desc: 'Honoring thousands of years of Nile perfumery heritage with modern formulation refinement.',
      pillar2Title: 'Pure Extrait Craft',
      pillar2Desc: 'Dedicated to pure aromatic essences ensuring all-day sillage and rich projection.',
      pillar3Title: 'Direct Atelier Value',
      pillar3Desc: 'Luxury niche perfumery accessible directly from our craft laboratory to your vanity.',
      craftTag: 'OLFACTORY ARCHITECTURE',
      craftTitle: 'Engineered for Endurance',
      craft1Num: 'Pure',
      craft1Title: 'Artisanal Formulation',
      craft1Desc: 'True Extrait de Parfum formulation using high-purity aromatic oils for depth without harshness.',
      craft2Num: '4–6h',
      craft2Title: 'Balanced Projection',
      craft2Desc: 'Calibrated sillage designed to announce your presence smoothly without overwhelming a room.',
      craft3Num: '10–14h',
      craft3Title: 'Skin & Fabric Wear',
      craft3Desc: 'Slow-maturing base accords of amber, woods, and musk built to hold across warm days and late nights.',
      ctaTag: 'M20 HAUTE PARFUMERIE',
      ctaTitle: 'Find Your Signature Scent',
    },
    policies: {
      metaTitle: 'Client Services & Policies • M20',
      title: 'CLIENT SERVICES & POLICIES',
      subtitle: 'Comprehensive guide to shipping, payment methods, returns, and ordering with M20.',
      shippingTitle: 'Shipping & Delivery',
      shippingP1: 'M20 delivers to all governorates across Egypt. Standard delivery takes 2 to 4 business days. Cairo Metro Station pickup is available as an economical alternative for Cairo and Giza clients.',
      paymentsTitle: 'Payment Options',
      paymentsP1: 'We accept Cash on Delivery (COD), InstaPay instant transfers, Vodafone Cash mobile wallet transfers, and online credit cards via Fawaterk.',
      returnsTitle: 'Returns & Exchange Policy',
      returnsP1: 'If your item arrives damaged or incorrect, contact us within 14 days of receipt for an immediate complimentary exchange or full refund.',
      faqTitle: 'Frequently Asked Questions',
      faq1Q: 'How long do M20 fragrances last on skin?',
      faq1A: 'Due to our rich Extrait de Parfum formulation, M20 creations typically project for 4-6 hours and linger on skin and fabrics for 10-14+ hours.',
      faq2Q: 'Can I track my order?',
      faq2A: 'Yes! You can track your order status live anytime using our Track Order page with your order reference number or registered phone.',
    },
    footer: {
      priveTag: 'THE M20 PRIVÉ',
      joinTitle: 'JOIN THE MAISON',
      joinDesc: 'Receive private invitations to new extraits de parfum, limited releases, and exclusive member privileges.',
      subscribe: 'SUBSCRIBE',
      subSuccess: 'Thank you for subscribing to M20. Your journey begins here.',
      emailPlaceholder: 'Enter your email address',
      brandDesc: 'An artisanal Egyptian fragrance house dedicated to creating distinctive, long-lasting perfumes in Cairo.',
      collections: 'COLLECTIONS',
      theMaison: 'THE MAISON',
      clientServices: 'CLIENT SERVICES',
      followUs: 'FOLLOW OUR JOURNEY',
      allFragrances: 'All Fragrances',
      forHim: 'For Him',
      forHer: 'For Her',
      specialOffers: 'Special Offers',
      aboutM20: 'About M20',
      storyHeritage: 'Our Story & Heritage',
      craftsmanship: 'Artisanal Craftsmanship',
      sustainability: 'Sustainability & Quality',
      trackOrder: 'Track Your Order',
      shippingPolicy: 'Shipping Policy',
      returnsRefunds: 'Returns & Refunds',
      privacyTerms: 'Privacy & Terms',
      faqAssistance: 'FAQ & Assistance',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      shippingDetails: 'Shipping Details',
      rights: 'All rights reserved.',
      cairoEgypt: 'Cairo, Egypt',
      callUs: 'Call Us',
      whatsapp: 'WhatsApp',
      emailUs: 'Email',
    },
    auth: {
      signInTitle: 'Sign In to Your M20 Account',
      signUpTitle: 'Create an M20 Account',
      phoneOrEmail: 'Phone Number or Email',
      phoneOrEmailPlaceholder: '01132687324 or name@example.com',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      fullName: 'Full Name',
      fullNamePlaceholder: 'e.g. Karim Ahmed',
      phone: 'Phone Number',
      phonePlaceholder: '01xxxxxxxxx',
      email: 'Email Address',
      emailPlaceholder: 'name@example.com',
      regPasswordPlaceholder: 'Minimum 4 characters',
      signInBtn: 'Sign In',
      signUpBtn: 'Create Account',
      authenticating: 'Authenticating...',
      sendingCode: 'Sending code...',
      continueToVerification: 'Continue to Verification',
      enterOtp: 'Enter Verification Code',
      otpDesc: 'A 6-digit code was sent to',
      otpSentTo: 'We sent a 6-digit verification code to',
      verifyBtn: 'Confirm & Complete',
      verifying: 'Verifying...',
      resendOtp: 'Resend Code',
      resendIn: 'Resend in {s}s',
      didNotReceiveEmail: 'Did not receive email?',
      noAccount: "Don't have an account?",
      createOneNow: 'Create one now',
      haveAccount: 'Already registered?',
      signInLink: 'Sign in',
      welcomeBack: 'Welcome Back',
      welcomeBackDesc: 'Sign in to access your orders, wishlist, and bespoke atelier.',
      createAccountDesc: 'Join M20 for exclusive releases, order tracking, and fast checkout.',
      verifyEmailTitle: 'Verify Email',
      verifyEmailDesc: 'Enter the 6-digit confirmation code dispatched to your email.',
      returnToRegistration: 'Return to registration',
      returnToBoutique: 'Return to M20 Boutique',
      secureAuth: '256-bit Encrypted & Secure Authentication',
      enterAllDigits: 'Please enter all 6 digits of the verification code.',
      emailVerified: 'Email verified. Redirecting to your account.',
      invalidOtp: 'Invalid or expired verification code.',
      newOtpSent: 'A new verification code was sent to your email.',
      failedResend: 'Failed to resend code.',
      loginFailed: 'Login failed. Please check your credentials.',
      regFailed: 'Registration failed. Please check your inputs.',
      otpInstruction: 'Please enter the verification code sent to your email.',
      emailCodeTab: 'Email Code',
      passwordTab: 'Password',
      sendCodeBtn: 'Send Verification Code',
      emailCodeHelper: 'We will email you a 6-digit one-time verification code to sign in securely without a password.',
      returnToSignIn: 'Return to sign in',
      checkSpamHint: 'If you do not see the email in your Primary Inbox, please check your Spam or Updates folder.',
    },
  },

  ar: {
    common: {
      brandName: 'M20',
      brandSubtitle: 'دار العطور الفاخرة',
      brandFull: 'عطور M20 الفاخرة',
      currency: 'ج.م',
      loading: 'جاري التحميل...',
      save: 'حفظ',
      cancel: 'إلغاء',
      viewAll: 'عرض الكل',
      shopNow: 'تسوق الآن',
      exploreCollection: 'استكشف المجموعة',
      discoverMore: 'اكتشف المزيد',
      leaveYourMark: 'اترك أثرك.',
      rightsReserved: 'جميع الحقوق محفوظة.',
      switchLang: 'English',
      switchLangShort: 'EN',
      currentLangLabel: 'العربية',
      sale: 'خصم',
      offer: 'عرض',
      new: 'جديد',
      free: 'مجاناً',
      error: 'حدث خطأ، يرجى المحاولة مرة أخرى.',
    },
    nav: {
      home: 'الرئيسية',
      men: 'رجالي',
      women: 'نسائي',
      allFragrances: 'كافة العطور',
      offers: 'العروض الخاصة',
      trackOrder: 'تتبع طلبك',
      about: 'عن دار M20',
      policies: 'خدمة العملاء',
      searchPlaceholder: 'ابحث باسم العطر أو النفحة العطرية...',
      searchAction: 'بحث',
      myAccount: 'حسابي',
      signIn: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      cartTitle: 'حقيبة التسوق',
      emptyBag: 'حقيبة التسوق فارغة',
      menu: 'القائمة',
      close: 'إغلاق',
    },
    announcement: {
      defaultText: 'شحن مجاني للطلبات المؤهلة | عينات مجانية مع كل طلب',
    },
    hero: {
      tag: 'دار عطور فاخرة • القاهرة',
      title: 'عطور نيش مصرية فاخرة',
      desc: 'عطور استثنائية مصاغة بأعلى درجات النقاء لثبات وفوحان لا يُنسى طوال اليوم.',
      shopMen: 'عطور الرجال',
      shopWomen: 'عطور النساء',
    },
    features: {
      f1Title: 'خلاصة عطرية فاخرة',
      f1Desc: 'مصاغة بعناية فائقة لثبات وفوحان يدوم طوال اليوم.',
      f2Title: 'زيوت عطرية نادرة',
      f2Desc: 'مكونات طبيعية نقية ومستخلصة بأيدي خبراء العطور.',
      f3Title: 'تغليف فاخر ومميز',
      f3Desc: 'تغليف يدوي متقن يليق بالإهداء والاقتناء الشخصي.',
      f4Title: 'شحن سريع لكافة المحافظات',
      f4Desc: 'توصيل للباب خلال 2-4 أيام مع خيار الاستلام من محطات المترو بالقاهرة.',
    },
    mostWanted: {
      tag: 'مختارات حصرية',
      title: 'العطور الأكثر طلباً',
      desc: 'اكتشف العطور الأكثر شهرة وإقبالاً والمصنوعة لتمنحك حضوراً آسراً.',
      viewAll: 'عرض كامل المجموعة',
    },
    aboutSection: {
      tag: 'أصالة وابتكار',
      title: 'دار M20 للعطور',
      desc: 'عطور مصرية صُممت في القاهرة لتمنحك ثباتاً وحضوراً لا يُنسى.',
      action: 'اقرأ قصتنا الكاملة',
    },
    offersSection: {
      tag: 'عروض حصرية لفترة محدودة',
      title: 'باقات وعروض الدار الخاصة',
      desc: 'باقات حصرية وإصدارات خاصة ومزايا استثنائية مصممة لعشاق العطور.',
      claimOffer: 'استفد من العرض',
      viewAllOffers: 'استكشف كافة العروض',
      noOffers: 'لا توجد عروض نشطة في الوقت الحالي.',
      limitedTime: 'لفترة محدودة',
    },
    productCard: {
      addToCart: 'أضف للسلة',
      quickAdd: 'إضافة سريعة',
      soldOut: 'نفد من المخزون',
      extrait: 'خلاصة عطرية فاخرة',
      viewProduct: 'عرض التفاصيل',
    },
    productDetail: {
      breadcrumbHome: 'الرئيسية',
      breadcrumbShop: 'العطور',
      concentration: 'خلاصة عطرية نقية',
      size: 'اختر الحجم',
      quantity: 'الكمية',
      inStock: 'متوفر وجاهز للشحن الفوري',
      outOfStock: 'غير متوفر حالياً',
      addToCart: 'أضف إلى حقيبة التسوق',
      addingToCart: 'جاري الإضافة...',
      addedToCart: 'تمت الإضافة بنجاح',
      viewCart: 'عرض الحقيبة',
      pyramidTitle: 'الهرم والنفحات العطرية',
      topNotes: 'مقدمة العطر',
      heartNotes: 'قلب العطر',
      baseNotes: 'قاعدة العطر',
      descriptionTitle: 'عن الابتكار العطري',
      craftsmanshipTitle: 'مواصفات الدار',
      specConcentration: 'الفئة العطرية',
      specLongevity: 'الثبات: 10-14 ساعة على البشرة والأقمشة',
      specOrigin: 'المنشأ: صُمم ورُكّب في القاهرة، مصر',
      specVolume: 'متوفر بأحجام 50 مل و100 مل',
      shippingReturnsTitle: 'الشحن والضمان الأصلي',
      shippingText: 'توصيل خلال 2-4 أيام عمل لكافة محافظات مصر. خيار استلام المترو متاح. استبدال واسترجاع ميسر خلال 14 يوماً.',
      authenticBadge: 'تركيبة أصلية معتمدة 100%',
      longevity: 'الثبات',
      sillage: 'الفوحان',
      hours: 'ساعات',
      bestFor: 'الأنسب لـ',
      taxesIncluded: 'شامل الضرائب والتغليف الفاخر',
      collectionSuffix: 'مجموعة',
      applicationTitle: 'طريقة الاستخدام والفوحان',
      applicationText: 'قم بالرش على نقاط النبض، المعصمين والرقبة وخلف الأذنين، للحصول على ثبات وفوحان آسر طوال اليوم.',
      authenticGuarantee: 'تركيبة أصلية معتمدة 100% • خلاصة عطرية نقية',
      parcelInspection: 'معاينة وفحص الطرد عند الاستلام مضمون',
    },
    cart: {
      title: 'حقيبة التسوق',
      empty: 'حقيبة التسوق فارغة حالياً',
      emptySub: 'استكشف مجموعتنا الفاخرة واختر عطرك المميز.',
      continueShopping: 'تصفح العطور',
      subtotal: 'المجموع الفرعي',
      shippingNotice: 'يتم احتساب مصاريف الشحن والضرائب عند الدفع',
      checkoutBtn: 'إتمام الطلب',
      remove: 'حذف',
      qty: 'الكمية',
      promoCodePlaceholder: 'أدخل كود الخصم',
      applyCoupon: 'تطبيق',
      couponApplied: 'تم تفعيل الكوبون',
      discount: 'الخصم',
      freeShippingProgress: 'أضف {amount} ج.م إضافية للحصول على شحن مجاني!',
      freeShippingUnlocked: 'مبروك! لقد حصلت على شحن مجاني لكافة المحافظات!',
    },
    checkout: {
      pageTitle: 'إتمام الطلب والدفع الآمن',
      step1: '1. بيانات التواصل',
      customerInfo: 'بيانات العميل والتواصل',
      fullName: 'الاسم بالكامل *',
      fullNamePlaceholder: 'مثال: أحمد محمد علي',
      phone: 'رقم الهاتف الأساسي (يفضل واتساب) *',
      phonePlaceholder: '01xxxxxxxxx',
      phone2: 'رقم هاتف إضافي (اختياري)',
      phone2Placeholder: '01xxxxxxxxx',
      email: 'البريد الإلكتروني (اختياري، لتتبع الشحنة)',
      emailPlaceholder: 'name@example.com',
      step2: '2. وجهة ومكان الاستلام',
      deliveryMethod: 'طريقة التوصيل والاستلام *',
      homeDelivery: 'توصيل إلى الباب (شحن منزلي)',
      metroPickup: 'استلام من محطة مترو القاهرة (اقتصادي)',
      governorate: 'المحافظة *',
      selectGovernorate: 'اختر المحافظة',
      city: 'المدينة / المنطقة *',
      cityPlaceholder: 'مثال: المعادي، مدينة نصر، المهندسين',
      street: 'اسم الشارع والحي *',
      streetPlaceholder: 'اسم الشارع والمنطقة بالتفصيل',
      buildingNumber: 'رقم المبنى / العمارة (اختياري)',
      buildingNumberPlaceholder: 'رقم العقار أو الفيلا',
      floor: 'الدور (اختياري)',
      floorPlaceholder: 'مثال: الدور الثالث',
      apartment: 'رقم الشقة (اختياري)',
      apartmentPlaceholder: 'رقم الشقة',
      deliveryNotes: 'علامة مميزة أو ملاحظات التسليم (اختياري)',
      deliveryNotesPlaceholder: 'مثال: بجوار بنك مصر، أو التسليم للأمن إن تعذر التواصل',
      selectMetro: 'اختر محطة المترو *',
      selectMetroPlaceholder: 'ابحث أو اختر محطة المترو المناسبة...',
      metroPickupNotice: 'سيتم التواصل معك لتأكيد الموعد والتسليم بدقة بمحطة المترو بعد مراجعة الطلب.',
      noStationsFound: 'لم يتم العثور على محطات مطابقة',
      step3: '3. طريقة الدفع *',
      paymentMethod: '3. طريقة وسيلة الدفع *',
      cod: 'الدفع عند الاستلام (COD)',
      codDesc: 'ادفع نقداً عند استلام ومعاينة طلبك.',
      instaPay: 'تحويل فوري عبر إنستاباي (InstaPay)',
      instaPayDesc: 'تحويل بنكي مباشر وسريع عبر عنوان إنستاباي.',
      vodafoneCash: 'فودافون كاش والمحافظ الإلكترونية',
      vodafoneCashDesc: 'تحويل لمحفظة فودافون كاش الرسمية.',
      card: 'بطاقة بنكية / فيزا وماستركارد (فواتيرك)',
      cardDesc: 'دفع إلكتروني آمن عبر فيزا، ماستركارد، وميزة.',
      orderSummary: 'ملخص الطلب',
      itemsCount: 'المنتجات',
      subtotal: 'المجموع الفرعي',
      discount: 'الخصم',
      shippingFee: 'مصاريف الشحن',
      metroPickupFee: 'رسوم استلام المترو',
      totalAmount: 'الإجمالي النهائي',
      free: 'مجاناً',
      calculating: 'جاري الحساب...',
      placeOrder: 'تأكيد وإتمام الطلب',
      processing: 'جاري تسجيل الطلب بأمان...',
      completeOrder: 'إتمام وتأكيد الطلب',
      processingOrder: 'جاري معالجة الطلب...',
      uploadReceipt: 'إرفاق إشعار أو لقطة شاشة التحويل *',
      uploadReceiptDesc: 'انقر هنا أو اسحب الصورة لرفع إشعار التحويل',
      transferInstructions: 'تعليمات وبيانات التحويل',
      walletNumber: 'رقم المحفظة:',
      instapayAddress: 'عنوان إنستاباي:',
      copied: 'تم النسخ',
      copy: 'نسخ',
      policyConsent: 'بتأكيدك للطلب، فإنك توافق على سياسات خدمة عملاء دار M20.',
      backToBag: 'العودة للحقيبة',
      emptyBagTitle: 'حقيبة التسوق فارغة',
      emptyBagDesc: 'يرجى إضافة منتجات إلى حقيبتك قبل المتابعة إلى الدفع.',
      exploreCatalog: 'استكشف المجموعات العطرية',
      orderConfirmedBadge: 'تم تأكيد الطلب',
      orderConfirmedTitle: 'شكراً لاختيارك دار M20',
      orderRefIs: 'رقم مرجع طلبك هو',
      orderPrepDesc: 'نعمل على تجهيز وتغليف عطرك الفاخر بكل عناية ودقة.',
      trackOrderLive: 'تتبع الشحنة لحظياً',
      returnHome: 'العودة للرئيسية',
      errorName: 'الاسم بالكامل مطلوب',
      errorPhone: 'رقم الهاتف الأساسي مطلوب',
      errorMetro: 'يرجى تحديد محطة المترو للاستلام',
      errorGov: 'المحافظة مطلوبة',
      errorCity: 'المدينة أو المنطقة مطلوبة',
      errorStreet: 'اسم الشارع مطلوب',
      errorBuilding: 'رقم المبنى / العمارة مطلوب',
      errorPayment: 'يرجى اختيار وسيلة الدفع',
      errorReceipt: 'إشعار / إيصال التحويل مطلوب',
      errorFillFields: 'يرجى استكمال جميع البيانات المطلوبة وبيانات العنوان.',
      successTitle: 'تم تسجيل طلبك بنجاح!',
      successDesc: 'شكراً لاختيارك دار M20. سيقوم فريق خدمة العملاء بمراجعة وتأكيد طلبك للشحن الفوري.',
      orderRef: 'رقم مرجع الطلب',
      trackOrderBtn: 'تتبع حالة طلبك',
    },
    tracking: {
      title: 'تتبع حالة طلبك',
      subtitle: 'أدخل رقم الطلب أو رقم الهاتف المسجل للاطلاع على خط سير الشحنة لحظياً.',
      placeholder: 'رقم الطلب (مثال: ELN-...) أو رقم الهاتف',
      trackBtn: 'تتبع الشحنة',
      searching: 'جاري البحث...',
      notFound: 'لم نتمكن من العثور على طلبات مطابقة. يرجى مراجعة رقم الطلب أو الهاتف.',
      orderInfo: 'تفاصيل الشحنة',
      status: 'حالة الطلب',
      statusPlaced: 'تم استلام الطلب',
      statusVerified: 'تم التأكيد من الدار',
      statusPackaging: 'جاري التجهيز والتغليف الفاخر',
      statusShipped: 'تم التسليم لشركة الشحن',
      statusDelivered: 'تم التسليم بنجاح',
      items: 'المنتجات المطلوبة',
      total: 'إجمالي القيمة',
      date: 'تاريخ الطلب',
    },
    about: {
      metaTitle: 'قصتنا وتراثنا • دار M20 للعطور الفاخرة',
      metaDesc: 'اكتشف قصة دار M20، دار عطور نيش مصرية حديثة تبتكر خلاصات عطرية استثنائية لحضور وثبات لا يُنسى.',
      tag: 'فلسفتنا العطرية',
      title: 'قصة دار M20',
      subtitle: 'صُممت في القاهرة لتمنحك حضوراً آسراً وبصمة لا تُنسى.',
      originLabel: 'تأسست في القاهرة، مصر',
      quote: '«العطر يجب أن يقدم أكثر من مجرد رائحة زكية، يجب أن يترك أثراً محفوراً في الذاكرة.»',
      stat1Val: 'خلاصة نقية',
      stat1Label: 'عطور نيش فاخرة',
      stat2Val: '10–14 ساعة',
      stat2Label: 'ثبات على البشرة',
      stat3Val: 'القاهرة',
      stat3Label: 'ورشة الإبداع المصرية',
      chapter1Title: '01. الحضور والهيبة',
      p1: 'أنشأنا دار M20 في قلب القاهرة كدار عطور نيش مصرية حديثة لأولئك الذين يعتبرون العطر ركيزة أساسية لشخصيتهم وهيبتهم.',
      chapter2Title: '02. تركيبات متفردة',
      p2: 'يمتلك كل عطر من M20 هوية فريدة لا تقبل المساومة. تتنوع إبداعاتنا بين الأخشاب الداكنة والعنبر المدخن إلى نفحات البرغموت والزهور المخملية، وكل تركيبة مصممة بعناية فائقة.',
      chapter3Title: '03. خلاصات عطرية فاخرة',
      p3: 'صُممت عطورنا من أنقى الزيوت العطرية لتمنحك حضوراً واثقاً وثباتاً لا يتزعزع يلائم الأجواء الدافئة والسهرات المميزة.',
      chapter4Title: '04. قيمة أصلية ومباشرة',
      pillarsTag: 'معايير دار M20',
      pillarsTitle: 'ركائز الدار',
      pillar1Title: 'أصالة مصرية راقية',
      pillar1Desc: 'استلهام آلاف السنين من تراث العطور على ضفاف النيل مع صياغتها بأحدث المعايير العالمية.',
      pillar2Title: 'صياغة عطرية نقية',
      pillar2Desc: 'التزام تام بأجود الزيوت العطرية النقية لضمان فوحان متزن وثبات يدوم طوال اليوم.',
      pillar3Title: 'قيمة نيش مباشرة',
      pillar3Desc: 'تقديم عطور فاخرة تضاهي الدور العالمية مباشرة من ورشتنا إلى عملائنا دون وسطاء.',
      craftTag: 'البنية العطرية',
      craftTitle: 'هندسة الثبات والفوحان',
      craft1Num: 'نقاء تام',
      craft1Title: 'صياغة عطرية متقنة',
      craft1Desc: 'صياغة دقيقة من زيوت عطرية عالية النقاء تمنح عمقاً متوازناً دون حدة.',
      craft2Num: '4–6 ساعات',
      craft2Title: 'فوحان متزن',
      craft2Desc: 'انتشار مدروس يعلن عن حضورك بأناقة وهدوء في الاجتماعات والمناسبات الخاصة.',
      craft3Num: '10–14 ساعة',
      craft3Title: 'ثبات على البشرة والأقمشة',
      craft3Desc: 'قاعدة عطرية ناضجة من العنبر والأخشاب والمسك مصممة للصمود طوال اليوم وحتى المساء.',
      ctaTag: 'دار M20 للعطور',
      ctaTitle: 'اختر بصمتك العطرية',
    },
    policies: {
      metaTitle: 'خدمة العملاء والسياسات • دار M20',
      title: 'خدمة العملاء والسياسات',
      subtitle: 'دليلك الشامل لسياسات الشحن، طرق الدفع، الاسترجاع، وخدمة عملاء M20.',
      shippingTitle: 'الشحن والتوصيل',
      shippingP1: 'توفر M20 خدمة الشحن لكافة محافظات جمهورية مصر العربية. يستغرق التوصيل العادي من 2 إلى 4 أيام عمل. كما يتوفر خيار الاستلام من محطات المترو كخيار اقتصادي لعملاء القاهرة والجيزة.',
      paymentsTitle: 'خيارات الدفع المتاحة',
      paymentsP1: 'نوفر الدفع نقداً عند الاستلام (COD)، والتحويل الفوري عبر إنستاباي (InstaPay)، ومحافظ فودافون كاش، والبطاقات البنكية أونلاين عبر بوابة فواتيرك الآمنة.',
      returnsTitle: 'سياسة الاستبدال والاسترجاع',
      returnsP1: 'إذا استلمت منتجاً به عيب أو تلف أو غير مطابق، يمكنك التواصل معنا خلال 14 يوماً من الاستلام لاستبداله فوراً أو استرداد كامل المبلغ دون أي تعقيد.',
      faqTitle: 'الأسئلة الشائعة',
      faq1Q: 'ما مدى ثبات عطور دار M20؟',
      faq1A: 'بفضل تركيبتنا العطرية الغنية كخلاصة عطرية نقية، تمنحك عطورنا فوحاناً ملحوظاً لمدة 4-6 ساعات وتبقى على البشرة والأقمشة لأكثر من 10-14 ساعة.',
      faq2Q: 'كيف يمكنني تتبع طلبي؟',
      faq2A: 'بكل سهولة! يمكنك زيارة صفحة "تتبع طلبك" وكتابة رقم الطلب أو هاتفك لمعرفة المرحلة التي وصلت إليها شحنتك فورياً.',
    },
    footer: {
      priveTag: 'نادي M20 الخاص',
      joinTitle: 'انضم إلى عالم M20',
      joinDesc: 'احصل على دعوات حصرية للإصدارات العطرية الجديدة والخصومات الخاصة بأعضاء الدار.',
      subscribe: 'اشتراك',
      subSuccess: 'شكراً لاشتراكك في دار M20. رحلتك العطرية تبدأ الآن.',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      brandDesc: 'دار عطور مصرية فاخرة متخصصة في ابتكار عطور استثنائية تدوم طويلاً من قلب القاهرة.',
      collections: 'المجموعات العطرية',
      theMaison: 'عن الدار',
      clientServices: 'خدمة العملاء',
      followUs: 'تابعنا على',
      allFragrances: 'جميع العطور',
      forHim: 'عطور رجالية',
      forHer: 'عطور نسائية',
      specialOffers: 'عروض حصرية',
      aboutM20: 'عن دار M20',
      storyHeritage: 'قصتنا وتراثنا',
      craftsmanship: 'حرفية الصناعة',
      sustainability: 'الجودة والاستدامة',
      trackOrder: 'تتبع طلبك',
      shippingPolicy: 'سياسة الشحن',
      returnsRefunds: 'الاسترجاع والاستبدال',
      privacyTerms: 'الخصوصية والشروط',
      faqAssistance: 'الأسئلة الشائعة والدعم',
      privacyPolicy: 'سياسة الخصوصية',
      termsOfService: 'شروط الخدمة',
      shippingDetails: 'تفاصيل التوصيل',
      rights: 'جميع الحقوق محفوظة.',
      cairoEgypt: 'القاهرة، مصر',
      callUs: 'اتصل بنا',
      whatsapp: 'واتساب',
      emailUs: 'البريد الإلكتروني',
    },
    auth: {
      signInTitle: 'تسجيل الدخول إلى حساب M20',
      signUpTitle: 'إنشاء حساب جديد في M20',
      phoneOrEmail: 'رقم الهاتف أو البريد الإلكتروني',
      phoneOrEmailPlaceholder: '01132687324 أو name@example.com',
      password: 'كلمة المرور',
      passwordPlaceholder: 'أدخل كلمة المرور الخاصة بك',
      fullName: 'الاسم بالكامل',
      fullNamePlaceholder: 'مثال: كريم أحمد',
      phone: 'رقم الهاتف',
      phonePlaceholder: '01xxxxxxxxx',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'name@example.com',
      regPasswordPlaceholder: '4 أحرف على الأقل',
      signInBtn: 'تسجيل الدخول',
      signUpBtn: 'إنشاء الحساب',
      authenticating: 'جاري التحقق والولوج...',
      sendingCode: 'جاري إرسال الرمز...',
      continueToVerification: 'المتابعة للتأكيد',
      enterOtp: 'أدخل رمز التحقق',
      otpDesc: 'تم إرسال رمز مكون من 6 أرقام إلى',
      otpSentTo: 'أرسلنا رمز تحقق مكون من 6 أرقام إلى',
      verifyBtn: 'تأكيد الرمز واكتمال الدخول',
      verifying: 'جاري التحقق من الرمز...',
      resendOtp: 'إعادة إرسال الرمز',
      resendIn: 'إعادة الإرسال بعد {s} ثانية',
      didNotReceiveEmail: 'لم يصلك رمز التأكيد؟',
      noAccount: 'ليس لديك حساب حتى الآن؟',
      createOneNow: 'أنشئ حسابك الآن',
      haveAccount: 'لديك حساب بالفعل؟',
      signInLink: 'سجل الدخول',
      welcomeBack: 'مرحباً بعودتك',
      welcomeBackDesc: 'سجّل الدخول للوصول إلى طلباتك، قائمة رغباتك، وخدماتك الحصرية.',
      createAccountDesc: 'انضم إلى دار M20 للاستفادة من الإصدارات الحصرية، تتبع الطلبات، وإتمام الشراء بسهولة.',
      verifyEmailTitle: 'تأكيد البريد الإلكتروني',
      verifyEmailDesc: 'أدخل رمز التأكيد المكون من 6 أرقام المرسل إلى بريدك الإلكتروني.',
      returnToRegistration: 'العودة إلى نموذج التسجيل',
      returnToBoutique: 'العودة إلى متجر M20',
      secureAuth: 'تسجيل دخول مشفر وآمن بالكامل بتشفير 256 بت',
      enterAllDigits: 'يرجى إدخال جميع أرقام رمز التحقق الستة.',
      emailVerified: 'تم تأكيد البريد الإلكتروني بنجاح. جاري نقلك لحسابك.',
      invalidOtp: 'رمز التحقق غير صحيح أو انتهت صلاحيته.',
      newOtpSent: 'تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني.',
      failedResend: 'فشل في إعادة إرسال الرمز.',
      loginFailed: 'تعذر تسجيل الدخول. يرجى التحقق من صحة البيانات.',
      regFailed: 'تعذر إنشاء الحساب. يرجى مراجعة البيانات المدخلة.',
      otpInstruction: 'يرجى إدخال رمز التحقق المرسل إلى بريدك الإلكتروني.',
      emailCodeTab: 'رمز البريد الإلكتروني',
      passwordTab: 'كلمة المرور',
      sendCodeBtn: 'إرسال رمز التحقق',
      emailCodeHelper: 'سنرسل رمز تحقق مؤقت مكون من 6 أرقام إلى بريدك الإلكتروني لتسجيل الدخول بأمان دون كلمة مرور.',
      returnToSignIn: 'العودة إلى تسجيل الدخول',
      checkSpamHint: 'إذا لم تجد الرسالة في البريد الوارد، يرجى التحقق من مجلد الرسائل غير المرغوب فيها (Spam) أو التحديثات.',
    },
  },
};

// Dynamic Content Translation Dictionary for Products & Fragrance Families
const PRODUCT_TRANSLATIONS = {
  'M20 NOIR': { ar: 'M20 نوار', en: 'M20 NOIR' },
  'ÉLAN NOIR': { ar: 'M20 نوار', en: 'M20 NOIR' },
  'M20 Signature Noir': { ar: 'M20 سيجنتشر نوار', en: 'M20 Signature Noir' },
  'ÉLAN Signature Noir': { ar: 'M20 سيجنتشر نوار', en: 'M20 Signature Noir' },
  'ROYAL VETIVER': { ar: 'رويال فيتيفر', en: 'ROYAL VETIVER' },
  'SOLEIL BLANC': { ar: 'سولاي بلان', en: 'SOLEIL BLANC' },
  'VELVET IRIS': { ar: 'فلفت إيريس', en: 'VELVET IRIS' },
  'IMPERIAL OUD': { ar: 'إمبريال عود', en: 'IMPERIAL OUD' },
  'ROSE MAJESTÉ': { ar: 'روز ماجستي', en: 'ROSE MAJESTÉ' },
  'ROSE MAJESTE': { ar: 'روز ماجستي', en: 'ROSE MAJESTÉ' },
};

const FAMILY_TRANSLATIONS = {
  'Woody & Amber': { ar: 'خشبي وعنبري', en: 'Woody & Amber' },
  'Fresh Earthy': { ar: 'أرضي منعش', en: 'Fresh Earthy' },
  'Floral Citrus': { ar: 'زهري حمضي', en: 'Floral Citrus' },
  'Powdery Floral': { ar: 'زهري بودري', en: 'Powdery Floral' },
  'Woody Oriental': { ar: 'خشبي شرقي', en: 'Woody Oriental' },
  'Signature': { ar: 'إصدار خاص', en: 'Signature' },
  'Woody': { ar: 'خشبي', en: 'Woody' },
  'Amber': { ar: 'عنبري', en: 'Amber' },
  'Floral': { ar: 'زهري', en: 'Floral' },
  'Fresh': { ar: 'منعش', en: 'Fresh' },
  'Oriental': { ar: 'شرقي', en: 'Oriental' },
};

const GENDER_TRANSLATIONS = {
  Men: { ar: 'رجالي', en: 'Men' },
  MEN: { ar: 'رجالي', en: 'Men' },
  Women: { ar: 'نسائي', en: 'Women' },
  WOMEN: { ar: 'نسائي', en: 'Women' },
  Unisex: { ar: 'للجنسين', en: 'Unisex' },
  UNISEX: { ar: 'للجنسين', en: 'Unisex' },
};

const NOTE_TRANSLATIONS = {
  'Black Cardamom': 'هيل أسود',
  'Saffron': 'زعفران',
  'Velvet Oud': 'عود مخملي',
  'Rose': 'ورد فاخر',
  'Smoked Amber': 'عنبر مدخن',
  'Cedarwood': 'خشب الأرز',
  'Musk': 'مسك فاخر',
  'Italian Bergamot': 'برغموت إيطالي',
  'Pink Pepper': 'فلفل وردي',
  'Haitian Vetiver': 'فيتيفر هايتي',
  'Geranium': 'إبرة الراعي',
  'Sandalwood': 'خشب الصندل',
  'White Musk': 'مسك أبيض',
  'Neroli': 'نيرولي',
  'Grapefruit': 'جريب فروت',
  'White Jasmine': 'ياسمين أبيض',
  'Tuberose': 'مسك الروم',
  'White Amber': 'عنبر أبيض',
  'Cashmere Wood': 'خشب الكشمير',
  'Vanilla': 'فانيليا ناعمة',
};

export const LanguageProvider = ({ children }) => {
  // Default language is English as required
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('m20_lang');
    return saved === 'ar' ? 'ar' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('m20_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (lang === 'ar') {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const changeLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'ar') {
      setLang(newLang);
    }
  };

  const createDeepProxy = (obj, fallbackObj) => {
    const target = obj || fallbackObj || {};
    return new Proxy(target, {
      get(t, prop) {
        if (typeof prop === 'symbol') return t[prop];
        if (prop === '$$typeof') return undefined;
        if (prop === 'toString' || prop === 'valueOf') return () => '';
        const val = (obj && prop in obj && obj[prop] !== undefined) 
          ? obj[prop] 
          : (fallbackObj && prop in fallbackObj ? fallbackObj[prop] : undefined);
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          const fbChild = fallbackObj && typeof fallbackObj === 'object' ? fallbackObj[prop] : undefined;
          return createDeepProxy(val, fbChild);
        }
        if (val !== undefined) return val;
        // Fallback to empty string so React never crashes if an undefined translation key is rendered in JSX
        return '';
      }
    });
  };

  /**
   * Translate a dotted path key (e.g. 'nav.home' or 'checkout.placeOrder')
   */
  const rawT = (path, fallback = '') => {
    if (!path) return fallback;
    const parts = String(path).split('.');
    let curr = translations[lang];
    for (const part of parts) {
      if (curr && typeof curr === 'object' && part in curr) {
        curr = curr[part];
      } else {
        // Fallback to English if not found in current language
        let fallbackCurr = translations.en;
        for (const fbPart of parts) {
          if (fallbackCurr && typeof fallbackCurr === 'object' && fbPart in fallbackCurr) {
            fallbackCurr = fallbackCurr[fbPart];
          } else {
            fallbackCurr = null;
            break;
          }
        }
        return fallbackCurr !== null && fallbackCurr !== undefined ? fallbackCurr : (fallback || path);
      }
    }
    return curr !== undefined ? curr : (fallback || path);
  };

  const currentDict = translations[lang] || translations.en;
  const fallbackDict = translations.en;
  const proxiedDict = createDeepProxy(currentDict, fallbackDict);

  // Both callable t('nav.home') AND property access t.about.metaTitle
  const t = new Proxy(rawT, {
    get(target, prop, receiver) {
      if (prop in target) return Reflect.get(target, prop, receiver);
      return proxiedDict[prop];
    }
  });

  /**
   * Helper to translate dynamic Product objects from database
   */
  const translateProduct = (product) => {
    if (!product || typeof product !== 'object') return product;

    // Clean old brand name in product name if still present
    let rawName = (product.name || '').replace(/ÉLAN|ELAN/gi, 'M20').trim();
    const localizedName = PRODUCT_TRANSLATIONS[rawName]?.[lang] || rawName;

    const rawFamily = product.fragranceFamily || '';
    const localizedFamily = FAMILY_TRANSLATIONS[rawFamily]?.[lang] || rawFamily;

    const rawGender = product.gender || 'Unisex';
    const localizedGender = GENDER_TRANSLATIONS[rawGender]?.[lang] || rawGender;

    // Translate notes if Arabic
    const translateNoteArray = (arr) => {
      if (!Array.isArray(arr)) return arr;
      if (lang === 'en') return arr;
      return arr.map((n) => NOTE_TRANSLATIONS[n] || n);
    };

    let localizedNotes = product.notes;
    if (product.notes && typeof product.notes === 'object') {
      localizedNotes = {
        top: translateNoteArray(product.notes.top),
        heart: translateNoteArray(product.notes.heart),
        base: translateNoteArray(product.notes.base),
      };
    }

    return {
      ...product,
      name: localizedName,
      fragranceFamily: localizedFamily,
      genderLabel: localizedGender,
      notes: localizedNotes,
    };
  };

  /**
   * Helper to format currency
   */
  const formatPrice = (amount) => {
    const num = Number(amount) || 0;
    const formatted = num.toLocaleString();
    return lang === 'ar' ? `${formatted} ج.م` : `${formatted} EGP`;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        dir: lang === 'ar' ? 'rtl' : 'ltr',
        isRTL: lang === 'ar',
        toggleLanguage,
        toggleLang: toggleLanguage,
        changeLanguage,
        setLang: changeLanguage,
        t,
        dict: proxiedDict,
        translateProduct,
        formatPrice,
        formatCurrency: formatPrice,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
