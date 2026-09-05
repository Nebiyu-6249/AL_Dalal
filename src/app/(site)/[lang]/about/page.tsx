import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContent, photosFor } from '@/lib/content';
import { type Lang, isLang, dict, href, pick } from '@/lib/i18n';
import { breadcrumbLd, JsonLd } from '@/lib/schema-org';
import Reveal from '@/components/Reveal';
import { Framed, Strip, Heading } from '@/components/blocks';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = (isLang(raw) ? raw : 'en') as Lang;
  return {
    title: lang === 'ar' ? 'من نحن' : 'About',
    description: lang === 'ar'
      ? 'صالون الدلال للحناء والتجميل، صالون سيدات في المعيريض برأس الخيمة. فريق يتحدث العربية والإنجليزية والأمهرية.'
      : 'Al Dalal Henna & Beauty is a ladies salon in Al Maireed, Ras Al Khaimah. The team speaks Arabic, English and Amharic.',
    alternates: { canonical: href(lang, '/about'), languages: { en: '/about', ar: '/ar/about' } },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;
  const content = await getContent();
  const d = dict(lang);
  const team = photosFor(content, 'about-team')[0];
  const interior = photosFor(content, 'interior');
  const P = (row: object) => (base: string) => pick(row as Record<string, unknown>, base, lang);

  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <hr className="rule" />
          <h1>{d.nav.about}</h1>
          <div className="prose" style={{ marginTop: '1.5rem' }}>
            {lang === 'ar' ? (
              <>
                <p className="lede">
                  صالون الدلال للحناء والتجميل صالون سيدات في المعيريض برأس الخيمة، مفتوح كل يوم من العاشرة صباحًا حتى العاشرة مساءً.
                </p>
                <p>
                  نبدأ من الحناء والضفائر، وهما ما نتقنه أكثر من غيره. نرسم الحناء البنية والسوداء يدويًا للعرائس وللأعياد والمناسبات، ونعمل الكورنروز والضفائر بدون عقد والتركيب بالخياطة وبالخط وبالحلقات وبالشمع. إلى جانب ذلك نقدم علاجات الشعر والقص والصبغة والأظافر والفيشل وإزالة الشعر والرموش والمكياج.
                </p>
                <p>
                  فريقنا يتحدث العربية والإنجليزية والأمهرية، وهذا يعني أنك ستجدين من تشرحين لها ما تريدينه بلغتك. الصالون للسيدات فقط.
                </p>
                <p>
                  أسعارنا منشورة كاملة على هذا الموقع. إن كان هناك نطاق سعري فسببه طول الشعر أو كثافته أو حالته، ونخبرك بسعرك قبل أن نبدأ ولا نضيف شيئًا بعد ذلك.
                </p>
              </>
            ) : (
              <>
                <p className="lede">
                  Al Dalal Henna &amp; Beauty is a ladies salon in Al Maireed, Ras Al Khaimah, open every
                  day from ten in the morning until ten at night.
                </p>
                <p>
                  Henna and braiding are where we started and what we are best at. Brown and black henna
                  drawn by hand for brides, for Eid and for parties. Cornrows, knotless braids, sew-in
                  fixing, fixing by line, rings and candle fixing. Around that we do hair treatments,
                  cutting and colour, nails, facials, waxing, lashes and makeup.
                </p>
                <p>
                  The team speaks Arabic, English and Amharic, so there is someone here you can explain
                  what you want to in your own language. The salon is ladies only.
                </p>
                <p>
                  Every price we charge is published on this site. Where a service has a range it is
                  because of length, thickness or condition. We tell you where you fall before we start,
                  and nothing gets added once you are in the chair.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {team && (
        <section className="section band-cream">
          <div className="wrap">
            <Reveal>
              <Heading title={d.teamHeading} />
            </Reveal>
            <Reveal delay={60}>
              <Framed src={team.url} width={team.width || 1280} height={team.height || 853}
                alt={P(team)('alt')} sizes="(min-width: 1180px) 1100px, 92vw" />
            </Reveal>
          </div>
        </section>
      )}

      {interior.length > 0 && (
        <section className="section">
          <div className="wrap">
            <Reveal>
              <Heading title={lang === 'ar' ? 'داخل الصالون' : 'Inside the salon'} />
            </Reveal>
            <Reveal delay={60}>
              <Strip photos={interior} lang={lang} />
            </Reveal>
          </div>
        </section>
      )}

      <JsonLd data={[breadcrumbLd(lang, [
        { name: d.salon, path: '/' },
        { name: lang === 'ar' ? 'من نحن' : 'About', path: '/about' },
      ])]} />
    </>
  );
}
