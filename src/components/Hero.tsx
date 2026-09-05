'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type Lang, dict, href } from '@/lib/i18n';
import { WhatsAppIcon } from './Icons';

export type Slide = { url: string; alt: string; width: number; height: number };

const INTERVAL = 6000;

export default function Hero({
  lang, slides, whatsappHref, headline, sub, meta,
}: {
  lang: Lang;
  slides: Slide[];
  whatsappHref: string;
  headline: string;
  sub: string;
  meta: string[];
}) {
  const d = dict(lang);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % slides.length), INTERVAL);
    return () => window.clearInterval(id);
  }, [slides.length, paused]);

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero__media" aria-hidden="true">
        {slides.map((s, n) => (
          <div className="hero__slide" key={s.url} data-active={n === i}>
            <Image
              src={s.url}
              alt=""
              width={s.width}
              height={s.height}
              priority={n === 0}
              sizes="100vw"
              quality={78}
            />
          </div>
        ))}
        <div className="hero__scrim" />
      </div>

      <div className="wrap">
        <div className="hero__inner">
          <Image
            className="hero__badge"
            src="/images/logo-badge-dark.png"
            alt=""
            width={84}
            height={84}
            priority
          />
          <h1>{headline}</h1>
          <p className="hero__sub">{sub}</p>

          <div className="hero__actions">
            <a className="btn btn--gold" href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              {d.book}
            </a>
            <Link className="btn btn--ghost" href={href(lang, '/menu')}>{d.viewMenu}</Link>
          </div>

          <p className="hero__meta">
            {meta.map((m) => <span key={m}>{m}</span>)}
          </p>

          {slides.length > 1 && (
            <div className="hero__dots" role="tablist" aria-label={lang === 'ar' ? 'صور الصالون' : 'Salon photographs'}>
              {slides.map((s, n) => (
                <button
                  key={s.url}
                  type="button"
                  role="tab"
                  className="hero__dot"
                  aria-current={n === i}
                  aria-label={s.alt}
                  onClick={() => setI(n)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
