import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    // /us held a private app that has been removed; keep its old URLs uncrawled.
    rules: [{ userAgent: '*', allow: '/', disallow: '/us' }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
