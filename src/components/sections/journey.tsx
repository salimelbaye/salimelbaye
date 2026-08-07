import Link from 'next/link';
import { Download } from 'lucide-react';
import { journey } from '@/lib/site';
import { Section } from '@/components/shared/section';
import { Reveal } from '@/components/shared/reveal';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Milestones are ordered — the rail's colour ramp encodes progression, not decoration. */
const iconTone = [
  'text-[#93B4FF] border-[rgba(79,125,249,0.35)]',
  'text-[#A9B8FF] border-[rgba(109,110,246,0.35)]',
  'text-[#BCA6FF] border-[rgba(139,92,246,0.35)]',
  'text-[#8FD9C4] border-[rgba(45,166,166,0.35)]',
  'text-[#6EE7B7] border-[rgba(16,185,129,0.38)]',
];

export function Journey() {
  return (
    <Section id="about">
      <div className="grid gap-11 lg:grid-cols-[0.9fr_1.1fr] lg:gap-[72px]">
        <Reveal>
          <div id="journey" className="scroll-mt-28">
            <span className="eyebrow">About</span>
            <h2 className="mt-4 text-[clamp(1.9rem,3.4vw,2.75rem)] font-bold leading-[1.08] -tracking-[0.035em]">
              My Journey
            </h2>
            <p className="mt-4 max-w-[60ch] text-[1.02rem] leading-[1.68] text-ink-muted">
              From discipline to building software.
            </p>
            <p className="mt-6 border-l-2 border-[rgba(79,125,249,0.4)] py-0.5 pl-5 text-[14.5px] leading-[1.7] text-ink-muted">
              The through-line isn&apos;t code. It&apos;s showing up every day for something that only pays off later —
              first in uniform, then in training, now in products.
            </p>
            <Link href="/resume" className={cn(buttonVariants({ variant: 'ghost' }), 'mt-7')}>
              <Download /> Download resume
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ol className="relative flex flex-col before:absolute before:bottom-[22px] before:left-[21px] before:top-[22px] before:w-px before:bg-[linear-gradient(180deg,#4F7DF9,#8B5CF6_50%,#10B981)] before:opacity-45 sm:before:left-[23px]">
            {journey.map((m, i) => {
              const Icon = m.icon;
              return (
                <li key={m.title} className="group grid grid-cols-[44px_1fr] gap-4 py-4 sm:grid-cols-[48px_1fr] sm:gap-[22px]">
                  <span
                    className={cn(
                      'relative z-10 grid size-11 place-items-center rounded-[14px] border bg-[linear-gradient(180deg,#141B2E,#0C1222)]',
                      'shadow-[0_10px_26px_-14px_rgba(0,0,0,0.9)] transition-transform duration-300 group-hover:-translate-y-0.5 sm:size-12',
                      iconTone[i],
                    )}
                  >
                    <Icon className="size-[19px]" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h3 className="text-lg font-bold -tracking-[0.02em]">{m.title}</h3>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-dim">{m.period}</span>
                    </div>
                    <p className="mt-1.5 max-w-[62ch] text-[14.5px] leading-[1.62] text-ink-muted">{m.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}
