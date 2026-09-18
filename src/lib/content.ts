import { cache } from 'react';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { asc, eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import type {
  Category, Service, Settings, Hours, GiftCard, Testimonial, Faq, Photo,
} from '@/db/schema';
import {
  SETTINGS, HOURS, CATEGORIES, SERVICES, GIFT_CARDS, TESTIMONIALS, FAQS, PHOTOS,
} from '@/db/content';
import { type Lang, pick } from './i18n';

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);

/** Single Drizzle client. Returns null when DATABASE_URL is not configured,
 *  which is how the site keeps working before the database is set up. */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return drizzle(neon(url), { schema });
}

export type Content = {
  settings: Settings;
  hours: Hours[];
  categories: Category[];
  services: Service[];
  giftCards: GiftCard[];
  testimonials: Testimonial[];
  faqs: Faq[];
  photos: Photo[];
  fromDatabase: boolean;
};

/** The seed content, shaped exactly like a database row set. */
function fallback(): Content {
  const id = (i: number) => i + 1;
  return {
    settings: { ...SETTINGS } as Settings,
    hours: HOURS.map((h, i) => ({ id: id(i), ...h })) as Hours[],
    categories: CATEGORIES.map((c, i) => ({ id: id(i), published: true, ...c })) as Category[],
    services: SERVICES.map((s, i) => ({
      ...s,
      id: id(i),
      published: true,
      priceTo: s.priceTo ?? null,
      noteEn: s.noteEn ?? '', noteAr: s.noteAr ?? '',
      unitEn: s.unitEn ?? '', unitAr: s.unitAr ?? '',
      sortOrder: (s as { sortOrder?: number }).sortOrder ?? i,
    })) as Service[],
    giftCards: GIFT_CARDS.map((g, i) => ({ id: id(i), published: true, ...g })) as GiftCard[],
    testimonials: TESTIMONIALS.map((t, i) => ({ id: id(i), published: true, ...t })) as Testimonial[],
    faqs: FAQS.map((f, i) => ({ id: id(i), published: true, ...f })) as Faq[],
    photos: PHOTOS.map((p, i) => ({ id: id(i), published: true, ...p })) as Photo[],
    fromDatabase: false,
  };
}

/** Loaded once per request. Falls back to the seed content if the database is
 *  missing, empty, or unreachable, so a bad connection degrades to a working
 *  site rather than an error page. */
export const getContent = cache(async (): Promise<Content> => {
  const db = getDb();
  if (!db) return fallback();

  try {
    const [settings, hours, categories, services, giftCards, testimonials, faqs, photos] =
      await Promise.all([
        db.select().from(schema.settings).limit(1),
        db.select().from(schema.hours).orderBy(asc(schema.hours.weekday)),
        db.select().from(schema.categories)
          .where(eq(schema.categories.published, true)).orderBy(asc(schema.categories.sortOrder)),
        db.select().from(schema.services)
          .where(eq(schema.services.published, true)).orderBy(asc(schema.services.sortOrder)),
        db.select().from(schema.giftCards)
          .where(eq(schema.giftCards.published, true)).orderBy(asc(schema.giftCards.sortOrder)),
        db.select().from(schema.testimonials)
          .where(eq(schema.testimonials.published, true)).orderBy(asc(schema.testimonials.sortOrder)),
        db.select().from(schema.faqs)
          .where(eq(schema.faqs.published, true)).orderBy(asc(schema.faqs.sortOrder)),
        db.select().from(schema.photos)
          .where(eq(schema.photos.published, true)).orderBy(asc(schema.photos.sortOrder)),
      ]);

    if (!settings[0] || categories.length === 0) return fallback();

    return {
      settings: settings[0], hours, categories, services,
      giftCards, testimonials, faqs, photos, fromDatabase: true,
    };
  } catch {
    // Tables not created yet, or the database is asleep. Serve the seed content.
    return fallback();
  }
});

/** Unfiltered read for the admin panel, including hidden rows. */
export async function getAdminContent() {
  const db = getDb();
  if (!db) return null;
  const [settings, hours, categories, services, giftCards, testimonials, faqs, photos] =
    await Promise.all([
      db.select().from(schema.settings).limit(1),
      db.select().from(schema.hours).orderBy(asc(schema.hours.weekday)),
      db.select().from(schema.categories).orderBy(asc(schema.categories.sortOrder)),
      db.select().from(schema.services).orderBy(asc(schema.services.sortOrder)),
      db.select().from(schema.giftCards).orderBy(asc(schema.giftCards.sortOrder)),
      db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.sortOrder)),
      db.select().from(schema.faqs).orderBy(asc(schema.faqs.sortOrder)),
      db.select().from(schema.photos).orderBy(asc(schema.photos.sortOrder)),
    ]);
  return {
    settings: settings[0] ?? ({ ...SETTINGS } as Settings),
    hours, categories, services, giftCards, testimonials, faqs, photos,
  };
}

/* ------------------------------------------------------------------ helpers */

export const servicesFor = (c: Content, slug: string) =>
  c.services.filter((s) => s.categorySlug === slug);

export const faqsFor = (c: Content, page: string) =>
  c.faqs.filter((f) => f.page === page);

export const photosFor = (c: Content, slot: string) =>
  c.photos.filter((p) => p.slot === slot);

export const categoryBySlug = (c: Content, slug: string) =>
  c.categories.find((x) => x.slug === slug);

/** The first few service names in a category, for the line under a tile. */
export const leadServices = (c: Content, slug: string, lang: Lang, count = 3) =>
  servicesFor(c, slug).slice(0, count)
    .map((s) => pick(s as unknown as Record<string, unknown>, 'name', lang));

/** Groups a category's services in menu order, keeping the printed headings. */
export function grouped(c: Content, slug: string) {
  const out: Array<{ en: string; ar: string; items: Service[] }> = [];
  for (const s of servicesFor(c, slug)) {
    const last = out[out.length - 1];
    if (last && last.en === s.groupEn) last.items.push(s);
    else out.push({ en: s.groupEn, ar: s.groupAr, items: [s] });
  }
  return out;
}
