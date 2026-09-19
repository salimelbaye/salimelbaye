import { APP_NAME, APP_TAGLINE } from '@/lib/us/model';

/**
 * Served from /us so installing to the home screen scopes the app to the
 * private area rather than the whole site.
 */
export const dynamic = 'force-static';

export function GET() {
  return Response.json(
    {
      name: APP_NAME,
      short_name: 'Us',
      description: APP_TAGLINE,
      start_url: '/us',
      scope: '/us',
      display: 'standalone',
      background_color: '#0A090B',
      theme_color: '#0A090B',
      orientation: 'portrait',
      icons: [
        { src: '/us/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        { src: '/us/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/us/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/us/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=3600',
      },
    },
  );
}
