import type { Content } from './content';
import { type Lang, pick, href } from './i18n';
import { origin, waNumber, prettyPhone } from './format';
import type { Faq } from '@/db/schema';

const abs = (path: string) => `${origin()}${path}`;

/**
 * The salon itself, with every service and its AED price attached as an offer
 * catalogue. Very few salon sites publish their prices in a form Google can
 * read, which is what makes this worth doing.
 */
export function localBusinessLd(content: Content, lang: Lang) {
  const { settings } = content;
  const name = lang === 'ar'
    ? 'صالون الدلال للحناء والتجميل'
    : 'Al Dalal Henna & Beauty';

  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': `${origin()}/#salon`,
    name,
    alternateName: lang === 'ar' ? 'Al Dalal Henna & Beauty' : 'صالون الدلال للحناء والتجميل',
    url: abs(href(lang, '/')),
    image: abs('/images/og-image.jpg'),
    logo: abs('/images/logo-badge-ivory.png'),
    telephone: prettyPhone(settings.phone),
    email: settings.email,
    priceRange: 'AED 15 - AED 700',
    currenciesAccepted: 'AED',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Al Maireed',
      addressLocality: 'Ras Al Khaimah',
      addressRegion: 'Ras Al Khaimah',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: settings.latitude,
      longitude: settings.longitude,
    },
    hasMap: settings.mapsUrl,
    openingHoursSpecification: content.hours
      .filter((h) => !h.closed)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'https://schema.org/Sunday', 'https://schema.org/Monday', 'https://schema.org/Tuesday',
          'https://schema.org/Wednesday', 'https://schema.org/Thursday', 'https://schema.org/Friday',
          'https://schema.org/Saturday',
        ][h.weekday],
        opens: h.opens,
        closes: h.closes,
      })),
    sameAs: [settings.instagram, settings.tiktok].filter(Boolean),
    availableLanguage: [
      { '@type': 'Language', name: 'Arabic' },
      { '@type': 'Language', name: 'English' },
      { '@type': 'Language', name: 'Amharic' },
    ],
    potentialAction: {
      '@type': 'CommunicateAction',
      target: `https://wa.me/${waNumber(settings)}`,
      name: lang === 'ar' ? 'احجزي عبر واتساب' : 'Book on WhatsApp',
    },
    makesOffer: content.services.map((s) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: pick(s as unknown as Record<string, unknown>, 'name', lang),
        serviceType: pick(
          content.categories.find((c) => c.slug === s.categorySlug) ??
          ({} as Record<string, unknown>),
          'name', lang,
        ),
      },
      priceCurrency: 'AED',
      ...(s.priceTo && s.priceTo !== s.priceFrom
        ? {
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: s.priceFrom,
            maxPrice: s.priceTo,
            priceCurrency: 'AED',
          },
        }
        : { price: s.priceFrom }),
      availableAtOrFrom: { '@id': `${origin()}/#salon` },
    })),
  };
}

export function serviceLd(
  content: Content, lang: Lang, slug: string,
) {
  const cat = content.categories.find((c) => c.slug === slug);
  if (!cat) return null;
  const rows = content.services.filter((s) => s.categorySlug === slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: pick(cat as unknown as Record<string, unknown>, 'name', lang),
    description: pick(cat as unknown as Record<string, unknown>, 'intro', lang),
    serviceType: pick(cat as unknown as Record<string, unknown>, 'name', lang),
    provider: { '@id': `${origin()}/#salon` },
    areaServed: { '@type': 'City', name: 'Ras Al Khaimah' },
    url: abs(href(lang, `/services/${slug}`)),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: pick(cat as unknown as Record<string, unknown>, 'name', lang),
      itemListElement: rows.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: pick(s as unknown as Record<string, unknown>, 'name', lang),
        },
        priceCurrency: 'AED',
        price: s.priceFrom,
      })),
    },
  };
}

export function faqLd(items: Faq[], lang: Lang) {
  if (!items.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: pick(f as unknown as Record<string, unknown>, 'question', lang),
      acceptedAnswer: {
        '@type': 'Answer',
        text: pick(f as unknown as Record<string, unknown>, 'answer', lang),
      },
    })),
  };
}

export function breadcrumbLd(
  lang: Lang, trail: Array<{ name: string; path: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: abs(href(lang, t.path)),
    })),
  };
}

/** Renders one or more JSON-LD blocks. */
export function JsonLd({ data }: { data: Array<object | null> }) {
  const clean = data.filter(Boolean);
  if (!clean.length) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(clean.length === 1 ? clean[0] : clean) }}
    />
  );
}
