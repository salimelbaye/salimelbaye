'use client';

import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';

/**
 * Buttons and feedback shared by every form in the private app. Kept in one
 * client component so the rest of the app can stay server-rendered.
 */

export function Submit({
  children,
  pendingLabel,
  className,
  variant = 'primary',
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingLabel?: string;
  variant?: 'primary' | 'quiet' | 'danger';
}) {
  const { pending } = useFormStatus();
  const variants = {
    primary: 'bg-us-rose text-[#231314] hover:bg-[#dd9a94] active:scale-[0.985]',
    quiet:
      'border border-us-line-strong bg-[rgba(236,220,216,0.05)] text-us-ink hover:bg-[rgba(236,220,216,0.1)] active:scale-[0.985]',
    danger:
      'border border-[rgba(208,90,90,0.35)] bg-[rgba(208,90,90,0.1)] text-[#E7A0A0] hover:bg-[rgba(208,90,90,0.16)]',
  } as const;

  return (
    <button
      type="submit"
      disabled={pending || rest.disabled}
      aria-busy={pending}
      className={cn(
        'inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[14px] px-5',
        'text-[15px] font-medium tracking-[-0.01em] transition-[background-color,transform,opacity] duration-200',
        'disabled:cursor-not-allowed disabled:opacity-55',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}

/** Inline error. `role="alert"` so VoiceOver announces it on submit. */
export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-[12px] border border-[rgba(208,90,90,0.3)] bg-[rgba(208,90,90,0.09)] px-3.5 py-2.5 text-[13.5px] leading-snug text-[#E7A0A0]"
    >
      {message}
    </p>
  );
}

export function FormNote({ children }: { children: React.ReactNode }) {
  return <p className="text-[12.5px] leading-relaxed text-us-dim">{children}</p>;
}

/** Disables a whole fieldset while its form is submitting. */
export function PendingFieldset({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <fieldset
      disabled={pending}
      className={cn('contents transition-opacity', pending && 'opacity-70', className)}
    >
      {children}
    </fieldset>
  );
}
