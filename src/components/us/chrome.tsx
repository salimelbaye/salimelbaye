import Link from 'next/link';
import { Bell, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Page furniture: the sticky top bar, page headers, cards and empty states.
 * All server components — the private app ships almost no client JavaScript.
 */

export function TopBar({
  title,
  back,
  unread = 0,
}: {
  title?: string;
  back?: { href: string; label: string };
  unread?: number;
}) {
  return (
    <header
      className="sticky top-0 z-30 border-b border-us-line bg-[rgba(10,9,11,0.82)] backdrop-blur-xl backdrop-saturate-150"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="mx-auto flex h-[54px] max-w-[520px] items-center gap-2 px-4">
        {back ? (
          <Link
            href={back.href}
            className="-ml-2 flex size-10 shrink-0 items-center justify-center rounded-full text-us-muted transition-colors hover:text-us-ink"
          >
            <ChevronLeft size={22} aria-hidden />
            <span className="sr-only">Back to {back.label}</span>
          </Link>
        ) : null}

        <p className="min-w-0 flex-1 truncate font-display text-[1.18rem] leading-none text-us-ink">
          {title ?? (
            <>
              Hajar &amp; Salim
              <span aria-hidden className="ml-1.5 text-[0.62em] text-us-rose">
                ❤
              </span>
            </>
          )}
        </p>

        <Link
          href="/us/notifications"
          className="relative -mr-2 flex size-10 shrink-0 items-center justify-center rounded-full text-us-muted transition-colors hover:text-us-ink"
        >
          <Bell size={19} aria-hidden />
          {unread > 0 ? (
            <span
              aria-hidden
              className="absolute right-[9px] top-[8px] size-[7px] rounded-full bg-us-rose shadow-[0_0_8px_rgba(208,140,134,0.9)]"
            />
          ) : null}
          <span className="sr-only">
            Notifications{unread > 0 ? ` — ${unread} unread` : ''}
          </span>
        </Link>
      </div>
    </header>
  );
}

export function Screen({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <main
      className={cn(
        'us-scroll-pad relative z-10 mx-auto w-full max-w-[520px] px-4 pt-5',
        className,
      )}
    >
      {children}
    </main>
  );
}

export function PageIntro({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mb-6 animate-us-rise">
      {eyebrow ? <p className="us-eyebrow mb-2.5">{eyebrow}</p> : null}
      <h1 className="font-display text-[1.95rem] leading-[1.12] -tracking-[0.015em] text-us-ink">
        {title}
      </h1>
      {lead ? <p className="mt-2 text-[14px] leading-relaxed text-us-muted">{lead}</p> : null}
    </div>
  );
}

export function Card({
  children,
  className,
  as: Tag = 'section',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article' | 'li';
}) {
  return <Tag className={cn('us-surface p-5', className)}>{children}</Tag>;
}

export function CardTitle({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3.5 flex items-center justify-between gap-3">
      <h2 className="us-eyebrow">{children}</h2>
      {action}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-[14px] border border-dashed border-us-line px-4 py-6 text-center text-[13.5px] leading-relaxed text-us-dim">
      {children}
    </p>
  );
}

export function Pill({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'rose' | 'sage' | 'amber';
}) {
  const tones = {
    neutral: 'border-us-line text-us-muted bg-[rgba(236,220,216,0.04)]',
    rose: 'border-[rgba(208,140,134,0.3)] text-us-rose bg-us-rose-soft',
    sage: 'border-[rgba(137,174,148,0.3)] text-us-sage bg-[rgba(137,174,148,0.1)]',
    amber: 'border-[rgba(214,164,92,0.3)] text-us-amber bg-[rgba(214,164,92,0.1)]',
  } as const;
  return (
    <span
      className={cn(
        'inline-flex h-[25px] items-center gap-1.5 rounded-full border px-2.5 text-[11.5px] font-medium',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/** Row that navigates — used by the hub screens. */
export function NavRow({
  href,
  icon,
  title,
  meta,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  meta?: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="us-surface flex min-h-[64px] items-center gap-3.5 px-4 py-3.5 transition-[background-color,border-color] duration-200 hover:border-us-line-strong hover:bg-[rgba(236,220,216,0.05)]"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-us-rose-soft text-us-rose">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium text-us-ink">{title}</span>
        {meta ? <span className="mt-0.5 block truncate text-[12.5px] text-us-dim">{meta}</span> : null}
      </span>
      {badge && badge > 0 ? (
        <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-us-rose text-[11px] font-semibold text-[#231314]">
          {badge > 9 ? '9+' : badge}
        </span>
      ) : null}
    </Link>
  );
}

/**
 * Expand-to-reveal form, built on <details> so it costs no JavaScript and
 * still works if a script fails to load.
 */
export function Disclosure({
  label,
  children,
  open,
}: {
  label: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details open={open} className="group us-surface overflow-hidden">
      <summary className="flex min-h-[52px] cursor-pointer list-none items-center gap-2.5 px-4 text-[14px] font-medium text-us-ink [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden
          className="flex size-[22px] shrink-0 items-center justify-center rounded-full border border-us-line-strong text-[15px] leading-none text-us-rose transition-transform duration-300 group-open:rotate-45"
        >
          +
        </span>
        {label}
      </summary>
      <div className="border-t border-us-line px-4 pb-4 pt-4">{children}</div>
    </details>
  );
}

/** Thin progress track used by goals. */
export function Progress({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className="h-[5px] w-full overflow-hidden rounded-full bg-[rgba(236,220,216,0.1)]"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-us-rose transition-[width] duration-500 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
