import type { MetadataRoute } from 'next';
import { origin, isLive } from '@/lib/format';

export default function robots(): MetadataRoute.Robots {
  // Before the real domain is attached, block everything so the .vercel.app
  // preview address cannot be indexed and compete with the domain later.
  if (!isLive()) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }],
    sitemap: `${origin()}/sitemap.xml`,
    host: origin(),
  };
}
