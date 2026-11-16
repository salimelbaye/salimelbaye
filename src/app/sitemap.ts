import type { MetadataRoute } from 'next';
import { site, apps } from '@/lib/site';

/**
 * Only URLs that answer 200. The public site is one page plus the app privacy
 * policies; the project, blog and resume routes it once listed were never
 * built.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    // No trailing slash: matches the homepage's canonical tag exactly.
    { url: site.url, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...apps.map((a) => ({
      url: `${site.url}${a.privacyUrl}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    })),
  ];
}
