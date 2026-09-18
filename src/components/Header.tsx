'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { type Lang, dict, href } from '@/lib/i18n';
import { WhatsAppIcon } from './Icons';

export type NavCategory = { slug: string; name: string; tagline: string };

export default function Header({
  lang, categories, whatsappHref,
}: {
  lang: Lang;
  categories: NavCategory[];
  whatsappHref: string;
}) {
  const d = dict(lang);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [flyout, setFlyout] = useState(false);
  const [panel, setPanel] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on navigation and on Escape.
  useEffect(() => { setPanel(false); setFlyout(false); }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setPanel(false); setFlyout(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = panel ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [panel]);

  const L = (p: string) => href(lang, p);
  // Same page, other language.
  const other: Lang = lang === 'ar' ? 'en' : 'ar';
  const bare = lang === 'ar' ? pathname.replace(/^\/ar/, '') || '/' : pathname;

  return (
    <header
      className="hdr"
      data-scrolled={scrolled}
      style={{ position: 'sticky' }}
      onMouseLeave={() => setFlyout(false)}
    >
      <div className="wrap">
        <div className="hdr__bar">
          <Link href={L('/')} className="hdr__brand" aria-label={d.salon}>
            <Image src="/images/logo-badge-ivory.png" alt="" width={46} height={46} priority />
            <span className="hdr__name">
              <b>{lang === 'ar' ? 'صالون الدلال' : 'AL DALAL'}</b>
              <span>{lang === 'ar' ? 'للحناء والتجميل' : 'HENNA & BEAUTY'}</span>
            </span>
          </Link>

          <nav className="hdr__nav" aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Main'}>
            <button
              type="button"
              className="hdr__link"
              aria-expanded={flyout}
              aria-controls="services-flyout"
              onClick={() => setFlyout((v) => !v)}
              onMouseEnter={() => setFlyout(true)}
            >
              {d.nav.services}
            </button>
            <Link className="hdr__link" href={L('/gift-cards')} onMouseEnter={() => setFlyout(false)}>{d.nav.gift}</Link>
            <Link className="hdr__link" href={L('/menu')} onMouseEnter={() => setFlyout(false)}>{d.nav.menu}</Link>
            <Link className="hdr__link" href={L('/about')} onMouseEnter={() => setFlyout(false)}>{d.nav.about}</Link>
            <Link className="hdr__link" href={L('/contact')} onMouseEnter={() => setFlyout(false)}>{d.nav.contact}</Link>
          </nav>

          <div className="hdr__actions">
            <Link className="langswitch" href={href(other, bare)} lang={other} aria-label={d.switchLangLabel}>
              {d.switchLang}
            </Link>
            <a className="btn btn--primary hdr__cta" href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              {d.book}
            </a>
            <button
              type="button"
              className="burger"
              aria-expanded={panel}
              aria-controls="mobile-panel"
              aria-label={panel ? d.menuClose : d.menuOpen}
              onClick={() => setPanel((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      <div className="flyout" id="services-flyout" data-open={flyout}>
        <div className="wrap">
          <div className="flyout__grid">
            {categories.map((c) => (
              <Link key={c.slug} className="flyout__item" href={L(`/services/${c.slug}`)}>
                <b>{c.name}</b>
                <span>{c.tagline}</span>
              </Link>
            ))}
            <Link className="flyout__item" href={L('/services')}>
              <b>{d.allServices}</b>
              <span>{d.allServicesSub}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="panel" id="mobile-panel" data-open={panel}>
        <Link href={L('/services')}>{d.nav.services}</Link>
        <div className="panel__sub">
          {categories.map((c) => (
            <Link key={c.slug} href={L(`/services/${c.slug}`)}>{c.name}</Link>
          ))}
        </div>
        <Link href={L('/gift-cards')}>{d.nav.gift}</Link>
        <Link href={L('/menu')}>{d.nav.menu}</Link>
        <Link href={L('/about')}>{d.nav.about}</Link>
        <Link href={L('/contact')}>{d.nav.contact}</Link>
      </div>
    </header>
  );
}
