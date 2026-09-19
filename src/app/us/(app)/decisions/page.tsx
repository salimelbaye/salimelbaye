import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/us/auth';
import { getDecisions, getUnreadCount } from '@/lib/us/queries';
import { timeAgo } from '@/lib/us/model';
import { Disclosure, Empty, PageIntro, Pill, Screen, TopBar } from '@/components/us/chrome';
import { NewDecisionForm } from './decision-forms';

export const metadata: Metadata = { title: 'Our decisions' };
export const dynamic = 'force-dynamic';

export default async function DecisionsPage() {
  const user = await requireUser();
  const [decisions, unread] = await Promise.all([getDecisions(), getUnreadCount(user.id)]);

  const open = decisions.filter((d) => d.status === 'open');

  return (
    <>
      <TopBar title="Our decisions" back={{ href: '/us/together', label: 'Us' }} unread={unread} />
      <Screen>
        <PageIntro
          eyebrow="Decisions"
          title="Think it through, then decide"
          lead="Each of us writes our own side. Then we agree on one answer and it stops being a loop."
        />

        <div className="mb-6">
          <Disclosure label="Open a decision">
            <NewDecisionForm />
          </Disclosure>
        </div>

        {decisions.length === 0 ? (
          <Empty>
            Nothing open. Good questions to start with: where we want to live, what we are saving
            for, what this year is really about.
          </Empty>
        ) : (
          <ul className="space-y-2.5">
            {decisions.map((decision) => (
              <li key={decision.id}>
                <Link
                  href={`/us/decisions/${decision.id}`}
                  className="us-surface block p-4 transition-[border-color,background-color] duration-200 hover:border-us-line-strong hover:bg-[rgba(236,220,216,0.04)]"
                >
                  <p className="font-display text-[1.15rem] leading-snug text-us-ink">
                    {decision.question}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <Pill tone={decision.status === 'decided' ? 'sage' : 'rose'}>
                      {decision.status === 'decided' ? 'Decided' : 'Open'}
                    </Pill>
                    <span className="text-[11.5px] text-us-dim">
                      {timeAgo(decision.updated_at)}
                    </span>
                  </div>
                  {decision.status === 'decided' && decision.outcome ? (
                    <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-us-muted">
                      {decision.outcome}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {open.length > 0 ? (
          <p className="mt-6 text-center text-[12px] text-us-dim">
            {open.length} still open.
          </p>
        ) : null}
      </Screen>
    </>
  );
}
