import * as React from 'react';
import { cn } from '@/lib/utils';

/** Base surface used by projects, posts and any future content card. */
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-line surface-card',
        'transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:-translate-y-1 hover:border-[rgba(148,163,184,0.26)] hover:shadow-lift',
        'before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500',
        'before:bg-[radial-gradient(70%_60%_at_50%_0%,rgba(79,125,249,0.13),transparent_70%)] hover:before:opacity-100',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export const CardBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('relative z-10 flex flex-col justify-center gap-3.5 p-7 sm:p-8', className)} {...props} />
);

export const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-[7px] border border-line bg-[rgba(148,163,184,0.05)] px-2.5 py-[5px] font-mono text-[11px] text-ink-muted">
    {children}
  </span>
);
