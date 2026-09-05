import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { type Lang, isLang, dict, href, pick } from '@/lib/i18n';
import { whatsappLink, waMessage } from '@/lib/format';
import { breadcrumbLd, JsonLd } from '@/lib/schema-org';
import Reveal from '@/components/Reveal';
import { Framed, Heading } from '@/components/blocks';
import { WhatsAppIcon } from '@/components/Icons';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = (isLang(raw) ? raw : 'en') as Lang;
  return {
    title: lang === 'ar' ? 'بطاقات الهدايا' : 'Gift cards',
    description: lang === 'ar'
      ? 'بطاقات هدايا من صالون الدلال في رأس الخيمة للأعراس والتخرج وأعياد الميلاد وعيد الأم، بالمبلغ الذي تختارينه.'
      : 'Gift cards from Al Dalal in Ras Al Khaimah for weddings, graduations, birthdays and Mother\u2019s Day. You choose the amount.',
    alternates: { canonical: href(lang, '/gift-cards'), languages: { en: '/gift-cards', ar: '/ar/gift-cards' } },
  };
}

export default async function GiftCardsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;
  const content = await getContent();
  const d = dict(lang);
  const P = (row: object) => (base: string) => pick(row as Record<string, unknown>, base, lang);

  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <hr className="rule" />
          <h1>{d.nav.gift}</h1>
          <p className="lede" style={{ marginTop: '1rem' }}>{d.giftIntro}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="gifts">
            {content.giftCards.map((g, i) => (
              <Reveal className="gift" key={g.slug} delay={i * 60} as="article">
                <div className="gift__media">
                  <Framed src={g.image} alt="" width={1200} height={750}
                    sizes="(min-width: 760px) 45vw, 90vw" />
                </div>
                {g.yearRound && <div className="gift__tag">{d.yearRound}</div>}
                <h3>{P(g)('title')}</h3>
                <p>{P(g)('body')}</p>
                <a className="btn btn--ghost"
                  href={whatsappLink(content.settings, waMessage.gift(lang, P(g)('title')))}
                  target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon />{d.askAboutGift}
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section band-dark on-dark">
        <div className="wrap" style={{ maxWidth: '46rem' }}>
          <Reveal>
            <Heading title={lang === 'ar' ? 'كيف تعمل' : 'How they work'} />
            <p style={{ color: 'var(--on-dark-2)' }}>
              {lang === 'ar'
                ? 'تختارين المبلغ ونكتب الاسم على البطاقة في الصالون. تصرف على أي خدمة من القائمة، ويمكن استخدامها على أكثر من زيارة. أحضري البطاقة معك عند الحضور.'
                : 'You choose the amount and we write the name on the card in the salon. It can be spent on anything from the menu, and it does not have to be used in one visit. Bring the card with you when you come in.'}
            </p>
          </Reveal>
        </div>
      </section>

      <JsonLd data={[breadcrumbLd(lang, [
        { name: d.salon, path: '/' },
        { name: lang === 'ar' ? 'بطاقات الهدايا' : 'Gift cards', path: '/gift-cards' },
      ])]} />
    </>
  );
}
