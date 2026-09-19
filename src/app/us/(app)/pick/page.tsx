import type { Metadata } from 'next';
import { X } from 'lucide-react';
import { requireUser } from '@/lib/us/auth';
import { getActivities, getLastPick, getUnreadCount } from '@/lib/us/queries';
import { pickAction, removeActivityAction } from '@/lib/us/actions/pick';
import { timeAgo } from '@/lib/us/model';
import { Card, CardTitle, Disclosure, Empty, PageIntro, Screen, TopBar } from '@/components/us/chrome';
import { Submit } from '@/components/us/form';
import { AddActivityForm } from './add-activity-form';

export const metadata: Metadata = { title: 'Pick for us' };
export const dynamic = 'force-dynamic';

export default async function PickPage() {
  const user = await requireUser();
  const [activities, last, unread] = await Promise.all([
    getActivities(),
    getLastPick(),
    getUnreadCount(user.id),
  ]);

  return (
    <>
      <TopBar title="Pick for us" back={{ href: '/us/plans', label: 'plans' }} unread={unread} />
      <Screen>
        <PageIntro
          eyebrow="Pick for us"
          title="Let it decide"
          lead="One tap, one answer. No negotiating."
        />

        <Card className="mb-5 text-center">
          {last ? (
            <div key={last.id} className="animate-us-seal py-4">
              <p className="us-eyebrow mb-3 justify-center">Tonight</p>
              <p className="font-display text-[1.9rem] leading-[1.18] text-us-ink">{last.label}</p>
              <p className="mt-3 text-[12px] text-us-dim">
                Drawn by {last.picked_by_name} · {timeAgo(last.created_at)}
              </p>
            </div>
          ) : (
            <div className="py-6">
              <p className="font-display text-[1.6rem] leading-snug text-us-muted">
                Nothing drawn yet.
              </p>
            </div>
          )}

          <form action={pickAction} className="mt-4">
            <Submit pendingLabel="Choosing…">🎲 Pick for us</Submit>
          </form>
        </Card>

        <div className="mb-5">
          <Disclosure label="Add an activity">
            <AddActivityForm />
          </Disclosure>
        </div>

        <Card>
          <CardTitle>
            What it can choose from
          </CardTitle>
          {activities.length === 0 ? (
            <Empty>
              The list is empty. Press “Pick for us” once and we’ll start you off with a few.
            </Empty>
          ) : (
            <ul className="-my-1 divide-y divide-us-line">
              {activities.map((activity) => (
                <li key={activity.id} className="flex items-center gap-3 py-2.5">
                  <span className="min-w-0 flex-1 text-[14px] text-us-ink">{activity.label}</span>
                  <form action={removeActivityAction}>
                    <input type="hidden" name="id" value={activity.id} />
                    <button
                      type="submit"
                      className="flex size-9 items-center justify-center rounded-full text-us-dim transition-colors hover:text-[#E7A0A0]"
                    >
                      <X size={15} aria-hidden />
                      <span className="sr-only">Remove {activity.label}</span>
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Screen>
    </>
  );
}
