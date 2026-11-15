import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    // /us is the private two-person app: never crawled, never in the sitemap.
    rules: [{ userAgent: '*', allow: '/', disallow: '/us' }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
