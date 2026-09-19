import type { Metadata } from 'next';
import { BookHeart, Heart, Scale, Target } from 'lucide-react';
import { requirePartner, requireUser } from '@/lib/us/auth';
import { getPendingSignals, getUnreadCount } from '@/lib/us/queries';
import { NavRow, PageIntro, Screen, TopBar } from '@/components/us/chrome';

export const metadata: Metadata = { title: 'Us' };
export const dynamic = 'force-dynamic';

export default async function TogetherPage() {
  const user = await requireUser();
  const partner = await requirePartner(user);
  const [pending, unread] = await Promise.all([
    getPendingSignals(user.id),
    getUnreadCount(user.id),
  ]);

  return (
    <>
      <TopBar title="Us" unread={unread} />
      <Screen>
        <PageIntro eyebrow="Us" title="The two of us" lead={`You and ${partner.name}.`} />
        <div className="space-y-2.5">
          <NavRow
            href="/us/signals"
            icon={<Heart size={17} aria-hidden />}
            title="I miss you"
            meta="Send a signal, answer one"
            badge={pending.length}
          />
          <NavRow
            href="/us/story"
            icon={<BookHeart size={17} aria-hidden />}
            title="Our story"
            meta="Milestones, in our words"
          />
          <NavRow
            href="/us/life-plan"
            icon={<Target size={17} aria-hidden />}
            title="Our life plan"
            meta="Now, this year, and further out"
          />
          <NavRow
            href="/us/decisions"
            icon={<Scale size={17} aria-hidden />}
            title="Our decisions"
            meta="Think it through, then decide"
          />
        </div>
      </Screen>
    </>
  );
}
