import { cn } from '@/lib/utils';

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-8 w-max items-center gap-2.5 rounded-full border border-line-strong bg-[rgba(148,163,184,0.07)] pl-[11px] pr-3.5 text-[12.5px] text-ink-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ tone = 'emerald', className }: { tone?: 'blue' | 'purple' | 'emerald'; className?: string }) {
  const tones = {
    blue: 'bg-accent-blue shadow-[0_0_8px_rgba(79,125,249,0.9)]',
    purple: 'bg-accent-purple shadow-[0_0_8px_rgba(139,92,246,0.9)]',
    emerald: 'bg-accent-emerald shadow-[0_0_8px_rgba(16,185,129,0.9)]',
  } as const;
  return <span className={cn('size-[5px] shrink-0 rounded-full', tones[tone], className)} />;
}
