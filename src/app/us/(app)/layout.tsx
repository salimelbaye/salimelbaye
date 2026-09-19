import { requireUser } from '@/lib/us/auth';
import { getPendingSignals } from '@/lib/us/queries';
import { BottomNav } from '@/components/us/bottom-nav';

/**
 * The authorization boundary for everything inside this route group.
 * requireUser() redirects to /us/sign-in when there is no valid session, and
 * every server action beneath re-checks independently — this layout is a
 * convenience, not the only gate.
 */
export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const pending = await getPendingSignals(user.id);

  return (
    <>
      {children}
      <BottomNav pendingSignals={pending.length} />
    </>
  );
}
