import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContent, grouped } from '@/lib/content';
import { type Lang, isLang, dict, href, pick } from '@/lib/i18n';
import { whatsappLink, waMessage, price } from '@/lib/format';
import { breadcrumbLd, JsonLd } from '@/lib/schema-org';
import Reveal from '@/components/Reveal';
import { PriceList, Heading } from '@/components/blocks';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = (isLang(raw) ? raw : 'en') as Lang;
  return {
    title: lang === 'ar' ? 'قائمة الأسعار' : 'Price menu',
    description: lang === 'ar'
      ? 'قائمة أسعار صالون الدلال كاملة بالدرهم الإماراتي: شعر، حناء، ضفائر، أظافر، فيشل، إزالة شعر، رموش ومكياج.'
      : 'The full Al Dalal price menu in AED: hair, henna, braiding, nails, facials, waxing, lashes and makeup.',
    alternates: { canonical: href(lang, '/menu'), languages: { en: '/menu', ar: '/ar/menu' } },
  };
}

export default async function MenuPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;
  const content = await getContent();
  const d = dict(lang);
  const P = (row: object) => (base: string) => pick(row as Record<string, unknown>, base, lang);
  const pdf = content.settings.menuPdf;

  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <hr className="rule" />
          <h1>{d.nav.menu}</h1>
          <p className="lede" style={{ marginTop: '1rem' }}>{d.menuNote}</p>
          <p style={{ marginTop: '1.5rem' }}>
            {pdf
              ? <a className="btn btn--primary" href={pdf} download>{d.downloadMenu}</a>
              : <span style={{ color: 'var(--taupe)', fontSize: '0.94rem' }}>{d.noMenuPdf}</span>}
          </p>
        </div>
      </section>

      {content.categories.map((c, i) => (
        <section key={c.slug} className={i % 2 === 0 ? 'section band-cream' : 'section'}>
          <div className="wrap" style={{ maxWidth: '52rem' }}>
            <Reveal>
              <Heading title={P(c)('name')}><p>{P(c)('tagline')}</p></Heading>
              <PriceList
                lang={lang}
                groups={grouped(content, c.slug)}
                waFor={(s) => whatsappLink(content.settings, waMessage.service(
                  lang, pick(s as unknown as Record<string, unknown>, 'name', lang), price(s, lang)))}
              />
            </Reveal>
          </div>
        </section>
      ))}

      <JsonLd data={[breadcrumbLd(lang, [
        { name: d.salon, path: '/' },
        { name: lang === 'ar' ? 'قائمة الأسعار' : 'Price menu', path: '/menu' },
      ])]} />
    </>
  );
}
