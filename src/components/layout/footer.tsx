import Link from 'next/link';
import { nav, site } from '@/lib/site';
import { Logo } from '@/components/layout/logo';

export function Footer() {
  return (
    <footer className="mt-6 border-t border-line py-11">
      <div className="container flex flex-wrap items-center justify-between gap-6">
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
    </footer>
  );
}
