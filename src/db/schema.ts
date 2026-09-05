import {
  pgTable, serial, text, integer, boolean, timestamp, real,
} from 'drizzle-orm/pg-core';

/** Everything editable from /admin lives here. Both languages sit side by side
 *  on the same row so a price or a name can never drift between them. */

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  nameEn: text('name_en').notNull(),
  nameAr: text('name_ar').notNull(),
  taglineEn: text('tagline_en').notNull().default(''),
  taglineAr: text('tagline_ar').notNull().default(''),
  introEn: text('intro_en').notNull().default(''),
  introAr: text('intro_ar').notNull().default(''),
  tileImage: text('tile_image').notNull().default(''),
  heroImage: text('hero_image').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
  published: boolean('published').notNull().default(true),
});

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  categorySlug: text('category_slug').notNull(),
  groupEn: text('group_en').notNull().default(''),
  groupAr: text('group_ar').notNull().default(''),
  nameEn: text('name_en').notNull(),
  nameAr: text('name_ar').notNull(),
  noteEn: text('note_en').notNull().default(''),
  noteAr: text('note_ar').notNull().default(''),
  priceFrom: integer('price_from').notNull(),
  priceTo: integer('price_to'),
  unitEn: text('unit_en').notNull().default(''),
  unitAr: text('unit_ar').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
  published: boolean('published').notNull().default(true),
});

export const settings = pgTable('settings', {
  id: integer('id').primaryKey().default(1),
  whatsapp: text('whatsapp').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  addressEn: text('address_en').notNull(),
  addressAr: text('address_ar').notNull(),
  mapsUrl: text('maps_url').notNull(),
  instagram: text('instagram').notNull(),
  tiktok: text('tiktok').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  menuPdf: text('menu_pdf').notNull().default(''),
  noticeEn: text('notice_en').notNull().default(''),
  noticeAr: text('notice_ar').notNull().default(''),
  noticeActive: boolean('notice_active').notNull().default(false),
});

export const hours = pgTable('hours', {
  id: serial('id').primaryKey(),
  /** 0 = Sunday, matching JavaScript's getDay() */
  weekday: integer('weekday').notNull(),
  opens: text('opens').notNull().default('10:00'),
  closes: text('closes').notNull().default('22:00'),
  closed: boolean('closed').notNull().default(false),
});

export const giftCards = pgTable('gift_cards', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  titleEn: text('title_en').notNull(),
  titleAr: text('title_ar').notNull(),
  bodyEn: text('body_en').notNull().default(''),
  bodyAr: text('body_ar').notNull().default(''),
  image: text('image').notNull().default(''),
  yearRound: boolean('year_round').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  published: boolean('published').notNull().default(true),
});

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  rating: integer('rating').notNull().default(5),
  bodyEn: text('body_en').notNull(),
  bodyAr: text('body_ar').notNull().default(''),
  saidOn: text('said_on').notNull().default(''),
  source: text('source').notNull().default('Google'),
  sortOrder: integer('sort_order').notNull().default(0),
  published: boolean('published').notNull().default(true),
});

export const faqs = pgTable('faqs', {
  id: serial('id').primaryKey(),
  /** 'home', or a category slug such as 'henna' */
  page: text('page').notNull().default('home'),
  questionEn: text('question_en').notNull(),
  questionAr: text('question_ar').notNull(),
  answerEn: text('answer_en').notNull(),
  answerAr: text('answer_ar').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  published: boolean('published').notNull().default(true),
});

export const photos = pgTable('photos', {
  id: serial('id').primaryKey(),
  /** where it appears: hero, about-team, interior, or gallery-<category> */
  slot: text('slot').notNull(),
  url: text('url').notNull(),
  altEn: text('alt_en').notNull().default(''),
  altAr: text('alt_ar').notNull().default(''),
  width: integer('width').notNull().default(0),
  height: integer('height').notNull().default(0),
  sortOrder: integer('sort_order').notNull().default(0),
  published: boolean('published').notNull().default(true),
});

export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Category = typeof categories.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Settings = typeof settings.$inferSelect;
export type Hours = typeof hours.$inferSelect;
export type GiftCard = typeof giftCards.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type Photo = typeof photos.$inferSelect;
