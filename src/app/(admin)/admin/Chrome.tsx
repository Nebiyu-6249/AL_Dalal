import Link from 'next/link';
import type { ReactNode } from 'react';

const TABS = [
  { href: '/admin', label: 'Prices' },
  { href: '/admin/categories', label: 'Service pages' },
  { href: '/admin/photos', label: 'Photos' },
  { href: '/admin/contact', label: 'Contact' },
  { href: '/admin/hours', label: 'Hours' },
  { href: '/admin/gift-cards', label: 'Gift cards' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/faqs', label: 'Questions' },
];

export default function Chrome({
  who, current, title, intro, children,
}: {
  who: string; current: string; title: string; intro: string; children: ReactNode;
}) {
  return (
    <div className="a-shell">
      <div className="a-top">
        <b>Al Dalal admin</b>
        <span className="a-who">Signed in as {who}</span>
        <span style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <Link href="/" className="a-btn a-btn--quiet" style={{ textDecoration: 'none' }}>
            View site
          </Link>
          <form method="post" action="/api/auth/logout">
            <button type="submit" className="a-btn a-btn--quiet">Sign out</button>
          </form>
        </span>
      </div>

      <nav className="a-tabs" aria-label="Admin sections">
        {TABS.map((t) => (
          <Link key={t.href} href={t.href} aria-current={t.href === current ? 'page' : undefined}>
            {t.label}
          </Link>
        ))}
      </nav>

      <main className="a-main">
        <h1>{title}</h1>
        <p>{intro}</p>
        {children}
      </main>
    </div>
  );
}
