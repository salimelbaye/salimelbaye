import type { Metadata } from 'next';
import Link from 'next/link';
import { Dices } from 'lucide-react';
import { requireUser } from '@/lib/us/auth';
import { getPlans, getUnreadCount } from '@/lib/us/queries';
import { Card, CardTitle, Disclosure, Empty, PageIntro, Screen, TopBar } from '@/components/us/chrome';
import { PlanItem } from '@/components/us/plan-item';
import { AddPlanForm } from './add-plan-form';

export const metadata: Metadata = { title: 'Our plans' };
export const dynamic = 'force-dynamic';

export default async function PlansPage() {
  const user = await requireUser();
  const [plans, unread] = await Promise.all([getPlans(), getUnreadCount(user.id)]);

  const open = plans.filter((p) => !p.done_at);
  const done = plans.filter((p) => p.done_at);

  return (
    <>
      <TopBar title="Our plans" unread={unread} />
      <Screen>
        <PageIntro
          eyebrow="Plans"
          title="Things to do together"
          lead={
            plans.length
              ? `${done.length} of ${plans.length} done.`
              : 'Small things count as much as big ones.'
          }
        />

        <div className="mb-6">
          <Disclosure label="Add something">
            <AddPlanForm />
          </Disclosure>
        </div>

        <Card className="mb-4">
          <CardTitle>To do</CardTitle>
          {open.length === 0 ? (
            <Empty>Nothing waiting. Add an idea above.</Empty>
          ) : (
            <ul className="-my-1 divide-y divide-us-line">
              {open.map((plan) => (
                <li key={plan.id}>
                  <PlanItem id={plan.id} title={plan.title} note={plan.note} done={false} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        {done.length > 0 ? (
          <Card className="mb-4">
            <CardTitle>Done</CardTitle>
            <ul className="-my-1 divide-y divide-us-line">
              {done.map((plan) => (
                <li key={plan.id}>
                  <PlanItem
                    id={plan.id}
                    title={plan.title}
                    note={plan.note}
                    done
                    doneBy={plan.done_by === user.id ? 'you' : plan.done_by_name}
                  />
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        <Link
          href="/us/pick"
          className="us-surface flex min-h-[64px] items-center gap-3 px-4 transition-colors hover:bg-[rgba(236,220,216,0.05)]"
        >
          <Dices size={18} className="shrink-0 text-us-rose" aria-hidden />
          <span className="text-[14px] text-us-ink">Can&rsquo;t decide? Pick for us</span>
        </Link>
      </Screen>
    </>
  );
}
