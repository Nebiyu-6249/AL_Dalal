import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { type Lang, isLang, dict, href, pick } from '@/lib/i18n';
import {
  whatsappLink, waMessage, telLink, prettyPhone, uniformHours, clock,
} from '@/lib/format';
import { breadcrumbLd, JsonLd } from '@/lib/schema-org';
import Reveal from '@/components/Reveal';
import { WhatsAppIcon, PhoneIcon, PinIcon } from '@/components/Icons';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = (isLang(raw) ? raw : 'en') as Lang;
  return {
    title: lang === 'ar' ? 'اتصلي بنا' : 'Contact',
    description: lang === 'ar'
      ? 'صالون الدلال، المعيريض، رأس الخيمة. واتساب ‎+971 54 368 2760‎، مفتوح يوميًا من ١٠ صباحًا حتى ١٠ مساءً.'
      : 'Al Dalal Henna & Beauty, Al Maireed, Ras Al Khaimah. WhatsApp +971 54 368 2760, open every day 10am to 10pm.',
    alternates: { canonical: href(lang, '/contact'), languages: { en: '/contact', ar: '/ar/contact' } },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;
  const content = await getContent();
  const d = dict(lang);
  const s = content.settings;
  const uniform = uniformHours(content.hours);
  const P = (row: object) => (base: string) => pick(row as Record<string, unknown>, base, lang);
  const embed = `https://maps.google.com/maps?q=${s.latitude},${s.longitude}&z=16&output=embed`;

  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <hr className="rule" />
          <h1>{d.nav.contact}</h1>
          <p className="lede" style={{ marginTop: '1rem' }}>
            {lang === 'ar'
              ? 'كل الحجوزات تتم عبر واتساب. راسلينا بما ترغبين به ومتى، ونرد بالسعر والوقت اللازم.'
              : 'Every booking happens on WhatsApp. Message us what you want and when, and we will come back with the price and how long it takes.'}
          </p>
        </div>
      </section>

      <section className="section--tight" style={{ paddingBottom: 'var(--section-y)' }}>
        <div className="wrap">
          <div className="info">
            <Reveal>
              <dl>
                <dt>WhatsApp</dt>
                <dd>
                  <a href={whatsappLink(s, waMessage.general(lang))} target="_blank" rel="noopener noreferrer">
                    {prettyPhone(s.whatsapp)}
                  </a>
                </dd>
                <dt>{d.call}</dt>
                <dd><a href={telLink(s)}>{prettyPhone(s.phone)}</a></dd>
                <dt>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</dt>
                <dd><a href={`mailto:${s.email}`}>{s.email}</a></dd>
                <dt>{d.address}</dt>
                <dd>{P(s)('address')}</dd>
                <dt>{lang === 'ar' ? 'مواقف السيارات' : 'Parking'}</dt>
                <dd>{lang === 'ar' ? 'متوفرة أمام الصالون' : 'Available outside the salon'}</dd>
                <dt>{d.openingHours}</dt>
                <dd>
                  <ul className="hours-list" style={{ marginTop: '0.35rem' }}>
                    {uniform ? (
                      <li>
                        <span>{d.openDaily}</span>
                        <span>{clock(uniform.opens, lang)} &ndash; {clock(uniform.closes, lang)}</span>
                      </li>
                    ) : content.hours.map((h) => (
                      <li key={h.id}>
                        <span>{d.days[h.weekday]}</span>
                        <span>{h.closed ? d.closed : `${clock(h.opens, lang)} \u2013 ${clock(h.closes, lang)}`}</span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>

              <p style={{ marginTop: '2rem', display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <a className="btn btn--primary" href={whatsappLink(s, waMessage.general(lang))}
                  target="_blank" rel="noopener noreferrer"><WhatsAppIcon />{d.book}</a>
                <a className="btn btn--ghost" href={telLink(s)}><PhoneIcon />{d.call}</a>
                <a className="btn btn--ghost" href={s.mapsUrl} target="_blank" rel="noopener noreferrer">
                  <PinIcon />{d.getDirections}
                </a>
              </p>

              <p style={{ marginTop: '1.75rem', color: 'var(--taupe)', fontSize: '0.94rem' }}>
                {d.ladiesOnly}. {d.languages}. {d.walkIns}.
              </p>
            </Reveal>

            <Reveal delay={70}>
              <iframe
                className="map"
                src={embed}
                title={P(s)('address')}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </Reveal>
          </div>
        </div>
      </section>

      <JsonLd data={[breadcrumbLd(lang, [
        { name: d.salon, path: '/' },
        { name: lang === 'ar' ? 'اتصلي بنا' : 'Contact', path: '/contact' },
      ])]} />
    </>
  );
}
