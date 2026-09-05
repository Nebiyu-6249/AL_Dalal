import Link from 'next/link';
import Image from 'next/image';
import type { Content } from '@/lib/content';
import { type Lang, dict, href, pick } from '@/lib/i18n';
import {
  whatsappLink, waMessage, telLink, prettyPhone, uniformHours, clock,
} from '@/lib/format';
import { WhatsAppIcon, PhoneIcon, InstagramIcon, TikTokIcon } from './Icons';

export function Footer({ content, lang }: { content: Content; lang: Lang }) {
  const d = dict(lang);
  const { settings } = content;
  const L = (p: string) => href(lang, p);
  const uniform = uniformHours(content.hours);

  return (
    <footer className="ftr on-dark">
      <div className="wrap">
        <div className="ftr__grid">
          <div>
            <Image className="ftr__badge" src="/images/logo-badge-dark.png"
              alt="" width={78} height={78} loading="lazy" />
            <h4>{d.salon}</h4>
            <p style={{ fontSize: '0.925rem', marginBottom: '0.6rem' }}>
              {pick(settings as unknown as Record<string, unknown>, 'address', lang)}
            </p>
            <p style={{ fontSize: '0.925rem' }}>
              {d.ladiesOnly}. {d.languages}.
            </p>
            <div className="ftr__social">
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <TikTokIcon />
              </a>
              <a href={whatsappLink(settings, waMessage.general(lang))}
                target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          <div>
            <h4>{d.nav.services}</h4>
            <ul>
              {content.categories.map((c) => (
                <li key={c.slug}>
                  <Link href={L(`/services/${c.slug}`)}>
                    {pick(c as unknown as Record<string, unknown>, 'name', lang)}
                  </Link>
                </li>
              ))}
              <li><Link href={L('/menu')}>{d.nav.menu}</Link></li>
              <li><Link href={L('/gift-cards')}>{d.nav.gift}</Link></li>
            </ul>
          </div>

          <div>
            <h4>{d.findUs}</h4>
            <ul>
              <li>
                <a href={whatsappLink(settings, waMessage.general(lang))}
                  target="_blank" rel="noopener noreferrer">
                  {prettyPhone(settings.whatsapp)}{' \u00b7 WhatsApp'}
                </a>
              </li>
              <li><a href={telLink(settings)}>{prettyPhone(settings.phone)}</a></li>
              <li><a href={`mailto:${settings.email}`}>{settings.email}</a></li>
              <li>
                <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer">
                  {d.getDirections}
                </a>
              </li>
            </ul>
            <h4 style={{ marginTop: '1.4rem' }}>{d.openingHours}</h4>
            <ul>
              <li>
                {uniform
                  ? `${d.openDaily}, ${clock(uniform.opens, lang)} \u2013 ${clock(uniform.closes, lang)}`
                  : content.hours.map((h) => (
                    <span key={h.id} style={{ display: 'block' }}>
                      {d.days[h.weekday]}{': '}
                      {h.closed ? d.closed : `${clock(h.opens, lang)} \u2013 ${clock(h.closes, lang)}`}
                    </span>
                  ))}
              </li>
            </ul>
          </div>
        </div>

        <div className="ftr__base">
          <span>
            {'\u00a9'} {new Date().getFullYear()} {d.salon}. {d.rights}
          </span>
          <span style={{ display: 'flex', gap: '1.25rem' }}>
            <Link href={L('/privacy')}>{d.privacy}</Link>
            <Link href={L('/terms')}>{d.terms}</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

/** Thumb-reachable bar, mobile only. */
export function Dock({ content, lang }: { content: Content; lang: Lang }) {
  const d = dict(lang);
  return (
    <nav className="dock on-dark" aria-label={lang === 'ar' ? 'التواصل السريع' : 'Quick contact'}>
      <a className="dock__wa" href={whatsappLink(content.settings, waMessage.general(lang))}
        target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon />
        {d.book}
      </a>
      <a href={telLink(content.settings)}>
        <PhoneIcon />
        {d.call}
      </a>
    </nav>
  );
}
