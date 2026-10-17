import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Service, Photo, Faq } from '@/db/schema';
import { type Lang, dict, href, pick } from '@/lib/i18n';
import Reveal from './Reveal';

/* --------------------------------------------------------------- imagery */

export function Arch({
  src, alt, width, height, className = '', sizes, priority,
}: {
  src: string; alt: string; width: number; height: number;
  className?: string; sizes?: string; priority?: boolean;
}) {
  return (
    <div className={`arch ${className}`.trim()}>
      <Image src={src} alt={alt} width={width} height={height}
        sizes={sizes ?? '(min-width: 860px) 40vw, 90vw'} priority={priority} />
    </div>
  );
}

export function Framed({
  src, alt, width, height, className = '', sizes,
}: {
  src: string; alt: string; width: number; height: number;
  className?: string; sizes?: string;
}) {
  return (
    <div className={`frame ${className}`.trim()}>
      <Image src={src} alt={alt} width={width} height={height}
        sizes={sizes ?? '(min-width: 720px) 25vw, 45vw'} loading="lazy" />
    </div>
  );
}

export function Gallery({ photos, lang }: { photos: Photo[]; lang: Lang }) {
  if (!photos.length) return null;
  return (
    <div className="gallery">
      {photos.map((p) => (
        <Framed key={p.id} src={p.url} width={p.width || 800} height={p.height || 800}
          alt={pick(p as unknown as Record<string, unknown>, 'alt', lang)} />
      ))}
    </div>
  );
}

export function Strip({ photos, lang }: { photos: Photo[]; lang: Lang }) {
  if (!photos.length) return null;
  return (
    <div className="strip">
      {photos.map((p) => (
        <Framed key={p.id} src={p.url} width={p.width || 1200} height={p.height || 800}
          sizes="(min-width: 780px) 33vw, 50vw"
          alt={pick(p as unknown as Record<string, unknown>, 'alt', lang)} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------- service lists */

/** Items past this one all arrive together. A 23-item group must not take two
 *  seconds to finish appearing. */
const STAGGER_CAP = 7;

/** One service. The whole item is a WhatsApp link, and the gold dot leader
 *  runs from the end of the name to the word that replaced the price. */
function ServiceItem({
  s, lang, waHref, index,
}: { s: Service; lang: Lang; waHref: string; index: number }) {
  const d = dict(lang);
  const name = pick(s as unknown as Record<string, unknown>, 'name', lang);
  const note = pick(s as unknown as Record<string, unknown>, 'note', lang);
  return (
    <li className="svc" style={{ '--svc-i': Math.min(index, STAGGER_CAP) } as CSSProperties}>
      <a className="svc__link" href={waHref} target="_blank" rel="noopener noreferrer">
        <span className="svc__row">
          <span className="svc__name">{name}</span>
          <span className="svc__leader" aria-hidden="true" />
          <span className="svc__ask">{d.ask}</span>
        </span>
        {note && <span className="svc__note">{note}</span>}
      </a>
    </li>
  );
}

export function ServiceList({
  groups, lang, waFor,
}: {
  groups: Array<{ en: string; ar: string; items: Service[] }>;
  lang: Lang;
  waFor: (s: Service) => string;
}) {
  return (
    <div>
      {groups.map((g) => (
        /* Each group reveals itself: the hairline draws, then the items fade
           in. The block itself does not fade, so nothing moves twice. */
        <Reveal bare className="svc-group" key={g.en}>
          {g.en && (
            <div className="svc-group__head">
              <h3 className="svc-group__name">{lang === 'ar' ? g.ar || g.en : g.en}</h3>
              <span className="svc-group__rule" aria-hidden="true" />
            </div>
          )}
          <ul className={`svcs${g.items.length <= 3 ? ' svcs--short' : ''}`}>
            {g.items.map((s, i) => (
              <ServiceItem key={s.id} s={s} lang={lang} index={i} waHref={waFor(s)} />
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- categories */

export type Tile = {
  slug: string; name: string; tagline: string;
  image: string; services: string[];
};

export function CategoryTiles({ tiles, lang }: { tiles: Tile[]; lang: Lang }) {
  return (
    <div className="cats">
      {tiles.map((c) => (
        <Link key={c.slug} className="cat" href={href(lang, `/services/${c.slug}`)}>
          <div className="cat__media arch">
            <Image src={c.image} alt="" width={900} height={1125}
              sizes="(min-width: 720px) 30vw, 45vw" loading="lazy" />
          </div>
          <div className="cat__name">{c.name}</div>
          <div className="cat__line">{c.tagline}</div>
          {c.services.length > 0 && (
            <div className="cat__services">{c.services.join(' \u00b7 ')}</div>
          )}
        </Link>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------- faqs */

export function Faqs({ items, lang }: { items: Faq[]; lang: Lang }) {
  if (!items.length) return null;
  return (
    <div>
      {items.map((f) => (
        <details className="faq" key={f.id}>
          <summary>{pick(f as unknown as Record<string, unknown>, 'question', lang)}</summary>
          <div className="faq__body">
            <p>{pick(f as unknown as Record<string, unknown>, 'answer', lang)}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- heading */

export function Heading({
  title, children, id,
}: { title: string; children?: React.ReactNode; id?: string }) {
  return (
    <div className="head">
      <hr className="rule" />
      <h2 id={id}>{title}</h2>
      {children}
    </div>
  );
}
