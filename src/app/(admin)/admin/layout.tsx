import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import './admin.css';

export const metadata: Metadata = {
  title: 'Al Dalal admin',
  robots: { index: false, follow: false, nocache: true },
};

/** Second root layout, kept separate from the public site so the salon pages
 *  stay free of anything the admin panel needs. */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
