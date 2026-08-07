import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/#top" aria-label="Salim Elbaye — home" className={cn('flex items-center gap-[11px]', className)}>
      <span
        className={cn(
          'grid place-items-center rounded-[10px] text-[13px] font-bold text-white',
          'bg-[linear-gradient(145deg,#2B49B8,#4F7DF9_45%,#7C5CF0)]',
          'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_6px_20px_-8px_rgba(79,125,249,0.75)]',
          compact ? 'size-[30px] text-xs' : 'size-[34px]',
        )}
      >
        SE
      </span>
      {!compact ? (
        <span className="text-[13px] font-semibold tracking-[0.16em] text-ink">
          SALIM<span className="text-ink-dim">ELBAYE</span>
        </span>
      ) : null}
    </Link>
  );
}
