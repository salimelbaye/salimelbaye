import type { Metadata } from 'next';
import Link from 'next/link';
import { Wordmark } from '@/components/us/wordmark';
import { ClaimForm } from './claim-form';
import { redirectIfSignedIn } from '../actions';

export const metadata: Metadata = { title: 'Set up' };
export const dynamic = 'force-dynamic';

export default async function ClaimPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  await redirectIfSignedIn();
  const { code } = await searchParams;

  return (
    <div className="animate-us-rise">
      <Wordmark className="mb-3" />
      <p className="mb-9 text-center text-[14px] leading-relaxed text-us-muted">
        Set your password once. Only the two of us have a setup code.
      </p>
      <ClaimForm presetToken={typeof code === 'string' ? code.slice(0, 200) : undefined} />
      <p className="mt-8 text-center text-[12.5px] text-us-dim">
        Already set up?{' '}
        <Link href="/us/sign-in" className="text-us-muted underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
