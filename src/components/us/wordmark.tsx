import { cn } from '@/lib/utils';
import { APP_NAME, APP_TAGLINE } from '@/lib/us/model';

/**
 * The one place the ❤️ is allowed to be decorative. Everywhere else it
 * carries meaning.
 */
export function Wordmark({
  size = 'lg',
  tagline = false,
  className,
}: {
  size?: 'sm' | 'lg';
  tagline?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center gap-2 text-center', className)}>
      <h1
        className={cn(
          'font-display font-normal leading-[1.05] -tracking-[0.015em] text-us-ink',
          size === 'lg' ? 'text-[clamp(2.1rem,9vw,2.85rem)]' : 'text-[1.4rem]',
        )}
      >
        {APP_NAME}
        <span aria-hidden className="ml-2 align-[0.12em] text-[0.5em] text-us-rose">
          ❤
        </span>
      </h1>
      {tagline ? (
        <p
          className={cn(
            'font-display italic text-us-muted',
            size === 'lg' ? 'text-[1.02rem]' : 'text-[0.9rem]',
          )}
        >
          {APP_TAGLINE}
        </p>
      ) : null}
    </div>
  );
}
