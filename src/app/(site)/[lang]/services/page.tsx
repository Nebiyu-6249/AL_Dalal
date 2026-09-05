import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContent, priceFloor, grouped } from '@/lib/content';
import { type Lang, isLang, dict, href, pick } from '@/lib/i18n';
import { whatsappLink, waMessage, price } from '@/lib/format';
import { breadcrumbLd, JsonLd } from '@/lib/schema-org';
import Reveal from '@/components/Reveal';
import { CategoryTiles, PriceList, Heading } from '@/components/blocks';
import Link from 'next/link';

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> },
): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = (isLang(raw) ? raw : 'en') as Lang;
  const title = lang === 'ar' ? 'الخدمات والأسعار' : 'Services and prices';
  return {
    title,
    description: lang === 'ar'
      ? 'قائمة كاملة بخدمات صالون الدلال وأسعارها بالدرهم: حناء، ضفائر، شعر، أظافر، بشرة، رموش ومكياج.'
      : 'The full list of services at Al Dalal in Ras Al Khaimah with AED prices: henna, braiding, hair, nails, skin, lashes and makeup.',
    alternates: { canonical: href(lang, '/services'), languages: { en: '/services', ar: '/ar/services' } },
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;
  const content = await getContent();
  const d = dict(lang);
  const P = (row: object) => (base: string) => pick(row as Record<string, unknown>, base, lang);

  const tiles = content.categories.map((c) => ({
    slug: c.slug, name: P(c)('name'), tagline: P(c)('tagline'),
    image: c.tileImage, from: priceFloor(content, c.slug),
  }));

  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <hr className="rule" />
          <h1>{lang === 'ar' ? 'الخدمات والأسعار' : 'Services and prices'}</h1>
          <p className="lede" style={{ marginTop: '1rem' }}>{d.menuNote}</p>
        </div>
      </section>

      <section className="section--tight" style={{ paddingBottom: 'var(--section-y)' }}>
        <div className="wrap">
          <CategoryTiles tiles={tiles} lang={lang} />
        </div>
      </section>

      {content.categories.map((c, i) => (
        <section key={c.slug} className={i % 2 === 0 ? 'section band-cream' : 'section'}>
          <div className="wrap" style={{ maxWidth: '52rem' }}>
            <Reveal>
              <Heading title={P(c)('name')}>
                <p>{P(c)('tagline')}</p>
              </Heading>
              <PriceList
                lang={lang}
                groups={grouped(content, c.slug)}
                waFor={(s) => whatsappLink(
                  content.settings,
                  waMessage.service(lang, pick(s as unknown as Record<string, unknown>, 'name', lang), price(s, lang)),
                )}
              />
              <p style={{ marginTop: '1.75rem' }}>
                <Link className="btn btn--ghost" href={href(lang, `/services/${c.slug}`)}>
                  {P(c)('name')}
                </Link>
              </p>
            </Reveal>
          </div>
        </section>
      ))}

      <JsonLd data={[breadcrumbLd(lang, [
        { name: d.salon, path: '/' },
        { name: lang === 'ar' ? 'الخدمات' : 'Services', path: '/services' },
      ])]} />
    </>
  );
}
