import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requirePartner, requireUser } from '@/lib/us/auth';
import { getGoal, getUnreadCount } from '@/lib/us/queries';
import {
  CATEGORY,
  GOAL_STATUS_LABEL,
  HORIZON_LABEL,
  formatDate,
  timeAgo,
} from '@/lib/us/model';
import { deleteGoalAction, setProgressAction } from '@/lib/us/actions/goals';
import {
  Card,
  CardTitle,
  Disclosure,
  PageIntro,
  Pill,
  Progress,
  Screen,
  TopBar,
} from '@/components/us/chrome';
import { Submit } from '@/components/us/form';
import { GoalForm } from '../goal-form';

export const metadata: Metadata = { title: 'Goal' };
export const dynamic = 'force-dynamic';

const STEPS = [0, 25, 50, 75, 100] as const;

export default async function GoalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const partner = await requirePartner(user);
  const [goal, unread] = await Promise.all([getGoal(id), getUnreadCount(user.id)]);
  if (!goal) notFound();

  const who =
    goal.assigned_to === 'both'
      ? 'Both of us'
      : goal.assigned_to === user.id
        ? user.name
        : partner.name;

  return (
    <>
      <TopBar title="Goal" back={{ href: '/us/life-plan', label: 'the life plan' }} unread={unread} />
      <Screen>
        <PageIntro eyebrow={HORIZON_LABEL[goal.horizon]} title={goal.title} />

        <div className="mb-5 flex flex-wrap gap-1.5">
          <Pill>
            <span aria-hidden>{CATEGORY[goal.category].icon}</span>
            {CATEGORY[goal.category].label}
          </Pill>
          <Pill tone={goal.status === 'done' ? 'sage' : 'neutral'}>
            {GOAL_STATUS_LABEL[goal.status]}
          </Pill>
          {goal.target_date ? <Pill tone="rose">{formatDate(goal.target_date)}</Pill> : null}
          <Pill>{who}</Pill>
        </div>

        {goal.description ? (
          <Card className="mb-4">
            <CardTitle>Why it matters</CardTitle>
            <p className="us-prose">{goal.description}</p>
          </Card>
        ) : null}

        <Card className="mb-4">
          <CardTitle>Progress</CardTitle>
          <Progress value={goal.progress} />
          <p className="mt-2 text-[12.5px] text-us-dim">{goal.progress}% there</p>

          <div className="mt-4 grid grid-cols-5 gap-2">
            {STEPS.map((step) => (
              <form key={step} action={setProgressAction}>
                <input type="hidden" name="id" value={goal.id} />
                <input type="hidden" name="progress" value={step} />
                <button
                  type="submit"
                  aria-label={`Set progress to ${step} percent`}
                  className={
                    goal.progress === step
                      ? 'flex h-[42px] w-full items-center justify-center rounded-[12px] bg-us-rose text-[12.5px] font-semibold text-[#231314]'
                      : 'flex h-[42px] w-full items-center justify-center rounded-[12px] border border-us-line bg-[rgba(236,220,216,0.04)] text-[12.5px] text-us-muted transition-colors hover:bg-[rgba(236,220,216,0.08)]'
                  }
                >
                  {step}%
                </button>
              </form>
            ))}
          </div>
        </Card>

        <div className="mb-4">
          <Disclosure label="Edit this goal">
            <GoalForm
              mode="edit"
              people={{
                both: 'both',
                me: { id: user.id, name: user.name },
                partner: { id: partner.id, name: partner.name },
              }}
              defaults={goal}
            />
          </Disclosure>
        </div>

        <p className="mb-5 text-center text-[12px] text-us-dim">
          Added by {goal.created_by === user.id ? 'you' : goal.creator_name} ·{' '}
          {timeAgo(goal.created_at)}
        </p>

        <Disclosure label="Remove this goal">
          <form action={deleteGoalAction}>
            <input type="hidden" name="id" value={goal.id} />
            <p className="mb-3 text-[13px] leading-relaxed text-us-muted">
              This deletes the goal for both of you. It cannot be undone.
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
