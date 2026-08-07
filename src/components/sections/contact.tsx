import Link from 'next/link';
import { ArrowRight, Clock, Globe, Mail } from 'lucide-react';
import { site } from '@/lib/site';
import { Section } from '@/components/shared/section';
import { Reveal } from '@/components/shared/reveal';
import { buttonVariants } from '@/components/ui/button';

export function Contact() {
  return (
    <Section id="contact" tight>
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-line surface-card px-6 py-14 text-center sm:px-10 sm:py-[76px]">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-40%] h-[520px] w-[760px] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(79,125,249,0.20),transparent_70%)] blur-[50px]"
          />
          <div className="relative z-10 flex flex-col items-center gap-5">
            <span className="eyebrow justify-center">Contact</span>
            <h2 className="max-w-[20ch] text-[clamp(1.9rem,3.4vw,2.75rem)] font-bold leading-[1.08] -tracking-[0.035em]">
              Let&apos;s build something great together.
            </h2>
            <p className="max-w-[56ch] text-[1.02rem] leading-[1.68] text-ink-muted">
              Tell me what you&apos;re trying to automate, collect or launch. I reply to every message myself, usually
              within a day.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <a href={site.social.email} className={buttonVariants()}>
                Get In Touch <ArrowRight />
              </a>
              <Link href="/resume" className={buttonVariants({ variant: 'ghost' })}>
                View resume
              </Link>
            </div>
            <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-ink-dim">
              <li className="inline-flex items-center gap-[7px]">
                <Mail className="size-3.5" /> {site.email}
              </li>
              <li className="inline-flex items-center gap-[7px]">
                <Globe className="size-3.5" /> {site.positioning}
              </li>
              <li className="inline-flex items-center gap-[7px]">
                <Clock className="size-3.5" /> Open to new projects
              </li>
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
