'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gift, Heart, House, ListChecks, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/us', label: 'Home', Icon: House },
  { href: '/us/together', label: 'Us', Icon: Heart },
  { href: '/us/plans', label: 'Plans', Icon: ListChecks },
  { href: '/us/surprises', label: 'Surprises', Icon: Gift },
  { href: '/us/more', label: 'More', Icon: Menu },
] as const;

/** Sections that live under the "Us" tab but have their own top-level route. */
const US_TAB_PATHS = ['/us/together', '/us/signals', '/us/story', '/us/life-plan', '/us/decisions'];

function isActive(pathname: string, href: string): boolean {
  if (href === '/us') return pathname === '/us';
  if (href === '/us/together') return US_TAB_PATHS.some((p) => pathname.startsWith(p));
  return pathname.startsWith(href);
}

export function BottomNav({ pendingSignals = 0 }: { pendingSignals?: number }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sections"
      className="us-safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-us-line bg-[rgba(12,10,14,0.86)] backdrop-blur-xl backdrop-saturate-150"
    >
      <ul className="mx-auto flex h-[var(--us-nav-h)] max-w-[520px] items-stretch">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          const badge = href === '/us/together' ? pendingSignals : 0;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  // 48px+ touch target across the full cell height.
                  'relative flex h-full flex-col items-center justify-center gap-[5px] rounded-[12px]',
                  'transition-colors duration-200',
                  active ? 'text-us-rose' : 'text-us-dim hover:text-us-muted',
                )}
              >
                <span className="relative">
                  <Icon size={21} strokeWidth={active ? 2.1 : 1.7} aria-hidden />
                  {badge > 0 ? (
                    <span
                      aria-hidden
                      className="absolute -right-1.5 -top-1 size-[7px] rounded-full bg-us-rose shadow-[0_0_8px_rgba(208,140,134,0.9)]"
                    />
                  ) : null}
                </span>
                <span className="text-[10.5px] font-medium tracking-[0.01em]">
                  {label}
                  {badge > 0 ? <span className="sr-only"> — {badge} waiting</span> : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
