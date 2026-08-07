import Link from 'next/link';
import { notes } from '@/lib/site';
import { Card } from '@/components/ui/card';
import { Section, SectionHead } from '@/components/shared/section';
import { Reveal } from '@/components/shared/reveal';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const tone = {
  blue: 'text-accent-blue',
  purple: 'text-accent-purple',
  emerald: 'text-accent-emerald',
} as const;

export function Notes() {
  return (
    <Section id="notes" tight>
      <Reveal>
        <SectionHead
          eyebrow="Engineering notes"
          title="Decisions, written down."
          action={
            <Link href="/notes" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              All notes
            </Link>
          }
        />
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((n, i) => (
          <Reveal key={n.slug} delay={0.07 * i}>
            <Card className="h-full">
              <Link href={`/notes/${n.slug}`} className="flex h-full flex-col gap-3 p-6">
                <span className={cn('font-mono text-[10px] uppercase tracking-[0.16em]', tone[n.tone])}>{n.tag}</span>
                <h3 className="text-[1.02rem] font-bold leading-[1.34] -tracking-[0.015em]">{n.title}</h3>
                <p className="text-[14.5px] leading-[1.62] text-ink-muted">{n.excerpt}</p>
                <dl className="mt-auto flex flex-wrap gap-3.5 border-t border-line pt-3.5">
                  {n.metrics.map((m) => (
                    <div key={m.label} className="flex flex-col gap-0.5">
                      <dd className="text-[15px] font-bold -tracking-[0.03em]">{m.value}</dd>
                      <dt className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink-dim">{m.label}</dt>
                    </div>
                  ))}
                </dl>
              </Link>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
