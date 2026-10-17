'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Testimonial } from '@/db/schema';
import { type Lang, dict, pick } from '@/lib/i18n';
import { ChevronIcon } from './Icons';

/**
 * The Google reviews, as a carousel.
 *
 * The track is a native scroll container, so the trackpad, a swipe, shift and
 * the wheel, and the arrow keys all work without any script. The two buttons
 * do one thing each: scrollBy. Everything else here is working out which of
 * them to disable.
 */
export default function Reviews({ items, lang }: { items: Testimonial[]; lang: Lang }) {
  const d = dict(lang);
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    // A right to left track counts scrollLeft down from zero, so the distance
    // travelled is the size of it either way.
    const travelled = Math.abs(el.scrollLeft);
    setAtStart(travelled <= 1);
    setAtEnd(max <= 1 || travelled >= max - 1);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => { frame = 0; measure(); });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    measure();
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [measure]);

  if (!items.length) return null;

  /** One screenful of cards. Snapping lands it on a card edge. */
  const step = (forward: boolean) => {
    const el = track.current;
    if (!el) return;
    const rtl = window.getComputedStyle(el).direction === 'rtl';
    const towardEnd = rtl ? -1 : 1;
    el.scrollBy({ left: el.clientWidth * (forward ? towardEnd : -towardEnd), behavior: 'smooth' });
  };

  return (
    <div className="carousel">
      <div className="carousel__nav">
        <button
          type="button" className="carousel__arrow carousel__arrow--prev"
          aria-label={d.prevReview} disabled={atStart} onClick={() => step(false)}
        >
          <ChevronIcon />
        </button>
        <button
          type="button" className="carousel__arrow carousel__arrow--next"
          aria-label={d.nextReview} disabled={atEnd} onClick={() => step(true)}
        >
          <ChevronIcon />
        </button>
      </div>

      {/* Focusable, so the arrow keys reach the track in every browser. */}
      <ul className="carousel__track" ref={track} tabIndex={0} aria-label={d.reviews}>
        {items.map((q) => (
          <li className="carousel__item" key={q.id}>
            <figure className="quote">
              <div className="quote__stars" aria-label={`${q.rating} / 5`}>
                <span aria-hidden="true">{'★'.repeat(q.rating)}</span>
              </div>
              <blockquote className="quote__body">
                <p>{pick(q as unknown as Record<string, unknown>, 'body', lang)}</p>
              </blockquote>
              <figcaption className="quote__who">
                {q.name}
                {q.saidOn ? ` · ${q.saidOn}` : ''}
                {q.source ? ` · ${q.source}` : ''}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
