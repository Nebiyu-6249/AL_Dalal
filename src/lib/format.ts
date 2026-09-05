import type { Service, Settings, Hours } from '@/db/schema';
import { type Lang, dict, pick } from './i18n';

/** "AED 350 to 700", "AED 20 per line", "AED 250 each". */
export function price(s: Service, lang: Lang) {
  const d = dict(lang);
  const unit = pick(s as unknown as Record<string, unknown>, 'unit', lang);
  const range = s.priceTo && s.priceTo !== s.priceFrom
    ? `${s.priceFrom}\u2009-\u2009${s.priceTo}`
    : `${s.priceFrom}`;
  return `${d.aed} ${range}${unit ? ` ${unit}` : ''}`;
}

/** Digits only, as wa.me requires. */
export const waNumber = (settings: Settings) => settings.whatsapp.replace(/\D/g, '');

export function whatsappLink(settings: Settings, message?: string) {
  const base = `https://wa.me/${waNumber(settings)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Pre-filled messages, so the salon knows what the enquiry is about
 *  before anyone types a reply. */
export const waMessage = {
  general: (lang: Lang) => lang === 'ar'
    ? 'مرحبًا صالون الدلال، أرغب في حجز موعد.'
    : "Hello Al Dalal, I'd like to book an appointment.",
  category: (lang: Lang, name: string) => lang === 'ar'
    ? `مرحبًا، أود الاستفسار عن ${name}.`
    : `Hello, I'd like to ask about ${name}.`,
  service: (lang: Lang, name: string, p: string) => lang === 'ar'
    ? `مرحبًا، أرغب في حجز: ${name} (${p}).`
    : `Hello, I'd like to book: ${name} (${p}).`,
  gift: (lang: Lang, name: string) => lang === 'ar'
    ? `مرحبًا، أرغب في الاستفسار عن بطاقة هدية ${name}.`
    : `Hello, I'd like to ask about the ${name} gift card.`,
};

export const telLink = (settings: Settings) => `tel:${settings.phone.replace(/[^\d+]/g, '')}`;

/** "+971 7 208 2308" from "+97172082308". */
export function prettyPhone(raw: string) {
  const d = raw.replace(/\D/g, '');
  if (d.startsWith('9715') && d.length === 12) {
    return `+971 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
  }
  if (d.startsWith('9717') && d.length === 11) {
    return `+971 ${d.slice(3, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  }
  return raw;
}

/** True when every open day shares the same hours, which lets the site say
 *  "every day, 10:00 to 22:00" instead of printing seven identical rows. */
export function uniformHours(hours: Hours[]) {
  const open = hours.filter((h) => !h.closed);
  if (open.length !== 7) return null;
  const first = open[0];
  return open.every((h) => h.opens === first.opens && h.closes === first.closes) ? first : null;
}

/** 24h to a readable clock, in the right language. */
export function clock(hhmm: string, lang: Lang) {
  const [h, m] = hhmm.split(':').map(Number);
  if (lang === 'ar') {
    const period = h < 12 ? 'صباحًا' : 'مساءً';
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}:${String(m).padStart(2, '0')} ${period}`;
  }
  const period = h < 12 ? 'am' : 'pm';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hh}${period}` : `${hh}:${String(m).padStart(2, '0')}${period}`;
}

/**
 * The canonical origin.
 *
 * Until NEXT_PUBLIC_SITE_URL is set to the real domain, this returns null and
 * every page is served with noindex. That keeps the .vercel.app preview address
 * out of Google, so it cannot compete with the real domain later on.
 */
export function siteUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;
  const withProtocol = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, '');
}

export const isLive = () => siteUrl() !== null;
export const origin = () => siteUrl() ?? 'https://aldalal.example';
