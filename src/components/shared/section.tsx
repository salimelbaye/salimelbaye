import { cn } from '@/lib/utils';

export function Section({
  id,
  className,
  tight,
  children,
}: {
  id?: string;
  className?: string;
  tight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn('relative', tight ? 'py-20 sm:py-[84px]' : 'py-20 sm:py-28', className)}>
      <div className="container">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  action,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-12 flex flex-col gap-4 sm:mb-[52px] md:flex-row md:items-end md:justify-between md:gap-10">
      <div className="flex max-w-[64ch] flex-col gap-4">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="text-[clamp(1.9rem,3.4vw,2.75rem)] font-bold leading-[1.08] -tracking-[0.035em]">{title}</h2>
        {lead ? <p className="max-w-[60ch] text-[1.02rem] leading-[1.68] text-ink-muted">{lead}</p> : null}
      </div>
      {action}
    </div>
  );
}
