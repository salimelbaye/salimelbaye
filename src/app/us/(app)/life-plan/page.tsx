import type { Metadata } from 'next';
import Link from 'next/link';
import { requirePartner, requireUser } from '@/lib/us/auth';
import { getGoals, getUnreadCount } from '@/lib/us/queries';
import {
  CATEGORY,
  GOAL_STATUS_LABEL,
  HORIZONS,
  HORIZON_LABEL,
  formatDate,
} from '@/lib/us/model';
import {
  Disclosure,
  Empty,
  PageIntro,
  Pill,
  Progress,
  Screen,
  TopBar,
} from '@/components/us/chrome';
import { GoalForm } from './goal-form';

export const metadata: Metadata = { title: 'Our life plan' };
export const dynamic = 'force-dynamic';

export default async function LifePlanPage() {
  const user = await requireUser();
  const partner = await requirePartner(user);
  const [goals, unread] = await Promise.all([getGoals(), getUnreadCount(user.id)]);

  const people = {
    both: 'both',
    me: { id: user.id, name: user.name },
    partner: { id: partner.id, name: partner.name },
  };

  const done = goals.filter((g) => g.status === 'done').length;

  return (
    <>
      <TopBar title="Our life plan" back={{ href: '/us/together', label: 'Us' }} unread={unread} />
      <Screen>
        <PageIntro
          eyebrow="Life plan"
          title="What we are building"
          lead={
            goals.length
              ? `${goals.length} goal${goals.length === 1 ? '' : 's'}, ${done} reached.`
              : 'Start with one thing you both want.'
          }
        />

        <div className="mb-6">
          <Disclosure label="Add a goal">
            <GoalForm mode="create" people={people} />
          </Disclosure>
        </div>

        {goals.length === 0 ? (
          <Empty>Nothing here yet. The first goal is usually the smallest one.</Empty>
        ) : (
          <div className="space-y-8">
            {HORIZONS.map((horizon) => {
              const slice = goals.filter((g) => g.horizon === horizon);
              if (slice.length === 0) return null;
              return (
                <section key={horizon}>
                  <div className="mb-3 flex items-baseline justify-between gap-3">
                    <h2 className="us-eyebrow">{HORIZON_LABEL[horizon]}</h2>
                    <span className="text-[11.5px] text-us-dim">{slice.length}</span>
                  </div>
                  <ul className="space-y-2.5">
                    {slice.map((goal) => {
                      const who =
                        goal.assigned_to === 'both'
                          ? 'Both of us'
                          : goal.assigned_to === user.id
                            ? user.name
                            : partner.name;
                      return (
                        <li key={goal.id}>
                          <Link
                            href={`/us/life-plan/${goal.id}`}
                            className="us-surface block p-4 transition-[border-color,background-color] duration-200 hover:border-us-line-strong hover:bg-[rgba(236,220,216,0.04)]"
                          >
                            <div className="flex items-start gap-3">
                              <span aria-hidden className="mt-px text-[15px]">
                                {CATEGORY[goal.category].icon}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p
                                  className={
                                    goal.status === 'done'
                                      ? 'text-[15px] font-medium leading-snug text-us-muted line-through decoration-us-dim'
                                      : 'text-[15px] font-medium leading-snug text-us-ink'
                                  }
                                >
                                  {goal.title}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                  {goal.target_date ? (
                                    <Pill tone={goal.status === 'done' ? 'neutral' : 'rose'}>
                                      {formatDate(goal.target_date)}
                                    </Pill>
                                  ) : null}
                                  <Pill tone={goal.status === 'done' ? 'sage' : 'neutral'}>
                                    {GOAL_STATUS_LABEL[goal.status]}
                                  </Pill>
                                  <Pill>{who}</Pill>
                                </div>
                                {goal.progress > 0 && goal.status !== 'done' ? (
                                  <div className="mt-3">
                                    <Progress value={goal.progress} />
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </Screen>
    </>
  );
}
