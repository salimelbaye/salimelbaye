import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/us/auth';
import { getNotifications } from '@/lib/us/queries';
import { timeAgo } from '@/lib/us/model';
import { markAllReadAction } from '@/lib/us/actions/notifications';
import { Card, Empty, PageIntro, Screen, TopBar } from '@/components/us/chrome';
import { Submit } from '@/components/us/form';

export const metadata: Metadata = { title: 'Notifications' };
export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const user = await requireUser();
  const items = await getNotifications(user.id);
  const unread = items.filter((n) => !n.read_at).length;

  return (
    <>
      <TopBar title="Notifications" back={{ href: '/us', label: 'home' }} />
      <Screen>
        <PageIntro
          eyebrow="Notifications"
          title="What happened"
          lead="Everything worth knowing, nothing that buzzes for no reason."
        />

        {unread > 0 ? (
          <form action={markAllReadAction} className="mb-4">
            <Submit variant="quiet" pendingLabel="Clearing…">
              Mark all as read
            </Submit>
          </form>
        ) : null}

        <Card>
          {items.length === 0 ? (
            <Empty>Nothing yet.</Empty>
          ) : (
            <ul className="-my-1 divide-y divide-us-line">
              {items.map((n) => {
                const content = (
                  <>
                    <span className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className={
                          n.read_at
                            ? 'mt-[7px] size-[6px] shrink-0 rounded-full bg-transparent'
                            : 'mt-[7px] size-[6px] shrink-0 rounded-full bg-us-rose'
                        }
                      />
                      <span className="min-w-0 flex-1">
                        <span
                          className={
                            n.read_at
                              ? 'block text-[14px] leading-snug text-us-muted'
                              : 'block text-[14px] font-medium leading-snug text-us-ink'
                          }
                        >
                          {n.title}
                        </span>
                        {n.body ? (
                          <span className="mt-0.5 block text-[12.5px] leading-snug text-us-dim">
                            {n.body}
                          </span>
                        ) : null}
                        <span className="mt-1 block text-[11.5px] text-us-dim">
                          {timeAgo(n.created_at)}
                        </span>
                      </span>
                    </span>
                  </>
                );
                return (
                  <li key={n.id} className="py-3">
                    {n.href ? (
                      <Link href={n.href} className="block">
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </Screen>
    </>
  );
}
