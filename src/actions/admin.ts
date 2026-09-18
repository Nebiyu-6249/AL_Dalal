'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/content';
import { getSession } from '@/lib/auth';
import * as schema from '@/db/schema';

/** Every action goes through here, so a missing session can never write. */
async function guard() {
  const session = await getSession();
  if (!session) throw new Error('Not signed in.');
  const db = getDb();
  if (!db) throw new Error('DATABASE_URL is not set, so nothing can be saved yet.');
  return db;
}

/** Rebuilds the public pages after a write. Without this the visitor keeps
 *  seeing the cached version until the hourly revalidate comes round. */
function refresh() {
  revalidatePath('/', 'layout');
  revalidatePath('/ar', 'layout');
}

export type ActionState = { ok: boolean; message: string };

const str = (f: FormData, k: string) => String(f.get(k) ?? '').trim();
const num = (f: FormData, k: string) => {
  const v = str(f, k);
  return v === '' ? null : Number(v);
};
const bool = (f: FormData, k: string) => f.get(k) === 'on' || f.get(k) === 'true';

const run = async (fn: () => Promise<void>, message: string): Promise<ActionState> => {
  try {
    await fn();
    refresh();
    return { ok: true, message };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Could not save.' };
  }
};

/* ---------------------------------------------------------------- services */

export async function saveService(_prev: ActionState, f: FormData): Promise<ActionState> {
  return run(async () => {
    const db = await guard();
    const id = num(f, 'id');
    const values = {
      categorySlug: str(f, 'categorySlug'),
      groupEn: str(f, 'groupEn'), groupAr: str(f, 'groupAr'),
      nameEn: str(f, 'nameEn'), nameAr: str(f, 'nameAr'),
      noteEn: str(f, 'noteEn'), noteAr: str(f, 'noteAr'),
      sortOrder: Number(str(f, 'sortOrder') || 0),
      published: bool(f, 'published'),
    };
    if (!values.nameEn) throw new Error('The English name cannot be empty.');
    // The price columns stay in the database so prices can be switched back on
    // later without re-entering 74 numbers. Nothing reads them any more, so an
    // update leaves whatever is there alone and a new row takes a zero, which
    // price_from being NOT NULL requires.
    if (id) await db.update(schema.services).set(values).where(eq(schema.services.id, id));
    else await db.insert(schema.services).values({ ...values, priceFrom: 0 });
  }, 'Saved.');
}

export async function deleteService(_prev: ActionState, f: FormData): Promise<ActionState> {
  return run(async () => {
    const db = await guard();
    const id = num(f, 'id');
    if (id) await db.delete(schema.services).where(eq(schema.services.id, id));
  }, 'Removed.');
}

export async function saveCategory(_prev: ActionState, f: FormData): Promise<ActionState> {
  return run(async () => {
    const db = await guard();
    const id = num(f, 'id');
    if (!id) throw new Error('Missing category.');
    await db.update(schema.categories).set({
      nameEn: str(f, 'nameEn'), nameAr: str(f, 'nameAr'),
      taglineEn: str(f, 'taglineEn'), taglineAr: str(f, 'taglineAr'),
      introEn: str(f, 'introEn'), introAr: str(f, 'introAr'),
      tileImage: str(f, 'tileImage'), heroImage: str(f, 'heroImage'),
      sortOrder: Number(str(f, 'sortOrder') || 0),
      published: bool(f, 'published'),
    }).where(eq(schema.categories.id, id));
  }, 'Saved.');
}

/* ------------------------------------------------------- contact and hours */

export async function saveSettings(_prev: ActionState, f: FormData): Promise<ActionState> {
  return run(async () => {
    const db = await guard();
    const values = {
      whatsapp: str(f, 'whatsapp').replace(/\D/g, ''),
      phone: str(f, 'phone'),
      email: str(f, 'email'),
      addressEn: str(f, 'addressEn'), addressAr: str(f, 'addressAr'),
      mapsUrl: str(f, 'mapsUrl'),
      instagram: str(f, 'instagram'), tiktok: str(f, 'tiktok'),
      latitude: Number(str(f, 'latitude') || 0),
      longitude: Number(str(f, 'longitude') || 0),
      menuPdf: str(f, 'menuPdf'),
      noticeEn: str(f, 'noticeEn'), noticeAr: str(f, 'noticeAr'),
      noticeActive: bool(f, 'noticeActive'),
    };
    if (!values.whatsapp) throw new Error('The WhatsApp number cannot be empty.');
    const existing = await db.select().from(schema.settings).limit(1);
    if (existing[0]) {
      await db.update(schema.settings).set(values).where(eq(schema.settings.id, existing[0].id));
    } else {
      await db.insert(schema.settings).values({ id: 1, ...values });
    }
  }, 'Contact details saved.');
}

export async function saveHours(_prev: ActionState, f: FormData): Promise<ActionState> {
  return run(async () => {
    const db = await guard();
    for (let weekday = 0; weekday < 7; weekday += 1) {
      const values = {
        opens: str(f, `opens-${weekday}`) || '10:00',
        closes: str(f, `closes-${weekday}`) || '22:00',
        closed: bool(f, `closed-${weekday}`),
      };
      const row = await db.select().from(schema.hours).where(eq(schema.hours.weekday, weekday));
      if (row[0]) await db.update(schema.hours).set(values).where(eq(schema.hours.id, row[0].id));
      else await db.insert(schema.hours).values({ weekday, ...values });
    }
  }, 'Opening hours saved.');
}

/* -------------------------------------------------------------- gift cards */

export async function saveGiftCard(_prev: ActionState, f: FormData): Promise<ActionState> {
  return run(async () => {
    const db = await guard();
    const id = num(f, 'id');
    const values = {
      slug: str(f, 'slug') || str(f, 'titleEn').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      titleEn: str(f, 'titleEn'), titleAr: str(f, 'titleAr'),
      bodyEn: str(f, 'bodyEn'), bodyAr: str(f, 'bodyAr'),
      image: str(f, 'image'),
      yearRound: bool(f, 'yearRound'),
      sortOrder: Number(str(f, 'sortOrder') || 0),
      published: bool(f, 'published'),
    };
    if (!values.titleEn) throw new Error('The English title cannot be empty.');
    if (id) await db.update(schema.giftCards).set(values).where(eq(schema.giftCards.id, id));
    else await db.insert(schema.giftCards).values(values);
  }, 'Saved.');
}

export async function deleteGiftCard(_prev: ActionState, f: FormData): Promise<ActionState> {
  return run(async () => {
    const db = await guard();
    const id = num(f, 'id');
    if (id) await db.delete(schema.giftCards).where(eq(schema.giftCards.id, id));
  }, 'Removed.');
}

/* ------------------------------------------------------------ testimonials */

export async function saveTestimonial(_prev: ActionState, f: FormData): Promise<ActionState> {
  return run(async () => {
    const db = await guard();
    const id = num(f, 'id');
    const values = {
      name: str(f, 'name'),
      rating: Math.min(5, Math.max(1, Number(str(f, 'rating') || 5))),
      bodyEn: str(f, 'bodyEn'), bodyAr: str(f, 'bodyAr'),
      saidOn: str(f, 'saidOn'), source: str(f, 'source') || 'Google',
      sortOrder: Number(str(f, 'sortOrder') || 0),
      published: bool(f, 'published'),
    };
    if (!values.name || !values.bodyEn) throw new Error('A name and a review are both needed.');
    if (id) await db.update(schema.testimonials).set(values).where(eq(schema.testimonials.id, id));
    else await db.insert(schema.testimonials).values(values);
  }, 'Saved.');
}

export async function deleteTestimonial(_prev: ActionState, f: FormData): Promise<ActionState> {
  return run(async () => {
    const db = await guard();
    const id = num(f, 'id');
    if (id) await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id));
  }, 'Removed.');
}

/* --------------------------------------------------------------------- faq */

export async function saveFaq(_prev: ActionState, f: FormData): Promise<ActionState> {
  return run(async () => {
    const db = await guard();
    const id = num(f, 'id');
    const values = {
      page: str(f, 'page') || 'home',
      questionEn: str(f, 'questionEn'), questionAr: str(f, 'questionAr'),
      answerEn: str(f, 'answerEn'), answerAr: str(f, 'answerAr'),
      sortOrder: Number(str(f, 'sortOrder') || 0),
      published: bool(f, 'published'),
    };
    if (!values.questionEn || !values.answerEn) {
      throw new Error('The English question and answer are both needed.');
    }
    if (id) await db.update(schema.faqs).set(values).where(eq(schema.faqs.id, id));
    else await db.insert(schema.faqs).values(values);
  }, 'Saved.');
}

export async function deleteFaq(_prev: ActionState, f: FormData): Promise<ActionState> {
  return run(async () => {
    const db = await guard();
    const id = num(f, 'id');
    if (id) await db.delete(schema.faqs).where(eq(schema.faqs.id, id));
  }, 'Removed.');
}

/* ------------------------------------------------------------------ photos */

export async function savePhoto(_prev: ActionState, f: FormData): Promise<ActionState> {
  return run(async () => {
    const db = await guard();
    const id = num(f, 'id');
    const values = {
      slot: str(f, 'slot'),
      url: str(f, 'url'),
      altEn: str(f, 'altEn'), altAr: str(f, 'altAr'),
      width: Number(str(f, 'width') || 0),
      height: Number(str(f, 'height') || 0),
      sortOrder: Number(str(f, 'sortOrder') || 0),
      published: bool(f, 'published'),
    };
    if (!values.url) throw new Error('Upload a photo first, or paste its address.');
    if (!values.altEn) throw new Error('Describe the photo in English, for screen readers and for Google.');
    if (id) await db.update(schema.photos).set(values).where(eq(schema.photos.id, id));
    else await db.insert(schema.photos).values(values);
  }, 'Saved.');
}

export async function deletePhoto(_prev: ActionState, f: FormData): Promise<ActionState> {
  return run(async () => {
    const db = await guard();
    const id = num(f, 'id');
    if (id) await db.delete(schema.photos).where(eq(schema.photos.id, id));
  }, 'Removed.');
}
