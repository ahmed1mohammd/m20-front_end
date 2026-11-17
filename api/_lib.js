export const SITE = 'https://m20fragrance.store';

export const API_BASE = () =>
  (process.env.API_URL || process.env.VITE_API_URL || '').replace(/\/+$/, '');

export const esc = (v = '') =>
  String(v)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export const absUrl = (u = '') => (!u ? '' : /^https?:\/\//i.test(u) ? u : `${SITE}${u.startsWith('/') ? '' : '/'}${u}`);

export async function apiGet(path) {
  const base = API_BASE();
  if (!base) return null;
  try {
    const res = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    return (await res.json())?.data ?? null;
  } catch {
    return null;
  }
}
