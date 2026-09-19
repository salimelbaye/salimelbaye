import type { Metadata } from 'next';
import { requireUser } from '@/lib/us/auth';
import { getTimeline, getUnreadCount } from '@/lib/us/queries';
import { formatDate } from '@/lib/us/model';
import { deleteMilestoneAction } from '@/lib/us/actions/story';
import { Disclosure, Empty, PageIntro, Screen, TopBar } from '@/components/us/chrome';
import { AddMilestoneForm } from './add-milestone-form';

export const metadata: Metadata = { title: 'Our story' };
export const dynamic = 'force-dynamic';

export default async function StoryPage() {
  const user = await requireUser();
  const [events, unread] = await Promise.all([getTimeline(), getUnreadCount(user.id)]);

  return (
    <>
      <TopBar title="Our story" back={{ href: '/us/together', label: 'Us' }} unread={unread} />
      <Screen>
        <PageIntro
          eyebrow="Our story"
          title="How we got here"
          lead="Written down, so it survives being forgotten."
        />

        <div className="mb-8">
          <Disclosure label="Add a milestone">
            <AddMilestoneForm />
          </Disclosure>
        </div>

        {events.length === 0 ? (
          <Empty>Nothing written yet. Start with the day it began.</Empty>
        ) : (
          <ol className="relative space-y-7 pl-6">
            {/* The spine. Fades at both ends so it never looks cut off. */}
            <span
              aria-hidden
              className="absolute bottom-2 left-[5px] top-2 w-px bg-[linear-gradient(180deg,transparent,rgba(208,140,134,0.38)_12%,rgba(208,140,134,0.38)_88%,transparent)]"
            />
            {events.map((event) => (
              <li key={event.id} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-6 top-[7px] size-[11px] rounded-full border-2 border-us-bg bg-us-rose"
                />
                <p className="us-eyebrow mb-1.5">{formatDate(event.event_date)}</p>
                <h2 className="font-display text-[1.32rem] leading-[1.22] text-us-ink">
                  {event.title}
                </h2>
                {event.description ? (
                  <p className="us-prose mt-2">{event.description}</p>
                ) : null}
                <div className="mt-2.5 flex items-center gap-3">
                  <span className="text-[11.5px] text-us-dim">
                    Added by {event.created_by === user.id ? 'you' : event.creator_name}
                  </span>
                  <form action={deleteMilestoneAction}>
                    <input type="hidden" name="id" value={event.id} />
                    <button
                      type="submit"
                      className="rounded-full px-2 py-1 text-[11.5px] text-us-dim transition-colors hover:text-[#E7A0A0]"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Screen>
    </>
  );
}
