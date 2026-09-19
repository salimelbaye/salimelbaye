import type { Metadata } from 'next';
import Link from 'next/link';
import { Wordmark } from '@/components/us/wordmark';
import { SignInForm } from './sign-in-form';
import { redirectIfSignedIn } from '../actions';

export const metadata: Metadata = { title: 'Enter' };
export const dynamic = 'force-dynamic';

export default async function SignInPage() {
  await redirectIfSignedIn();

  return (
    <div className="animate-us-rise">
      <Wordmark tagline className="mb-10" />
      <SignInForm />
      <p className="mt-8 text-center text-[12.5px] text-us-dim">
        First time here?{' '}
        <Link href="/us/claim" className="text-us-muted underline underline-offset-4">
          Set up your account
        </Link>
      </p>
    </div>
  );
}
