import type { Metadata } from 'next';
import { CalendarRange, Dices, Lock, Bell, ShieldCheck } from 'lucide-react';
import { requirePartner, requireUser } from '@/lib/us/auth';
import { getUnreadCount } from '@/lib/us/queries';
import { signOutAction } from '@/lib/us/actions/account';
import { Card, CardTitle, NavRow, PageIntro, Screen, TopBar } from '@/components/us/chrome';
import { Submit } from '@/components/us/form';
import { ChangePasswordForm } from './change-password-form';

export const metadata: Metadata = { title: 'More' };
export const dynamic = 'force-dynamic';

export default async function MorePage() {
  const user = await requireUser();
  const partner = await requirePartner(user);
  const unread = await getUnreadCount(user.id);

  return (
    <>
      <TopBar title="More" unread={unread} />
      <Screen>
        <PageIntro eyebrow="More" title="Everything else" />

        <div className="mb-5 space-y-2.5">
          <NavRow
            href="/us/this-month"
            icon={<CalendarRange size={17} aria-hidden />}
            title="This month"
            meta="Our priorities right now"
          />
          <NavRow
            href="/us/pick"
            icon={<Dices size={17} aria-hidden />}
            title="Pick for us"
            meta="Let it choose"
          />
          <NavRow
            href="/us/open-when"
            icon={<Lock size={17} aria-hidden />}
            title="Open when…"
            meta="Sealed notes"
          />
          <NavRow
            href="/us/notifications"
            icon={<Bell size={17} aria-hidden />}
            title="Notifications"
            badge={unread}
          />
        </div>

        <Card className="mb-5">
          <CardTitle>Account</CardTitle>
          <dl className="space-y-2.5 text-[13.5px]">
            <div className="flex justify-between gap-4">
              <dt className="text-us-dim">You</dt>
              <dd className="truncate text-us-ink">{user.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-us-dim">Email</dt>
              <dd className="truncate text-us-muted">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-us-dim">Paired with</dt>
              <dd className="truncate text-us-ink">{partner.name}</dd>
            </div>
          </dl>
        </Card>

        <Card className="mb-5">
          <CardTitle>Change password</CardTitle>
          <ChangePasswordForm />
        </Card>

        <Card className="mb-5">
          <CardTitle>Privacy</CardTitle>
          <p className="flex gap-2.5 text-[13px] leading-relaxed text-us-muted">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-us-sage" aria-hidden />
            <span>
              This area is signed-in only, excluded from search engines, and never shared with
              anyone else. Only the two of us have accounts.
            </span>
          </p>
        </Card>

        <form action={signOutAction}>
          <Submit variant="danger" pendingLabel="Signing out…">
            Sign out
          </Submit>
        </form>
      </Screen>
    </>
  );
}
