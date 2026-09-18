import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import '../../globals.css';
import { fontVars } from '../../fonts';
import { getContent } from '@/lib/content';
import { type Lang, LANGS, isLang, dict, dir, href, pick } from '@/lib/i18n';
import { whatsappLink, waMessage, siteUrl, origin, isLive } from '@/lib/format';
import { localBusinessLd, JsonLd } from '@/lib/schema-org';
import Header from '@/components/Header';
import { Footer, Dock } from '@/components/Footer';

export const revalidate = 3600;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> },
): Promise<Metadata> {
  const { lang: raw } = await params;
  if (!isLang(raw)) return {};
  const lang = raw as Lang;
  const d = dict(lang);
  const base = siteUrl();

  const title = lang === 'ar'
    ? 'صالون الدلال للحناء والتجميل | المعيريض، رأس الخيمة'
    : 'Al Dalal Henna & Beauty | Al Maireed, Ras Al Khaimah';
  const description = lang === 'ar'
    ? 'صالون سيدات في المعيريض برأس الخيمة. حناء وضفائر وإكستنشن وعلاجات شعر وأظافر وفيشل ورموش. راسلينا على واتساب للحجز وللسعر.'
    : 'A ladies salon in Al Maireed, Ras Al Khaimah. Henna, braiding and extensions, hair treatments, nails, facials, waxing and lashes. Message us on WhatsApp to book and for a price.';

  return {
    ...(base ? { metadataBase: new URL(base) } : {}),
    title: { default: title, template: `%s | ${d.salon}` },
    description,
    applicationName: d.salon,
    alternates: {
      canonical: href(lang, '/'),
      languages: { en: '/', ar: '/ar', 'x-default': '/' },
    },
    // Keeps the .vercel.app preview address out of Google until the real
    // domain is attached and NEXT_PUBLIC_SITE_URL is set.
    robots: isLive()
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      type: 'website',
      siteName: d.salon,
      title,
      description,
      locale: lang === 'ar' ? 'ar_AE' : 'en_AE',
      url: `${origin()}${href(lang, '/')}`,
      images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: d.salon }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/images/og-image.jpg'] },
    icons: {
      icon: [
        { url: '/images/mark-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/images/mark-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [{ url: '/images/mark-180.png', sizes: '180x180' }],
    },
    manifest: '/manifest.webmanifest',
    formatDetection: { telephone: true, address: false, email: true },
  };
}

export default async function SiteLayout({
  children, params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;

  const content = await getContent();
  const d = dict(lang);

  const categories = content.categories.map((c) => ({
    slug: c.slug,
    name: pick(c as unknown as Record<string, unknown>, 'name', lang),
    tagline: pick(c as unknown as Record<string, unknown>, 'tagline', lang),
  }));

  const notice = pick(content.settings as unknown as Record<string, unknown>, 'notice', lang);

  return (
    <html lang={lang} dir={dir(lang)} className={fontVars}>
      <body>
        <a className="skip" href="#main">{d.skipToContent}</a>

        {content.settings.noticeActive && notice && (
          <div className="notice" role="status">{notice}</div>
        )}

        <Header
          lang={lang}
          categories={categories}
          whatsappHref={whatsappLink(content.settings, waMessage.general(lang))}
        />

        <main id="main">{children}</main>

        <Footer content={content} lang={lang} />
        <Dock content={content} lang={lang} />

        <JsonLd data={[localBusinessLd(content, lang)]} />
      </body>
    </html>
  );
}
