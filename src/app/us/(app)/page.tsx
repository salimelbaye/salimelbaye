import Link from 'next/link';
import { ArrowRight, Dices, Sparkles } from 'lucide-react';
import { requirePartner, requireUser } from '@/lib/us/auth';
import {
  getHomeSummary,
  getPendingSignals,
  getPriorities,
  getUnreadCount,
} from '@/lib/us/queries';
import { CATEGORY, SIGNAL, currentMonth, formatDate, timeAgo } from '@/lib/us/model';
import { Card, CardTitle, Empty, Pill, Screen, TopBar } from '@/components/us/chrome';
import { AcknowledgeButton, QuickSignals } from '@/components/us/signal-buttons';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const user = await requireUser();
  const partner = await requirePartner(user);
  const month = currentMonth();

  const [pending, summary, priorities, unread] = await Promise.all([
    getPendingSignals(user.id),
    getHomeSummary(user.id),
    getPriorities(month),
    getUnreadCount(user.id),
  ]);

  const openPriorities = priorities.filter((p) => !p.done_at);

  return (
    <>
      <TopBar unread={unread} />
      <Screen>
        <h1 className="sr-only">Hajar and Salim — our little world</h1>

        {/* Waiting signals come first — this is the one thing that cannot wait. */}
        {pending.length > 0 ? (
          <section className="mb-5 animate-us-rise space-y-2.5">
            {pending.slice(0, 3).map((signal) => (
              <div
                key={signal.id}
                className="us-surface flex items-center gap-3 border-[rgba(208,140,134,0.3)] bg-[linear-gradient(180deg,rgba(208,140,134,0.14),rgba(22,19,26,0.72))] p-4"
              >
                <span
                  aria-hidden
                  className="mt-0.5 size-2 shrink-0 animate-us-pulse rounded-full bg-us-rose"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium leading-snug text-us-ink">
                    {signal.from_name} {SIGNAL[signal.kind].received}{' '}
                    <span aria-hidden>{SIGNAL[signal.kind].icon}</span>
                  </p>
                  <p className="mt-0.5 text-[12px] text-us-muted">{timeAgo(signal.created_at)}</p>
                </div>
                <AcknowledgeButton signalId={signal.id} />
              </div>
            ))}
            {pending.length > 3 ? (
              <Link
                href="/us/signals"
                className="block text-center text-[12.5px] text-us-muted underline underline-offset-4"
              >
                {pending.length - 3} more waiting
              </Link>
            ) : null}
          </section>
        ) : null}

        {/* How are we? */}
        <Card className="mb-4 animate-us-rise">
          <CardTitle>How are we?</CardTitle>
          <p className="font-display text-[1.3rem] leading-[1.3] text-us-ink">
            {pending.length > 0
              ? `${partner.name} is waiting for you.`
              : summary.lastSignal
                ? summary.lastSignal.mine
                  ? `You reached for ${partner.name} ${timeAgo(summary.lastSignal.created_at)}.`
                  : `${partner.name} reached for you ${timeAgo(summary.lastSignal.created_at)}.`
                : 'Nothing sent yet. Start below.'}
          </p>

          <dl className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: 'Signals · 7d', value: summary.signalsThisWeek },
              { label: 'Plans open', value: summary.openPlans },
              { label: 'Goals live', value: summary.activeGoals },
            ].map((stat) => (
              <div key={stat.label} className="us-inset rounded-[13px] px-3 py-2.5">
                <dd className="font-display text-[1.45rem] leading-none text-us-ink">
                  {stat.value}
                </dd>
                <dt className="mt-1.5 text-[10.5px] uppercase tracking-[0.11em] text-us-dim">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </Card>

        {/* Quick actions */}
        <Card className="mb-4 animate-us-rise">
          <CardTitle>
            Send {partner.name} a signal
          </CardTitle>
          <QuickSignals />
        </Card>

        {/* Next plan */}
        <Card className="mb-4 animate-us-rise">
          <CardTitle
            action={
              <Link href="/us/life-plan" className="text-[12px] text-us-muted hover:text-us-ink">
                Life plan
              </Link>
            }
          >
            Next plan
          </CardTitle>
          {summary.nextDated ? (
            <Link href={`/us/life-plan/${summary.nextDated.id}`} className="block">
              <p className="text-[15.5px] font-medium leading-snug text-us-ink">
                {summary.nextDated.title}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <Pill tone="rose">{formatDate(summary.nextDated.target_date)}</Pill>
                <Pill>
                  <span aria-hidden>{CATEGORY[summary.nextDated.category].icon}</span>
                  {CATEGORY[summary.nextDated.category].label}
                </Pill>
              </div>
            </Link>
          ) : (
            <Empty>
              Nothing has a date yet.{' '}
              <Link href="/us/life-plan" className="underline underline-offset-4">
                Give something a date
              </Link>
              .
            </Empty>
          )}
        </Card>

        {/* This month */}
        <Card className="mb-4 animate-us-rise">
          <CardTitle
            action={
              <Link href="/us/this-month" className="text-[12px] text-us-muted hover:text-us-ink">
                Edit
              </Link>
            }
          >
            Our priorities this month
          </CardTitle>
          {openPriorities.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {openPriorities.map((p) => (
                <li key={p.id}>
                  <Pill>
                    {p.icon ? <span aria-hidden>{p.icon}</span> : null}
                    {p.label}
                  </Pill>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>
              <Link href="/us/this-month" className="underline underline-offset-4">
                Choose a few priorities
              </Link>{' '}
              for this month.
            </Empty>
          )}
        </Card>

        {/* Upcoming goals */}
        <Card className="mb-4 animate-us-rise">
          <CardTitle
            action={
              <Link href="/us/life-plan" className="text-[12px] text-us-muted hover:text-us-ink">
                All
              </Link>
            }
          >
            What we are building
          </CardTitle>
          {summary.upcoming.length > 0 ? (
            <ul className="space-y-2.5">
              {summary.upcoming.map((goal) => (
                <li key={goal.id}>
                  <Link
                    href={`/us/life-plan/${goal.id}`}
                    className="us-inset flex items-center gap-3 rounded-[13px] px-3.5 py-3 transition-colors hover:bg-[rgba(236,220,216,0.06)]"
                  >
                    <span aria-hidden className="text-[15px]">
                      {CATEGORY[goal.category].icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] text-us-ink">{goal.title}</span>
                      {goal.target_date ? (
                        <span className="mt-0.5 block text-[12px] text-us-dim">
                          {formatDate(goal.target_date)}
                        </span>
                      ) : null}
                    </span>
                    <ArrowRight size={15} className="shrink-0 text-us-dim" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>
              <Link href="/us/life-plan" className="underline underline-offset-4">
                Add your first shared goal
              </Link>
              .
            </Empty>
          )}
        </Card>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href="/us/pick"
            className="us-surface flex min-h-[64px] items-center gap-3 px-4 transition-colors hover:bg-[rgba(236,220,216,0.05)]"
          >
            <Dices size={18} className="shrink-0 text-us-rose" aria-hidden />
            <span className="text-[14px] text-us-ink">Pick for us</span>
          </Link>
          <Link
            href="/us/surprises"
            className="us-surface flex min-h-[64px] items-center gap-3 px-4 transition-colors hover:bg-[rgba(236,220,216,0.05)]"
          >
            <Sparkles size={18} className="shrink-0 text-us-amber" aria-hidden />
            <span className="text-[14px] text-us-ink">Surprises</span>
          </Link>
        </div>
      </Screen>
    </>
  );
}
