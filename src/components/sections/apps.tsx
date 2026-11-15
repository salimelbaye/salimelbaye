import { ArrowUpRight, Smartphone } from 'lucide-react';
import { apps } from '@/lib/site';
import { Card, CardBody, Chip } from '@/components/ui/card';
import { Section, SectionHead } from '@/components/shared/section';
import { Reveal } from '@/components/shared/reveal';

/**
 * The mobile apps, each with its public privacy policy. Plain <a> rather than
 * next/link: two of the policies are served by separate Workers, so a
 * client-side navigation or prefetch would ask this app for routes it does
 * not have.
 */
export function Apps() {
  return (
    <Section id="apps" tight>
      <Reveal>
        <SectionHead
          eyebrow="Mobile apps"
          title="Apps I've built."
          lead="Small, focused Android apps for training at home. Each one has a public privacy policy that says exactly what it does with data."
        />
      </Reveal>

      <ul className="grid gap-5 md:grid-cols-3">
        {apps.map((a, i) => (
          <li key={a.packageId} className="h-full">
            <Reveal delay={0.07 * i} className="h-full">
              <Card className="flex h-full flex-col">
                <CardBody className="h-full justify-start">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-[10px] border border-line bg-[rgba(148,163,184,0.05)] text-accent-blue">
                      <Smartphone className="size-[17px]" aria-hidden />
                    </span>
                    <Chip>{a.platform}</Chip>
                  </div>
                  <h3 className="text-lg font-bold -tracking-[0.02em]">{a.name}</h3>
                  <p className="text-[14.5px] leading-[1.62] text-ink-muted">{a.summary}</p>
                  <p className="break-all font-mono text-[11px] text-ink-dim">{a.packageId}</p>
                  <a
                    href={a.privacyUrl}
                    className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent-blue"
                  >
                    Privacy policy
                    <ArrowUpRight className="size-3.5" aria-hidden />
                    <span className="sr-only"> for {a.name}</span>
                  </a>
                </CardBody>
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
