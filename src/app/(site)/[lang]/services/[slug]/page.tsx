import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getContent, categoryBySlug, grouped, faqsFor, photosFor,
} from '@/lib/content';
import { type Lang, LANGS, isLang, dict, href, pick } from '@/lib/i18n';
import { whatsappLink, waMessage } from '@/lib/format';
import { serviceLd, faqLd, breadcrumbLd, JsonLd } from '@/lib/schema-org';
import Reveal from '@/components/Reveal';
import { ServiceList, Faqs, Gallery, Arch, Heading } from '@/components/blocks';
import { WhatsAppIcon } from '@/components/Icons';

export const revalidate = 3600;

export async function generateStaticParams() {
  const content = await getContent();
  return LANGS.flatMap((lang) =>
    content.categories.map((c) => ({ lang, slug: c.slug })));
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string; slug: string }> },
): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = (isLang(raw) ? raw : 'en') as Lang;
  const content = await getContent();
  const cat = categoryBySlug(content, slug);
  if (!cat) return {};

  const name = pick(cat as unknown as Record<string, unknown>, 'name', lang);
  const intro = pick(cat as unknown as Record<string, unknown>, 'intro', lang);
  const place = lang === 'ar' ? 'رأس الخيمة' : 'Ras Al Khaimah';

  return {
    title: `${name} ${lang === 'ar' ? 'في' : 'in'} ${place}`,
    description: intro.slice(0, 155),
    alternates: {
      canonical: href(lang, `/services/${slug}`),
      languages: { en: `/services/${slug}`, ar: `/ar/services/${slug}` },
    },
    openGraph: { title: `${name} ${lang === 'ar' ? 'في' : 'in'} ${place}`, description: intro.slice(0, 155) },
  };
}

export default async function CategoryPage(
  { params }: { params: Promise<{ lang: string; slug: string }> },
) {
  const { lang: raw, slug } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;

  const content = await getContent();
  const cat = categoryBySlug(content, slug);
  if (!cat) notFound();

  const d = dict(lang);
  const P = (row: object) => (base: string) => pick(row as Record<string, unknown>, base, lang);
  const name = P(cat)('name');
  const faqs = faqsFor(content, slug);
  const gallery = photosFor(content, `gallery-${slug}`);

  const categoryWa = whatsappLink(
    content.settings, waMessage.enquiry(lang, name),
  );

  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <div className="split">
            <Reveal className="split__media">
              <Arch src={cat.heroImage} alt={name} width={1000} height={1333} priority
                sizes="(min-width: 860px) 40vw, 90vw" />
            </Reveal>
            <Reveal delay={70}>
              <hr className="rule" />
              <h1>{name}</h1>
              <p style={{ color: 'var(--taupe)', marginTop: '0.35rem' }}>{P(cat)('tagline')}</p>
              <p className="lede" style={{ marginTop: '1.1rem' }}>{P(cat)('intro')}</p>
              <p style={{ marginTop: '1.6rem', display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <a className="btn btn--primary" href={categoryWa} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon />{d.book}
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section band-cream">
        <div className="wrap">
          <Reveal>
            <Heading title={d.nav.services} />
            <ServiceList
              lang={lang}
              groups={grouped(content, slug)}
              waFor={(s) => whatsappLink(
                content.settings,
                waMessage.enquiry(
                  lang,
                  pick(s as unknown as Record<string, unknown>, 'name', lang),
                ),
              )}
            />
            <p className="menu-note">{d.menuNote}</p>
          </Reveal>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="section">
          <div className="wrap">
            <Reveal>
              <Heading title={d.ourWork} />
            </Reveal>
            <Reveal delay={60}>
              <Gallery photos={gallery} lang={lang} />
            </Reveal>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="section band-cream">
          <div className="wrap" style={{ maxWidth: '48rem' }}>
            <Reveal>
              <Heading title={d.questions} />
              <Faqs items={faqs} lang={lang} />
            </Reveal>
          </div>
        </section>
      )}

      <section className="section band-dark on-dark">
        <div className="wrap">
          <Reveal>
            <div className="callout">
              <h2 style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1.2vw, 2rem)' }}>
                {lang === 'ar' ? `احجزي موعد ${name}` : `Book ${name.toLowerCase()}`}
              </h2>
              <p style={{ marginTop: '0.75rem', color: 'var(--on-dark-2)' }}>
                {lang === 'ar'
                  ? 'راسلينا على واتساب مع صورة لما ترغبين به، ونرد بالسعر والوقت المطلوب.'
                  : 'Send us a message with a photo of what you want, and we will come back with the price and how long to set aside.'}
              </p>
              <p style={{ marginTop: '1.35rem' }}>
                <a className="btn btn--gold" href={categoryWa} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon />{d.book}
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section--tight" style={{ paddingBottom: 'var(--section-y)' }}>
        <div className="wrap">
          <p style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {content.categories.filter((c) => c.slug !== slug).map((c) => (
              <Link key={c.slug} href={href(lang, `/services/${c.slug}`)}>
                {pick(c as unknown as Record<string, unknown>, 'name', lang)}
              </Link>
            ))}
          </p>
        </div>
      </section>

      <JsonLd data={[
        serviceLd(content, lang, slug),
        faqLd(faqs, lang),
        breadcrumbLd(lang, [
          { name: d.salon, path: '/' },
          { name: lang === 'ar' ? 'الخدمات' : 'Services', path: '/services' },
          { name, path: `/services/${slug}` },
        ]),
      ]} />
    </>
  );
}
