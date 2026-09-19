import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollProgress } from '@/components/shared/scroll-progress';
import { personSchema, websiteSchema } from '@/lib/schema';

/**
 * Chrome for the public site. Lives in a route group so it adds no URL
 * segment — every existing path is unchanged — while /us can opt out of it
 * entirely.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <defs>
          <linearGradient id="icg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9EC0FF" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </linearGradient>
        </defs>
      </svg>
      <ScrollProgress />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify([personSchema, websiteSchema]) }}
      />
    </>
  );
}
