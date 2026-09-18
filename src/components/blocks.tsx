import Image from 'next/image';
import Link from 'next/link';
import type { Service, Photo, Testimonial, Faq } from '@/db/schema';
import { type Lang, dict, href, pick } from '@/lib/i18n';

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

/** One service. The whole item is a WhatsApp link, because a figure is no
 *  longer printed beside it and asking is now the next step. The gold dot
 *  leader draws across on hover, echoing the leaders on the paper menu. */
function ServiceItem({ s, lang, waHref }: { s: Service; lang: Lang; waHref: string }) {
  const d = dict(lang);
  const name = pick(s as unknown as Record<string, unknown>, 'name', lang);
  const note = pick(s as unknown as Record<string, unknown>, 'note', lang);
  return (
    <li className="svc">
      <a className="svc__link" href={waHref} target="_blank" rel="noopener noreferrer">
        <span className="svc__leader" aria-hidden="true" />
        <span className="svc__name">{name}</span>
        {note && <span className="svc__note">{note}</span>}
        <span className="svc__ask">{d.ask}</span>
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
        <div className="svc-group" key={g.en}>
          {g.en && (
            <>
              <h3 className="svc-group__name">{lang === 'ar' ? g.ar || g.en : g.en}</h3>
              <div className="svc-group__rule" />
            </>
          )}
          <ul className="svcs">
            {g.items.map((s) => <ServiceItem key={s.id} s={s} lang={lang} waHref={waFor(s)} />)}
          </ul>
        </div>
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

/* ------------------------------------------------------------ testimonials */

export function Testimonials({ items, lang }: { items: Testimonial[]; lang: Lang }) {
  if (!items.length) return null;
  return (
    <div className="quotes">
      {items.map((q) => (
        <figure className="quote" key={q.id} style={{ margin: 0 }}>
          <div className="quote__stars" aria-label={`${q.rating} / 5`}>
            <span aria-hidden="true">{'\u2605'.repeat(q.rating)}</span>
          </div>
          <blockquote className="quote__body" style={{ margin: 0 }}>
            <p style={{ margin: 0 }}>
              {pick(q as unknown as Record<string, unknown>, 'body', lang)}
            </p>
          </blockquote>
          <figcaption className="quote__who">
            {q.name}
            {q.saidOn ? ` \u00b7 ${q.saidOn}` : ''}
            {q.source ? ` \u00b7 ${q.source}` : ''}
          </figcaption>
        </figure>
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
