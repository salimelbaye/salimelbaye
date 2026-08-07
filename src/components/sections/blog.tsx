import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { posts } from '@/lib/site';
import { Card } from '@/components/ui/card';
import { Section, SectionHead } from '@/components/shared/section';
import { Reveal } from '@/components/shared/reveal';
import { buttonVariants } from '@/components/ui/button';

const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });

export function Blog() {
  return (
    <Section id="blog" tight>
      <Reveal>
        <SectionHead
          eyebrow="Writing"
          title="Notes from building."
          action={
            <Link href="/blog" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              All articles
            </Link>
          }
        />
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={0.07 * i}>
            <Card className="h-full">
              <Link href={`/blog/${post.slug}`} className="flex h-full min-h-[230px] flex-col gap-3 p-7">
                <div className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-dim">
                  <span>{post.category}</span>
                  <span aria-hidden>·</span>
                  <time dateTime={post.date}>{fmt.format(new Date(post.date))}</time>
                </div>
                <h3 className="text-[1.02rem] font-bold leading-[1.34] -tracking-[0.015em]">{post.title}</h3>
                <p className="text-[14.5px] leading-[1.62] text-ink-muted">{post.excerpt}</p>
                <span className="mt-auto flex items-center gap-[7px] text-[12.5px] text-ink-dim">
                  {post.readingTime}
                  <ArrowUpRight className="size-3.5" />
                </span>
              </Link>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
