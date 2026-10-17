import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { type Lang, isLang, dict, href, pick } from '@/lib/i18n';
import { whatsappLink, waMessage } from '@/lib/format';
import { breadcrumbLd, JsonLd } from '@/lib/schema-org';
import Reveal from '@/components/Reveal';
import { Framed } from '@/components/blocks';
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
  const giftWa = (g: object) => whatsappLink(content.settings, waMessage.gift(lang, P(g)('title')));

  /* One of these is not like the others: Gift of Glow is the card the salon
     keeps in stock all year. It leads, full width, and the four seasonal cards
     sit below it, where four divides evenly into both two columns and four. */
  const lead = content.giftCards.find((g) => g.yearRound) ?? content.giftCards[0];
  const seasonal = content.giftCards.filter((g) => g !== lead);

  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <hr className="rule" />
          <h1>{d.nav.gift}</h1>
          <p className="lede" style={{ marginTop: '1rem' }}>{d.giftIntro}</p>
        </div>
      </section>

      {lead && (
        <section className="section section--tight">
          <div className="wrap">
            <div className="split">
              <Reveal>
                <Framed className="gift__media" src={lead.image} alt="" width={1200} height={900}
                  sizes="(min-width: 860px) 45vw, 90vw" />
              </Reveal>
              <Reveal delay={70}>
                {lead.yearRound && <div className="gift__tag">{d.yearRound}</div>}
                <h2>{P(lead)('title')}</h2>
                <p className="lede" style={{ marginTop: '0.7rem' }}>{P(lead)('body')}</p>
                <p>
                  <a className="btn btn--ghost" href={giftWa(lead)}
                    target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon />{d.askAboutGift}
                  </a>
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      <section className="section section--tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="gifts">
            {seasonal.map((g, i) => (
              <Reveal className="gift" key={g.slug} delay={i * 60} as="article">
                <Framed className="gift__media" src={g.image} alt="" width={1200} height={900}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" />
                <h3>{P(g)('title')}</h3>
                <p>{P(g)('body')}</p>
                <a className="btn btn--ghost" href={giftWa(g)}
                  target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon />{d.askAboutGift}
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight band-dark on-dark">
        <div className="wrap" style={{ maxWidth: '46rem' }}>
          <Reveal>
            <hr className="rule" />
            <h2>{lang === 'ar' ? 'كيف تعمل' : 'How they work'}</h2>
            <p className="lede" style={{ marginTop: '0.9rem' }}>
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
