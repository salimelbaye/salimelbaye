import { Github, ArrowUpRight, BookMarked } from 'lucide-react';
import { github } from '@/lib/site';
import { getRepos, getContributions, languageColor } from '@/lib/github';
import { Section, SectionHead } from '@/components/shared/section';
import { Reveal } from '@/components/shared/reveal';
import { Counter } from '@/components/shared/counter';
import { buttonVariants } from '@/components/ui/button';

const LEVELS = [
  'bg-[rgba(148,163,184,0.07)]',
  'bg-[rgba(79,125,249,0.26)]',
  'bg-[rgba(79,125,249,0.48)]',
  'bg-[rgba(79,125,249,0.72)]',
  'bg-[#6E9BFF]',
];

const ago = (iso: string) => {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d < 1) return 'today';
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
};

/**
 * Server component. Everything here is fetched from GitHub — nothing is invented.
 * If a fetch fails or GITHUB_TOKEN is missing, that block is omitted rather than
 * filled with plausible-looking numbers a recruiter would catch.
 */
export async function GitHubActivity() {
  const [repos, contributions] = await Promise.all([getRepos(3), getContributions()]);

  // Never invent activity. If GitHub is unreachable, degrade to a plain profile
  // link so the #code anchor still resolves and the nav stays intact.
  if (!repos && !contributions) {
    return (
      <Section id="code" tight>
        <Reveal>
          <SectionHead eyebrow="Code" title="I write software every week." />
        </Reveal>
        <Reveal>
          <a
            href={github.profileUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={buttonVariants({ variant: 'ghost' })}
          >
            <Github /> View GitHub profile <ArrowUpRight />
          </a>
        </Reveal>
      </Section>
    );
  }

  return (
    <Section id="code" tight>
      <Reveal>
        <SectionHead
          eyebrow="Code"
          title="I write software every week."
          lead="Pulled live from the GitHub API and revalidated hourly, so this section is never further than an hour out of date."
        />
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        {contributions ? (
          <Reveal>
            <div className="h-full rounded-2xl border border-line surface-card p-6 sm:p-7">
              <div className="mb-5 flex items-center gap-2.5">
                <Github className="size-[17px] text-ink-muted" />
                <h3 className="text-[15px] font-bold -tracking-[0.02em]">Contribution activity</h3>
                <span className="ml-auto font-mono text-[11px] text-ink-dim">
                  <Counter to={contributions.total} suffix=" contributions" /> · last 12 months
                </span>
              </div>

              <div className="grid grid-flow-col grid-rows-7 gap-[3px] overflow-hidden" aria-hidden>
                {contributions.days.map((d) => (
                  <i key={d.date} className={`block aspect-square w-full rounded-[2px] ${LEVELS[d.level]}`} />
                ))}
              </div>
              <p className="sr-only">
                {contributions.total} contributions in the last twelve months. Current streak{' '}
                {contributions.currentStreak} days.
              </p>

              <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-[18px]">
                {[
                  { v: contributions.currentStreak, s: ' days', k: 'Current streak' },
                  { v: contributions.longestStreak, s: ' days', k: 'Longest streak' },
                  { v: repos?.length ?? 0, s: '', k: 'Recent repositories' },
                ].map((m) => (
                  <div key={m.k}>
                    <dd className="block text-[1.15rem] font-bold -tracking-[0.035em]">
                      <Counter to={m.v} suffix={m.s} />
                    </dd>
                    <dt className="mt-[5px] block font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-dim">
                      {m.k}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        ) : null}

        <Reveal delay={0.08}>
          <div className="flex flex-col gap-2.5">
            {repos?.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-[11px] border border-line bg-[rgba(148,163,184,0.03)] p-3.5 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[rgba(148,163,184,0.28)] hover:bg-[rgba(148,163,184,0.07)]"
              >
                <span className="flex items-center gap-[7px] text-[13px] font-semibold -tracking-[0.015em]">
                  <BookMarked className="size-[13px] text-ink-dim" />
                  {r.name}
                </span>
                {r.description ? <p className="mt-1.5 text-xs leading-[1.55] text-ink-muted">{r.description}</p> : null}
                <span className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 font-mono text-[10px] text-ink-dim">
                  {r.language ? (
                    <em className="inline-flex items-center gap-1.5 not-italic">
                      <i className="size-2 rounded-full" style={{ background: languageColor(r.language) }} />
                      {r.language}
                    </em>
                  ) : null}
                  <em className="not-italic">★ {r.stars}</em>
                  <em className="not-italic">Updated {ago(r.pushedAt)}</em>
                </span>
              </a>
            ))}
            <a
              href={github.profileUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              View GitHub profile <ArrowUpRight />
            </a>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
