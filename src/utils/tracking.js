/**
 * M20 Parfums - E-Commerce Analytics & Ad Pixel Tracker
 * Standardized Meta Pixel (fbq) & TikTok Pixel (ttq) integration
 * Supporting exact currency ('EGP'), integer values, and deduplicated event IDs.
 */

import { getStoredAttribution } from './attribution';

let isInitialized = false;
let pixelsReady = false;
const pendingPixelCalls = [];

/**
 * Run pixel calls once Meta/TikTok scripts are initialised. Events that fire
 * before the public settings arrive (first PageView, direct product/checkout
 * visits) are queued and flushed by initTracking instead of being dropped.
 */
const firePixels = (fn) => {
  if (typeof window === 'undefined') return;
  if (pixelsReady) {
    try { fn(); } catch (_) {}
  } else if (pendingPixelCalls.length < 50) {
    pendingPixelCalls.push(fn);
  }
};

const flushPixelCalls = () => {
  pixelsReady = true;
  while (pendingPixelCalls.length) {
    const fn = pendingPixelCalls.shift();
    try { fn(); } catch (_) {}
  }
};
let configuredMetaId = '';
let configuredTikTokId = '';

/**
 * Generate or read unique session ID for conversion funnel tracking
 */
const getSessionId = () => {
  if (typeof window === 'undefined') return 'sid_default';
  try {
    let sid = sessionStorage.getItem('m20_funnel_sid');
    if (!sid) {
      sid = 'm20_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
      sessionStorage.setItem('m20_funnel_sid', sid);
    }
    return sid;
  } catch (_) {
    return 'sid_' + Date.now();
  }
};

/**
 * Record internal funnel event in MongoDB non-blocking
 */
const sendInternalFunnelEvent = (eventType, extra = {}) => {
  try {
    if (typeof window === 'undefined') return;
    const attr = getStoredAttribution();
    const payload = {
      eventType,
      platform: attr.channel || 'direct',
      campaign: attr.campaign || '',
      content: attr.content || '',
      sessionId: getSessionId(),
      path: window.location.pathname,
      ...extra
    };

    const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : 'http://localhost:5000/api';
    const apiUrl = `${baseUrl.replace(/\/+$/, '')}/marketing/event`;
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(apiUrl, blob);
    } else {
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    }
  } catch (_) {}
};

/**
 * Initialize Meta and TikTok Pixels dynamically
 */
export const initTracking = ({
  enableTracking = true,
  metaPixelId = '',
  tiktokPixelId = ''
} = {}) => {
  if (typeof window === 'undefined' || isInitialized) return;
  if (!enableTracking) {
    pendingPixelCalls.length = 0;
    return;
  }

  configuredMetaId = (metaPixelId || '').trim();
  configuredTikTokId = (tiktokPixelId || '').trim();

  // 1. Inject & Init Meta Pixel if ID is provided
  if (configuredMetaId && !window.fbq) {
    try {
      /* eslint-disable */
      (function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)})(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */

      window.fbq('init', configuredMetaId);
    } catch (e) {
      console.debug('[Tracking] Meta Pixel init skipped/blocked');
    }
  }

  // 2. Inject & Init TikTok Pixel if ID is provided
  if (configuredTikTokId && !window.ttq) {
    try {
      /* eslint-disable */
      (function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
        var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script")
        ;a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)};
      })(window, document, 'ttq');
      /* eslint-enable */

      window.ttq.load(configuredTikTokId);
    } catch (e) {
      console.debug('[Tracking] TikTok Pixel init skipped/blocked');
    }
  }

  isInitialized = true;
  flushPixelCalls();
};

/**
 * 1. Track PageView on route changes
 */
export const trackPageView = (path = '') => {
  try {
    sendInternalFunnelEvent('page_view', { path });
    firePixels(() => {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'PageView');
      }
      if (window.ttq && typeof window.ttq.page === 'function') {
        window.ttq.page();
      }
    });
  } catch (_) {}
};

/**
 * 2. Track ViewContent on product detail page
 */
export const trackViewContent = ({
  id,
  name,
  price = 0,
  size = '50ml',
  category = 'Fragrance'
} = {}) => {
  try {
    const val = Math.round(Number(price) || 0);
    const contentId = String(id || name || 'm20-fragrance');
    sendInternalFunnelEvent('view_content', { productId: id, productName: name, value: val });

    firePixels(() => {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'ViewContent', {
          content_name: name,
          content_ids: [contentId],
          content_type: 'product',
          content_category: category,
          value: val,
          currency: 'EGP'
        });
      }
      if (window.ttq && typeof window.ttq.track === 'function') {
        window.ttq.track('ViewContent', {
          content_id: contentId,
          content_name: name,
          content_type: 'product',
          content_category: category,
          value: val,
          currency: 'EGP'
        });
      }
    });
  } catch (_) {}
};

/**
 * 3. Track AddToCart when customer adds bottle
 */
export const trackAddToCart = ({
  id,
  name,
  price = 0,
  quantity = 1,
  size = '50ml',
  category = 'Fragrance'
} = {}) => {
  try {
    const unitPrice = Math.round(Number(price) || 0);
    const qty = Math.max(1, Number(quantity) || 1);
    const totalVal = unitPrice * qty;
    const contentId = String(id || name || 'm20-fragrance');
    sendInternalFunnelEvent('add_to_cart', { productId: id, productName: `${name} (${size})`, value: totalVal });

    firePixels(() => {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'AddToCart', {
          content_name: `${name} (${size})`,
          content_ids: [contentId],
          content_type: 'product',
          value: totalVal,
          currency: 'EGP'
        });
      }
      if (window.ttq && typeof window.ttq.track === 'function') {
        window.ttq.track('AddToCart', {
          content_id: contentId,
          content_name: `${name} (${size})`,
          content_type: 'product',
          value: totalVal,
          quantity: qty,
          price: unitPrice,
          currency: 'EGP'
        });
      }
    });
  } catch (_) {}
};

/**
 * 4. Track InitiateCheckout
 */
export const trackInitiateCheckout = ({
  items = [],
  total = 0
} = {}) => {
  try {
    const val = Math.round(Number(total) || 0);
    const contentIds = items.map(i => String(i.productId || i.id || i.name));
    const numItems = items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);
    sendInternalFunnelEvent('initiate_checkout', { value: val });

    firePixels(() => {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout', {
          content_ids: contentIds,
          content_type: 'product',
          num_items: numItems,
          value: val,
          currency: 'EGP'
        });
      }
      if (window.ttq && typeof window.ttq.track === 'function') {
        window.ttq.track('InitiateCheckout', {
          contents: items.map(i => ({
            content_id: String(i.productId || i.id || i.name),
            quantity: Number(i.quantity) || 1,
            price: Math.round(Number(i.price) || 0)
          })),
          value: val,
          currency: 'EGP'
        });
      }
    });
  } catch (_) {}
};

/**
 * 5. Track Purchase with deduplicated eventId matching Meta CAPI
 */
export const trackPurchase = ({
  orderNumber,
  total = 0,
  items = [],
  eventId
} = {}) => {
  try {
    const val = Math.round(Number(total) || 0);
    const resolvedEventId = eventId || `order_${orderNumber}`;
    sendInternalFunnelEvent('purchase', { value: val, orderNumber });
    const contentIds = items.map(i => String(i.productId || i.variantSKU || i.id || i.name));
    const numItems = items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);

    firePixels(() => {
      // Meta Pixel Purchase with eventID for Server CAPI deduplication
      if (typeof window.fbq === 'function') {
        window.fbq(
          'track',
          'Purchase',
          {
            content_name: `Order #${orderNumber}`,
            content_ids: contentIds,
            content_type: 'product',
            num_items: numItems,
            value: val,
            currency: 'EGP'
          },
          { eventID: resolvedEventId }
        );
      }

      // TikTok Pixel CompletePayment with event_id
      if (window.ttq && typeof window.ttq.track === 'function') {
        window.ttq.track(
          'CompletePayment',
          {
            contents: items.map(i => ({
              content_id: String(i.productId || i.variantSKU || i.id || i.name),
              quantity: Number(i.quantity) || 1,
              price: Math.round(Number(i.price) || 0)
            })),
            value: val,
            currency: 'EGP'
          },
          { event_id: resolvedEventId }
        );
      }
    });
  } catch (_) {}
};
