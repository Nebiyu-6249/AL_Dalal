import { NextResponse, type NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/content';
import * as schema from '@/db/schema';
import {
  SETTINGS, HOURS, CATEGORIES, SERVICES, GIFT_CARDS, TESTIMONIALS, FAQS, PHOTOS,
} from '@/db/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Visit once after deploying:
 *   https://your-domain.com/api/setup?secret=YOUR_SETUP_SECRET
 *
 * It creates the tables if they are missing and fills them with the printed
 * menu. Running it a second time changes nothing, because every insert is
 * skipped when the table already holds rows. Nothing you have edited in
 * /admin can be overwritten by re-running it.
 */

const DDL = `
CREATE TABLE IF NOT EXISTS categories (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name_en text NOT NULL, name_ar text NOT NULL,
  tagline_en text NOT NULL DEFAULT '', tagline_ar text NOT NULL DEFAULT '',
  intro_en text NOT NULL DEFAULT '', intro_ar text NOT NULL DEFAULT '',
  tile_image text NOT NULL DEFAULT '', hero_image text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS services (
  id serial PRIMARY KEY,
  category_slug text NOT NULL,
  group_en text NOT NULL DEFAULT '', group_ar text NOT NULL DEFAULT '',
  name_en text NOT NULL, name_ar text NOT NULL,
  note_en text NOT NULL DEFAULT '', note_ar text NOT NULL DEFAULT '',
  price_from integer NOT NULL, price_to integer,
  unit_en text NOT NULL DEFAULT '', unit_ar text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS settings (
  id integer PRIMARY KEY DEFAULT 1,
  whatsapp text NOT NULL, phone text NOT NULL, email text NOT NULL,
  address_en text NOT NULL, address_ar text NOT NULL,
  maps_url text NOT NULL, instagram text NOT NULL, tiktok text NOT NULL,
  latitude real NOT NULL, longitude real NOT NULL,
  menu_pdf text NOT NULL DEFAULT '',
  notice_en text NOT NULL DEFAULT '', notice_ar text NOT NULL DEFAULT '',
  notice_active boolean NOT NULL DEFAULT false
);
CREATE TABLE IF NOT EXISTS hours (
  id serial PRIMARY KEY,
  weekday integer NOT NULL,
  opens text NOT NULL DEFAULT '10:00', closes text NOT NULL DEFAULT '22:00',
  closed boolean NOT NULL DEFAULT false
);
CREATE TABLE IF NOT EXISTS gift_cards (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title_en text NOT NULL, title_ar text NOT NULL,
  body_en text NOT NULL DEFAULT '', body_ar text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  year_round boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS testimonials (
  id serial PRIMARY KEY,
  name text NOT NULL, rating integer NOT NULL DEFAULT 5,
  body_en text NOT NULL, body_ar text NOT NULL DEFAULT '',
  said_on text NOT NULL DEFAULT '', source text NOT NULL DEFAULT 'Google',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS faqs (
  id serial PRIMARY KEY,
  page text NOT NULL DEFAULT 'home',
  question_en text NOT NULL, question_ar text NOT NULL,
  answer_en text NOT NULL, answer_ar text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS photos (
  id serial PRIMARY KEY,
  slot text NOT NULL, url text NOT NULL,
  alt_en text NOT NULL DEFAULT '', alt_ar text NOT NULL DEFAULT '',
  width integer NOT NULL DEFAULT 0, height integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS admins (
  id serial PRIMARY KEY,
  email text NOT NULL UNIQUE, name text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS services_category_idx ON services (category_slug);
CREATE INDEX IF NOT EXISTS photos_slot_idx ON photos (slot);
CREATE INDEX IF NOT EXISTS faqs_page_idx ON faqs (page);
`;

export async function GET(req: NextRequest) {
  const secret = process.env.SETUP_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: 'SETUP_SECRET is not set in the environment variables.' },
      { status: 500 },
    );
  }
  if (req.nextUrl.searchParams.get('secret') !== secret) {
    return NextResponse.json({ ok: false, error: 'Wrong secret.' }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: 'DATABASE_URL is not set. Connect the Neon database first.' },
      { status: 500 },
    );
  }

  const done: string[] = [];

  try {
    for (const statement of DDL.split(';').map((s) => s.trim()).filter(Boolean)) {
      await db.execute(statement);
    }
    done.push('tables ready');

    const seedIfEmpty = async (
      label: string,
      count: () => Promise<{ length: number }>,
      insert: () => Promise<unknown>,
    ) => {
      const rows = await count();
      if (rows.length > 0) { done.push(`${label}: already had ${rows.length}, left alone`); return; }
      await insert();
      done.push(`${label}: seeded`);
    };

    await seedIfEmpty('settings',
      () => db.select().from(schema.settings).limit(1),
      () => db.insert(schema.settings).values(SETTINGS));

    await seedIfEmpty('hours',
      () => db.select().from(schema.hours).limit(1),
      () => db.insert(schema.hours).values(HOURS));

    await seedIfEmpty('categories',
      () => db.select().from(schema.categories).limit(1),
      () => db.insert(schema.categories).values(CATEGORIES));

    await seedIfEmpty('services',
      () => db.select().from(schema.services).limit(1),
      () => db.insert(schema.services).values(
        SERVICES.map((s, i) => ({
          ...s,
          priceTo: s.priceTo ?? null,
          noteEn: s.noteEn ?? '', noteAr: s.noteAr ?? '',
          unitEn: s.unitEn ?? '', unitAr: s.unitAr ?? '',
          sortOrder: (s as { sortOrder?: number }).sortOrder ?? i,
        })),
      ));

    await seedIfEmpty('gift cards',
      () => db.select().from(schema.giftCards).limit(1),
      () => db.insert(schema.giftCards).values(GIFT_CARDS));

    await seedIfEmpty('testimonials',
      () => db.select().from(schema.testimonials).limit(1),
      () => db.insert(schema.testimonials).values(TESTIMONIALS));

    await seedIfEmpty('faqs',
      () => db.select().from(schema.faqs).limit(1),
      () => db.insert(schema.faqs).values(FAQS));

    await seedIfEmpty('photos',
      () => db.select().from(schema.photos).limit(1),
      () => db.insert(schema.photos).values(PHOTOS));

    // The two logins, from the environment. Existing accounts are never touched.
    const accounts = [
      { email: process.env.ADMIN_1_EMAIL, password: process.env.ADMIN_1_PASSWORD, name: process.env.ADMIN_1_NAME ?? 'Owner' },
      { email: process.env.ADMIN_2_EMAIL, password: process.env.ADMIN_2_PASSWORD, name: process.env.ADMIN_2_NAME ?? 'Manager' },
    ].filter((a) => a.email && a.password);

    if (!accounts.length) {
      done.push('admins: none created, set ADMIN_1_EMAIL and ADMIN_1_PASSWORD');
    } else {
      const existing = await db.select().from(schema.admins);
      const known = new Set(existing.map((a) => a.email.toLowerCase()));
      for (const a of accounts) {
        const email = a.email!.toLowerCase().trim();
        if (known.has(email)) { done.push(`admin ${email}: already exists`); continue; }
        if (a.password!.length < 10) {
          done.push(`admin ${email}: skipped, password must be at least 10 characters`);
          continue;
        }
        await db.insert(schema.admins).values({
          email, name: a.name, passwordHash: await bcrypt.hash(a.password!, 12),
        });
        done.push(`admin ${email}: created`);
      }
    }

    return NextResponse.json({ ok: true, done });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e), done },
      { status: 500 },
    );
  }
}
