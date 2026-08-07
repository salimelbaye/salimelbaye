import { stats } from '@/lib/site';
import { Counter } from '@/components/shared/counter';

export function Achievements() {
  return (
    <section
      aria-label="By the numbers"
      className="border-y border-line bg-[linear-gradient(180deg,rgba(11,16,35,0.7),rgba(5,8,22,0))]"
    >
      <div className="container">
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="relative px-5 py-9 text-center [&:not(:first-child)]:before:absolute [&:not(:first-child)]:before:inset-y-[26%] [&:not(:first-child)]:before:left-0 [&:not(:first-child)]:before:w-px [&:not(:first-child)]:before:bg-line"
            >
              <dd className="text-[clamp(1.75rem,3vw,2.35rem)] font-bold leading-none -tracking-[0.045em]">
                <Counter to={s.value} suffix={s.suffix} duration={1200 + i * 90} />
              </dd>
              <dt className="mt-2.5 text-[12.5px] text-ink-muted">{s.label}</dt>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-dim">{s.sub}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
