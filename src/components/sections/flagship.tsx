import Link from 'next/link';
import { ArrowRight, Database, Globe, ShieldCheck, Timer, type LucideIcon } from 'lucide-react';
import { flagship } from '@/lib/site';
import { Section, SectionHead } from '@/components/shared/section';
import { Reveal } from '@/components/shared/reveal';
import { Counter } from '@/components/shared/counter';
import { buttonVariants } from '@/components/ui/button';
import { Laptop } from '@/components/shared/laptop';

const ICONS: Record<string, LucideIcon> = {
  database: Database,
  globe: Globe,
  shield: ShieldCheck,
  timer: Timer,
};

/** Product first: what it does, what it's built with, what it delivers. No walls of prose. */
export function Flagship() {
  return (
    <Section id="work">
      <Reveal>
        <SectionHead
          eyebrow="Flagship build"
          title="Products in production."
          lead="Software that businesses use every day — not case studies waiting for a client."
        />
      </Reveal>

      <Reveal>
        <article className="overflow-hidden rounded-3xl border border-line surface-card">
          <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
            <div className="order-2 flex flex-col justify-center p-6 sm:p-11 lg:order-1">
              <span className="inline-flex h-[26px] w-max items-center rounded-full border border-[rgba(79,125,249,0.32)] bg-[rgba(79,125,249,0.10)] px-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#9EC0FF]">
                {flagship.badge}
              </span>
              <h3 className="mt-4 text-[clamp(1.5rem,2.6vw,2rem)] font-bold -tracking-[0.035em]">{flagship.title}</h3>
              <p className="mt-3.5 text-[15px] leading-[1.66] text-ink-muted">{flagship.summary}</p>

              <ul className="mt-5 flex flex-wrap gap-[7px]">
                {flagship.stack.map((t) => (
                  <li
                    key={t}
                    className="rounded-lg border border-line bg-[rgba(148,163,184,0.04)] px-2.5 py-1.5 text-[11.5px] text-ink-muted"
                  >
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-[26px] flex flex-wrap gap-2.5">
                <Link href="/#contact" className={buttonVariants({ size: 'sm' })}>
                  Request a walkthrough <ArrowRight />
                </Link>
                <Link href="/#code" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                  See the code
                </Link>
              </div>
            </div>

            <div className="order-1 grid place-items-center border-b border-line bg-[radial-gradient(80%_80%_at_60%_40%,rgba(79,125,249,0.09),transparent_70%)] p-5 sm:p-9 lg:order-2 lg:border-b-0 lg:border-l">
              <Laptop className="w-full max-w-[520px]" glow={false} />
            </div>
          </div>
        </article>
      </Reveal>

      <Reveal>
        <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {flagship.impact.map((m) => {
            const Icon = ICONS[m.icon];
            return (
              <div
                key={m.label}
                className="flex flex-col gap-2.5 rounded-2xl border border-line bg-[rgba(148,163,184,0.035)] px-[18px] pb-4 pt-[18px] transition-[border-color,background-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[rgba(148,163,184,0.26)] hover:bg-[rgba(148,163,184,0.06)]"
              >
                <span className="grid size-8 place-items-center rounded-[10px] border border-[rgba(126,150,255,0.32)] bg-[linear-gradient(155deg,rgba(79,125,249,0.20),rgba(139,92,246,0.10))]">
                  <Icon className="size-[15px] [stroke:url(#icg)]" />
                </span>
                <dd className="text-[1.45rem] font-bold leading-none -tracking-[0.04em]">
                  <Counter to={m.value} suffix={m.suffix} />
                </dd>
                <dt className="text-[12.5px] leading-[1.45] text-ink-muted">{m.label}</dt>
              </div>
            );
          })}
        </dl>
      </Reveal>
    </Section>
  );
}
