import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContent, leadServices, grouped } from '@/lib/content';
import { type Lang, isLang, dict, href, pick } from '@/lib/i18n';
import { whatsappLink, waMessage } from '@/lib/format';
import { breadcrumbLd, JsonLd } from '@/lib/schema-org';
import Reveal from '@/components/Reveal';
import { CategoryTiles, ServiceList, Heading } from '@/components/blocks';
import Link from 'next/link';

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> },
): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = (isLang(raw) ? raw : 'en') as Lang;
  const title = lang === 'ar' ? 'الخدمات' : 'Services';
  return {
    title,
    description: lang === 'ar'
      ? 'كل ما نقدمه في صالون الدلال برأس الخيمة: حناء، ضفائر وإكستنشن، شعر، أظافر، بشرة، رموش ومكياج. اسألي عن السعر عبر واتساب.'
      : 'Everything Al Dalal does in Ras Al Khaimah: henna, braiding and extensions, hair, nails, skin, lashes and makeup. Ask on WhatsApp for a price.',
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
    image: c.tileImage, services: leadServices(content, c.slug, lang),
  }));

  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <hr className="rule" />
          <h1>{lang === 'ar' ? 'الخدمات' : 'Services'}</h1>
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
          <div className="wrap">
            <Reveal>
              <Heading title={P(c)('name')}>
                <p>{P(c)('tagline')}</p>
              </Heading>
              <ServiceList
                lang={lang}
                groups={grouped(content, c.slug)}
                waFor={(s) => whatsappLink(
                  content.settings,
                  waMessage.enquiry(lang, pick(s as unknown as Record<string, unknown>, 'name', lang)),
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
