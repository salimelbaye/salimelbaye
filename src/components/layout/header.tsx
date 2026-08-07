'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { nav } from '@/lib/site';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Logo } from '@/components/layout/logo';

export function Header() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-300',
        stuck && 'border-b-line bg-bg/70 backdrop-blur-xl backdrop-saturate-150',
      )}
    >
      <div className="container">
        <nav className="flex h-[72px] items-center justify-between" aria-label="Main">
          <Logo />

          <div className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-[13px] py-2 text-sm text-ink-muted transition-colors hover:bg-[rgba(148,163,184,0.07)] hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/#contact" className={cn(buttonVariants({ size: 'sm' }), 'hidden sm:inline-flex')}>
              Let&apos;s Talk
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid size-[38px] place-items-center rounded-[10px] border border-line bg-[rgba(148,163,184,0.05)] lg:hidden"
            >
              {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
            </button>
          </div>
        </nav>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-bg/95 backdrop-blur-xl lg:hidden">
          <div className="container flex flex-col py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-[rgba(148,163,184,0.07)] py-3 text-[15px] text-ink-muted"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/#contact" onClick={() => setOpen(false)} className={cn(buttonVariants(), 'mt-4')}>
              Let&apos;s Talk
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
