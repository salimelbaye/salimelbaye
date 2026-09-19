'use server';

import { redirect } from 'next/navigation';
import { bootstrapUsers, claimAccount, signIn } from '@/lib/us/auth';
import { getSessionUser } from '@/lib/us/session';
import {
  ValidationError,
  email as parseEmail,
  password as parsePassword,
  secret as parseSecret,
  str,
} from '@/lib/us/validate';

export type AuthFormState = { error: string } | null;

/**
 * Next validates Origin against Host for every Server Action before this code
 * runs, which is what protects these endpoints from cross-site submission.
 */
export async function signInAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  let ok = false;
  try {
    await bootstrapUsers();
    const address = parseEmail(formData.get('email'));
    const secret = parseSecret(formData.get('password'), 'Password');
    const result = await signIn(address, secret);
    if (!result.ok) return { error: result.message };
    ok = true;
  } catch (error) {
    if (error instanceof ValidationError) return { error: error.message };
    console.error('signInAction', error);
    return { error: 'Something went wrong. Please try again.' };
  }
  // redirect() throws a control-flow signal, so it must sit outside the catch.
  if (ok) redirect('/us');
  return null;
}

export async function claimAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  let ok = false;
  try {
    await bootstrapUsers();
    const address = parseEmail(formData.get('email'));
    const token = str(formData.get('token'), 'Setup code', { min: 8, max: 200 });
    const secret = parsePassword(formData.get('password'));
    const confirm = String(formData.get('confirm') ?? '');
    if (secret !== confirm) return { error: 'Those two passwords do not match.' };

    const result = await claimAccount(address, token, secret);
    if (!result.ok) return { error: result.message };
    ok = true;
  } catch (error) {
    if (error instanceof ValidationError) return { error: error.message };
    console.error('claimAction', error);
    return { error: 'Something went wrong. Please try again.' };
  }
  if (ok) redirect('/us');
  return null;
}

/** Used by the sign-in page to bounce an already-authenticated visitor. */
export async function redirectIfSignedIn(): Promise<void> {
  if (await getSessionUser()) redirect('/us');
}
