import Link from 'next/link';
import { apps, nav, site } from '@/lib/site';
import { Logo } from '@/components/layout/logo';

export function Footer() {
  return (
    <footer className="mt-6 border-t border-line py-11">
      <div className="container flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-[11px]">
            <Logo compact />
            <span className="text-[13px] text-ink-dim">
              © {new Date().getFullYear()} {site.name}. Built with Next.js.
            </span>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-5">
            {nav.slice(1).map((item) => (
              <Link key={item.href} href={item.href} className="text-[13px] text-ink-muted transition-colors hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        {/* Plain <a>: two of these pages are served by separate Workers. */}
        <nav aria-label="Privacy policies" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
          <span className="text-ink-dim">Privacy policies</span>
          {apps.map((a) => (
            <a key={a.privacyUrl} href={a.privacyUrl} className="text-ink-muted transition-colors hover:text-ink">
              {a.name}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
