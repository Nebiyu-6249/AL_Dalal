# Al Dalal Henna & Beauty

The website for Al Dalal Henna & Beauty, Al Maireed, Ras Al Khaimah.

Next.js 15, TypeScript, Postgres, deployed on Vercel. English and Arabic. Every service from the
printed menu is on the site as real text, with no prices: they move with hair length, thickness and
what the client picks, so the salon quotes on WhatsApp and again in the chair. There is an admin
panel at `/admin` for changing services, photos, opening hours, gift cards, reviews and questions
without touching the code.

---

## Getting it live

You need three things from Vercel, all on the free tier: the project itself, a Neon Postgres
database and a Blob store. The order below matters.

### 1. Push to GitHub

Create an empty repository on GitHub, then from this folder:

```bash
git init
git add .
git commit -m "Al Dalal website"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/YOUR-REPO.git
git push -u origin main
```

`.env.local` is ignored by git, so no password ever reaches GitHub.

### 2. Import into Vercel

At vercel.com, **Add New → Project**, pick the repository, press **Deploy**. Nothing needs
configuring. The first build will succeed and the site will work straight away, running on the
services built into the code.

### 3. Add the database

In the project, open **Storage → Create Database → Neon (Postgres)** and connect it. Vercel sets
`DATABASE_URL` for you.

Then **Storage → Create → Blob**, which sets `BLOB_READ_WRITE_TOKEN`. This is where photos
uploaded from the admin panel are stored.

### 4. Add the remaining environment variables

**Settings → Environment Variables**. Add each to Production, Preview and Development.

| Name | What to put |
|---|---|
| `AUTH_SECRET` | A long random string. Run `openssl rand -base64 32` to make one. |
| `SETUP_SECRET` | Another random string. Used once, in step 5. |
| `ADMIN_1_EMAIL` | Your email, used to sign in to `/admin`. |
| `ADMIN_1_PASSWORD` | Your password. At least 10 characters. |
| `ADMIN_1_NAME` | Your name. |
| `ADMIN_2_EMAIL` | The manager's email. |
| `ADMIN_2_PASSWORD` | The manager's password. |
| `ADMIN_2_NAME` | The manager's name. |
| `NEXT_PUBLIC_SITE_URL` | **Leave this out until the domain is bought.** See the warning below. |

Redeploy after adding them: **Deployments → the top one → Redeploy**.

### 5. Fill the database, once

Open this in a browser, replacing the secret with your `SETUP_SECRET`:

```
https://YOUR-SITE.vercel.app/api/setup?secret=YOUR_SETUP_SECRET
```

It creates the tables, loads all 74 services in both languages, the six service pages, the gift
cards, the four Google reviews, the 24 questions and the photographs, and creates the two admin
logins. The price columns are seeded too, because they stay in the database, but nothing on the
site renders them.

Running it twice is safe. It only fills tables that are empty, so it can never overwrite something
you edited in the admin panel.

### 6. Sign in

`https://YOUR-SITE.vercel.app/admin`

---

## The warning about the domain

Until `NEXT_PUBLIC_SITE_URL` is set, every page carries a `noindex` tag and `robots.txt` blocks
everything. That is on purpose. If Google indexes `your-project.vercel.app`, that address competes
with the real domain later and takes months to untangle.

So: buy the domain, attach it in Vercel under **Settings → Domains**, then add
`NEXT_PUBLIC_SITE_URL=https://yourdomain.ae` and redeploy. Indexing, the sitemap, hreflang and the
canonical addresses all switch on together at that moment. Nothing else to remember.

For a Ras Al Khaimah salon a `.ae` domain is worth the extra step. It needs a UAE trade licence and
takes a few days. A `.com` is instant if you would rather start sooner.

---

## Running it on your own computer

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run dev                     # http://localhost:3000
```

The site runs without a database. It falls back to the services held in `src/db/content.ts`, so the
pages are never empty. The admin panel will tell you the database is not connected.

---

## The admin panel

`/admin`, eight tabs.

| Tab | What it changes |
|---|---|
| **Services** | All 74 services. Name, group heading, note, in both languages. No price fields, because the site shows no prices. |
| **Service pages** | The heading, opening paragraph and two pictures on each of the six service pages. |
| **Photos** | Upload, describe, reorder, hide. Choose which part of the site each one appears on. |
| **Contact** | Both numbers, email, address, map link, Instagram, TikTok, the menu PDF, and the notice bar. |
| **Hours** | Opening and closing time for each day, or mark a day closed. |
| **Gift cards** | Occasion, description, picture. No prices, because the buyer chooses the amount. |
| **Reviews** | Name, stars, text, date. |
| **Questions** | The FAQ on each page. |

Two things worth knowing.

**One change lands everywhere.** Renaming a service on the Services tab changes it on the service
page, the menu page, the line under the tile on the home page, and the structured data Google
reads. There is one copy of every name.

**The prices are still in the database.** The `price_from` and `price_to` columns and the admin
form's price fields have been separated: the columns and their 74 numbers are untouched, the fields
are gone, and nothing renders a figure. Switching prices back on later is a form change, not a
migration.

**Ramadan.** Change the times on the Hours tab, then write a line on the Contact tab notice bar and
switch it on. That puts a message across the top of every page. Turn both back afterwards.

---

## Getting found on Google

### Search Console

1. `search.google.com/search-console`, signed in with the salon's Google account, the same one
   that holds the Business Profile.
2. Choose **Domain**, not URL prefix. It covers www and non-www in one go.
3. Google gives you a TXT record. Add it in your domain registrar's DNS settings and press Verify.
   Allow up to an hour.
4. **Sitemaps**, enter `sitemap.xml`, submit.
5. **URL Inspection** at the top. Paste the home page, press **Request indexing**. Do the same for
   the six service pages. This usually gets you crawled in a day or two instead of a week.

Do this only after the domain is attached and `NEXT_PUBLIC_SITE_URL` is set. Before that there is
nothing for Google to index, by design.

### Google Business Profile

This will bring more customers than the website will, especially in the first year.

- Name it exactly as the shopfront sign reads: **Al Dalal Henna & Beauty**. The site uses the same
  wording, character for character, which is what lets the two reinforce each other.
- Primary category **Beauty salon**. Then add Hair salon, Nail salon, Waxing hair removal service,
  Eyelash service and Make-up artist.
- Address and phone identical to the website, in the same format.
- Put the website address in the Website field.
- Add the services. Google shows them directly in the profile. Prices there are optional, and
  leaving them off matches the site.
- Attributes: ladies only, languages spoken, walk-ins welcome, parking.
- 20 photographs at launch, then three or four a month.
- Reply to every review. Reply speed counts, and future customers read the replies.

### What the site already does

- `BeautySalon` structured data listing all 74 services as an offer catalogue, so Google can answer
  "who does knotless braids in Ras Al Khaimah" with your service names. The offers carry no price,
  and `priceRange` is the `$$` band rather than a figure.
- `Service`, `FAQPage` and `BreadcrumbList` markup on the service pages.
- Every service name as crawlable HTML text, not trapped in a PDF or an image. With the figures
  gone, the names and the place carry the search traffic on their own, which is why they read the
  way the salon says them.
- `hreflang` tying each English page to its Arabic twin, so the two rank separately rather than
  competing.
- Sitemap with both languages, generated from the database.
- Instagram and TikTok declared as `sameAs`, which ties the accounts and the profile together as
  one business.

### On review stars

Google no longer shows rich review stars for `AggregateRating` markup a business puts on its own
site, and marking it up aggressively risks a penalty. So the reviews on the site are there to
persuade visitors, not to produce stars in search results. The stars come from the Business
Profile. Getting the review count up is the highest-value thing you can do after launch.

---

## How it is put together

```
src/
  app/
    (site)/[lang]/        the public site, English at /, Arabic at /ar
    (admin)/admin/        the eight admin tabs
    api/setup             one-time database fill
    api/auth              sign in and out
    api/upload            photo uploads to Vercel Blob
    sitemap.ts robots.ts manifest.ts
    globals.css           the whole design system
  components/             header, hero, footer, service lists, galleries
  db/
    schema.ts             the nine tables
    content.ts            the printed menu as data, used to seed and as fallback
  lib/
    content.ts            loading, with the fallback
    i18n.ts               both dictionaries
    format.ts             WhatsApp links, phone numbers, opening hours
    schema-org.tsx        the structured data
    auth.ts               admin sessions
  actions/admin.ts        every admin save
  middleware.ts           language routing and the admin guard
```

**Design.** The palette and the gold dot leaders come from the printed menu. The arch that frames
every photograph is the salon's own, taken from the five backlit gold mirrors on the styling wall.
Interface elements have square corners, so every curve on the site comes from the building. Type is
Marcellus, which matches the Roman capitals on the shopfront sign, with Instrument Sans for body
text and tabular figures so opening hours and phone numbers line up.

**Motion.** One thing carries it: hovering a service draws the gold dot leader across it, the same
leader that runs across the paper menu. The service list is a grid of one, two or three columns,
and every item is a WhatsApp link that opens with the service name already written. Beyond that there is a slow crossfade on the hero and a
single fade as sections come into view. All of it stops for anyone whose device asks for reduced
motion.

---

## Still to do

**Two photographs are missing.** There is no henna and no shopfront in the set. The henna slots
currently show a drawn gold mandala, which is honest decoration rather than a fake photograph, but
henna is in the salon's name and it should be real work. The exterior is needed for the contact
page and for Google's video verification. Both are one upload each on the Photos tab.

**Five images are stock, not the salon's own work.** The pedicure bowl with rose petals, the pink
waxing shot, the bridal updo and two braiding photographs. That was fine on a printed menu handed
to a client. A public website that Google indexes is different, because stock agencies run reverse
image searches and send invoices. Replace them with your own work when you can. The interiors and
the white ombre nails are the strongest pictures in the set anyway.

**The menu PDF is not uploaded.** Until it is, the menu page lists every service as text, which is
better for Google in any case. Add the PDF on the Contact tab and a download button appears. The
PDF is public, so it must not have prices in it either, or the download contradicts the rest of the
site.

**Lashes has no photographs yet.** That slot shows a drawn arch until one is added.
