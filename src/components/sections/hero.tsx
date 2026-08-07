import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Download, Github, Globe, Linkedin, Mail } from 'lucide-react';
import { site, currentlyBuilding } from '@/lib/site';
import { Laptop } from '@/components/shared/laptop';
import { Badge, StatusDot } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Reveal } from '@/components/shared/reveal';

const socials = [
  { href: site.social.github, label: 'GitHub', Icon: Github },
  { href: site.social.linkedin, label: 'LinkedIn', Icon: Linkedin },
  { href: site.social.email, label: 'Email', Icon: Mail },
];

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[850px] items-center overflow-hidden pb-24 pt-[120px] max-lg:block max-lg:min-h-0 sm:pt-[150px]">
      {/* ambient lighting */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hero-grid absolute -inset-x-[10%] -top-[10%] bottom-[30%]" />
        <div className="absolute -left-44 -top-64 size-[620px] rounded-full bg-[rgba(59,88,220,0.20)] blur-[90px]" />
        <div className="absolute -right-28 -top-40 size-[520px] rounded-full bg-[rgba(124,92,240,0.16)] blur-[90px]" />
        <div className="absolute -bottom-56 left-[38%] size-[420px] rounded-full bg-[rgba(16,185,129,0.07)] blur-[90px]" />
      </div>

      <div className="container relative w-full">
        <div className="relative z-20 max-w-[560px] lg:max-w-[560px]">
          <div>
            <Reveal>
              <Badge>
                <StatusDot tone="emerald" className="size-1.5 animate-breathe" />
                {site.role}
              </Badge>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-6">
                <span className="relative block whitespace-nowrap text-[clamp(2.4rem,4.9vw,3.95rem)] font-extrabold leading-none -tracking-[0.05em] text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-[linear-gradient(90deg,rgba(79,125,249,0.75),rgba(139,92,246,0.35)_45%,transparent_80%)]">
                  Salim Elbaye
                </span>
                <span className="mt-5 block max-w-[27ch] text-[clamp(1.2rem,2vw,1.62rem)] font-semibold leading-[1.3] -tracking-[0.03em]">
                  Building <span className="headline-gradient">AI SaaS, browser extensions and automation systems</span>.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-[60ch] text-[clamp(1rem,1.35vw,1.14rem)] leading-[1.68] text-ink-muted">
                {site.description}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/#work" className={buttonVariants()}>
                  View Projects <ArrowRight />
                </Link>
                <Link href="/#resume" className={buttonVariants({ variant: 'ghost' })}>
                  <Download /> Resume
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-[26px] flex flex-wrap items-center gap-2 border-t border-line pt-[22px]">
                <span className="mb-0.5 w-full font-mono text-[10px] uppercase tracking-label text-ink-dim">
                  Currently building
                </span>
                {currentlyBuilding.map((item) => (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-[7px] rounded-full border border-line bg-[rgba(148,163,184,0.04)] px-3 py-1.5 text-[12.5px] text-ink-muted transition-colors duration-300 hover:border-[rgba(148,163,184,0.28)] hover:bg-[rgba(148,163,184,0.08)] hover:text-ink"
                  >
                    <StatusDot tone={item.tone} />
                    {item.label}
                  </span>
                ))}
              </div>

              <div className="mt-[22px] flex flex-wrap items-center gap-x-[18px] gap-y-2 text-[13px] text-ink-dim">
                <span className="inline-flex items-center gap-[7px]">
                  <Clock className="size-3.5" /> Replies within 24 hours
                </span>
                <span className="inline-flex items-center gap-[7px]">
                  <Globe className="size-3.5" /> {site.positioning}
                </span>
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
                    className="grid size-8 place-items-center rounded-[10px] border border-line bg-[rgba(148,163,184,0.04)] text-ink-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(148,163,184,0.3)] hover:bg-[rgba(148,163,184,0.09)] hover:text-ink"
                  >
                    <Icon className="size-[15px]" />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

        </div>
      </div>

      {/* Photo and laptop sit after the copy in the DOM so mobile reads copy-first. */}
      <Reveal className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[56%] max-w-[900px] max-lg:relative max-lg:mx-auto max-lg:mt-10 max-lg:w-full max-lg:max-w-[520px] max-lg:px-6">
        <Image
          src={site.portrait}
          alt={`${site.name}, software engineer working on AI automation and cybersecurity`}
          width={900}
          height={1106}
          priority
          sizes="(max-width: 1024px) 100vw, 56vw"
          className="hero-photo-mask size-full object-cover object-[50%_4%] max-lg:h-auto max-lg:aspect-[900/1106]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(46%_42%_at_62%_30%,rgba(79,125,249,0.20),transparent_72%)]"
        />
      </Reveal>

      <Reveal
        delay={0.15}
        className="absolute bottom-0 left-1/2 z-30 w-[30%] max-w-[450px] max-lg:relative max-lg:left-auto max-lg:mx-auto max-lg:-mt-[16%] max-lg:w-[82%] max-lg:max-w-[430px]"
      >
        <Laptop />
      </Reveal>
    </section>
  );
}
