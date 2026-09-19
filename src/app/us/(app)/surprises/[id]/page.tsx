import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Lock } from 'lucide-react';
import { requireUser } from '@/lib/us/auth';
import { getSurprise, getUnreadCount } from '@/lib/us/queries';
import { SURPRISE_KIND_LABEL, formatDate, timeAgo } from '@/lib/us/model';
import { deleteSurpriseAction, openSurpriseAction } from '@/lib/us/actions/sealed';
import { Card, Disclosure, Pill, Screen, TopBar } from '@/components/us/chrome';
import { Submit } from '@/components/us/form';

export const metadata: Metadata = { title: 'Surprise' };
export const dynamic = 'force-dynamic';

const pad = (n: number) => String(n).padStart(3, '0');

export default async function SurprisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const [surprise, unread] = await Promise.all([
    getSurprise(id, user.id),
    getUnreadCount(user.id),
  ]);
  // getSurprise already scopes to rows this account is party to.
  if (!surprise) notFound();

  const isAuthor = surprise.author_id === user.id;
  const notYet = surprise.unlock_at !== null && surprise.unlock_at > Date.now();

  return (
    <>
      <TopBar title={`#${pad(surprise.number)}`} back={{ href: '/us/surprises', label: 'surprises' }} unread={unread} />
      <Screen>
        <div className="mb-6 animate-us-rise text-center">
          <p className="us-eyebrow justify-center">Surprise #{pad(surprise.number)}</p>
          <h1 className="mt-3 font-display text-[2.05rem] leading-[1.13] text-us-ink">
            {surprise.title}
          </h1>
          <div className="mt-4 flex justify-center gap-1.5">
            <Pill>{SURPRISE_KIND_LABEL[surprise.kind]}</Pill>
            {surprise.opened_at ? (
              <Pill tone="sage">Opened {timeAgo(surprise.opened_at)}</Pill>
            ) : (
              <Pill tone="amber">Sealed</Pill>
            )}
          </div>
        </div>

        {surprise.body !== null ? (
          <Card className="mb-5 animate-us-seal">
            <p className="us-prose text-[15.5px] text-us-ink">{surprise.body}</p>
            {isAuthor && !surprise.opened_at ? (
              <p className="mt-4 border-t border-us-line pt-3 text-[12px] text-us-dim">
                You wrote this. It stays unreadable to them until they open it.
              </p>
            ) : null}
          </Card>
        ) : (
          <Card className="mb-5 text-center">
            <Lock size={22} className="mx-auto mb-3 text-us-amber" aria-hidden />
            {notYet && surprise.unlock_at ? (
              <>
                <p className="text-[14.5px] text-us-ink">Not yet.</p>
                <p className="mt-1.5 text-[13px] text-us-muted">
                  This one unlocks on{' '}
                  {formatDate(new Date(surprise.unlock_at).toISOString().slice(0, 10))}.
                </p>
              </>
            ) : (
              <>
                <p className="text-[14.5px] text-us-ink">
                  {surprise.author_name} left this for you.
                </p>
                <form action={openSurpriseAction} className="mt-4">
                  <input type="hidden" name="id" value={surprise.id} />
                  <Submit pendingLabel="Opening…">Open it</Submit>
                </form>
              </>
            )}
          </Card>
        )}

        {isAuthor ? (
          <Disclosure label="Withdraw this surprise">
            <form action={deleteSurpriseAction}>
              <input type="hidden" name="id" value={surprise.id} />
              <p className="mb-3 text-[13px] leading-relaxed text-us-muted">
                This deletes it permanently.
              </p>
              <Submit variant="danger" pendingLabel="Removing…">
                Withdraw
              </Submit>
            </form>
          </Disclosure>
        ) : null}
      </Screen>
    </>
  );
}
