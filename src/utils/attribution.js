/**
 * M20 Parfums - UTM & Ad Click Attribution Tracker
 * Captures query parameters and click IDs (fbclid, ttclid) on landing,
 * auto-detects channels, and persists in localStorage for order attribution.
 */

const STORAGE_KEY = 'm20_attribution';
const STORAGE_EXPIRY_DAYS = 30;

/**
 * Read cookie value by name
 */
export const getCookie = (name) => {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : '';
};

/**
 * Capture attribution from URL or Referrer and persist in localStorage
 */
export const captureAttribution = () => {
  if (typeof window === 'undefined') return;

  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    const utmMedium = params.get('utm_medium');
    const utmCampaign = params.get('utm_campaign');
    const utmContent = params.get('utm_content');
    const utmTerm = params.get('utm_term');
    const fbclid = params.get('fbclid');
    const ttclid = params.get('ttclid');

    const referrer = document.referrer || '';
    const hasIncomingAttribution = utmSource || fbclid || ttclid || utmCampaign;

    let source = utmSource || '';
    let medium = utmMedium || '';
    let channel = 'direct';

    // Auto-detect source & channel if click ID is present
    if (fbclid) {
      if (!source) source = 'meta';
      if (!medium) medium = 'cpc';
      channel = 'meta';
    } else if (ttclid) {
      if (!source) source = 'tiktok';
      if (!medium) medium = 'cpc';
      channel = 'tiktok';
    } else if (source) {
      const s = source.toLowerCase();
      if (s.includes('facebook') || s.includes('instagram') || s.includes('meta')) {
        channel = 'meta';
      } else if (s.includes('tiktok')) {
        channel = 'tiktok';
      } else if (s.includes('google')) {
        channel = 'google';
      } else {
        channel = medium.toLowerCase().includes('cpc') ? 'other' : 'organic';
      }
    } else if (referrer) {
      const ref = referrer.toLowerCase();
      if (ref.includes('facebook.com') || ref.includes('instagram.com')) {
        source = 'meta';
        medium = 'referral';
        channel = 'meta';
      } else if (ref.includes('tiktok.com')) {
        source = 'tiktok';
        medium = 'referral';
        channel = 'tiktok';
      } else if (ref.includes('google.')) {
        source = 'google';
        medium = 'organic';
        channel = 'google';
      } else {
        source = 'referral';
        medium = 'referral';
        channel = 'referral';
      }
    } else {
      source = 'direct';
      medium = 'none';
      channel = 'direct';
    }

    // If new incoming campaign or no previous attribution stored, store it
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    let existing = null;
    try {
      existing = existingRaw ? JSON.parse(existingRaw) : null;
    } catch (_) {
      existing = null;
    }

    if (hasIncomingAttribution || !existing) {
      const attributionData = {
        source: source.trim().toLowerCase(),
        medium: medium.trim().toLowerCase(),
        campaign: (utmCampaign || existing?.campaign || '').trim(),
        content: (utmContent || existing?.content || '').trim(),
        term: (utmTerm || existing?.term || '').trim(),
        fbclid: (fbclid || existing?.fbclid || '').trim(),
        ttclid: (ttclid || existing?.ttclid || '').trim(),
        channel,
        landingUrl: window.location.href,
        referrer,
        capturedAt: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(attributionData));
    }
  } catch (err) {
    // Fail silently without disrupting user flow
    console.debug('[Attribution] Capture error:', err);
  }
};

/**
 * Get active stored attribution data to attach to Order payload
 */
export const getStoredAttribution = () => {
  if (typeof window === 'undefined') return { source: 'direct', medium: 'none', channel: 'direct' };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { source: 'direct', medium: 'none', channel: 'direct' };
    const parsed = JSON.parse(raw);

    // Verify expiry (30 days)
    if (parsed.capturedAt) {
      const ageDays = (Date.now() - new Date(parsed.capturedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (ageDays > STORAGE_EXPIRY_DAYS) {
        localStorage.removeItem(STORAGE_KEY);
        return { source: 'direct', medium: 'none', channel: 'direct' };
      }
    }
    return parsed;
  } catch (_) {
    return { source: 'direct', medium: 'none', channel: 'direct' };
  }
};

/**
 * Get Meta Pixel Cookie identifiers for high CAPI matching
 */
export const getMetaCookies = () => {
  const fbp = getCookie('_fbp');
  const fbc = getCookie('_fbc');
  return { fbp, fbc };
};
