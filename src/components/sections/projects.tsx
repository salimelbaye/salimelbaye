import { CheckCheck, MessageCircle, Zap } from 'lucide-react';
import { projects } from '@/lib/site';
import { Card, CardBody, Chip } from '@/components/ui/card';
import { Section } from '@/components/shared/section';
import { Reveal } from '@/components/shared/reveal';
import { cn } from '@/lib/utils';

const kickerTone = {
  blue: 'text-accent-blue',
  purple: 'text-accent-purple',
  emerald: 'text-accent-emerald',
} as const;

/** Visual wells. Each one shows the product's actual output, not a stock illustration. */

function DomainScores() {
  const rows = [
    ['nordvault.io', 94],
    ['flowrelay.com', 88],
    ['quiethour.app', 76],
    ['baseloop.dev', 61],
    ['ledgerpine.co', 43],
  ] as const;

  return (
    <div className="relative z-10 flex w-full max-w-[290px] flex-col gap-[11px]">
      {rows.map(([name, score]) => (
        <div key={name} className="flex items-center gap-[11px] font-mono text-[11.5px] text-ink-muted">
          <span className="w-[104px] truncate">{name}</span>
          <span className="h-[5px] flex-1 overflow-hidden rounded-full bg-[rgba(148,163,184,0.13)]">
            <span
              className="block h-full rounded-full bg-[linear-gradient(90deg,#8B5CF6,#4F7DF9)]"
              style={{ width: `${score}%` }}
            />
          </span>
          <span className="w-[26px] text-right text-ink">{score}</span>
        </div>
      ))}
    </div>
  );
}

function MessageFlow() {
  const nodes = [
    { label: 'New message', Icon: MessageCircle },
    { label: 'Classify intent', Icon: Zap },
    { label: 'Reply & log to CRM', Icon: CheckCheck },
  ];

  return (
    <div className="relative z-10 flex flex-col items-center">
      {nodes.map(({ label, Icon }, i) => (
        <div key={label} className="flex flex-col items-center">
          {i > 0 ? (
            <span className="h-[22px] w-px bg-[linear-gradient(180deg,rgba(16,185,129,0.55),rgba(16,185,129,0.12))]" />
          ) : null}
          <div className="flex min-w-[172px] items-center gap-2.5 rounded-[11px] border border-line bg-card/90 px-3.5 py-2.5 text-[12.5px] text-ink">
            <Icon className="size-3.5 text-accent-emerald" />
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

const visuals: Record<string, React.ReactNode> = {
  'ai-domain-discovery': <DomainScores />,
  'whatsapp-automation': <MessageFlow />,
};

function Well({ children, lead }: { children: React.ReactNode; lead?: boolean }) {
  return (
    <div
      className={cn(
        'relative grid place-items-center overflow-hidden p-7',
        'bg-[radial-gradient(90%_90%_at_50%_50%,rgba(79,125,249,0.07),transparent_70%)]',
        lead ? 'min-h-[290px]' : 'min-h-[200px] border-b border-line',
        'after:pointer-events-none after:absolute after:inset-0',
        lead
          ? 'after:bg-[linear-gradient(180deg,transparent_60%,rgba(5,8,22,0.5))] lg:after:bg-[linear-gradient(90deg,rgba(5,8,22,0.6),transparent_28%)]'
          : 'after:bg-[linear-gradient(180deg,transparent_55%,rgba(5,8,22,0.5))]',
      )}
    >
      {children}
    </div>
  );
}

export function Projects() {
  const rest = projects.slice(1);

  return (
    <Section id="projects" tight>
      <div className="grid gap-5 md:grid-cols-2">
        {rest.map((p, i) => (
          <Reveal key={p.slug} delay={0.08 * (i + 1)}>
            <Card className="flex h-full flex-col">
              <Well>{visuals[p.slug]}</Well>
              <CardBody>
                <span className={cn('font-mono text-[10.5px] uppercase tracking-label', kickerTone[p.tone])}>
                  {p.kicker}
                </span>
                <h3 className="text-lg font-bold -tracking-[0.02em]">{p.title}</h3>
                <p className="text-[14.5px] leading-[1.62] text-ink-muted">{p.summary}</p>
                <div className="mt-1.5 flex flex-wrap gap-[7px]">
                  {p.chips.map((c) => (
                    <Chip key={c}>{c}</Chip>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
