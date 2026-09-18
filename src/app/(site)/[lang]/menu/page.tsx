import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContent, grouped } from '@/lib/content';
import { type Lang, isLang, dict, href, pick } from '@/lib/i18n';
import { whatsappLink, waMessage } from '@/lib/format';
import { breadcrumbLd, JsonLd } from '@/lib/schema-org';
import Reveal from '@/components/Reveal';
import { ServiceList, Heading } from '@/components/blocks';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = (isLang(raw) ? raw : 'en') as Lang;
  return {
    title: lang === 'ar' ? 'خدماتنا' : 'What we do',
    description: lang === 'ar'
      ? 'كل خدمات صالون الدلال في المعيريض برأس الخيمة على صفحة واحدة: شعر، حناء، ضفائر، أظافر، فيشل، إزالة شعر، رموش ومكياج. الأسعار عبر واتساب.'
      : 'Every service at Al Dalal in Al Maireed, Ras Al Khaimah on one page: hair, henna, braiding, nails, facials, waxing, lashes and makeup. Prices are quoted on WhatsApp.',
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
          <div className="wrap">
            <Reveal>
              <Heading title={P(c)('name')}><p>{P(c)('tagline')}</p></Heading>
              <ServiceList
                lang={lang}
                groups={grouped(content, c.slug)}
                waFor={(s) => whatsappLink(content.settings, waMessage.enquiry(
                  lang, pick(s as unknown as Record<string, unknown>, 'name', lang)))}
              />
            </Reveal>
          </div>
        </section>
      ))}

      <JsonLd data={[breadcrumbLd(lang, [
        { name: d.salon, path: '/' },
        { name: d.nav.menu, path: '/menu' },
      ])]} />
    </>
  );
}
