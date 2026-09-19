import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requirePartner, requireUser } from '@/lib/us/auth';
import { getDecision, getThoughts, getUnreadCount } from '@/lib/us/queries';
import { timeAgo } from '@/lib/us/model';
import { deleteDecisionAction, reopenDecisionAction } from '@/lib/us/actions/decisions';
import {
  Card,
  CardTitle,
  Disclosure,
  Empty,
  PageIntro,
  Pill,
  Screen,
  TopBar,
} from '@/components/us/chrome';
import { Submit } from '@/components/us/form';
import { DecideForm, ThoughtForm } from '../decision-forms';

export const metadata: Metadata = { title: 'Decision' };
export const dynamic = 'force-dynamic';

export default async function DecisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const partner = await requirePartner(user);

  const [decision, unread] = await Promise.all([getDecision(id), getUnreadCount(user.id)]);
  if (!decision) notFound();

  const thoughts = await getThoughts(decision.id);
  const mine = thoughts.find((t) => t.user_id === user.id);
  const theirs = thoughts.find((t) => t.user_id === partner.id);

  return (
    <>
      <TopBar title="Decision" back={{ href: '/us/decisions', label: 'decisions' }} unread={unread} />
      <Screen>
        <PageIntro eyebrow="Decision" title={decision.question} />

        <div className="mb-5">
          <Pill tone={decision.status === 'decided' ? 'sage' : 'rose'}>
            {decision.status === 'decided' ? 'Decided' : 'Open'}
          </Pill>
        </div>

        {decision.context ? (
          <Card className="mb-4">
            <CardTitle>Context</CardTitle>
            <p className="us-prose">{decision.context}</p>
          </Card>
        ) : null}

        {/* Our decision sits above the thinking once it exists. */}
        {decision.status === 'decided' && decision.outcome ? (
          <Card className="mb-4 border-[rgba(137,174,148,0.28)] bg-[linear-gradient(180deg,rgba(137,174,148,0.1),rgba(22,19,26,0.72))]">
            <CardTitle>Our decision</CardTitle>
            <p className="us-prose text-us-ink">{decision.outcome}</p>
            {decision.decided_at ? (
              <p className="mt-3 text-[11.5px] text-us-dim">
                Agreed {timeAgo(decision.decided_at)}
              </p>
            ) : null}
          </Card>
        ) : null}

        <Card className="mb-4">
          <CardTitle>
            {user.name}&rsquo;s thoughts
          </CardTitle>
          {mine ? (
            <>
              <p className="us-prose mb-4">{mine.body}</p>
              <Disclosure label="Edit my thoughts">
                <ThoughtForm decisionId={decision.id} initial={mine.body} />
              </Disclosure>
            </>
          ) : (
            <ThoughtForm decisionId={decision.id} />
          )}
        </Card>

        <Card className="mb-4">
          <CardTitle>{partner.name}&rsquo;s thoughts</CardTitle>
          {theirs ? (
            <>
              <p className="us-prose">{theirs.body}</p>
              <p className="mt-3 text-[11.5px] text-us-dim">{timeAgo(theirs.updated_at)}</p>
            </>
          ) : (
            <Empty>{partner.name} hasn&rsquo;t written anything here yet.</Empty>
          )}
        </Card>

        <Card className="mb-4">
          <CardTitle>
            {decision.status === 'decided' ? 'Change our decision' : 'Our decision'}
          </CardTitle>
          <DecideForm decisionId={decision.id} initial={decision.outcome} />
        </Card>

        {decision.status === 'decided' ? (
          <form action={reopenDecisionAction} className="mb-4">
            <input type="hidden" name="decision_id" value={decision.id} />
            <Submit variant="quiet" pendingLabel="Reopening…">
              Reopen this
            </Submit>
          </form>
        ) : null}

        <Disclosure label="Remove this decision">
          <form action={deleteDecisionAction}>
            <input type="hidden" name="decision_id" value={decision.id} />
            <p className="mb-3 text-[13px] leading-relaxed text-us-muted">
              This deletes the question and both sets of thoughts. It cannot be undone.
            </p>
            <Submit variant="danger" pendingLabel="Removing…">
              Remove
            </Submit>
          </form>
        </Disclosure>
      </Screen>
    </>
  );
}
