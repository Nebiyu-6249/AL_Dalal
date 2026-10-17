'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Fades a block in once, the first time it comes into view. It never replays,
 * and it does nothing at all when the visitor has asked for reduced motion.
 */
export default function Reveal({
  children, delay = 0, as: Tag = 'div', className = '', bare = false,
}: {
  children: ReactNode;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article';
  className?: string;
  /** Observe only, without the block's own fade. For a block that animates its
   *  own parts, such as a service group drawing its hairline and then its
   *  items, so the whole thing does not fade twice. */
  bare?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      el.dataset.shown = 'true';
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          window.setTimeout(() => { target.dataset.shown = 'true'; }, delay);
          io.unobserve(target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref as never} className={`${bare ? '' : 'reveal '}${className}`.trim()} data-shown="false">
      {children}
    </Tag>
  );
}
