import type { Metadata, Viewport } from 'next';
import { Instrument_Serif } from 'next/font/google';
import { APP_NAME } from '@/lib/us/model';

/**
 * Display face for the private app only. Loaded here rather than in the root
 * layout so the public site never downloads it.
 */
const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0A090B',
  width: 'device-width',
  initialScale: 1,
  // Lets the layout sit under the notch and home indicator.
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s — ${APP_NAME}` },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  // Installs to the iPhone home screen as a standalone app.
  manifest: '/us/manifest.webmanifest',
  appleWebApp: { capable: true, title: APP_NAME, statusBarStyle: 'black-translucent' },
  icons: {
    icon: [
      { url: '/us/icon.svg', type: 'image/svg+xml' },
      { url: '/us/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/us/apple-icon.png', sizes: '180x180' }],
  },
};

export default function UsRootLayout({ children }: { children: React.ReactNode }) {
  return <div className={`us-app us-ambient ${display.variable}`}>{children}</div>;
}
