import type { MetadataRoute } from 'next';
import { getContent } from '@/lib/content';
import { origin, isLive } from '@/lib/format';

/**
 * Both languages are listed, and each entry declares its counterpart through
 * `alternates.languages`, so Google treats the English and Arabic pages as one
 * document in two languages rather than duplicates competing with each other.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isLive()) return [];

  const base = origin();
  const content = await getContent();
  const now = new Date();

  const paths: Array<{ path: string; priority: number; freq: 'weekly' | 'monthly' | 'yearly' }> = [
    { path: '', priority: 1, freq: 'weekly' },
    { path: '/services', priority: 0.9, freq: 'weekly' },
    ...content.categories.map((c) => ({
      path: `/services/${c.slug}`, priority: 0.9, freq: 'weekly' as const,
    })),
    { path: '/menu', priority: 0.8, freq: 'weekly' },
    { path: '/gift-cards', priority: 0.7, freq: 'monthly' },
    { path: '/about', priority: 0.6, freq: 'monthly' },
    { path: '/contact', priority: 0.8, freq: 'monthly' },
    { path: '/privacy', priority: 0.2, freq: 'yearly' },
    { path: '/terms', priority: 0.2, freq: 'yearly' },
  ];

  return paths.flatMap(({ path, priority, freq }) => {
    const en = `${base}${path || '/'}`;
    const ar = `${base}/ar${path}`;
    const languages = { en, ar, 'x-default': en };
    return [
      { url: en, lastModified: now, changeFrequency: freq, priority, alternates: { languages } },
      { url: ar, lastModified: now, changeFrequency: freq, priority: priority * 0.9, alternates: { languages } },
    ];
  });
}
