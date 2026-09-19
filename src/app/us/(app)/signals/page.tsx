import type { Metadata } from 'next';
import { requirePartner, requireUser } from '@/lib/us/auth';
import { getSignalHistory, getUnreadCount } from '@/lib/us/queries';
import { SIGNAL, timeAgo } from '@/lib/us/model';
import { Card, CardTitle, Empty, PageIntro, Screen, TopBar } from '@/components/us/chrome';
import { AcknowledgeButton, MoreSignals } from '@/components/us/signal-buttons';

export const metadata: Metadata = { title: 'Signals' };
export const dynamic = 'force-dynamic';

export default async function SignalsPage() {
  const user = await requireUser();
  const partner = await requirePartner(user);
  const [history, unread] = await Promise.all([
    getSignalHistory(user.id),
    getUnreadCount(user.id),
  ]);

  return (
    <>
      <TopBar title="I miss you" back={{ href: '/us/together', label: 'Us' }} unread={unread} />
      <Screen>
        <PageIntro
          eyebrow="Signals"
          title="Say it in one tap"
          lead={`A signal is a moment, not a conversation. ${partner.name} sees it straight away.`}
        />

        <Card className="mb-5">
          <CardTitle>Send</CardTitle>
          <MoreSignals />
        </Card>

        <Card>
          <CardTitle>Between us</CardTitle>
          {history.length === 0 ? (
            <Empty>Nothing yet. The first one is always the hardest.</Empty>
          ) : (
            <ul className="-my-1 divide-y divide-us-line">
              {history.map((signal) => {
                const mine = signal.from_user_id === user.id;
                const waiting = !mine && !signal.acknowledged_at;
                return (
                  <li key={signal.id} className="flex items-center gap-3 py-3">
                    <span aria-hidden className="w-5 shrink-0 text-center text-[14px]">
                      {SIGNAL[signal.kind].icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] leading-snug text-us-ink">
                        {mine ? 'You' : signal.from_name} {SIGNAL[signal.kind].received}
                      </span>
                      <span className="mt-0.5 block text-[11.5px] text-us-dim">
                        {timeAgo(signal.created_at)}
                        {signal.acknowledged_at ? ' · answered' : mine ? ' · waiting' : ''}
                      </span>
                    </span>
                    {waiting ? <AcknowledgeButton signalId={signal.id} /> : null}
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
