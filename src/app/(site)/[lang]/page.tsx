import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  getContent, photosFor, faqsFor, leadServices, categoryBySlug,
} from '@/lib/content';
import { type Lang, isLang, dict, href, pick } from '@/lib/i18n';
import { whatsappLink, waMessage, uniformHours, clock, prettyPhone, telLink } from '@/lib/format';
import { faqLd, JsonLd } from '@/lib/schema-org';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import {
  CategoryTiles, Faqs, Testimonials, Strip, Arch, Heading,
} from '@/components/blocks';
import { WhatsAppIcon, PinIcon } from '@/components/Icons';

export const revalidate = 3600;

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;

  const content = await getContent();
  const d = dict(lang);
  const L = (p: string) => href(lang, p);
  const P = (row: object) => (base: string) => pick(row as Record<string, unknown>, base, lang);

  const heroPhotos = photosFor(content, 'hero');
  const homeFaqs = faqsFor(content, 'home');
  const uniform = uniformHours(content.hours);

  const tiles = content.categories.map((c) => ({
    slug: c.slug,
    name: P(c)('name'),
    tagline: P(c)('tagline'),
    image: c.tileImage,
    services: leadServices(content, c.slug, lang),
  }));

  const henna = categoryBySlug(content, 'henna');
  const braiding = categoryBySlug(content, 'braiding');

  const headline = lang === 'ar'
    ? 'حناء وضفائر وتجميل في المعيريض'
    : 'Henna, braiding and beauty in Al Maireed';
  const sub = lang === 'ar'
    ? 'صالون سيدات في رأس الخيمة، مفتوح كل يوم من العاشرة صباحًا حتى العاشرة مساءً. الحجز عبر واتساب، ونخبرك بالسعر قبل حضورك.'
    : 'A ladies salon in Ras Al Khaimah, open every day from ten in the morning until ten at night. Booking is on WhatsApp, and we tell you the price before you come in.';

  const meta = uniform
    ? [
      d.ladiesOnly,
      d.languages,
      `${d.openDaily}, ${clock(uniform.opens, lang)} \u2013 ${clock(uniform.closes, lang)}`,
    ]
    : [d.ladiesOnly, d.languages];

  return (
    <>
      <Hero
        lang={lang}
        slides={heroPhotos.map((p) => ({
          url: p.url, alt: P(p)('alt'), width: p.width || 1600, height: p.height || 900,
        }))}
        whatsappHref={whatsappLink(content.settings, waMessage.general(lang))}
        headline={headline}
        sub={sub}
        meta={meta}
      />

      {/* ---------------------------------------------------- what we do */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <Heading title={lang === 'ar' ? 'ما نقدمه' : 'What we do'}>
              <p className="lede">
                {lang === 'ar'
                  ? 'عشر مجموعات من الخدمات، من خيط الحواجب إلى علاج البروتين. لا توجد أسعار على الموقع، لأن الخدمة نفسها تختلف كلفتها حسب الطول والكثافة وما تختارينه. أرسلي صورة عبر واتساب ونخبرك بالسعر قبل حضورك.'
                  : 'Ten groups of services, from brow threading to a full protein treatment. There are no figures on the site, because the same service costs a different amount depending on length, thickness and what you choose. Send a photo on WhatsApp and we will tell you the price before you come in.'}
              </p>
            </Heading>
          </Reveal>
          <Reveal delay={80}>
            <CategoryTiles tiles={tiles} lang={lang} />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------- henna and braiding, the reason */}
      <section className="section band-dark on-dark">
        <div className="wrap">
          {henna && (
            <div className="split" style={{ marginBottom: 'clamp(3rem, 7vw, 5.5rem)' }}>
              <Reveal className="split__media">
                <Arch src={henna.heroImage} alt={P(henna)('name')} width={1000} height={1333} />
              </Reveal>
              <Reveal delay={80}>
                <hr className="rule" />
                <h2>{P(henna)('name')}</h2>
                <p className="lede" style={{ marginTop: '0.9rem' }}>{P(henna)('intro')}</p>
                <p style={{ marginTop: '1.2rem' }}>
                  <Link className="btn btn--ghost" href={L('/services/henna')}>{d.viewPrices}</Link>
                </p>
              </Reveal>
            </div>
          )}

          {braiding && (
            <div className="split split--flip">
              <Reveal className="split__media">
                <Arch src={braiding.heroImage} alt={P(braiding)('name')} width={1000} height={1333} />
              </Reveal>
              <Reveal delay={80}>
                <hr className="rule" />
                <h2>{P(braiding)('name')}</h2>
                <p className="lede" style={{ marginTop: '0.9rem' }}>{P(braiding)('intro')}</p>
                <p style={{ marginTop: '1.2rem' }}>
                  <Link className="btn btn--ghost" href={L('/services/braiding')}>{d.viewPrices}</Link>
                </p>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ menu */}
      <section className="section band-cream">
        <div className="wrap">
          <Reveal>
            <Heading title={lang === 'ar' ? 'كل خدماتنا في صفحة واحدة' : 'Every service on one page'}>
              <p className="lede">{d.menuNote}</p>
            </Heading>
          </Reveal>
          <Reveal delay={60}>
            <Strip photos={photosFor(content, 'interior').slice(0, 3)} lang={lang} />
          </Reveal>
          <Reveal delay={120}>
            <p style={{ marginTop: '2rem', display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <Link className="btn btn--primary" href={L('/menu')}>{d.viewMenu}</Link>
              <Link className="btn btn--ghost" href={L('/services')}>{d.allServices}</Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------ gift cards */}
      <section className="section">
        <div className="wrap">
          <div className="split">
            <Reveal className="split__media">
              <Arch src="/images/g-nail-ombre.webp" alt="" width={820} height={820} />
            </Reveal>
            <Reveal delay={80}>
              <hr className="rule" />
              <h2>{d.nav.gift}</h2>
              <p className="lede" style={{ marginTop: '0.9rem' }}>{d.giftIntro}</p>
              <ul style={{ margin: '1.25rem 0 0', paddingInlineStart: '1.1rem' }}>
                {content.giftCards.map((g) => (
                  <li key={g.slug} style={{ marginBottom: '0.35rem' }}>
                    {P(g)('title')}
                    {g.yearRound && (
                      <span style={{ color: 'var(--taupe)', fontSize: '0.875rem' }}>
                        {' \u00b7 '}{d.yearRound}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: '1.5rem' }}>
                <Link className="btn btn--gold" href={L('/gift-cards')}>{d.nav.gift}</Link>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- testimonials */}
      {content.testimonials.length > 0 && (
        <section className="section band-dark on-dark">
          <div className="wrap">
            <Reveal>
              <Heading title={d.reviews}>
                <p>{d.reviewsSub}</p>
              </Heading>
            </Reveal>
            <Reveal delay={80}>
              <Testimonials items={content.testimonials} lang={lang} />
            </Reveal>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------- faq */}
      {homeFaqs.length > 0 && (
        <section className="section">
          <div className="wrap" style={{ maxWidth: '48rem' }}>
            <Reveal>
              <Heading title={d.questions} />
            </Reveal>
            <Reveal delay={60}>
              <Faqs items={homeFaqs} lang={lang} />
            </Reveal>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------- find us */}
      <section className="section band-cream">
        <div className="wrap">
          <Reveal>
            <Heading title={d.findUs} />
          </Reveal>
          <div className="info">
            <Reveal>
              <dl>
                <dt>{d.address}</dt>
                <dd>{P(content.settings)('address')}</dd>
                <dt>WhatsApp</dt>
                <dd>
                  <a href={whatsappLink(content.settings, waMessage.general(lang))}
                    target="_blank" rel="noopener noreferrer">
                    {prettyPhone(content.settings.whatsapp)}
                  </a>
                </dd>
                <dt>{d.call}</dt>
                <dd><a href={telLink(content.settings)}>{prettyPhone(content.settings.phone)}</a></dd>
                <dt>{d.openingHours}</dt>
                <dd>
                  {uniform
                    ? `${d.openDaily}, ${clock(uniform.opens, lang)} \u2013 ${clock(uniform.closes, lang)}`
                    : d.openingHours}
                </dd>
              </dl>
              <p style={{ marginTop: '1.75rem', display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <a className="btn btn--primary"
                  href={whatsappLink(content.settings, waMessage.general(lang))}
                  target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon />{d.book}
                </a>
                <a className="btn btn--ghost" href={content.settings.mapsUrl}
                  target="_blank" rel="noopener noreferrer">
                  <PinIcon />{d.getDirections}
                </a>
              </p>
            </Reveal>
            <Reveal delay={80}>
              <a href={content.settings.mapsUrl} target="_blank" rel="noopener noreferrer"
                className="frame" style={{ display: 'block', aspectRatio: '4 / 3' }}>
                <Image src="/images/int-pedicure.webp" alt={P(content.settings)('address')}
                  width={1428} height={952} sizes="(min-width: 820px) 45vw, 90vw" loading="lazy" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <JsonLd data={[faqLd(homeFaqs, lang)]} />
    </>
  );
}
