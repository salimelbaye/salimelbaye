import { Download } from 'lucide-react';
import { resume } from '@/lib/site';
import { Section, SectionHead } from '@/components/shared/section';
import { Reveal } from '@/components/shared/reveal';
import { Chip } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-line surface-card p-7">
    <h3 className="mb-[18px] font-mono text-[10.5px] font-medium uppercase tracking-label text-ink-dim">{title}</h3>
    {children}
  </div>
);

/** Renders unfilled fields as a visible dashed marker so placeholder data can never ship silently. */
const Placeholder = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-lg border border-dashed border-[rgba(148,163,184,0.28)] px-[7px] py-0.5 font-mono text-[10px] text-ink-dim">
    {children}
  </span>
);

export function Resume() {
  return (
    <Section id="resume" tight>
      <Reveal>
        <SectionHead
          eyebrow="Resume"
          title="Credentials, at a glance."
          action={
            <a href={resume.cvUrl} download className={buttonVariants({ size: 'sm' })}>
              <Download /> Download PDF
            </a>
          }
        />
      </Reveal>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <Reveal>
          <Panel title="Technical skills">
            {resume.skills.map((g) => (
              <div key={g.group} className="border-b border-[rgba(148,163,184,0.07)] py-3.5 last:border-b-0">
                <p className="mb-2 text-xs text-ink-dim">{g.group}</p>
                <div className="flex flex-wrap gap-[7px]">
                  {g.items.map((i) => (
                    <Chip key={i}>{i}</Chip>
                  ))}
                </div>
              </div>
            ))}
          </Panel>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="flex flex-col gap-5">
            <Panel title="Education">
              {resume.education.map((e, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_auto] gap-3 border-b border-[rgba(148,163,184,0.07)] py-3.5 last:border-b-0 last:pb-0"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold -tracking-[0.015em]">
                      {e.title || null}
                      {e.placeholder ? <Placeholder>{e.title ? 'add degree' : 'add institution'}</Placeholder> : null}
                    </div>
                    <p className="mt-[3px] text-[12.5px] text-ink-muted">{e.subtitle}</p>
                  </div>
                  <div className="whitespace-nowrap pt-[3px] font-mono text-[10.5px] text-ink-dim">
                    {e.when || <Placeholder>year</Placeholder>}
                  </div>
                </div>
              ))}
            </Panel>

            <Panel title="Certifications">
              {resume.certifications.map((c, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto] gap-3 py-3.5 pb-0">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                      {c.title || <Placeholder>add certification</Placeholder>}
                    </div>
                    <p className="mt-[3px] text-[12.5px] text-ink-muted">{c.subtitle}</p>
                  </div>
                  <div className="whitespace-nowrap pt-[3px] font-mono text-[10.5px] text-ink-dim">
                    {c.when || <Placeholder>year</Placeholder>}
                  </div>
                </div>
              ))}
            </Panel>

            <Panel title="Languages">
              {resume.languages.map((l) => (
                <div
                  key={l.name}
                  className="flex items-center gap-3 border-b border-[rgba(148,163,184,0.07)] py-2.5 last:border-b-0"
                >
                  <span className="w-[82px] text-[13px] font-medium">{l.name}</span>
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-[rgba(148,163,184,0.12)]">
                    <i
                      className="block h-full rounded-full bg-[linear-gradient(90deg,#4F7DF9,#8B5CF6)]"
                      style={{ width: `${l.pct}%` }}
                    />
                  </span>
                  <span className="w-[94px] whitespace-nowrap text-right font-mono text-[10.5px] text-ink-muted">
                    {l.level}
                  </span>
                </div>
              ))}
            </Panel>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
